import { clsx } from '@/shared/lib/ui';
import { HamburgerButton } from '@/shared/ui/Button';
import {
  IconDefinition,
  faBell,
  faBook,
  faBuildingUser,
  faCalendarDays,
  faHouse,
  faLinesLeaning,
  faUserGroup,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

const links = [
  { href: '/admin', text: 'Главная', icon: faHouse },
  { href: '/admin/classes', text: 'Занятия', icon: faBook },
  { href: '/admin/practice', text: 'Практика', icon: faBuildingUser },
  { href: '/admin/teachers', text: 'Преподаватели', icon: faUserTie },
  { href: '/admin/groups', text: 'Группы', icon: faUserGroup },
  { href: '/admin/bells', text: 'Звонки', icon: faBell },
  { href: '/admin/calendar', text: 'Календарь', icon: faCalendarDays },
  { href: '/admin/subjects', text: 'Предметы', icon: faLinesLeaning },
] as const;

export function AdminNav() {
  const { pathname } = useRouter();
  const [isMobileViewOpened, setIsMobileViewOpened] = useState(false);
  const mobileViewRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="fixed left-0 top-14 hidden h-full w-52 border-r border-zinc-200 bg-white py-10 dark:border-zinc-700 dark:bg-zinc-800 lg:block">
        <nav>
          <ul>
            {links.map(link => (
              <AdminNavLink
                key={link.href}
                {...link}
                isActive={pathname === link.href}
              />
            ))}
          </ul>
        </nav>
      </div>
      <div className="fixed bottom-12 left-12 z-10 block lg:hidden">
        <HamburgerButton
          onClick={() => setIsMobileViewOpened(true)}
          className="h-14 w-14 rounded-full bg-blue-500 p-3 shadow-sm transition-colors hover:bg-blue-600 hover:shadow-lg dark:bg-blue-700 dark:hover:bg-blue-900"
          variant="contrast"
        />
      </div>
      <div
        className={clsx({
          'fixed top-0 left-0 z-10 block h-full w-full bg-black transition-colors lg:hidden':
            true,
          'bg-opacity-50': isMobileViewOpened,
          'invisible bg-opacity-0': !isMobileViewOpened,
        })}
        onClick={e => {
          if (
            !(e.target instanceof Node) ||
            !mobileViewRef.current?.contains(e.target)
          ) {
            setIsMobileViewOpened(false);
          }
        }}
      >
        <div
          className={clsx({
            'h-full w-52 overflow-y-auto bg-white py-16 transition-[opacity,transform] duration-300 dark:bg-zinc-900':
              true,
            '-translate-x-full opacity-0': !isMobileViewOpened,
            'translate-x-0 opacity-100': isMobileViewOpened,
          })}
          ref={mobileViewRef}
        >
          <nav>
            <ul>
              {links.map(link => (
                <AdminNavLink
                  key={link.href}
                  {...link}
                  isActive={pathname === link.href}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

type AdminNavLinkProps = {
  href: string;
  isActive: boolean;
  text: string;
  icon: IconDefinition;
};
function AdminNavLink({ href, isActive, text, icon }: AdminNavLinkProps) {
  return (
    <li className="mb-6 font-semibold">
      <Link
        href={href}
        className={clsx({
          'transition-color group hover:text-blue-500 dark:hover:text-zinc-50':
            true,
          'text-blue-500 dark:text-zinc-50': isActive,
          'text-zinc-700 dark:text-zinc-400': !isActive,
        })}
      >
        <div className="flex items-center">
          <span
            className={clsx({
              'w-[3px] origin-left self-stretch rounded-r-md bg-blue-500 transition group-hover:scale-x-100 dark:bg-zinc-50':
                true,
              'scale-x-100': isActive,
              'scale-x-0': !isActive,
            })}
          ></span>
          <FontAwesomeIcon icon={icon} size="lg" fixedWidth className="ml-3" />
          <span className="ml-5 mr-10 text-sm">{text}</span>
        </div>
      </Link>
    </li>
  );
}
