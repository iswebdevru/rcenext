// TODO: FIX DELETE METHOD

type FetcherExtraArgs = {
  onResponse?: (res: Response) => void;
};

type FetcherProtectedArgs<B> = {
  method: string;
  body?: B;
  token?: string;
  onUnauthorized?: (res: Response) => Promise<void>;
};

type FetcherActionArgs<B> = Omit<FetcherProtectedArgs<B>, 'method'>;

export const fetcher = <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  extra?: FetcherExtraArgs
) =>
  fetch(input, init).then<T>(res => {
    extra?.onResponse && extra.onResponse(res);
    return res.json();
  });

fetcher.delete = <R, B>(url: string, args?: FetcherActionArgs<B>) =>
  fetcher.protected(url, { method: 'DELETE', ...args });

fetcher.post = <R, B>(url: string, args?: FetcherActionArgs<B>) =>
  fetcher.protected<R, B>(url, { method: 'POST', ...args });

fetcher.patch = <R, B>(url: string, args?: FetcherActionArgs<B>) =>
  fetcher.protected<R, B>(url, { method: 'PATCH', ...args });

fetcher.put = <R, B>(url: string, args?: FetcherActionArgs<B>) =>
  fetcher.protected<R, B>(url, { method: 'PUT', ...args });

fetcher.protected = <R, B>(
  url: string,
  { method, body, token, onUnauthorized }: FetcherProtectedArgs<B>
) => {
  const headers = new Headers();
  const reqInit: RequestInit = {
    method,
    headers,
  };

  if (body) {
    headers.append('Content-Type', 'application/json');
    reqInit.body = JSON.stringify(body);
  }
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  return fetcher<R>(url, reqInit, {
    onResponse: res => {
      if (res.status === 401 && onUnauthorized) {
        return onUnauthorized(res);
      }
    },
  });
};
