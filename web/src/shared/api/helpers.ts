import { Session } from 'next-auth';

export function formatToken(session: Session) {
  return `Token ${session.accessToken.value}`;
}
