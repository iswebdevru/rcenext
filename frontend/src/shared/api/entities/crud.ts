'use client';

import { getSession, signOut } from 'next-auth/react';
import { ApiError, NoTokenError, fetcher } from '../lib';

export const crud = {
  async post<U extends RequestInfo | URL, B extends unknown, R extends unknown>(
    url: U,
    body: B,
  ) {
    try {
      const session = await getSession();
      if (!session) {
        throw new NoTokenError();
      }
      const token = `Bearer ${session.accessToken.value}`;
      return await fetcher<R>(url, {
        method: 'POST',
        headers: [
          ['Content-Type', 'application/json'],
          ['Authorization', token],
        ],
        body: JSON.stringify(body),
      });
    } catch (e) {
      if (
        (e instanceof ApiError && e.status === 401) ||
        e instanceof NoTokenError
      ) {
        signOut({ callbackUrl: '/' });
      }
    }
  },
  async delete<U extends RequestInfo | URL>(url: U) {
    try {
      const session = await getSession();
      if (!session) {
        throw new NoTokenError();
      }
      const token = `Bearer ${session.accessToken.value}`;
      return await fetcher<void>(url, {
        method: 'DELETE',
        headers: [['Authorization', token]],
      });
    } catch (e) {
      if (
        (e instanceof ApiError && e.status === 401) ||
        e instanceof NoTokenError
      ) {
        signOut({ callbackUrl: '/' });
      }
    }
  },
  async patch<
    U extends RequestInfo | URL,
    B extends unknown,
    R extends unknown,
  >(url: U, body: B) {
    try {
      const session = await getSession();
      if (!session) {
        throw new NoTokenError();
      }
      const token = `Bearer ${session.accessToken.value}`;
      return await fetcher<R>(url, {
        method: 'PATCH',
        headers: [
          ['Content-Type', 'application/json'],
          ['Authorization', token],
        ],
        body: JSON.stringify(body),
      });
    } catch (e) {
      if (
        (e instanceof ApiError && e.status === 401) ||
        e instanceof NoTokenError
      ) {
        signOut({ callbackUrl: '/' });
      }
    }
  },
};
