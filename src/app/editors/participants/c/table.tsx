"use client";

import { Avatar, Table, Space, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { rankLabels } from "@/lib/ranks";
import { useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import PostStatusTag from "@/components/postStatusTag";
import { PostStatus } from "@/generated/prisma/enums";
import { Participant } from "@/generated/prisma/client";

const getSmVariant = (url: string) => {
  if (!url || !url.endsWith(".webp") || !url.startsWith("/uploads/")) {
    return url;
  }
  return url.replace(/\.webp$/, "_sm.webp");
};

interface Props {
  data: Participant[];
}

const statusOptions = [
  { value: "DRAFT", label: "Черновик" },
  { value: "PUBLISHED", label: "Опубликовано" },
];

interface Filters {
  fio: string;
  rank: string | null;
  division: string;
  status: string | null;
}

export default function ParticipantsTable({ data }: Props) {
  const [filters, setFilters] = useState<Filters>({
    fio: "",
    rank: null,
    division: "",
    status: null,
  });

  const filteredData = data.filter((item) => {
    if (filters.fio) {
      const fullName =
        `${item.surname} ${item.name} ${item.patronymic}`.toLowerCase();
      if (!fullName.includes(filters.fio.toLowerCase())) return false;
    }
    if (filters.rank && item.rank !== filters.rank) return false;
    if (filters.division) {
      if (!item.division.toLowerCase().includes(filters.division.toLowerCase()))
        return false;
    }
    if (filters.status && item.status !== filters.status) return false;
    return true;
  });

  const columns: ColumnsType<Participant> = [
    {
      title: "ФИО",
      key: "fio",
      filteredValue: filters.fio ? [filters.fio] : null,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input.Search
            placeholder="Поиск по ФИО..."
            allowClear
            value={filters.fio}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, fio: e.target.value }))
            }
            onSearch={() => {}}
          />
        </div>
      ),
      render: (_, record) => (
        <Space size="medium">
          <Avatar
            size="large"
            shape="square"
            src={
              getSmVariant(JSON.parse(record.photos)?.[0] || "") || undefined
            }
          >
            <User size={20} color="white" />
          </Avatar>

          <Link
            className="flex flex-col gap-0"
            href={`/editors/participants/${record.id}`}
          >
            <span>{record.surname}</span>
            <span>{record.name}</span>
            <span>{record.patronymic}</span>
          </Link>
        </Space>
      ),
    },
    {
      title: "Чин",
      dataIndex: "rank",
      key: "rank",
      filteredValue: filters.rank ? [filters.rank] : null,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Выберите чин..."
            allowClear
            showSearch={{ optionFilterProp: "label" }}
            value={filters.rank}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, rank: value ?? null }))
            }
            options={Object.entries(rankLabels)
              .sort(([, a], [, b]) => a.localeCompare(b))
              .map(([key, label]) => ({ value: key, label }))}
          />
        </div>
      ),
      render: (rank: string) => rankLabels[rank] ?? rank,
    },
    {
      title: "Воинская часть",
      dataIndex: "division",
      key: "division",
      filteredValue: filters.division ? [filters.division] : null,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input.Search
            placeholder="Поиск по части..."
            allowClear
            value={filters.division}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, division: e.target.value }))
            }
            onSearch={() => {}}
          />
        </div>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      filteredValue: filters.status ? [filters.status] : null,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Выберите статус..."
            allowClear
            value={filters.status}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value ?? null }))
            }
            options={statusOptions.map((opt) => ({ ...opt }))}
          />
        </div>
      ),
      render: (status: PostStatus) => <PostStatusTag status={status} />,
    },
  ];

  return (
    <Table
      dataSource={filteredData}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 20 }}
      bordered
    />
  );
}
