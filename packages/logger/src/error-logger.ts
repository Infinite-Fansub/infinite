import { sep } from "node:path";
import { Color, colorConsole } from "colours.js/dst";
import { readFileSync } from "fs";
import { platform } from "node:os";
import { ErrorLoggerOptions, MarkerOptions } from "./typings";
const { uniform } = colorConsole;

export class ErrorLogger extends Error {

    public constructor(message?: string, options?: ErrorLoggerOptions) {
        super();
        const stackArray = this.stack?.split("\n");
        let index = options?.ref ? 2 : 1;
        if (platform() === "win32")
            //@ts-expect-error IK What I'm Doing
            while (stackArray[index].includes("logger/dist") || stackArray[index].includes("logger/src") || !stackArray[index].includes(`at ${/[A-Z]/}:${sep}`)) index++;
        else
            //@ts-expect-error IK What I'm Doing
            while (stackArray[index].includes("logger/dist") || stackArray[index].includes("logger/src") || !stackArray[index].includes(`at ${sep}`)) index++;
        //@ts-expect-error IK What I'm Doing
        const error = stackArray[index].slice(stackArray[index].indexOf("at ") + 3, stackArray[index].length);
        const fullPath = error.includes("(") ? error.substring(error.indexOf("(") + 1, error.indexOf(")")) : error;
        let errorFile = fullPath.split(sep).pop() ?? "";
        let errCode = options?.errCode ? ` ${uniform(options.errCode, Color.fromHex("#767676"))}:` : ":";

        const splittedPath = fullPath.split(":");
        let filename, lineNum, col;

        if (platform() === "win32") {
            filename = `${splittedPath[0]}:${splittedPath[1]}`;
            lineNum = splittedPath[2];
            col = splittedPath[3];
        } else {
            filename = splittedPath[0];
            lineNum = splittedPath[1];
            col = splittedPath[2];
        }

        if (!filename || !lineNum || !col) throw new Error();
        let line = options?.lines?.length ? "" : ErrorLogger.getLine(filename, Number.parseInt(lineNum));
        let spaceCount = 0;
        while (line.startsWith(" ")) {
            line = line.slice(1);
            spaceCount++;
        }

        // eslint-disable-next-line max-len,max-statements-per-line
        this.stack = `\x08${ErrorLogger.colorLocation(errorFile)} - ${uniform("error", Color.RED)}${errCode} ${message ?? ""}\n${options?.lines?.length ? ErrorLogger.generateLines(options.lines) : ErrorLogger.line(errorFile)} ${line}${options?.lines?.length ? "" : `\n${(() => { let result = ""; for (let i = 0; i < Number.parseInt(col) + lineNum.length - spaceCount; i++)result += " "; return result; })()}^`}\x1B[`;
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

    private static generateLines(t: Array<{ err: string, marker: MarkerOptions }>): string {
        let lines = "";

        t.forEach(({ err, marker }) => {
            lines += `${marker.spaced ? "\n" : ""}${ErrorLogger.marker(marker.text, marker.color)}${marker.nl ? "\n" : ""}${err}\n`;
        });

        return lines;
    }

    private static getLine(filename: string, lineNum: number): string {
        let contents = readFileSync(filename).toString();
        let lines = contents.split(/\r?\n/g);
        return lines[lineNum - 1] ?? "";
    }
}