import NextAuth from 'next-auth';
import { authOptions } from '@/shared/packages/next-auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };