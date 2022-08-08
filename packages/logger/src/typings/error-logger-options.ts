export interface ErrorLoggerOptions {
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