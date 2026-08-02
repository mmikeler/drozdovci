"use client";

// MAIN HEADER

import dynamic from "next/dynamic";
import { Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { Home, MapPinPlusInside, Users2 } from "lucide-react";

const LoginWidget = dynamic(() => import("./loginWidget"), { ssr: false });

type MenuItem = Required<MenuProps>["items"][number];

const style = "text-amber-300! hover:border-b border-amber-300";

export function MYHeader() {
  const items: MenuItem[] = [
    {
      label: (
        <Link className={style} href="/">
          Главная
        </Link>
      ),
      key: "home",
      icon: <Home size={18} className="text-amber-300!" />,
    },
    {
      label: (
        <Link className={style} href="/p/participants">
          Участники
        </Link>
      ),
      key: "perticipant",
      icon: <Users2 size={18} className="text-amber-300!" />,
    },
    {
      label: (
        <Link className={style} href="/p/nekropol">
          Некрополь
        </Link>
      ),
      key: "nekropol",
      icon: <MapPinPlusInside size={18} className="text-amber-300!" />,
    },
  ];

  return (
    <Layout.Header className="flex items-center justify-between">
      <Link href="/">
        <div className="px-3 h-12 font-bold items-center bg-rose-800 text-amber-300 border-y-2 border-white flex">
          История Дроздовцев
        </div>
      </Link>
      <Menu
        mode="horizontal"
        className="w-100"
        theme="dark"
        selectedKeys={[]}
        style={{ backgroundColor: "transparent" }}
        items={items}
      />
      <LoginWidget />
    </Layout.Header>
  );
}
