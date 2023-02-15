import { ClientOptions } from "discord.js";
import { DirectoryTypes } from "./directory-types";

export interface IClientOptions extends ClientOptions {
    token: string;
    prefix?: string;
    disable?: DisableOptions;
    dirs?: DirectoryTypes;
    watch?: WatchOptions | boolean;
    inject?: Record<string, unknown>;
}

export interface WatchOptions {
    commands?: boolean;
    slashCommands?: boolean;
    events?: boolean;
}

export interface DisableOptions {
    warnings?: boolean;
    interactions?: boolean;
    messageCommands?: boolean;
    registerOnJoin?: boolean;
}