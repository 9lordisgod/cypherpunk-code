import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isDevLoginAllowed } from "@/lib/auth-production";
import { ensureCanonicalAuthEnv } from "@/lib/canonical-site";
import { prisma } from "@/lib/db";

ensureCanonicalAuthEnv();

const devLoginEnabled = isDevLoginAllowed();

async function consumeLoginTicket(identifierPrefix: string, loginTicket: string) {
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: `${identifierPrefix}:${loginTicket}`,
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

  return record.token;
}

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

        const userId = await consumeLoginTicket("wallet-login", loginTicket);
        if (!userId) return null;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role === "admin") return null;

        return {
          id: user.id,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "admin-wallet",
      name: "Admin Wallet",
      credentials: {
        loginTicket: { label: "Admin login ticket", type: "text" },
      },
      async authorize(credentials) {
        const loginTicket = credentials?.loginTicket?.toString().trim();
        if (!loginTicket) return null;

        const userId = await consumeLoginTicket("admin-wallet-login", loginTicket);
        if (!userId) return null;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== "admin") return null;

        return {
          id: user.id,
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