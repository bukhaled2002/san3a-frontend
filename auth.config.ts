import type { NextAuthConfig } from "next-auth";
import { protectedRoutes } from "./routes";

export const authConfig = {
  pages: {
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
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
  providers: [], // Add empty providers to satisfy NextAuthConfig, or add them here if they are edge-compatible
} satisfies NextAuthConfig;
