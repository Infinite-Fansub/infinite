/* eslint-disable @typescript-eslint/restrict-plus-operands, @typescript-eslint/naming-convention */
import { COLOR_DATA_SYMBOL, IApplicable } from "./typings/types";
import { RESET_TOKEN } from "./ansi";
import { GradientPoint, JoinedGradient } from "./gradient";
import { CHANGES_BG, CHANGES_FG, splitAnsiString } from "./stransi";

export function c(reset: boolean): (substrings: TemplateStringsArray, ...items: Array<{ toString: () => string } | IApplicable>) => string;
export function c(substrings: TemplateStringsArray, ...items: Array<{ toString: () => string } | IApplicable>): string;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function c(substrings: TemplateStringsArray | boolean, ...items: Array<{ toString: () => string } | IApplicable>) {
    if (typeof substrings === "boolean") {
        if (substrings) return _cr;
        else return _c;
    } else {
        return _cr(substrings, ...items);
    }
}

function _c(substrings: TemplateStringsArray | Array<string>, ...items: Array<{ toString: () => string } | string | IApplicable>): string {
    let result = substrings[0];
    for (let i = 0; i < items.length;) {
        let item = items[i];
        if (Object.getOwnPropertySymbols(item)
            .includes(COLOR_DATA_SYMBOL)) {
            let colorSampler = (item as IApplicable)[COLOR_DATA_SYMBOL];
            let points: Array<GradientPoint> = [];
            let lengths: Array<number> = [];
            if (item instanceof GradientPoint) {
                let combinedSubstring = "";
                let addLater: string | undefined;
                let {
                    color,
                    background
                } = item;
                while (true) {
                    item = items[++i];
                    if (item instanceof GradientPoint) {
                        points.push(item);
                        combinedSubstring += substrings[i];
                        if (addLater) {
                            combinedSubstring += addLater;
                            lengths.push(substrings[i].length + addLater.length);
                        }
                        addLater = undefined;
                    } else if (
                        typeof item == "undefined" || Object.getOwnPropertySymbols(item)
                            .includes(COLOR_DATA_SYMBOL) || typeof item == "string" && (background ? CHANGES_BG.test(item) : CHANGES_FG.test(item))
                    )
                        break;
                    else {
                        if (i == 1) combinedSubstring += substrings[1];
                        if (addLater) {
                            combinedSubstring += addLater + substrings[i];
                        }
                        // eslint-disable-next-line @typescript-eslint/no-base-to-string
                        addLater = item.toString();
                    }
                }
                let segments = points.map((v, j) => v.asSegment(lengths[j]));
                let g = new JoinedGradient(color, ...segments);
                result += _c(["", combinedSubstring], background ? g.asBackground : g.asForeground);
                if (typeof addLater == "string")
                    result += substrings[i - 1] + addLater;
                result += substrings[i];
            } else if (colorSampler.getAt instanceof Function) {
                let toInsert = splitAnsiString(substrings[++i]);
                let count = toInsert.reduce((p, r, j) => colorSampler.bg && CHANGES_BG.test(r) || !colorSampler.bg && CHANGES_FG.test(r) ? Math.min(p, j) : p, toInsert.length);
                for (let j = 0, t = 0; j < count; t += 1 / count) {
                    result += colorSampler.bg ? colorSampler.getAt(t).asBackground : colorSampler.getAt(t).asForeground;
                    result += toInsert[j++];
                }
            } else {
                result += colorSampler.bg ? colorSampler.getAt.asBackground : colorSampler.getAt.asForeground;
                result += substrings[++i];
            }
        } else {
            result += item.toString();
            result += substrings[++i];
        }
    }
    return result;
}

function _cr(substrings: TemplateStringsArray, ...items: Array<{ toString: () => string } | IApplicable>): string {
    return _c(substrings, ...items) + RESET_TOKEN;
}