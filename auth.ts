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
    console.log(credentials);
    const api =
      credentials?.role === "student"
        ? studentAPI
        : credentials?.role === "parent"
          ? parentAPI
          : credentials?.role === "teacher"
            ? teacherAPI
            : adminAPI;
    try {
      const response = await api.post("/login", {
        username: credentials?.username,
        password: credentials?.password,
      });
      if (response.status === 200 || response.status === 201) {
        return { ...response.data, role: credentials?.role };
      } else {
        return null;
      }
    } catch (error: any) {
      console.log(error.response.data);
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
