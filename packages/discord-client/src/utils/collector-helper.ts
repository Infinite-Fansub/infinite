import { Awaitable, Interaction, ComponentType, InteractionType } from "discord.js";
import { CollectorOptions, ParseComponentType } from "../typings";

export class CollectorHelper<T extends Exclude<ComponentType, "ActionRow">> {

    public constructor(type: T, private readonly interaction: Interaction, private readonly options: CollectorOptions = { time: 18000 }) {
        if (type === 1) throw new Error("Type should be the expected component and not the action row");
        if (type === 2 && !interaction.isButton()) throw new Error(`Expected interaction of type \`Button\` got type \`${interaction.type}\``);
        if (type === 3 && !interaction.isSelectMenu()) throw new Error(`Expected interaction of type \`SelectMenu\` got type \`${interaction.type}\``);
        if (type === 4 && !(interaction.type === InteractionType.ModalSubmit)) throw new Error(`Expected interaction of type \`Modal\` got type \`${interaction.type}\``);
    }

    public create(callback: (interaction: ParseComponentType<T>) => Awaitable<void>, options?: CollectorOptions): void {
        if (options && options.time === undefined) options.time = 18000;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const collector = this.interaction.channel?.createMessageComponentCollector(options ?? this.options);

        collector?.on("collect", callback);
    }
}