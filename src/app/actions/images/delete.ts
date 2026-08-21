// Delete image function

"use server";

import { unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { UploadFile } from "antd";

export async function deleteImage(
  imagePath: UploadFile["url"],
): Promise<boolean> {
  try {
    if (!imagePath) {
      return false;
    }

    const relativePath = imagePath.replace(/^\//, "");
    const absolutePath = path.join(process.cwd(), "/public/", relativePath);

    if (!existsSync(absolutePath)) {
      return false;
    }

    await unlink(absolutePath);

    const base = absolutePath.replace(/\.webp$/, "");
    const mdPath = `${base}_md.webp`;
    const smPath = `${base}_sm.webp`;

    try {
      if (existsSync(mdPath)) {
        await unlink(mdPath);
      }
    } catch {
      // ignore missing variant
    }

    try {
      if (existsSync(smPath)) {
        await unlink(smPath);
      }
    } catch {
      // ignore missing variant
    }

    return true;
  } catch {
    return false;
  }
}
