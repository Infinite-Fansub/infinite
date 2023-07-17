import { ClientEvents, RESTPostAPIApplicationCommandsJSONBody, ClientOptions } from "discord.js";
import { InfiniteClient } from "../client";
import { IClientOptions } from "./client-options";

export interface IClientEvents<DO extends ClientOptions = ClientOptions, O extends IClientOptions = IClientOptions> extends Omit<ClientEvents, "ready"> {
    ready: [client: InfiniteClient<O, DO>];
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    loadedSlash: [commands: Array<RESTPostAPIApplicationCommandsJSONBody>, type: "Global" | string, client: InfiniteClient<O, DO>];
    deletedSlash: [type: "Global" | "Guild", client: InfiniteClient<O, DO>];
}