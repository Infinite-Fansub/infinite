import { Awaitable, Interaction, ComponentType, InteractionType, InteractionCollector, MappedInteractionTypes, MessageComponentType, ButtonInteraction } from "discord.js";
import { CollectorOptions, ParseComponentType } from "src/typings";
import { ButtonLogic } from "./button-logic";

export class CollectorHelper<T extends Exclude<ComponentType, "ActionRow">> {

    private collector: InteractionCollector<MappedInteractionTypes[MessageComponentType]> | undefined;

    public constructor(type: T, private readonly interaction: Interaction) {
        if (type === 1) throw new Error("Type should be the expected component and not the action row");
        if (type === 2 && !interaction.isButton()) throw new Error(`Expected interaction of type \`Button\` got type \`${interaction.type}\``);
        if (type === 3 && !interaction.isSelectMenu()) throw new Error(`Expected interaction of type \`SelectMenu\` got type \`${interaction.type}\``);
        if (type === 4 && !(interaction.type === InteractionType.ModalSubmit)) throw new Error(`Expected interaction of type \`Modal\` got type \`${interaction.type}\``);
    }

    public create(callback: (interaction: ParseComponentType<T>) => Awaitable<void>, options?: CollectorOptions): void {
        if (options && options.time === undefined) options.time = 18000;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.collector = this.interaction.channel?.createMessageComponentCollector(options ?? { time: 18000 });

        this.collector?.on("collect", callback);
    }

    public onEnd(...buttonsIds: Array<string>) {
        this.collector?.on("end", (collected) => {
            const vals = Array.from(collected.values())
            for (let i = 0; i < collected.size; i++) {
                if (buttonsIds.includes(vals[i].customId)) {
                    if (vals[i].isButton()) {
                        (vals[i] as ButtonInteraction).component.disabled = true
                    }
                } else continue;
            }
        })
    }
}