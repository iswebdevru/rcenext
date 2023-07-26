import { TokenPair, REFRESH_TOKEN_EXPIRED_ERROR } from '@/shared/api';

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
