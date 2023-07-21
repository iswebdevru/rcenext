import nextAuth from 'next-auth';
import { AuthOptions } from 'next-auth/core/types';
import Credentials from 'next-auth/providers/credentials';
import { apiToken } from '@/shared/api';

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
        if (!credentials) {
          return null;
        }
        try {
          const data = await apiToken.login(credentials);
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
      await apiToken.logout(token.accessToken.value);
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
