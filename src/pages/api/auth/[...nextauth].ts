import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authOptions } from "~/server/auth";

import { db } from "~/server/db";

export default NextAuth({
  ...authOptions,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.email) {
            const existingUser = await db.user.findUnique({
              where: { email: credentials.email },
            });
            if (existingUser) {
              return existingUser;
            } else {
              const newUser = await db.user.create({
                data: {
                  email: credentials.email,
                  password: credentials.password,
                },
              });
              return newUser;
            }
          }
        } catch (err) {
          console.error(err);
        }
        return null;
      },
    }),
  ],
});
