/* Headless data validation: run with `node tools/validate.js` */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

global.window = global;
function load(p) {
  const code = fs.readFileSync(path.join(root, p), "utf8");
  eval(code);
}

load("js/engine/sprites.js"); // needs no DOM at load time
load("js/data/items.js");
load("js/data/enemies.js");
load("js/data/maps.js");
load("js/data/quests_act1.js");
load("js/data/quests_act2.js");
load("js/data/quests_act3.js");
load("js/data/quests_act4.js");
load("js/data/quests_act5.js");
load("js/data/cpp_act1.js");
load("js/data/cpp_act2.js");
load("js/data/cpp_act3.js");
load("js/data/cpp_act4.js");
load("js/data/cpp_act5.js");

let errors = 0;
const err = (m) => { console.log("✗ " + m); errors++; };
const ok = (m) => console.log("✓ " + m);

/* ---- tile helpers ---- */
function solid(map, x, y) {
  if (x < 0 || y < 0 || y >= map.tiles.length || x >= map.tiles[0].length) return true;
  const t = Sprites.TILES[map.tiles[y][x]];
  return !t || t.solid;
}
function bfsAll(map, sx, sy) {
  const W = map.tiles[0].length, H = map.tiles.length;
  const seen = new Set([sy * W + sx]);
  const q = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = x + dx, ny = y + dy;
      if (solid(map, nx, ny)) continue;
      const k = ny * W + nx;
      if (!seen.has(k)) { seen.add(k); q.push([nx, ny]); }
    }
  }
  return seen;
}
function reachableAdjacent(map, reach, x, y) {
  const W = map.tiles[0].length;
  if (reach.has(y * W + x)) return true;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]])
    if (reach.has((y + dy) * W + (x + dx))) return true;
  return false;
}

/* ---- maps ---- */
for (const id of Object.keys(MAPS)) {
  const m = MAPS[id];
  const W = m.tiles[0].length;
  for (const row of m.tiles) if (row.length !== W) err(`${id}: ragged tile rows`);
  if (solid(m, m.spawn.x, m.spawn.y)) err(`${id}: spawn not walkable`);
  const reach = bfsAll(m, m.spawn.x, m.spawn.y);
  for (const n of m.npcs) {
    if (!NPCS[n.id]) err(`${id}: unknown npc ${n.id}`);
    if (!reachableAdjacent(m, reach, n.x, n.y)) err(`${id}: npc ${n.id} unreachable at ${n.x},${n.y}`);
  }
  for (const e of m.enemies) {
    if (!ENEMIES[e.type]) err(`${id}: unknown enemy ${e.type}`);
    if (solid(m, e.x, e.y)) err(`${id}: enemy ${e.type} on solid tile ${e.x},${e.y}`);
    if (!reachableAdjacent(m, reach, e.x, e.y)) err(`${id}: enemy ${e.type} unreachable at ${e.x},${e.y}`);
  }
  for (const p of m.portals) {
    if (!MAPS[p.to]) err(`${id}: portal to unknown map ${p.to}`);
    else if (solid(MAPS[p.to], p.tx, p.ty)) err(`${id}: portal lands on solid tile in ${p.to} at ${p.tx},${p.ty}`);
    if (!reach.has(p.y * W + p.x)) err(`${id}: portal at ${p.x},${p.y} unreachable from spawn`);
  }
  ok(`map ${id}: ${m.tiles.length}x${W}, ${m.npcs.length} npcs, ${m.enemies.length} enemies validated`);
}

/* ---- quests ---- */
const seenIds = new Set();
const prevActByFaction = {};
for (const q of QUEST_DB) {
  if (seenIds.has(q.id)) err(`duplicate quest id ${q.id}`);
  seenIds.add(q.id);
  const fac = q.faction || "python";
  if (q.act < (prevActByFaction[fac] || 0)) err(`quest ${q.id} act out of order`);
  prevActByFaction[fac] = q.act;
  if (!NPCS[q.npc]) err(`${q.id}: unknown npc ${q.npc}`);
  if (!MAPS[q.map]) err(`${q.id}: unknown map ${q.map}`);
  if (MAPS[q.map] && !MAPS[q.map].npcs.some((n) => n.id === q.npc)) err(`${q.id}: npc ${q.npc} not placed on map ${q.map}`);
  if (q.boss) {
    if (!ENEMIES[q.bossEnemy]) err(`${q.id}: unknown boss ${q.bossEnemy}`);
    const bm = MAPS[q.bossSpot.map];
    if (!bm) err(`${q.id}: boss map ${q.bossSpot.map}`);
    else {
      if (solid(bm, q.bossSpot.x, q.bossSpot.y)) err(`${q.id}: boss spot solid at ${q.bossSpot.x},${q.bossSpot.y}`);
      const reach = bfsAll(bm, bm.spawn.x, bm.spawn.y);
      if (!reachableAdjacent(bm, reach, q.bossSpot.x, q.bossSpot.y)) err(`${q.id}: boss spot unreachable`);
    }
  } else {
    if (!ENEMIES[q.kills.enemy]) err(`${q.id}: unknown kill enemy ${q.kills.enemy}`);
    const onMap = MAPS[q.map].enemies.filter((e) => e.type === q.kills.enemy).length;
    if (onMap === 0) err(`${q.id}: no ${q.kills.enemy} spawns on ${q.map}`);
    if (q.lesson.fragments.length > q.kills.count) err(`${q.id}: more fragments (${q.lesson.fragments.length}) than kills (${q.kills.count})`);
  }
  if (!q.questions || q.questions.length < 4) err(`${q.id}: too few questions`);
  for (const [i, que] of (q.questions || []).entries()) {
    if (que.type === "mc" && (que.answer == null || !que.choices || que.answer >= que.choices.length)) err(`${q.id} Q${i}: bad mc`);
    if ((que.type === "output" || que.type === "fill") && que.answer == null) err(`${q.id} Q${i}: missing answer`);
    if (!que.why) err(`${q.id} Q${i}: missing why`);
  }
  const ch = q.challenge;
  if (!ch || !ch.tests || !ch.tests.length) err(`${q.id}: missing challenge tests`);
  if (ch.mode === "function" && !ch.funcName) err(`${q.id}: function mode without funcName`);
  if (!ch.hints || ch.hints.length < 2) err(`${q.id}: needs hints`);
  for (const [iid] of q.rewards.items || []) if (!ITEMS[iid]) err(`${q.id}: unknown reward item ${iid}`);
}
ok(`${QUEST_DB.length} quests validated`);

/* ---- items / shops / loot ---- */
for (const sid of Object.keys(SHOPS)) for (const iid of SHOPS[sid]) if (!ITEMS[iid]) err(`shop ${sid}: unknown item ${iid}`);
for (const act of Object.keys(LOOT_TABLES)) for (const [iid] of LOOT_TABLES[act]) if (!ITEMS[iid]) err(`loot act ${act}: unknown item ${iid}`);
for (const npc of Object.values(NPCS)) if (npc.shop && !SHOPS[npc.shop]) err(`npc ${npc.id}: unknown shop ${npc.shop}`);
ok("items / shops / loot tables validated");

/* ---- portal gating chain ---- */
const gates = [];
for (const m of Object.values(MAPS)) for (const p of m.portals) if (p.req) gates.push(`${m.id}->${p.to} requires ${p.req}`);
console.log("  gating: " + gates.join("; "));

console.log(errors ? `\n${errors} PROBLEM(S) FOUND` : "\nALL CHECKS PASSED");
process.exit(errors ? 1 : 0);
