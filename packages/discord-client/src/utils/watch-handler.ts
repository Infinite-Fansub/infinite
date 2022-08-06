/* eslint-disable
@typescript-eslint/no-explicit-any,
@typescript-eslint/no-unsafe-argument,
@typescript-eslint/no-require-imports,
@typescript-eslint/no-var-requires,
@typescript-eslint/require-await,
@typescript-eslint/no-unnecessary-condition,
@typescript-eslint/strict-boolean-expressions
*/

import { Event, ICommand, ISlashCommand, IClientEvents, FileCache } from "../typings";
import recursiveRead from "./recursive-read";
import { watchFile } from "fs";
import { BaseClient } from "../base-client";

export async function loadCommands(this: BaseClient & { cache: FileCache }): Promise<void> {
    if (!this.dirs.commands) return;
    if (!this.cache) this.cache = {};
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

export async function loadSlashCommands(this: BaseClient & { cache: FileCache }): Promise<void> {
    if (!this.dirs.slashCommands) return;
    if (!this.cache) this.cache = {};
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

export async function loadEvents(this: BaseClient & { cache: FileCache }): Promise<void> {
    if (!this.dirs.events) return;
    if (!this.cache) this.cache = {};
    recursiveRead(this.dirs.events)
        .forEach((path) => {
            watchFile(path, { interval: 500 }, () => {
                if (Date.now() - this.cache[path]?.date < 3000) return;
                this.cache[path] = { path: path, date: Date.now() };
                delete require.cache[path];
                const event: Event<any> = require(path).default;
                this.events.set(event.event, event);
                this[event.type](event.event, (...args: Array<IClientEvents>) => {
                    if (event.enabled ?? true) event.run(...args);
                });
            });
        });
}