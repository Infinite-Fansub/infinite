import { InfiniteClient } from "../src";
import { ErelaModule, ErelaOptions } from "../../erela-module/src";

const client = new InfiniteClient<ErelaOptions>({
    intents: [],
    dirs: { erela: "" },
    nodes: [],
    token: ""
}).withModules([{ name: "erela", ctor: ErelaModule }]);

client.erela