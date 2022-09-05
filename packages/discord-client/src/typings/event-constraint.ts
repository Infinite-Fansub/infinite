import { IClientEvents } from "./client-events";

export type EventConstraint<T> = Record<keyof T, Array<unknown>> & IClientEvents;