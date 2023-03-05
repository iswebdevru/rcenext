export function compareArrays<T>(a1: T[], a2: T[]) {
  if (a1.length !== a2.length) {
    return false;
  }
  return a1.every(v => a2.includes(v));
}
