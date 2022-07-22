/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires*/
import { Handler, Event, ICommand, ISlashCommand, IClientEvents, FileCache, DirectoryTypes } from "src/typings";
import recursiveRead from "./recursive-read";
import { watchFile } from "fs";

export class WatchHandler implements Handler {
    // eslint-disable-next-line @typescript-eslint/space-infix-ops
    private cache: FileCache = {};
    private readonly dirs!: DirectoryTypes;
    private commands: Map<string, ICommand> = new Map();
    private slashCommands: Map<string, ISlashCommand> = new Map();
    private events: Map<string, Event<any>> = new Map();

    public loadCommands(): void {
        if (!this.dirs.commands) return;
        recursiveRead(this.dirs.commands)
            .forEach((path) => {
                watchFile(path, { interval: 500 }, () => {
                    if (Date.now() - this.cache[path]?.date < 3000) return;
                    this.cache[path] = { path: path, date: Date.now() };
                    delete require.cache[path];
                    const command: ICommand = require(path).default;
                    this.commands.set(command.name, command);
                });
            });
    }

    public loadSlashCommands(): void {
        if (!this.dirs.slashCommands) return;
        recursiveRead(this.dirs.slashCommands)
            .forEach((path) => {
                watchFile(path, { interval: 500 }, () => {
                    if (Date.now() - this.cache[path]?.date < 3000) return;
                    this.cache[path] = { path: path, date: Date.now() };
                    delete require.cache[path];
                    const command: ISlashCommand = require(path).default;
                    this.slashCommands.set(command.data.name, command);
                });
            });
    }

    public loadEvents(): void {
        if (!this.dirs.events) return;
        recursiveRead(this.dirs.events)
            .forEach((path) => {
                watchFile(path, { interval: 500 }, () => {
                    if (Date.now() - this.cache[path]?.date < 3000) return;
                    this.cache[path] = { path: path, date: Date.now() };
                    delete require.cache[path];
                    const event: Event<any> = require(path).default;
                    this.events.set(event.event, event);
                    //@ts-expect-error I can't be bothered to hard type this
                    this[event.type](event.event, (...args: Array<IClientEvents>) => {
                        if (event.enabled ?? true) event.run(...args);
                    });
                });
            });
    }
}