export function $in<T>(arr: Array<T>, value: T): boolean {
    return arr.includes(value);
}
