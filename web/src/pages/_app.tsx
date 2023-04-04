import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Open_Sans } from '@next/font/google';
import '@/application/style.css';
import { clsx } from '@/shared/lib/ui';

const montserrat = Open_Sans({
  variable: '--font-main',
  subsets: ['cyrillic', 'latin'],
});
config.autoAddCss = false;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div
        className={clsx({
          [montserrat.variable]: true,
          'h-full font-sans': true,
        })}
      >
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
