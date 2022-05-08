/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "discord.js";
import { DirectoryTypes, Event, ICommand, ISlashCommand, IClientEvents, IClientOptions } from "./typings/index";
import recursiveRead from "./utils/recursive-read";

export class BaseClient extends Client {

    protected commands: Map<string, ICommand> = new Map();
    protected slashCommands: Map<string, ISlashCommand> = new Map();
    protected events: Map<string, Event<any>> = new Map();
    private dirs: DirectoryTypes;

    protected constructor(public override options: IClientOptions) {
        super(options);
        this.dirs = options.dirs ?? {};
    }

    public addDirs(dirs: DirectoryTypes): void {
        this.dirs.commands = dirs.commands;
        this.dirs.slashCommands = dirs.slashCommands;
        this.dirs.events = dirs.events;
    }

    protected loadCommands(): void {
        if (!this.dirs.commands) return;
        recursiveRead(this.dirs.commands)
            .forEach(async (path) => {
                const command: ICommand = (await import(path)).default;
                this.commands.set(command.name, command);
            });
    }

    protected loadSlashCommands(): void {
        if (!this.dirs.slashCommands) return;
        recursiveRead(this.dirs.slashCommands)
            .forEach(async (path) => {
                const command: ISlashCommand = (await import(path)).default;
                this.slashCommands.set(command.data.name, command);
            });
    }

    protected loadEvents(): void {
        if (!this.dirs.events) return;
        recursiveRead(this.dirs.events)
            .forEach(async (path) => {
                const event: Event<any> = (await import(path)).default;
                this.events.set(<string>event.event, event);
                this[event.type](<string>event.event, (...args: Array<IClientEvents>) => {
                    if (event.enabled ?? true) event.run(...args);
                });
            });
    }

    public addCommands(path: string): void {
        this.addDirs({ commands: path });
        this.loadCommands();
    }

    public addSlashCommands(path: string): void {
        this.addDirs({ slashCommands: path });
        this.loadSlashCommands();
    }

    public addEvents(path: string): void {
        this.addDirs({ events: path });
        this.loadEvents();
    }
}