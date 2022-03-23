import { Color } from "colours.js/dst";

export type ReadLineOptions<T extends boolean> = {
    defaultText?: string,
    prompt?: string,
    solid?: T extends true ? { color: string | Color } : T,
    gradient?: T extends true ? { primaryColor: string | Color, secondaryColor: string | Color } : T
};