// import { deepStrictEqual, throws } from "node:assert";
// import { Logger, ErrorLogger } from "../src";

// const logger = new Logger({ emojis: { emoji: "E" } });

// deepStrictEqual(logger.emojis.emoji, "E");

// throws(() => { throw new ErrorLogger("T"); });

import { Logger } from "../src";
import { Color } from "colours.js";

new Logger().print("Message to log", Color.fromHex("#FF7300"));