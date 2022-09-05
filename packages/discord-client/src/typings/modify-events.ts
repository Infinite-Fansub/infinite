import { Awaitable } from "discord.js";
import { EventConstraint } from "./event-constraint";

export interface ModifyEvents<T extends EventConstraint<T>> {
    on: (<K extends keyof T>(event: K, listener: (...args: T[K]) => Awaitable<void>) => this) & (<S extends string | symbol>(
        event: Exclude<S, keyof T>,
        listener: (...args: Array<unknown>) => Awaitable<void>,
    ) => this);

    once: (<K extends keyof T>(event: K, listener: (...args: T[K]) => Awaitable<void>) => this) & (<S extends string | symbol>(
        event: Exclude<S, keyof T>,
        listener: (...args: Array<unknown>) => Awaitable<void>,
    ) => this);

    emit: (<K extends keyof T>(event: K, ...args: T[K]) => boolean) & (<S extends string | symbol>(event: Exclude<S, keyof T>, ...args: Array<unknown>) => boolean);

    off: (<K extends keyof T>(event: K, listener: (...args: T[K]) => Awaitable<void>) => this) & (<S extends string | symbol>(
        event: Exclude<S, keyof T>,
        listener: (...args: Array<unknown>) => Awaitable<void>,
    ) => this);
}