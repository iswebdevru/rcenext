import { useEffect } from 'react';
import { isBrowser } from '../constants';

export function useEvent<K extends keyof WindowEventMap>(
  type: K,
  handler?: (this: Window, event: WindowEventMap[K]) => any,
  target?: Window | null,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEvent<
  T extends HTMLElement,
  K extends keyof HTMLElementEventMap,
>(
  type: K,
  handler?: (this: HTMLElement, event: HTMLElementEventMap[K]) => void,
  target?: T | null,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEvent<
  K extends keyof WindowEventMap | keyof HTMLElementEventMap,
>(
  type: K,
  handler?: (this: HTMLElement | Window, event: Event) => any,
  target: HTMLElement | Window | null = isBrowser ? window : null,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    if (target && handler) {
      target.addEventListener(type, handler, options);
      return () => target.removeEventListener(type, handler, options);
    }
  }, [type, handler, target, options]);
}
