'use client';

import { usePathname } from 'next/navigation';
import {
  faBell,
  faBook,
  faHouse,
  faLinesLeaning,
  faUserGroup,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { Wrapper } from './Wrapper';
import { AdminNavLink } from './Link';

const links = [
  { href: '/admin', text: 'Главная', icon: faHouse },
  { href: '/admin/classes', text: 'Занятия', icon: faBook },
  { href: '/admin/bells', text: 'Звонки', icon: faBell },
  { href: '/admin/teachers', text: 'Преподаватели', icon: faUserTie },
  { href: '/admin/groups', text: 'Группы', icon: faUserGroup },
  { href: '/admin/subjects', text: 'Предметы', icon: faLinesLeaning },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <Wrapper>
      <ul className="space-y-3">
        {links.map(link => (
          <li key={link.href}>
            <AdminNavLink {...link} isActive={pathname === link.href} />
          </li>
        ))}
      </ul>
    </Wrapper>
  );
}
