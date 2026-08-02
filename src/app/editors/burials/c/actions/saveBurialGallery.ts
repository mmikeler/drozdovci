"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveBurialGallery(
  burialId: number,
  urls: string[],
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.burialPlace.update({
      where: { id: burialId },
      data: {
        gallery: JSON.stringify(urls),
      },
    });

    revalidatePath("/editors/burials/" + burialId);
    return { success: true };
  } catch (e) {
    console.error("saveBurialGallery error:", e);
    return { success: false, error: "Ошибка при сохранении галереи" };
  }
}
