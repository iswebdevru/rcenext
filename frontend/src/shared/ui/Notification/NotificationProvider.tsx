import { noop } from '@/shared/lib/common';
import {
  Fragment,
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useState,
} from 'react';
import { Portal, ZIndex } from '../Utils';
import { Notification } from './Notification';

type NotificationData = {
  id: number;
  element: ReactNode;
};

type NotificationContext = {
  // notifications: NotificationData[];
  notify: (notification: ReactNode) => void;
};

const NotificationContext = createContext<NotificationContext>({
  notify: noop,
});

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<NotificationData[]>([
    {
      id: 1,
      element: <Notification>Пример</Notification>,
    },
    {
      id: 2,
      element: <Notification>Пример</Notification>,
    },
    {
      id: 3,
      element: <Notification>Пример</Notification>,
    },
  ]);

  const notify = useCallback((notification: ReactNode) => {
    setNotifications(prev => {
      return [...prev, { id: 0, element: notification }];
    });
  }, []);

  const zIndex = 40;

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <ZIndex index={zIndex}>
        <Portal>
          <div
            style={{ zIndex }}
            className="fixed bottom-9 right-9 w-full max-w-xs space-y-3"
          >
            {notifications.map(notification => (
              <Fragment key={notification.id}>{notification.element}</Fragment>
            ))}
          </div>
        </Portal>
      </ZIndex>
    </NotificationContext.Provider>
  );
}
