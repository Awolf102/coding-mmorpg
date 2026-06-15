/* Export the C++ faction's challenges + reference solutions (from each
   challenge's final "Full answer:" hint) to tools/cpp_challenges.json, for
   grading with tools/grade_cpp_challenges.py. Run: node tools/export_cpp_challenges.js
   (No Node? The same JSON can be produced in-browser from window.QUEST_DB.) */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = global;
global.QUEST_DB = [];   // the cpp files append to this; in-game the Python files seed it first
function load(p) { eval(fs.readFileSync(path.join(root, p), "utf8")); }
load("js/engine/sprites.js");
load("js/data/items.js");
load("js/data/enemies.js");
load("js/data/maps.js");
load("js/data/cpp_act1.js");
load("js/data/cpp_act2.js");
load("js/data/cpp_act3.js");
load("js/data/cpp_act4.js");
load("js/data/cpp_act5.js");

const out = [];
for (const q of QUEST_DB) {
  if ((q.faction || "python") !== "cpp") continue;
  const ch = q.challenge;
  const lastHint = ch.hints[ch.hints.length - 1];
  const m = lastHint.match(/Full answer[^\n]*\n([\s\S]*)/);
  if (!m) { console.error("No full answer in last hint of " + q.id); process.exit(1); }
  out.push({ id: q.id, title: ch.title, tests: ch.tests, solution: m[1] });
}
fs.writeFileSync(path.join(__dirname, "cpp_challenges.json"), JSON.stringify(out, null, 2));
console.log(`Exported ${out.length} C++ challenges.`);
