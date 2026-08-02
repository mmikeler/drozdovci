"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBurial(
  id: number,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const rawData = Object.fromEntries(formData.entries());

    const data: Record<string, unknown> = {
      title: rawData.title || "",
      country: rawData.country || "",
      city: rawData.city || "",
      description: rawData.description || "",
    };

    await prisma.burialPlace.update({
      where: { id },
      data,
    });

    revalidatePath("/editors/burials/" + id);
    return { success: true };
  } catch (e) {
    console.error("updateBurial error:", e);
    return { success: false, error: "Ошибка при сохранении" };
  }
}
