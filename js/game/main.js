/* ============================================================
   Main — boot, screens, game loop, movement & pathfinding,
   items & leveling, fake-player ambience, endings.
   ============================================================ */
window.Game = (function () {
  const T = Sprites.TILE;
  const SPEED = 150; // px per second

  let state = null;
  let player = null;
  let entities = { npcs: [], enemies: [], walkers: [] };
  let currentMap = null;
  let running = false;
  let keys = [];
  let pendingInteract = null;
  let clickMarker = null;
  let lastT = 0;
  let saveTimer = 0, chatterTimer = 12;
  let uidCounter = 1;

  /* ============ leveling / economy ============ */
  function xpForLevel(l) {
    if (l <= 1) return 0;
    return Math.round(60 * Math.pow(l - 1, 1.8) + 60 * (l - 1));
  }
  function addXp(n) {
    const eq = equipStats();
    const gain = Math.round(n * (1 + eq.xpBoost));
    state.xp += gain;
    UI.chat(`+${gain} XP`, "chat-xp");
    while (state.xp >= xpForLevel(state.level + 1)) {
      state.level++;
      state.maxHp += 8;
      state.hp = state.maxHp;
      AudioFX.levelup();
      UI.toast(`✨ LEVEL UP! You are now level ${state.level} (+8 max HP)`, true);
      UI.chat(`You feel the Flame burn brighter. Level ${state.level}!`, "chat-story");
    }
    UI.refresh();
  }
  function addCoins(n) {
    state.coins = Math.max(0, state.coins + n);
    if (n > 0) UI.chat(`+${n} coins`, "chat-loot");
    UI.refresh();
  }

  /* ============ items ============ */
  function addItem(id, qty) {
    qty = qty || 1;
    const item = ITEMS[id];
    const stack = state.inventory.find((e) => e && e.id === id);
    if (stack) stack.qty += qty;
    else if (state.inventory.length < 24) state.inventory.push({ id, qty });
    else {
      const val = Math.floor(item.price / 2) * qty;
      addCoins(val);
      UI.chat(`Your pack is full! ${item.name} sold for ${val} coins.`, "chat-warn");
      return;
    }
    UI.chat(`You receive: ${item.name}${qty > 1 ? " ×" + qty : ""}`, "chat-loot");
    UI.refresh();
  }
  function removeItem(id, qty) {
    qty = qty || 1;
    const i = state.inventory.findIndex((e) => e && e.id === id);
    if (i < 0) return false;
    state.inventory[i].qty -= qty;
    if (state.inventory[i].qty <= 0) state.inventory.splice(i, 1);
    UI.refresh();
    return true;
  }
  function hasItem(id) { return state.inventory.some((e) => e && e.id === id); }
  function isEquipped(id) { return Object.values(state.equipment).includes(id); }

  function clickInventory(i) {
    const entry = state.inventory[i];
    if (!entry) return;
    const item = ITEMS[entry.id];
    if (item.slot === "consumable") {
      if (item.heal) {
        if (state.hp >= state.maxHp) { UI.chat("You are already at full health.", "chat-sys"); return; }
        removeItem(item.id, 1);
        heal(item.heal);
        UI.chat(`You drink the ${item.name}. ❤`, "chat-loot");
      } else {
        UI.chat("Scrolls of Insight are spent automatically by the Hint button during a code trial.", "chat-sys");
      }
      return;
    }
    if (["weapon", "armor", "charm"].includes(item.slot)) {
      const prev = state.equipment[item.slot];
      removeItem(item.id, 1);
      if (prev) addItem(prev, 1);
      state.equipment[item.slot] = item.id;
      UI.chat(`Equipped: ${item.name}`, "chat-sys");
      AudioFX.click();
      save(); UI.refresh();
    }
  }
  function unequip(kind) {
    if (kind === "weapon") { UI.chat("You dare not walk these lands unarmed.", "chat-sys"); return; }
    const id = state.equipment[kind];
    if (!id) return;
    if (state.inventory.length >= 24 && !state.inventory.find((e) => e.id === id)) {
      UI.chat("Your pack is full.", "chat-warn"); return;
    }
    state.equipment[kind] = null;
    addItem(id, 1);
    save(); UI.refresh();
  }

  function equipStats() {
    const w = state.equipment.weapon ? ITEMS[state.equipment.weapon] : null;
    const a = state.equipment.armor ? ITEMS[state.equipment.armor] : null;
    const c = state.equipment.charm ? ITEMS[state.equipment.charm] : null;
    return {
      dmg: w ? w.dmg : 1,
      weaponName: w ? w.name : "Bare Fists",
      def: a ? a.def : 0,
      xpBoost: (c && c.xpBoost) || 0,
      freeHint: !!(c && c.freeHint)
    };
  }
  function weaponTint() {
    const w = state.equipment.weapon ? ITEMS[state.equipment.weapon] : null;
    return w ? (w.tint || "#b9c2c9") : null;
  }

  /* ============ hp / death ============ */
  function heal(n) {
    state.hp = Math.min(state.maxHp, state.hp + n);
    UI.refresh();
  }
  function damage(n) {
    state.hp = Math.max(0, state.hp - n);
    UI.refresh();
    return state.hp <= 0;
  }
  function onDeath() {
    state.deaths++;
    const lost = Math.floor(state.coins * 0.1);
    state.coins -= lost;
    AudioFX.death();
    UI.toast("☠ You have fallen... the Flame rekindles you at the waystone.", true);
    if (lost > 0) UI.chat(`You dropped ${lost} coins as you fell.`, "chat-warn");
    state.hp = state.maxHp;
    player.x = currentMap.spawn.x; player.y = currentMap.spawn.y;
    player.px = player.x * T; player.py = player.y * T;
    player.path = []; player.moving = false;
    pendingInteract = null;
    save(); UI.refresh();
  }

  /* ============ map / entities ============ */
  function makeEnemy(spec) {
    const def = ENEMIES[spec.type];
    return {
      uid: uidCounter++, def,
      x: spec.x, y: spec.y, px: spec.x * T, py: spec.y * T,
      homeX: spec.x, homeY: spec.y, wander: spec.wander || 3,
      alive: true, respawnAt: 0, moveTimer: 1 + Math.random() * 2,
      fromX: spec.x, fromY: spec.y, toX: spec.x, toY: spec.y, moveProg: 1
    };
  }

  const WALKER_NAMES = ["Loopwarden", "TupleKnight", "SyntaxSeer", "Brynhild", "def_jorund", "Ashwalker7", "PrintessPeach", "WhileTrue", "Kestrel_v2", "NoonShade", "ColonKnight", "IndentIda"];
  const WALKER_LINES = [
    "anyone else stuck on the Warden's count?",
    "selling Flamewater, 40c, meet at the bridge",
    "the drowned king dropped me a greatsword!!",
    "how do I open my Tome again? nvm found it",
    "lf2 brave souls for Sir Kael",
    "remember: range(5) stops at 4. learned that the hard way",
    "W flame",
    "I keep writing = instead of ==, send help",
    "first time past the ruins, this place is HUGE",
    "tip: armor makes wrong answers hurt way less",
    "someone explain self to me like I'm five",
    "the bridge crowd today is unreal"
  ];
  function makeWalker(map) {
    const skins = ["#d8a878", "#b87f50", "#8d5524", "#e8c8a0"];
    const cols = ["#7a3000", "#2e4a7a", "#3f6230", "#5a3a7a", "#6e3526", "#3a5a5e"];
    let x, y, tries = 0;
    do {
      x = 3 + Math.floor(Math.random() * (map.tiles[0].length - 6));
      y = 3 + Math.floor(Math.random() * (map.tiles.length - 6));
      tries++;
    } while (Renderer.solidAt(x, y) && tries < 80);
    if (Renderer.solidAt(x, y)) { x = map.spawn.x; y = map.spawn.y; }
    return {
      name: WALKER_NAMES[Math.floor(Math.random() * WALKER_NAMES.length)],
      look: {
        skin: skins[Math.floor(Math.random() * skins.length)],
        hair: cols[Math.floor(Math.random() * cols.length)],
        hairStyle: Math.floor(Math.random() * 4),
        shirt: cols[Math.floor(Math.random() * cols.length)],
        pants: "#3a2c18"
      },
      x, y, px: x * T, py: y * T, facing: "down", moving: false,
      moveTimer: Math.random() * 3, fromX: x, fromY: y, toX: x, toY: y, moveProg: 1
    };
  }

  function loadMap(id, tx, ty) {
    currentMap = MAPS[id];
    state.map = id;
    Renderer.setMap(currentMap);
    entities = { npcs: [], enemies: [], walkers: [] };
    for (const n of currentMap.npcs) entities.npcs.push({ def: NPCS[n.id], x: n.x, y: n.y });
    for (const e of currentMap.enemies) entities.enemies.push(makeEnemy(e));
    const walkerCount = id === "village" ? 4 : id === "sanctum" ? 1 : 2;
    for (let i = 0; i < walkerCount; i++) entities.walkers.push(makeWalker(currentMap));
    player.x = tx; player.y = ty;
    player.px = tx * T; player.py = ty * T;
    player.path = []; player.moving = false;
    pendingInteract = null;
    spawnBossIfNeeded();
    UI.showBanner(currentMap.name);
    save();
  }

  function spawnBossIfNeeded() {
    for (const q of window.QUEST_DB) {
      if ((q.faction || "python") !== state.faction) continue;
      if (!q.boss) continue;
      const r = state.quests[q.id];
      if (!r || r.stage !== "boss") continue;
      if (q.bossSpot.map !== currentMap.id) continue;
      if (entities.enemies.some((e) => e.def.id === q.bossEnemy && e.alive)) continue;
      const boss = makeEnemy({ type: q.bossEnemy, x: q.bossSpot.x, y: q.bossSpot.y, wander: 1 });
      boss.isBoss = true;
      entities.enemies.push(boss);
    }
  }

  function killEnemy(ent, permanent) {
    ent.alive = false;
    state.kills++;
    if (!ent.def.boss) ent.respawnAt = performance.now() + 9000;
    else ent.respawnAt = 0;
  }

  /* ============ pathfinding ============ */
  function bfsPath(sx, sy, gx, gy) {
    if (Renderer.solidAt(gx, gy)) return null;
    const W = currentMap.tiles[0].length, H = currentMap.tiles.length;
    const prev = new Int32Array(W * H).fill(-1);
    const seen = new Uint8Array(W * H);
    const queue = [sy * W + sx];
    seen[sy * W + sx] = 1;
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    let found = false;
    while (queue.length) {
      const cur = queue.shift();
      const cx = cur % W, cy = (cur / W) | 0;
      if (cx === gx && cy === gy) { found = true; break; }
      for (const [dx, dy] of dirs) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (seen[ni] || Renderer.solidAt(nx, ny)) continue;
        // locked portals block pathing
        const portal = currentMap.portals.find((p) => p.x === nx && p.y === ny);
        if (portal && portal.req && !Quests.gateOpen(portal.req)) continue;
        seen[ni] = 1; prev[ni] = cur;
        queue.push(ni);
      }
    }
    if (!found) return null;
    const path = [];
    let cur = gy * W + gx;
    while (cur !== sy * W + sx) {
      path.push({ x: cur % W, y: (cur / W) | 0 });
      cur = prev[cur];
      if (cur === -1) return null;
    }
    path.reverse();
    return path;
  }

  function adjacentWalkable(gx, gy) {
    const opts = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    let best = null, bestLen = Infinity;
    for (const [dx, dy] of opts) {
      const nx = gx + dx, ny = gy + dy;
      if (Renderer.solidAt(nx, ny)) continue;
      const p = bfsPath(player.x, player.y, nx, ny);
      if (p && p.length < bestLen) { best = p; bestLen = p.length; }
    }
    return best;
  }

  /* ============ interaction ============ */
  function near(ax, ay, bx, by, r) { return Math.hypot(ax - bx, ay - by) <= r; }

  function interactWith(hit) {
    if (hit.kind === "npc") {
      AudioFX.click();
      UI.openDialogue(hit.ent.def);
    } else if (hit.kind === "enemy" && hit.ent.alive) {
      Combat.start(hit.ent);
    }
  }

  function tryInteractNearby() {
    let best = null, bestD = 1.9;
    for (const n of entities.npcs) {
      const d = Math.hypot(n.x - player.x, n.y - player.y);
      if (d < bestD) { best = { kind: "npc", ent: n }; bestD = d; }
    }
    for (const e of entities.enemies) {
      if (!e.alive) continue;
      const d = Math.hypot(e.x - player.x, e.y - player.y);
      if (d < bestD) { best = { kind: "enemy", ent: e }; bestD = d; }
    }
    if (best) interactWith(best);
  }

  function onCanvasClick(e) {
    if (!running || UI.isModalOpen()) return;
    AudioFX.click();
    const hit = Renderer.entityAtEvent(e);
    if (hit) {
      const ex = hit.kind === "npc" ? hit.ent.x : hit.ent.x;
      const ey = hit.kind === "npc" ? hit.ent.y : hit.ent.y;
      if (near(player.x, player.y, ex, ey, 1.9)) { interactWith(hit); return; }
      const path = adjacentWalkable(ex, ey);
      if (path) {
        player.path = path;
        pendingInteract = hit;
        clickMarker = { x: ex, y: ey, until: performance.now() + 4000 };
      } else UI.chat("You can't find a way there.", "chat-sys");
      return;
    }
    const t = Renderer.eventToTile(e);
    const path = bfsPath(player.x, player.y, t.x, t.y);
    if (path) {
      player.path = path;
      pendingInteract = null;
      clickMarker = { x: t.x, y: t.y, until: performance.now() + 4000 };
    } else {
      const portal = currentMap.portals.find((p) => p.x === t.x && p.y === t.y);
      if (portal && portal.req && !Quests.gateOpen(portal.req)) {
        UI.chat(`The way to ${portal.label} is sealed. Complete "${Quests.gateQuest(portal.req).title}" first.`, "chat-warn");
      }
    }
  }

  /* ============ movement update ============ */
  function dirFromKey() {
    for (let i = keys.length - 1; i >= 0; i--) {
      const k = keys[i];
      if (k === "w" || k === "arrowup") return { dx: 0, dy: -1, f: "up" };
      if (k === "s" || k === "arrowdown") return { dx: 0, dy: 1, f: "down" };
      if (k === "a" || k === "arrowleft") return { dx: -1, dy: 0, f: "left" };
      if (k === "d" || k === "arrowright") return { dx: 1, dy: 0, f: "right" };
    }
    return null;
  }

  function checkArrival() {
    // portal?
    const portal = currentMap.portals.find((p) => p.x === player.x && p.y === player.y);
    if (portal) {
      if (!portal.req || Quests.gateOpen(portal.req)) {
        AudioFX.teleport();
        UI.chat(`You travel to ${portal.label}...`, "chat-sys");
        loadMap(portal.to, portal.tx, portal.ty);
        return;
      }
    }
    // pending interaction?
    if (pendingInteract && player.path.length === 0) {
      const t = pendingInteract;
      pendingInteract = null;
      const ex = t.ent.x, ey = t.ent.y;
      if ((t.kind === "enemy" ? t.ent.alive : true) && near(player.x, player.y, ex, ey, 1.9)) interactWith(t);
    }
  }

  function updatePlayer(dt) {
    if (UI.isModalOpen()) return;
    if (!player.moving) {
      let next = null;
      if (player.path.length) {
        next = player.path.shift();
      } else {
        const d = dirFromKey();
        if (d) {
          player.facing = d.f;
          const nx = player.x + d.dx, ny = player.y + d.dy;
          const portal = currentMap.portals.find((p) => p.x === nx && p.y === ny);
          if (portal && portal.req && !Quests.gateOpen(portal.req)) {
            // blocked gate
          } else if (!Renderer.solidAt(nx, ny)) next = { x: nx, y: ny };
        }
      }
      if (next) {
        player.fromX = player.x; player.fromY = player.y;
        player.x = next.x; player.y = next.y;
        player.facing = next.x > player.fromX ? "right" : next.x < player.fromX ? "left" : next.y > player.fromY ? "down" : "up";
        player.moving = true; player.prog = 0;
      }
    }
    if (player.moving) {
      player.prog += (SPEED / T) * dt;
      if (player.prog >= 1) {
        player.prog = 1; player.moving = false;
        player.px = player.x * T; player.py = player.y * T;
        checkArrival();
      } else {
        player.px = (player.fromX + (player.x - player.fromX) * player.prog) * T;
        player.py = (player.fromY + (player.y - player.fromY) * player.prog) * T;
      }
    }
  }

  function updateWanderer(w, dt, radius, homeX, homeY) {
    if (w.moveProg < 1) {
      w.moveProg = Math.min(1, w.moveProg + dt * 2.4);
      w.px = (w.fromX + (w.toX - w.fromX) * w.moveProg) * T;
      w.py = (w.fromY + (w.toY - w.fromY) * w.moveProg) * T;
      w.moving = true;
      if (w.moveProg >= 1) { w.x = w.toX; w.y = w.toY; w.moving = false; }
      return;
    }
    w.moveTimer -= dt;
    if (w.moveTimer <= 0) {
      w.moveTimer = 1.2 + Math.random() * 2.8;
      const dirs = [[0, 1, "down"], [0, -1, "up"], [1, 0, "right"], [-1, 0, "left"]];
      const [dx, dy, f] = dirs[Math.floor(Math.random() * 4)];
      const nx = w.x + dx, ny = w.y + dy;
      if (Renderer.solidAt(nx, ny)) return;
      if (Math.abs(nx - homeX) > radius || Math.abs(ny - homeY) > radius) return;
      if (nx === player.x && ny === player.y) return;
      const portal = currentMap.portals.find((p) => p.x === nx && p.y === ny);
      if (portal) return;
      w.fromX = w.x; w.fromY = w.y; w.toX = nx; w.toY = ny;
      w.moveProg = 0; w.facing = f;
    }
  }

  function update(dt, t) {
    updatePlayer(dt);
    for (const e of entities.enemies) {
      if (!e.alive) {
        if (e.respawnAt && t > e.respawnAt && !e.def.boss) {
          e.alive = true;
          e.x = e.homeX; e.y = e.homeY; e.px = e.x * T; e.py = e.y * T;
          e.fromX = e.toX = e.x; e.fromY = e.toY = e.y; e.moveProg = 1;
        }
        continue;
      }
      if (!Combat.inCombat) updateWanderer(e, dt, e.wander, e.homeX, e.homeY);
    }
    for (const w of entities.walkers) updateWanderer(w, dt, 6, w.x, w.y);

    // ambient chatter
    chatterTimer -= dt;
    if (chatterTimer <= 0) {
      chatterTimer = 20 + Math.random() * 30;
      if (entities.walkers.length && Math.random() < 0.8) {
        const w = entities.walkers[Math.floor(Math.random() * entities.walkers.length)];
        UI.chat(`${w.name}: ${WALKER_LINES[Math.floor(Math.random() * WALKER_LINES.length)]}`, "chat-other");
      }
    }
    // autosave + playtime
    saveTimer += dt;
    state.playtime += dt;
    if (saveTimer > 20) { saveTimer = 0; save(); }
  }

  function maybeAmbientReply(msg) {
    if (!entities.walkers.length || Math.random() > 0.5) return;
    const replies = ["nice", "gl out there, marked one", "the Flame hears you", "same tbh", "based", "have you tried turning the loop off and on again"];
    const w = entities.walkers[Math.floor(Math.random() * entities.walkers.length)];
    setTimeout(() => UI.chat(`${w.name}: ${replies[Math.floor(Math.random() * replies.length)]}`, "chat-other"), 1200 + Math.random() * 1800);
  }

  /* ============ main loop ============ */
  function loop(t) {
    const dt = Math.min(0.06, (t - lastT) / 1000 || 0.016);
    lastT = t;
    if (running) {
      update(dt, t);
      Renderer.frame(t);
    }
    requestAnimationFrame(loop);
  }

  /* ============ save / screens ============ */
  function save() {
    if (!state) return;
    state.x = player ? player.x : state.x;
    state.y = player ? player.y : state.y;
    SaveSystem.save(state.slot, state);
  }

  function showScreen(id) {
    for (const s of ["screen-title", "screen-select", "screen-create", "screen-game", "screen-ending"])
      document.getElementById(s).classList.toggle("hidden", s !== id);
  }

  function exitToTitle() {
    save();
    UI.closeAllModals();
    running = false;
    state = null; player = null;
    showScreen("screen-title");
    startTitleFlames();
  }

  /* ---------- title flames ---------- */
  let titleAnim = null;
  function startTitleFlames() {
    const c = document.getElementById("title-canvas");
    c.width = window.innerWidth; c.height = window.innerHeight;
    const cx = c.getContext("2d");
    const parts = [];
    cancelAnimationFrame(titleAnim);
    function tick() {
      if (document.getElementById("screen-title").classList.contains("hidden") &&
          document.getElementById("screen-ending").classList.contains("hidden")) return;
      cx.clearRect(0, 0, c.width, c.height);
      if (Math.random() < 0.5) parts.push({
        x: c.width / 2 + (Math.random() - 0.5) * c.width * 0.7,
        y: c.height + 10, r: 2 + Math.random() * 5,
        vy: 0.6 + Math.random() * 1.6, life: 1
      });
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.y -= p.vy; p.life -= 0.004; p.x += Math.sin(p.y / 40) * 0.4;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        cx.globalAlpha = Math.max(0, p.life * 0.5);
        cx.fillStyle = p.life > 0.6 ? "#ff7a1a" : "#c43e0c";
        cx.beginPath(); cx.arc(p.x, p.y, p.r * p.life, 0, 7); cx.fill();
      }
      cx.globalAlpha = 1;
      titleAnim = requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- character select ---------- */
  function showSelect() {
    showScreen("screen-select");
    const list = document.getElementById("slot-list");
    list.innerHTML = "";
    const slots = SaveSystem.getSlots();
    slots.forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "slot-row";
      const prev = document.createElement("canvas");
      prev.width = 56; prev.height = 64;
      row.appendChild(prev);
      const info = document.createElement("div");
      info.className = "slot-info";
      if (s) {
        Sprites.drawPlayerInto(prev, s.appearance, 2.4);
        const done = Object.values(s.quests).filter((q) => q.stage === "done").length;
        const slang = LANG.get(s.faction);
        const stotal = window.QUEST_DB.filter((q) => (q.faction || "python") === (s.faction || "python")).length;
        info.innerHTML = `<div class="slot-name">${UI.escapeHtml(s.name)}${s.titleEarned ? ` «${UI.escapeHtml(s.titleEarned)}»` : ""}</div>
          <div class="slot-meta">Level ${s.level} · ${MAPS[s.map].name} · ${done}/${stotal} chapters · ${slang.icon} ${slang.name}</div>`;
        row.onclick = () => { AudioFX.click(); enterGame(s); };
        const del = document.createElement("button");
        del.className = "btn btn-small btn-danger slot-del";
        del.textContent = "✕";
        del.onclick = (e) => {
          e.stopPropagation();
          if (confirm(`Burn ${s.name} to ash forever?`)) { SaveSystem.erase(i); showSelect(); }
        };
        row.appendChild(info);
        row.appendChild(del);
      } else {
        info.innerHTML = `<div class="slot-empty">— empty pyre — create a new survivor</div>`;
        row.appendChild(info);
        row.onclick = () => { AudioFX.click(); showCreate(i); };
      }
      list.appendChild(row);
    });
  }

  /* ---------- character create ---------- */
  const SKINS = ["#e8c8a0", "#d8a878", "#b87f50", "#8d5524", "#6b4226"];
  const HAIRC = ["#1a1a2a", "#6a3a1a", "#cfcfcf", "#c0392b", "#e8d23f", "#3f6230", "#5a3a7a"];
  const HAIRS = ["Cropped", "Long", "Wild", "Bald"];
  const TUNICS = ["#7a3000", "#2e4a7a", "#3f6230", "#5a3a7a", "#6e3526", "#3a5a5e", "#8a6a17"];
  let createCfg = null;

  const FACTIONS = [
    { id: "python", icon: "🐍", name: "Order of the Serpent — Python", sealed: false,
      desc: "The eldest speech of the Flame: readable as prose, deep as the ruins. Masters begin with print() and end by out-riddling kings. (Full campaign: 23 chapters, beginner → advanced.)" },
    { id: "javascript", icon: "🌐", name: "Weavers of the Web — JavaScript", sealed: true,
      desc: "Spinners of living glass between the world's towers. Their gates have not yet reopened." },
    { id: "cpp", icon: "⚙", name: "The Iron Concord — C++", sealed: false,
      desc: "Smiths who speak directly to the world's bones — types, memory, and raw speed. They begin with cout and end out-forging kings with vectors, maps, sorting and recursion. (Full campaign: 23 chapters, beginner → advanced; trials compile real C++ online.)" },
    { id: "rust", icon: "🦀", name: "The Oxide Covenant — Rust", sealed: true,
      desc: "Zealots of memory safety, borrowed and never stolen. Sealed until a later age." }
  ];

  function showCreate(slot) {
    showScreen("screen-create");
    createCfg = { slot, skin: 1, hair: 0, hairStyle: 0, tunic: 0, faction: "python" };
    document.getElementById("create-name").value = "";

    const rows = document.getElementById("appearance-rows");
    rows.innerHTML = "";
    const defs = [
      { key: "skin", label: "Skin", arr: SKINS, swatch: true },
      { key: "hair", label: "Hair color", arr: HAIRC, swatch: true },
      { key: "hairStyle", label: "Hair style", arr: HAIRS, swatch: false },
      { key: "tunic", label: "Tunic", arr: TUNICS, swatch: true }
    ];
    for (const d of defs) {
      const row = document.createElement("div");
      row.className = "app-row";
      row.innerHTML = `<span class="lbl">${d.label}</span>`;
      const ctr = document.createElement("div");
      ctr.className = "ctrls";
      const lt = document.createElement("button"); lt.className = "btn"; lt.textContent = "◀";
      const disp = document.createElement(d.swatch ? "div" : "span");
      if (d.swatch) disp.className = "app-swatch"; else { disp.className = "lbl"; disp.style.minWidth = "52px"; disp.style.textAlign = "center"; }
      const rt = document.createElement("button"); rt.className = "btn"; rt.textContent = "▶";
      const upd = () => {
        if (d.swatch) disp.style.background = d.arr[createCfg[d.key]];
        else disp.textContent = d.arr[createCfg[d.key]];
        drawCreatePreview();
      };
      lt.onclick = () => { AudioFX.click(); createCfg[d.key] = (createCfg[d.key] - 1 + d.arr.length) % d.arr.length; upd(); };
      rt.onclick = () => { AudioFX.click(); createCfg[d.key] = (createCfg[d.key] + 1) % d.arr.length; upd(); };
      ctr.appendChild(lt); ctr.appendChild(disp); ctr.appendChild(rt);
      row.appendChild(ctr);
      rows.appendChild(row);
      upd();
    }

    const fl = document.getElementById("faction-list");
    fl.innerHTML = "";
    for (const f of FACTIONS) {
      const card = document.createElement("div");
      card.className = "faction-card" + (f.sealed ? " sealed" : "") + (createCfg.faction === f.id ? " selected" : "");
      card.innerHTML = `<div class="faction-icon">${f.icon}</div>
        <div><div class="faction-name">${f.name}</div><div class="faction-desc">${f.desc}</div></div>
        ${f.sealed ? '<div class="faction-sealed-tag">SEALED</div>' : ""}`;
      card.onclick = () => {
        if (f.sealed) { UI.toast("That faction's gates are sealed... for now. Python leads the vanguard."); return; }
        createCfg.faction = f.id;
        fl.querySelectorAll(".faction-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        AudioFX.click();
      };
      fl.appendChild(card);
    }
    drawCreatePreview();
  }

  function currentAppearance() {
    return {
      skin: SKINS[createCfg.skin], hair: HAIRC[createCfg.hair],
      hairStyle: createCfg.hairStyle, shirt: TUNICS[createCfg.tunic], pants: "#3a2c18"
    };
  }
  function drawCreatePreview() {
    const c = document.getElementById("create-preview");
    Sprites.drawPlayerInto(c, currentAppearance(), 5);
  }

  function finishCreate() {
    let name = document.getElementById("create-name").value.trim();
    if (!name) name = "Marked One";
    name = name.replace(/[<>]/g, "");
    const st = SaveSystem.newState(createCfg.slot, name, createCfg.faction, currentAppearance());
    SaveSystem.save(createCfg.slot, st);
    enterGame(st);
  }

  /* ---------- enter game ---------- */
  let initialized = false;
  function enterGame(st) {
    state = st;
    AudioFX.setEnabled(state.settings.sound);
    showScreen("screen-game");
    if (!initialized) {
      initialized = true;
      Renderer.init();
      UI.init();
      const canvas = document.getElementById("game-canvas");
      canvas.addEventListener("click", onCanvasClick);
    }
    player = { x: state.x, y: state.y, px: state.x * T, py: state.y * T, facing: "down", moving: false, path: [], prog: 0, fromX: state.x, fromY: state.y };
    loadMap(state.map, state.x, state.y);
    running = true;
    UI.refresh();
    UI.setTab("quests");
    UI.chat(`Welcome back to the First Kingdom, ${state.name}.`, "chat-story");
    if (!state.introSeen) {
      state.introSeen = true;
      showIntro();
    } else {
      const cq = Quests.currentQuest();
      if (cq) UI.updateHintBar(`📜 ${cq.quest.title}: ${Quests.objectiveText(cq.quest, cq.stage)}`);
    }
  }

  function showIntro() {
    const m = UI.modal(`
      <h2 class="gold-header">Ashes of the First Kingdom</h2>
      <div class="dlg-body">
        <p>A thousand years ago, the <b>First Kingdom</b> united every race beneath one banner, speaking a language of power fueled by the <b>Eternal Flame</b>. Then the Flame vanished — and the Kingdom fell in a single night.</p>
        <p>Now the Flame has returned. It wakes dead kings and drowned armies... and it has burned its mark into <b>your</b> hand.</p>
        <p>The mark lets you speak the old tongue — what survivors call <b>${LANG.get(state.faction).name}</b>. Every monster slain teaches you a word of it. Every trial passed makes you stronger.</p>
        <p><b>Find Elder Maren in the village square</b> — the NPC with the golden <b>!</b> — and begin. Click the ground to walk. Click creatures to face them.</p>
      </div>
      <div class="row-center" style="margin-top:12px">
        <button class="btn btn-flame" id="intro-go">Bear the Mark</button>
      </div>`, { closable: false });
    m.box.querySelector("#intro-go").onclick = () => {
      AudioFX.quest();
      m.close();
      UI.updateHintBar("📜 Speak with Elder Maren (golden !) in the village square. Click the ground to walk.");
      save();
    };
  }

  /* ---------- endings ---------- */
  function beginEnding() {
    if (state.ending) { showEndingScreen(state.ending); return; }
    const m = UI.modal(`
      <div class="dlg-head"><canvas width="72" height="72" id="end-face"></canvas>
        <div><div class="dlg-npc-name">The Eternal Flame</div><div class="dlg-npc-title">That Which Remains</div></div></div>
      <div class="dlg-body">
        <p><i>The First King kneels in ash. The Flame turns its faceless heat upon you, and for the first time in a thousand years — it asks instead of takes.</i></p>
        <p><b>"MARKED ONE. THE KINGDOM IS YOURS TO SHAPE. CHOOSE."</b></p>
      </div>
      <div class="dlg-buttons" style="flex-direction:column;align-items:stretch" id="end-choices"></div>`,
      { className: "modal-dialogue", closable: false });
    Sprites.drawNPCInto(m.box.querySelector("#end-face"), NPCS.flame);
    const choices = [
      { id: "restore", label: "🏰 Restore the First Kingdom — relight every beacon, recrown the worthy" },
      { id: "destroy", label: "🌑 Destroy the Flame forever — let the age of kings truly end" },
      { id: "claim", label: "🔥 Claim its power — the Flame needs a bearer; it has chosen well" }
    ];
    const box = m.box.querySelector("#end-choices");
    for (const c of choices) {
      const b = document.createElement("button");
      b.className = "btn btn-flame";
      b.style.textAlign = "left";
      b.textContent = c.label;
      b.onclick = () => {
        state.ending = c.id;
        save();
        m.close();
        showEndingScreen(c.id);
      };
      box.appendChild(b);
    }
  }

  const EPILOGUES = {
    restore: ["You raise the Eternal Brand, and the Flame flows outward — into the beacon of Ashveil, the wards of Emberwood, the drowned halls, the silent citadel. One by one, the lights of the First Kingdom return.",
      "They crown no king. They crown a <b>teacher</b>. And in the rebuilt scriptorium, a thousand marked hands learn to write `print(\"Hello, world\")` — the first words of the Second Kingdom."],
    destroy: ["You drive the Eternal Brand into the dais, and speak the only word the Flame cannot survive: <code>return</code>.",
      "The fire goes out gently, like a lesson ending. The dead rest. The ruins are only ruins. And in the quiet that follows, people discover the power was never in the Flame at all — it was in the ones who learned to speak."],
    claim: ["You close your marked hand around the Flame, and it does not burn you. It <b>compiles</b>.",
      "Kingdoms will tell stories of the Flamebearer — the one who walks the roads at dusk, trading power for riddles, teaching the old tongue to anyone brave enough to answer three questions and write one small, perfect function."]
  };

  function showEndingScreen(choice) {
    running = false;
    showScreen("screen-ending");
    startTitleFlames(); // reuses particle bg if title canvas visible — set up ending canvas instead
    const c = document.getElementById("ending-canvas");
    c.width = window.innerWidth; c.height = window.innerHeight;
    const inner = document.getElementById("ending-inner");
    const mins = Math.round(state.playtime / 60);
    inner.innerHTML = `
      <h1>${choice === "restore" ? "THE SECOND KINGDOM" : choice === "destroy" ? "THE QUIET AGE" : "THE FLAMEBEARER"}</h1>
      <div class="ep">${EPILOGUES[choice].map((p) => `<p>${p}</p>`).join("")}</div>
      <div style="color:#b9a888;font-size:13px;margin-bottom:22px">
        ${UI.escapeHtml(state.name)} «Flamebearer» — Level ${state.level} · ${state.kills} foes slain · ${state.bossKills} bosses felled ·
        ${Object.values(state.quests).filter((q) => q.stage === "done").length}/${Quests.count()} chapters mastered · ${mins} minutes in the Kingdom
      </div>
      <div style="color:#7CFC00;font-size:14px;margin-bottom:26px">${LANG.get(state.faction).chronicleDone}</div>
      <div class="title-buttons">
        <button class="btn btn-big" id="end-wander">Keep wandering the Kingdom</button>
        <button class="btn btn-big btn-flame" id="end-title">Return to Title</button>
      </div>`;
    document.getElementById("end-wander").onclick = () => {
      AudioFX.click();
      showScreen("screen-game");
      running = true;
    };
    document.getElementById("end-title").onclick = () => { AudioFX.click(); exitToTitle(); };
    AudioFX.victory();
  }

  /* ---------- boot ---------- */
  function boot() {
    showScreen("screen-title");
    startTitleFlames();
    document.getElementById("btn-title-play").onclick = () => { AudioFX.click(); showSelect(); };
    document.getElementById("btn-select-back").onclick = () => { AudioFX.click(); exitToTitle(); };
    document.getElementById("btn-create-back").onclick = () => { AudioFX.click(); showSelect(); };
    document.getElementById("btn-create-go").onclick = () => { AudioFX.click(); finishCreate(); };

    window.addEventListener("keydown", (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase()) || ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) e.preventDefault();
      if (!running) return;
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        if (!keys.includes(k)) keys.push(k);
        player.path = []; pendingInteract = null;
      } else if ((k === "e" || k === " ") && !UI.isModalOpen()) {
        tryInteractNearby();
      }
    });
    window.addEventListener("keyup", (e) => {
      const k = e.key.toLowerCase();
      keys = keys.filter((x) => x !== k);
    });
    window.addEventListener("beforeunload", () => save());

    requestAnimationFrame(loop);
  }

  document.addEventListener("DOMContentLoaded", boot);

  /* ---------- public API ---------- */
  return {
    get state() { return state; },
    get player() { return player; },
    get entities() { return entities; },
    get currentMap() { return currentMap; },
    get clickMarker() { return clickMarker; },
    xpForLevel, addXp, addCoins,
    addItem, removeItem, hasItem, isEquipped, clickInventory, unequip,
    equipStats, weaponTint, heal, damage, onDeath,
    loadMap, spawnBossIfNeeded, killEnemy,
    save, exitToTitle, beginEnding, maybeAmbientReply
  };
})();
