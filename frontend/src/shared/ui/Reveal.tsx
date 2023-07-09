import { PropsWithChildren } from 'react';
import { clsx } from '../lib/ui';

export type RevealProps = {
  isVisible: boolean;
} & PropsWithChildren;

export function Reveal({ isVisible, children }: RevealProps) {
  return (
    <div
      className={clsx({
        'grid origin-top-left transition-[grid-template-rows,transform] duration-500':
          true,
        'grid-rows-[1fr] scale-100': isVisible,
        'grid-rows-[0fr] scale-0': !isVisible,
      })}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
