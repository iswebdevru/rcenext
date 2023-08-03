'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupSelect } from '@/entities/groups';

export function GroupSearch() {
  const router = useRouter();
  const [groupSearch, setGroupSearch] = useState('');

  return (
    <GroupSelect
      groupSearch={groupSearch}
      onGroupSearchChange={setGroupSearch}
      onSelect={() => router.push('/')}
    />
  );
}
