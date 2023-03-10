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
        <ul className="flex flex-wrap border rounded-md">{children}</ul>
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
        className={clsx({
          'w-full border-r group-last:border-r-0 transition': true,
          'bg-slate-200': value === selected,
        })}
        onClick={() => setValue(value)}
      >
        {children}
      </button>
    </li>
  );
};
