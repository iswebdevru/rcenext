import nextSession from 'next-session';
import { expressSession, promisifyStore } from 'next-session/lib/compat';
import RedisStoreFactory from 'connect-redis';
import { Redis } from 'ioredis';

const redis = new Redis({
  port: 6668,
  connectTimeout: 10000,
});

export type SessionData = {
  csrfSecret: string;
};

const RedisStore = RedisStoreFactory(expressSession);

const getSession = nextSession<SessionData>({
  autoCommit: false,
  cookie: {
    sameSite: 'lax',
  },
  store: promisifyStore(new RedisStore({ client: redis })),
});

export default getSession;
