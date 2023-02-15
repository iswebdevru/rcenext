import type { AppProps } from 'next/app';
import '@/application/style.css';
import Header from '@/widgets/header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
