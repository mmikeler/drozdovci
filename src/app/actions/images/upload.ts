// Upload and save images action

"use server";

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { sanitizeFilename, validateSaveUploadPath } from "@/lib/utils";

/** Макс. ширина изображения после ресайза */
const MAX_WIDTH = 1920;
/** Качество WebP */
const QUALITY = 80;
/** Директория для загрузок */
const UPLOADS_DIR = "public/uploads";

type UploadResult = { url: string } | { error: string };

/**
 * Загружает, оптимизирует и сохраняет изображение.
 *
 * @param savePath - относительный путь к файлу БЕЗ расширения
 *   (напр. "participants/1/photo"). Файл сохранится как `{savePath}.webp`.
 * @param formData - FormData, содержащая файл в поле "file"
 *
 * @returns `{ url: "/uploads/..." }` при успехе, либо `{ error: "..." }` при ошибке
 */
export async function uploadImage(
  savePath: string,
  formData: FormData,
): Promise<UploadResult> {
  try {
    // 1. Валидация пути
    const validPath = validateSaveUploadPath(savePath);

    // 2. Извлечение файла
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return { error: "No file provided" };
    }

    // 3. MIME-валидация
    if (!file.type.startsWith("image/")) {
      return { error: "Invalid file type. Only images are allowed." };
    }

    // 4. Проверка размера (макс. 20 МБ)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { error: "File too large. Maximum size is 20 MB." };
    }

    // 5. Санитация имени файла (используем оригинальное имя для уникальности)
    const safeName = sanitizeFilename(file.name);
    const uniqueName = `${Date.now()}_${safeName}`;

    // 6. Формирование полного пути сохранения
    const relativeFile = `${validPath}/${uniqueName}.webp`;
    const absoluteDir = path.join(process.cwd(), UPLOADS_DIR, validPath);
    const absoluteFile = path.join(process.cwd(), UPLOADS_DIR, relativeFile);

    // 7. Создаём директорию, если её нет
    if (!existsSync(absoluteDir)) {
      await mkdir(absoluteDir, { recursive: true });
    }

    // 8. Читаем файл в Buffer и прогоняем через sharp
    const buffer = Buffer.from(await file.arrayBuffer());
    const optimized = await sharp(buffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    // 9. Сохраняем
    await writeFile(absoluteFile, optimized);

    // 10. Возвращаем публичный URL
    return { url: `/uploads/${relativeFile.replace(/\\/g, "/")}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown upload error";
    return { error: message };
  }
}
