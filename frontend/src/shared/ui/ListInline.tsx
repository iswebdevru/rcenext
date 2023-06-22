import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren, useRef } from 'react';
import useTransition from 'react-transition-state';
import { clsx } from '../lib/ui';
import { useClickOutside } from '../hooks';

export function ListInline({ children }: PropsWithChildren) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [{ status }, toggle] = useTransition({
    timeout: 150,
    preEnter: true,
  });

  useClickOutside(componentRef, () => toggle(false));

  return (
    <div className="relative w-full" ref={componentRef}>
      <div className="w-full flex gap-4 overflow-hidden justify-between items-center">
        <ul className="flex items-center gap-2 overflow-hidden flex-wrap h-[26px]">
          {children}
        </ul>
        <button
          className="flex-shrink-0 border rounded-md text-slate-600 border-slate-300 bg-slate-100 p-0.5 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-400 scale-90 hover:scale-100"
          onClick={() => toggle()}
        >
          <FontAwesomeIcon
            fixedWidth
            size="lg"
            icon={faEllipsis}
            className="pointer-events-none"
          />
        </button>
      </div>
      {status === 'exited' ? null : (
        <ul
          className={clsx({
            'absolute z-10 right-0 top-full mt-2 bg-white shadow-md border border-zinc-100 shadow-zinc-300 rounded-md flex flex-wrap gap-2 p-3 dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-zinc-900':
              true,
            'opacity-0 scale-75 -translate-y-8 translate-x--translate-y-8':
              status === 'preEnter',
            'opacity-100 scale-100 transition-[transform,opacity]':
              status === 'entering',
            'opacity-0 scale-75 -translate-y-8 translate-x--translate-y-8 transition-[transform,opacity]':
              status === 'exiting',
          })}
        >
          {children}
        </ul>
      )}
    </div>
  );
}

ListInline.Item = function RevealingListItem({ children }: PropsWithChildren) {
  return (
    <li className="bg-slate-100 border border-slate-300 rounded-md px-1 py-0.5 text-ellipsis whitespace-nowrap overflow-hidden text-slate-600 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-200">
      {children}
    </li>
  );
};
