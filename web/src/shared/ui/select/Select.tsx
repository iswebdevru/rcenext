import { useClickOutside } from '@/shared/hooks';
import { className } from '@/shared/lib/ui';
import {
  ChangeEvent,
  Children,
  EventHandler,
  ReactElement,
  useRef,
  useState,
} from 'react';

type CommonSelectProps<T extends string | number> = {
  searchString?: string;
  onSearchStringChange?: EventHandler<ChangeEvent>;
  children?: ReactElement<OptionProps<T>>[];
  placeholder?: string;
  required?: boolean;
};

type SingleSelectProps<T extends string | number> = {
  multiple?: false;
  value?: T;
  onChange: (value: T) => void;
} & CommonSelectProps<T>;

type MultipleSelectProps<T extends string | number> = {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
} & CommonSelectProps<T>;

export type SelectProps<T extends string | number | (string | number)[]> =
  T extends Array<infer K extends string | number>
    ? MultipleSelectProps<K>
    : T extends string | number
    ? SingleSelectProps<T>
    : never;

export function Select<T extends string | number | (string | number)[]>({
  children,
  value,
  onChange,
  multiple,
  searchString,
  onSearchStringChange,
  placeholder,
  required,
}: SelectProps<T>) {
  const [isOpened, setIsOpened] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useClickOutside(componentRef, () => setIsOpened(false));

  const isSelected =
    value !== undefined && !(Array.isArray(value) && value.length === 0);

  let displayValue: string[] | string = isSelected
    ? multiple
      ? []
      : ''
    : placeholder ?? 'Не выбрано';

  const items = Children.map(children, child => {
    if (!child) {
      return null;
    }
    if (multiple && value.includes(child.props.value)) {
      (displayValue as string[]).push(child.props.children.toString());
    } else if (!multiple && value === child.props.value) {
      displayValue = child.props.children.toString();
    }
    return (
      <li className="group">
        <button
          type="button"
          className={className({
            'px-2 py-1 border-b group-last:border-b-0 w-full text-left': true,
            'bg-slate-200': multiple
              ? value.includes(child.props.value)
              : value === child.props.value,
          })}
          onClick={() => {
            if (multiple) {
              if (value.includes(child.props.value)) {
                onChange(value.filter(v => v !== child.props.value));
              } else {
                onChange([...value, child.props.value]);
              }
            } else {
              setIsOpened(false);
              onChange(child.props.value as never);
            }
          }}
        >
          {child.props.children}
        </button>
      </li>
    );
  });

  return (
    <div className="relative" ref={componentRef}>
      <button
        type="button"
        onClick={() => setIsOpened(p => !p)}
        className={className({
          'w-full transition-[outline] p-2 text-left text-sm outline outline-1 outline-neutral-300 rounded-sm':
            true,
          'outline-slate-400': isOpened,
          'outline-green-600': !!required && !isOpened && isSelected,
          'outline-red-800': !!required && !isOpened && !isSelected,
        })}
      >
        {Array.isArray(displayValue)
          ? displayValue.map(displayV => <>{displayV}</>)
          : displayValue}
      </button>
      <div
        style={{
          height: isOpened ? dropDownRef.current?.offsetHeight : 0,
        }}
        className={className({
          'absolute bg-white z-10 -left-1 top-[120%] -right-1 rounded-sm overflow-hidden transition-[height]':
            true,
        })}
      >
        <div ref={dropDownRef} className="border">
          {searchString && onSearchStringChange ? (
            <div className="p-2 border-b">
              <input type="text" className="w-full px-1 border" />
            </div>
          ) : null}
          <ul className="flex flex-col">{items}</ul>
        </div>
      </div>
    </div>
  );
}

export type OptionProps<T> = {
  value: T;
  children: string | number;
};

Select.Option = function Option<T>(_: OptionProps<T>) {
  return null;
};

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
