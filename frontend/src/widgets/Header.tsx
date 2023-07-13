import { useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { clsx } from '@/shared/lib/ui';
import { HamburgerButton } from '@/shared/ui/controls';
import { GroupSearch } from '@/features/groups';
import useTransition, { TransitionStatus } from 'react-transition-state';
import { Portal, ZIndex, useZIndex } from '@/shared/ui/utils';

const ThemeTogglerWithNoSSR = dynamic(
  () => import('./ThemeToggler').then(module => module.ThemeToggler),
  { ssr: false },
);

export type HeaderProps = {
  wide?: boolean;
};

const baseLinks = [
  { href: '/', text: 'Занятия' },
  { href: '/practice', text: 'Практика' },
  { href: '/bells', text: 'Звонки' },
  { href: '/for-teachers', text: 'Преподавателям' },
] as const;

export default function Header({ wide }: HeaderProps) {
  const [transitionState, toggleTransition] = useTransition({
    timeout: 300,
    preEnter: true,
    unmountOnExit: true,
    mountOnEnter: true,
  });

  const session = useSession();

  const links = session.data
    ? [...baseLinks, { href: '/admin', text: 'Админ' }]
    : baseLinks;

  const openMenu = () => {
    toggleTransition(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    toggleTransition(false);
    document.body.style.overflow = '';
  };

  const zIndex = 20;

  return (
    <ZIndex index={zIndex}>
      <header
        style={{ zIndex }}
        className="fixed left-0 top-0 h-14 w-full border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
      >
        <div
          className={clsx({
            'flex h-full items-center': true,
            container: !wide,
            'px-6': !!wide,
          })}
        >
          <Link
            href="/"
            className="text-sm font-bold text-blue-400 dark:text-white"
          >
            Расписание РКЭ
          </Link>
          <nav className="ml-16 hidden xl:block">
            <ul className="flex gap-10">
              {links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600 dark:text-zinc-200 dark:hover:text-zinc-400"
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
          <div className="ml-6 hidden h-6 w-[1px] bg-zinc-200 dark:bg-zinc-700 sm:block"></div>
          <div className="ml-6 hidden items-center lg:flex">
            <ThemeTogglerWithNoSSR />
          </div>
          {session.data ? (
            <div className="ml-6 hidden items-center lg:flex">
              <LogoutButton />
            </div>
          ) : null}
          <HamburgerButton
            className="ml-auto block w-9 sm:ml-6 xl:hidden"
            onClick={openMenu}
          />
          <HeaderMobile
            isMounted={transitionState.isMounted}
            status={transitionState.status}
            onClose={closeMenu}
          />
        </div>
      </header>
    </ZIndex>
  );
}

type HeaderMobileProps = {
  isMounted: boolean;
  status: TransitionStatus;
  onClose: () => void;
};

function HeaderMobile({ isMounted, status, onClose }: HeaderMobileProps) {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const zIndex = useZIndex();

  const router = useRouter();
  const session = useSession();

  const links = session.data
    ? [...baseLinks, { href: '/admin', text: 'Админ' }]
    : baseLinks;

  return (
    <Portal>
      {isMounted ? (
        <div
          style={{ zIndex }}
          className={clsx({
            'fixed left-0 top-0 block h-full w-full bg-black transition-colors duration-300 xl:hidden':
              true,
            'bg-opacity-0': status === 'preEnter' || status === 'exiting',
            'bg-opacity-40': status === 'entering' || status === 'entered',
          })}
          onClick={e => {
            if (
              e.target instanceof Node &&
              !componentRef.current?.contains(e.target)
            ) {
              onClose();
            }
          }}
        >
          <div
            className={clsx({
              'flex h-full flex-col overflow-y-auto bg-white px-8 py-8 transition-[transform,opacity] duration-300 dark:bg-zinc-900 sm:max-w-sm':
                true,
              '-translate-x-full opacity-0':
                status === 'preEnter' || status === 'exiting',
              'translate-x-0 opacity-100': status === 'entering',
            })}
            ref={componentRef}
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
                onClick={onClose}
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
                      className={clsx({
                        'block w-full px-4 py-2 text-sm font-semibold transition-colors':
                          true,
                        'rounded-lg bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-neutral-200':
                          link.href === router.asPath,
                        'text-slate-500 dark:text-neutral-200':
                          link.href !== router.asPath,
                      })}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto flex justify-between gap-4 lg:hidden">
              <ThemeTogglerWithNoSSR />
              {session.data ? <LogoutButton /> : null}
            </div>
          </div>
        </div>
      ) : null}
    </Portal>
  );
}

function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="items-center text-slate-700 transition-colors hover:text-slate-500 dark:text-zinc-500 dark:hover:text-zinc-200"
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
