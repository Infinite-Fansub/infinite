import { Color } from "colours.js/dst";

export type ErrorLoggerOptions = {
    errCode?: string,
    ref?: boolean,
    lines?: Array<{ err: string, marker: { text: string, color?: Color } }>
};