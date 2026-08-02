// Delete participant card

"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteParticipantCard(id: number) {
  try {
    await prisma.participant.delete({
      where: {
        id,
      },
    });
    redirect("/editors/participants");
  } catch {
    return { error: "Не удалось удалить карточку" };
  }
}
