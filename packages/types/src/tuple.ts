type TypesOfTuples = Minimal | Complex;
type Minimal = string | number | boolean | Date;
type Complex = Array<string | number | boolean | Date | Array<unknown>>;

export type Tuple<T extends TypesOfTuples, K extends Minimal | undefined = undefined> = T extends Minimal
    ? [T, K]
    : T extends Complex
    ? K extends undefined
    ? T
    : [T, K]
    : null;