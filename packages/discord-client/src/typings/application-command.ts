/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { SlashCommandBuilder, ChatInputCommandInteraction, Awaitable } from "discord.js";
import { InfiniteClient } from "../client";

export type SlashCommandExecute = (interaction: ChatInputCommandInteraction, client: InfiniteClient) => Awaitable<void>;

export interface ISlashCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    description?: string;
    post?: Post;
    enabled?: boolean;
    execute: SlashCommandExecute;
}

export type Guild = "ALL" | string | Array<string>;
export type Post = "GLOBAL" | Guild;