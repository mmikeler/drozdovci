import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      login: string;
      role: string;
    };
  }

  interface User {
    id: string;
    login: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    login: string;
    role: string;
  }
}
