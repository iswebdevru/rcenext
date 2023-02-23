import { className } from '@/shared/lib/ui';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type ModalProps = {
  state: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export function Modal({ state, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    rootRef.current = document.getElementById('__next') as HTMLDivElement;
    setMounted(true);
  }, []);

  if (!rootRef.current || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className={className({
        'fixed top-0 left-0 w-full h-full grid place-items-center transition':
          true,
        'visible opacity-100': state,
        'invisible opacity-0': !state,
      })}
    >
      <div ref={modalRef} className="z-50 w-1/2 bg-white h-1/2">
        здесь будет модал окно
      </div>
      <div
        onClick={onClose}
        className="fixed top-0 left-0 z-40 w-full h-full bg-black opacity-50 cursor-pointer"
      ></div>
    </div>,
    rootRef.current
  );
}

/**
 * Intended behavior:
 * <Modal
 *    state
 *    onStateChange
 * >
 *  Element to be seen
 * </Modal>
 *
 */
