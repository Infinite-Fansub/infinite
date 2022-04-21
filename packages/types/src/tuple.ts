import { float } from "./float";
import { integer } from "./integer";

type TypesOfTuples = Minimal | Complex;
type Minimal = string | number | boolean | Date | float | integer | Record<PropertyKey, unknown>;
type Complex = Array<string | number | boolean | Date | float | integer | Record<PropertyKey, unknown> | Array<unknown>>;

export type Tuple<T extends TypesOfTuples, K extends Minimal | undefined = undefined> = T extends Minimal
    ? K extends undefined
    ? T extends Record<PropertyKey, unknown>
    ? [T]
    : [T]
    : [T, K]
    : T extends Complex
    ? K extends undefined
    ? T
    : [T, K]
    : null;