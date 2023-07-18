import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { clsx } from '@/shared/lib/ui';
import { openSans } from '@/shared/ui/fonts';

import '@/application/style.css';

config.autoAddCss = false;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <div className={clsx(openSans.variable, 'h-full, font-sans')}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <div id="__portal"></div>
    </div>
  );
}
