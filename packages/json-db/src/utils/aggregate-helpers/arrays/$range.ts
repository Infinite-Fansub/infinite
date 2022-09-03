export function $range(start: number, end: number, step?: number) {
  let totalCount = []

  if (start < end && typeof step === "number" && step <= 0) return []

  while ((typeof step === "number" && step < 0 && start > end) || start < end) {
    totalCount.push(start)
    start += step ?? 1
  }

  return totalCount
}
