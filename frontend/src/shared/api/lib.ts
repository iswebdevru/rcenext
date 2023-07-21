import { getSession } from 'next-auth/react';

export class ApiError<T extends unknown> extends Error {
  constructor(
    public status: number,
    public body: T,
  ) {
    super();
  }
}

export class NoTokenError extends Error {}

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
  return action(`Bearer ${session.accessToken.value}`);
}
