import {
    Interaction,
    Message,
    ChannelType,
    SlashCommandBuilder,
    ComponentType,
    RESTPostAPIApplicationCommandsJSONBody,
    Routes,
    REST,
    ChatInputCommandInteraction
} from "discord.js";

import { Client as RedisClient } from "redis-om";
import { IClientOptions, IClientEvents, CollectorOptions, ISlashCommand, ModifyEvents, Module, ExtractName, WithModules } from "./typings";
import { CollectorHelper } from "./utils/collector-helper";
import { BaseClient } from "./base-client";
import { EventConstraint } from "./typings/event-constraint";
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("@infinite-fansub/logger");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface InfiniteClient<O extends IClientOptions = IClientOptions, E extends EventConstraint<E> = IClientEvents> {
    on: ModifyEvents<E>["on"];
    once: ModifyEvents<E>["once"];
    emit: ModifyEvents<E>["emit"];
    off: ModifyEvents<E>["off"];
}

export class InfiniteClient<O extends IClientOptions = IClientOptions, E extends EventConstraint<E> = IClientEvents> extends BaseClient<O> {

    static #djsRest: REST;
    public redis?: RedisClient;
    public prefix: string;

    /**
     * @param options - The options to start the client
     */
    public constructor(public override options: O) {
        super(options);

        if (!this.options.token) throw new Error("No token was specified");

        this.prefix = options.prefix ?? "!";
        this.addDirs({
            commands: this.options.dirs?.commands,
            slashCommands: this.options.dirs?.slashCommands,
            events: this.options.dirs?.events
        });

        this.options.dirs?.events && this.loadEvents();
        if (!this.options.disable?.messageCommands)
            this.options.dirs?.commands && this.loadCommands();
        if (!this.options.disable?.interactions)
            this.options.dirs?.slashCommands && this.loadSlashCommands();

        this.buildDb();

        this.login(this.options.token).then(async () => {

            if (!this.options.disable?.interactions)
                await this.registerGlobalCommands();
            await this.registerGuildCommands();

        });

        InfiniteClient.#djsRest = new REST().setToken(this.options.token);

        if (!this.options.disable?.interactions)
            this.on("interactionCreate", async (interaction) => await this.onInteraction(interaction));

        if (!this.options.disable?.messageCommands)
            this.on("messageCreate", async (message) => await this.onMessage(message));

        if (!this.options.disable?.registerOnJoin)
            this.on("guildCreate", async (guild) => await this.registerGuildCommands(guild.id));
    }

    public withModules<T extends Array<Module>>(modules: ExtractName<T>): this & WithModules<T> {
        modules.forEach((module) => {
            //@ts-expect-error shenanigans
            this[module.name] = new module.ctor(this);
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/keyword-spacing, @typescript-eslint/no-explicit-any
        return <any>this;
    }

    /**
     * Handle slash commands
     * @param interaction - The interaction received from the `interactionCreate` event
     * @returns
     */
    private async onInteraction(interaction: Interaction): Promise<void> {
        //@ts-expect-error I don't want to be bothered with massive if chain;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const command = this.slashCommands.get(interaction.commandName);
        if (!command) return;

        if (interaction.isAutocomplete()) {
            try {
                await command.autocomplete?.(interaction, this);
            } catch (err) {
                console.log(err);
            }
        }

        if (interaction.isChatInputCommand()) {
            try {
                if (command.enabled ?? true) {
                    //@ts-expect-error ANTI JS
                    if (command.execute && command.run) throw new Error("`<command>.run` and <command>.execute can not be used together in the same command");
                    if ("execute" in command) {
                        await command.execute(interaction, this);
                    } else if ("run" in command) {
                        await command.run(interaction, this);
                    }
                } else interaction.reply("Command Disabled");
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     * Handle text based commands
     * @param message - The message received from the `messageCreate` event
     * @returns
     */
    private async onMessage(message: Message): Promise<void> {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;
        if (message.content.startsWith(this.prefix)) {
            const args = message.content.slice(this.prefix.length).trim().split(/\s+/g);
            const cmd = args.shift()?.toLowerCase();
            if (!cmd) return console.log(`CMD is not a string\nCMD:\n${cmd}`);

            if (!this.commands.has(cmd)) return;
            const command = this.commands.get(cmd);
            if (!command) return;
            try {
                if (command.enabled ?? true) await command.execute({ message, args, command: cmd, client: this });
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     * Register global commands
     * @returns
     */
    private async registerGlobalCommands(): Promise<void> {
        if (!this.slashCommands.size) return;

        const json = [...this.slashCommands.values()].filter((command) => command.post === "GLOBAL")
            .map((command) => command.data instanceof SlashCommandBuilder ? command.data.toJSON() : <RESTPostAPIApplicationCommandsJSONBody>command.data);

        if (json.length) {
            await InfiniteClient.#djsRest.put(Routes.applicationCommands(this.user.id), { body: json })
                //@ts-expect-error The type exists but because its dynamic ts is having problems
                .then(() => this.emit("loadedSlash", json, "Global", this));
        }
    }

    /**
     * Register slash commands for the specified guild
     * @param id - The guild ID to register commands for (optional)
     * @returns
     */
    private async registerGuildCommands(id?: string): Promise<void> {
        if (!this.slashCommands.size) return;

        const allSlashCommands = [...this.slashCommands.values()];

        const guildCommands = (guildId: string): Array<ISlashCommand> => allSlashCommands.filter((command) => command.post === undefined
            || command.post === "ALL"
            || command.post === guildId
            || Array.isArray(command.post) && command.post.includes(guildId));

        if (id) {
            const guildJson = guildCommands(id).map((command) => command.data instanceof SlashCommandBuilder ? command.data.toJSON() : <RESTPostAPIApplicationCommandsJSONBody>command.data);

            if (guildCommands.length) {
                InfiniteClient.#djsRest.put(Routes.applicationGuildCommands(this.user.id, id), { body: guildJson })
                    //@ts-expect-error The type exists but because its dynamic ts is having problems
                    .then(() => this.emit("loadedSlash", guildJson, id, this));
            }
        } else
            (await this.guilds.fetch()).forEach((_, gId) => {
                const guildJson = guildCommands(gId).map((command) => command.data instanceof SlashCommandBuilder ? command.data.toJSON() : <RESTPostAPIApplicationCommandsJSONBody>command.data);

                if (guildCommands.length) {
                    InfiniteClient.#djsRest.put(Routes.applicationGuildCommands(this.user.id, gId), { body: guildJson })
                        //@ts-expect-error The type exists but because its dynamic ts is having problems
                        .then(() => this.emit("loadedSlash", guildJson, gId, this));
                }
            });
    }

    /**
     * Initiates the chosen database
     * @returns
     */
    private async buildDb(): Promise<void> {
        if (this.options.database === undefined) {
            if (this.options.disable?.warnings) return;
            return console.error("Some options might not work without a database");
        }

        const type = typeof this.options.database === "object" ? this.options.database.type : this.options.database;

        switch (type) {
            case "mongo":
                // await this.mongoHandler()
                break;
            case "redis":
                await this.createRedisClient();
                break;
            case "json":
                // this.jsonHandler()
                break;
            default:
                break;
            // this.jsonHandler()
        }
    }

    /**
     * Responsible for creating and handling the redis client
     * @returns
     */
    private async createRedisClient(): Promise<void> {
        if (!(typeof this.options.database === "object" && this.options.database.type === "redis")) return;
        let url = "redis://localhost:6379";
        if (typeof this.options.database.path === "object") {
            const { username, password, entrypoint, port } = this.options.database.path;
            if (!entrypoint || typeof entrypoint !== "string") throw new Error("No entrypoint defined");
            url = `redis://${username && password ? `${username}:${password}@` : ""}${(/:\d$/).exec(entrypoint) ? entrypoint : `${entrypoint}:${port ?? 6379}`}`;
        } else {
            url = this.options.database.path ?? "redis://localhost:6379";
        }
        const client = new RedisClient();
        this.redis = client;
        //@ts-expect-error The type exists but because its dynamic ts is having problems
        await client.connect(url).then(() => this.emit("databaseOpen", this, client));
    }

    /**
     * Helper function to create a collector instance
     * @param interaction - The interaction received from a command execution
     * @param options - The options passed to the collector constructor
     * @returns A CollectorHelper instance
     */
    public collector<T extends Exclude<ComponentType, "ActionRow">>(interaction: ChatInputCommandInteraction, options: CollectorOptions = { time: 18000 }): CollectorHelper<T> {
        return new CollectorHelper(interaction, options);
    }
}