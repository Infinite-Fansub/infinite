/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { SlashCommandBuilder, ChatInputCommandInteraction, Awaitable, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { InfiniteClient } from "../client";

export type SlashCommandExecute = (interaction: ChatInputCommandInteraction, client: InfiniteClient) => Awaitable<unknown>;

export interface ISlashCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | RESTPostAPIApplicationCommandsJSONBody;
    description?: string;
    post?: Post;
    enabled?: boolean;
    run?: SlashCommandExecute;
    execute?: SlashCommandExecute;
}

export type Guild = "ALL" | string | Array<string>;
export type Post = "GLOBAL" | Guild;