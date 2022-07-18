import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits } from "discord.js";
import { InfiniteClient } from "../src";

new InfiniteClient({
    token: "ODU5OTE5NDA3Njg4NzEyMjEy.Gqp3jm.YguR7BRjVl2SDF2k2KLLLjw9ZD7-yGcniQbXpM",
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildIntegrations]
}).on("interactionCreate", (i) => {
    const collector = i.channel?.createMessageComponentCollector({ time: 18000 });
    if (i.isChatInputCommand())
        i.reply({
            content: "I",
            components: [
                new ActionRowBuilder<ButtonBuilder>({
                    components: [
                        new ButtonBuilder({
                            label: "YES",
                            custom_id: "yes",
                            style: ButtonStyle.Primary
                        })
                    ]
                })
            ]
        });
    collector?.on("end", (c) => console.log(c));
});