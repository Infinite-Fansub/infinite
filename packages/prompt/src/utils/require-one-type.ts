export type RequireAtLeastOneType<T, Keys extends keyof T> = Pick<T, Exclude<keyof T, Keys>>
    & { [K in Keys]: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];