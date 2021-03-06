import { Color } from "colours.js/dst";

export type ErrorLoggerOptions = {
    errCode?: string,
    ref?: boolean,
    lines?: Array<{ err: string, marker: MarkerOptions }>
};

export type MarkerOptions = {
    text: string,
    color?: Color,
    spaced?: boolean,
    nl?: boolean
};