'use client';

import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { fetcher } from '@/shared/api';

export function SWRGlobalConfig({ children }: PropsWithChildren) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}
