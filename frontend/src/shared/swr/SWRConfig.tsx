import { PropsWithChildren } from 'react';
import { SWRConfig as InternalSWRConfig } from 'swr';
import { fetcher } from '../api';

export function SWRConfig({ children }: PropsWithChildren) {
  return <InternalSWRConfig value={{ fetcher }}>{children}</InternalSWRConfig>;
}
