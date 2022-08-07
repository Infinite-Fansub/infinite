import { APIEmbed } from "discord.js";

export interface PaginatorOptions {
    max_len?: number | null;
    time?: number;
    embedDefaults?: APIEmbed;
    arrows?: {
        leftArrow?: string,
        rightArrow?: string
    };
}