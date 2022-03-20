import { Color, ColorSpace, DirectGradient, JoinedGradient, Interpolation, colorConsole } from "colours.js";
import { divideString } from "./string-divide";
const { fromHex } = Color;

export function InfiniteGradient(inverted: boolean = false): DirectGradient {
    return new DirectGradient(
        inverted ? fromHex("#C603FC") : fromHex("#0048FF"),
        inverted ? fromHex("#0048FF") : fromHex("#C603FC"),
        ColorSpace.RGB,
        Interpolation.cubic
    );
}

export function BlueWave(inverted: boolean = false): DirectGradient {
    return new DirectGradient(
        inverted ? fromHex("#00B3FF") : fromHex("#0000FF"),
        inverted ? fromHex("#0000FF") : fromHex("#00B3FF"),
        ColorSpace.RGB,
        Interpolation.dec_quadratic
    );
}

export function PinkToPurple(inverted: boolean = false): DirectGradient {
    return new DirectGradient(
        inverted ? fromHex("#B300FF") : fromHex("#FF00EF"),
        inverted ? fromHex("#FF00EF") : fromHex("#B300FF"),
        ColorSpace.RGB,
        Interpolation.dec_quadratic,
        true
    );
}

export function GreenToRed(inverted: boolean = false): DirectGradient {
    return new DirectGradient(
        inverted ? Color.RED : Color.GREEN,
        inverted ? Color.GREEN : Color.RED,
        ColorSpace.HSV,
        Interpolation.cubic
    );
}

export function DidasToMarija(log: string, inverted: boolean = false): string {
    const { firstHalf, secondHalf } = divideString(log);

    const first = new JoinedGradient(inverted ? fromHex("#3300FF") : fromHex("#FF00EF"), {
        color: inverted ? fromHex("#FF00EF") : fromHex("#3300FF"),
        space: ColorSpace.HSI,
        interpolation: inverted ? Interpolation.dec_quadratic : Interpolation.inc_quadratic
    });
    const second = new JoinedGradient(inverted ? fromHex("#00E5FF") : fromHex("#5500FF"), {
        color: inverted ? fromHex("#5500FF") : fromHex("#00E5FF"),
        space: ColorSpace.HSI,
        interpolation: inverted ? Interpolation.inc_quadratic : Interpolation.dec_quadratic
    });

    return inverted ? `${colorConsole.gradient(firstHalf, second)} ${colorConsole.gradient(secondHalf, first)}` : `${colorConsole.gradient(firstHalf, first)} ${colorConsole.gradient(secondHalf, second)}`;
}