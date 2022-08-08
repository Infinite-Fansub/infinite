import { ErrorLogger } from "../src";

const eLogger = new ErrorLogger({});
eLogger.attachBeforeExit();
eLogger.attachExit();
eLogger.attachRejectionHandled();
eLogger.attachUnhandledRejection();
eLogger.attachUncaughtException();
eLogger.attachUncaughtExceptionMonitor();
eLogger.attachWarning();

process.emitWarning("This is a important warning", {
    type: "IDK",
    code: "404",
    detail: "IDFK"
});
new Promise((_, reject) => reject("Rejected bitch"));
// @ts-expect-error this is for the test
somefunc();