export function className(classes: Record<string, boolean>) {
  return Object.entries(classes)
    .filter(([_, shouldCommit]) => shouldCommit)
    .map(([v]) => v)
    .join(' ');
}
