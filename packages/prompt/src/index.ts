import { createInterface } from "node:readline";
import { RequireAtLeastOneType, ReadLineOptions } from "./utils";

export class Prompt {
    private _options: ReadLineOptions;

    public constructor(options?: ReadLineOptions) {
        this._options = options ?? {};
    }

    public async create(txt: string, options: string | RequireAtLeastOneType<ReadLineOptions, "defaultText">): Promise<string>;
    public async create(txt: string, options?: string | ReadLineOptions): Promise<string | null>;
    public async create(txt: string, options?: string | ReadLineOptions): Promise<string | null> {

        if (options instanceof Object) this._options = options;

        const rl = createInterface({
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

    public set options(options: ReadLineOptions) {
        this._options = options;
    }
}

export async function readLine(txt: string, options: string | RequireAtLeastOneType<ReadLineOptions, "defaultText">): Promise<string>;
export async function readLine(txt: string, options?: string | ReadLineOptions): Promise<string | null>;
export async function readLine(txt: string, options?: string | ReadLineOptions): Promise<string | null> {
    return await new Prompt().create(txt, options);
}