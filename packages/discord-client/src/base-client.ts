/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/unbound-method */
import { Client, ClientOptions } from "discord.js";
import { Event, ICommand, ISlashCommand, IClientOptions, DirectoryTypes, IClientEvents } from "./typings";
import { recursiveRead } from "./utils/recursive-read";

export interface BaseClient {
    options: any;
    on: any;
    once: any;
    emit: any;
    off: any;
}

export class BaseClient<DO extends ClientOptions = ClientOptions, O extends IClientOptions = IClientOptions> extends Client<true> {

    public commands = new Map<string, ICommand>();
    public slashCommands = new Map<string, ISlashCommand>();
    public events = new Map<string, Event<any>>();
    public dirs: DirectoryTypes;

    protected constructor(djsOptions: DO, options: O) {
        super(djsOptions);

        this.dirs = options.dirs ?? {};
    }

    /**
     * Load message commands
     * @returns
     */
    public async loadCommands(this: BaseClient): Promise<void> {
        if (!this.dirs.commands) return;
        const paths = recursiveRead(this.dirs.commands);

        for (let i = 0; i < paths.length; i++) {
            const command: ICommand = (await import(paths[i])).default;
            this.commands.set(command.name, command);
        }
    }

    /**
     * Load slash commands
     * @returns
     */
    public async loadSlashCommands(this: BaseClient): Promise<void> {
        if (!this.dirs.slashCommands) return;
        const paths = recursiveRead(this.dirs.slashCommands);

        for (let i = 0; i < paths.length; i++) {
            const command: ISlashCommand = (await import(paths[i])).default;
            this.slashCommands.set(command.data.name, command);
        }
    }

    /**
     * Load events
     * @returns
     */
    public async loadEvents(this: BaseClient): Promise<void> {
        if (!this.dirs.events) return;
        const paths = recursiveRead(this.dirs.events);

        for (let i = 0; i < paths.length; i++) {
            const event: Event<any> = (await import(paths[i])).default;
            this.events.set(<string>event.event, event);
            this[event.type](event.event, (...args: Array<IClientEvents>) => {
                if (event.enabled ?? true) event.run(...args);
            });
        }
    }

    /**
     * @param dirs - The directories that contain the specific files
     */
    public addDirs(dirs: DirectoryTypes): void {
        this.dirs.commands = dirs.commands;
        this.dirs.slashCommands = dirs.slashCommands;
        this.dirs.events = dirs.events;
    }

    /**
     * Add the text commands
     *
     * @param path - The path of the folder the text commands are in
     */
    public addCommands(path: string): void {
        this.addDirs({ commands: path });
        this.loadCommands();
    }

    /**
     * Add the slash commands
     *
     * @param path - The path of the folder the slash commands are in
     */
    public addSlashCommands(path: string): void {
        this.addDirs({ slashCommands: path });
        this.loadSlashCommands();
    }

    /**
     * Add the events
     *
     * @param path - The path of the folder the events are in
     */
    public addEvents(path: string): void {
        this.addDirs({ events: path });
        this.loadEvents();
    }
}