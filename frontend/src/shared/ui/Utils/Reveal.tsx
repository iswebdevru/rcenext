import { PropsWithChildren } from 'react';
import { clsx } from '../../lib/ui';
import { create } from 'zustand';

export type RevealProps = {
  isVisible: boolean;
} & PropsWithChildren;

export function Reveal({ isVisible, children }: RevealProps) {
  return (
    <div
      className={clsx(
        'grid transition-[grid-template-rows,opacity] duration-500',
        {
          'grid-rows-[1fr] opacity-100': isVisible,
          'grid-rows-[0fr] opacity-0': !isVisible,
        },
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

export type RevealStore = {
  isOpened: boolean;
  toggle: (state?: boolean) => void;
};

export function createRevealStore() {
  return create<RevealStore>(set => ({
    isOpened: false,
    toggle(state) {
      if (state === undefined) {
        set(p => ({ isOpened: !p.isOpened }));
        return;
      }
      set({ isOpened: state });
    },
  }));
}
