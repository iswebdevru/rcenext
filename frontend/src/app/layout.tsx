import { PropsWithChildren } from 'react';
import { Open_Sans } from 'next/font/google';
import { SWRGlobalConfig } from '@/shared/packages/swr';
import { clsx } from '@/shared/lib/ui';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import './style.css';
import { NotificationsProvider } from '@/shared/ui/Notification';
import { PortalProvider } from '@/shared/ui/Utils';
config.autoAddCss = false;

const openSans = Open_Sans({
  variable: '--font-main',
  subsets: ['cyrillic', 'latin'],
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <SWRGlobalConfig>
      <html className="h-full" lang="ru">
        <head></head>
        <body
          className={clsx(
            openSans.variable,
            'h-full font-sans dark:bg-zinc-900',
          )}
        >
          <PortalProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </PortalProvider>
        </body>
      </html>
    </SWRGlobalConfig>
  );
}

/**
 * {`
          (() => {
            let theme = localStorage.getItem('theme');
            if (!theme) {
              theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              localStorage.setItem('theme', theme);
            }
            if (theme === 'dark') {
              document.documentElement.classList.add(theme);
            }
          })()
          `}
 */
