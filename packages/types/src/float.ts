// eslint-disable-next-line @typescript-eslint/naming-convention
export type float = number & { __float__: void };

class FloatBuilder {
    private readonly number: number;
    public constructor(number: number) {
        this.number = number;
    }

    public parse(): float {
        return <float><unknown>parseFloat(this.number.toString());
    }
}

export function Float(number: number): float {
    return new FloatBuilder(number).parse();
}