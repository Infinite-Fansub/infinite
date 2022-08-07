import { GatewayIntentBits } from "discord.js";
import { InfiniteClient, Paginator } from "../src";

new InfiniteClient({
    intents: [GatewayIntentBits.GuildIntegrations],
    token: "ODU5OTE5NDA3Njg4NzEyMjEy.GbDiGg.ZtaVbEcobxEAlrmengMdvAh2w-BgB7OQauuXhk"
}).on("interactionCreate", (int) => {
    if (int.isChatInputCommand()) {
        const pag = new Paginator([{ description: "1" }, { description: "2" }]);

        int.reply(pag.create(int));
    }
});