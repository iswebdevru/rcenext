export const fetcher = <T>(...args: Parameters<typeof fetch>) =>
  fetch(...args).then<T>(res => res.json());

fetcher.delete = (url: string) =>
  fetch(url, {
    method: 'DELETE',
  });

fetcher.post = <R, B>(url: string, body: B) =>
  fetcher<R>(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

fetcher.patch = <R, B>(url: string, body: B) =>
  fetcher<R>(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

fetcher.put = <R, B>(url: string, body: B) =>
  fetcher<R>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
