import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Este proyecto usa Supabase Auth directamente, no NextAuth
        // Este provider está aquí para compatibilidad pero no se usa
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // La autenticación se maneja en /dashboard/login y /student/login
        // usando Supabase Auth directamente
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/dashboard/login',
  },
  session: {
    strategy: 'jwt',
  },
};

