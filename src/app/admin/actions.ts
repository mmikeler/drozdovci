"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";
import { UserRole } from "@/generated/prisma/enums";

function checkSuperAdmin(role: string | undefined) {
  if (role !== "SUPERADMIN") {
    throw new Error(
      "Доступ запрещен. Только SUPERADMIN может управлять пользователями.",
    );
  }
}

export async function getUsers() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "SUPERADMIN") {
    return [];
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      login: true,
      role: true,
    },
    orderBy: { id: "asc" },
  });

  return users;
}

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  checkSuperAdmin(session?.user?.role);

  const login = formData.get("login") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!login || !password) {
    throw new Error("Логин и пароль обязательны");
  }

  if (login.length < 3) {
    throw new Error("Логин должен содержать минимум 3 символа");
  }

  if (password.length < 4) {
    throw new Error("Пароль должен содержать минимум 4 символа");
  }

  const existing = await prisma.user.findUnique({ where: { login } });
  if (existing) {
    throw new Error("Пользователь с таким логином уже существует");
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      login,
      password: hashedPassword,
      role:
        role === "ADMIN" ? "ADMIN" : role === "EDITOR" ? "EDITOR" : "EDITOR",
    },
  });

  revalidatePath("/admin/users");
}

export async function updateUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  checkSuperAdmin(session?.user?.role);

  const id = parseInt(formData.get("id") as string);
  const login = formData.get("login") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!id || !login) {
    throw new Error("ID и логин обязательны");
  }

  if (login.length < 3) {
    throw new Error("Логин должен содержать минимум 3 символа");
  }

  // Check if login is taken by another user
  const existing = await prisma.user.findFirst({
    where: { login, NOT: { id } },
  });
  if (existing) {
    throw new Error("Пользователь с таким логином уже существует");
  }

  const updateData: {
    login: string;
    role: (typeof UserRole)[keyof typeof UserRole];
    password?: string;
  } = {
    login,
    role:
      role === "SUPERADMIN"
        ? UserRole.SUPERADMIN
        : role === "ADMIN"
          ? UserRole.ADMIN
          : UserRole.EDITOR,
  };

  if (password && password.length >= 4) {
    updateData.password = await hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Не авторизован");
  }
  checkSuperAdmin(session.user.role);

  const id = parseInt(formData.get("id") as string);

  if (!id) {
    throw new Error("ID пользователя обязателен");
  }

  // Prevent deleting yourself
  if (session.user.id === id.toString()) {
    throw new Error("Нельзя удалить самого себя");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("Пользователь не найден");
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin/users");
}
