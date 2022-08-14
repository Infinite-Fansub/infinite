import { FieldMap } from "./field-map";
import { MapSchema } from "./map-schema";
import { ParseArrayField } from "./parse-array-field";
import { ParseBasicFields } from "./parse-basic-fields";
import { ParseObjectField } from "./parse-object-field";
import { ParseTupleField } from "./parse-tuple-field";
import { ArrayField, FieldTypes, ObjectField, SchemaDefinition, TupleField } from "./schema-definition";

/**
 * @typeParam T - The tuple elements
 */
export type DeconstructTuple<T extends TupleField["elements"]> = {
    [K in keyof T]: T[K] extends ObjectField
    ? ParseObjectField<T[K]>

    : T[K] extends ArrayField
    ? ParseArrayField<T[K]>

    : T[K] extends TupleField
    ? ParseTupleField<T[K]>

    : T[K] extends FieldTypes
    ? ParseBasicFields<T[K]>

    : T[K] extends SchemaDefinition
    ? MapSchema<T[K]>

    : FieldMap[Exclude<T[K], SchemaDefinition | FieldTypes>]
};