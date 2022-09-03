export function $objectToArray<T>(arr: T[]) {
  return Object.entries(arr).map(item => ({
      k: item[0],
      v: item[1]
    })
  )
}