import { csrfTokens } from '@/shared/lib/csrf';
import getSession from '@/shared/lib/session';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession(req, res);
  if (req.method !== 'POST') {
    res.status(404).json({ reason: '' });
    return;
  }
  console.log(req.body);
  console.log(req.body.csrf);
  console.log(csrfTokens.verify(session.csrfSecret, req.body.csrf));

  return res.json({ result: true });
};

export default handler;
