import { ElementRef, PropsWithChildren, useEffect, useRef } from 'react';
import { noop } from '../lib/common';
export type InfiniteScrollProps = PropsWithChildren<{
  loadMore: () => void;
}>;

export function InfiniteScroll({ children, loadMore }: InfiniteScrollProps) {
  const ref = useRef<ElementRef<'div'>>(null);
  const loadMoreCbRef = useRef(loadMore);
  loadMoreCbRef.current = loadMore;

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
          loadMoreCbRef.current();
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
    <div className="relative">
      {children}
      <div
        className="pointer-events-none absolute bottom-[min(75%,75vh)]"
        ref={ref}
      ></div>
    </div>
  );
}
