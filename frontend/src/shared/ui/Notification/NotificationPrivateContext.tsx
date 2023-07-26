'use client';

import { noop } from '@/shared/lib/common';
import { createContext } from 'react';

export type NotificationPrivateContext = {
  onClose: () => void;
};

export const NotificationPrivateContext =
  createContext<NotificationPrivateContext>({ onClose: noop });
