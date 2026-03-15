import type { NextAuthConfig } from "next-auth";
import { protectedRoutes } from "./routes";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.access_token = (user as any).access_token;
      }
      if (trigger === "update") {
        return { ...token, ...session };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (token) {
        session.user = token as any;
      }
      return session;
    },
    authorized({ request, auth }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      
      const protectedRoute = protectedRoutes.find((route) => {
        return nextUrl.pathname.includes(route.path);
      });

      if (protectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
  },
  providers: [], // Defined in auth.ts
} satisfies NextAuthConfig;
