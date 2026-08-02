// Actions for Burials

"use server";

import { BurialPlace, Participant } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { AnyObject } from "antd/es/_util/type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Create burial
export async function createBurial() {
  const burial = await prisma.burialPlace.create({
    data: {
      gallery: JSON.stringify([]),
    },
  });

  if (burial) redirect(`/editors/burials/${burial.id}`);

  return false;
}

// Get single burial
export async function getBurial(id: string) {
  try {
    if (id) {
      const burial = await prisma.burialPlace.findUnique({
        where: { id: parseInt(id) },
      });

      if (!burial) throw new Error("Не удалось получить запись");

      return burial;
    }
    throw new Error("Недостаточно данных");
  } catch (error) {
    return { error };
  }
}

// Update burial
export async function updateBurial(id: string, data: BurialPlace) {
  try {
    const b = await prisma.burialPlace.update({
      where: { id: parseInt(id) },
      data,
    });

    if (!b) throw new Error("Не удалось обновить запись");

    revalidatePath(`/editors/burials/${b.id}`);
  } catch (error) {
    return { error };
  }
}

// Delete burial
export async function deleteBurial(id: string) {
  try {
    if (id) {
      const burial = await prisma.burialPlace.delete({
        where: { id: parseInt(id) },
      });

      if (!burial) throw new Error("Не удалось удалить запись");

      revalidatePath("/editors/burials");
    }
  } catch (error) {
    return { error };
  }
}

// Get all burials with relations

export type GetBurialsResult =
  | ({ perticipants: Participant[] } & BurialPlace)[]
  | { error: unknown };

export async function getBurials(
  where: AnyObject = {},
): Promise<GetBurialsResult> {
  try {
    return await prisma.burialPlace.findMany({
      where,
      include: {
        perticipants: true,
      },
    });
  } catch (error) {
    return { error };
  }
}
