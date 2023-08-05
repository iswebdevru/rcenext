import { PropsWithChildren, useRef } from 'react';
import { AdminNavMobileButton } from './MobileButton';
import useTransition from 'react-transition-state';
import { Portal, ZIndex } from '@/shared/ui/Utils';
import { clsx } from '@/shared/lib/ui';
import { zIndex } from '@/shared/constants';

export function Wrapper({ children }: PropsWithChildren) {
  const [{ status }, toggleTransition] = useTransition({
    timeout: 150,
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

  const componentRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="fixed left-0 top-14 z-10 hidden h-[calc(100%-3.5rem)] w-64 overflow-y-auto bg-white px-6 py-8 dark:bg-zinc-950 lg:block">
        <nav>{children}</nav>
      </div>
      <AdminNavMobileButton onOpen={openNav} />
      <ZIndex index={zIndex.WINDOW}>
        <Portal>
          <div
            style={{ zIndex: zIndex.WINDOW }}
            className={clsx(
              'fixed left-0 top-0 block h-full w-full bg-black transition-colors lg:hidden',
              {
                'bg-opacity-0': status === 'preEnter' || status === 'exiting',
                'bg-opacity-40': status === 'entering' || status === 'entered',
                hidden: status === 'unmounted',
              },
            )}
            onClick={e => {
              if (
                !(e.target instanceof Node) ||
                !componentRef.current?.contains(e.target)
              ) {
                closeNav();
              }
            }}
          >
            <div
              className={clsx(
                'h-full w-64 overflow-y-auto bg-white px-6 py-12 transition-[transform] dark:bg-zinc-950',
                {
                  '-translate-x-full':
                    status === 'preEnter' || status === 'exiting',
                  'translate-x-0':
                    status === 'entering' || status === 'entered',
                },
              )}
              ref={componentRef}
            >
              {children}
            </div>
          </div>
        </Portal>
      </ZIndex>
    </>
  );
}
