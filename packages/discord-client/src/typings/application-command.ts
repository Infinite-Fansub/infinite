/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { SlashCommandBuilder, ChatInputCommandInteraction, Awaitable, RESTPostAPIApplicationCommandsJSONBody, SlashCommandSubcommandsOnlyBuilder, AutocompleteInteraction } from "discord.js";
import { InfiniteClient } from "../client";

export type SlashCommandExecute = (interaction: ChatInputCommandInteraction, client: InfiniteClient) => Awaitable<unknown>;

export type SlashCommandAutocomplete = (interaction: AutocompleteInteraction, client: InfiniteClient) => Awaitable<unknown>;

export interface BaseSlashCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder | RESTPostAPIApplicationCommandsJSONBody;
    description?: string;
    post?: Post;
    enabled?: boolean;
    autocomplete?: SlashCommandAutocomplete;
}

export interface SlashCommandWithRun extends BaseSlashCommand {
    run: SlashCommandExecute;
}

export interface SlashCommandWithExecute extends BaseSlashCommand {
    execute: SlashCommandExecute;
}

export type ISlashCommand = SlashCommandWithExecute | SlashCommandWithRun;

export type Guild = "ALL" | string | Array<string>;
export type Post = "GLOBAL" | Guild;