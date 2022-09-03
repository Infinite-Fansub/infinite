export function $maxN(arr: number[], n: number) {
  return arr.sort((a, b) => (a > b ? -1 : 0)).slice(0, n);
}
