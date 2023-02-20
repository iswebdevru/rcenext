import { Dispatch, PropsWithChildren, SetStateAction } from 'react';

type OptionId = string | number | (string | number)[];

type SelectProps = {
  value: OptionId;
  setValue: Dispatch<SetStateAction<OptionId>>;
} & PropsWithChildren;

export default function Select({ value, children }: SelectProps) {
  return <div>{children}</div>;
}

type OptionProps = {
  value: OptionId;
} & PropsWithChildren;

export function Option({ children, value }: OptionProps) {
  return (
    <li>
      <button>{children}</button>
    </li>
  );
}

/*
Usage:

<Select >
  <Option value={id}>value</Option>
  <Option value={id2}>value 2</Option>
  <Option value={id3}>value 3</Option>
  <Option value={id4}>value 4</Option>
</Select>

*/
