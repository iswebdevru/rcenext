import {
  useClickOutside,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { PropsWithChildren, useRef } from 'react';
import useTransition from 'react-transition-state';
import { MobileButton } from './MobileButton';
import { Portal, ZIndex } from '@/shared/ui/Utils';
import { clsx } from '@/shared/lib/ui';
import { Button } from '@/shared/ui/Controls';
import { zIndex } from '@/shared/constants';

export const Wrapper = withOutsideClickExceptionsContext(function Wrapper({
  children,
}: PropsWithChildren) {
  const mobileFiltersViewRef = useRef<HTMLDivElement>(null);

  const [transitionState, toggleTransition] = useTransition({
    timeout: 150,
    mountOnEnter: true,
    preEnter: true,
    unmountOnExit: true,
  });

  const openFilters = () => {
    toggleTransition(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFilters = () => {
    if (transitionState.status !== 'unmounted') {
      toggleTransition(false);
      document.body.style.overflow = '';
    }
  };

  useClickOutside(mobileFiltersViewRef, closeFilters);

  return (
    <>
      <div className="hidden h-full lg:block">{children}</div>
      <MobileButton onOpen={openFilters} />
      <ZIndex index={zIndex.WINDOW}>
        <Portal>
          <div
            style={{ zIndex: zIndex.WINDOW }}
            className={clsx(
              'fixed left-0 top-0 h-full w-full overflow-hidden bg-black bg-opacity-0 transition-colors lg:hidden',
              {
                'sm:bg-opacity-50':
                  transitionState.status === 'entering' ||
                  transitionState.status === 'entered',
                'sm:bg-opacity-0':
                  transitionState.status === 'preEnter' ||
                  transitionState.status === 'exiting',
                hidden: transitionState.status === 'unmounted',
              },
            )}
          >
            <div
              className={clsx(
                'ml-auto flex h-full flex-col items-center gap-6 overflow-y-auto bg-white px-6 py-8 transition-[transform] dark:bg-zinc-950 sm:max-w-xs',
                {
                  'translate-y-full sm:translate-x-full sm:translate-y-0':
                    transitionState.status === 'preEnter' ||
                    transitionState.status === 'exiting',
                  'translate-y-0 sm:translate-x-0':
                    transitionState.status === 'entering',
                },
              )}
              ref={mobileFiltersViewRef}
            >
              <div className="w-full max-w-xs">{children}</div>
              <div className="mt-auto w-full max-w-xs lg:hidden">
                <Button variant="primary" onClick={closeFilters}>
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        </Portal>
      </ZIndex>
    </>
  );
});
