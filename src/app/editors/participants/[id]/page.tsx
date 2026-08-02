// Single Participant page

import { prisma } from "@/lib/prisma";
import Title from "antd/es/typography/Title";
import { notFound } from "next/navigation";
import EditForm from "./c/editForm";
import { ArrowLeftSquare, User } from "lucide-react";
import Link from "next/link";
import { Avatar, Space } from "antd";

export default async function ParticipantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const P = await prisma.participant.findUnique({
    where: {
      id: Number(id),
    },
  });

  const BS = await prisma.burialPlace.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  if (!P) {
    notFound();
  }

  const avatarSrc = JSON.parse(P.photos)?.[0];

  return (
    <div className="max-w-260 mx-auto">
      <Link href="/editors/participants" className="block mb-5">
        <Space>
          <ArrowLeftSquare size={20} /> Назад к списку
        </Space>
      </Link>
      <Title level={2} className="flex items-center gap-3">
        <Avatar shape="square" src={avatarSrc || undefined} size="large">
          <User size={20} />
        </Avatar>
        {[P.surname, P.name, P.patronymic].join(" ")}
      </Title>

      <EditForm participant={P} burialsOptions={BS} />
    </div>
  );
}
