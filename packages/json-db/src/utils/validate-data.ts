import { FieldMap, SchemaDefinition, TupleField } from "../typings";
import { Document } from "../document";

/* eslint-disable */ //@ts-ignore
export function validateData(data: Document<SchemaDefinition>, schema: Exclude<SchemaDefinition, FieldMap> | TupleField["elements"]) {
    // Check if all the data provided corresponds to the type defined in the schema
    const schemaKeySet = new Set(Object.keys(schema));
    const dataKeySet = new Set(Object.keys(data));

    dataKeySet.delete('_id');
    if (schemaKeySet.size !== dataKeySet.size) throw new Error();
    schemaKeySet.forEach(value => {
        if (!dataKeySet.has(value))
            throw new Error();
    });
    // Check if the data has all the required fields of the schema

    // If its a tuple check for the order and same thing mentioned above
    // If its an array check if all the elements inside match the type defined on the schema
}