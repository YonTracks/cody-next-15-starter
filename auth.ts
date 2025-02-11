import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
// import type { User } from "@/lib/definitions";
// import { ensureUsersTableExists } from "./lib/actions";
// import bcrypt from "bcrypt";

/*
async function getUser(email: string): Promise<User | undefined> {
  try {
    await ensureUsersTableExists();

    const { rows } = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
*/
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error("Invalid credentials");
        }
        const { email, password } = parsedCredentials.data;

        // Add logic here to look up the user from your database
        // const user = await getUser(email);
        const user = { id: 1, name: "new user", email: email };

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found");
        }
        // Check if the provided password matches the stored one.
        /* const passwordsMatch = await bcrypt.compare(password, user.password);
           if (passwordsMatch) {
            return user;
          } else {
            throw new Error("Invalid password");
          } */
        if (
          parsedCredentials.data.email === user.email &&
          parsedCredentials.data.password === password
        ) {
          return user;
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
});
