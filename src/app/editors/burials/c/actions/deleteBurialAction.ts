"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteBurialAction(id: number) {
  await prisma.burialPlace.delete({
    where: { id },
  });

  redirect("/editors/burials");
}
