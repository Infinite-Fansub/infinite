export function $lastN<T>(arr: Array<T>, n: number): Array<T> {
    return arr.slice(-n);
}
