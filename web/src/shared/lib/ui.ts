export function className(classes: Record<string, boolean>) {
  return Object.entries(classes)
    .filter(([_, shouldCommit]) => shouldCommit)
    .map(([v]) => v)
    .join(' ');
}

export function classNameForMirrorComponent(base: string, additional?: string) {
  return additional ? `${base} ${additional}` : base;
}
