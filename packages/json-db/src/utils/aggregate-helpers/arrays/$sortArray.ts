export function $sortArray<T>(arr: Array<T>, sortBy: number | Record<keyof T, -1 | 0 | 1>): Array<T> {
    if (typeof sortBy === "object") {
        Object.entries<-1 | 0 | 1>(sortBy).forEach(([k, v]) => {
            arr = arr.sort((a, b) => {
                if (v === -1 && a[k as keyof T] > b[k as keyof T]) return v;
                if (v === 1 && a[k as keyof T] < b[k as keyof T]) return -1;

                return 0;
            });
        });

        return arr;
    }

    return arr.sort((a, b) => {
        if (sortBy === -1 && a > b) return sortBy;
        if (sortBy === 1 && a < b) return -1;

        return 0;
    });
}
