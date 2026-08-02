// Delete image function

"use server";

import { unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { UploadFile } from "antd";

/**
 * Удаляет файл изображения по его публичному URL.
 *
 * @param imagePath - публичный URL (напр. "/uploads/participants/1/photo.webp")
 * @returns `true` если файл удалён, `false` если файла не было или произошла ошибка
 */
export async function deleteImage(
  imagePath: UploadFile["url"],
): Promise<boolean> {
  try {
    if (!imagePath) {
      return false;
    }

    // Получаем относительный путь от URL: "/uploads/..." -> "uploads/..."
    const relativePath = imagePath.replace(/^\//, "");
    const absolutePath = path.join(process.cwd(), "/public/", relativePath);

    // Проверяем, что файл действительно существует
    if (!existsSync(absolutePath)) {
      return false;
    }

    // Удаляем файл
    await unlink(absolutePath);

    return true;
  } catch {
    return false;
  }
}
