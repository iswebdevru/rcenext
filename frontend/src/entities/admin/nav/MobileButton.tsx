import { HamburgerButton } from '@/shared/ui/Controls';
import { Portal } from '@/shared/ui/Utils';

export type AdminNavMobileButtonProps = {
  onOpen: () => void;
};

export function AdminNavMobileButton({ onOpen }: AdminNavMobileButtonProps) {
  return (
    <Portal>
      <div className="fixed bottom-12 left-12 z-20 block lg:hidden">
        <HamburgerButton
          onClick={onOpen}
          className="h-14 w-14 rounded-full bg-blue-500 p-3 shadow-sm transition-colors hover:bg-blue-600 hover:shadow-lg dark:bg-blue-700 dark:hover:bg-blue-900"
          variant="contrast"
        />
      </div>
    </Portal>
  );
}
