import { ClientOptions } from "discord.js";
import { DirectoryTypes } from "./directory-types";

export interface IClientOptions extends ClientOptions {
    token: string;
    prefix?: string;
    database?: DatabaseTypes;
    disable?: {
        warnings?: boolean,
        interactions?: boolean,
        messageCommands?: boolean,
        registerOnJoin?: boolean
    };
    dirs?: DirectoryTypes;
    watch?: boolean | {
        commands?: boolean,
        slashCommands?: boolean,
        events?: boolean
    };
}

export type DatabaseTypes = MongoType | RedisType | "json";

export interface MongoType {
    type: "mongo";
    path: string;
}

export interface RedisType {
    type: "redis";
    path?: RedisObject | string;
}

export interface RedisObject {
    username?: string;
    password?: string;
    entrypoint: string;
    port?: string;
}