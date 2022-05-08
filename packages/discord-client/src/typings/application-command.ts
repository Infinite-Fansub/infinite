/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { SlashCommandBuilder, ChatInputCommandInteraction, Awaitable, MessageComponentInteraction, ComponentType, MessageChannelComponentCollectorOptions } from "discord.js";
import { InfiniteClient } from "../client";

export type SlashCommandExecute = (interaction: ChatInputCommandInteraction, client: InfiniteClient) => Awaitable<void>;

export interface ISlashCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    description?: string;
    post?: Post;
    enabled?: boolean;
    buttons?: {
        collectorOptions: { componentType?: ComponentType.ActionRow | undefined } & MessageChannelComponentCollectorOptions<MessageComponentInteraction<"cached">> | undefined,
        callback: (interaction: MessageComponentInteraction) => Awaitable<void>,
        // Defaults to TRUE but is deleting instead of actually disable *TODO*
        disable?: boolean
    };
    execute: SlashCommandExecute;
}

export type Guild = "ALL" | string | Array<string>;
export type Post = "GLOBAL" | Guild;