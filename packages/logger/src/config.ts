/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck This file modifies globals so we avoid checking it
import { PrettyError } from "./pretty-error";
import { Logger } from "./logger";

(() => {
    global.Logger = Logger;
    global.logger = new Logger();
    global.PrettyError = PrettyError;
})();