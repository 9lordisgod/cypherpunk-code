import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isDevLoginAllowed, verifyAdminPassword } from "@/lib/auth-production";
import { prisma } from "@/lib/db";

const devLoginEnabled = isDevLoginAllowed();
const adminEmail = process.env.ADMIN_EMAIL ?? "admin@cypherpunk-code.ca";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      id: "wallet",
      name: "Wallet",
      credentials: {
        loginTicket: { label: "Login ticket", type: "text" },
      },
      async authorize(credentials) {
        const loginTicket = credentials?.loginTicket?.toString().trim();
        if (!loginTicket) return null;

        const record = await prisma.verificationToken.findFirst({
          where: {
            identifier: `wallet-login:${loginTicket}`,
            expires: { gt: new Date() },
          },
        });

        if (!record) return null;

        await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier: record.identifier,
              token: record.token,
            },
          },
        });

        const user = await prisma.user.findUnique({ where: { id: record.token } });
        if (!user || user.role === "admin") return null;

        return {
          id: user.id,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString() ?? "";
        const configuredPassword = process.env.ADMIN_PASSWORD;

        if (!email || !password || !configuredPassword) return null;
        if (email !== adminEmail.toLowerCase()) return null;

        if (!(await verifyAdminPassword(password, configuredPassword))) return null;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, name: "Admin", role: "admin" },
          });
        } else if (user.role !== "admin") {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: "admin" },
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