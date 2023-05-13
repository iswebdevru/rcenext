import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Script id="theme-onstart-script" strategy="beforeInteractive">
          {`
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
        </Script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
