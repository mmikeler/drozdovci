// Burial places table

"use client";

import { BurialPlace } from "@/generated/prisma/client";
import { Table } from "antd";
import Text from "antd/es/typography/Text";
import Link from "next/link";

export function BurialPlacesTable({ data }: { data: BurialPlace[] }) {
  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Название",
      key: "title",
      dataIndex: "title",
      render: (text: string, record: BurialPlace) => (
        <Link href={`/editors/burials/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Страна",
      key: "country",
      dataIndex: "country",
    },
    {
      title: "Город",
      key: "city",
      dataIndex: "city",
    },
    {
      title: "Описание",
      key: "description",
      dataIndex: "description",
      render: (text: string) => (
        <Text style={{ maxWidth: "100px" }} ellipsis={true}>
          {text}
        </Text>
      ),
    },
  ];

  return <Table rowKey="id" dataSource={data} columns={columns} />;
}
