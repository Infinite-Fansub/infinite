import { Schema } from "../schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractSchemaDefinition<T> = T extends Schema<infer S, any> ? S : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractSchemaMethods<T> = T extends Schema<any, infer M> ? M : never;