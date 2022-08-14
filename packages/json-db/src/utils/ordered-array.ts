import { match } from "./match";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function orderedMatchArray(target: Array<Record<string, any>>, pattern: Array<Record<string, any>>): boolean {
    if (pattern.length === 0) return true;
    if (target.length < pattern.length) return false;
    if (target.length === 0) return true;

    for (let i = 0; i < pattern.length; i++) {
        const x = target[i], y = pattern[i];

        if (x === y) continue;
        if (typeof x === "object" && typeof y === "object") {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (x === null || y === null) return false;

            // eslint-disable-next-line @typescript-eslint/naming-convention
            const isXArray = Array.isArray(x);
            if (+isXArray ^ +Array.isArray(y)) return false;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            if (isXArray ? orderedMatchArray(x, y as Array<Record<string, any>>) : match(x, y, true)) continue;
        }

        return false;
    }

    return true;
}