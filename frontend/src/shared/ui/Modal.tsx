import { PropsWithChildren } from 'react';
import useTransition, { TransitionStatus } from 'react-transition-state';
import { clsx } from '../lib/ui';

export type OverlayProps = {
  status: TransitionStatus;
} & PropsWithChildren;

/**
 * Add empty dark background
 */
export function Overlay({ children, status }: OverlayProps) {
  if (status === 'exited') {
    return null;
  }
  return (
    <div
      className={clsx({
        'fixed p-4 left-0 top-0 w-full h-full bg-black z-10 grid items-end justify-center md:items-center':
          true,
        'bg-opacity-0': status === 'preEnter',
        'bg-opacity-80 transition-colors': status === 'entering',
        'bg-opacity-80': status === 'entered',
        'bg-opacity-0 transition-colors delay-150': status === 'exiting',
      })}
    >
      {children}
    </div>
  );
}

export function useOverlayTransition() {
  return useTransition({
    timeout: {
      enter: 150,
      exit: 300,
    },
    preEnter: true,
  });
}

export function Modal({ children, status }: OverlayProps) {
  if (status === 'exited') {
    return null;
  }
  console.log(
    clsx({
      'bg-white border border-zinc-200 dark:border-zinc-700 rounded-md dark:bg-zinc-800':
        true,
      'scale-75 opacity-100': status === 'preEnter',
      'scale-100 opacity-100 transition-[transform,opacity] delay-150':
        status === 'entering',
      'scale-75 opacity-0 transition-[transform,opacity]': status === 'exiting',
    })
  );
  return (
    <div
      className={clsx({
        'bg-white border border-zinc-200 dark:border-zinc-700 rounded-md dark:bg-zinc-800':
          true,
        'scale-75 opacity-0': status === 'preEnter',
        'scale-100 opacity-100 transition-[transform,opacity] delay-150':
          status === 'entering',
        'scale-75 opacity-0 transition-[transform,opacity]':
          status === 'exiting',
      })}
    >
      {children}
    </div>
  );
}

export function useModalTransition() {
  return useTransition({
    timeout: {
      enter: 300,
      exit: 150,
    },
    preEnter: true,
  });
}
