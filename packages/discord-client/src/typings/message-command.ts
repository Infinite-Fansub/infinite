import { Message, Awaitable } from "discord.js";
import { InfiniteClient } from "../client";
import { IClientOptions } from "./client-options";

export type CommandExecute<T extends IClientOptions> = (options: CommandArgs<T>) => Awaitable<void>;

export interface ICommand<T extends IClientOptions = IClientOptions> {
    name: string;
    description?: string;
    enabled?: boolean;
    execute: CommandExecute<T>;
}

export interface CommandArgs<T extends IClientOptions> {
    message: Message;
    args: Array<string>;
    command: string;
    client: InfiniteClient<T>;
}