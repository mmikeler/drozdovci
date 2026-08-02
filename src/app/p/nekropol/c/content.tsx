// Nerkropol page content component

"use  client";

import BurialCard from "./card";
import { GetBurialsResult } from "@/app/editors/burials/c/actions/actions";
import Link from "next/link";

export function PageContent({ burials }: { burials: GetBurialsResult }) {
  if ("error" in burials) {
    return <div>Здесь пока нет информации</div>;
  }

  const items = burials.map((b, i) => (
    <Link href={"#b" + b.id} key={i}>
      {b.title}
    </Link>
  ));

  return (
    <div className="flex gap-5 relative">
      <div className="min-w-50 flex flex-col gap-4 text-lg sticky top-5 h-fit">
        {items}
      </div>

      <div className="flex flex-col gap-5">
        {burials.map((b, i) => (
          <BurialCard key={i} data={b} />
        ))}
      </div>
    </div>
  );
}
