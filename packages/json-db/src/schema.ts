import { inspect } from "node:util";
import { Color } from "colours.js/dst";
import { SchemaDefinition, SchemaOptions, MethodsDefinition } from "./typings";
import { methods, schemaData } from "./utils/symbols";
import { ParsingError } from "./utils";
import { PrettyError } from "@infinite-fansub/logger";

export class Schema<S extends SchemaDefinition, M extends MethodsDefinition> {

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    [methods]: M;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    [schemaData]: S;

    public constructor(public data: S, methodsData?: M, public readonly options: SchemaOptions = {}) {
        this[schemaData] = this.#parse(data);
        this[methods] = methodsData ?? <M>{};
        if (!options.dataStructure) this.options.dataStructure = "JSON";

    }

    public add<SD extends SchemaDefinition>(data: SD): this {
        this[schemaData] = { ...this[schemaData], ...data };
        return this;
    }

    public methods<MD extends MethodsDefinition>(data: MD): this {
        this[methods] = { ...this[methods], ...data };
        return this;
    }

    #parse<T extends SchemaDefinition>(schema: T): T {
        Object.keys(schema).forEach((key) => {
            let value = schema[key];
            if (typeof value === "string") {
                //@ts-expect-error Anti-JS
                if (value === "object" || value === "tuple")
                    throw new PrettyError(`Type '${value}' needs to use its object definition`, {
                        errCode: "R403",
                        ref: true,
                        lines: [
                            {
                                err: inspect({ [key]: schema[key] }, { colors: true }),
                                marker: { text: "Parsing:" }
                            },
                            {
                                err: value === "object" ? ParsingError.Object(key) : ParsingError.Tuple(key),
                                marker: { text: "Possible Fix:", color: Color.fromHex("#00FF00"), nl: true }
                            },
                            {
                                err: value === "object" ? ParsingError.Info.Object : ParsingError.Info.Tuple,
                                marker: { text: "Information:", color: Color.fromHex("#009dff"), spaced: true, nl: true }
                            }
                        ]
                    });

                if (value === "array")
                    value = { type: value, elements: undefined, required: false };
                else
                    value = { type: value, default: undefined, required: false };
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (!value.type) throw new PrettyError("Type not defined");
                if (value.type !== "array" && value.type !== "object" && value.type !== "tuple") {
                    if (!value.required) value.required = false;
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                    if (!value.default) value.default = undefined;
                } else if (value.type === "array") {
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                    if (!value.elements) value.elements = undefined;
                    if (!value.required) value.required = false;
                } else if (value.type === "tuple") {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
                    if (!value.elements || !value.elements.length) throw new PrettyError("A Tuple type needs to have its elements defined");
                    if (!value.required) value.required = false;
                } else {
                    if (!value.data) value.data = undefined;
                    else value.data = this.#parse(value.data);
                }
            }
            //@ts-expect-error More Shenanigans
            schema[key] = value;
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return schema;
    }
}