export function $slice<T>(arr: T[], n: number, pos?: number) {
  if (!pos && n > 0) pos = 0;

  return arr.slice(n, pos);
}
