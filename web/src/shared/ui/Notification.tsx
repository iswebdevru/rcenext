import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { clsx } from '../lib/ui';
import { wait } from '../lib/time';
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

const TTL = 3000;
const REMOVE_TIME = 500;

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
    await wait(TTL);
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
    await wait(REMOVE_TIME);
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
        'flex items-center gap-4 p-2 border shadow-sm rounded-2xl animate-notification-add dark:bg-slate-800 dark:border-slate-700':
          true,
        'animate-notification-remove': data.isRemoving,
        'border-green-500 bg-green-50': data.kind === 'success',
        'border-red-200 bg-red-50': data.kind === 'error',
      })}
    >
      <div
        className={clsx({
          'text-2xl text-white w-10 h-10 flex items-center justify-center rounded-2xl dark:bg-slate-700':
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
        className="flex items-center justify-center w-10 h-10 ml-auto text-lg transition-colors rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
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
    <div className="fixed z-50 flex flex-col w-full max-w-sm gap-3 bottom-5 right-5">
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
