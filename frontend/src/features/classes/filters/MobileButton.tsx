import {
  useRegisterOutsideClickException,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { Portal } from '@/shared/ui/Utils';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';

export type FiltersButtonProps = {
  onOpen: () => void;
};

export const MobileButton = withOutsideClickExceptionsContext(
  function MobileButton({ onOpen }: FiltersButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);

    useRegisterOutsideClickException(ref);

    return (
      <Portal>
        <button
          ref={ref}
          className="fixed bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-colors hover:bg-blue-600 hover:text-zinc-100 hover:shadow-md dark:bg-blue-700 dark:hover:bg-blue-900 lg:hidden"
          onClick={onOpen}
        >
          <FontAwesomeIcon icon={faFilter} fixedWidth size="lg" />
        </button>
      </Portal>
    );
  },
);
