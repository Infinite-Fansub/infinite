/* eslint-disable */
import {WriteStream} from "node:tty";
import {sep} from "node:path";
import {Color, colorConsole} from "colours.js/dst";
const {uniform} = colorConsole;

export class ErrorLogger extends Error {
    private out: WriteStream;
    private errorLocation: string;
    private errCode: string;

    public constructor(message?: string, options?: {errCode?: string, out?: WriteStream}) {
        super()
        this.out = options?.out ?? process.stdout;
        const stackArray = this.stack!.split("\n");
        //@ts-expect-error IK What I'm Doing
        const error = stackArray[1].slice(stackArray[1]!.indexOf("at ") + 3, stackArray[1]!.length).replace(")", '');
        this.errorLocation = error.split(sep).pop()!;
        this.errCode = options?.errCode ? options.errCode + ":" : ":";

        let [filename, line, col] = this.errorLocation.split(":");

        this.out.write(`${this.colorLocation()} - ${uniform("error", Color.RED)}${this.errCode} ${message ?? ""}\n${this.line()} \n`)
    }

    private colorLocation(): string {
        let parts: string | Array<string> = this.errorLocation.split(":");
        return parts = `${uniform(parts[0]!, Color.BLUE)}:${uniform(parts[1]!, Color.YELLOW)}:${uniform(parts[2]!, Color.YELLOW)}`
    }

    private line(): string {
        return uniform(uniform(this.errorLocation.split(":")[1]!, Color.BLACK), Color.WHITESMOKE, true)
    }
}

function g() {
    f();
}
function f() {
    d();
}

function d() {
    new ErrorLogger("ERR")
}

g();