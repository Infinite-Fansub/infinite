import { Client } from "../src";

const client = new Client().setup(".");
const schema = client.schema({
    a: { type: "number", required: true },
    b: "boolean",
    c: { type: "object", data: { d: "string", e: { type: "number", required: true } } },
    f: { type: "tuple", elements: ["number", { type: "array" }, "boolean", "boolean"] }
});

const model = client.model("TEST", schema);
(async () => {
    let doc = await model.get("3") ?? model.create();
    // doc._id = "3";
    doc.a = 3;
    doc.b = true;
    doc.c = { e: 3 };
    doc.f = [3, ["F"], true, true];
    console.log(doc);
    await model.save(doc);
})();