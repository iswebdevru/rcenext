import type { AppProps } from 'next/app';
import '@/application/style.css';
import Header from '@/widgets/header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <Component {...pageProps} />
    </div>
  );
}
