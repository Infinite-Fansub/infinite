import { InfiniteClient, GatewayIntentBits } from "../src/index";

new InfiniteClient({
    intents: [GatewayIntentBits.Guilds],
    useDatabase: true,
    databaseType: { type: "redis" },
    token: "OTM1MjcyNjY1NDc4OTg3ODQ3.Ye8Oiw.26PcRU_zAzupNP_L2HACXNEWM6g"
});