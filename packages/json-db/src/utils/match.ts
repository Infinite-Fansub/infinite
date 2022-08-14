import { orderedMatchArray } from "./ordered-array";
import { unorderedMatchArray } from "./unordered-array";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function match(target: Record<string, any>, pattern: Record<string, any>, ordered: boolean = false): boolean {
    const targetKeys = Object.keys(target);
    const kvs = Object.entries(pattern);

    if (kvs.length === 0) return true;
    if (targetKeys.length < kvs.length) return false;
    if (targetKeys.length === 0) return true;

    const matchArray = ordered ? orderedMatchArray : unorderedMatchArray;

    for (let i = 0; i < kvs.length; i++) {
        const [k, v] = kvs[i];
        if (!(k in target)) return false;
        const e = target[k];

        // primitive
        if (e === v) continue;
        if (typeof v !== "object" || typeof e !== "object") return false;

        // null, typeof null === 'object'
        const a = v === null, b = e === null;
        if (+a ^ +b) return false; // +a ^ +b, return false when only one of them is null

        // arrays/objects
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const isEArray = Array.isArray(e);
        if (+isEArray ^ +Array.isArray(v)) return false;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        if (isEArray ? !matchArray(e, v) : !match(e, v, ordered)) return false;
    }

    return true;
}