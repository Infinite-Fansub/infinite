/* eslint-disable */
import { resolve } from "path";
import { Model } from "./model";
import { Schema } from "./schema";
import { ExtractSchemaMethods, MethodsDefinition, SchemaDefinition, SchemaOptions, Module, WithModules, ExctractName } from "./typings";

export class Client {
    #models: Map<string, Model<any>> = new Map();

    public setup(path: string): this {
        process.env.JSON_DB_PATH = resolve(path);

        return this;
    }

    public schema<T extends SchemaDefinition, M extends MethodsDefinition>(schemaData: T, methods?: M, options?: SchemaOptions): Schema<T, M> {
        return new Schema<T, M>(schemaData, methods, options);
    }

    public withModules<T extends Array<Module>>(modules: ExctractName<T>): this & WithModules<T> {
        modules.forEach((module) => {
            //@ts-expect-error shenanigans
            this[module.name] = new module.ctor();
        });

        return <any>this;
    }

    public model<T extends Schema<SchemaDefinition, MethodsDefinition>>(name: string, schema?: T, readable?: boolean): Model<T> & ExtractSchemaMethods<T> {
        if (this.#models.has(name)) return <any>this.#models.get(name)!;

        if (!schema) throw new Error("You have to pass a schema if it doesnt exist");

        const model = new Model(name, schema, readable);
        this.#models.set(name, model);
        return <any>model;
    }
}