import { getSession, signOut } from 'next-auth/react';
import { fetcher, FetcherRequestInit } from './fetcher';

async function withToken<T>(action: (session: string) => Promise<T>) {
  const session = await getSession();
  if (!session) {
    return;
  }
  return action(`Bearer ${session.accessToken.value}`);
}

async function onUnauthorized() {
  return signOut({ callbackUrl: '/' });
}

export async function createEntity<R, B>(
  input: RequestInfo | URL,
  init?: FetcherRequestInit<B>
) {
  return withToken<R>(token =>
    fetcher.post<R, B>(input, init, {
      token,
      onUnauthorized,
    })
  );
}

export async function partiallyUpdateEntity<R, B>(
  input: RequestInfo | URL,
  init?: FetcherRequestInit<B>
) {
  return withToken<R>(token =>
    fetcher.patch<R, B>(input, init, {
      token,
      onUnauthorized,
    })
  );
}

export async function updateEntity<R, B>(
  input: RequestInfo | URL,
  init?: FetcherRequestInit<B>
) {
  return withToken<R>(token =>
    fetcher.put<R, B>(input, init, {
      token,
      onUnauthorized,
    })
  );
}

export async function deleteEntity<B>(
  input: RequestInfo | URL,
  init?: FetcherRequestInit<B>
) {
  return withToken(token =>
    fetcher.delete<B>(input, init, {
      token,
      onUnauthorized,
    })
  );
}
export async function deleteEntities<B>(
  inputs: (RequestInfo | URL)[],
  init?: FetcherRequestInit<B>
) {
  return withToken(token =>
    Promise.all(
      inputs.map(input =>
        fetcher.delete<B>(input, init, {
          token,
          onUnauthorized,
        })
      )
    )
  );
}
