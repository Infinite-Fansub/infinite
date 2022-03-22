import assert from "node:assert";
import { readLine } from "../src";

(async () => assert.deepEqual(await readLine("Hey", { defaultText: "Hi" }), "Hi"))();