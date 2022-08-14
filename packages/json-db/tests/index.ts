import { Client } from "../src";

const client = new Client().setup(".");
const schema = client.schema({
    a: { type: "number", required: true },
    b: "boolean",
    c: { type: "tuple", elements: ["number"] } as const
});

const model = client.model("TEST", schema);
(async () => {
    const doc = await model.get("3");
    if (!doc) return;
    doc.a = 3;
    doc.b = true;
    doc.c = [1];
    console.log(doc);
    await model.save(doc);
})();