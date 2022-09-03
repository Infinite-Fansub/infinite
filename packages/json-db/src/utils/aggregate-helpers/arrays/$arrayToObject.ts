export function $arrayToObject<T>(arr: Array<Array<T>>): Array<{ k: T, v: T }> {
    return arr.map((item) => ({
        k: item[0],
        v: item[1]
    }));
}
