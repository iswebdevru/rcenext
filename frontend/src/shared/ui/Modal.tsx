import { PropsWithChildren, useRef } from 'react';
import useTransition, { TransitionStatus } from 'react-transition-state';
import { clsx } from '../lib/ui';

export type OverlayProps = {
  status: TransitionStatus;
  onClose: () => void;
} & PropsWithChildren;

/**
 * Add empty dark background
 */
export function Overlay({ children, status, onClose }: OverlayProps) {
  if (status === 'exited') {
    return null;
  }
  return (
    <div>
      <div
        onClick={onClose}
        className={clsx({
          'fixed left-0 top-0 w-full h-full bg-black z-10': true,
          'bg-opacity-0': status === 'preEnter',
          'bg-opacity-80 transition-colors': status === 'entering',
          'bg-opacity-80': status === 'entered',
          'bg-opacity-0 transition-colors delay-150': status === 'exiting',
        })}
      ></div>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 z-10 grid items-end justify-center md:items-center">
        {children}
      </div>
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

export type ModalProps = {
  status: TransitionStatus;
} & PropsWithChildren;

export function Modal({ children, status }: ModalProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  if (status === 'exited') {
    return null;
  }
  return (
    <div
      ref={nodeRef}
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
