export type FetcherExtraArgs = {
  onUnauthorized?: (res: Response) => Promise<void>;
  token?: string;
};

export type FetcherRequestInit<B> = {
  body?: B;
} & Omit<RequestInit, 'body'>;

export const fetcher = async <R>(
  input: RequestInfo | URL,
  init?: RequestInit,
  extra?: FetcherExtraArgs
) => {
  return (await fetcher.any(input, init, extra)).json() as R;
};

fetcher.delete = <B>(
  input: RequestInfo | URL,
  args?: FetcherRequestInit<B>,
  extra?: FetcherExtraArgs
) => fetcher.any<B>(input, { method: 'DELETE', ...args }, extra);

fetcher.post = <R, B>(
  input: RequestInfo | URL,
  init?: FetcherRequestInit<B>,
  extra?: FetcherExtraArgs
) =>
  fetcher
    .any<B>(input, { method: 'POST', ...init }, extra)
    .then(res => res.json()) as Promise<R>;

fetcher.patch = <R, B>(
  input: RequestInfo | URL,
  args?: FetcherRequestInit<B>,
  extra?: FetcherExtraArgs
) =>
  fetcher
    .any<B>(input, { method: 'PATCH', ...args }, extra)
    .then(res => res.json()) as Promise<R>;

fetcher.put = <R, B>(
  input: RequestInfo | URL,
  args?: FetcherRequestInit<B>,
  extra?: FetcherExtraArgs
) =>
  fetcher
    .any<B>(input, { method: 'PUT', ...args }, extra)
    .then(res => res.json()) as Promise<R>;

fetcher.any = async <B>(
  input: RequestInfo | URL,
  init?: FetcherRequestInit<B>,
  extra?: FetcherExtraArgs
) => {
  const headers: [string, string][] = [];
  let options: RequestInit = {};
  let bodyObj: B | undefined;
  if (init) {
    const { body, ...rest } = init;
    bodyObj = body;
    options = rest;
  }
  if (bodyObj) {
    headers.push(['Content-Type', 'application/json']);
    options.body = JSON.stringify(bodyObj);
  }
  if (extra?.token) {
    headers.push(['Authorization', extra.token]);
  }
  options.headers = extendHeaders(options.headers, headers);
  const res = await fetch(input, options);
  if (extra?.onUnauthorized && res.status === 401) {
    extra.onUnauthorized(res);
  }
  return res;
};

function extendHeaders(
  headers?: HeadersInit,
  headersToAdd?: [string, string][]
): HeadersInit | undefined {
  if (!headers) {
    return headersToAdd;
  }
  if (!headersToAdd) {
    return headers;
  }
  if (Array.isArray(headers)) {
    return [...headers, ...headersToAdd];
  }
  if (headers instanceof Headers) {
    for (const [name, value] of headersToAdd) {
      headers.append(name, value);
    }
    return headers;
  }
  for (const [name, value] of headersToAdd) {
    headers[name] = value;
  }
  return headers;
}
