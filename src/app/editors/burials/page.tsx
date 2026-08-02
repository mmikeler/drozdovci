// Burial places table editors page

import { prisma } from "@/lib/prisma";
import { AddNewBtn } from "./c/addNew";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BurialPlacesTable } from "./c/table";

export default async function Page() {
  const burials = await prisma.burialPlace.findMany({});

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <Link href="/editors" className="flex gap-2 items-center">
          <ArrowLeft size={16} /> Назад
        </Link>
        <div>Всего карточек: {burials.length}</div>
        <AddNewBtn />
      </div>

      <BurialPlacesTable data={burials} />
    </div>
  );
}
