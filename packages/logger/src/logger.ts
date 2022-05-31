import { c, Color, AnsiCode } from "@infinite-fansub/colours.js";
import { Colors, Emojis, LoggerOptions } from "./typings";
import { InfiniteGradient, getCurrentMemoryHeap } from "./utils";

export class Logger {
    private emoji: string;
    private errorEmoji: string;
    private _showMemory: boolean;
    private _colors: Colors;
    private defaultColors: Colors = {
        color: Color.fromHex("#FF00EF"), //Color.fromHex("#fc036b"),
        templateColor: Color.fromHex("#00DDFF"),
        errorColor: Color.RED,
        templateErrorColor: Color.fromHex("#8C00FF"),
        gradientPrimary: Color.fromHex("#0048ff"),
        gradientSecondary: Color.fromHex("#c603fc")
    };

    public constructor(options?: LoggerOptions) {
        this._colors = { ...this.defaultColors, ...options?.colors };
        this.emoji = options?.emojis?.emoji ?? "💫";
        this.errorEmoji = options?.emojis?.errorEmoji ?? "❌";
        this._showMemory = options?.showMemory ?? true;
    }

    private addMemoryToString(log: string): string {
        return c`${this._colors.errorColor}${getCurrentMemoryHeap()}${AnsiCode.COLOR_RESET} ${log}`;
    }

    private static date(): string {
        return c`${Color.WHITE.asBackground}${Color.BLACK.asForeground}[${new Date().toLocaleTimeString()}]`;
    }

    public infinitePrint(log: string | TemplateStringsArray /*, ...values: Array<string>*/): void {
        if (typeof log === "string") {

            if (this._showMemory)
                console.log(this.addMemoryToString(`${Logger.date()} ${this.emoji} ${gradient(log, InfiniteGradient(true))}`));
            else console.log(`${Logger.date()} ${this.emoji} ${gradient(log, InfiniteGradient())}`);

            return;
        }

        throw new Error("Template Literall call not implemented yet");
    }

    public defaultPrint(log: string | TemplateStringsArray, ...values: Array<string>): void {
        if (typeof log === "string") {

            log = `${Logger.date()} ${this.emoji} ${uniform(log, this._colors.color)}`;

            if (this._showMemory)
                console.log(this.addMemoryToString(log));
            else console.log(log);

            return;
        }

        // eslint-disable-next-line max-len
        log = <string>values.reduce((final, value, index) => `${Logger.date()} ${this.emoji} ${uniform(<string>final, this._colors.color)}${uniform(value, this._colors.templateColor)}${uniform(<string>log[index + 1], this._colors.color)}`, log[0]);

        if (this._showMemory)
            console.log(this.addMemoryToString(log));
        else console.log(log);

        return;
    }

    public error(log: string | TemplateStringsArray, ...values: Array<string>): void {
        if (typeof log === "string") {

            log = `${Logger.date()} ${this.errorEmoji} ${uniform(log, this._colors.errorColor)}`;

            if (this._showMemory)
                console.error(this.addMemoryToString(log));
            else console.error(log);

            return;
        }

        // eslint-disable-next-line max-len
        log = <string>values.reduce((final, value, index) => `${Logger.date()} ${this.errorEmoji} ${uniform(<string>final, this._colors.errorColor)}${uniform(value, this._colors.templateErrorColor)}${uniform(<string>log[index + 1], this._colors.errorColor)}`, log[0]);

        if (this._showMemory)
            console.error(this.addMemoryToString(log));
        else console.error(log);

        return;
    }

    public resetColors(): void {
        this._colors = { ...this.defaultColors };
    }

    public set showMemory(value: boolean) {
        this._showMemory = value;
    }

    public get emojis(): Emojis {
        return { emoji: this.emoji, errorEmoji: this.errorEmoji };
    }

    public set emojis(emojis: Partial<Emojis>) {
        this.emoji = emojis.emoji ?? this.emoji;
        this.errorEmoji = emojis.errorEmoji ?? this.errorEmoji;
    }

    public set colors(colors: Partial<Colors>/* & Record<string, string>*/) {
        this._colors = { ...this._colors, ...colors };
    }

}

export const globalLogger = new Logger();