/* eslint-disable @typescript-eslint/no-explicit-any,
@typescript-eslint/no-unsafe-assignment,
@typescript-eslint/no-unsafe-call,
@typescript-eslint/no-unsafe-member-access,
@typescript-eslint/no-unsafe-return,
@typescript-eslint/brace-style
*/

// heavily based on
// https://github.com/buglabs/node-xml2json/blob/master/lib/xml2json.js
import { Parser } from "node-expat";

export type JSONOptions<O extends boolean> = {
    object?: O,
    reversible?: boolean,
    coerce?: boolean | Record<string, (v: string) => any>,
    sanitize?: boolean,
    trim?: boolean,
    arrayNotation?: boolean | Array<string>,
    alternateTextNode?: string // change "$t"
};

export class ObjectBuilder<O extends boolean> {

    private obj: any;
    private readonly ancestors: Array<any>;
    private readonly options: Required<JSONOptions<true | false>>;
    private currentElementName?: string;
    private readonly parser: Parser;
    private forceArrays: Record<string, boolean>;

    public constructor(options: JSONOptions<O>) {
        this.parser = new Parser("UTF-8");
        this.parser.on("startElement", (name: string, attrs: Record<string, unknown>) => { this.startElement(name, attrs); });
        this.parser.on("text", (data: string) => { this.text(data); });
        this.parser.on("endElement", (name: string) => { this.endElement(name); });

        this.obj = {};
        this.ancestors = [];

        this.options = {
            object: options.object ?? false,
            reversible: options.reversible ?? false,
            coerce: options.coerce ?? false,
            sanitize: options.sanitize ?? true,
            trim: options.trim ?? true,
            arrayNotation: options.arrayNotation ?? false,
            alternateTextNode: options.alternateTextNode ?? "$t"
        };

        this.forceArrays = {};
        if (Array.isArray(options.arrayNotation)) {
            options.arrayNotation.forEach((i) => {
                this.forceArrays[i] = true;
            });
            options.arrayNotation = false;
        }
    }

    private startElement(name: string, attrs: Record<string, any>): void {
        this.currentElementName = name;
        if (this.options.coerce as boolean) {
            for (let key in attrs) {
                if (typeof attrs[key] == "string")
                    attrs[key] = this.coerce(<string>attrs[key], key);
            }
        }

        // this.obj is a plain object without this new attribute
        if (!(name in this.obj)) {
            if (this.options.arrayNotation as boolean || this.forceArrays[name]) {
                this.obj[name] = [attrs];
            } else {
                this.obj[name] = attrs;
            }
        }
        // the new attribute has been seen before many times, and is already in an array
        else if (!(this.obj[name] instanceof Array)) {
            const newArr = [this.obj[name], attrs];
            this.obj[name] = newArr;
        }
        // the new attribute has been seen before, but is only inserted directly
        else {
            this.obj[name].push(attrs);
        }

        this.ancestors.push(this.obj);

        if (this.obj[name] instanceof Array) {
            this.obj = this.obj[name][this.obj[name].length - 1];
        } else {
            this.obj = this.obj[name];
        }
    }

    private text(data: string): void {
        this.obj[this.options.alternateTextNode] = (this.obj[this.options.alternateTextNode] || "") as string + data;
    }

    private endElement(name: string): void {
        // if this node exists on the currently working object
        if (this.obj[this.options.alternateTextNode]) {
            if (this.options.trim) {
                // we know the previously run method is text, so we know this is a string
                this.obj[this.options.alternateTextNode] = this.obj[this.options.alternateTextNode].trim();
            }

            if (this.options.coerce as boolean)
                this.obj[this.options.alternateTextNode] = this.coerce(this.obj[this.options.alternateTextNode] as string, name);
        }

        if (this.currentElementName !== name) {
            delete this.obj[this.options.alternateTextNode];
        }

        // check to make sure we're ending with the same name we started with
        let ancestor = this.ancestors.pop();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!this.options.reversible && this.options.alternateTextNode in this.obj && Object.keys(this.obj).length == 1) {
            if (ancestor[name] instanceof Array) {
                ancestor[name].push(ancestor[name].pop()[this.options.alternateTextNode]);
            } else {
                ancestor[name] = this.obj[this.options.alternateTextNode];
            }
        }
        this.obj = ancestor;
    }

    private coerce(value: string, key: string): any {
        if (typeof this.options.coerce != "boolean") {
            let x = this.options.coerce[key];
            if (typeof x === "function")
                return x(value);
        }
        let num = Number.parseFloat(value);
        if (!isNaN(num)) return num;

        let lowercase = value.toLowerCase();

        if (lowercase == "true") return true;
        if (lowercase == "false") return false;

        return value;
    }

    public parse(xml: string | Buffer): O extends true ? Record<string, unknown> : string {
        if (!this.parser.parse(xml))
            throw new Error(`There are errors in your xml file: ${this.parser.getError()}`);

        const stringifiedJson = JSON.stringify(this.obj).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

        return this.options.object ? this.obj : stringifiedJson;
    }
}

export function toJson(xml: string | Buffer, options?: JSONOptions<false>): string;
export function toJson(xml: string | Buffer, options: JSONOptions<true>): Record<string, unknown>;
export function toJson(xml: string | Buffer, options?: JSONOptions<boolean>): string | Record<string, unknown> {
    return new ObjectBuilder(options ?? {}).parse(xml);
}