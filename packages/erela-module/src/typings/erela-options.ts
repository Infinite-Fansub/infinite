import { DirectoryTypes, IClientOptions } from "@infinite-fansub/discord-client/dist";
import { NodeOptions } from "erela.js";

export interface ErelaOptions extends IClientOptions {
    nodes: Array<NodeOptions>;
    dirs: DirectoryTypes & {
        erela?: string
    };
}