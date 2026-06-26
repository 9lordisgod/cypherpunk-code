import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyAdminCredentials } from "@/lib/auth/admin-credentials";
import { isDevLoginAllowed } from "@/lib/auth-production";
import { ensureCanonicalAuthEnv } from "@/lib/canonical-site";
import { prisma } from "@/lib/db";

ensureCanonicalAuthEnv();

const devLoginEnabled = isDevLoginAllowed();

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase() ?? "";
        const password = credentials?.password?.toString() ?? "";

        if (!email || !password) return null;
        if (!(await verifyAdminCredentials(email, password))) return null;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, name: "Admin", role: "admin" },
          });
        } else if (user.role !== "admin") {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: "admin", name: user.name ?? "Admin" },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    ...(devLoginEnabled
      ? [
          Credentials({
            id: "dev",
            name: "Dev Login",
            credentials: {
              email: { label: "Email", type: "email" },
              name: { label: "Name", type: "text" },
            },
            async authorize(credentials) {
              const email = credentials?.email?.toString().trim().toLowerCase();
              const name = credentials?.name?.toString().trim() || "Learner";

              if (!email) return null;

              let user = await prisma.user.findUnique({ where: { email } });
              if (!user) {
                user = await prisma.user.create({
                  data: { email, name, role: "learner" },
                });
              }

              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "learner";
      } else if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "learner";
      }
      return session;
    },
  },
  trustHost: true,
});