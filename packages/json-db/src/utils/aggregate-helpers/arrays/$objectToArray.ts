export function $objectToArray<T>(arr: Array<T>): Array<{ k: string, v: T }> {
    return Object.entries(arr).map((item) => ({
        k: item[0],
        v: item[1]
    }));
}
