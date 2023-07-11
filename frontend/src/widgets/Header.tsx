import { useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { clsx } from '@/shared/lib/ui';
import { HamburgerButton } from '@/shared/ui/controls/Button';
import { GroupSearch } from '@/features/groups';

const ThemeTogglerWithNoSSR = dynamic(
  () => import('./ThemeToggler').then(module => module.ThemeToggler),
  { ssr: false }
);

export type HeaderProps = {
  wide?: boolean;
  fixed?: boolean;
};

const baseLinks = [
  { href: '/', text: 'Занятия' },
  { href: '/practice', text: 'Практика' },
  { href: '/bells', text: 'Звонки' },
  { href: '/for-teachers', text: 'Преподавателям' },
] as const;

export default function Header({ wide, fixed = false }: HeaderProps) {
  const router = useRouter();
  const [isMenuOpened, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const session = useSession();

  const links = session.data
    ? [...baseLinks, { href: '/admin', text: 'Админ' }]
    : baseLinks;

  return (
    <header>
      <div
        className={clsx({
          'z-10 border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800':
            true,
          '': true,
          relative: !fixed,
          'fixed left-0 top-0 w-full': fixed,
        })}
      >
        <div
          className={clsx({
            'flex h-14 items-center': true,
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
            onClick={() => setIsMenuOpen(p => !p)}
          />
        </div>
      </div>
      {/* Mobile view */}
      <div
        className={clsx({
          'fixed left-0 top-0 z-10 block h-full w-full bg-black transition-colors duration-300 xl:hidden':
            true,
          'bg-opacity-50': isMenuOpened,
          'invisible bg-opacity-0': !isMenuOpened,
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
            'flex h-full max-w-[260px] flex-col gap-6 overflow-y-auto bg-white px-6 py-8 transition-[transform,opacity] duration-300 dark:bg-zinc-900 sm:max-w-xs':
              true,
            '-translate-x-full opacity-0': !isMenuOpened,
            'translate-x-0 opacity-100': isMenuOpened,
          })}
          ref={mobileMenuRef}
        >
          <Link href="/" className="font-bold text-blue-400 dark:text-white">
            Расписание РКЭ
          </Link>
          <div className="sm:hidden">
            <GroupSearch />
          </div>
          <nav>
            <ul className="flex flex-col gap-3">
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
    </header>
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
