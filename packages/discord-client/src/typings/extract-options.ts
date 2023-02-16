import { InfiniteClient } from "../client";

export type ExtractClientOptions<T> = T extends InfiniteClient<infer O> ? O : never;