// Participants table editors page

import { prisma } from "@/lib/prisma";
import ParticipantsTable from "./c/table";
import { AddNewBtn } from "./c/addNew";
import { ImportDialog } from "./c/importDialog";

export default async function Page() {
  const participants = await prisma.participant.findMany({
    include: {
      burialPlace: true,
    },
    orderBy: { id: "asc" },
  });

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="">Всего карточек: {participants.length}</div>
        <div className="flex gap-2">
          <ImportDialog />
          <AddNewBtn />
        </div>
      </div>

      <ParticipantsTable data={participants} />
    </>
  );
}
