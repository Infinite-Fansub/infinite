/* eslint-disable @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-explicit-any*/
import { SlashCommandBuilder, ChatInputCommandInteraction, Awaitable, RESTPostAPIApplicationCommandsJSONBody, SlashCommandSubcommandsOnlyBuilder, AutocompleteInteraction } from "discord.js";
import { InfiniteClient } from "../client";
import { IClientOptions } from "./client-options";

export type SlashCommandExecute<T extends IClientOptions> = (interaction: ChatInputCommandInteraction, client: InfiniteClient<T>) => Awaitable<any>;

export type SlashCommandAutocomplete<T extends IClientOptions> = (interaction: AutocompleteInteraction, client: InfiniteClient<T>) => Awaitable<any>;

export interface BaseSlashCommand<T extends IClientOptions> {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder | RESTPostAPIApplicationCommandsJSONBody;
    description?: string;
    post?: Post;
    enabled?: boolean;
    autocomplete?: SlashCommandAutocomplete<T>;
}

export interface SlashCommandWithRun<T extends IClientOptions> extends BaseSlashCommand<T> {
    run: SlashCommandExecute<T>;
}

export interface SlashCommandWithExecute<T extends IClientOptions> extends BaseSlashCommand<T> {
    execute: SlashCommandExecute<T>;
}

export type ISlashCommand<T extends IClientOptions = IClientOptions> = SlashCommandWithExecute<T> | SlashCommandWithRun<T>;

export type Guild = "ALL" | string | Array<string>;
export type Post = "GLOBAL" | Guild;