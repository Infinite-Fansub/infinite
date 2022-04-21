import fetch from "../src";
import assert from "node:assert";

(async () => {
    const res = await fetch("https://www.google.com/");
    assert.notDeepStrictEqual(res.rawData().length, 0);
})();