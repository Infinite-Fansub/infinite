import { Color, ColorSpace, DirectGradient, JoinedGradient, colorConsole, Interpolation } from "colours.js";

export function fire(message: string, isBackground: boolean = false, inverted: boolean = false): string {
    const fireGrad = new JoinedGradient(
        inverted ? Color.YELLOW : Color.RED,
        {
            color: Color.ORANGE,
            interpolation: inverted ? Interpolation.dec_quadratic : Interpolation.inc_quadratic,
            length: inverted ? 1 : 2
        },
        {
            color: inverted ? Color.RED : Color.YELLOW,
            space: ColorSpace.HSV
        }
    );

    return isBackground
        ? colorConsole.gradient(colorConsole.uniform(message, Color.BLACK), fireGrad, true)
        : colorConsole.gradient(message, fireGrad);
}

export function ice(message: string, isBackground: boolean = false, inverted: boolean = false): string {
    const iceGrad = new DirectGradient(
        inverted ? Color.SILVER : Color.fromHex("#088fff"),
        inverted ? Color.fromHex("#088fff") : Color.SILVER,
        ColorSpace.RGB,
        inverted ? Interpolation.dec_quadratic : Interpolation.inc_quadratic
    );

    return isBackground
        ? colorConsole.gradient(colorConsole.uniform(message, Color.BLACK), iceGrad, true)
        : colorConsole.gradient(message, iceGrad);
}
export function rainbow(message: string, isBackground: boolean = false): string {
    const rainbowGrad = new DirectGradient(Color.RED, Color.RED, ColorSpace.HSV, Interpolation.linear, true);

    return isBackground
        ? colorConsole.gradient(colorConsole.uniform(message, Color.BLACK), rainbowGrad, true)
        : colorConsole.gradient(message, rainbowGrad);
}
export function zebra(message: string, isBackground: boolean = false): string {
    return isBackground
        ? colorConsole.cyclicUniform(colorConsole.cyclicUniform(message, 1, true, Color.WHITE, Color.BLACK), 1, false, Color.BLACK, Color.WHITE)
        : colorConsole.cyclicUniform(message, 1, false, Color.WHITE, Color.BLACK);
}