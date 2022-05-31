import { deepStrictEqual, throws } from "node:assert";
import { Logger, ErrorLogger } from "../src";

const logger = new Logger({ emojis: { emoji: "E" } });

deepStrictEqual(logger.emojis.emoji, "E");

throws(() => { throw new ErrorLogger("T"); }, { name: "ErrorLogger" });