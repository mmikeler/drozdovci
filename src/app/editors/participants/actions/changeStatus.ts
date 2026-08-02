// Change Participant status

"use server";

import { PostStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function changeStatus(id: number, status: PostStatus) {
  try {
    const result = await prisma.participant.update({
      where: { id },
      data: {
        status,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!result?.id) {
      return false;
    }

    revalidatePath("/editors/participants/" + id);
    return true;
  } catch {
    return false;
  }
}
