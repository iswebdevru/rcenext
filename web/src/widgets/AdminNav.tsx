import { clsx } from '@/shared/lib/ui';
import {
  faBell,
  faBook,
  faBuildingUser,
  faCalendarDays,
  faHouse,
  faUserGroup,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { href: '/dashboard', text: 'Главная', icon: faHouse },
  { href: '/dashboard/classes', text: 'Занятия', icon: faBook },
  { href: '/dashboard/practice', text: 'Практика', icon: faBuildingUser },
  { href: '/dashboard/teachers', text: 'Преподаватели', icon: faUserTie },
  { href: '/dashboard/groups', text: 'Группы', icon: faUserGroup },
  { href: '/dashboard/bells', text: 'Звонки', icon: faBell },
  { href: '/dashboard/calendar', text: 'Календарь', icon: faCalendarDays },
] as const;

export default function AdminNav() {
  const { pathname } = useRouter();

  return (
    <div className="h-full py-10 bg-white border-r border-neutral-200">
      <nav>
        <ul>
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <li className="mb-6 font-semibold" key={link.href}>
                <Link
                  href={link.href}
                  className={clsx({
                    'group transition-color hover:text-blue-500': true,
                    'text-blue-500': isActive,
                    'text-neutral-700': !isActive,
                  })}
                >
                  <div className="flex items-center">
                    <span
                      className={clsx({
                        'w-[2px] self-stretch bg-blue-500 transition origin-left group-hover:scale-x-100':
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
                    <span className="ml-5 mr-10">{link.text}</span>
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
