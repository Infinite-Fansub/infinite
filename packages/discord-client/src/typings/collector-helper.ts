import { ButtonInteraction, ComponentType, MessageChannelCollectorOptionsParams, MessageComponentType, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";

// eslint-disable-next-line max-len
export type ParseComponentType<T extends Exclude<ComponentType, "ActionRow">> = T extends ComponentType.Button ? ButtonInteraction : T extends ComponentType.SelectMenu ? SelectMenuInteraction : T extends ComponentType.TextInput ? ModalSubmitInteraction : never;

export type CollectorOptions = MessageChannelCollectorOptionsParams<MessageComponentType, true> & { disable?: boolean };