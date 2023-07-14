import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren, useRef } from 'react';
import useTransition from 'react-transition-state';
import { clsx } from '../lib/ui';
import { useClickOutside, withOutsideClickExceptionsContext } from '../hooks';

export const ListInLine = withOutsideClickExceptionsContext(
  function ListInLine({ children }: PropsWithChildren) {
    const componentRef = useRef<HTMLDivElement>(null);
    const [{ status }, toggle] = useTransition({
      timeout: 150,
      preEnter: true,
    });

    useClickOutside(componentRef, () => toggle(false));

    return (
      <div className="relative w-full" ref={componentRef}>
        <div className="flex w-full items-center justify-between gap-4 overflow-hidden">
          <ul className="flex h-[26px] flex-wrap items-center gap-2 overflow-hidden">
            {children}
          </ul>
          <button
            className="flex-shrink-0 scale-90 rounded-md border border-slate-300 bg-slate-100 p-0.5 text-slate-600 hover:scale-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
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
              'absolute right-0 top-full z-10 mt-2 flex flex-wrap gap-2 rounded-md border border-zinc-100 bg-white p-3 shadow-md shadow-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-zinc-900':
                true,
              'translate-x--translate-y-8 -translate-y-8 scale-75 opacity-0':
                status === 'preEnter',
              'scale-100 opacity-100 transition-[transform,opacity]':
                status === 'entering',
              'translate-x--translate-y-8 -translate-y-8 scale-75 opacity-0 transition-[transform,opacity]':
                status === 'exiting',
            })}
          >
            {children}
          </ul>
        )}
      </div>
    );
  },
);

export function ListInLineItem({ children }: PropsWithChildren) {
  return (
    <li className="overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-slate-300 bg-slate-100 px-1 py-0.5 text-slate-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200">
      {children}
    </li>
  );
}
