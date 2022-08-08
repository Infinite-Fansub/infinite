import { AttachOptions } from "./attach-options";

export interface ErrorLoggerOptions extends AttachOptions {
    exit?: {
        beforeExit?: boolean,
        exit?: boolean
    } | boolean;
    promises?: {
        handledPromise?: boolean,
        unhandledPromise?: boolean
    } | boolean;
    exceptions?: {
        monitor?: boolean,
        ignore?: boolean
    };
    warnings?: boolean;
}