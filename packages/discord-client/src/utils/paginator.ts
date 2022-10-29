import { PrettyError } from "@infinite-fansub/logger";
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
            leftArrow: {
                label: "LEFT",
                customId: "leftArrow",
                style: ButtonStyle.Primary
            },
            rightArrow: {
                label: "RIGHT",
                customId: "rightArrow",
                style: ButtonStyle.Primary
            }
        }
    };

    public constructor(embeds: Array<APIEmbed>, options: PaginatorOptions = { max_len: Infinity }) {
        if (!embeds.length) throw new PrettyError("No embeds passed in to the paginator");
        this.#embeds = embeds;
        // casting because typescript is dumb
        if (!options.max_len) this.#options.max_len = <number>options.max_len;
        if (options.arrows?.leftArrow) this.#options.arrows.leftArrow = options.arrows.leftArrow;
        if (options.arrows?.rightArrow) this.#options.arrows.rightArrow = options.arrows.rightArrow;
        this.#options.embedDefaults = { ...this.#options.embedDefaults, ...options.embedDefaults };

    }

    /**
     * Create a paginator
     *
     * @param interaction - The interaction the paginator is created for
     *
     * @returns The embed and buttons that can be passed to <interaction>.reply or .editReply or .followUp
     */
    public create(interaction: ChatInputCommandInteraction): InteractionReplyOptions {
        const collector = new CollectorHelper<ComponentType.Button>(interaction, {
            // Filter inputs so only the user who sent the interaction can use the buttons
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filter: (i: any) => i.user.id === interaction.user.id,
            time: this.#options.time,
            kill: true
        });

        const embeds = this.#buildEmbeds();
        let index = 0;

        collector.create((int) => {
            // Check if the user wants to go back a page
            if (int.customId === "leftArrow") {
                index--;
                // If the user is on the first page, go to the last page
                if (index < 0) index = embeds.length - 1;
                // Check if the user wants to go forward a page
            } else if (int.customId === "rightArrow") {
                index++;
                // If the user is on the last page, go back to the first page
                if (index > embeds.length - 1) index = 0;
            }

            // Update the interaction with the new page
            int.update({ embeds: [embeds[index]] });
        });

        // Starting point sending page 1 and the buttons
        return { embeds: [embeds[index]], components: [this.#buildButtons] };
    }

    /**
     * Generates the embeds for the paginator
     *
     * @returns The embeds for the paginator
     */
    #buildEmbeds(): Array<EmbedBuilder> {
        const newArray: Array<EmbedBuilder> = [];
        // Check for restricted length
        const length = !this.#options.max_len || this.#options.max_len > this.#embeds.length ? this.#embeds.length : this.#options.max_len;
        // Recreation of the `Array.prototype.map` method
        for (let i = 0; i < length; i++) {
            newArray.push(new EmbedBuilder({
                ...this.#options.embedDefaults,
                footer: { text: ` Page ${i + 1}/${length}` },
                ...this.#embeds[i]
            }));
        }

        return newArray;
    }

    /**
     * Generates the buttons for the paginator
     *
     * @returns The buttons for the paginator
     */
    #buildButtons: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>({
        components: [
            new ButtonBuilder(this.#options.arrows.leftArrow),
            new ButtonBuilder(this.#options.arrows.rightArrow)
        ]
    });
}