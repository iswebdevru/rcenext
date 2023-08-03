'use client';

import { Button } from '@/shared/ui/Controls';
import { useSubjectCreateFormIsOpen } from './store';

export function SubjectCreateFormOpenButton() {
  const toggle = useSubjectCreateFormIsOpen(state => state.toggle);

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
