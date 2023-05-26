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

  console.log(isMobileViewOpened);

  return (
    <>
      <div className="fixed left-0 hidden h-full py-10 bg-white border-r w-52 lg:block top-14 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
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
      <div className="fixed z-10 block lg:hidden bottom-12 left-12">
        <HamburgerButton
          onClick={() => setIsMobileViewOpened(true)}
          className="p-3 transition-colors bg-blue-500 rounded-full shadow-sm w-14 h-14 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-900 hover:shadow-lg"
          variant="contrast"
        />
      </div>
      <div
        className={clsx({
          'fixed top-0 left-0 z-10 block w-full h-full transition-colors bg-black lg:hidden':
            true,
          'bg-opacity-50': isMobileViewOpened,
          'bg-opacity-0 invisible': !isMobileViewOpened,
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
            'h-full py-16 overflow-y-auto bg-white dark:bg-zinc-900 w-52 transition-[opacity,transform] duration-300':
              true,
            'opacity-0 -translate-x-full': !isMobileViewOpened,
            'opacity-100 translate-x-0': isMobileViewOpened,
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
          'group transition-color hover:text-blue-500 dark:hover:text-zinc-50':
            true,
          'text-blue-500 dark:text-zinc-50': isActive,
          'text-zinc-700 dark:text-zinc-400': !isActive,
        })}
      >
        <div className="flex items-center">
          <span
            className={clsx({
              'w-[3px] rounded-r-md self-stretch bg-blue-500 transition origin-left group-hover:scale-x-100 dark:bg-zinc-50':
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
