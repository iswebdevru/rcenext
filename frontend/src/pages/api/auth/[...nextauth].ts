import nextAuth from 'next-auth';
import { AuthOptions } from 'next-auth/core/types';
import Credentials from 'next-auth/providers/credentials';
import { apiAuth, TokenPair } from '@/shared/api';
import { REFRESH_TOKEN_EXPIRED_ERROR } from '@/shared/api/errors';

export const authOptions: AuthOptions = {
  session: { strategy: 'jwt', maxAge: 172800 },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      id: 'credentials',
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' },
      },
      authorize: async credentials => {
        if (!credentials) {
          return null;
        }
        const tokenPair = await apiAuth.login(credentials);
        if (!tokenPair) {
          return null;
        }
        return {
          id: tokenPair.access,
          ...tokenPair,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // First login
        return {
          access: user.access,
          refresh: user.refresh,
        };
      }
      const isTokenStillValid = await apiAuth.verify(token.access);
      if (isTokenStillValid) {
        return token;
      }
      return apiAuth.refresh(token);
    },
    session({ session, token }) {
      session.access = token.access;
      session.error = token.error;
      return session;
    },
  },
};

declare module 'next-auth' {
  interface User extends TokenPair {}
  interface Session {
    access: string;
    error?: typeof REFRESH_TOKEN_EXPIRED_ERROR;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends TokenPair {
    error?: typeof REFRESH_TOKEN_EXPIRED_ERROR;
  }
}

export default nextAuth(authOptions);
