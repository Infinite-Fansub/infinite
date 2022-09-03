export function $zip(arr1: unknown[], arr2: unknown[]) {
  const arr3 = [];

  for (let i = 0; i < arr1.length; i++) {
    arr3.push([arr1[i], arr2[i]]);
  }

  return arr3;
}
