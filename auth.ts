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
    const baseURL =
      credentials?.role === "student"
        ? process.env.STUDENT_API
        : credentials?.role === "parent"
          ? process.env.PARENT_API
          : credentials?.role === "teacher"
            ? process.env.TEACHER_API
            : process.env.ADMIN_API;

    const res = await fetch(`${baseURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials?.username,
        password: credentials?.password,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return { ...data, role: credentials?.role };
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [credentialsConfig],
});

