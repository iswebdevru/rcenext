'use client';

import { clsx } from '@/shared/lib/ui';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
} from 'react';

export type VariantId = string | number | boolean;

export type TogglesProps<T extends VariantId> = {
  value: T;
  onToggle: (value: T) => void;
} & PropsWithChildren;

type TogglesContext = {
  value: VariantId;
  onToggle: Dispatch<SetStateAction<VariantId>>;
};

const TogglesContext = createContext<TogglesContext>(undefined as any);

export function Toggles<T extends VariantId>({
  children,
  ...providerProps
}: TogglesProps<T>) {
  return (
    <TogglesContext.Provider value={{ ...providerProps } as any}>
      <div>
        <ul className="flex flex-wrap gap-2 p-1">{children}</ul>
      </div>
    </TogglesContext.Provider>
  );
}

export type VariantProps = {
  value: VariantId;
} & PropsWithChildren;

Toggles.Variant = function Variant({ value, children }: VariantProps) {
  const { onToggle, value: selected } = useContext(TogglesContext);

  return (
    <li className="group grow">
      <button
        type="button"
        disabled={value === selected}
        className={clsx(
          'block w-full select-none rounded-md px-1.5 py-0.5 text-sm font-semibold outline-none outline-1 outline-offset-0 transition-[outline,color,background]',
          {
            'text-zinc-700 hover:text-blue-400 focus-visible:text-zinc-900 focus-visible:outline-2 focus-visible:outline-zinc-600 dark:text-zinc-500 dark:hover:text-white dark:focus-visible:text-zinc-200':
              value !== selected,
            'bg-blue-50 text-blue-400 outline-1 outline-blue-400 dark:bg-blue-700 dark:text-white dark:outline-transparent':
              value === selected,
          },
        )}
        onClick={() => onToggle(value)}
      >
        {children}
      </button>
    </li>
  );
};
