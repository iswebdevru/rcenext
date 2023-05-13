export function clsx(classes: Record<string, boolean>) {
  return Object.entries(classes)
    .filter(([_, shouldCommit]) => shouldCommit)
    .map(([v]) => v)
    .join(' ');
}

export function classNameWithDefaults(defaults: string, additional?: string) {
  return additional ? `${defaults} ${additional}` : defaults;
}

/**
 * endings[0] - 1 запис[ь]
 *
 * endings[1] - 2 запис[и]
 *
 * endings[2] - 5 запис[ей]
 */
export function russianEnding(n: number, endings: [string, string, string]) {
  const last = n % 10;
  if (last === 0 || n % 100 === 11) {
    return endings[2];
  }
  if (last === 1) {
    return endings[0];
  }
  if (last < 5) {
    return endings[1];
  }
  return endings[2];
}
