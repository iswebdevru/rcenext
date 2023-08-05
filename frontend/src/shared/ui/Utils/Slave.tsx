'use client';

import { useEvent } from '@/shared/hooks';
import {
  ComponentPropsWithoutRef,
  ElementType,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';

const OFFSET = 8;

export type SlaveProps<T extends ElementType> = {
  tag?: T;
  master: RefObject<HTMLElement>;
} & ComponentPropsWithoutRef<T>;

export function Slave<T extends ElementType = 'div'>({
  tag,
  master,
  children,
  style,
  ...restProps
}: SlaveProps<T>) {
  const Tag = tag ?? 'div';

  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(0);

  const update = useCallback(() => {
    const masterRect = master.current?.getBoundingClientRect();
    if (!masterRect) {
      console.log('nothing');

      return;
    }
    setLeft(masterRect.left);
    setTop(masterRect.bottom + OFFSET);
    setWidth(masterRect.width);
  }, [master]);

  useEvent('resize', update);
  useEvent('scroll', update);

  useEffect(() => {
    update();
  }, [update]);

  return (
    <Tag
      {...restProps}
      style={{
        ...style,
        left,
        top,
        width,
      }}
    >
      {children}
    </Tag>
  );
}
