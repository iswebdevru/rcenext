import { BaseLayout } from '@/layouts';
import Head from 'next/head';

export default function Home() {
  return (
    <BaseLayout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="m-4 text-2xl text-center dark:text-white">
        Hello, RCENEXT!
      </h1>
    </BaseLayout>
  );
}
