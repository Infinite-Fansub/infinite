import assert from "node:assert";
import { Logger } from "../src";

const logger = new Logger({ emojis: { emoji: "E" } });

assert.deepStrictEqual(logger.emojis.emoji, "E");
