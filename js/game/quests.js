/* ============================================================
   Quests — linear quest chain state machine.
   Stages: locked -> available -> active -> return -> done
           (boss quests: locked -> available -> boss -> done)
   ============================================================ */
window.Quests = (function () {
  const order = window.QUEST_DB.map((q) => q.id);
  const byId = {};
  for (const q of window.QUEST_DB) byId[q.id] = q;

  function get(id) { return byId[id]; }
  function idx(id) { return order.indexOf(id); }

  function rec(id) { return Game.state.quests[id] || null; }

  function stage(id) {
    const r = rec(id);
    if (r) return r.stage;
    const i = idx(id);
    if (i === 0) return "available";
    const prev = rec(order[i - 1]);
    return prev && prev.stage === "done" ? "available" : "locked";
  }

  function isDone(id) { const r = rec(id); return !!r && r.stage === "done"; }

  /* The quest an NPC currently wants to talk about (first non-done in order). */
  function questForNpc(npcId) {
    for (const id of order) {
      const q = byId[id];
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
    }
    Game.save();
    UI.refresh();
    return frag;
  }

  function activeKillQuest() {
    for (const id of order) {
      const r = rec(id);
      if (r && r.stage === "active") return byId[id];
    }
    return null;
  }

  function currentQuest() {
    for (const id of order) {
      const s = stage(id);
      if (s !== "done" && s !== "locked") return { quest: byId[id], stage: s };
    }
    return null;
  }

  function bossQuestFor(enemyId) {
    for (const id of order) {
      const q = byId[id];
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

  /* questions for "review" fights vs enemies outside the active quest */
  function reviewPool() {
    const pool = [];
    for (const id of order) {
      const r = rec(id);
      if (r) pool.push(...byId[id].questions);
    }
    return pool;
  }

  function lessonsLearned() {
    return order.filter((id) => rec(id)).map((id) => byId[id]);
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

  return { order, byId, get, idx, stage, isDone, questForNpc, npcMarker, accept, onKill,
           activeKillQuest, currentQuest, bossQuestFor, completeChallenge, reviewPool,
           lessonsLearned, objectiveText };
})();
