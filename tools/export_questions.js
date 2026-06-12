/* Export output-type combat questions for Python verification. */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = global;
function load(p) { eval(fs.readFileSync(path.join(root, p), "utf8")); }
load("js/engine/sprites.js");
load("js/data/items.js");
load("js/data/enemies.js");
load("js/data/maps.js");
load("js/data/quests_act1.js");
load("js/data/quests_act2.js");
load("js/data/quests_act3.js");
load("js/data/quests_act4.js");
load("js/data/quests_act5.js");

const out = [];
for (const q of QUEST_DB)
  q.questions.forEach((que, i) => {
    if (que.type === "output" && que.code) out.push({ id: `${q.id}#${i}`, code: que.code, answer: que.answer });
  });
fs.writeFileSync(path.join(__dirname, "questions.json"), JSON.stringify(out, null, 2));
console.log(`Exported ${out.length} output questions.`);
