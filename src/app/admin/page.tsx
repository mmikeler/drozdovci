"use client";

import { useRouter } from "next/navigation";
import { Card, Typography, Space } from "antd";
import { TeamOutlined, SettingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <Title level={2}>Панель управления</Title>
      <Text type="secondary">Выберите раздел для управления</Text>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          hoverable
          onClick={() => router.push("/admin/users")}
          className="cursor-pointer"
        >
          <Space orientation="vertical" size="middle" className="w-full">
            <TeamOutlined style={{ fontSize: 48, color: "#1677ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              Пользователи
            </Title>
            <Text type="secondary">
              Управление пользователями системы: добавление, редактирование,
              удаление
            </Text>
          </Space>
        </Card>

        <Card className="opacity-50 cursor-not-allowed">
          <Space orientation="vertical" size="middle" className="w-full">
            <SettingOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
            <Title level={4} style={{ margin: 0, color: "#d9d9d9" }}>
              Настройки
            </Title>
            <Text type="secondary">В разработке</Text>
          </Space>
        </Card>
      </div>
    </div>
  );
}
