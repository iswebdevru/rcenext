'use client';

import { getSession, signOut } from 'next-auth/react';
import { fetcher } from '../lib';
import { ApiError, NoTokenError } from '../errors';

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
      const token = `Bearer ${session.access}`;
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
      } else {
        throw e;
      }
    }
  },
  async delete<U extends RequestInfo | URL>(url: U) {
    try {
      const session = await getSession();
      if (!session) {
        throw new NoTokenError();
      }
      const token = `Bearer ${session.access}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: [['Authorization', token]],
      });
      if (!res.ok) {
        throw new ApiError(res.status, {});
      }
      return res;
    } catch (e) {
      if (
        (e instanceof ApiError && e.status === 401) ||
        e instanceof NoTokenError
      ) {
        signOut({ callbackUrl: '/' });
      } else {
        throw e;
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
      const token = `Bearer ${session.access}`;
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
      } else {
        throw e;
      }
    }
  },
};
