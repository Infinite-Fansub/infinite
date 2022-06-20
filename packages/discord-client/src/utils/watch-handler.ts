/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires*/
import { BaseClient } from "src/base-client";
import { Handler, Event, ICommand, ISlashCommand, IClientEvents, FileCache } from "src/typings";
import recursiveRead from "./recursive-read";
import { watchFile } from "fs";

export class WatchHandler implements Handler {
    // eslint-disable-next-line @typescript-eslint/space-infix-ops
    private cache: FileCache = {};

    public constructor(private readonly client: BaseClient) { }

    public loadCommands(): void {
        if (!this.client.dirs.commands) return;
        recursiveRead(this.client.dirs.commands)
            .forEach((path) => {
                watchFile(path, { interval: 500 }, () => {
                    if (Date.now() - this.cache[path]?.date < 3000) return;
                    this.cache[path] = { path: path, date: Date.now() };
                    delete require.cache[path];
                    const command: ICommand = require(path).default;
                    this.client.commands.set(command.name, command);
                });
            });
    }

    public loadSlashCommands(): void {
        if (!this.client.dirs.slashCommands) return;
        recursiveRead(this.client.dirs.slashCommands)
            .forEach((path) => {
                watchFile(path, { interval: 500 }, () => {
                    if (Date.now() - this.cache[path]?.date < 3000) return;
                    this.cache[path] = { path: path, date: Date.now() };
                    delete require.cache[path];
                    const command: ISlashCommand = require(path).default;
                    this.client.slashCommands.set(command.data.name, command);
                });
            });
    }

    public loadEvents(): void {
        if (!this.client.dirs.events) return;
        recursiveRead(this.client.dirs.events)
            .forEach((path) => {
                watchFile(path, { interval: 500 }, () => {
                    if (Date.now() - this.cache[path]?.date < 3000) return;
                    this.cache[path] = { path: path, date: Date.now() };
                    delete require.cache[path];
                    const event: Event<any> = require(path).default;
                    this.client.events.set(event.event, event);
                    this.client[event.type](event.event, (...args: Array<IClientEvents>) => {
                        if (event.enabled ?? true) event.run(...args);
                    });
                });
            });
    }
}