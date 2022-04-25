/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { CommandInteraction, Awaitable } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import InfiniteClient from "../client";

export type SlashCommandExecute = (interaction: CommandInteraction, client: InfiniteClient) => Awaitable<void>;

export interface ISlashCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    description?: string;
    post?: Post;
    enabled?: boolean;
    execute: SlashCommandExecute;
}

export type Guild = "ALL" | string | Array<string>;
export type Post = "GLOBAL" | Guild;