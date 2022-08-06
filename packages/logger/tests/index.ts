import { deepStrictEqual, throws } from "node:assert";
import { Logger, ErrorLogger } from "../src";

const logger = new Logger({ emojis: { emoji: "E" } });

deepStrictEqual(logger.emojis.emoji, "E");

// throws(() => { throw new ErrorLogger("T"); });

import { Logger } from "@infinite-fansub/logger";

const logger = new Logger({
    showDay: false
});

logger.defaultPrint("T")