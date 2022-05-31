/*eslint-disable*/
//@ts-nocheck
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SchemaData } from "src/typings/schema-data";
import { access, stat, mkdir } from "node:fs/promises";
import { constants } from "node:fs";

//* there will be caching

//* the schema defines the data shape and the model givces you functions to interact with the database

//! how does schema have user-defined methods

export class Schema {
    private readonly _schema: SchemaData;

    public constructor(schema: SchemaData) {
        this._schema = schema;
    }

}

export class Model {
    constructor(schema: Schema) { }

    // public async set() {

    // }

    public async get() {

    }

    // public async find() {

    // }

    // public async update() {

    // }

    // public async findOne() {

    // }

    // public async findOneAndUpdate() {

    // }
}

export class JSONClient {
    public readonly models: Map<string, Model> = new Map();

    public constructor(private readonly path: string) { }

    public model(name: string, schema?: Schema): Model {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.models.has(name)) return this.models.get(name)!;

        if (!schema) throw new Error("You have to pass a schema if it doesnt exist");

        const model = new Model(schema);

        this.models.set(name, model);

        return model;
    }

    public schema(data: SchemaData): Schema {
        return new Schema(data);
    }
}