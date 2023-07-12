import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { isBrowser } from '@/shared/constants';

const portalRoot = isBrowser ? document.getElementById('__portal') : null;

/**
 * Render children outside of application root.
 */
export function Portal({ children }: PropsWithChildren) {
  if (!portalRoot) {
    return null;
  }
  return createPortal(children, portalRoot!);
}
