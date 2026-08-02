// Participants public page

import { prisma } from "@/lib/prisma";
import { Empty } from "antd";
import ParticipantCard from "./c/card";
import Filters from "./c/filters";
import Pagination from "./c/pagination";
import { Prisma, $Enums } from "@/generated/prisma/client";

const PAGE_SIZE = 18;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const rank = typeof sp.rank === "string" ? sp.rank : "";
  const division = typeof sp.division === "string" ? sp.division.trim() : "";
  const isDrozdovec = sp.isDrozdovec === "1";
  const is198 = sp.is198 === "1";
  const page = Math.max(
    1,
    typeof sp.page === "string" ? parseInt(sp.page, 10) || 1 : 1,
  );

  // Build where conditions
  const where: Prisma.ParticipantWhereInput = {
    status: "PUBLISHED",
  };

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { surname: { contains: q } },
      { patronymic: { contains: q } },
    ];
  }

  if (rank) {
    where.rank = rank as $Enums.UserRank;
  }

  if (division) {
    where.division = { contains: division };
  }

  if (isDrozdovec) {
    where.isDrozdovec = true;
  }

  if (is198) {
    where.is198 = true;
  }

  const [totalCount, pps] = await Promise.all([
    prisma.participant.count({ where }),
    prisma.participant.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return (
    <div className="">
      <div className="text-center">Всего карточек: {totalCount}</div>
      <Filters />
      {pps.length === 0 ? (
        <Empty />
      ) : (
        <>
          <div className="grid grid-cols-6 gap-4">
            {pps.map((p) => (
              <ParticipantCard key={p.id} p={p} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </div>
  );
}
