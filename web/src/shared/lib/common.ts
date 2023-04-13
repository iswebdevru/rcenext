export function compareArrays<T>(a1: T[], a2: T[]) {
  if (a1.length !== a2.length) {
    return false;
  }
  return a1.every(v => a2.includes(v));
}

export function arrayN(n: number) {
  const a: number[] = [];
  for (let i = 0; i < n; i++) {
    a.push(i);
  }
  return a;
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
