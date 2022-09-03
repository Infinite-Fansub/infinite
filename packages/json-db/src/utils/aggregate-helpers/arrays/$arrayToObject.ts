export function $arrayToObject<T>(arr: Array<T[]>) {
  return arr.map(item => ({
        k: item[0],
        v: item[1]
    })
  )
}
