// ADMIN PAGE SIDER

"use client";

import { Layout, Menu, MenuProps, theme } from "antd";
import { MapPinPlusInside, UserCircle2 } from "lucide-react";

export default function Sider() {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const iconProps = {
    size: 22,
    color: colorPrimary,
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Участники",
      icon: <UserCircle2 {...iconProps} />,
    },
    {
      key: "2",
      label: "Захоронения",
      icon: <MapPinPlusInside {...iconProps} />,
    },
  ];

  return (
    <Layout.Sider>
      <Menu mode="inline" items={items}></Menu>
    </Layout.Sider>
  );
}
