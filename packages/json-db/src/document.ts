import { SchemaDefinition } from "./typings";

export class Document<S extends SchemaDefinition> {
    readonly #schema: S;
    public constructor(schema: S, public id?: string, file?: string) {

        this.#schema = schema;

        if (file) {
            const parsed = <S>JSON.parse(file);
            Object.keys(parsed).forEach((key) => {
                //@ts-expect-error IDK
                this[key] = parsed[key];
            });
        }

        Object.keys(schema).forEach((key) => {
            //@ts-expect-error IDK
            if (this[key]) return;
            //@ts-expect-error IDK
            this[key] = undefined;
        });
    }

    public toString(): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: Record<string, any> = {};

        Object.keys(this.#schema).forEach((key) => {
            //@ts-expect-error IDK
            obj[key] = this[key];
        });

        return JSON.stringify(obj);
    }
}