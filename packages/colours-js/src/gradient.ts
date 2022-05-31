/*eslint-disable @typescript-eslint/naming-convention*/
import { Color, ColorSpace } from "./color";
import * as mathExt from "./mathExt";
import { COLOR_DATA_SYMBOL, IApplicable, Samplable } from "./typings";

type InterpolationFunction = (t: number, a: number, b: number) => number;
type CyclicInterpolationFunction = (t: number, a: number, b: number, cycles?: number) => number;
type ToColFunction = (c1: number, c2: number, c3: number) => Color;
type FromColFunction = (c: Color) => [number, number, number];

/** the available interpolation methods supported by the library */
export enum Interpolation {
    linear,
    inc_quadratic,
    dec_quadratic,
    cubic
}

interface CastingFunctions {
    fromColor: FromColFunction;
    toColor: ToColFunction;
}

interface InterpolationFunctions {
    interpolationFunction: InterpolationFunction;
    cyclicInterpolationFunction: CyclicInterpolationFunction;
}

/** any form of 1 dimensional gradient */
export interface Gradient extends IApplicable {

    /** get the color at a specific point along the gradient, range [0, 1] */
    getAt: (t: number) => Color;

    /** transform this gradient into an object that can be used to fill in the background of text using c\`\` */
    get asBackground(): IApplicable;

    /** transform this gradient into an object that can be used to fill in the foreground of text using c\`\` */
    get asForeground(): IApplicable;
}

export class BezierGradient extends Object implements Gradient {

    public cycles: number;

    // sample colors in easy to interpolate form
    protected colors: Array<[number, number, number]>;

    public readonly order: number;

    private cyclicArg: number;

    protected fromColor: FromColFunction;
    protected toColor: ToColFunction;

    protected interpolationFunction: InterpolationFunction;
    protected cyclicInterpolationFunction: CyclicInterpolationFunction;

    private colorSpace: ColorSpace;
    private interpolationMethod: Interpolation;

    private _longRoute: boolean;

    public [COLOR_DATA_SYMBOL] = {
        getAt: (t: number) => this.getAt(t),
        bg: false
    };

    /** represents a gradient which follows a Bézier curve. */
    public constructor(colors: Array<Color>, space = ColorSpace.RGB, interpolation = Interpolation.linear, longRoute = false, cycles = 0) {
        super();

        this.colorSpace = space;
        this.interpolationMethod = interpolation;

        let { fromColor, toColor } = getCastingFunctions(space);
        let { interpolationFunction, cyclicInterpolationFunction } = getInterpolationFunctions(interpolation, longRoute);

        this._longRoute = longRoute;

        this.toColor = toColor;
        this.fromColor = fromColor;

        this.interpolationFunction = interpolationFunction;
        this.cyclicInterpolationFunction = cyclicInterpolationFunction;

        this.colors = [];
        this.order = -1;
        for (let color of colors) {
            this.colors.push(fromColor(color));
            this.order++;
        }

        this.cyclicArg = getCyclicArg(space);

        this.cycles = cycles;
    }

    public getAt(t: number): Color {
        let result = this.bezier(t, this.colors);
        return this.toColor(...result);
    }

    public get asBackground(): IApplicable {
        return {
            [COLOR_DATA_SYMBOL]: {
                getAt: (t: number) => this.getAt(t),
                bg: true
            }
        };
    }

    public get asForeground(): IApplicable {
        return {
            [COLOR_DATA_SYMBOL]: {
                getAt: (t: number) => this.getAt(t),
                bg: false
            }
        };
    }

    public getControl(i: number): Color {
        return this.toColor(...this.colors[i]);
    }

    public get interpolation(): Interpolation {
        return this.interpolationMethod;
    }

    public set interpolation(interpolation: Interpolation) {
        this.interpolationMethod = interpolation;
        let { interpolationFunction, cyclicInterpolationFunction } = getInterpolationFunctions(interpolation, this._longRoute);
        this.interpolationFunction = interpolationFunction;
        this.cyclicInterpolationFunction = cyclicInterpolationFunction;
    }

    public get space(): ColorSpace {
        return this.colorSpace;
    }

    public set space(space: ColorSpace) {
        this.colorSpace = space;
        let colors = this.colors.map((v) => this.toColor(...v));
        let { fromColor, toColor } = getCastingFunctions(space);
        this.fromColor = fromColor;
        this.toColor = toColor;
        this.cyclicArg = getCyclicArg(space);
        this.colors = colors.map(this.fromColor);
    }

    public get longRoute(): boolean {
        return this._longRoute;
    }

    public set longRoute(longRoute: boolean) {
        this._longRoute = longRoute;
        let { interpolationFunction, cyclicInterpolationFunction } = getInterpolationFunctions(this.interpolationMethod, longRoute);
        this.interpolationFunction = interpolationFunction;
        this.cyclicInterpolationFunction = cyclicInterpolationFunction;
    }

    private bezier(t: number, points: Array<[number, number, number]>): [number, number, number] {
        if (points.length == 1) {
            return points[0];
        }
        let a = this.bezier(t, points.slice(0, points.length - 1));
        let b = this.bezier(t, points.slice(1, points.length));

        return [
            0b100 & this.cyclicArg ?
                this.cyclicInterpolationFunction(t, a[0], b[0], this.cycles) :
                this.interpolationFunction(t, a[0], b[0]),
            0b010 & this.cyclicArg ?
                this.cyclicInterpolationFunction(t, a[1], b[1], this.cycles) :
                this.interpolationFunction(t, a[1], b[1]),
            0b001 & this.cyclicArg ?
                this.cyclicInterpolationFunction(t, a[2], b[2], this.cycles) :
                this.interpolationFunction(t, a[2], b[2])
        ];
    }

    public override toString(): string {
        return `BezierGradient(${this.colors.map((v) => this.toColor(...v)).join(", ")})`;
    }
}

export class DirectGradient extends BezierGradient {

    /** represents a smooth gradient between two colors */
    public constructor(startColor: Color, endColor: Color, space = ColorSpace.RGB, interpolation = Interpolation.linear, longRoute = false, cycles = 0) {
        super([startColor, endColor], space, interpolation, longRoute, cycles);
    }

    public get startColor(): Color {
        return this.getControl(0);
    }

    public set startColor(c: Color) {
        this.colors[0] = this.fromColor(c);
    }

    public get endColor(): Color {
        return this.getControl(1);
    }

    public set endColor(c: Color) {
        this.colors[1] = this.fromColor(c);
    }

    public override toString(): string {
        return `DirectGradient(${this.startColor}, ${this.endColor})`;
    }
}

export class JoinedGradient extends Object implements Gradient {

    private readonly colors: Array<Array<Color>>;
    private readonly colorSpaces: Array<ColorSpace>;
    private readonly interpolationMethods: Array<Interpolation>;
    private lengths: Array<number>;
    private readonly longRoutes: Array<boolean>;
    private readonly cycles: Array<number>;
    private factor: number;

    public [COLOR_DATA_SYMBOL] = {
        getAt: (t: number) => this.getAt(t),
        bg: false
    };

    /** represents a gradient between many colors, travelling an abstract route through color space. */
    public constructor(startColor: Color, ...segments: Array<Partial<GradientSegment>>) {
        super();

        this.colors = [[startColor]];
        this.colorSpaces = [];
        this.interpolationMethods = [];
        this.longRoutes = [];
        this.cycles = [];
        let lengths = [];

        for (const segment of segments) {
            if (segment.colors) this.colors.push(segment.colors);
            else throw new Error("A color must be specified in all segments.");
            this.colorSpaces.push(segment.space ?? ColorSpace.RGB);
            this.interpolationMethods.push(segment.interpolation ?? Interpolation.linear);
            this.longRoutes.push(segment.longRoute ?? false);
            this.cycles.push(segment.cycles ?? 0);
            lengths.push(segment.length ?? 1);
        }

        this.factor = mathExt.sum(...lengths);

        this.lengths = mathExt.normalize_1D(lengths);
    }

    public getAt(t: number): Color {
        let lt = t;
        let i = 0;
        for (; lt > this.lengths[i]; i++) lt -= this.lengths[i];
        lt /= this.lengths[i];
        let g = new BezierGradient(
            [this.colors[i][this.colors[i].length - 1], ...this.colors[i + 1]] as Array<Color>,
            this.colorSpaces[i],
            this.interpolationMethods[i],
            this.longRoutes[i],
            this.cycles[i]
        );
        return g.getAt(lt);
    }

    public get asBackground(): IApplicable {
        return {
            [COLOR_DATA_SYMBOL]: {
                getAt: (t: number) => this.getAt(t),
                bg: true
            },
            toString: () => this.getAt(0).asBackground
        };
    }

    public get asForeground(): IApplicable {
        return {
            [COLOR_DATA_SYMBOL]: {
                getAt: (t: number) => this.getAt(t),
                bg: false
            },
            toString: () => this.getAt(0).asForeground
        };
    }

    /** get the contained gradient at index i */
    public getGradient(i: number): BezierGradient {
        return new BezierGradient(
            [this.colors[i][this.colors[i].length - 1], ...this.colors[i + 1]] as Array<Color>,
            this.colorSpaces[i],
            this.interpolationMethods[i],
            this.longRoutes[i],
            this.cycles[i]
        );
    }

    /** set the contained gradient at index i */
    public setGradient(i: number, gradient: BezierGradient): void {
        this.colors[i][this.colors[i].length - 1] = gradient.getControl(0);
        this.colors[i + 1] = [];
        for (let j = 1; j <= gradient.order; j++) this.colors[i + 1].push(gradient.getControl(j));
        this.colorSpaces[i] = gradient.space;
        this.interpolationMethods[i] = gradient.interpolation;
        this.longRoutes[i] = gradient.longRoute;
        this.cycles[i] = gradient.cycles;
    }

    /** get the length of the contained gradient at index i */
    public getGradientLength(i: number): number {
        return this.lengths[i] * this.factor;
    }

    /** set the length of the contained gradient at index i */
    public setGradientLength(i: number, length: number): void {
        let originalLengths = this.lengths;
        originalLengths.forEach((v, j) => originalLengths[j] = v * this.factor);
        originalLengths[i] = length;
        this.factor = mathExt.sum(...originalLengths);
        this.lengths = mathExt.normalize_1D(originalLengths);
    }

    public override toString(): string {
        return `JoinedGradient(${this.colors[0]}${this.colors[this.colors.length - 1]})`;
    }
}

/** used for segmented gradients */
export interface GradientSegment {
    colors: Array<Color>;
    length: number;
    space: ColorSpace;
    interpolation: Interpolation;
    longRoute: boolean;
    cycles: number;
}

export class GradientPoint implements IApplicable {

    private colors: Array<Color>;
    private _background: boolean;

    public space: ColorSpace;
    public interpolation: Interpolation;
    public longRoute: boolean;
    public cycles: number;

    public [COLOR_DATA_SYMBOL]: { getAt: Samplable, bg?: boolean };

    /** A class used for applying joined gradients to console messages by representing a particular sample color tied to the following character. */
    public constructor(color: Color, background = false, controlColors: Array<Color> = [], space = ColorSpace.RGB, interpolation = Interpolation.linear, longRoute = false, cycles = 0) {
        this.colors = [...controlColors, color];
        this._background = background;
        this.space = space;
        this.interpolation = interpolation;
        this.longRoute = longRoute;
        this.cycles = cycles;
        this[COLOR_DATA_SYMBOL] = { getAt: color, bg: background };
    }

    public get background(): boolean {
        return this._background;
    }

    public set background(b: boolean) {
        this._background = b;
        this[COLOR_DATA_SYMBOL].bg = b;
    }

    public get color(): Color {
        return this.colors[this.colors.length - 1];
    }

    public set color(c: Color) {
        this.colors[this.colors.length - 1] = c;
        this[COLOR_DATA_SYMBOL].getAt = c;
    }

    public get sampleColors(): Array<Color> {
        return this.colors.slice(0, this.colors.length - 1);
    }

    public set sampleColors(cs: Array<Color>) {
        this.colors = [...cs, this[COLOR_DATA_SYMBOL].getAt as Color];
    }

    public asSegment(length: number): GradientSegment {
        return {
            ...this,
            colors: this.colors,
            length: length
        };
    }
}

/** collects the appropriate casting functions for a given color space */
function getCastingFunctions(space: ColorSpace): CastingFunctions {

    let fromColor: FromColFunction;
    let toColor: ToColFunction;

    switch (space) {
        case ColorSpace.RGB:
            fromColor = (c) => c.toRGB();
            toColor = (r, g, b) => new Color(r, g, b);
            break;
        case ColorSpace.HSV:
            fromColor = (c) => c.toHSV();
            toColor = (h, s, v) => Color.fromHSV(h, s, v);
            break;
        case ColorSpace.HSL:
            fromColor = (c) => c.toHSL();
            toColor = (h, s, l) => Color.fromHSL(h, s, l);
            break;
        case ColorSpace.HSI:
            fromColor = (c) => c.toHSI();
            toColor = (h, s, i) => Color.fromHSI(h, s, i);
            break;
        default:
            throw new Error("That color space is not yet supported within in this function.");
    }

    return { toColor, fromColor };
}

/** collects the appropriate interpolation functions for a given interpolation method */
function getInterpolationFunctions(interpolation: Interpolation, longRoute = false): InterpolationFunctions {

    let interpolationFtn: InterpolationFunction;
    let cyclicInterpolationFtn: CyclicInterpolationFunction;

    switch (interpolation) {
        case Interpolation.linear:
            interpolationFtn = mathExt.lerp;
            cyclicInterpolationFtn = longRoute ? mathExt.longCyclicLerp : mathExt.shortCyclicLerp;
            break;
        case Interpolation.inc_quadratic:
            interpolationFtn = mathExt.qerp_0;
            cyclicInterpolationFtn = longRoute ? mathExt.longCyclicQerp_0 : mathExt.shortCyclicQerp_0;
            break;
        case Interpolation.dec_quadratic:
            interpolationFtn = mathExt.qerp_1;
            cyclicInterpolationFtn = longRoute ? mathExt.longCyclicQerp_1 : mathExt.shortCyclicQerp_1;
            break;
        case Interpolation.cubic:
            interpolationFtn = mathExt.cerp_d;
            cyclicInterpolationFtn = longRoute ? (t, a, b, cycles) => mathExt.longCyclicCerp_d(t, a, b, 0, 0, cycles) : (t, a, b, cycles) => mathExt.shortCyclicCerp_d(t, a, b, 0, 0, cycles);
            break;
        default:
            throw new Error("That interpolation method is not yet supported within this function");
    }

    return { interpolationFunction: interpolationFtn, cyclicInterpolationFunction: cyclicInterpolationFtn };
}

/** returns a number which indicates which components of a given color system are cyclical */
function getCyclicArg(space: ColorSpace): number {
    return space == ColorSpace.RGB ? 0 : 0b100;
}