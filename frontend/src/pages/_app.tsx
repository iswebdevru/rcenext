import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@/application/style.css';
import { Notifications } from '@/shared/ui/Notification';
import { clsx } from '@/shared/lib/ui';
import { openSans } from '@/shared/ui/fonts';

config.autoAddCss = false;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <div
      className={clsx({
        [openSans.variable]: true,
        'h-full font-sans': true,
      })}
    >
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <Notifications />
      </SessionProvider>
    </div>
  );
}
