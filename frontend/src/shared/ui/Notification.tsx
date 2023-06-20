import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { clsx } from '../lib/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export type NotificationKind = 'success' | 'error';

export type NotificationInput = {
  kind: NotificationKind;
  text: string;
};

export type Notification = NotificationInput & {
  id: string;
  isRemoving: boolean;
};

type NotificationState = {
  notifications: Notification[];
  push: (notification: NotificationInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

// const TTL = 3000;
// const REMOVE_TIME = 500;

const iconsMap = {
  success: faCircleCheck,
  error: faTriangleExclamation,
};

const useNotification = create<NotificationState>((set, get) => ({
  notifications: [],
  async push(notification) {
    const id = uuid();
    set(state => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id,
          isRemoving: false,
        },
      ],
    }));
    await get().remove(id);
  },
  async remove(id) {
    const notification = get().notifications.find(n => n.id === id);
    if (notification?.isRemoving) {
      return;
    }
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id !== id
          ? n
          : {
              ...n,
              isRemoving: true,
            }
      ),
    }));
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
}));

type NotificationProps = {
  data: Notification;
  onRemove: () => void;
};

function Notification({ data, onRemove }: NotificationProps) {
  return (
    <div
      className={clsx({
        'flex animate-notification-add items-center gap-4 rounded-2xl border p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800':
          true,
        'animate-notification-remove': data.isRemoving,
        'border-green-500 bg-green-50': data.kind === 'success',
        'border-red-200 bg-red-50': data.kind === 'error',
      })}
    >
      <div
        className={clsx({
          'flex h-10 w-10 items-center justify-center rounded-2xl text-2xl text-white dark:bg-slate-700':
            true,
          'bg-red-700 dark:text-red-400': data.kind === 'error',
          'bg-green-500 dark:text-green-500': data.kind === 'success',
        })}
      >
        <FontAwesomeIcon fixedWidth={true} icon={iconsMap[data.kind]} />
      </div>
      <div>
        <p className="text-slate-900 dark:text-slate-200">{data.text}</p>
      </div>
      <button
        className="ml-auto flex h-10 w-10 items-center justify-center rounded-2xl text-lg text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-slate-200"
        onClick={onRemove}
        disabled={data.isRemoving}
      >
        <FontAwesomeIcon icon={faXmark} fixedWidth={true} />
      </button>
    </div>
  );
}

export function Notifications() {
  const notifications = useNotification(state => state.notifications);
  const remove = useNotification(state => state.remove);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-3">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          data={notification}
          onRemove={() => remove(notification.id)}
        />
      ))}
    </div>
  );
}

export function useNotificationEmitter() {
  return useNotification(state => state.push);
}
