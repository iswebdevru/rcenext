import { PropsWithChildren, useState } from 'react';
import { createPortal } from 'react-dom';
import { isBrowser } from '@/shared/constants';
import { useOnMount } from '@/shared/hooks';

const portalRoot = isBrowser ? document.getElementById('__portal') : null;

/**
 * Render children outside of application root.
 */
export function Portal({ children }: PropsWithChildren) {
  const [isMounted, setIsMounted] = useState(false);

  useOnMount(() => setIsMounted(true));

  if (!portalRoot || !isMounted) {
    return null;
  }

  return createPortal(children, portalRoot!);
}
