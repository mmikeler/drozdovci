// Страница редактуры

"use client";

import { useRouter } from "next/navigation";
import { Card, Typography, Space, theme, Divider } from "antd";
import {
  FilePenLine,
  Files,
  LucideGalleryHorizontalEnd,
  MapPinPlusInside,
  Users2,
} from "lucide-react";

type MenuItemProp = {
  icon?: React.ReactNode;
  href?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  type?: "divider";
  text?: string;
};

const { Title, Text } = Typography;

export default function AdminPage() {
  const router = useRouter();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const iconProps = {
    color: colorPrimary,
    size: 48,
  };

  const items: MenuItemProp[] = [
    {
      icon: <Users2 {...iconProps} />,
      href: "/editors/participants",
      title: "Персоналии",
      description:
        "Управление карточками участников: добавление, редактирование, удаление",
    },
    {
      icon: <MapPinPlusInside {...iconProps} />,
      href: "/editors/burials",
      title: "Некрополь",
      description:
        "Управление карточками мест захоронений: добавление, редактирование, удаление",
    },
    { type: "divider", text: "В разработке" },
    {
      icon: <FilePenLine {...iconProps} />,
      href: "/editors/posts",
      title: "Посты",
      description: "Управление постами: добавление, редактирование, удаление",
      disabled: true,
    },
    {
      icon: <LucideGalleryHorizontalEnd {...iconProps} />,
      href: "/editors/galleries",
      title: "Галереи изображений",
      description:
        "Управление тематическими галлереями: добавление, редактирование, удаление",
      disabled: true,
    },
    {
      icon: <Files {...iconProps} />,
      href: "/editors/docs",
      title: "Документы",
      description:
        "Управление загружаемыми документами: добавление, просмотр, удаление",
      disabled: true,
    },
    {
      icon: <Files {...iconProps} />,
      href: "/editors/books",
      title: "Литература",
      description: "Управление литературой и другими источниками",
      disabled: true,
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>Панель управления редактурой</Title>
      <Text type="secondary">Выберите раздел</Text>

      <div className="mt-6 flex flex-wrap">
        {items.map((item, index) =>
          item.type === "divider" ? (
            <div key={index} className="w-full">
              <Divider className="w-full">{item.text}</Divider>
            </div>
          ) : (
            <div key={index} className="p-2 w-1/2">
              <Card
                hoverable={!item.disabled}
                onClick={() =>
                  item.href && !item.disabled && router.push(item.href)
                }
                className={`h-full ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <Space orientation="vertical" size="middle" className="w-full">
                  {item.icon}
                  <Title level={4} style={{ margin: 0 }}>
                    {item.title}
                  </Title>
                  <Text type="secondary">{item.description}</Text>
                </Space>
              </Card>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
