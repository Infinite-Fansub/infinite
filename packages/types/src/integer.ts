// eslint-disable-next-line @typescript-eslint/naming-convention
export type integer = number & { __int__: void };

class IntegerBuilder {
    private readonly number: number;
    public constructor(number: number) {
        this.number = number;
    }

    public parse(): integer {
        return <integer><unknown>parseInt(this.number.toString());
    }
}

export function Integer(number: number): integer {
    return new IntegerBuilder(number).parse();
}