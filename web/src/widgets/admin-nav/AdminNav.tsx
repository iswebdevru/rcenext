import { className } from '@/shared/lib/ui';
import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { href: '/dashboard', text: 'Главная' },
  { href: '/dashboard/classes', text: 'Занятия' },
  { href: '/dashboard/practice', text: 'Практика' },
  { href: '/dashboard/teachers', text: 'Преподаватели' },
  { href: '/dashboard/...', text: 'Звонки' },
  { href: '/dashboard/...', text: 'Календарь' },
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
                  className={className({
                    'group transition-color hover:text-indigo-500': true,
                    'text-indigo-500': isActive,
                    'text-neutral-700': !isActive,
                  })}
                >
                  <div className="flex">
                    <span
                      className={className({
                        'w-[2px] bg-indigo-500 transition origin-left group-hover:scale-x-100':
                          true,
                        'scale-x-100': isActive,
                        'scale-x-0': !isActive,
                      })}
                    ></span>
                    <span
                      className={className({
                        'w-6 h-6 ml-5 group-hover:bg-indigo-500 transition-[background]':
                          true,
                        'bg-indigo-500': isActive,
                        'bg-neutral-700': !isActive,
                      })}
                    ></span>
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
