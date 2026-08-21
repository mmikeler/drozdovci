// Participant public card

import { Participant } from "@/generated/prisma/client";
import { Participant as PModel } from "@/models/participant";
import { Card } from "antd";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";

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
              <OptimizedImage
                src={P.avatar}
                alt={P.name}
                preview={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full"
                styles={{
                  image: { objectFit: "cover", height: "100%" },
                  root: { height: "100%" },
                }}
              />
            ) : (
              <OptimizedImage
                preview={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
                src="/mock2.jpg"
                alt=""
                className="w-full h-full"
              />
            )}
          </div>
        }
        actions={[<span key="1">{P.fullName}</span>]}
      ></Card>
    </Link>
  );
}
