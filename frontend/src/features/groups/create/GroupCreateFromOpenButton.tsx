'use client';

import { Button } from '@/shared/ui/Controls';
import { useGroupsCreateFormIsOpen } from './store';

export function GroupCreateFormOpenButton() {
  const toggle = useGroupsCreateFormIsOpen(state => state.toggle);

  return (
    <Button
      type="button"
      variant="primary"
      onClick={() => {
        toggle(true);
      }}
    >
      Добавить
    </Button>
  );
}
