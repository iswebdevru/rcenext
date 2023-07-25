import { ComponentProps, forwardRef, useRef } from 'react';
import {
  faComment,
  faEllipsis,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import useTransition from 'react-transition-state';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  useClickOutside,
  usePositionCoords,
  useRegisterOutsideClickException,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { clsx } from '@/shared/lib/ui';
import { Button } from '@/shared/ui/Controls';
import { Portal, useZIndex } from '@/shared/ui/Utils';

export type ClassesEditorSettingsProps = {
  view: 'table' | 'message';
  onViewChange: (view: 'table' | 'message') => void;
  onDelete: () => void;
  deleteDisabled: boolean;
  onReset: () => void;
  resetDisabled: boolean;
};

export const ClassesEditorSettings = withOutsideClickExceptionsContext(
  function ClassesEditorSettings({
    view,
    onViewChange,
    onDelete,
    deleteDisabled,
    onReset,
    resetDisabled,
  }: ClassesEditorSettingsProps) {
    const settingsRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const { right, top } = usePositionCoords(btnRef, settingsRef, {
      alignCenter: false,
    });
    const [{ isMounted, status }, toggleTransition] = useTransition({
      mountOnEnter: true,
      timeout: 150,
      preEnter: true,
      unmountOnExit: true,
    });

    useRegisterOutsideClickException(btnRef);
    useClickOutside(settingsRef, () => toggleTransition(false));

    const zIndex = useZIndex();

    return (
      <div>
        <button
          ref={btnRef}
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-100 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-50',
            {
              'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50':
                isMounted,
              'text-zinc-500': !isMounted,
            },
          )}
          onClick={() => toggleTransition(true)}
        >
          <FontAwesomeIcon icon={faEllipsis} fixedWidth size="lg" />
        </button>
        <Portal>
          {isMounted ? (
            <div
              ref={settingsRef}
              style={{ zIndex, right, top }}
              className={clsx(
                'fixed flex flex-col overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm transition-[opacity,transform] dark:border-zinc-700 dark:bg-zinc-800',
                {
                  '-translate-y-6 scale-75 opacity-0':
                    status === 'preEnter' || status === 'exiting',
                  'translate-y-0 scale-100 opacity-100': status === 'entering',
                },
              )}
            >
              <div className="flex">
                <ModeButton
                  className="h-10 flex-grow"
                  isActive={view === 'table'}
                  onClick={() => {
                    onViewChange('table');
                    toggleTransition(false);
                  }}
                >
                  <FontAwesomeIcon icon={faTable} fixedWidth />
                </ModeButton>
                <ModeButton
                  className="h-10 flex-grow"
                  isActive={view === 'message'}
                  onClick={() => {
                    onViewChange('message');
                    toggleTransition(false);
                  }}
                >
                  <FontAwesomeIcon icon={faComment} fixedWidth />
                </ModeButton>
              </div>
              <div className="px-2 py-1.5">
                <Button className="w-full">Основное</Button>
              </div>
              <div className="px-2 py-1.5">
                <Button
                  className="w-full"
                  disabled={resetDisabled}
                  onClick={() => {
                    onReset();
                    toggleTransition(false);
                  }}
                >
                  Сбросить
                </Button>
              </div>
              <div className="px-2 py-1.5">
                <Button
                  variant="danger-outline"
                  className="w-full"
                  disabled={deleteDisabled}
                  onClick={() => {
                    onDelete();
                    toggleTransition(false);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ) : null}
        </Portal>
      </div>
    );
  },
);

type ModeButtonProps = { isActive?: boolean } & ComponentProps<'button'>;

const ModeButton = forwardRef<HTMLButtonElement, ModeButtonProps>(
  function ModeButtonComponent(
    { children, className, isActive, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={clsx(
          className,
          'flex items-center justify-center transition duration-100',
          {
            'bg-blue-50 text-blue-500 dark:bg-zinc-700 dark:text-zinc-50':
              !!isActive,
            'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900  dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-50':
              !isActive,
          },
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
