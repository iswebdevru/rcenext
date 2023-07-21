import { clsx } from '@/shared/lib/ui';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren, ReactNode } from 'react';

export type NotificationVariant = 'common' | 'success' | 'danger';

export type NotificationProps = {
  variant?: NotificationVariant;
} & PropsWithChildren;

const iconsMap: Record<NotificationVariant, ReactNode> = {
  common: null,
  danger: null,
  success: (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-green-400 dark:bg-green-950">
      <FontAwesomeIcon
        icon={faCheck}
        fixedWidth
        className="text-sm dark:text-green-600"
      />
    </div>
  ),
};

export function Notification({
  children,
  variant = 'success',
}: NotificationProps) {
  return (
    <div
      className={clsx('flex gap-3 rounded-lg p-3 ring-1', {
        'bg-white ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700':
          variant === 'common',
        'bg-green-50 ring-green-400 dark:bg-zinc-800 dark:ring-green-950':
          variant === 'success',
      })}
    >
      <div className="self-start">{iconsMap[variant]}</div>
      <div className="flex-auto space-y-1">
        <h6 className="text-sm font-semibold dark:text-zinc-200">{children}</h6>
        <p className="text-sm dark:text-zinc-400">
          Компонент в разработке. Лень убирать
        </p>
      </div>
      <button
        type="button"
        className="grid h-5 w-5 place-items-center self-start"
      >
        <FontAwesomeIcon
          icon={faXmark}
          fixedWidth
          className="text-xs text-zinc-900 dark:text-zinc-200"
        />
      </button>
    </div>
  );
}
