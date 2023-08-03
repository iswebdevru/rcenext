import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useUpdateEffect } from './useUpdateEffect';

export function useUpdateSearchParams(params: Record<string, string>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useUpdateEffect(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      nextSearchParams.set(key, value);
    });
    router.push(`${pathname}?${nextSearchParams}`);
  }, [router, pathname, searchParams, JSON.stringify(params)]);
}
