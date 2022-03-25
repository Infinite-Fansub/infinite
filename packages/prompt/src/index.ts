import { createInterface } from "node:readline";
import { RequireAtLeastOne, ReadLineOptions } from "./utils";

export class Prompt {
    private _options: ReadLineOptions<boolean>;

    public constructor(options?: ReadLineOptions<boolean>) {
        this._options = options ?? {};
    }

    public async create(txt: string, options: string | RequireAtLeastOne<ReadLineOptions<boolean>, "defaultText">): Promise<string>;
    public async create(txt: string, options?: string | ReadLineOptions<boolean>): Promise<string | null>;
    public async create(txt: string, options?: string | ReadLineOptions<boolean>): Promise<string | null> {

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

    public set options(options: ReadLineOptions<boolean>) {
        this._options = options;
    }

    public set colors(options: Pick<ReadLineOptions<boolean>, "solid" | "gradient">) {
        this._options = options;
    }

    public set changeSolidColor(options: ) {
        this._options.solid = options;
    }
}

export async function readLine(txt: string, options: string | RequireAtLeastOne<ReadLineOptions<boolean>, "defaultText">): Promise<string>;
export async function readLine(txt: string, options?: string | ReadLineOptions<boolean>): Promise<string | null>;
export async function readLine(txt: string, options?: string | ReadLineOptions<boolean>): Promise<string | null> {
    return await new Prompt().create(txt, options);
}

new Prompt().colors