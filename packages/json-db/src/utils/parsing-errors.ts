/* eslint-disable @typescript-eslint/naming-convention */
import { inspect } from "node:util";

export const ParsingError = {
    Object: (key: string): string => {
        return inspect({
            // eslint-disable-next-line object-curly-newline
            [key]: {
                type: "object"
                // eslint-disable-next-line object-curly-newline
            }
        }, { colors: true, compact: false });
    },
    Tuple: (key: string): string => {
        return inspect({
            [key]: {
                type: "tuple",
                elements: ["string"]
            }
        }, { colors: true, compact: false });
    },
    Info: {
        Object: inspect({
            artist: {
                type: "object",
                data: {
                    name: "string",
                    age: "number",
                    hobbies: "array"
                }
            }
        }, { colors: true }),
        Tuple: inspect({
            information: {
                type: "tuple",
                elements: ["string", "number", { createdAt: "date", joinedAt: "date" }, "array"]
            }
        }, { colors: true, depth: null })
    }
};