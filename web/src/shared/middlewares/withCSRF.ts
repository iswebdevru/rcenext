import { createCSRF } from '../lib/csrf';
import withMiddleware from './withMiddleware';

export const withCSRF = withMiddleware(async ctx => {
  const csrf = await createCSRF(ctx.req, ctx.res);
  return { props: { csrf } };
});
