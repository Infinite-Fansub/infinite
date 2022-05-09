import { Interaction, Message, ChannelType, Awaitable, InteractionCollector, MessageComponentInteraction, MessageChannelComponentCollectorOptions, ChatInputCommandInteraction } from "discord.js";
import { ComponentType, Routes } from "discord-api-types/v10";
import { REST } from "@discordjs/rest";
import { Client, Entity, Repository, Schema } from "redis-om";
import { IClientOptions, IClientEvents } from "./typings";
import { BaseClient } from "./base-client";
import { Model } from "./utils/model";

// Stolen from discord.js
export interface InfiniteClient {
    on: (<K extends keyof IClientEvents>(event: K, listener: (...args: IClientEvents[K]) => Awaitable<void>) => this) & (<S extends string | symbol>(
        event: Exclude<S, keyof IClientEvents>,
        listener: (...args: Array<unknown>) => Awaitable<void>,
    ) => this);

    once: (<K extends keyof IClientEvents>(event: K, listener: (...args: IClientEvents[K]) => Awaitable<void>) => this) & (<S extends string | symbol>(
        event: Exclude<S, keyof IClientEvents>,
        listener: (...args: Array<unknown>) => Awaitable<void>,
    ) => this);

    emit: (<K extends keyof IClientEvents>(event: K, ...args: IClientEvents[K]) => boolean) & (<S extends string | symbol>(event: Exclude<S, keyof IClientEvents>, ...args: Array<unknown>) => boolean);

    off: (<K extends keyof IClientEvents>(event: K, listener: (...args: IClientEvents[K]) => Awaitable<void>) => this) & (<S extends string | symbol>(
        event: Exclude<S, keyof IClientEvents>,
        listener: (...args: Array<unknown>) => Awaitable<void>,
    ) => this);
}

export class InfiniteClient extends BaseClient {

    declare public static options: IClientOptions;
    private static djsRest: REST;
    private static _redis?: Client;
    public models: Map<string, Repository<Entity>> = new Map();
    public prefix: string;

    public constructor(options: IClientOptions) {
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

        this.login(this.options.token).then(async () => {

            if (!this.options.disable?.interactions)
                await this.registerSlashCommands();

            await this.buildDb();
        });

        InfiniteClient.djsRest = new REST().setToken(this.options.token);

        if (!this.options.disable?.interactions)
            this.on("interactionCreate", async (interaction) => await this.onInteraction(interaction));

        if (!this.options.disable?.messageCommands)
            this.on("messageCreate", async (message) => await this.onMessage(message));
    }

    private async onInteraction(interaction: Interaction): Promise<void> {
        if (!interaction.isChatInputCommand()) return;

        const command = this.slashCommands.get(interaction.commandName);

        if (!command) return;
        try {
            if (command.enabled ?? true) await command.execute(interaction, this);
            else interaction.reply("Command Disabled");
        } catch (err) {
            console.error(err);
        }

    }

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

    private async registerSlashCommands(): Promise<void> {
        if (!this.slashCommands.size) return;

        const allSlashCommands = [...this.slashCommands.values()];

        const globalCommands = allSlashCommands.filter((command) => command.post === "GLOBAL");
        const globalJson = globalCommands.map((command) => command.data.toJSON());

        if (globalCommands.length) {
            await InfiniteClient.djsRest.put(Routes.applicationCommands(this.user?.id ?? ""), { body: globalJson })
                .then(() => this.emit("loadedSlash", globalJson, "Global", this));
        }

        (await this.guilds.fetch()).forEach(async (_, guildId) => {
            const guildCommands = allSlashCommands.filter((command) => command.post === "ALL" || command.post === guildId || Array.isArray(command.post) && command.post.includes(guildId));
            const guildJson = guildCommands.map((command) => command.data.toJSON());

            if (guildCommands.length) {
                await InfiniteClient.djsRest.put(Routes.applicationGuildCommands(this.user?.id ?? "", guildId), { body: guildJson })
                    .then(() => this.emit("loadedSlash", guildJson, guildId, this));
            }
        });
    }

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

    private async createRedisClient(): Promise<void> {
        if (!(typeof this.options.database === "object" && this.options.database.type === "redis")) return;
        let url = "redis://localhost:6379";
        if (typeof this.options.database.path === "object") {
            const { username, password, entrypoint, port } = this.options.database.path;
            url = `${username}:${password}@${(/:\d$/).exec(entrypoint) ? entrypoint : `${entrypoint}:${port}`}`;
        } else {
            url = this.options.database.path ?? "redis://localhost:6379";
        }
        const client = new Client();
        InfiniteClient._redis = client;
        await client.open(url).then(() => this.emit("databaseOpen", this, client));
    }

    public createCollector(
        interaction: ChatInputCommandInteraction,
        callback: (interaction: MessageComponentInteraction) => Awaitable<void>,
        options?: { componentType?: ComponentType.ActionRow | undefined } & MessageChannelComponentCollectorOptions<MessageComponentInteraction<"cached">>,
        disable: boolean = true
    ): InteractionCollector<MessageComponentInteraction> | undefined {
        //? Time defaults to 30sec
        if (options && options.time === undefined) options.time = 18000;
        const collector = interaction.channel?.createMessageComponentCollector(options ?? { time: 18000 });
        collector?.on("collect", callback);

        //! Actually disable instead of delete
        if (disable) collector?.on("end", () => {
            interaction.editReply({ components: [] });
        });

        return collector;
    }

    public async model<TEntity extends Entity>(name: string, schema?: Schema<TEntity>): Promise<Repository<TEntity>> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.models.has(name)) return this.models.get(name)! as Repository<TEntity>;

        if (!schema) throw new Error("You have to pass a schema if it doesnt exist");
        const model = await new Model(schema, this.redis).buildModel();
        this.models.set(name, model);
        return model;
    }

    public get redis(): Client {
        if (!InfiniteClient._redis) throw new Error("You are not using redis as your database or something went wrong");
        return InfiniteClient._redis;
    }
}