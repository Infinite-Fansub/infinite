export function $slice<T>(arr: Array<T>, n: number, pos?: number): Array<T> {
    if (!pos && n > 0) pos = 0;

    return arr.slice(n, pos);
}
