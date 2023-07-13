/**
 * Calls provided function if click is out of node scope
 * @param node
 * @param fn
 */
export function ignoreClick(node: Node | null, fn: (e: MouseEvent) => void) {
  return (e: MouseEvent) => {
    if (!(e.target instanceof Node) || node?.contains(e.target)) {
      return;
    }
    fn(e);
  };
}
