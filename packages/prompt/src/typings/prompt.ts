import { Color } from "colours.js/dst";
import { ReadLineOptions } from "node:readline";

export interface PromptOptions<T extends boolean> {
    defaultText?: string | undefined;
    prompt?: string | undefined;
    // eslint-disable-next-line @typescript-eslint/space-infix-ops
    solid?: T extends true ? { color: string | Color } : undefined;
    gradient?: T extends true ? PromptGradient : undefined;
    interface?: ReadLineOptions;
}

export interface PromptGradient {
    primaryColor: string | Color;
    secondaryColor: string | Color;
}