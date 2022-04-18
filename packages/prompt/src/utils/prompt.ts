import { Color } from "colours.js/dst";

export type PromptOptions<T extends boolean> = {
    defaultText?: string | undefined,
    prompt?: string | undefined,
    solid?: T extends true ? { color: string | Color } : undefined,
    gradient?: T extends true ? PromptGradient : undefined
};

export interface PromptGradient {
    primaryColor: string | Color;
    secondaryColor: string | Color;
}