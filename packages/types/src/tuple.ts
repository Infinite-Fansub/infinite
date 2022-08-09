export type Tuple<T, K = undefined> = T extends Array<unknown>
    ? K extends undefined
    ? T
    : [T, K]
    : T extends unknown
    ? K extends undefined
    ? T extends Record<PropertyKey, unknown>
    ? [T]
    : [T]
    : [T, K]
    : null;