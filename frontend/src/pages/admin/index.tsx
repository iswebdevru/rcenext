import { AdminLayout } from '@/layouts';
import Head from 'next/head';

export default function index() {
  return (
    <>
      <Head>
        <title>Админ</title>
      </Head>
      <AdminLayout></AdminLayout>
    </>
  );
}
