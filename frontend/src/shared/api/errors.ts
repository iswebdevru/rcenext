export class ApiError<T extends unknown> extends Error {
  constructor(
    public status: number,
    public body: T,
  ) {
    super();
  }
}

export class NoTokenError extends Error {}
export const REFRESH_TOKEN_EXPIRED_ERROR = 'REFRESH_TOKEN_EXPIRED_ERROR';
