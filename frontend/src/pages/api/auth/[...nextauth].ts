import nextAuth from 'next-auth';
import { AuthOptions } from 'next-auth/core/types';
import Credentials from 'next-auth/providers/credentials';
import { API_LOGIN, API_LOGOUT, fetcher, Token } from '@/shared/api';

interface WithAccessToken {
  accessToken: {
    value: string;
    exp: string;
  };
}

export const authOptions: AuthOptions = {
  session: { strategy: 'jwt', maxAge: 172800 },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      id: 'credentials',
      authorize: async credentials => {
        try {
          const data = await fetcher.post<Token, any>(API_LOGIN, {
            body: credentials,
          });
          if (!data.token) {
            return null;
          }
          return {
            id: data.token,
            accessToken: {
              exp: data.expiry,
              value: data.token,
            },
          };
        } catch (e) {
          return null;
        }
      },
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' },
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      return fetcher.post(API_LOGOUT, undefined, {
        token: token.accessToken.value,
      });
    },
  },
};

declare module 'next-auth' {
  interface User extends WithAccessToken {}
  interface Session extends WithAccessToken {}
}

declare module 'next-auth/jwt' {
  interface JWT extends WithAccessToken {}
}

export default nextAuth(authOptions);
