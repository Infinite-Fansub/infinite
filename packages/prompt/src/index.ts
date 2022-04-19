import { Color } from "colours.js/dst";
import { createInterface, ReadLineOptions } from "node:readline";
import { RequireAtLeastOne, PromptOptions, PromptGradient } from "./typings";

export class Prompt {
    private _options: PromptOptions<boolean>;
    private prevOptions: PromptOptions<boolean> = {};

    public constructor(options?: PromptOptions<boolean>) {
        this._options = options ?? {};
    }

    public async create(txt: string, options: string | RequireAtLeastOne<PromptOptions<boolean>, "defaultText">): Promise<string>;
    public async create(txt: string, options?: string | PromptOptions<boolean>): Promise<string | null>;
    public async create(txt: string, options?: string | PromptOptions<boolean>): Promise<string | null> {

        if (options instanceof Object) {
            this.prevOptions = this._options;
            this._options = options;
        } else if (typeof options === "string") {
            this.prevOptions.defaultText = options;
            this._options.defaultText = options;
        }

        const rl = createInterface(this._options.interface ?? {
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question(`${txt}\n${typeof options === "string" ? ">" : this._options.prompt ?? ">"} `, (answer) => {
                resolve(answer.length ? answer : typeof options === "string" ? options : this._options.defaultText ?? null);
                rl.close();
            });
        });
    }

    public get options(): PromptOptions<boolean> {
        return this._options;
    }

    public set options(options: PromptOptions<boolean>) {
        this.prevOptions = this._options;
        this._options = options;
    }

    public get prompt(): string {
        return this._options.prompt ?? "undefined";
    }

    public set prompt(p: string) {
        this.prevOptions.prompt = this._options.prompt;
        this._options.prompt = p;
    }

    public get defaultText(): string {
        return this.options.defaultText ?? "undefined";
    }

    public set defaultText(txt: string) {
        this.prevOptions.defaultText = this._options.defaultText;
        this._options.defaultText = txt;
    }

    public get colors(): Pick<PromptOptions<boolean>, "solid" | "gradient"> {
        return { solid: this._options.solid, gradient: this._options.gradient };
    }

    public set colors(options: Pick<PromptOptions<boolean>, "solid" | "gradient">) {
        this.prevOptions = this._options;
        this._options = options;
    }

    public get solidColor(): string | Color {
        return this._options.solid?.color ?? "undefined";
    }

    public set solidColor(color: string | Color) {
        this.prevOptions.solid = this._options.solid;
        this._options.solid = { color };
    }

    public get gradientColors(): PromptGradient {
        return this._options.gradient ?? { primaryColor: "undefined", secondaryColor: "undefined" };
    }

    public set gradientColors(colors: PromptGradient) {
        this.prevOptions.gradient = this._options.gradient;
        this._options.gradient = colors;
    }

    public get interfaceOptions(): ReadLineOptions {
        return this._options.interface ?? { input: process.stdin, output: process.stdout };
    }

    public set interfaceOptions(options: ReadLineOptions) {
        this.prevOptions.interface = this._options.interface ?? { input: process.stdin, output: process.stdout };
        this._options.interface = options;
    }

    public get previousOptions(): PromptOptions<boolean> {
        return this.prevOptions;
    }
}

export async function readLine(txt: string, options: string | RequireAtLeastOne<PromptOptions<boolean>, "defaultText">): Promise<string>;
export async function readLine(txt: string, options?: string | PromptOptions<boolean>): Promise<string | null>;
export async function readLine(txt: string, options?: string | PromptOptions<boolean>): Promise<string | null> {
    return await new Prompt().create(txt, options);
}