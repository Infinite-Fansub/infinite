import { Color } from "colours.js/dst";

export type PrettyErrorOptions = {
    type?: string,
    errCode?: string,
    ref?: string,
    lines?: Array<{ err: string, marker: MarkerOptions }>
};

export type MarkerOptions = {
    text: string,
    color?: Color,
    spaced?: boolean,
    nl?: boolean
};