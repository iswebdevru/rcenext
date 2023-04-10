import { clsx } from '@/shared/lib/ui';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
} from 'react';

export type VariantId = string | number | boolean;

export type TogglesProps<T> = {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
} & PropsWithChildren;

type TogglesContext = {
  value: VariantId;
  setValue: Dispatch<SetStateAction<VariantId>>;
};

const TogglesContext = createContext<TogglesContext>(undefined as any);

export function Toggles<T extends VariantId>({
  children,
  ...providerProps
}: TogglesProps<T>) {
  return (
    <TogglesContext.Provider value={{ ...providerProps } as any}>
      <div>
        <ul className="flex flex-wrap gap-1 p-1">{children}</ul>
      </div>
    </TogglesContext.Provider>
  );
}

export type VariantProps = {
  value: VariantId;
} & PropsWithChildren;

Toggles.Variant = function Variant({ value, children }: VariantProps) {
  const { setValue, value: selected } = useContext(TogglesContext);

  return (
    <li className="group grow">
      <button
        disabled={value === selected}
        className={clsx({
          'outline-none outline-1 outline-offset-0 select-none block w-full p-0.5 text-sm rounded-md font-semibold transition-[outline,color,background]':
            true,
          'text-slate-700 focus:outline-1 focus:outline-slate-600 dark:text-slate-400 hover:text-blue-400 dark:hover:text-blue-50 focus:text-slate-900 dark:focus:text-slate-200':
            value !== selected,
          'bg-blue-50 outline-1 outline-blue-400 text-blue-400 dark:bg-blue-700 dark:text-blue-50 dark:outline-transparent':
            value === selected,
        })}
        onClick={() => setValue(value)}
      >
        {children}
      </button>
    </li>
  );
};
