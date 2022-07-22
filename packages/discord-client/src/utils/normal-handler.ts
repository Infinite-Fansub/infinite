/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import { Handler, Event, ICommand, ISlashCommand, IClientEvents, DirectoryTypes } from "../typings";
import recursiveRead from "./recursive-read";

export class NormalHandler implements Handler {
    private readonly dirs!: DirectoryTypes;
    private commands: Map<string, ICommand> = new Map();
    private slashCommands: Map<string, ISlashCommand> = new Map();
    private events: Map<string, Event<any>> = new Map();

    public loadCommands(): void {
        if (!this.dirs.commands) return;
        recursiveRead(this.dirs.commands)
            .forEach(async (path) => {
                const command: ICommand = (await import(path)).default;
                this.commands.set(command.name, command);
            });
    }

    public loadSlashCommands(): void {
        if (!this.dirs.slashCommands) return;
        recursiveRead(this.dirs.slashCommands)
            .forEach(async (path) => {
                const command: ISlashCommand = (await import(path)).default;
                this.slashCommands.set(command.data.name, command);
            });
    }

    public loadEvents(): void {
        if (!this.dirs.events) return;
        recursiveRead(this.dirs.events)
            .forEach(async (path) => {
                const event: Event<any> = (await import(path)).default;
                this.events.set(event.event, event);
                //@ts-expect-error I can't be bothered to hard type this
                this[event.type](event.event, (...args: Array<IClientEvents>) => {
                    if (event.enabled ?? true) event.run(...args);
                });
            });
    }
}