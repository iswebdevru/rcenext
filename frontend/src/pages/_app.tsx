import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { clsx } from '@/shared/lib/ui';
import { openSans } from '@/shared/ui/fonts';
import '@/application/style.css';
import Head from 'next/head';
import { SWRConfig } from '@/shared/swr';
import { NotificationsProvider } from '@/shared/ui/Notification';

config.autoAddCss = false;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SWRConfig>
      <SessionProvider session={session}>
        <NotificationsProvider>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <div className={clsx(openSans.variable, 'h-full font-sans')}>
            <Component {...pageProps} />
            <div id="__portal"></div>
          </div>
        </NotificationsProvider>
      </SessionProvider>
    </SWRConfig>
  );
}
