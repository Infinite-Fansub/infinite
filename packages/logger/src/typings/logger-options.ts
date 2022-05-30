import { Colors } from "./colors";
import { Emojis } from "./emojis";

export type LoggerOptions = {
    colors?: Partial<Colors>,
    emojis?: Partial<Emojis>,
    showMemory?: boolean
};