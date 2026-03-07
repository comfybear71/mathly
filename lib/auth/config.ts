import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { getUserByEmail, createUser, initializeUserRecords } from '@/lib/db/database';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email as string);
        if (!user || !user.password_hash) return null;

        const isValid = await compare(credentials.password as string, user.password_hash);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.display_name, image: user.avatar_url };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const existing = await getUserByEmail(user.email);
        if (!existing) {
          const username = (user.email.split('@')[0] || 'user') + Math.floor(Math.random() * 1000);
          const newUser = await createUser({
            email: user.email,
            username,
            display_name: user.name || username,
            avatar_url: user.image || null,
          });
          await initializeUserRecords(newUser.id);
          user.id = newUser.id;
        } else {
          user.id = existing.id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.userId = user.id;
      }
      if (user?.email && !token.userId) {
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) token.userId = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});
