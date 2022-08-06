/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/require-await */
import { Event, ICommand, ISlashCommand, IClientEvents } from "../typings";
import recursiveRead from "./recursive-read";
import { BaseClient } from "../base-client";

export async function loadCommands(this: BaseClient): Promise<void> {
    if (!this.dirs.commands) return;
    recursiveRead(this.dirs.commands)
        .forEach(async (path) => {
            const command: ICommand = (await import(path)).default;
            this.commands.set(command.name, command);
        });
}

export async function loadSlashCommands(this: BaseClient): Promise<void> {
    if (!this.dirs.slashCommands) return;
    recursiveRead(this.dirs.slashCommands)
        .forEach(async (path) => {
            const command: ISlashCommand = (await import(path)).default;
            this.slashCommands.set(command.data.name, command);
        });
}

export async function loadEvents(this: BaseClient): Promise<void> {
    if (!this.dirs.events) return;
    recursiveRead(this.dirs.events)
        .forEach(async (path) => {
            const event: Event<any> = (await import(path)).default;
            this.events.set(event.event, event);
            this[event.type](event.event, (...args: Array<IClientEvents>) => {
                if (event.enabled ?? true) event.run(...args);
            });
        });
}