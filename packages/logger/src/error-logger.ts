import { sep } from "node:path";
import { Color, colorConsole } from "colours.js/dst";
import { readFileSync } from "fs";
const { uniform } = colorConsole;

export class ErrorLogger extends Error {

    public constructor(message?: string, options?: { errCode?: string, ref?: boolean, lineErr?: { err: string, marker: string }, add?: string }) {
        super();
        const stackArray = this.stack?.split("\n");
        let index = options?.ref ? 2 : 1;
        //@ts-expect-error IK What I'm Doing
        while (stackArray[index].includes("logger/dist") || stackArray[index].includes("logger/src") || !stackArray[index].includes(`at ${sep}`)) index++;
        //@ts-expect-error IK What I'm Doing
        const error = stackArray[index].slice(stackArray[index].indexOf("at ") + 3, stackArray[index].length);
        const fullPath = error.includes("(") ? error.substring(error.indexOf("(") + 1, error.indexOf(")")) : error;
        let errorFile = fullPath.split(sep).pop() ?? "";
        let errCode = options?.errCode ? ` ${uniform(options.errCode, Color.fromHex("#767676"))}:` : ":";

        const [filename, lineNum, col] = fullPath.split(":");
        if (!filename || !lineNum || !col) throw new Error();
        let line = options?.lineErr?.err ?? ErrorLogger.getLine(filename, Number.parseInt(lineNum));
        let spaceCount = 0;
        while (line.startsWith(" ")) {
            line = line.slice(1);
            spaceCount++;
        }

        // eslint-disable-next-line max-len,max-statements-per-line
        this.stack = `\x08${ErrorLogger.colorLocation(errorFile)} - ${uniform("error", Color.RED)}${errCode} ${message ?? ""}\n${options?.lineErr?.err ? ErrorLogger.unknownLine(options.lineErr.marker) : ErrorLogger.line(errorFile)} ${line}${options?.lineErr?.err ? "" : `\n${(() => { let result = ""; for (let i = 0; i < Number.parseInt(col) + lineNum.length - spaceCount; i++)result += " "; return result; })()}^`}${options?.add ? `\n${options.add}` : ""}\x1B[`;
    }

    private static colorLocation(file: string): string {
        const [filename, lineNum, colNum] = file.split(":");
        return `${uniform(filename, Color.fromHex("#00B9FF"))}:${uniform(lineNum, Color.fromHex("#FFE000"))}:${uniform(colNum, Color.fromHex("#FFE000"))}`;
    }

    private static line(errorLocation: string): string {
        return uniform(uniform(errorLocation.split(":")[1] ?? "", Color.BLACK), Color.WHITESMOKE, true);
    }

    private static unknownLine(marker?: string): string {
        return uniform(uniform(marker ?? "??", Color.BLACK), Color.WHITESMOKE, true);
    }

    private static getLine(filename: string, lineNum: number): string {
        let contents = readFileSync(filename).toString();
        let lines = contents.split(/\r?\n/g);
        return lines[lineNum - 1] ?? "";
    }
}