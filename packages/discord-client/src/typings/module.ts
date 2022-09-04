import { InfiniteClient } from "../client";

export type Module = {
    name: string,
    ctor: new (client: InfiniteClient) => unknown
};

export type ExctractName<T> = | (T extends infer U ? U : never)
    | Extract<T, number | string | boolean | bigint | symbol | null | undefined | []>
    | ([T] extends [[]] ? [] : { [K in keyof T]: ExctractName<T[K]> });

export type WithModules<M extends Array<Module>, F = true> = F extends true ? { [N in M[number]["name"]]: CTORType<M[number]["ctor"]> } : never;

type CTORType<T> = T extends new () => infer U ? U : never;