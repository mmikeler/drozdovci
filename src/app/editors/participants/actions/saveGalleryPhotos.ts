// Save gallery photos for a participant

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Сохраняет массив URL фотографий в поле `photos` участника (JSON-строка).
 */
export async function saveGalleryPhotos(
  participantId: number,
  urls: string[],
  meta_key?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.participant.update({
      where: { id: participantId },
      data: {
        [meta_key || "photos"]: JSON.stringify(urls),
      },
    });

    revalidatePath("/editors/participants/" + participantId);
    return { success: true };
  } catch (e) {
    console.error("saveGalleryPhotos error:", e);
    return { success: false, error: "Ошибка при сохранении галереи" };
  }
}
