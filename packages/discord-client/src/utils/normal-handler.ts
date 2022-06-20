/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import { BaseClient } from "src/base-client";
import { Handler, Event, ICommand, ISlashCommand, IClientEvents } from "src/typings";
import recursiveRead from "./recursive-read";

export class NormalHandler implements Handler {
    protected commands: Map<string, ICommand> = new Map();
    protected slashCommands: Map<string, ISlashCommand> = new Map();
    protected events: Map<string, Event<any>> = new Map();

    public constructor(private readonly client: BaseClient) { }

    public loadCommands(): void {
        if (!this.client.dirs.commands) return;
        recursiveRead(this.client.dirs.commands)
            .forEach(async (path) => {
                const command: ICommand = (await import(path)).default;
                this.commands.set(command.name, command);
            });
    }

    public loadSlashCommands(): void {
        if (!this.client.dirs.slashCommands) return;
        recursiveRead(this.client.dirs.slashCommands)
            .forEach(async (path) => {
                const command: ISlashCommand = (await import(path)).default;
                this.slashCommands.set(command.data.name, command);
            });
    }

    public loadEvents(): void {
        if (!this.client.dirs.events) return;
        recursiveRead(this.client.dirs.events)
            .forEach(async (path) => {
                const event: Event<any> = (await import(path)).default;
                this.client.events.set(event.event, event);
                this.client[event.type](event.event, (...args: Array<IClientEvents>) => {
                    if (event.enabled ?? true) event.run(...args);
                });
            });
    }
}