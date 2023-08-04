import { PropsWithChildren } from 'react';
import { Open_Sans } from 'next/font/google';
import { SWRGlobalConfig } from '@/shared/packages/swr';
import { clsx } from '@/shared/lib/ui';
import { NotificationsProvider } from '@/shared/ui/Notification';
import { PortalProvider } from '@/shared/ui/Utils';
import { ThemeProvider } from '@/shared/ui/Theme';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import './style.css';
import { cookies } from 'next/headers';
import { Metadata } from 'next';

config.autoAddCss = false;

const openSans = Open_Sans({
  variable: '--font-main',
  subsets: ['cyrillic', 'latin'],
});

export default function Layout({ children }: PropsWithChildren) {
  const theme = cookies().get('theme')?.value;

  return (
    <html className={clsx('h-full', theme === 'dark' && 'dark')} lang="ru">
      <SWRGlobalConfig>
        <ThemeProvider theme={theme}>
          <body
            className={clsx(
              openSans.variable,
              'h-full font-sans dark:bg-zinc-950',
            )}
          >
            <PortalProvider>
              <NotificationsProvider>{children}</NotificationsProvider>
            </PortalProvider>
          </body>
        </ThemeProvider>
      </SWRGlobalConfig>
    </html>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: {
      default: 'РКЭ',
      template: '%s | РКЭ',
    },
    description:
      'Расписанием занятий и звонков Рязанского Колледжа Электроники',
    generator: 'Next.js',
    applicationName: 'Расписание РКЭ',
    keywords: ['ркэ', 'расписание', 'пары', 'звонки', 'занятия'],
    colorScheme: cookies().get('theme')?.value === 'dark' ? 'dark' : 'light',
    themeColor: '#09090b',
  };
}
