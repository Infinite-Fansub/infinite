export function $minN(arr: Array<number>, n: number): Array<number> {
    return arr.sort((a, b) => a < b ? -1 : 0).slice(0, n);
}
