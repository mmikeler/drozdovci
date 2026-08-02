// Participant public card

import { Participant } from "@/generated/prisma/client";
import { Participant as PModel } from "@/models/participant";
import { Image as Img, Card } from "antd";
import Link from "next/link";

export default function ParticipantCard({ p }: { p: Participant }) {
  const P = new PModel(p);

  return (
    <Link href={P.permalink} className="block">
      <Card
        hoverable
        variant="outlined"
        cover={
          <div className="aspect-square overflow-hidden relative">
            {P.avatar ? (
              <Img
                styles={{
                  image: { objectFit: "cover", height: "100%" },
                  root: { height: "100%" },
                }}
                src={P.avatar}
                alt={P.name}
                preview={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <Img
                preview={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                styles={{
                  image: { objectFit: "cover", height: "100%" },
                  root: { height: "100%" },
                }}
                loading="eager"
                src="/mock2.jpg"
                alt=""
              />
            )}
          </div>
        }
        actions={[<span key="1">{P.fullName}</span>]}
      ></Card>
    </Link>
  );
}
