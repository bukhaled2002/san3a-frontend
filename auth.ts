import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { protectedRoutes } from "./routes";


const credentialsConfig = CredentialsProvider({
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
    role: { label: "Role", type: "text" },
  },
  async authorize(credentials) {
    console.log(credentials);
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
