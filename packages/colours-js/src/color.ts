/*eslint-disable @typescript-eslint/naming-convention*/
import { avg, mid } from "./mathExt";
import { BACKGROUND_RGB, FOREGROUND_RGB, TERMINATOR } from "./ansi";
import { COLOR_DATA_SYMBOL, IApplicable, Samplable } from "./typings";

export class Color extends Object implements IApplicable {

    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    // Fuck this tsconfig
    public [COLOR_DATA_SYMBOL]: { getAt: Samplable, bg?: boolean } = {
        getAt: this,
        bg: false
    };

    /** class representing a digital presentable color */
    public constructor(r: number | bigint, g: number | bigint, b: number | bigint, a: number | bigint = 1) {
        super();
        this._r = typeof r == "number" ? Math.min(Math.max(r, 0), 1) : Number(r) / 0xFF;
        this._g = typeof g == "number" ? Math.min(Math.max(g, 0), 1) : Number(g) / 0xFF;
        this._b = typeof b == "number" ? Math.min(Math.max(b, 0), 1) : Number(b) / 0xFF;
        this._a = typeof a == "number" ? Math.min(Math.max(a, 0), 1) : Number(a) / 0xFF;
    }

    /** export this color into RGB format */
    public toRGB(): [number, number, number] {
        return [this._r, this._g, this._b];
    }

    /** export this color into RGBA format */
    public toRGBA(): [number, number, number, number] {
        return [this._r, this._g, this._b, this._a];
    }

    /** export this color into 24-bit RGB */
    public to24BitRGB(): [number, number, number] {
        return [this.r_8b, this.g_8b, this.b_8b];
    }

    /** export this color into 32-bit RGBA */
    public to32BitRGBA(): [number, number, number, number] {
        return [this.r_8b, this.g_8b, this.b_8b, this.a_8b];
    }

    /** export this color into HSV format */
    public toHSV(): [number, number, number] {
        return [this.hue, this.saturation_V, this.value];
    }

    /** export this color into HSL format */
    public toHSL(): [number, number, number] {
        return [this.hue, this.saturation_L, this.lightness];
    }

    /** export this color into HSI format */
    public toHSI(): [number, number, number] {
        return [this.hue, this.saturation_I, this.intensity];
    }

    /** transform this color into its closest background filling ANSI escape sequence */
    public get asBackground(): string {
        return BACKGROUND_RGB + this.to24BitRGB().join(";") + TERMINATOR;
    }

    /** transform this color into its closest foreground filling ANSI escape sequence */
    public get asForeground(): string {
        return FOREGROUND_RGB + this.to24BitRGB().join(";") + TERMINATOR;
    }

    public override toString(): string {
        return `Color(r: ${this.red}, g: ${this.green}, b: ${this.blue})`;
    }

    /** the red component of this color in RGB format */
    public get red(): number {
        return this._r;
    }

    public set red(r: number) {
        this._r = Math.min(Math.max(r, 0), 1);
    }

    /** the green component of this color in RGB format */
    public get green(): number {
        return this._g;
    }

    public set green(g: number) {
        this._g = Math.min(Math.max(g, 0), 1);
    }

    /** the blue component of this color in RGB format */
    public get blue(): number {
        return this._b;
    }

    public set blue(b: number) {
        this._b = Math.min(Math.max(b, 0), 1);
    }

    /** the alpha channel of this color */
    public get alpha(): number {
        return this._a;
    }

    public set alpha(a: number) {
        this._a = Math.min(Math.max(a, 0), 1);
    }

    public get r_8b(): number { return Math.round(this._r * 0xFF); }
    public get g_8b(): number { return Math.round(this._g * 0xFF); }
    public get b_8b(): number { return Math.round(this._b * 0xFF); }
    public get a_8b(): number { return Math.round(this._a * 0xFF); }

    /** the chroma of this color */
    public get chroma(): number {
        return Math.max(this._r, this._g, this._b) - Math.min(this._r, this._g, this._b);
    }

    public set chroma(c: number) {
        if (c < 0) c = 0;
        let i = this.intensity;
        let oc = this.chroma;
        this._r = (this._r - i) * c / oc + i;
        this._g = (this._g - i) * c / oc + i;
        this._b = (this._b - i) * c / oc + i;
    }

    /** the hue of this color */
    public get hue(): number {
        if (this.chroma == 0) return 0;
        let hPrime: number;
        switch (Math.max(this._r, this._g, this._b)) {
            case this._r:
                hPrime = ((this._g - this._b) / this.chroma + 6) % 6;
                break;
            case this._g:
                hPrime = (this._b - this._r) / this.chroma + 2;
                break;
            case this._b:
                hPrime = (this._r - this._g) / this.chroma + 4;
                break;
            default:
                hPrime = 0;
                break;
        }
        return hPrime / 6;
    }

    public set hue(h: number) {
        let replacements = Color.fromHSV(h, this.saturation_V, this.value);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the brightness of this color in HSI format */
    public get intensity(): number {
        return avg(this._r, this._g, this._b);
    }

    public set intensity(i: number) {
        let replacements = Color.fromHSI(this.hue, this.saturation_I, i);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the brightness of this color in HSV format */
    public get value(): number {
        return Math.max(this._r, this._g, this._b);
    }

    public set value(v: number) {
        let replacements = Color.fromHSV(this.hue, this.saturation_V, v);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the brightness of this color in HSL format */
    public get lightness(): number {
        return mid(this._r, this._g, this._b);
    }

    public set lightness(l: number) {
        let replacements = Color.fromHSL(this.hue, this.saturation_L, l);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the saturation of this color in HSV format */
    public get saturation_V(): number {
        return this.value == 0 ? 0 : this.chroma / this.value;
    }

    public set saturation_V(s: number) {
        let replacements = Color.fromHSV(this.hue, s, this.value);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the saturation of this color in HSL format */
    public get saturation_L(): number {
        return this.lightness % 1 == 0 ? 0 : this.chroma / (1 - Math.abs(2 * this.lightness - 1));
    }

    public set saturation_L(s: number) {
        let replacements = Color.fromHSL(this.hue, s, this.lightness);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the saturation of this color in HSI format */
    public get saturation_I(): number {
        return this.intensity == 0 ? 0 : 1 - Math.min(this._r, this._g, this._b) / this.intensity;
    }

    public set saturation_I(s: number) {
        let replacements = Color.fromHSI(this.hue, s, this.intensity);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    //#region defaults
    public static readonly BLACK = Color.fromHex("#000000");
    public static readonly RED = Color.fromHex("#FF0000");
    public static readonly YELLOW = Color.fromHex("#FFFF00");
    public static readonly GREEN = Color.fromHex("#00FF00");
    public static readonly CYAN = Color.fromHex("#00FFFF");
    public static readonly BLUE = Color.fromHex("#0000FF");
    public static readonly MAGENTA = Color.fromHex("#FF00FF");
    public static readonly WHITE = Color.fromHex("#FFFFFF");
    //#endregion

    /** create a color from a corresponding hex value */
    public static fromHex(hex: string): Color {

        // remove any leading formatting characters
        hex = hex.replace(/#|0x/, "");

        const colorValue = Number.parseInt(hex, 16);

        let r: number;
        let g: number;
        let b: number;

        switch (hex.length) {

            // 8-bit color
            case 2:
                r = (colorValue & 0b1110_0000) / 0b1110_0000;
                g = (colorValue & 0b0001_1100) / 0b0001_1100;
                b = (colorValue & 0b0000_0011) / 0b0000_0011;
                break;

            // 12-bit color
            case 3:
                r = (colorValue & 0xF00) / 0xF00;
                g = (colorValue & 0x0F0) / 0x0F0;
                b = (colorValue & 0x00F) / 0x00F;
                break;

            // 16-bit color
            case 4:
                r = (colorValue & 0xF800) / 0xF800;
                g = (colorValue & 0x07E0) / 0x07E0;
                b = (colorValue & 0x001F) / 0x001F;
                break;

            // 24-bit color
            case 6:
                r = (colorValue & 0xFF_00_00) / 0xFF_00_00;
                g = (colorValue & 0x00_FF_00) / 0x00_FF_00;
                b = (colorValue & 0x00_00_FF) / 0x00_00_FF;
                break;

            // 36-bit color
            case 9:
                r = (colorValue & 0xFFF_000_000) / 0xFFF_000_000;
                g = (colorValue & 0x000_FFF_000) / 0x000_FFF_000;
                b = (colorValue & 0x000_000_FFF) / 0x000_000_FFF;
                break;

            // 48-bit color
            case 12:
                r = (colorValue & 0xFFFF_0000_0000) / 0xFFFF_0000_0000;
                g = (colorValue & 0x0000_FFFF_0000) / 0x0000_FFFF_0000;
                b = (colorValue & 0x0000_0000_FFFF) / 0x0000_0000_FFFF;
                break;

            default:
                throw new Error("Invalid color format");
        }

        return new Color(r, g, b);
    }

    /** create a color from HSV format */
    public static fromHSV(hue: number, saturation: number, value: number, alpha = 1): Color {

        const chroma = value * saturation;
        const scaledHue = hue * 6;

        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);

        // intermediate value for second largest component
        const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));

        // constant to add to all color components
        const m = value - chroma;

        return Color.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a color from HSL format */
    public static fromHSL(hue: number, saturation: number, lightness: number, alpha = 1): Color {

        const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const scaledHue = hue * 6;

        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);

        // intermediate value for second largest component
        const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));

        // constant to add to all color components
        const m = lightness - chroma * 0.5;

        return Color.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a color from HSI format */
    public static fromHSI(hue: number, saturation: number, intensity: number, alpha = 1): Color {

        const scaledHue = hue * 6;

        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);

        const Z = 1 - Math.abs(scaledHue % 2 - 1);

        const chroma = 3 * intensity * saturation / (1 + Z);

        // intermediate value for second largest component
        const X = chroma * Z;

        // constant to add to all color components
        const m = intensity * (1 - saturation);

        return Color.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a color from 24-bit RGB format */
    public static from24BitRGB(r: number, g: number, b: number): Color {
        return this.from32BitRGBA(r, g, b);
    }

    /** create a color from 32-bit RGBA format */
    public static from32BitRGBA(r: number, g: number, b: number, a: number = 1): Color {
        return new Color(r / 0xFF, g / 0xFF, b / 0xFF, a);
    }

    private static fromCXM(hueRegion: number, chroma: number, X: number, m: number, alpha: number): Color {

        switch (hueRegion) {
            case 0: // red to yellow
                return new Color(chroma + m, X + m, m, alpha);
            case 1: // yellow to green
                return new Color(X + m, chroma + m, m, alpha);
            case 2: // green to cyan
                return new Color(m, chroma + m, X + m, alpha);
            case 3: // cyan to blue
                return new Color(m, X + m, chroma + m, alpha);
            case 4: // blue to magenta
                return new Color(X + m, m, chroma + m, alpha);
            case 5: // magenta to red
                return new Color(chroma + m, m, X + m, alpha);
            default:
                return Color.BLACK;
        }
    }
}

/** the available color spaces supported by the library */
export enum ColorSpace {
    RGB,
    HSV,
    HSL,
    HSI
}