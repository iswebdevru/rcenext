import { Token } from '../contracts';
import { fetcher } from '../lib';
import { API_LOGIN, API_LOGOUT } from '../urls';

export const apiToken = {
  login(credentials: Record<'username' | 'password', string>) {
    return fetcher<Token>(API_LOGIN, {
      method: 'POST',
      headers: [['Content-Type', 'application/json']],
      body: JSON.stringify(credentials),
    });
  },
  logout(token: string) {
    return fetcher(API_LOGOUT, {
      method: 'POST',
      headers: [['Authorization', token]],
    });
  },
};
