'use client';

import { Button } from '@/shared/ui/Controls';
import { useTeacherCreateFormIsOpen } from './store';

export function TeacherOpenCreateFormButton() {
  const toggle = useTeacherCreateFormIsOpen(state => state.toggle);

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
