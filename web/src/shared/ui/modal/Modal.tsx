import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type ModalProps = {
  children?: ReactNode;
};

export default function Modal() {
  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full"></div>,
    document.getElementById('__next')!
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
