import { ClientEvents, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { InfiniteClient } from "../client";
import { Client as RedisClient } from "redis-om";

export interface IClientEvents extends Omit<ClientEvents, "ready"> {
    ready: [client: InfiniteClient];
    databaseOpen: [client: InfiniteClient, database: RedisClient];
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    loadedSlash: [commands: Array<RESTPostAPIApplicationCommandsJSONBody>, type: "Global" | string, client: InfiniteClient];
    deletedSlash: [type: "Global" | "Guild", client: InfiniteClient];
}