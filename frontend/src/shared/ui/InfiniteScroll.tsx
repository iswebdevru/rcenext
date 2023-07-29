import { ElementRef, PropsWithChildren, useEffect, useRef } from 'react';
import { noop } from '../lib/common';
// todo: dodelay
export type InfiniteScrollProps = PropsWithChildren<{
  loadMore: () => void;
}>;

export function InfiniteScroll({ children, loadMore }: InfiniteScrollProps) {
  const ref = useRef<ElementRef<'div'>>(null);

  useEffect(() => {
    if (!ref.current) {
      return noop;
    }
    const element = ref.current;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }
          console.log(entry);

          loadMore();
        });
      },
      {
        threshold: 1,
      },
    );
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [loadMore]);

  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute bottom-96" ref={ref}></div>
    </div>
  );
}
