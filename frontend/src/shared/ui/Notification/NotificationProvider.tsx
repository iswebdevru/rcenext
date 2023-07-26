'use client';

import { noop } from '@/shared/lib/common';
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Portal, ZIndex } from '../Utils';
import { NotificationPrivateContext } from './NotificationPrivateContext';

type NotificationData = {
  id: number;
  element: ReactNode;
};

type NotificationsPublicContext = {
  notify: (notification: ReactNode) => void;
};

const NotificationsPublicContext = createContext<NotificationsPublicContext>({
  notify: noop,
});

export function NotificationsProvider({ children }: PropsWithChildren) {
  const idRef = useRef(0);

  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const notify = useCallback((notification: ReactNode) => {
    setNotifications(prev => {
      return [...prev, { id: ++idRef.current, element: notification }];
    });
  }, []);

  const zIndex = 40;

  return (
    <NotificationsPublicContext.Provider value={{ notify }}>
      {children}
      <ZIndex index={zIndex}>
        <Portal>
          <div
            style={{ zIndex }}
            className="fixed bottom-4 right-4 w-full max-w-xs sm:bottom-9 sm:right-9"
          >
            {notifications.map(notification => (
              <NotificationPrivateContext.Provider
                key={notification.id}
                value={{
                  onClose: () =>
                    setNotifications(prev =>
                      prev.filter(current => notification.id !== current.id),
                    ),
                }}
              >
                {notification.element}
              </NotificationPrivateContext.Provider>
            ))}
          </div>
        </Portal>
      </ZIndex>
    </NotificationsPublicContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationsPublicContext).notify;
}
