import { APIEmbed, ButtonComponentData } from "discord.js";

export interface PaginatorOptions {
    max_len?: number | null;
    time?: number;
    embedDefaults?: APIEmbed;
    arrows?: {
        leftArrow: Partial<ButtonComponentData>,
        rightArrow: Partial<ButtonComponentData>
    };
}