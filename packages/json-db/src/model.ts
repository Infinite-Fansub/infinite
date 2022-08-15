import { Schema } from "./schema";
import { Document } from "./document";
import { schemaData } from "./utils/symbols";
import { ExtractSchemaDefinition, SchemaDefinition, MapSchema, MethodsDefinition, FieldTypes, ObjectField } from "./typings";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";

export class Model<S extends Schema<SchemaDefinition, MethodsDefinition>> {
    readonly #schema: S;
    readonly #readable: boolean;

    public constructor(private readonly name: string, data: S, readable: boolean = false) {
        this.#schema = data;
        this.#readable = readable;
    }

    // #defineMethods() {

    // }

    public create(id?: string): Document<ExtractSchemaDefinition<S>> & MapSchema<ExtractSchemaDefinition<S>> {
        // Using `any` because of the MapSchema type
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/keyword-spacing
        return <any>new Document(this.#schema[schemaData], id ?? randomUUID());
    }

    public async get(id: string): Promise<Document<ExtractSchemaDefinition<S>> & MapSchema<ExtractSchemaDefinition<S>> | null> {
        // we need to get the file that corresponds to `this.name:id` and return a new document
        const file = await readFile(resolve(process.env.JSON_DB_PATH ?? process.cwd(), `${this.name}:${id}.json`), { encoding: "utf-8" }).catch(() => undefined);
        if (!file) return null;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/keyword-spacing
        return <any>new Document(this.#schema[schemaData], id, file);
    }

    public validateData(data: Document<ExtractSchemaDefinition<S>> | MapSchema<ExtractSchemaDefinition<S>>, _key?: string): void {
        // eslint-disable-next-line @typescript-eslint/keyword-spacing
        const schema = _key ? <Record<string, FieldTypes>>(<ObjectField>this.#schema[schemaData][_key]).data : <Record<string, FieldTypes>>this.#schema[schemaData];
        // `_id` is a field that does not exist on the schema
        const schemaKeys = Object.keys(schema);
        let dataKeys = Object.keys(data);
        const dataIdIndex = dataKeys.indexOf("_id");
        if (dataIdIndex > -1) dataKeys.splice(dataIdIndex, 1);

        new Set([...dataKeys, ...schemaKeys]).forEach((val) => {
            const dataCount = dataKeys.filter((el) => el === val).length;
            const schemaCount = schemaKeys.filter((el) => el === val).length;

            if (dataCount !== schemaCount) throw new Error();
        });

        schemaKeys.forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
            if (data[key] === undefined && schema[key].required) throw new Error(`Field: "${key}" is required but was not provided`);
            if (data[key] === undefined && !schema[key].required || data[key] === null) return;
            const value = schema[key];


            if (value.type === "array" && !Array.isArray(data[key])) throw new Error();
            else if (value.type === "tuple" && !Array.isArray(data[key])) throw new Error();
            else if (value.type === "object") {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                if ((<ObjectField>schema[key]).data) this.validateData(data[key], key);
            }
            else if (value.type === "point" && (typeof data[key] !== "object" || !data[key].longitude || !data[key].latitude)) throw new Error();
            else if (value.type === "date" && !(data[key] instanceof Date)) throw new Error();
            else if (value.type === "boolean" && typeof data[key] !== "boolean") throw new Error();
            else if (value.type === "number" && typeof data[key] !== "number") throw new Error();
            else if (value.type === "string" && typeof data[key] !== "string") throw new Error();
            else if (value.type === "text" && typeof data[key] !== "string") throw new Error();
        });
    }

    public async save(doc: Document<ExtractSchemaDefinition<S>>): Promise<void> {
        this.validateData(doc);
        // saves the document to its corresponding file, if it doesnt exist we create the file and save
        await writeFile(resolve(process.env.JSON_DB_PATH ?? process.cwd(), `${this.name}:${doc._id}.json`), doc.toString(!!this.#readable));
    }
}