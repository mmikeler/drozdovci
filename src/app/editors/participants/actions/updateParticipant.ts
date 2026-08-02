"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateParticipant(
  id: number,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const rawData = Object.fromEntries(formData.entries());

    const data: Record<string, unknown> = {
      name: rawData.name || "",
      surname: rawData.surname || "",
      patronymic: rawData.patronymic || "",
      rank: rawData.rank || "",
      division: rawData.division || "",
      born_at: rawData.born_at || "",
      died_at: rawData.died_at || "",
      isDrozdovec: rawData.isDrozdovec === "on",
      is198: rawData.is198 === "on",
      guberniya: rawData.guberniya || "",
      uezd: rawData.uezd || "",
      volost: rawData.volost || "",
      locality: rawData.locality || "",
      rewards: rawData.rewards || "",
      bio: rawData.bio || "",
      source: rawData.source || "",
      placeOfDeath: rawData.placeOfDeath || "",
      burialPlaceId: rawData.burialPlaceId ? Number(rawData.burialPlaceId) : null,
    };

    await prisma.participant.update({
      where: { id },
      data,
    });

    revalidatePath("/editors/participants/" + id);
    return { success: true };
  } catch (e) {
    console.error("updateParticipant error:", e);
    return { success: false, error: "РћС€РёР±РєР° РїСЂРё СЃРѕС…СЂР°РЅРµРЅРёРё" };
  }
}


