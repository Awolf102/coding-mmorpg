/* Export challenges + reference solutions (from final hints) to JSON for Python-side grading. */
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
for (const q of QUEST_DB) {
  const ch = q.challenge;
  const lastHint = ch.hints[ch.hints.length - 1];
  const m = lastHint.match(/Full answer[^\n]*\n([\s\S]*)/);
  if (!m) { console.error("No full answer in last hint of " + q.id); process.exit(1); }
  out.push({
    id: q.id, title: ch.title, mode: ch.mode, funcName: ch.funcName || null,
    tests: ch.tests, solution: m[1]
  });
}
fs.writeFileSync(path.join(__dirname, "challenges.json"), JSON.stringify(out, null, 2));
console.log(`Exported ${out.length} challenges.`);
