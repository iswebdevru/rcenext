export type NextServerURLSearchParams = {
  [key: string]: string | string[] | undefined;
};

export type NextPageWithSearchParams<T = unknown> = T & {
  searchParams: NextServerURLSearchParams;
};
