export const fetcher = <T>(...args: Parameters<typeof fetch>) =>
  fetch(...args).then<T>(res => res.json());

fetcher.delete = (url: string, token?: string) =>
  fetch(url, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

fetcher.post = <R, B>(url: string, body: B, token?: string) =>
  fetcher<R>(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: getHeaders(token),
  });

fetcher.patch = <R, B>(url: string, body: B, token?: string) =>
  fetcher<R>(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: getHeaders(token),
  });

fetcher.put = <R, B>(url: string, body: B, token?: string) =>
  fetcher<R>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: getHeaders(token),
  });

function getHeaders(token?: string) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('Authorization', token);
  }
  return headers;
}
