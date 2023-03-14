export const fetcher = <T>(...args: Parameters<typeof fetch>) =>
  fetch(...args).then<T>(res => res.json());
