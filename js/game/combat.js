/* ============================================================
   Combat — RuneScape-style encounter, but your weapon is
   knowledge: correct answers deal damage, wrong answers hurt.
   Bosses end with a full code trial.
   ============================================================ */
window.Combat = (function () {
  let active = null; // {ent, q, mode, questions, qi, enemyHp, modal, anim}

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function normalizeAnswer(s) {
    return String(s).replace(/\r\n/g, "\n").split("\n")
      .map((l) => l.replace(/\s+$/g, "")).join("\n")
      .replace(/^\n+|\n+$/g, "").trim();
  }

  /* Does `given` match `expected`? Exact match first; if the expected
     answer is a sequence of single tokens (e.g. "0\n1\n2"), also accept
     the same tokens separated by spaces or commas ("0 1 2", "0, 1, 2"). */
  function answerMatches(expected, given) {
    const exp = normalizeAnswer(expected);
    const got = normalizeAnswer(given);
    if (exp === got) return true;
    const expLines = exp.split("\n");
    if (expLines.length > 1 && expLines.every((l) => !/\s/.test(l))) {
      const tokens = got.split(/[\s,]+/).filter(Boolean);
      return tokens.join("\n") === expLines.join("\n");
    }
    return false;
  }

  function start(ent) {
    if (active) return;
    const def = ent.def;
    let mode = "review", quest = null;

    const kq = Quests.activeKillQuest();
    if (kq && kq.kills.enemy === def.id) { mode = "quest"; quest = kq; }
    const bq = Quests.bossQuestFor(def.id);
    if (bq) { mode = "boss"; quest = bq; }

    let questions;
    if (mode === "review") {
      questions = Quests.reviewPool(def);
      if (!questions.length) {
        UI.chat("You don't yet know any words of power. Seek a quest first!", "chat-warn");
        return;
      }
    } else {
      questions = quest.questions;
    }

    const html = `
      <div class="combat-head">
        <canvas class="combat-foe-art" id="cb-foe" width="110" height="110"></canvas>
        <div class="combat-foe-info">
          <div class="combat-foe-name">${UI.escapeHtml(def.name)}</div>
          <div class="combat-foe-lv">Level ${def.level}${def.boss ? " — <span style='color:#ff8a5c'>BOSS</span>" : ""}${mode === "review" ? " — <span style='color:#8fd6ff'>review battle</span>" : ""}</div>
          <div class="hp-bar"><div class="hp-bar-fill" id="cb-foe-hp" style="width:100%"></div><span id="cb-foe-hp-t"></span></div>
        </div>
        <div class="combat-mine">
          <div class="lbl">YOUR HITPOINTS</div>
          <div class="hp-bar mine"><div class="hp-bar-fill" id="cb-my-hp"></div><span id="cb-my-hp-t"></span></div>
          <div class="lbl" style="margin-top:6px" id="cb-weapon"></div>
        </div>
      </div>
      <div class="combat-q" id="cb-q"></div>
      <div class="combat-answers" id="cb-answers"></div>
      <div class="combat-feedback hidden" id="cb-feedback"></div>
      <div class="combat-foot">
        <button class="btn btn-small" id="cb-flee">🏃 Flee</button>
        <div class="py-status" id="cb-status"></div>
      </div>`;

    const modal = UI.modal(html, { className: "modal-combat", closable: false });
    const foeCanvas = modal.box.querySelector("#cb-foe");
    const anim = setInterval(() => Sprites.drawEnemyInto(foeCanvas, def), 120);

    active = {
      ent, def, mode, quest, modal, anim,
      enemyHp: def.hp, enemyMax: def.hp,
      questions: shuffle(questions), qi: 0, followUp: null
    };

    modal.box.querySelector("#cb-flee").onclick = () => {
      AudioFX.click();
      UI.chat(`You flee from the ${def.name}.`, "chat-game");
      end();
    };

    updateBars();
    nextQuestion();
  }

  function updateBars() {
    if (!active) return;
    const b = active.modal.box;
    const pct = Math.max(0, active.enemyHp / active.enemyMax) * 100;
    b.querySelector("#cb-foe-hp").style.width = pct + "%";
    b.querySelector("#cb-foe-hp-t").textContent = `${Math.max(0, active.enemyHp)} / ${active.enemyMax}`;
    const s = Game.state;
    b.querySelector("#cb-my-hp").style.width = (s.hp / s.maxHp * 100) + "%";
    b.querySelector("#cb-my-hp-t").textContent = `${s.hp} / ${s.maxHp}`;
    const eq = Game.equipStats();
    const wEl = b.querySelector("#cb-weapon");
    wEl.innerHTML = "";
    const wItem = Game.state.equipment.weapon ? ITEMS[Game.state.equipment.weapon] : null;
    if (wItem) {
      const icon = UI.itemIconCanvas(wItem, 22);
      icon.style.verticalAlign = "middle";
      icon.style.marginRight = "4px";
      wEl.appendChild(icon);
    }
    wEl.appendChild(document.createTextNode(`${wItem ? "" : "⚔ "}${eq.weaponName} (${eq.dmg} dmg/answer)`));
  }

  function currentQuestion() {
    if (active.qi >= active.questions.length) {
      const last = active.questions[active.questions.length - 1];
      active.questions = shuffle(active.questions);
      if (active.questions.length > 1 && active.questions[0] === last) {
        active.questions.push(active.questions.shift());
      }
      active.qi = 0;
    }
    return active.questions[active.qi];
  }

  function nextQuestion() {
    const b = active.modal.box;
    let q;
    if (active.followUp) {
      q = active.followUp;
      active.followUp = null;
    } else {
      q = currentQuestion();
      active.qi++;
    }
    b.querySelector("#cb-feedback").classList.add("hidden");
    const qEl = b.querySelector("#cb-q");
    let html = q.drill ? `<div class="drill-tag">⚡ Redemption drill — the idea you just missed, in a new form</div>` : "";
    html += `<div>${UI.mdInline(q.q)}</div>`;
    if (q.code) html += `<pre>${UI.escapeHtml(q.code)}</pre>`;
    qEl.innerHTML = html;

    const ansEl = b.querySelector("#cb-answers");
    ansEl.innerHTML = "";

    if (q.type === "tf") {
      for (const label of ["True", "False"]) {
        const btn = document.createElement("button");
        btn.className = "ans-btn";
        btn.textContent = label;
        btn.onclick = () => answer(q, (label === "True") === q.answer, q.answer ? "True" : "False");
        ansEl.appendChild(btn);
      }
    } else if (q.type === "mc") {
      const order = shuffle(q.choices.map((c, i) => i));
      for (const i of order) {
        const btn = document.createElement("button");
        btn.className = "ans-btn";
        btn.textContent = q.choices[i];
        btn.onclick = () => answer(q, i === q.answer, q.choices[q.answer]);
        ansEl.appendChild(btn);
      }
    } else {
      const multi = String(q.answer).includes("\n");
      const row = document.createElement("div");
      row.className = "ans-input-row";
      const input = document.createElement(multi ? "textarea" : "input");
      input.className = "ans-input";
      if (multi) { input.rows = Math.min(6, String(q.answer).split("\n").length + 1); input.placeholder = "Type the output (one value per line)..."; }
      else input.placeholder = q.type === "fill" ? "Fill the blank..." : "Type the exact output...";
      const go = document.createElement("button");
      go.className = "btn";
      go.textContent = "Cast";
      const submit = () => {
        const given = input.value;
        if (!normalizeAnswer(given)) return;
        const accepted = [q.answer].concat(q.accept || []);
        answer(q, accepted.some((a) => answerMatches(a, given)), q.answer);
      };
      go.onclick = submit;
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !multi) { e.preventDefault(); submit(); }
        if (e.key === "Enter" && multi && e.ctrlKey) { e.preventDefault(); submit(); }
        e.stopPropagation();
      });
      row.appendChild(input); row.appendChild(go);
      ansEl.appendChild(row);
      if (multi) {
        const tip = document.createElement("div");
        tip.className = "t-dim"; tip.style.fontSize = "10px"; tip.style.marginTop = "4px";
        tip.textContent = "Multi-line answer — Ctrl+Enter to cast.";
        ansEl.appendChild(tip);
      }
      setTimeout(() => input.focus(), 50);
    }
    b.querySelector("#cb-status").textContent =
      active.mode === "boss" ? "Break the boss's guard, then face the final trial!" :
      active.mode === "quest" ? "Each kill reveals a Tome fragment." : "Review battle — sharpening old knowledge.";
  }

  function answer(q, correct, correctDisplay) {
    const b = active.modal.box;
    b.querySelector("#cb-answers").innerHTML = "";
    const fb = b.querySelector("#cb-feedback");
    fb.classList.remove("hidden");

    if (correct) {
      const eq = Game.equipStats();
      active.enemyHp -= eq.dmg;
      AudioFX.correct(); AudioFX.hit();
      active.modal.box.classList.add("dmg-pop");
      setTimeout(() => active.modal.box.classList.remove("dmg-pop"), 380);
      updateBars();
      if (active.enemyHp <= 0) {
        if (active.mode === "boss") return bossGuardBroken(fb, q);
        return victory(fb, q);
      }
      fb.className = "combat-feedback good";
      fb.innerHTML = `<b>⚔ A telling blow! (-${eq.dmg})</b><br>${UI.mdInline(q.why)}<br>`;
      addContinue(fb, "Continue the assault");
    } else {
      const dmg = Math.max(1, active.def.dmg - Game.equipStats().def);
      const died = Game.damage(dmg);
      AudioFX.wrong(); AudioFX.hurt();
      updateBars();
      // re-test the missed concept right away, in a fresh form
      active.followUp = Drills.variantFor(q);
      fb.className = "combat-feedback bad";
      fb.innerHTML = `<b>✖ The ${UI.escapeHtml(active.def.name)} strikes you! (-${dmg} HP)</b><br>` +
        `Correct answer: <code>${UI.escapeHtml(String(correctDisplay))}</code><br>${UI.mdInline(q.why)}<br>` +
        (active.followUp ? `<i class="drill-note">The Flame will test this idea again — watch closely.</i><br>` : "");
      if (died) {
        const btn = document.createElement("button");
        btn.className = "btn btn-danger";
        btn.style.marginTop = "8px";
        btn.textContent = "Oh dear, you are dead.";
        btn.onclick = () => { end(); Game.onDeath(); };
        fb.appendChild(btn);
      } else {
        addContinue(fb, "Fight on");
      }
    }
  }

  function addContinue(fb, label) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.style.marginTop = "8px";
    btn.textContent = label;
    btn.onclick = () => { AudioFX.click(); nextQuestion(); updateBars(); };
    fb.appendChild(btn);
    btn.focus();
  }

  function rollLoot(def) {
    if (def.boss) return null;
    if (Math.random() > 0.14) return null;
    const table = LOOT_TABLES[def.act];
    if (!table) return null;
    const total = table.reduce((s, e) => s + e[1], 0);
    let r = Math.random() * total;
    for (const [id, w] of table) {
      r -= w;
      if (r <= 0) return id;
    }
    return null;
  }

  function victory(fb, q) {
    const def = active.def;
    const ent = active.ent;
    Game.killEnemy(ent);
    const coins = def.coins[0] + Math.floor(Math.random() * (def.coins[1] - def.coins[0] + 1));
    Game.addCoins(coins);
    const lootId = rollLoot(def);
    if (lootId) Game.addItem(lootId, 1);
    const frag = Quests.onKill(def.id);
    Game.addXp(def.xp);

    fb.className = "combat-feedback good";
    let html = `<b>☠ The ${UI.escapeHtml(def.name)} is slain!</b><br>` +
      `${UI.mdInline(q.why)}<br>` +
      `<span class="t-pass">+${def.xp} XP</span> &nbsp; <span style="color:#ffd64f">+${coins} coins</span>`;
    if (lootId) html += ` &nbsp; <span class="t-pass">Loot: ${UI.escapeHtml(ITEMS[lootId].name)}!</span>`;
    if (frag) html += `<div style="margin-top:8px;padding:8px;border:1px dashed #2f7a24;border-radius:4px"><b>📜 Tome fragment revealed:</b><br>${UI.mdInline(frag)}</div>`;
    fb.innerHTML = html;

    const btn = document.createElement("button");
    btn.className = "btn btn-flame";
    btn.style.marginTop = "10px";
    btn.textContent = "Claim victory";
    btn.onclick = () => end();
    fb.appendChild(btn);
    btn.focus();
    AudioFX.coin();
  }

  function bossGuardBroken(fb, q) {
    const quest = active.quest;
    const def = active.def;
    fb.className = "combat-feedback good";
    fb.innerHTML = `<b>🔥 ${UI.escapeHtml(def.name)}'s guard is BROKEN!</b><br>${UI.mdInline(q.why)}<br>` +
      `<i>The creature staggers... now is the moment for the final rite — a true trial of code!</i>`;
    const btn = document.createElement("button");
    btn.className = "btn btn-flame";
    btn.style.marginTop = "10px";
    btn.textContent = "⚡ Begin the Final Trial";
    btn.onclick = () => {
      const ent = active.ent;
      end();
      UI.openChallenge(quest, {
        boss: true,
        bossEnt: ent,
        onWin: () => bossDefeated(quest, ent),
        onFail: () => {
          const dmg = Math.max(1, def.dmg - Game.equipStats().def);
          const died = Game.damage(dmg);
          UI.chat(`${def.name} lashes out as your rite falters! (-${dmg} HP)`, "chat-warn");
          AudioFX.hurt();
          if (died) { UI.closeAllModals(); Game.onDeath(); return false; }
          return true;
        }
      });
    };
    fb.appendChild(btn);
    btn.focus();
  }

  function bossDefeated(quest, ent) {
    const def = ENEMIES[quest.bossEnemy];
    Game.killEnemy(ent, true);
    const coins = def.coins[0] + Math.floor(Math.random() * (def.coins[1] - def.coins[0] + 1));
    Game.addCoins(coins);
    Game.addXp(def.xp);
    Game.state.bossKills++;
    UI.chat(`${def.name} has been defeated!`, "chat-story");
    AudioFX.victory();
    Quests.completeChallenge(quest);
  }

  function end() {
    if (!active) return;
    clearInterval(active.anim);
    active.modal.close();
    active = null;
    Game.save();
    UI.refresh();
  }

  return {
    start,
    get inCombat() { return !!active; }
  };
})();
