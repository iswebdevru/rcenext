import Tokens from 'csrf';
import getSession from './session';

export const csrfTokens = new Tokens();

export async function createCSRF(...[req, res]: Parameters<typeof getSession>) {
  const [session, csrfSecret] = await Promise.all([
    getSession(req, res),
    csrfTokens.secret(),
  ]);
  session.csrfSecret = csrfSecret;
  await session.commit();
  return csrfTokens.create(csrfSecret);
}
