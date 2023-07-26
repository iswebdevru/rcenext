import { JWT } from 'next-auth/jwt';
import { fetcher } from '../lib';
import { API_LOGIN, API_REFRESH_TOKEN, API_VERIFY_TOKEN } from '../urls';
import { REFRESH_TOKEN_EXPIRED_ERROR } from '../errors';

export type LoginBody = {
  username: string;
  password: string;
};

export type TokenPair = {
  access: string;
  refresh: string;
};

export type TokenRefreshed = {
  access: string;
};

/**
 * Server only API
 */
export const apiAuth = {
  async login(credentials: LoginBody) {
    try {
      return await fetcher<TokenPair>(API_LOGIN, {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify(credentials),
      });
    } catch (e) {
      return null;
    }
  },
  async refresh(tokenPair: TokenPair): Promise<JWT> {
    try {
      const { access } = await fetcher<TokenRefreshed>(API_REFRESH_TOKEN, {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({ refresh: tokenPair.refresh }),
      });
      return {
        access,
        refresh: tokenPair.refresh,
      };
    } catch (e) {
      return {
        ...tokenPair,
        error: REFRESH_TOKEN_EXPIRED_ERROR,
      };
    }
  },
  async verify(accessToken: string) {
    try {
      await fetcher(API_VERIFY_TOKEN, {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({ token: accessToken }),
      });
      return true;
    } catch (e) {
      return false;
    }
  },
};
