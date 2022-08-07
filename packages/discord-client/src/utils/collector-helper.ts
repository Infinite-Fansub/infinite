import { Awaitable, ComponentType, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { CollectorOptions, ParseComponentType } from "../typings";

export class CollectorHelper<T extends Exclude<ComponentType, "ActionRow">> {

    public constructor(type: T, private readonly interaction: ChatInputCommandInteraction, private readonly options?: CollectorOptions) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!type) throw new Error();
        // TODO: Implement type logic
    }

    public async create(callback: (interaction: ParseComponentType<T>) => Awaitable<void>, options?: CollectorOptions): Promise<void> {
        if (options && options.time === undefined) options.time = 18000;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const chn = this.interaction.channel ?? await this.interaction.client.channels.fetch(this.interaction.channelId) as TextChannel;

        const collector = chn.createMessageComponentCollector(options ?? this.options);
        collector.on("collect", callback);
        if (this.options?.kill || options?.kill)
            collector.on("end", () => {
                this.interaction.editReply({ components: [] });
            });
    }
}