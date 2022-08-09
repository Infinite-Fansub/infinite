import { Color, Colour, DirectGradient, JoinedGradient } from "colours.js/dst";
import { LoggerOptions, Emojis, Colors, PrettyErrorOptions } from "./"

export { };

declare global {
    const logger: Logger;

    class Logger {
        #private;
        constructor(options?: LoggerOptions);
        addMemoryToString(log: string): string;
        date(): string;
        infinitePrint(log: string | TemplateStringsArray): void;
        log(log: string | TemplateStringsArray, ...values: Array<string>): void;
        error(log: string | TemplateStringsArray, ...values: Array<string>): void;
        printf(log: string, customColor: Color | Colour | DirectGradient | JoinedGradient): void;
        print(log: string, options?: {
            memory?: boolean;
            date?: boolean;
            emoji?: boolean;
        } | boolean): void;
        resetColors(): void;
        get showDay(): boolean;
        set showDay(value: boolean);
        get showMemory(): boolean;
        set showMemory(value: boolean);
        get emojis(): Emojis;
        set emojis(emojis: Partial<Emojis>);
        get colors(): Colors;
        set colors(colors: Partial<Colors>);
    }

    class PrettyError extends Error {
        constructor(err?: string | Error, options?: PrettyErrorOptions);
        private static colorLocation;
        private static line;
        private static marker;
        private static generateLines;
        private static getLine;
    }
}