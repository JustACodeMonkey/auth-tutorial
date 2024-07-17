import NextAuth, { NextAuthConfig, type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from './auth.config';
import { db } from './lib/db';
import { getUserById } from './data/user';
import { UserRole } from '@prisma/client';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';

type ExtendedUser = DefaultSession['user'] & {
  role?: UserRole
}
declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

const callbacks: NextAuthConfig['callbacks'] = {
  async signIn({ user, account }) {
    // Allow OAuth without email verification
    if (account?.provider !== 'credentials') return true;

    const existingUser = await getUserById(user.id ?? '');
    if (!existingUser || !existingUser.emailVerified) return false;

    if (existingUser.isTwoFactorEnabled) {
      const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (!twoFactorConfirmation) return false;

      await db.twoFactorConfirmation.delete({
        where: {
          id: twoFactorConfirmation.id
        }
      });
    }

    return true;
  },
  async session({ session, token }) {
    if (token.sub && session.user) {
      session.user.id = token.sub;
    }
    if (token.role && session.user) {
      session.user.role = token.role as UserRole;
    }
    return session;
  },
  async jwt({ token }) {
    if (!token.sub) return token;

    const user = await getUserById(token.sub);
    if (!user) return token;

    token.role = user.role;
    return token;
  }
};

const events: NextAuthConfig['events'] = {
  async linkAccount({ user }) {
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    });
  }
};
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks,
  events,
  pages: {
    signIn: '/login',
    error: '/error',
  },
  session: {
    strategy: 'jwt'
  },
  ...authConfig,
});
