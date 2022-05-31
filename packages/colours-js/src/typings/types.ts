import { Color } from "../color";

export const COLOR_DATA_SYMBOL = Symbol("colors");

export type AnsiColor = { color: [number, number, number], bg?: boolean };

export type Samplable = Color | ((t: number) => Color);

export interface IApplicable extends Object {
    [COLOR_DATA_SYMBOL]: { getAt: Samplable, bg?: boolean };
}