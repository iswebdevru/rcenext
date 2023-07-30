'use client';

import {
  ElementRef,
  PropsWithChildren,
  RefObject,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useOnMount } from '@/shared/hooks';

type PortalContext = {
  root: RefObject<Element> | null;
};

const PortalContext = createContext<PortalContext>({ root: null });

export function Portal({ children }: PropsWithChildren) {
  const { root } = useContext(PortalContext);
  const [isMounted, setIsMounted] = useState(false);

  useOnMount(() => setIsMounted(true));

  if (!isMounted) {
    return null;
  }

  return createPortal(children, root?.current!);
}

export function PortalProvider({ children }: PropsWithChildren) {
  const ref = useRef<ElementRef<'div'>>(null);

  return (
    <PortalContext.Provider value={{ root: ref }}>
      {children}
      <div ref={ref}></div>
    </PortalContext.Provider>
  );
}
