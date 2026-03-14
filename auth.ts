import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const credentialsConfig = CredentialsProvider({
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
    role: { label: "Role", type: "text" },
  },
  async authorize(credentials) {
    const baseURL = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;
    const endpoint =
      credentials?.role === "student"
        ? "/student/login"
        : credentials?.role === "parent"
        ? "/parent/login"
        : credentials?.role === "teacher"
        ? "/teacher/login"
        : "/admin/login";

    try {
      const response = await fetch(baseURL + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials?.username,
          password: credentials?.password,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return { ...data, role: credentials?.role };
    } catch (error: any) {
      console.error("Auth error:", error);
      return null;
    }
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [credentialsConfig],
  secret: process.env.AUTH_SECRET || "Yo/0duPLAErkzTcBlgWGWR4eaVyivqU6a+M/ot0fo9c=",
});

