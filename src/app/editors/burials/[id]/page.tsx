// Single burial page

import Title from "antd/es/typography/Title";
import { notFound } from "next/navigation";
import { ArrowLeftSquare, MapPin } from "lucide-react";
import Link from "next/link";
import { Avatar, Space } from "antd";
import { getBurial } from "../c/actions/actions";
import EditForm from "./c/editForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const B = await getBurial(id);

  if ("error" in B) {
    notFound();
  }

  const avatarSrc = JSON.parse(B.gallery) ? JSON.parse(B.gallery)?.[0] : "";

  return (
    <div className="max-w-260 mx-auto">
      <Link href="/editors/burials" className="block mb-5">
        <Space>
          <ArrowLeftSquare size={20} /> Назад к списку
        </Space>
      </Link>
      <Title level={2} className="flex items-center gap-3">
        <Avatar shape="square" src={avatarSrc || undefined} size="large">
          <MapPin size={20} />
        </Avatar>
        {B.title}
      </Title>

      <EditForm burial={B} />
    </div>
  );
}
