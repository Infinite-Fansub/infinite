import { ClientEvents, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { InfiniteClient } from "../client";
import { IClientOptions } from "./client-options";

export interface IClientEvents<O extends IClientOptions = IClientOptions> extends Omit<ClientEvents, "ready"> {
    ready: [client: InfiniteClient<O>];
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    loadedSlash: [commands: Array<RESTPostAPIApplicationCommandsJSONBody>, type: "Global" | string, client: InfiniteClient<O>];
    deletedSlash: [type: "Global" | "Guild", client: InfiniteClient<O>];
}