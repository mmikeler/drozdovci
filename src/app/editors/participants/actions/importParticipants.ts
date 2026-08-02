"use server";

import { prisma } from "@/lib/prisma";
import { rankLabels } from "@/lib/ranks";
import * as XLSX from "xlsx";
import type { Prisma } from "@/generated/prisma/client";
import type { UserRank } from "@/generated/prisma/enums";

interface ImportResult {
  imported: number;
  duplicates: number;
  errors: string[];
}

function normalizeRank(rankStr: string): UserRank | null {
  const lower = rankStr.trim().toLowerCase();
  // Direct match by label (key is UserRank enum, value is russian label)
  for (const [key, label] of Object.entries(rankLabels)) {
    if (label.toLowerCase() === lower) return key as UserRank;
  }
  // Fuzzy match
  for (const [key, label] of Object.entries(rankLabels)) {
    if (
      label.toLowerCase().includes(lower) ||
      lower.includes(label.toLowerCase())
    )
      return key as UserRank;
  }
  return null;
}

function base64ToBuffer(base64: string): Buffer {
  // Remove data URL prefix if present (e.g. "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,")
  const commaIndex = base64.indexOf(",");
  const data = commaIndex >= 0 ? base64.slice(commaIndex + 1) : base64;
  return Buffer.from(data, "base64");
}

export async function importParticipants(
  fileData: string,
): Promise<ImportResult> {
  const buffer = base64ToBuffer(fileData);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
  });

  if (rows.length === 0) {
    return { imported: 0, duplicates: 0, errors: ["Файл пуст"] };
  }

  const result: ImportResult = { imported: 0, duplicates: 0, errors: [] };
  const toCreate: Prisma.ParticipantCreateManyInput[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 because 1 is header

    const surname = (row["Фамилия"] ?? "").trim();
    const name = (row["Имя"] ?? "").trim();
    const patronymic = (row["Отчество"] ?? "").trim();
    const rankStr = (row["Чин"] ?? "").trim();
    const division = (row["Воинская часть"] ?? "").trim();

    // Validate required fields
    if (!surname || !name || !rankStr) {
      result.errors.push(
        `Строка ${rowNum}: не заполнены обязательные поля (Фамилия, Имя, Чин)`,
      );
      continue;
    }

    // Normalize rank
    const rankKey = normalizeRank(rankStr);
    if (!rankKey) {
      result.errors.push(`Строка ${rowNum}: неизвестный чин "${rankStr}"`);
      continue;
    }

    // Check for duplicates (FIO + rank + division)
    const existing = await prisma.participant.findFirst({
      where: {
        surname,
        name,
        patronymic,
        rank: rankKey,
        division,
      },
    });

    if (existing) {
      result.duplicates++;
      continue;
    }

    toCreate.push({
      surname,
      name,
      patronymic,
      rank: rankKey,
      division,
      born_at: (row["Дата рождения"] ?? "").trim(),
      died_at: (row["Дата смерти"] ?? "").trim(),
      rewards: (row["Награды"] ?? "").trim(),
      bio: (row["Биография"] ?? "").trim(),
      source: (row["Источник"] ?? "").trim(),
    });

    // Batch insert in chunks of 50 to avoid memory issues
    if (toCreate.length >= 50) {
      await prisma.participant.createMany({ data: toCreate });
      result.imported += toCreate.length;
      toCreate.length = 0;
    }
  }

  // Insert remaining
  if (toCreate.length > 0) {
    await prisma.participant.createMany({ data: toCreate });
    result.imported += toCreate.length;
  }

  return result;
}
