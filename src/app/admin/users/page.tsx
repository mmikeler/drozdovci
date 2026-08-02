import { getUsers } from "@/app/admin/actions";
import UsersClient from "./usersClient";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();
  const users = await getUsers();

  if (session?.user.role !== "SUPERADMIN") {
    return "Нет доступа для " + session?.user.role;
  }

  return (
    <div className="p-6">
      <UsersClient users={users} />
    </div>
  );
}
