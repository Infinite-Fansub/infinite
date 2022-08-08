/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/unbound-method */
import { Client } from "discord.js";
import { DirectoryTypes, Event, ICommand, ISlashCommand, IClientOptions } from "./typings/index";
import * as normalHandler from "./utils/normal-handler";
import * as watchHandler from "./utils/watch-handler";

export class BaseClient extends Client {

    public commands: Map<string, ICommand> = new Map();
    public slashCommands: Map<string, ISlashCommand> = new Map();
    public events: Map<string, Event<any>> = new Map();
    public dirs: DirectoryTypes;
    protected loadCommands: () => void;
    protected loadSlashCommands: () => void;
    protected loadEvents: () => void;

    protected constructor(public override options: IClientOptions) {
        super(options);
        this.dirs = options.dirs ?? {};

        if (typeof options.watch === "object") {
            this.loadCommands = options.watch.commands ? watchHandler.loadCommands : normalHandler.loadCommands;
            this.loadSlashCommands = options.watch.slashCommands ? watchHandler.loadSlashCommands : normalHandler.loadSlashCommands;
            this.loadEvents = options.watch.events ? watchHandler.loadEvents : normalHandler.loadEvents;
        } else if (options.watch) {
            this.loadCommands = watchHandler.loadCommands;
            this.loadSlashCommands = watchHandler.loadSlashCommands;
            this.loadEvents = watchHandler.loadEvents;
        } else {
            this.loadCommands = normalHandler.loadCommands;
            this.loadSlashCommands = normalHandler.loadSlashCommands;
            this.loadEvents = normalHandler.loadEvents;
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