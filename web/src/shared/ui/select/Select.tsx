import { className } from '@/shared/lib/ui';
import {
  ChangeEvent,
  Children,
  EventHandler,
  ReactElement,
  useRef,
  useState,
} from 'react';

type SingleSelectProps<T> = {
  multiple?: false;
  value: T;
  onChange: (value: T) => void;
  searchString?: string;
  onSearchStringChange?: EventHandler<ChangeEvent>;
  children: ReactElement<OptionProps<T>>[];
};

type MultipleSelectProps<T> = {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
  searchString?: string;
  onSearchStringChange?: EventHandler<ChangeEvent>;
  children: ReactElement<OptionProps<T>>[];
};

export type SelectProps<T> = T extends Array<infer K>
  ? MultipleSelectProps<K>
  : SingleSelectProps<T>;

export function Select<T>({
  children,
  value,
  onChange,
  multiple,
  searchString,
  onSearchStringChange,
}: SelectProps<T>) {
  const [isOpened, setIsOpened] = useState(false);
  const listRef = useRef<HTMLInputElement>(null);

  let displayValue: string[] | string = multiple ? [] : '';

  console.log(listRef.current);

  const items = Children.map(children, child => {
    if (multiple && value.includes(child.props.value)) {
      (displayValue as string[]).push(child.props.children.toString());
    } else if (!multiple && value === child.props.value) {
      displayValue = child.props.children.toString();
    }
    return (
      <li className="group">
        <button
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
              onChange(child.props.value as any);
            }
          }}
        >
          {child.props.children}
        </button>
      </li>
    );
  });
  return (
    <div>
      <button
        onClick={() => setIsOpened(p => !p)}
        className={className({
          'w-full p-2 mb-2 text-left border rounded-sm': true,
          'border-green-600': isOpened,
        })}
      >
        {Array.isArray(displayValue)
          ? displayValue.map(displayV => <>{displayV}</>)
          : displayValue}
      </button>
      <div
        style={{
          height: isOpened ? listRef.current?.offsetHeight : 0,
        }}
        className={className({
          'rounded-sm  overflow-hidden transition-[height]': true,
        })}
      >
        <div className="border" ref={listRef}>
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
