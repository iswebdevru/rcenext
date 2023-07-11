import { PropsWithChildren } from 'react';
import { clsx } from '../../lib/ui';

export type RevealProps = {
  isVisible: boolean;
} & PropsWithChildren;

export function Reveal({ isVisible, children }: RevealProps) {
  return (
    <div
      className={clsx({
        'grid origin-top-left transition-[grid-template-rows,transform] duration-500':
          true,
        'scale-100 grid-rows-[1fr]': isVisible,
        'scale-0 grid-rows-[0fr]': !isVisible,
      })}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
