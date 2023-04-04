import { clsx } from '@/shared/lib/ui';
import Link from 'next/link';
import { ThemeToggler } from './ThemeToggler';
import { HamburgerButton } from '@/shared/ui/Button';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { log } from 'console';

// 1. Пользователь впервые посещает сайт
// 2. Установив этот факт, определяем тему по предпочтениям пользователя
// 3. Кэшируем соответствующую тему в localStorage
// 4. Выбираем ее по умолчанию при последующих отрисовках
// 5. В случае, если пользователь переключает тему, мы обновляем закэшированное значение

export type HeaderProps = {
  wide?: boolean;
};

const links = [
  { href: '/classes', text: 'Занятия' },
  { href: '/practice', text: 'Практика' },
  { href: '/bells', text: 'Звонки' },
  { href: '/for-teachers', text: 'Преподавателям' },
] as const;

export default function Header({ wide }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = useSession();

  return (
    <header className="relative z-10 bg-white border-b h-14 border-slate-200">
      <div
        className={clsx({
          'flex items-center h-full': true,
          container: !wide,
          'px-6': !!wide,
        })}
      >
        <Link href="/" className="text-sm font-semibold text-blue-400">
          RCENext
        </Link>
        <nav className="hidden ml-16 lg:block">
          <ul className="flex gap-10">
            {(session.data
              ? [...links, { href: '/admin', text: 'Админ' }]
              : links
            ).map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-black transition-colors hover:text-neutral-400"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="items-center hidden ml-auto lg:flex">
          <ThemeToggler />
        </div>
        {session.data ? (
          <button
            onClick={() => signOut()}
            className="items-center hidden ml-5 transition-colors lg:flex text-neutral-900 hover:text-neutral-400"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              fixedWidth
              className="mr-1 text-base"
            />
            <span className="text-sm font-semibold">Выйти</span>
          </button>
        ) : null}
        <HamburgerButton
          className="ml-auto lg:hidden"
          onClick={() => setIsMenuOpen(p => !p)}
        />
      </div>
    </header>
  );
}
