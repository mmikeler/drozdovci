// Utils functions

import path from "node:path";

/**
 * Транслитерация кириллицы в латиницу.
 */
export function transliterate(s: string): string {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "Yo",
    Ж: "Zh",
    З: "Z",
    И: "I",
    Й: "Y",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "Kh",
    Ц: "Ts",
    Ч: "Ch",
    Ш: "Sh",
    Щ: "Shch",
    Ъ: "",
    Ы: "Y",
    Ь: "",
    Э: "E",
    Ю: "Yu",
    Я: "Ya",
  };
  return s.replace(/[а-яА-ЯёЁ]/g, (c) => map[c] ?? c);
}

/**
 * Санирует имя файла:
 * 1. Транслитерирует кириллицу
 * 2. Заменяет пробелы и небезопасные символы на `_`
 * 3. Удаляет всё, кроме букв, цифр, `-`, `_`
 */
export function sanitizeFilename(name: string): string {
  const dotIdx = name.lastIndexOf(".");
  const base = dotIdx > 0 ? name.slice(0, dotIdx) : name;
  const ext = dotIdx > 0 ? name.slice(dotIdx) : "";

  const latin = transliterate(base);
  const clean = latin
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 100);

  return clean || "image" + ext;
}

/**
 * Проверяет, что `savePath` (относительный путь без расширения) не содержит
 * path traversal и не выходит за пределы `public/uploads/`.
 */
export function validateSaveUploadPath(savePath: string): string {
  const normalized = path.normalize(savePath).replace(/\\/g, "/");

  if (normalized.startsWith("..") || normalized.includes("/../")) {
    throw new Error("Invalid path: traversal detected");
  }
  if (/[<>:"|?*]/.test(normalized)) {
    throw new Error("Invalid path: contains illegal characters");
  }

  return normalized;
}
