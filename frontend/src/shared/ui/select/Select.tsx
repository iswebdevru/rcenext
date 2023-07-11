import { useClickOutside } from '@/shared/hooks';
import { clsx } from '@/shared/lib/ui';
import {
  ChangeEvent,
  Children,
  createContext,
  EventHandler,
  forwardRef,
  ReactElement,
  useContext,
  useRef,
  useState,
} from 'react';
import { TextField } from '../controls';

type Id = string | number;

type CommonSelectProps<T extends Id> = {
  searchString?: string;
  onSearchStringChange?: EventHandler<ChangeEvent>;
  children?: ReactElement<OptionProps<T>> | ReactElement<OptionProps<T>>[];
  placeholder?: string;
  required?: boolean;
};

export type SingleSelectProps<T extends Id> = {
  multiple?: false;
  value?: T;
  onChange: (value: T) => void;
} & CommonSelectProps<T>;

export type MultipleSelectProps<T extends Id> = {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
} & CommonSelectProps<T>;

export type SelectProps<T extends Id> =
  | SingleSelectProps<T>
  | MultipleSelectProps<T>;

type OptionContext = {
  isSelected: boolean;
  triggerSelect: () => void;
};
const OptionContext = createContext<OptionContext>(undefined as any);

export function Select<T extends Id>({
  children,
  value,
  onChange,
  multiple,
  searchString,
  onSearchStringChange,
  placeholder,
  required,
}: SelectProps<T>) {
  const componentRef = useRef<HTMLDivElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [wasFocused, setWasFocused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useClickOutside(componentRef, () => setIsOpened(false));

  const hasSelected =
    value !== undefined && !(Array.isArray(value) && value.length === 0);

  let displayValue: string[] | string = hasSelected
    ? multiple
      ? []
      : ''
    : placeholder ?? 'Не выбрано';

  const items = Children.map(children, option => {
    if (!option) {
      return null;
    }
    if (multiple && value.includes(option.props.value)) {
      (displayValue as string[]).push(option.props.children.toString());
    } else if (!multiple && value === option.props.value) {
      displayValue = option.props.children.toString();
    }
    return (
      <OptionContext.Provider
        key={option.props.value}
        value={{
          isSelected: multiple
            ? value.includes(option.props.value)
            : value === option.props.value,
          triggerSelect: () => {
            if (multiple) {
              if (value.includes(option.props.value)) {
                onChange(value.filter(v => v !== option.props.value));
              } else {
                onChange([...value, option.props.value]);
              }
            } else {
              setIsOpened(false);
              onChange(option.props.value);
            }
          },
        }}
      >
        {option}
      </OptionContext.Provider>
    );
  });

  return (
    <div
      className="relative z-10 flex h-8 w-full items-center"
      ref={componentRef}
      onFocus={() => {
        setIsOpened(true);
        setWasFocused(true);
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsOpened(false);
        setIsFocused(false);
      }}
    >
      <button
        type="button"
        onMouseDown={() => setIsOpened(p => !p)}
        className={clsx({
          'h-full w-full rounded-md border px-3 text-left text-sm outline outline-0 outline-blue-200 transition-[border,outline]':
            true,
          'border-blue-500 outline-4': isOpened,
          'border-neutral-200': !isOpened,
          'border-green-600': !!required && !isOpened && hasSelected,
          'border-red-500':
            wasFocused && !isFocused && !!required && !isOpened && !hasSelected,
        })}
      >
        {Array.isArray(displayValue) ? (
          <div className="flex flex-wrap gap-2">
            {displayValue.map((displayV, i) => (
              <span key={i} className="block rounded-md bg-neutral-200 px-1">
                {displayV}
              </span>
            ))}
          </div>
        ) : (
          displayValue
        )}
      </button>
      <div
        style={{
          height: isOpened ? dropDownRef.current?.offsetHeight : 0,
        }}
        className={clsx({
          'absolute -left-1 -right-1 top-[130%] z-10 overflow-hidden rounded-sm bg-white transition-[height]':
            true,
        })}
      >
        <div ref={dropDownRef} className="border">
          {searchString && onSearchStringChange ? (
            <div className="border-b px-4 py-3">
              <TextField />
            </div>
          ) : null}
          <ul className="flex flex-col">{items}</ul>
        </div>
      </div>
    </div>
  );
}

export type OptionProps<T extends Id = Id> = {
  value: T;
  children: string | number;
};

Select.Option = forwardRef<HTMLLIElement, OptionProps>(function Option(
  { children },
  ref
) {
  const { isSelected, triggerSelect } = useContext(OptionContext);
  return (
    <li className="group" ref={ref}>
      <button
        type="button"
        className={clsx({
          'w-full border-b px-3 py-2 text-left group-last:border-b-0': true,
          'bg-blue-50': isSelected,
        })}
        onClick={triggerSelect}
      >
        {children}
      </button>
    </li>
  );
});

/*
Usage:

Types of <Select />
1. With search
2. With multiple options
3. With single option only

<Select
  multiple
  value={T | T[]}
  searchString={string}
  onSearchStringChange={}
  onChange={}
>
  <Select.Option value={T}>displayValue</Option>
  <Select.Option value={T}>displayValue 2</Option>
  <Select.Option value={T}>displayValue 3</Option>
  <Select.Option value={T}>displayValue 4</Option>
</Select>
*/
