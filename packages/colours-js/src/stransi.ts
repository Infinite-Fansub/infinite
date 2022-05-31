import { TERMINATOR } from "./ansi";

export const CHANGES_FG = /\x1b\[[39]\d(;\d+)*m/;
export const CHANGES_BG = /\x1b\[(4|10)\d(;\d+)*m/;
export const ANSI_REGEX = /\x1b\[(\d+(;\d+)*)?m/;
export const ANSI_REGEX_P = /^\x1b\[(\d+(;\d+)*)?m/;

/**Separates a string into an array of characters or substrings,
 * such that the length of the newly generated array
 * is equal to the length of the original string
 * ignoring any ANSI escape sequences.
 **/
export function splitAnsiString(s: string): Array<string> {
    let result: Array<string> = [];
    for (let i = 0, c = s[i]; i < s.length; c = s[++i]) {
        let sl = c;
        while (ANSI_REGEX_P.test(s.slice(i)))
            while (c != TERMINATOR && c != undefined) sl += (c = s[++i]) ?? "";
        sl += (c = s[++i]) ?? "";
        while (ANSI_REGEX_P.test(s.slice(i)))
            while (c != TERMINATOR && c != undefined) sl += (c = s[++i]) ?? "";
        result.push(sl);
    }
    return result;
}