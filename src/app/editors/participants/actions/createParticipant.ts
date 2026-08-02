// Create a participant

"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createParticipant() {
  const newParticipant = await prisma.participant.create({
    data: {
      name: "Новый участник",
    },
  });

  if (newParticipant) {
    redirect("/editors/participants/" + newParticipant.id);
  }

  return false;
}
