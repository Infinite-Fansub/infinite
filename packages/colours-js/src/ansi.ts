/*eslint-disable @typescript-eslint/naming-convention*/
export const ESCAPE_SEQUENCE = "\x1b[";
export const TERMINATOR = "m";

export const RESET_TOKEN = ESCAPE_SEQUENCE + TERMINATOR;

export const FOREGROUND_RGB = `${ESCAPE_SEQUENCE}38;2;`;
export const BACKGROUND_RGB = `${ESCAPE_SEQUENCE}48;2;`;

export enum COLORS {
    BLACK,
    RED,
    GREEN,
    YELLOW,
    BLUE,
    MAGENTA,
    CYAN,
    WHITE,
    RESET = 9,
    BRIGHT_BLACK = 60,
    BRIGHT_RED,
    BRIGHT_GREEN,
    BRIGHT_YELLOW,
    BRIGHT_BLUE,
    BRIGHT_MAGENTA,
    BRIGHT_CYAN,
    BRIGHT_WHITE
}

export enum SGR_CODES {
    RESET,
    BOLD,
    FAINT,
    ITALIC,
    UNDERLINED,
    SLOW_BLINK,
    RAPID_BLINK,
    REVERSED,
    CONCEAL,
    CROSSED_OUT,
    NORMAL_INTENSITY = 22,
    NOT_ITALIC,
    NOT_UNDERLINED,
    NOT_BLINKING,
    NOT_REVERSED = 27,
    REVEAL,
    NOT_CROSSED_OUT,
    FG_COLOR,
    BG_COLOR = 40
}

export function AnsiFromList(...l: Array<number | string>): string {
    return ESCAPE_SEQUENCE + l.join(";") + TERMINATOR;
}

export const AnsiCode = {
    FG_BLACK: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BLACK),
    FG_RED: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.RED),
    FG_GREEN: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.GREEN),
    FG_YELLOW: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.YELLOW),
    FG_BLUE: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BLUE),
    FG_MAGENTA: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.MAGENTA),
    FG_CYAN: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.CYAN),
    FG_WHITE: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.WHITE),
    FG_RESET: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.RESET),
    FG_BRIGHT_BLACK: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BRIGHT_BLACK),
    FG_BRIGHT_RED: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BRIGHT_RED),
    FG_BRIGHT_GREEN: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BRIGHT_GREEN),
    FG_BRIGHT_YELLOW: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BRIGHT_YELLOW),
    FG_BRIGHT_BLUE: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BRIGHT_BLUE),
    FG_BRIGHT_MAGENTA: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BRIGHT_MAGENTA),
    FG_BRIGHT_CYAN: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BRIGHT_CYAN),
    FG_BRIGHT_WHITE: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.BRIGHT_WHITE),
    BG_BLACK: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BLACK),
    BG_RED: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.RED),
    BG_GREEN: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.GREEN),
    BG_YELLOW: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.YELLOW),
    BG_BLUE: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BLUE),
    BG_MAGENTA: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.MAGENTA),
    BG_CYAN: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.CYAN),
    BG_WHITE: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.WHITE),
    BG_RESET: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.RESET),
    BG_BRIGHT_BLACK: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BRIGHT_BLACK),
    BG_BRIGHT_RED: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BRIGHT_RED),
    BG_BRIGHT_GREEN: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BRIGHT_GREEN),
    BG_BRIGHT_YELLOW: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BRIGHT_YELLOW),
    BG_BRIGHT_BLUE: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BRIGHT_BLUE),
    BG_BRIGHT_MAGENTA: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BRIGHT_MAGENTA),
    BG_BRIGHT_CYAN: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BRIGHT_CYAN),
    BG_BRIGHT_WHITE: AnsiFromList(SGR_CODES.BG_COLOR + COLORS.BRIGHT_WHITE),
    COLOR_RESET: AnsiFromList(SGR_CODES.FG_COLOR + COLORS.RESET, SGR_CODES.BG_COLOR + COLORS.RESET),
    RESET: AnsiFromList(),
    BOLD: AnsiFromList(SGR_CODES.BOLD),
    FAINT: AnsiFromList(SGR_CODES.FAINT),
    ITALIC: AnsiFromList(SGR_CODES.ITALIC),
    UNDERLINED: AnsiFromList(SGR_CODES.UNDERLINED),
    REVERSED: AnsiFromList(SGR_CODES.REVERSED),
    CROSSED_OUT: AnsiFromList(SGR_CODES.CROSSED_OUT),
    NORMAL_INTENSITY: AnsiFromList(SGR_CODES.NORMAL_INTENSITY),
    NOT_ITALIC: AnsiFromList(SGR_CODES.NOT_ITALIC),
    NOT_UNDERLINED: AnsiFromList(SGR_CODES.NOT_UNDERLINED),
    NOT_REVERSED: AnsiFromList(SGR_CODES.NOT_REVERSED),
    NOT_CROSSED_OUT: AnsiFromList(SGR_CODES.NOT_CROSSED_OUT)
};