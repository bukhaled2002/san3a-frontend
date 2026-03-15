import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminAPI, parentAPI, studentAPI, teacherAPI } from "./services/axios";
import { authConfig } from "./auth.config";

const credentialsConfig = CredentialsProvider({
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
    role: { label: "Role", type: "text" },
  },
  async authorize(credentials) {
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
      console.log(error?.response?.data);
      return null;
    }
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [credentialsConfig],
  secret: process.env.AUTH_SECRET || "Yo/0duPLAErkzTcBlgWGWR4eaVyivqU6a+M/ot0fo9c=",
});

