import { getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        login: { label: "login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          return null;
        }

        const login = credentials.login as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { login },
          select: {
            id: true,
            login: true,
            password: true,
            role: true,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          login: user.login,
          role: user.role ?? "EDITOR",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.login = user.login;
        token.role = user.role ?? "EDITOR";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.login = token.login;

        // Fetch fresh role from database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: parseInt(token.id as string, 10) },
            select: { role: true },
          });
          session.user.role = dbUser?.role ?? "EDITOR";
        } catch {
          session.user.role = token.role ?? "EDITOR";
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
