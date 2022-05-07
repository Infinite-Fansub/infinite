import { ClientOptions } from "discord.js";
import { DirectoryTypes } from "./directory-types";

export interface IClientOptions extends ClientOptions {
    token: string;
    prefix?: string;
    useDatabase?: boolean;
    noDatabaseWarning?: boolean;
    databaseType?: DatabaseTypes;
    dirs?: DirectoryTypes;
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
    username: string;
    password: string;
    entrypoint: string;
    port?: string;
}