import { RefCallback, useCallback, useRef } from 'react';

export function usePagination<E extends Element = Element>(
  toNextPage: () => void
) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef: RefCallback<E> = useCallback(
    elem => {
      if (!observer.current) {
        observer.current = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                toNextPage();
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.7 }
        );
      }
      if (!elem) {
        observer.current.disconnect();
      } else {
        observer.current.observe(elem);
      }
    },
    [toNextPage]
  );

  return lastElementRef;
}
