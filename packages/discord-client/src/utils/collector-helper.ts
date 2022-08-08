import { Awaitable, ComponentType, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { CollectorOptions, ParseComponentType } from "../typings";

export class CollectorHelper<T extends Exclude<ComponentType, "ActionRow">> {

    /**
     * @param interaction - The interaction the collector is created on
     * @param options - The options for the collector
     */
    public constructor(private readonly interaction: ChatInputCommandInteraction, private readonly options?: CollectorOptions) { }

    /**
     * Create a collector
     *
     * @param callback - The callback function for the collector
     * @param options - The options for the collector
     */
    public async create(callback: (interaction: ParseComponentType<T>) => Awaitable<void>, options?: CollectorOptions): Promise<void> {
        if (options && options.time === undefined) options.time = 18000;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const chn = this.interaction.channel ?? await this.interaction.client.channels.fetch(this.interaction.channelId) as TextChannel;

        const collector = chn.createMessageComponentCollector(options ?? this.options);
        collector.on("collect", (int: ParseComponentType<T>) => {
            callback(int);
        });
        // TODO: Implementation of `this.options.destroy`
        if (this.options?.kill || options?.kill)
            collector.on("end", () => {
                this.interaction.editReply({ components: [] });
            });
    }
}