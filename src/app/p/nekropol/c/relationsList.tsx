// Burial place relations list component

"use client";

import { Participant } from "@/generated/prisma/client";
import { Participant as PMODEL } from "@/models/participant";
import { QuestionOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import Link from "next/link";

type RelationsListProps = {
  participants: Participant[];
};

export default function RelationsList(props: RelationsListProps) {
  const PS = props.participants.slice(0, 7).map((p) => new PMODEL(p));
  const count = props.participants.length;
  const diff = count - PS.length;

  return (
    <div className="flex flex-wrap items-center justify-center p-3 border-t border-stone-200">
      <Avatar.Group size={50} shape="square">
        {PS.map((p, i) => (
          <Tooltip
            key={i}
            title={
              <div className="w-50 text-xs text-center">
                <Avatar
                  size={200}
                  src={p.avatar}
                  style={{ backgroundColor: "#ddd" }}
                />
                <div className="pt-1">{p.fullName}</div>
                <div className="pt-1 italic">{p.rankLabel}</div>
              </div>
            }
          >
            <Link href={p.permalink}>
              <Avatar
                size={70}
                src={p.gravePhoto}
                style={{ backgroundColor: "#ddd" }}
                icon={<QuestionOutlined />}
              />
            </Link>
          </Tooltip>
        ))}
      </Avatar.Group>
      {diff > 0 && <span className="ms-2">и ещё {diff}</span>}
    </div>
  );
}
