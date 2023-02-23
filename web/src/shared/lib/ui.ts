export function className(classes: Record<string, boolean>) {
  return Object.entries(classes)
    .filter(([_, shouldCommit]) => shouldCommit)
    .map(([v]) => v)
    .join(' ');
}

export function classNameWithDefaults(defaults: string, additional?: string) {
  return additional ? `${defaults} ${additional}` : defaults;
}
