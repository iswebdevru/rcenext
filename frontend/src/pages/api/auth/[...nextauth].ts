import NextAuth from 'next-auth/next';
import { authOptions } from '@/shared/packages/next-auth';

export default NextAuth(authOptions);
