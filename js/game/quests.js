/* ============================================================
   Quests — linear quest chain state machine.
   Stages: locked -> available -> active -> return -> done
           (boss quests: locked -> available -> boss -> done)

   Faction-aware: the world (maps, NPCs, monsters) is shared, but
   each character only sees the chain for their faction. A quest's
   `faction` field selects the chain (missing => "python"). The
   per-faction {order, byId} is built lazily and memoized.
   ============================================================ */
window.Quests = (function () {
  const cache = {}; // faction -> { order, byId }

  function faction() {
    return (window.Game && Game.state && Game.state.faction) || "python";
  }
  function build(f) {
    const qs = window.QUEST_DB.filter((q) => (q.faction || "python") === f);
    const byId = {};
    for (const q of qs) byId[q.id] = q;
    return { order: qs.map((q) => q.id), byId };
  }
  function active() {
    const f = faction();
    return cache[f] || (cache[f] = build(f));
  }

  function get(id) { return active().byId[id]; }
  function idx(id) { return active().order.indexOf(id); }

  function rec(id) { return Game.state.quests[id] || null; }

  function stage(id) {
    const r = rec(id);
    if (r) return r.stage;
    const order = active().order;
    const i = idx(id);
    if (i === 0) return "available";
    const prev = rec(order[i - 1]);
    return prev && prev.stage === "done" ? "available" : "locked";
  }

  function isDone(id) { const r = rec(id); return !!r && r.stage === "done"; }

  /* Portal gates store a canonical (py-prefixed) quest id; remap it to
     the active faction's equivalent by its shared chapter number so a
     C++ character's cpp04 opens the same gate py04 opens for Python. */
  function remapReq(reqId) {
    const num = String(reqId).replace(/^[a-z]+/i, ""); // "py04" -> "04"
    const prefix = faction() === "python" ? "py" : faction();
    return prefix + num;
  }
  function gateOpen(reqId) { return isDone(remapReq(reqId)); }
  function gateQuest(reqId) { return active().byId[remapReq(reqId)] || null; }

  /* The active faction's quests, in order (for journals/skill lists). */
  function all() { return active().order.map((id) => active().byId[id]); }
  function count() { return active().order.length; }

  /* The quest an NPC currently wants to talk about (first non-done in order). */
  function questForNpc(npcId) {
    for (const id of active().order) {
      const q = active().byId[id];
      if (q.npc !== npcId) continue;
      const s = stage(id);
      if (s === "done" || s === "locked") continue;
      return { quest: q, stage: s };
    }
    // allow re-reading the last done quest's epilogue
    return null;
  }

  /* Does this NPC have anything actionable? (for the ! marker) */
  function npcMarker(npcId) {
    const qf = questForNpc(npcId);
    if (!qf) return null;
    if (qf.stage === "available") return "!";
    if (qf.stage === "return") return "?";
    return "…";
  }

  function accept(q) {
    if (rec(q.id)) return;
    Game.state.quests[q.id] = { stage: q.boss ? "boss" : "active", kills: 0, frags: 0 };
    AudioFX.quest();
    UI.chat(`Quest begun: ${q.title}`, "chat-story");
    if (q.boss) {
      UI.chat("A terrible presence manifests...", "chat-warn");
      AudioFX.boss();
      Game.spawnBossIfNeeded();
      UI.updateHintBar(`⚔ Boss: seek out ${ENEMIES[q.bossEnemy].name}`);
    } else {
      UI.chat(`Objective: slay ${q.kills.count} × ${ENEMIES[q.kills.enemy].name}`, "chat-sys");
      UI.updateHintBar(`⚔ Slay ${q.kills.count} × ${ENEMIES[q.kills.enemy].name} — each kill reveals a Tome fragment`);
    }
    Game.save();
    UI.refresh();
  }

  /* Called when the player kills an enemy. Returns a fragment string to show, or null. */
  function onKill(enemyTypeId) {
    const q = activeKillQuest();
    if (!q || q.kills.enemy !== enemyTypeId) return null;
    const r = rec(q.id);
    if (r.kills >= q.kills.count) return null;
    r.kills++;
    let frag = null;
    if (q.lesson.fragments && r.frags < q.lesson.fragments.length) {
      frag = q.lesson.fragments[r.frags];
      r.frags++;
    }
    UI.chat(`${ENEMIES[enemyTypeId].name} slain (${r.kills}/${q.kills.count})`, "chat-game");
    if (r.kills >= q.kills.count) {
      r.stage = "return";
      const npc = NPCS[q.npc];
      AudioFX.quest();
      UI.toast(`Objective complete — return to ${npc.name}`, true);
      UI.updateHintBar(`💬 Return to ${npc.name} (${MAPS[q.map].name}) for your trial`);
    } else {
      UI.updateHintBar(`⚔ Slay ${ENEMIES[q.kills.enemy].name}s — ${r.kills}/${q.kills.count} slain`);
    }
    Game.save();
    UI.refresh();
    return frag;
  }

  function activeKillQuest() {
    for (const id of active().order) {
      const r = rec(id);
      if (r && r.stage === "active") return active().byId[id];
    }
    return null;
  }

  function currentQuest() {
    for (const id of active().order) {
      const s = stage(id);
      if (s !== "done" && s !== "locked") return { quest: active().byId[id], stage: s };
    }
    return null;
  }

  function bossQuestFor(enemyId) {
    for (const id of active().order) {
      const q = active().byId[id];
      const r = rec(id);
      if (q.boss && q.bossEnemy === enemyId && r && r.stage === "boss") return q;
    }
    return null;
  }

  function completeChallenge(q) {
    const r = rec(q.id) || (Game.state.quests[q.id] = { stage: "boss", kills: 0, frags: 0 });
    if (r.stage === "done") return;
    r.stage = "done";
    // unlock all fragments for the tome
    if (q.lesson.fragments) r.frags = q.lesson.fragments.length;
    const rw = q.rewards;
    if (rw.coins) Game.addCoins(rw.coins);
    if (rw.items) for (const [iid, qty] of rw.items) Game.addItem(iid, qty);
    if (rw.xp) Game.addXp(rw.xp);
    if (rw.title) {
      Game.state.titleEarned = rw.title;
      UI.chat(`Title earned: ${rw.title}`, "chat-story");
    }
    AudioFX.victory();
    UI.chat(`Quest complete: ${q.title}`, "chat-story");
    if (rw.unlocks) {
      UI.toast(`🔥 ${rw.unlocks} is now open to you!`, true);
      UI.chat(`New region unlocked: ${rw.unlocks}`, "chat-sys");
    }
    UI.updateHintBar(null);
    Game.save();
    UI.refresh();
    UI.showReward(q);
    if (rw.final) {
      setTimeout(() => Game.beginEnding(), 1200);
    }
  }

  /* the quest a given enemy type belongs to (kill target or boss) */
  function questForEnemy(enemyId) {
    for (const id of active().order) {
      const q = active().byId[id];
      if ((q.kills && q.kills.enemy === enemyId) || (q.boss && q.bossEnemy === enemyId)) return q;
    }
    return null;
  }

  /* Questions for "review" fights vs enemies outside the active quest.
     Scoped to the enemy's region: only quests of the same act, up to and
     including the quest this enemy belongs to, and only ones the player
     has started. A Grave Wisp re-asks Wisp and earlier Ruins questions —
     never Act I material, never later monsters' material. */
  function reviewPool(enemyDef) {
    const tied = enemyDef ? questForEnemy(enemyDef.id) : null;
    const cap = tied ? idx(tied.id) : active().order.length;
    const pool = [];
    for (const id of active().order) {
      const q = active().byId[id];
      if (!rec(id)) continue;
      if (tied && (q.act !== tied.act || idx(id) > cap)) continue;
      pool.push(...q.questions);
    }
    if (pool.length) return pool;
    // fallback: anything learned (e.g. region entered before its first quest)
    for (const id of active().order) if (rec(id)) pool.push(...active().byId[id].questions);
    return pool;
  }

  function lessonsLearned() {
    return active().order.filter((id) => rec(id)).map((id) => active().byId[id]);
  }

  function objectiveText(q, s) {
    if (s === "available") return `Speak with ${NPCS[q.npc].name} in ${MAPS[q.map].name}.`;
    if (s === "active") {
      const r = rec(q.id);
      return `Slay ${ENEMIES[q.kills.enemy].name}s: ${r.kills}/${q.kills.count}`;
    }
    if (s === "return") return `Return to ${NPCS[q.npc].name} for the trial of code.`;
    if (s === "boss") return `Defeat ${ENEMIES[q.bossEnemy].name}!`;
    if (s === "done") return "Complete.";
    return "Locked.";
  }

  return {
    get order() { return active().order; },
    get byId() { return active().byId; },
    get, idx, stage, isDone, gateOpen, gateQuest, all, count,
    questForNpc, npcMarker, accept, onKill,
    activeKillQuest, currentQuest, bossQuestFor, completeChallenge, reviewPool,
    lessonsLearned, objectiveText
  };
})();
