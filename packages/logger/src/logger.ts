import { Color, colorConsole } from "colours.js";
import { Colors, Emojis, LoggerOptions } from "./typings";
import { InfiniteGradient, getCurrentMemoryHeap } from "./utils";
const { uniform, gradient } = colorConsole;

export class Logger {
    #emoji: string;
    #errorEmoji: string;
    #showMemory: boolean;
    #showDay: boolean;
    #colors: Colors;
    #defaultColors: Colors = {
        color: Color.fromHex("#FF00EF"), //Color.fromHex("#fc036b"),
        templateColor: Color.fromHex("#00DDFF"),
        errorColor: Color.RED,
        templateErrorColor: Color.fromHex("#8C00FF"),
        gradientPrimary: Color.fromHex("#0048ff"),
        gradientSecondary: Color.fromHex("#c603fc")
    };

    public constructor(options?: LoggerOptions) {
        this.#colors = { ...this.#defaultColors, ...options?.colors };
        this.#emoji = options?.emojis?.emoji ?? "💫";
        this.#errorEmoji = options?.emojis?.errorEmoji ?? "❌";
        this.#showMemory = options?.showMemory ?? true;
        this.#showDay = options?.showDay ?? false;
    }

    private addMemoryToString(log: string): string {
        return `${uniform(getCurrentMemoryHeap(), this.#colors.errorColor)} ${log}`;
    }

    private date(): string {
        return uniform(uniform(`[${new Date()[this.#showDay ? "toLocaleString" : "toLocaleTimeString"]()}]`, Color.WHITE, true), Color.BLACK);
    }

    public infinitePrint(log: string | TemplateStringsArray /*, ...values: Array<string>*/): void {
        if (typeof log === "string") {

            if (this.#showMemory)
                console.log(this.addMemoryToString(`${this.date()} ${this.#emoji} ${gradient(log, InfiniteGradient(true))}`));
            else console.log(`${this.date()} ${this.#emoji} ${gradient(log, InfiniteGradient())}`);

            return;
        }

        throw new Error("Template Literall call not implemented yet");
    }

    public defaultPrint(log: string | TemplateStringsArray, ...values: Array<string>): void {
        if (typeof log === "string") {

            log = `${this.date()} ${this.#emoji} ${uniform(log, this.#colors.color)}`;

            if (this.#showMemory)
                console.log(this.addMemoryToString(log));
            else console.log(log);

            return;
        }

        // eslint-disable-next-line max-len
        log = values.reduce((final, value, index) => `${this.date()} ${this.#emoji} ${uniform(final, this.#colors.color)}${uniform(value, this.#colors.templateColor)}${uniform(log[index + 1], this.#colors.color)}`, log[0]);

        if (this.#showMemory)
            console.log(this.addMemoryToString(log));
        else console.log(log);

        return;
    }

    public error(log: string | TemplateStringsArray, ...values: Array<string>): void {
        if (typeof log === "string") {

            log = `${this.date()} ${this.#errorEmoji} ${uniform(log, this.#colors.errorColor)}`;

            if (this.#showMemory)
                console.error(this.addMemoryToString(log));
            else console.error(log);

            return;
        }

        // eslint-disable-next-line max-len
        log = values.reduce((final, value, index) => `${this.date()} ${this.#errorEmoji} ${uniform(final, this.#colors.errorColor)}${uniform(value, this.#colors.templateErrorColor)}${uniform(log[index + 1], this.#colors.errorColor)}`, log[0]);

        if (this.#showMemory)
            console.error(this.addMemoryToString(log));
        else console.error(log);

        return;
    }

    public print(log: string, customColor: Color | Colour | DirectGradient | JoinedGradient): void {
        log = `${this.date()} ${this.#emoji} ${customColor instanceof Color || customColor instanceof Colour ? uniform(log, customColor) : gradient(log, customColor)}`;

        if (this.#showMemory)
            console.error(this.addMemoryToString(log));
        else console.error(log);
    }

    public resetColors(): void {
        this.#colors = { ...this.#defaultColors };
    }

    public get showDay(): boolean {
        return this.#showDay;
    }

    public set showDay(value: boolean) {
        this.#showDay = value;
    }

    public get showMemory(): boolean {
        return this.#showMemory;
    }

    public set showMemory(value: boolean) {
        this.#showMemory = value;
    }

    public get emojis(): Emojis {
        return { emoji: this.#emoji, errorEmoji: this.#errorEmoji };
    }

    public set emojis(emojis: Partial<Emojis>) {
        this.#emoji = emojis.emoji ?? this.#emoji;
        this.#errorEmoji = emojis.errorEmoji ?? this.#errorEmoji;
    }

    public get colors(): Colors {
        return this.#colors;
    }

    public set colors(colors: Partial<Colors>/* & Record<string, string>*/) {
        this.#colors = { ...this.#colors, ...colors };
    }

}

export const globalLogger = new Logger();