'use client';

import { PropsWithChildren, createContext, useContext } from 'react';

const ZIndexContext = createContext(10);

export type ZIndexProps = { index: number } & PropsWithChildren;

export function ZIndex({ children, index }: ZIndexProps) {
  return (
    <ZIndexContext.Provider value={index}>{children}</ZIndexContext.Provider>
  );
}

export function useZIndex() {
  return useContext(ZIndexContext);
}
