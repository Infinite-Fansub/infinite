import { Color, Colour, DirectGradient, JoinedGradient } from "colours.js/dst";
import { LoggerOptions, Emojis, Colors, PrettyErrorOptions } from "./src"

export { };

declare global {
    export const logger: Logger;

    export class Logger {
        #private;
        constructor(options?: LoggerOptions);
        private addMemoryToString;
        private date;
        infinitePrint(log: string | TemplateStringsArray): void;
        defaultPrint(log: string | TemplateStringsArray, ...values: Array<string>): void;
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

    export class PrettyError extends Error {
        constructor(message?: string, options?: PrettyErrorOptions);
        private static colorLocation;
        private static line;
        private static marker;
        private static generateLines;
        private static getLine;
    }
}