import { Schema } from "./schema";
import { Document } from "./document";
import { schemaData } from "./utils/symbols";
import { ExtractSchemaDefinition, SchemaDefinition, MapSchema, MethodsDefinition, FieldTypes } from "./typings";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { validateData } from "./utils/validate-data";

export class Model<S extends Schema<SchemaDefinition, MethodsDefinition>> {
    readonly #schema: S;
    readonly #readable: boolean;

    public constructor(private readonly name: string, data: S, readable: boolean = false) {
        this.#schema = data;
        this.#readable = readable;
    }

    // TODO: #defineMethods()

    public create(id?: string): Document<ExtractSchemaDefinition<S>> & MapSchema<ExtractSchemaDefinition<S>> {
        // Using `any` because of the MapSchema type
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/keyword-spacing
        return <any>new Document(this.#schema[schemaData], id ?? randomUUID());
    }

    public async get(id: string): Promise<Document<ExtractSchemaDefinition<S>> & MapSchema<ExtractSchemaDefinition<S>> | null> {
        // we need to get the file that corresponds to `this.name:id` and return a new document
        const file = await readFile(resolve(process.env.JSON_DB_PATH ?? process.cwd(), `${this.name}-${id}.json`), { encoding: "utf-8" }).catch(() => undefined);
        if (!file) return null;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/keyword-spacing
        return <any>new Document(this.#schema[schemaData], id, file);
    }

    public async save(doc: Document<ExtractSchemaDefinition<S>>): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/keyword-spacing
        validateData(doc, <Record<string, FieldTypes>>this.#schema[schemaData]);
        // saves the document to its corresponding file, if it doesnt exist we create the file and save
        await writeFile(resolve(process.env.JSON_DB_PATH ?? process.cwd(), `${this.name}-${doc._id}.json`), doc.toString(!!this.#readable));
    }
}