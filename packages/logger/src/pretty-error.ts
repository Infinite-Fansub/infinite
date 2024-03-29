/* eslint-disable max-len */
import { Color, colorConsole } from "colours.js/dst";
import { platform } from "node:os";
import { readFileSync } from "fs";
import { sep } from "node:path";

import { PrettyErrorOptions } from "./typings";

const { uniform } = colorConsole;

export class PrettyError extends Error {

    public constructor(err: string | Error, options?: PrettyErrorOptions) {
        super();
        const message = err instanceof Error ? err.message : err;
        this.message = message;

        const stackArray = err instanceof Error ? err.stack?.split("\n") : this.stack?.split("\n");
        if (typeof stackArray === "undefined") return;
        let index = 1;

        while (stackArray[index].includes("logger/dist")
            || stackArray[index].includes("logger/src")
            || stackArray[index].includes(`at ${platform() === "win32" ? `${/[A-Z]/}:${sep}` : sep}`)
            || stackArray[index].includes("(<anonymous>)")
            || (typeof options?.reference === "string" ? stackArray[index].includes(options.reference) : false)
        ) {
            index++;
        }

        const error = stackArray[index].slice(stackArray[index].indexOf("at ") + 3, stackArray[index].length);
        const fullPath = error.includes("(") ? error.substring(error.indexOf("(") + 1, error.indexOf(")")) : error;

        let errorFile = fullPath.split(sep).pop() ?? "";
        let errCode = options?.code ? ` ${uniform(options.code, Color.fromHex("#767676"))}:` : ":";

        const splittedPath = fullPath.split(":");
        let filename, lineNum, col;

        if (platform() === "win32") {
            filename = `${splittedPath[0]}:${splittedPath[1]}`;
            lineNum = splittedPath[2];
            col = splittedPath[3];
        } else {
            [filename, lineNum, col] = splittedPath;
        }

        if (!filename || !lineNum || !col) throw new Error(`FileName: ${filename}, LineNum: ${lineNum}, Col: ${col}`);
        let line = options?.lines?.length ? "" : PrettyError.getLine(filename, Number.parseInt(lineNum));
        let spaceCount = 0;
        while (line.startsWith(" ")) {
            line = line.slice(1);
            spaceCount++;
        }

        // eslint-disable-next-line max-statements-per-line
        this.stack = `\x08${PrettyError.colorLocation(errorFile)} - ${uniform(options?.type ?? "error", Color.RED)}${errCode} ${message}\n${options?.lines?.length ? PrettyError.generateLines(options.lines) : PrettyError.line(errorFile)} ${line}${options?.lines?.length ? "" : `\n${(() => { let result = ""; for (let i = 0; i < Number.parseInt(col) + lineNum.length - spaceCount; i++)result += " "; return result; })()}^`}\x1B[`;
    }

    private static colorLocation(file: string): string {
        const [filename, lineNum, colNum] = file.split(":");
        return `${uniform(filename, Color.fromHex("#00B9FF"))}:${uniform(lineNum, Color.fromHex("#FFE000"))}:${uniform(colNum, Color.fromHex("#FFE000"))}`;
    }

    private static line(errorLocation: string): string {
        return uniform(uniform(errorLocation.split(":")[1] ?? "", Color.BLACK), Color.WHITESMOKE, true);
    }

    private static marker(marker?: string, color?: Color): string {
        return uniform(uniform(marker ?? "??", Color.BLACK), color ?? Color.WHITESMOKE, true);
    }

    private static generateLines(lines: Required<PrettyErrorOptions>["lines"]): string {
        let string = "";

        lines.forEach(({ error, marker }) => {
            string += `${marker.spacedBefore ? "\n" : ""}${PrettyError.marker(marker.text, marker.color)}${marker.newLine ? "\n" : ""}${error}\n`;
        });

        return string;
    }

    private static getLine(filename: string, lineNum: number): string {
        let contents = readFileSync(filename).toString();
        let lines = contents.split(/\r?\n/g);
        return lines[lineNum - 1] ?? "";
    }
}