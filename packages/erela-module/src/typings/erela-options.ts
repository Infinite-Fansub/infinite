import { DirectoryTypes, IClientOptions } from "@infinite-fansub/discord-client/dist";
import { NodeOptions } from "erela.js";

export interface ErelaOptions extends IClientOptions {
    nodes: Array<NodeOptions>;
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    dirs: DirectoryTypes & {
        erela?: string
    };
}