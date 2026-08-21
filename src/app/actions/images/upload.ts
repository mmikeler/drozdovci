// Upload and save images action

"use server";

import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { sanitizeFilename, validateSaveUploadPath } from "@/lib/utils";

const MAX_WIDTH = 1920;
const QUALITY = 80;
const UPLOADS_DIR = "public/uploads";

type UploadResult = { url: string; width: number; height: number } | { error: string };

export async function uploadImage(
  savePath: string,
  formData: FormData,
): Promise<UploadResult> {
  try {
    const validPath = validateSaveUploadPath(savePath);
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return { error: "No file provided" };
    }
    if (!file.type.startsWith("image/")) {
      return { error: "Invalid file type. Only images are allowed." };
    }
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { error: "File too large. Maximum size is 20 MB." };
    }

    const safeName = sanitizeFilename(file.name);
    const uniqueName = `${Date.now()}_${safeName}`;
    const relativeFile = `${validPath}/${uniqueName}.webp`;
    const absoluteDir = path.join(process.cwd(), UPLOADS_DIR, validPath);
    const absoluteFile = path.join(process.cwd(), UPLOADS_DIR, relativeFile);

    if (!existsSync(absoluteDir)) {
      await mkdir(absoluteDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    const basePath = absoluteFile.replace(/\.webp$/, "");
    const mdFile = `${basePath}_md.webp`;
    const smFile = `${basePath}_sm.webp`;

    await Promise.all([
      sharp(buffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(absoluteFile),
      sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(mdFile),
      sharp(buffer)
        .resize({ width: 400, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toFile(smFile),
    ]);

    return {
      url: `/uploads/${relativeFile.replace(/\\/g, "/")}`,
      width,
      height,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown upload error";
    return { error: message };
  }
}
