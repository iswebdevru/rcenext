import { API_LOGIN, fetcher, Token } from '@/shared/api';
import nextAuth from 'next-auth';
import { AuthOptions } from 'next-auth/core/types';
import Credentials from 'next-auth/providers/credentials';

const options: AuthOptions = {
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    Credentials({
      id: 'credentials',
      authorize: async credentials => {
        const response = await fetcher.post<Token, any>(API_LOGIN, credentials);
        if (!response.token) {
          return null;
        }
        return { id: response.token };
      },
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' },
      },
    }),
  ],
};

export default nextAuth(options);
