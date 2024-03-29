import { InfiniteClient } from "../client";

export type Module = {
    name: string,
    ctor: new (client: InfiniteClient) => unknown
};

export type ExtractName<T> = Extract<T, string> | ([T] extends [[]] ? [] : { [K in keyof T]: ExtractName<T[K]> });

export type WithModules<M extends Array<Module>, F = true> = F extends true ? { [N in M[number]["name"]]: CTORType<M[number]["ctor"]> } : never;

type CTORType<T> = T extends new (client: InfiniteClient) => infer U ? U : never;