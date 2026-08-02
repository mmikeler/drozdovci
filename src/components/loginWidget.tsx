"use client";

import { useSession, signOut } from "next-auth/react";
import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import { roleLabels } from "@/lib/roles";
import Link from "next/link";
import { LogOut, User2 } from "lucide-react";

export default function LoginWidget() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Button type="text" loading />;
  }

  if (session?.user) {
    const items: MenuProps["items"] = [
      {
        key: "role",
        label: `Роль: ${roleLabels[session.user.role]}`,
        disabled: true,
      },
      { type: "divider" },
    ];

    if (session.user.role.match(/ADMIN/)) {
      items.push({
        key: "admin",
        label: <Link href="/admin">Управление</Link>,
      });
    }

    items.push({
      key: "editors",
      label: <Link href="/editors">Редакция</Link>,
    });
    items.push({ type: "divider" });
    items.push({
      key: "logout",
      icon: <LogOut size={22} />,
      label: "Выйти",
      danger: true,
      onClick: async () => {
        await signOut();
      },
    });

    return (
      <Dropdown menu={{ items }}>
        <Space style={{ cursor: "pointer" }}>
          <User2 size="22" color="white" />
          <span className="text-white font-bold">{session.user.login}</span>
        </Space>
      </Dropdown>
    );
  }

  return (
    <Button type="primary" onClick={() => router.push("/login")}>
      Войти
    </Button>
  );
}
