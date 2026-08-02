"use server";

import { PostStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function changeBurialStatus(id: number, status: PostStatus) {
  try {
    const result = await prisma.burialPlace.update({
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

    revalidatePath("/editors/burials/" + id);
    return true;
  } catch {
    return false;
  }
}
