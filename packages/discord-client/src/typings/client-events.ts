import { ClientEvents, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { InfiniteClient } from "../client";

export interface IClientEvents extends Omit<ClientEvents, "ready"> {
    ready: [client: InfiniteClient];
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    loadedSlash: [commands: Array<RESTPostAPIApplicationCommandsJSONBody>, type: "Global" | string, client: InfiniteClient];
    deletedSlash: [type: "Global" | "Guild", client: InfiniteClient];
}