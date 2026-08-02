// ADMIN LAYOUT

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAdmin = session?.user?.role.match(/ADMIN/);

  if (!isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}
