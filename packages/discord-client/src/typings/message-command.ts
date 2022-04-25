import { Message, Awaitable } from "discord.js";
import InfiniteClient from "../client";

export type CommandExecute = (options: CommandArgs) => Awaitable<void>;

export interface ICommand {
    name: string;
    description?: string;
    enabled?: boolean;
    execute: CommandExecute;
}

export interface CommandArgs {
    message: Message;
    args: Array<string>;
    command: string;
    client: InfiniteClient;
}