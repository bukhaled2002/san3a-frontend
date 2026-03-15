import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminAPI, parentAPI, studentAPI, teacherAPI } from "./services/axios";
import { protectedRoutes } from "./routes";

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

const config = {
  providers: [credentialsConfig],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) token.role = user.role;
      if (trigger === "update") {
        return { ...token, ...session };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      session.user.role = token.role;
      return session;
    },
    authorized({ request, auth }) {
      const protectedRoute = protectedRoutes.find((route) => {
        return request.nextUrl.pathname.includes(route.path);
      });
      if (protectedRoute && !auth) {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
  secret: "Yo/0duPLAErkzTcBlgWGWR4eaVyivqU6a+M/ot0fo9c=",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...config,
});
