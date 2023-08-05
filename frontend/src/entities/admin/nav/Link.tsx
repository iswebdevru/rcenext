import Link from 'next/link';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from '@/shared/lib/ui';

export type AdminNavLinkProps = {
  href: string;
  isActive: boolean;
  text: string;
  icon: IconDefinition;
};

export function AdminNavLink({
  href,
  isActive,
  text,
  icon,
}: AdminNavLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'transition-color block p-2 font-semibold hover:text-blue-500 dark:hover:text-zinc-200',
        {
          'rounded-md bg-slate-100 text-blue-500 dark:bg-zinc-900 dark:text-white':
            isActive,
          'text-slate-800 dark:text-zinc-500': !isActive,
        },
      )}
    >
      <div className="flex items-center gap-4">
        <div className="items-place-center grid">
          <FontAwesomeIcon icon={icon} fixedWidth className="text-lg" />
        </div>
        <span className="text-sm">{text}</span>
      </div>
    </Link>
  );
}
