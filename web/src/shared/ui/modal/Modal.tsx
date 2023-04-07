import { clsx } from '@/shared/lib/ui';
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
    rootRef.current = document.getElementById('__root') as HTMLDivElement;
    setMounted(true);
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [onClose]);

  if (!rootRef.current || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className={clsx({
        'fixed z-20 top-0 left-0 w-full h-full flex transition p-4': true,
        'visible opacity-100': state,
        'invisible opacity-0': !state,
      })}
    >
      <div ref={modalRef} className="relative z-30 max-w-4xl m-auto grow">
        {children}
      </div>
      <div
        onClick={onClose}
        className="fixed top-0 left-0 w-full h-full bg-black opacity-50 cursor-pointer"
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
