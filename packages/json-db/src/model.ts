import { Schema } from "./schema";
import { Document } from "./document";
import { schemaData } from "./utils/symbols";
import { ExtractSchemaDefinition, SchemaDefinition, MapSchema, MethodsDefinition } from "./typings";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { validateData } from "./utils/validate-data";

export class Model<S extends Schema<SchemaDefinition, MethodsDefinition>> {
    readonly #schema: ExtractSchemaDefinition<S>;
    readonly #readable: boolean;
    readonly #path: string;

    public constructor(name: string, data: S, readable: boolean = false) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.#schema = <any>data[schemaData];
        this.#readable = readable;
        this.#path = resolve(process.env.JSON_DB_PATH ?? process.cwd(), name);
    }

    // TODO: #defineMethods()

    public create(id?: string): Document<ExtractSchemaDefinition<S>> & MapSchema<ExtractSchemaDefinition<S>> {
        // Using `any` because of the MapSchema type
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/keyword-spacing
        return <any>new Document(this.#schema, id ?? randomUUID());
    }

    public async get(id: string): Promise<Document<ExtractSchemaDefinition<S>> & MapSchema<ExtractSchemaDefinition<S>> | null> {
        // we need to get the file that corresponds to `this.name:id` and return a new document
        const file = await readFile(`${this.#path}/${id}.json`, { encoding: "utf-8" }).catch(() => undefined);
        if (!file) return null;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/keyword-spacing
        return <any>new Document(this.#schema, id, file);
    }

    public async save(doc: Document<ExtractSchemaDefinition<S>>): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/keyword-spacing, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        validateData(doc, <any>this.#schema);
        // saves the document to its corresponding file, if it doesnt exist we create the file and save
        await writeFile(`${this.#path}/${doc._id}.json`, doc.toString(!!this.#readable));
    }
}