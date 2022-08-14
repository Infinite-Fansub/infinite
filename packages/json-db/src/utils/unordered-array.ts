import { match } from "./match";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unorderedMatchArray(target: Array<Record<string, any>>, pattern: Array<Record<string, any>>): boolean {
    if (pattern.length === 0) return true;
    if (target.length < pattern.length) return false;
    if (target.length === 0) return true;

    const matchedIndices = new Set<number>();

    for (let i = 0; i < target.length; i++) {
        const x = target[i];
        for (let j = 0; j < pattern.length; j++) {
            if (matchedIndices.has(j)) continue;
            const y = pattern[j];

            // primitive
            if (x === y) {
                matchedIndices.add(j);
                break;
            }

            // arrays/objects
            if (typeof x === "object" && typeof y === "object") {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (x === null || y === null) continue;

                // eslint-disable-next-line @typescript-eslint/naming-convention
                const isXArray = Array.isArray(x);
                if (+isXArray ^ +Array.isArray(y)) continue;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                if (isXArray ? unorderedMatchArray(x, y as Array<Record<string, any>>) : match(x, y, false)) {
                    matchedIndices.add(j);
                    break;
                }
            }
        }

        if (matchedIndices.size === pattern.length) return true;
    }

    return false;
}