import { inspect } from "node:util";
import { ErrorLoggerOptions } from "./typings";
import { Logger } from "./logger";
import { Color, colorConsole } from "colours.js/dst";

export class ErrorLogger {

    #logger = new Logger({ showMemory: false, emojis: { emoji: "⚠️" }, colors: { color: Color.fromHex("#FF6200") } });

    public constructor(options: ErrorLoggerOptions = {
        exit: { exit: true },
        exceptions: { monitor: true },
        warnings: true
    }) {
        if (options.exit === true) {
            this.attachBeforeExit();
            this.attachExit();
        } else if (typeof options.exit === "object") {
            options.exit.beforeExit && this.attachBeforeExit();
            options.exit.exit && this.attachExit();
        }

        if (options.promises === true) {
            this.attachRejectionHandled();
            this.attachUnhandledRejection();
        } else if (typeof options.promises === "object") {
            options.promises.handledPromise && this.attachRejectionHandled();
            options.promises.unhandledPromise && this.attachUnhandledRejection();
        }

        if (options.exceptions === true) {
            this.attachUncaughtException();
        } else if (typeof options.exceptions === "object") {
            if (options.exceptions.ignore && options.exceptions.monitor) this.attachUncaughtException();
            else {
                options.exceptions.ignore && this.attachUncaughtException();
                options.exceptions.monitor && this.attachUncaughtExceptionMonitor();
            }
        }

        options.warnings && this.attachWarning();
    }

    /**
     * Listen to the Exit event and exit with the given code
     *
     * @param callback - The callback for the Exit listener
     */
    public attachExit(callback: NodeJS.ExitListener = (code) => {
        this.#logger.printf(`Exited with code: ${code}`, Color.RED);
    }): void {

        /**
         * @param code - process.exitCode (integer)
         */
        process.on("exit", callback);
    }

    /**
     * Listen to the BeforeExit event and exit with the given code
     *
     * @param callback - The callback for the BeforeExit listener
     */
    public attachBeforeExit(callback: NodeJS.BeforeExitListener = (code) => {
        this.#logger.log(`Exiting with code: ${code}`);
    }): void {

        /**
         * @param code - process.exitCode (integer)
         */
        process.on("beforeExit", callback);
    }

    /**
     * `rejectionHandled` is emitted when a promise is rejected but has a handler like `.catch` attached
     * Is broken, during tests we couldn't get the event to fire
     *
     * @param callback - The callback for the rejectionhandler
     *
     * @alpha
     */
    public attachRejectionHandled(callback: NodeJS.RejectionHandledListener = (promise) => {
        console.log(`A promise was sucessefully catched:\n${inspect(promise, false, null, true)}`);
    }): void {

        /**
         * @param promise - The promise that was sucessefully catched
         */
        process.on("rejectionHandled", callback);
    }

    /**
    * `unhandledRejection` is emitted when a promise is rejected and does not have a handler.
    *
    * @param callback - The callback for the unhandled rejection
    */
    public attachUnhandledRejection(callback: NodeJS.UnhandledRejectionListener = (reason, promise) => {
        this.#logger.error("A rejection was not handled.");
        this.#logger.print(`${this.#logger.date()} ▶️ ${colorConsole.uniform("Reason:", Color.RED)} ${inspect(reason, false, null, true)}`);
        this.#logger.print(`${this.#logger.date()} ▶️ ${colorConsole.uniform("Promise:", Color.RED)} ${inspect(promise, false, null, true)}`);
    }): void {

        /**
         * @param reason - The rejection reason, can be an error
         * @param promise - The promise that was not handled
         */
        process.on("unhandledRejection", callback);
    }

    /**
     * Prevents the app from crashing by catching all it errors
     *
     * @param callback - The callback for the unhandled exception listener
     *
     * @see [Warning: Using 'uncaughtException' correctly](https://nodejs.org/api/process.html#warning-using-uncaughtexception-correctly)
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public attachUncaughtException(callback: NodeJS.UncaughtExceptionListener = (error, _origin) => {
        this.#logger.error("New error caught:");
        this.#logger.error(error.stack ?? "");
    }): void {

        /**
         * @param error - The uncaught error
         * @param origin - Where the error originated
         */
        process.on("uncaughtException", callback);
    }

    /**
     * Recomended over {@link ErrorLogger.attachUncaughtException}
     *
     * @param callback - The callback for the uncaught exception listener
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public attachUncaughtExceptionMonitor(callback: NodeJS.UncaughtExceptionListener = (error, _origin) => {
        this.#logger.error("EXCEPTION MONITOR:");
        this.#logger.error(error.stack ?? "");
    }): void {

        /**
         * @param error - The uncaught error
         * @param origin - Where the error originated
         */
        process.on("uncaughtExceptionMonitor", callback);
    }

    /**
     * @param callback - The callback for the warning listener
     *
     * @see [How can it be usefull](https://nodejs.org/api/process.html#emitting-custom-warnings)
     */
    public attachWarning(callback: NodeJS.WarningListener = (warning) => {
        this.#logger.printf(`WARNING: ${warning.message}`, Color.BLUE);
        this.#logger.printf(`${warning.stack}`, Color.BLUEVIOLET);
    }): void {
        process.on("warning", callback);
    }
}

/**
 * Attach the error logger
 *
 * @param options - The options for the error logger
 */
export function attachErrorLogger(options?: ErrorLoggerOptions): void {
    new ErrorLogger(options);
}