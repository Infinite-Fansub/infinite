import { createInterface } from "node:readline";
import { RequireAtLeastOneType } from "./utils";

export type readLineOptions = {
    defaultText?: string,
    prompt?: string
};

export async function readLine(txt: string, options: string): Promise<string>;
// eslint-disable-next-line @typescript-eslint/unified-signatures
export async function readLine(txt: string, options: RequireAtLeastOneType<readLineOptions, "defaultText">): Promise<string>;
export async function readLine(txt: string, options?: readLineOptions): Promise<string | null>;
export async function readLine(txt: string, options?: string | readLineOptions): Promise<string | null> {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(`${txt}\n${options instanceof Object ? options.prompt ?? ">" : ">"} `, (answer) => {
            resolve(answer.length ? answer : options instanceof Object ? options.defaultText ?? null : options ?? null);
            rl.close();
        });
    });
}