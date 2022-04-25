import { ClientEvents } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import InfiniteClient from "../client";

export interface IClientEvents extends ClientEvents {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    loadedSlash: [commands: Array<RESTPostAPIApplicationCommandsJSONBody>, type: "Global" | string, client: InfiniteClient];
    deletedSlash: [type: "Global" | "Guild", client: InfiniteClient];
}