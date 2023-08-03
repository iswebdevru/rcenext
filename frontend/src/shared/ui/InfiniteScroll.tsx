import {
  ElementRef,
  ElementType,
  PropsWithChildren,
  useEffect,
  useRef,
} from 'react';
import { noop } from '../lib/common';

export type InfiniteScrollProps = PropsWithChildren<{
  onLoad: () => void;
  ignore: boolean;
  wrapper?: ElementType;
  trigger?: ElementType;
}>;

export function InfiniteScroll({
  onLoad,
  children,
  ignore,
  wrapper: Wrapper = 'div',
  trigger: Trigger = 'div',
}: InfiniteScrollProps) {
  const ref = useRef<ElementRef<'div'>>(null);
  const onLoadRef = useRef(onLoad);
  const ignoreRef = useRef(ignore);
  onLoadRef.current = onLoad;
  ignoreRef.current = ignore;

  useEffect(() => {
    if (!ref.current) {
      return noop;
    }
    const element = ref.current;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || ignoreRef.current) {
            return;
          }
          onLoadRef.current();
        });
      },
      {
        threshold: 1,
      },
    );
    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return (
    <Wrapper className="relative">
      {children}
      <Trigger
        className="pointer-events-none absolute bottom-[min(25%,25vh)]"
        ref={ref}
      />
    </Wrapper>
  );
}
