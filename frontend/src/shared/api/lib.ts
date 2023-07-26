import { getSession } from 'next-auth/react';
import { ErrorsMap } from './contracts';
import { ApiError } from './errors';

/**
 * Small utility over a built-in `fetch`.
 * 1. Automatically convert response to JSON
 * 2. Throw an error if response isn't `ok`
 * 3. Type response by providing generic
 */
export const fetcher = <T extends unknown>(...args: Parameters<typeof fetch>) =>
  fetch(...args).then(async res => {
    if (!res.ok) {
      const body = await res.json();
      throw new ApiError(res.status, body);
    }
    return res.json() as T;
  });

export async function withToken<T>(action: (session: string) => Promise<T>) {
  const session = await getSession();
  if (!session) {
    return;
  }
  return action(`Bearer ${session.access}`);
}

export function isErrorMap(body: unknown): body is ErrorsMap {
  return (
    typeof body === 'object' &&
    body !== null &&
    !Object.values(body).some(value => !Array.isArray(value))
  );
}
