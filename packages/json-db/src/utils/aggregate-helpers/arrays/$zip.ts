export function $zip(arr1: Array<unknown>, arr2: Array<unknown>): Array<unknown> {
    const arr3 = [];

    for (let i = 0; i < arr1.length; i++) {
        arr3.push([arr1[i], arr2[i]]);
    }

    return arr3;
}
