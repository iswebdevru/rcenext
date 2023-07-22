import { clsx } from '@/shared/lib/ui';
import {
  faBell,
  faCheck,
  faExclamationTriangle,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren, ReactNode, createContext, useContext } from 'react';
import { NotificationPrivateContext } from './NotificationPrivateContext';
import useTransition from 'react-transition-state';
import { useTimeout } from '@/shared/hooks';

export type NotificationVariant = 'common' | 'success' | 'danger';

const iconsMap: Record<NotificationVariant, ReactNode> = {
  common: (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-700 dark:bg-zinc-900">
      <FontAwesomeIcon
        icon={faBell}
        fixedWidth
        className="text-white dark:text-white"
      />
    </div>
  ),
  danger: (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-red-500 dark:bg-zinc-900">
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        fixedWidth
        className="text-white dark:text-red-600"
      />
    </div>
  ),
  success: (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-green-500 dark:bg-zinc-900">
      <FontAwesomeIcon
        icon={faCheck}
        fixedWidth
        className="text-white dark:text-green-500"
      />
    </div>
  ),
};

type NotificationContext = {
  variant: NotificationVariant;
};

const NotificationContext = createContext<NotificationContext>({
  variant: 'common',
});

const TIME_TO_READ = 7000; // TODO: make it a prop

export type NotificationProps = {
  variant?: NotificationVariant;
} & PropsWithChildren;

export function Notification({
  children,
  variant = 'common',
}: NotificationProps) {
  const { onClose } = useContext(NotificationPrivateContext);

  const [{ status, isMounted }, toggleTransition] = useTransition({
    preEnter: true,
    mountOnEnter: true,
    timeout: 500,
    unmountOnExit: true,
    onStateChange(event) {
      if (!event.current.isMounted) {
        onClose();
      }
    },
  });

  useTimeout(() => toggleTransition(true), 0);

  useTimeout(() => toggleTransition(false), TIME_TO_READ);

  if (!isMounted) {
    return null;
  }

  return (
    <NotificationContext.Provider value={{ variant }}>
      <div
        className={clsx(
          'group/notification grid transform transition-[opacity,grid-template-rows,margin,transform] duration-500 ease-in-out',
          {
            'mt-0 scale-50 grid-rows-[0fr] opacity-0':
              status === 'preEnter' || status === 'exiting',
            'mt-3 scale-100 grid-rows-[1fr] opacity-100':
              status === 'entering' || status === 'entered',
          },
        )}
      >
        <div
          className={clsx('overflow-hidden rounded-xl shadow-md', {
            'shadow-zinc-500/20 dark:shadow-zinc-800/30': variant === 'common',
            'shadow-green-500/20 dark:shadow-green-800/30':
              variant === 'success',
            'shadow-red-500/20 dark:shadow-red-800/30': variant === 'danger',
          })}
        >
          <div
            className={clsx('flex gap-3 rounded-xl p-3 ring-1 ring-inset', {
              'bg-white ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700':
                variant === 'common',
              'bg-green-50 ring-green-500 dark:bg-zinc-800 dark:ring-green-950':
                variant === 'success',
              'bg-red-50 ring-red-300 dark:bg-zinc-800 dark:ring-red-950':
                variant === 'danger',
            })}
          >
            <div className="self-start">{iconsMap[variant]}</div>
            <div className="flex-auto">{children}</div>
            <button
              type="button"
              className="group/close grid h-5 w-5 place-items-center self-start"
              onClick={() => toggleTransition(false)}
            >
              <FontAwesomeIcon
                icon={faXmark}
                fixedWidth
                className={clsx('text-xs', {
                  'text-zinc-700/40 group-hover/close:text-zinc-700 dark:text-zinc-400 dark:group-hover/close:text-zinc-50':
                    variant === 'common',
                  'text-green-900/40 group-hover/close:text-green-900 dark:text-zinc-400 dark:group-hover/close:text-zinc-50':
                    variant === 'success',
                  'text-red-900/40 group-hover/close:text-red-900 dark:text-zinc-400 dark:group-hover/close:text-zinc-50':
                    variant === 'danger',
                })}
              />
            </button>
          </div>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}

Notification.Title = function NotificationTitle({
  children,
}: PropsWithChildren) {
  const { variant } = useContext(NotificationContext);

  return (
    <h6
      className={clsx('text-sm font-bold', {
        'text-zinc-900 dark:text-white': variant === 'common',
        'text-green-950 dark:text-green-500': variant === 'success',
        'text-red-950 dark:text-red-600': variant === 'danger',
      })}
    >
      {children}
    </h6>
  );
};

Notification.Message = function NotificationMessage({
  children,
}: PropsWithChildren) {
  const { variant } = useContext(NotificationContext);

  return (
    <p
      className={clsx('mt-1 text-sm first:mt-0', {
        'text-zinc-700 dark:text-zinc-200': variant === 'common',
        'text-green-950 dark:text-zinc-200': variant === 'success',
        'text-red-950 dark:text-zinc-200': variant === 'danger',
      })}
    >
      {children}
    </p>
  );
};
