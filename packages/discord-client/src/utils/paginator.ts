import { ErrorLogger } from "@infinite-fansub/logger/dist";
import { ActionRowBuilder, APIEmbed, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionReplyOptions } from "discord.js";
import { PaginatorOptions } from "../typings";
import { CollectorHelper } from "./collector-helper";

export class Paginator {

    readonly #embeds: Array<APIEmbed>;
    #options: Required<PaginatorOptions> = {
        max_len: Infinity,
        time: 60000,
        embedDefaults: {
            title: "PAGINATOR",
            description: "Embed generated with the paginator",
            timestamp: new Date(Date.now()).toISOString(),
            color: 0xFF00EF,
            author: { name: "InfiniteClient" }
        },
        arrows: {
            leftArrow: "LEFT",
            rightArrow: "RIGHT"
        }
    };

    public constructor(embeds: Array<APIEmbed>, options: PaginatorOptions = { max_len: Infinity }) {
        if (!embeds.length) throw new ErrorLogger("No embeds passed in to the paginator");
        this.#embeds = embeds;
        // casting because typescript is dumb
        if (!options.max_len) this.#options.max_len = <number>options.max_len;
        if (options.arrows?.leftArrow) this.#options.arrows.leftArrow = options.arrows.leftArrow;
        if (options.arrows?.rightArrow) this.#options.arrows.rightArrow = options.arrows.rightArrow;
        this.#options.embedDefaults = { ...this.#options.embedDefaults, ...options.embedDefaults };

    }

    public create(interaction: ChatInputCommandInteraction): InteractionReplyOptions {
        const collector = new CollectorHelper(ComponentType.Button, interaction, {
            filter: (i) => i.user.id === interaction.user.id,
            time: this.#options.time,
            kill: true
        });

        const embeds = this.#buildEmbeds();
        let index = 0;

        collector.create((int) => {
            if (int.customId === "leftArrow") {
                index--;
                if (index < 0) index = embeds.length - 1;
            } else if (int.customId === "rightArrow") {
                index++;
                if (index > embeds.length - 1) index = 0;
            }

            int.update({ embeds: [embeds[index]] });
        });

        return { embeds: [embeds[index]], components: [this.#buildButtons] };
    }

    #buildEmbeds(): Array<EmbedBuilder> {
        // this.#embeds.map((embedData) => new EmbedBuilder({ ...this.#options.embedDefaults, ...embedData }));
        const newArray: Array<EmbedBuilder> = [];
        const length = !this.#options.max_len || this.#options.max_len > this.#embeds.length ? this.#embeds.length : this.#options.max_len;
        for (let i = 0; i < length; i++) {
            newArray.push(new EmbedBuilder({ ...this.#options.embedDefaults, footer: { text: ` Page ${i + 1}/${length}` }, ...this.#embeds[i] }));
        }
        return newArray;
    }

    #buildButtons: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>({
        components: [
            new ButtonBuilder({
                label: this.#options.arrows.leftArrow,
                custom_id: "leftArrow",
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                label: this.#options.arrows.rightArrow,
                custom_id: "rightArrow",
                style: ButtonStyle.Primary
            })
        ]
    });
}