import fetch from "../src";

(async () => {
    const res = await fetch("https://nekos.life/api/v2/img/neko");
    if (res.json()) console.log("Test Completed: fetch");
    else console.log("Test Failed");
})();