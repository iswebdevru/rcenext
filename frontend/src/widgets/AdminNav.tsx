import { clsx } from '@/shared/lib/ui';
import {
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

  return (
    <div className="h-full py-10 bg-white border-r border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
      <nav>
        <ul>
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <li className="mb-6 font-semibold" key={link.href}>
                <Link
                  href={link.href}
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
                        'w-[2px] self-stretch bg-blue-500 transition origin-left group-hover:scale-x-100 dark:bg-zinc-50':
                          true,
                        'scale-x-100': isActive,
                        'scale-x-0': !isActive,
                      })}
                    ></span>
                    <FontAwesomeIcon
                      icon={link.icon}
                      size="lg"
                      fixedWidth
                      className="ml-3"
                    />
                    <span className="ml-5 mr-10 text-sm">{link.text}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
