import { FieldTypes, ParsedSchemaDefinition, SchemaDefinition } from "./typings";

export class Document<S extends SchemaDefinition> {
    readonly #schema: S;

    /*
    * Using any so everything works as intended
    * I couldn't find any other way to do this or implement the MapSchema type directly in th class
    */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    public constructor(schema: S, public _id: string, file?: string) {

        this.#schema = schema;

        if (file) {
            const parsed = <S>JSON.parse(file);
            Object.keys(parsed).forEach((key) => {
                this[key] = parsed[key];
            });
        }

        Object.keys(schema).forEach((key) => {
            if (this[key]) return;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            this[key] = (<ParsedSchemaDefinition><unknown>schema[key]).default;
        });
    }

    public toString(pretty?: boolean): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: Record<string, FieldTypes> = {};

        Object.keys(this.#schema).forEach((key) => {
            obj[key] = this[key];
        });

        return JSON.stringify(obj, null, pretty ? 4 : undefined);
    }
}