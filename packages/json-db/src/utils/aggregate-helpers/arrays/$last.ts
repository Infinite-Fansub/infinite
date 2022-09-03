export function $last<T>(arr: Array<T>): T {
    return arr.at(-1) as T;
}
