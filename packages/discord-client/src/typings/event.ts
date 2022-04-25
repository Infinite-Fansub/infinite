import { IClientEvents } from "./client-events";

export type EventExecute<E extends keyof IClientEvents> = (...args: IClientEvents[E]) => Promise<IClientEvents | void> | void;

export interface Event<E extends keyof IClientEvents> {
    name?: string;
    event: E;
    type: "on" | "once";
    enabled?: boolean;
    run: EventExecute<E>;
}