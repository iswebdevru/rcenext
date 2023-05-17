import Link from 'next/link';
import dynamic from 'next/dynamic';
import { clsx } from '@/shared/lib/ui';
import { HamburgerButton } from '@/shared/ui/Button';
// import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { InputSearch } from '@/shared/ui/Input';
import { useRef, useState } from 'react';

const ThemeTogglerWithNoSSR = dynamic(
  () => import('./ThemeToggler').then(module => module.ThemeToggler),
  { ssr: false }
);

export type HeaderProps = {
  wide?: boolean;
};

const baseLinks = [
  { href: '/classes', text: 'Занятия' },
  { href: '/practice', text: 'Практика' },
  { href: '/bells', text: 'Звонки' },
  { href: '/for-teachers', text: 'Преподавателям' },
] as const;

export default function Header({ wide }: HeaderProps) {
  const [isMenuOpened, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const session = useSession();

  const links = session.data
    ? [...baseLinks, { href: '/admin', text: 'Админ' }]
    : baseLinks;

  return (
    <header className="relative z-10 bg-white border-b h-14 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
      <div
        className={clsx({
          'flex items-center h-full': true,
          container: !wide,
          'px-6': !!wide,
        })}
      >
        <Link
          href="/"
          className="text-sm font-bold text-blue-400 dark:text-white"
        >
          RCENext
        </Link>
        <nav className="hidden ml-16 xl:block">
          <ul className="flex gap-10">
            {links.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-semibold transition-colors text-slate-700 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-zinc-400"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden ml-auto sm:block">
          <InputSearch placeholder="Группа" />
        </div>
        <div className="w-[1px] h-6 ml-6 bg-zinc-200 dark:bg-zinc-700 hidden sm:block"></div>
        <div className="items-center hidden ml-6 lg:flex">
          <ThemeTogglerWithNoSSR />
        </div>
        {session.data ? (
          <div className="items-center hidden ml-6 lg:flex">
            <LogoutButton />
          </div>
        ) : null}
        <HamburgerButton
          className="block ml-auto sm:ml-6 xl:hidden"
          onClick={() => setIsMenuOpen(p => !p)}
        />
      </div>
      {/* Mobile view */}
      <div
        className={clsx({
          'xl:hidden block fixed z-30 left-0 top-0 w-full h-full bg-black bg bg-opacity-50 backdrop-blur-sm transition-opacity duration-300':
            true,
          'opacity-100': isMenuOpened,
          'opacity-0 pointer-events-none': !isMenuOpened,
        })}
        onClick={e => {
          if (
            !(e.target instanceof Node) ||
            !mobileMenuRef.current?.contains(e.target)
          ) {
            setIsMenuOpen(false);
          }
        }}
      >
        <div
          className={clsx({
            'flex flex-col h-full max-w-[260px] sm:max-w-xs gap-6 px-8 py-10 bg-white dark:bg-zinc-800 transition-[transform,opacity] duration-300':
              true,
            '-translate-x-full scale-y-150 opacity-80': !isMenuOpened,
            'translate-x-0 scale-y-100 opacity-100': isMenuOpened,
          })}
          ref={mobileMenuRef}
        >
          <Link
            href="/"
            className="text-sm font-bold text-blue-400 dark:text-white"
          >
            RCENext
          </Link>
          <div className="sm:hidden">
            <InputSearch placeholder="Группа" />
          </div>
          <nav>
            <ul className="flex flex-col gap-4">
              {links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold transition-colors text-slate-700 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-zinc-400"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex justify-between gap-4 mt-auto lg:hidden">
            <ThemeTogglerWithNoSSR />
            {session.data ? <LogoutButton /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}

function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="items-center transition-colors text-slate-900 hover:text-slate-500 dark:text-zinc-500 dark:hover:text-zinc-200"
    >
      <FontAwesomeIcon
        icon={faRightFromBracket}
        fixedWidth
        className="mr-1 text-base"
      />
      <span className="text-sm font-semibold">Выйти</span>
    </button>
  );
}
