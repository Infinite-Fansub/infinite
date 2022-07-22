import { GatewayIntentBits } from "discord.js";
import { join } from "path";
import { InfiniteClient } from "../src";

new InfiniteClient({
    token: "ODU5OTE5NDA3Njg4NzEyMjEy.G-4tA4.LZeWXfUfIhiitV1jtV-EHAKS19o5u11RZK5QH0",
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildIntegrations],
    dirs: {
        events: join(__dirname, "./events")
    }
});