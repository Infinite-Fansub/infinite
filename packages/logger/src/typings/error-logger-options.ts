import { Color } from "colours.js/dst";

export type ErrorLoggerOptions = {
    errCode?: string | number,
    ref?: boolean,
    showNormalMessage?: boolean,
    lines?: Array<{ err: string, marker: MarkerOptions }>
};

export type MarkerOptions = {
    text: string,
    color?: Color,
    spaced?: boolean,
    nl?: boolean
};