import { ButtonInteraction, ComponentType, MessageChannelComponentCollectorOptions, MessageComponentInteraction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";

// eslint-disable-next-line max-len
export type ParseComponentType<T extends Exclude<ComponentType, "ActionRow">> = T extends ComponentType.Button ? ButtonInteraction : T extends ComponentType.SelectMenu ? SelectMenuInteraction : T extends ComponentType.TextInput ? ModalSubmitInteraction : never;

export type CollectorOptions = { componentType?: ComponentType.ActionRow | undefined, disable: boolean } & MessageChannelComponentCollectorOptions<MessageComponentInteraction<"cached">>;