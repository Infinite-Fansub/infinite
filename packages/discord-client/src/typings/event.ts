import { Awaitable } from "discord.js";
import { IClientEvents } from "./client-events";
import { EventConstraint } from "./event-constraint";

export type EventExecute<E extends keyof T, T extends EventConstraint<T>> = (...args: T[E]) => Awaitable<unknown>;

export interface Event<E extends keyof T, T extends EventConstraint<T> = IClientEvents> {
    name?: string;
    event: E;
    type: "on" | "once";
    enabled?: boolean;
    run: EventExecute<E, T>;
}