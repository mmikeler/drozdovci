// Burial public page card component

"use client";

import { BurialPlace, Participant } from "@/generated/prisma/client";
import { Image, Tag, Tooltip } from "antd";
import Typography from "antd/es/typography";
import RelationsList from "./relationsList";

interface BurialPlaceCardProps extends BurialPlace {
  perticipants: Participant[];
}

const { Paragraph } = Typography;

export default function BurialCard({ data }: { data: BurialPlaceCardProps }) {
  const { id, title, country, city, description, gallery, perticipants } = data;
  const photos: string[] = JSON.parse(gallery) || "[]";

  return (
    <div
      id={"b" + id}
      className="relative bg-stone-100 rounded-[3rem] overflow-hidden border-10 border-stone-300"
    >
      <div className="relative h-75 overflow-hidden">
        <Image.PreviewGroup items={photos}>
          <Image
            src={photos[0]}
            alt={title}
            styles={{
              root: { width: "100%", height: "100%" },
              image: { objectFit: "cover" },
            }}
          />
          <div className="absolute bottom-1 right-1">
            {photos.length > 1 && (
              <Tooltip title="Нажмите на обложку">
                <Tag>{`+ ${photos.length - 1} фото`}</Tag>
              </Tooltip>
            )}
          </div>
        </Image.PreviewGroup>
      </div>
      <div className="text-center text-stone-700  py-5">
        <div className="text-4xl">{title}</div>
        <div className="">
          {city}, {country}
        </div>
        <div className="p-5 text-left">
          <Paragraph
            className="text-lg!"
            ellipsis={{ rows: 5, expandable: false }}
          >
            {description}
          </Paragraph>
        </div>
      </div>
      <RelationsList participants={perticipants} />
    </div>
  );
}
