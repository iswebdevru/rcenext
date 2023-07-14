import { RefObject } from 'react';

/**
 * Calls provided function if click is out of node scope
 * @param node
 * @param fn
 */
export function ignoreClick(
  nodeRef: RefObject<Node>,
  fn: (e: MouseEvent) => void,
) {
  return (e: MouseEvent) => {
    if (
      !(e.target instanceof Node) ||
      !nodeRef.current ||
      nodeRef.current.contains(e.target)
    ) {
      return;
    }
    fn(e);
  };
}
