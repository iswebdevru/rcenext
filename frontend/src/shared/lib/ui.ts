/**
 * Concatenates class names depending on condition
 */
export function clsx(
  ...classes: (
    | Record<string, boolean | null | undefined>
    | string
    | number
    | null
    | undefined
    | boolean
  )[]
) {
  let result = '';

  for (let i = 0; i < classes.length; i++) {
    const entry = classes[i];
    if (!entry) {
      continue;
    }
    switch (typeof entry) {
      case 'number':
      case 'string':
        result += ` ${entry}`;
        break;
      case 'object':
        result += ` ${Object.entries(entry)
          .filter(([_, value]) => !!value)
          .map(([key]) => key)
          .join(' ')}`;
    }
  }
  return result;
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
