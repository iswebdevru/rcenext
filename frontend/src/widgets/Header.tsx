'use client';

import { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { clsx } from '@/shared/lib/ui';
import { HamburgerButton } from '@/shared/ui/Controls';
import { GroupSearch } from '@/features/groups';
import useTransition from 'react-transition-state';
import { Portal, ZIndex } from '@/shared/ui/Utils';
import {
  useClickOutside,
  useRegisterOutsideClickException,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { ThemeToggler } from '@/shared/ui/Theme';
import { zIndex } from '@/shared/constants';

export type HeaderProps = {
  wide?: boolean;
};

const baseLinks = [
  { href: '/', text: 'Занятия' },
  { href: '/practice', text: 'Практика' },
  { href: '/bells', text: 'Звонки' },
  { href: '/for-teachers', text: 'Преподавателям' },
] as const;

export const Header = withOutsideClickExceptionsContext(function Header({
  wide,
}: HeaderProps) {
  const mobileComponentRef = useRef<HTMLDivElement>(null);

  const [{ status }, toggleTransition] = useTransition({
    timeout: 150,
    preEnter: true,
    unmountOnExit: true,
    mountOnEnter: true,
  });

  const pathname = usePathname();

  const session = useSession();

  const links = session.data
    ? [...baseLinks, { href: '/admin', text: 'Админ' }]
    : baseLinks;

  const openMenu = () => {
    toggleTransition(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = useCallback(() => {
    toggleTransition(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useClickOutside(mobileComponentRef, closeMenu);

  return (
    <ZIndex index={zIndex.WINDOW}>
      <header
        style={{ zIndex: zIndex.WINDOW }}
        className="fixed left-0 top-0 h-14 w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div
          className={clsx('flex h-full items-center', {
            container: !wide,
            'px-6': !!wide,
          })}
        >
          <Link
            href="/"
            className="text-sm font-bold text-blue-400 dark:text-zinc-200"
          >
            Расписание РКЭ
          </Link>
          <nav className="ml-16 hidden xl:block">
            <ul className="flex gap-10">
              {links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={clsx(
                      'text-sm font-semibold transition-colors duration-75',
                      {
                        'text-primary-500 dark:text-zinc-200':
                          pathname === link.href,
                        'text-zinc-700 hover:text-primary-500 dark:text-zinc-500 dark:hover:text-zinc-200':
                          pathname !== link.href,
                      },
                    )}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto hidden sm:block">
            <GroupSearch />
          </div>
          <div className="ml-6 hidden h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 sm:block"></div>
          <div className="ml-6 hidden items-center lg:flex">
            <ThemeToggler />
          </div>
          {session.data ? (
            <div className="ml-6 hidden items-center lg:flex">
              <LogoutButton />
            </div>
          ) : null}
          <HeaderOpenButton onClick={openMenu} />
          <Portal>
            <div
              style={{ zIndex: zIndex.WINDOW }}
              className={clsx(
                'fixed left-0 top-0 block h-full w-full transition-colors sm:bg-black xl:hidden',
                {
                  'sm:bg-opacity-0':
                    status === 'preEnter' || status === 'exiting',
                  'sm:bg-opacity-40':
                    status === 'entering' || status === 'entered',
                  hidden: status === 'unmounted',
                },
              )}
            >
              <div
                className={clsx(
                  'flex h-full flex-col overflow-y-auto bg-white px-8 py-8 transition-[transform] dark:bg-zinc-950 sm:max-w-sm',
                  {
                    '-translate-x-full':
                      status === 'preEnter' || status === 'exiting',
                    'translate-x-0': status === 'entering',
                  },
                )}
                ref={mobileComponentRef}
              >
                <div className="mb-10 flex items-center">
                  <Link
                    href="/"
                    className="font-bold text-blue-400 dark:text-white"
                  >
                    Расписание РКЭ
                  </Link>
                  <HamburgerButton
                    close
                    className="ml-auto w-9 sm:ml-6 sm:hidden"
                    onClick={closeMenu}
                  />
                </div>
                <div className="mb-6 max-w-xs sm:hidden">
                  <GroupSearch />
                </div>
                <nav className="mb-6 max-w-xs">
                  <ul className="space-y-3">
                    {links.map(link => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={clsx(
                            'block w-full px-4 py-2 text-sm font-semibold transition-colors',
                            {
                              'rounded-lg bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-neutral-200':
                                link.href === pathname,
                              'text-slate-500 dark:text-neutral-200':
                                link.href !== pathname,
                            },
                          )}
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-auto flex justify-between gap-4 lg:hidden">
                  <ThemeToggler />
                  {session.data ? <LogoutButton /> : null}
                </div>
              </div>
            </div>
          </Portal>
        </div>
      </header>
    </ZIndex>
  );
});

const HeaderOpenButton = withOutsideClickExceptionsContext(
  function HeaderOpenButton({ onClick }: { onClick: () => void }) {
    const ref = useRef<HTMLButtonElement>(null);

    useRegisterOutsideClickException(ref);

    return (
      <HamburgerButton
        ref={ref}
        className="ml-auto block w-9 sm:ml-6 xl:hidden"
        onClick={onClick}
      />
    );
  },
);

function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="items-center text-slate-700 transition-colors hover:text-slate-500 dark:text-zinc-600 dark:hover:text-zinc-200"
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
