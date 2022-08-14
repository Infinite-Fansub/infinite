import { inspect } from "node:util";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ParsingError {
    export function Object(key: string): string {
        return inspect({
            // eslint-disable-next-line object-curly-newline
            [key]: {
                type: "object"
                // eslint-disable-next-line object-curly-newline
            }
        }, { colors: true, compact: false });
    }

    export function Tuple(key: string): string {
        return inspect({
            [key]: {
                type: "tuple",
                elements: ["string"]
            }
        }, { colors: true, compact: false });
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Info {
        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-shadow
        export const Object = inspect({
            artist: {
                type: "object",
                data: {
                    name: "string",
                    age: "number",
                    hobbies: "array"
                }
            }
        }, { colors: true });

        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-shadow
        export const Tuple = inspect({
            information: {
                type: "tuple",
                elements: ["string", "number", { createdAt: "date", joinedAt: "date" }, "array"]
            }
        }, { colors: true, depth: null });
    }
}