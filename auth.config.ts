// auth.config.ts

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isAdmin = auth?.user?.name === "Admin";
      if (!isLoggedIn && nextUrl.pathname === "/register") {
        return true;
      }
      if (!isLoggedIn && nextUrl.pathname === "/resetPassword") {
        return true;
      }
      if (!isLoggedIn && nextUrl.pathname !== "/") {
        return false;
      }
      if (isOnDashboard && isLoggedIn && !isAdmin) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
