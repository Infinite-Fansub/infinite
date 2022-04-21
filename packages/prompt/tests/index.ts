import assert from "node:assert";
import { readLine } from "../src";

(async () => assert.deepStrictEqual(await readLine("Hey", { defaultText: "Hi" }), "Hi"))();