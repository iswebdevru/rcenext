'use client';

import { clsx } from '@/shared/lib/ui';
import { HamburgerButton } from '@/shared/ui/Controls/Button';
import { Portal, ZIndex } from '@/shared/ui/Utils';
import {
  IconDefinition,
  faBell,
  faBook,
  faBuildingUser,
  faHouse,
  faLinesLeaning,
  faUserGroup,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import useTransition, { TransitionStatus } from 'react-transition-state';

const links = [
  { href: '/admin', text: 'Главная', icon: faHouse },
  { href: '/admin/classes', text: 'Занятия', icon: faBook },
  { href: '/admin/practice', text: 'Практика (-)', icon: faBuildingUser },
  { href: '/admin/bells', text: 'Звонки', icon: faBell },
  { href: '/admin/teachers', text: 'Преподаватели', icon: faUserTie },
  { href: '/admin/groups', text: 'Группы', icon: faUserGroup },
  { href: '/admin/subjects', text: 'Предметы', icon: faLinesLeaning },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  const [transitionState, toggleTransition] = useTransition({
    timeout: 300,
    mountOnEnter: true,
    preEnter: true,
    unmountOnExit: true,
  });

  const closeNav = () => {
    document.body.style.overflow = '';
    toggleTransition(false);
  };

  const openNav = () => {
    document.body.style.overflow = 'hidden';
    toggleTransition(true);
  };

  return (
    <>
      <div className="fixed left-0 top-14 z-10 hidden h-[calc(100%-3.5rem)] w-64 overflow-y-auto bg-white px-6 py-8 dark:bg-zinc-950 lg:block">
        <nav>
          <ul className="space-y-3">
            {links.map(link => (
              <li key={link.href}>
                <AdminNavLink {...link} isActive={pathname === link.href} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <AdminNavMobileButton onOpen={openNav} />
      <AdminNavMobile
        isMounted={transitionState.isMounted}
        status={transitionState.status}
        onClose={closeNav}
      />
    </>
  );
}

type AdminNavMobileProps = {
  onClose: () => void;
  status: TransitionStatus;
  isMounted: boolean;
};

function AdminNavMobile({ onClose, isMounted, status }: AdminNavMobileProps) {
  const pathname = usePathname();
  const componentRef = useRef<HTMLDivElement>(null);

  const zIndex = 30;

  return (
    <ZIndex index={zIndex}>
      <Portal>
        {isMounted ? (
          <div
            style={{ zIndex }}
            className={clsx(
              'fixed left-0 top-0 block h-full w-full bg-black transition-colors duration-300 lg:hidden',
              {
                'bg-opacity-0': status === 'preEnter' || status === 'exiting',
                'bg-opacity-40': status === 'entering' || status === 'entered',
              },
            )}
            onClick={e => {
              if (
                !(e.target instanceof Node) ||
                !componentRef.current?.contains(e.target)
              ) {
                onClose();
              }
            }}
          >
            <div
              className={clsx(
                'h-full w-64 overflow-y-auto bg-white px-6 py-12 transition-[opacity,transform] duration-300 dark:bg-zinc-950',
                {
                  '-translate-x-full opacity-0':
                    status === 'preEnter' || status === 'exiting',
                  'translate-x-0 opacity-100':
                    status === 'entering' || status === 'entered',
                },
              )}
              ref={componentRef}
            >
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <AdminNavLink {...link} isActive={pathname === link.href} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </Portal>
    </ZIndex>
  );
}

type AdminNavMobileButtonProps = {
  onOpen: () => void;
};

function AdminNavMobileButton({ onOpen }: AdminNavMobileButtonProps) {
  return (
    <Portal>
      <div className="fixed bottom-12 left-12 z-20 block lg:hidden">
        <HamburgerButton
          onClick={onOpen}
          className="h-14 w-14 rounded-full bg-blue-500 p-3 shadow-sm transition-colors hover:bg-blue-600 hover:shadow-lg dark:bg-blue-700 dark:hover:bg-blue-900"
          variant="contrast"
        />
      </div>
    </Portal>
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
