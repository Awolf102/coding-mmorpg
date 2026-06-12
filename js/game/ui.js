/* ============================================================
   UI — sidebar panels, chat, modals, dialogue, tome, shop,
   reward screens, and the code-trial editor (Pyodide-backed).
   ============================================================ */
window.UI = (function () {
  let currentTab = "inventory";
  let tooltipEl = null;
  let openModals = [];

  /* ---------------- text helpers ---------------- */
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  /* inline markdown-ish: `code`, **bold**, keep <b>/<i> tags from data */
  function mdInline(s) {
    if (s == null) return "";
    let out = "";
    let safe = String(s);
    // protect intentional tags <b> <i> </b> </i>
    safe = safe.replace(/<(\/?[bi])>/g, "$1");
    safe = escapeHtml(safe);
    safe = safe.replace(/(\/?[bi])/g, "<$1>");
    out = safe
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
    return out;
  }
  /* lesson/prompt bodies: array of paragraphs; ">>>" prefix = code block */
  function renderRich(body) {
    const arr = Array.isArray(body) ? body : [body];
    let html = "";
    for (const seg of arr) {
      if (typeof seg === "string" && seg.startsWith(">>>")) {
        html += `<pre>${escapeHtml(seg.slice(3))}</pre>`;
      } else {
        html += `<p>${mdInline(seg)}</p>`;
      }
    }
    return html;
  }

  function itemIconCanvas(item, size) {
    const c = document.createElement("canvas");
    c.width = c.height = size || 40;
    Sprites.drawItemIcon(c, item);
    return c;
  }

  /* ---------------- chat ---------------- */
  function chat(text, cls) {
    const box = document.getElementById("chat-messages");
    if (!box) return;
    const div = document.createElement("div");
    div.className = cls || "chat-game";
    div.innerHTML = mdInline(text);
    box.appendChild(div);
    while (box.children.length > 90) box.removeChild(box.firstChild);
    box.scrollTop = box.scrollHeight;
  }

  /* ---------------- toast / banner / hintbar ---------------- */
  function toast(text, big) {
    const root = document.getElementById("toast-root");
    const t = document.createElement("div");
    t.className = "toast" + (big ? " big" : "");
    t.innerHTML = mdInline(text);
    root.appendChild(t);
    setTimeout(() => t.remove(), 3900);
  }
  function showBanner(text) {
    const b = document.getElementById("location-banner");
    b.classList.add("hidden");
    void b.offsetWidth;
    b.textContent = text;
    b.classList.remove("hidden");
  }
  function updateHintBar(text) {
    const h = document.getElementById("hint-bar");
    if (!text) { h.classList.add("hidden"); return; }
    h.innerHTML = mdInline(text);
    h.classList.remove("hidden");
  }

  /* ---------------- tooltip ---------------- */
  function ensureTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.id = "tooltip";
      tooltipEl.style.display = "none";
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }
  function bindTooltip(el, htmlFn) {
    el.addEventListener("mouseenter", () => {
      const tt = ensureTooltip();
      tt.innerHTML = htmlFn();
      tt.style.display = "block";
    });
    el.addEventListener("mousemove", (e) => {
      const tt = ensureTooltip();
      const x = Math.min(e.clientX + 14, window.innerWidth - tt.offsetWidth - 8);
      const y = Math.min(e.clientY + 14, window.innerHeight - tt.offsetHeight - 8);
      tt.style.left = x + "px"; tt.style.top = y + "px";
    });
    el.addEventListener("mouseleave", () => { if (tooltipEl) tooltipEl.style.display = "none"; });
  }
  function hideTooltip() { if (tooltipEl) tooltipEl.style.display = "none"; }

  function itemTooltipHtml(item, extra) {
    let h = `<div class="tt-name r-${item.rarity}">${escapeHtml(item.name)}</div>`;
    h += `<div style="font-size:10px;color:#8d7c58;text-transform:uppercase">${item.rarity} ${item.slot}</div>`;
    if (item.dmg) h += `<div class="tt-stat">⚔ ${item.dmg} damage per correct answer</div>`;
    if (item.def) h += `<div class="tt-stat">🛡 blocks ${item.def} damage on wrong answers</div>`;
    if (item.heal) h += `<div class="tt-stat">❤ restores ${item.heal >= 999 ? "ALL" : item.heal} HP</div>`;
    if (item.xpBoost) h += `<div class="tt-stat">✨ +${Math.round(item.xpBoost * 100)}% experience</div>`;
    if (item.freeHint) h += `<div class="tt-stat">📜 first trial hint is free</div>`;
    if (item.hintToken) h += `<div class="tt-stat">📜 spend in a code trial for a free hint</div>`;
    h += `<div class="tt-desc">${escapeHtml(item.desc)}</div>`;
    if (extra) h += `<div class="tt-act">${extra}</div>`;
    return h;
  }

  /* ---------------- modal system ---------------- */
  function modal(html, opts) {
    opts = opts || {};
    const root = document.getElementById("modal-root");
    const veil = document.createElement("div");
    veil.className = "modal-veil";
    const box = document.createElement("div");
    box.className = "modal " + (opts.className || "");
    box.innerHTML = html;
    veil.appendChild(box);
    root.appendChild(veil);
    const entry = { veil, box, close: null };
    entry.close = () => {
      if (!veil.parentNode) return;
      veil.remove();
      openModals = openModals.filter((m) => m !== entry);
      if (opts.onClose) opts.onClose();
      hideTooltip();
    };
    if (opts.closable !== false) {
      const x = document.createElement("button");
      x.className = "btn btn-small modal-close";
      x.textContent = "✕";
      x.onclick = () => { AudioFX.click(); entry.close(); };
      box.appendChild(x);
    }
    openModals.push(entry);
    AudioFX.open();
    return entry;
  }
  function closeAllModals() { [...openModals].forEach((m) => m.close()); }
  function isModalOpen() { return openModals.length > 0; }

  /* ---------------- sidebar tabs ---------------- */
  const TABS = [
    { id: "inventory", icon: "🎒", label: "Inventory" },
    { id: "equipment", icon: "⚔", label: "Equipment" },
    { id: "skills", icon: "📊", label: "Skills" },
    { id: "quests", icon: "📜", label: "Quests" },
    { id: "settings", icon: "⚙", label: "Settings" }
  ];

  function init() {
    const bar = document.getElementById("tab-bar");
    bar.innerHTML = "";
    for (const t of TABS) {
      const b = document.createElement("div");
      b.className = "tab-btn" + (t.id === currentTab ? " active" : "");
      b.textContent = t.icon;
      b.title = t.label;
      b.dataset.tab = t.id;
      b.onclick = () => { AudioFX.click(); setTab(t.id); };
      bar.appendChild(b);
    }
    setTab(currentTab);

    const input = document.getElementById("chat-input");
    input.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter" && input.value.trim()) {
        chat(`${Game.state.name}: ${input.value.trim()}`, "chat-player");
        Game.maybeAmbientReply(input.value.trim());
        input.value = "";
        input.blur();
      }
      if (e.key === "Escape") input.blur();
    });
  }

  function setTab(id) {
    currentTab = id;
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === id));
    renderPanel();
  }

  function refresh() {
    const s = Game.state;
    if (!s) return;
    // orbs
    const hpFill = document.getElementById("orb-hp-fill");
    hpFill.style.height = Math.max(0, s.hp / s.maxHp * 100) + "%";
    document.getElementById("orb-hp-text").textContent = s.hp;
    const need = Game.xpForLevel(s.level + 1), prev = Game.xpForLevel(s.level);
    document.getElementById("orb-xp-fill").style.height = Math.min(100, (s.xp - prev) / (need - prev) * 100) + "%";
    document.getElementById("orb-lv-text").textContent = s.level;
    document.getElementById("coin-text").textContent = s.coins;
    document.getElementById("chat-name").textContent = s.name + ":";
    renderPanel();
  }

  function renderPanel() {
    const area = document.getElementById("panel-area");
    if (!Game.state) return;
    if (currentTab === "inventory") renderInventory(area);
    else if (currentTab === "equipment") renderEquipment(area);
    else if (currentTab === "skills") renderSkills(area);
    else if (currentTab === "quests") renderQuests(area);
    else if (currentTab === "settings") renderSettings(area);
  }

  /* ---------------- inventory panel ---------------- */
  function renderInventory(area) {
    const s = Game.state;
    area.innerHTML = `<div class="panel-title">Inventory</div><div id="inv-grid"></div>`;
    const grid = area.querySelector("#inv-grid");
    const SLOTS = 24;
    for (let i = 0; i < SLOTS; i++) {
      const slot = document.createElement("div");
      slot.className = "inv-slot";
      const entry = s.inventory[i];
      if (entry) {
        const item = ITEMS[entry.id];
        slot.appendChild(itemIconCanvas(item, 40));
        if (entry.qty > 1) {
          const q = document.createElement("span");
          q.className = "inv-qty"; q.textContent = entry.qty;
          slot.appendChild(q);
        }
        const action = item.slot === "consumable"
          ? (item.heal ? "Click to drink" : "Spend during a code trial (Hint button)")
          : (item.slot === "weapon" || item.slot === "armor" || item.slot === "charm") ? "Click to equip" : "";
        bindTooltip(slot, () => itemTooltipHtml(item, action));
        slot.onclick = () => { AudioFX.click(); Game.clickInventory(i); };
      }
      grid.appendChild(slot);
    }
  }

  /* ---------------- equipment panel ---------------- */
  function renderEquipment(area) {
    const s = Game.state;
    const eq = Game.equipStats();
    area.innerHTML = `<div class="panel-title">Equipment</div><div class="equip-grid" id="eq-grid"></div>
      <div class="stat-block">
        <div class="stat-line"><span>⚔ Damage / answer</span><b>${eq.dmg}</b></div>
        <div class="stat-line"><span>🛡 Damage blocked</span><b>${eq.def}</b></div>
        <div class="stat-line"><span>✨ XP bonus</span><b>+${Math.round(eq.xpBoost * 100)}%</b></div>
        <div class="stat-line"><span>📜 Free first hint</span><b>${eq.freeHint ? "Yes" : "No"}</b></div>
      </div>`;
    const grid = area.querySelector("#eq-grid");
    for (const kind of ["weapon", "armor", "charm"]) {
      const id = s.equipment[kind];
      const item = id ? ITEMS[id] : null;
      const row = document.createElement("div");
      row.className = "equip-slot";
      if (item) {
        row.appendChild(itemIconCanvas(item, 36));
        row.innerHTML += `<div><div class="equip-kind">${kind}</div><div class="equip-name r-${item.rarity}">${escapeHtml(item.name)}</div></div>`;
        bindTooltip(row, () => itemTooltipHtml(item, kind === "weapon" ? "" : "Click to unequip"));
        if (kind !== "weapon") row.onclick = () => { AudioFX.click(); Game.unequip(kind); };
      } else {
        row.innerHTML = `<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:#574a37;font-size:20px">∅</div>
          <div><div class="equip-kind">${kind}</div><div class="equip-name" style="color:#8d7c58">— empty —</div></div>`;
      }
      grid.appendChild(row);
    }
  }

  /* ---------------- skills panel ---------------- */
  function renderSkills(area) {
    const s = Game.state;
    const need = Game.xpForLevel(s.level + 1), prev = Game.xpForLevel(s.level);
    const pct = Math.min(100, (s.xp - prev) / (need - prev) * 100);
    const lessons = Quests.lessonsLearned();
    let mastery = "";
    for (const q of window.QUEST_DB) {
      const r = Game.state.quests[q.id];
      const learned = !!r;
      const done = r && r.stage === "done";
      mastery += `<div class="mastery-row ${learned ? "learned" : ""}">
        <div class="dot" ${done ? 'style="background:#ffd23f;box-shadow:0 0 6px #ffd23f88"' : ""}></div>
        <div class="m-name">${learned ? escapeHtml(q.lesson.title) : "??? — undiscovered"}</div></div>`;
    }
    area.innerHTML = `<div class="panel-title">Skills — Way of the Serpent</div>
      <div style="font-size:11px;color:#cdbb92">${escapeHtml(s.name)}${s.titleEarned ? `, <span style="color:#ffd64f">${escapeHtml(s.titleEarned)}</span>` : ""}</div>
      <div class="stat-block" style="margin-top:8px">
        <div class="stat-line"><span>Level</span><b>${s.level}</b></div>
        <div class="xp-bar-outer"><div class="xp-bar-inner" style="width:${pct}%"></div></div>
        <div style="font-size:10px;color:#9a8c6c;text-align:right">${s.xp - prev} / ${need - prev} XP to level ${s.level + 1}</div>
        <div class="stat-line"><span>Hitpoints</span><b>${s.hp} / ${s.maxHp}</b></div>
        <div class="stat-line"><span>Kills</span><b>${s.kills}</b></div>
        <div class="stat-line"><span>Bosses felled</span><b>${s.bossKills}</b></div>
        <div class="stat-line"><span>Deaths</span><b>${s.deaths}</b></div>
        <div class="stat-line"><span>Lessons mastered</span><b>${lessons.filter(q => Game.state.quests[q.id].stage === "done").length} / ${window.QUEST_DB.length}</b></div>
      </div>
      <div class="panel-title" style="margin-top:12px">Python Masteries</div>${mastery}`;
  }

  /* ---------------- quests panel ---------------- */
  const ACT_NAMES = {
    1: "Act I — Ashveil Village", 2: "Act II — Emberwood Forest", 3: "Act III — The Sunken Ruins",
    4: "Act IV — Kingsfall Citadel", 5: "Act V — The Flame Sanctum"
  };
  function renderQuests(area) {
    let html = `<div class="panel-title">Quest Journal</div>`;
    let act = 0;
    for (const q of window.QUEST_DB) {
      if (q.act !== act) { act = q.act; html += `<div class="q-act-header">${ACT_NAMES[act]}</div>`; }
      const s = Quests.stage(q.id);
      if (s === "locked") {
        html += `<div class="quest-entry" style="opacity:.45;cursor:default"><div class="q-name" style="color:#8d7c58">🔒 ???</div></div>`;
        continue;
      }
      const icon = s === "done" ? "✔" : q.boss ? "☠" : "•";
      html += `<div class="quest-entry ${s === "done" ? "q-done" : ""}" data-q="${q.id}">
        <div class="q-name">${icon} ${escapeHtml(q.title)}</div>
        <div class="q-obj">${escapeHtml(Quests.objectiveText(q, s))}</div>
      </div>`;
    }
    area.innerHTML = html;
    area.querySelectorAll(".quest-entry[data-q]").forEach((el) => {
      el.onclick = () => {
        AudioFX.click();
        const q = Quests.get(el.dataset.q);
        if (Game.state.quests[q.id]) openTome(q);
        else toast(`Speak with ${NPCS[q.npc].name} in ${MAPS[q.map].name} to begin.`);
      };
    });
  }

  /* ---------------- settings panel ---------------- */
  function renderSettings(area) {
    const s = Game.state;
    area.innerHTML = `<div class="panel-title">Settings</div>
      <div class="setting-row"><span>Sound effects</span><button class="btn btn-small" id="set-sound">${s.settings.sound ? "ON" : "OFF"}</button></div>
      <div class="setting-row"><span>How to play</span><button class="btn btn-small" id="set-help">Open</button></div>
      <div class="setting-row"><span>Save &amp; exit to title</span><button class="btn btn-small" id="set-exit">Exit</button></div>
      <div style="margin-top:14px;font-size:10px;color:#7e7050;line-height:1.6">
        Ashes of the First Kingdom v1.0<br>The Python Chronicle.<br>
        Python runs in your browser via Pyodide (internet required for code trials).
      </div>`;
    area.querySelector("#set-sound").onclick = (e) => {
      s.settings.sound = !s.settings.sound;
      AudioFX.setEnabled(s.settings.sound);
      e.target.textContent = s.settings.sound ? "ON" : "OFF";
      AudioFX.click();
      Game.save();
    };
    area.querySelector("#set-help").onclick = () => { AudioFX.click(); showHelp(); };
    area.querySelector("#set-exit").onclick = () => { AudioFX.click(); Game.exitToTitle(); };
  }

  function showHelp() {
    modal(`<h2 class="gold-header">How to Play</h2>
      <div class="tome-body" style="max-height:60vh">
        <h3>Moving</h3><p><b>Click</b> anywhere walkable to travel there (a yellow marker shows your destination), or use <b>WASD / arrow keys</b>.</p>
        <h3>Quests</h3><p>NPCs with a golden <b>!</b> have a quest. Quests teach a Python lesson, recorded in your <b>Tome</b> (Quest Journal → click the quest). Slaying quest monsters reveals extra Tome fragments.</p>
        <h3>Combat</h3><p>Click a monster next to you to engage. Answer Python questions: correct answers strike with your weapon's damage; wrong answers hurt you (armor reduces the pain). Flee any time.</p>
        <h3>Trials of Code</h3><p>When a quest's monsters are slain, return to the quest giver and write <b>real Python</b> in the editor. Run your code against the tests. Hints are available — the first is free.</p>
        <h3>Bosses</h3><p>Bosses ask a gauntlet of questions, then demand a full program. Failed runs against a boss cost HP!</p>
        <h3>Gear</h3><p>Better weapons defeat monsters in fewer answers. Armor blunts wrong-answer damage. Charms boost XP and grant free hints. Buy from merchants, loot from monsters, earn from quests.</p>
      </div>
      <div class="row-center" style="margin-top:10px"><button class="btn" onclick="this.closest('.modal-veil').remove()">Understood</button></div>`,
      { className: "modal-tome" });
  }

  /* ---------------- dialogue ---------------- */
  function openDialogue(npcDef) {
    if (npcDef.id === "flame") {
      if (Quests.isDone("py23")) { Game.beginEnding(); return; }
      modal(`<div class="dlg-head"><canvas width="72" height="72" id="dlg-face"></canvas>
        <div><div class="dlg-npc-name">The Eternal Flame</div><div class="dlg-npc-title">That Which Remains</div></div></div>
        <div class="dlg-body"><i>The Flame towers silently. Heat without warmth. It is waiting for something — perhaps for you to be ready.</i></div>
        <div class="dlg-buttons"><button class="btn" onclick="this.closest('.modal-veil').remove()">Step back</button></div>`,
        { className: "modal-dialogue" });
      Sprites.drawNPCInto(document.getElementById("dlg-face"), npcDef);
      return;
    }

    const qf = Quests.questForNpc(npcDef.id);
    let body = "", buttons = [];

    if (qf) {
      const { quest, stage } = qf;
      if (stage === "available") {
        body = quest.intro.map((p) => `<p>${mdInline(p)}</p>`).join("");
        buttons.push({ label: `🔥 ${quest.acceptLabel}`, cls: "btn-flame", fn: (m) => { m.close(); Quests.accept(quest); openTome(quest, { fresh: true }); } });
        buttons.push({ label: "Not yet", fn: (m) => m.close() });
      } else if (stage === "active" || stage === "boss") {
        body = `<p>${mdInline(quest.midDialogue)}</p>`;
        const r = Game.state.quests[quest.id];
        if (stage === "active") body += `<p><b>${ENEMIES[quest.kills.enemy].name}s slain: ${r.kills} / ${quest.kills.count}</b></p>`;
        buttons.push({ label: "📖 Review the Tome", fn: (m) => { m.close(); openTome(quest); } });
        buttons.push({ label: "Farewell", fn: (m) => m.close() });
      } else if (stage === "return") {
        body = quest.returnDialogue.map((p) => `<p>${mdInline(p)}</p>`).join("");
        buttons.push({ label: "⚡ Begin the Trial of Code", cls: "btn-flame", fn: (m) => { m.close(); openChallenge(quest, {}); } });
        buttons.push({ label: "📖 Review the Tome", fn: (m) => { m.close(); openTome(quest); } });
        buttons.push({ label: "I need a moment", fn: (m) => m.close() });
      }
    } else {
      const lastDone = [...Quests.order].reverse().find((id) => Quests.isDone(id) && Quests.get(id).npc === npcDef.id);
      if (lastDone) body = `<p>${mdInline(Quests.get(lastDone).doneDialogue)}</p>`;
      else body = `<p><i>${mdInline(npcDef.lines[Math.floor(Math.random() * npcDef.lines.length)])}</i></p>`;
      buttons.push({ label: "Farewell", fn: (m) => m.close() });
    }
    if (npcDef.shop) buttons.splice(buttons.length - 1, 0, { label: "💰 Browse wares", fn: (m) => { m.close(); openShop(npcDef); } });

    const m = modal(`<div class="dlg-head"><canvas width="72" height="72" id="dlg-face"></canvas>
      <div><div class="dlg-npc-name">${escapeHtml(npcDef.name)}</div><div class="dlg-npc-title">${escapeHtml(npcDef.title)}</div></div></div>
      <div class="dlg-body">${body}</div>
      <div class="dlg-buttons" id="dlg-btns"></div>`, { className: "modal-dialogue" });
    Sprites.drawNPCInto(m.box.querySelector("#dlg-face"), npcDef);
    const btnRow = m.box.querySelector("#dlg-btns");
    for (const b of buttons) {
      const el = document.createElement("button");
      el.className = "btn " + (b.cls || "");
      el.innerHTML = b.label;
      el.onclick = () => { AudioFX.click(); b.fn(m); };
      btnRow.appendChild(el);
    }
  }

  /* ---------------- tome (lesson viewer) ---------------- */
  function openTome(quest, opts) {
    opts = opts || {};
    const r = Game.state.quests[quest.id];
    let html = `<h2 class="gold-header">📖 ${escapeHtml(quest.lesson.title)}</h2><div class="tome-body">`;
    if (opts.fresh) html += `<p><i>A new chapter sears itself into your Tome of Embers...</i></p>`;
    html += renderRich(quest.lesson.body);
    if (quest.lesson.fragments && quest.lesson.fragments.length) {
      const got = r ? r.frags : 0;
      for (let i = 0; i < quest.lesson.fragments.length; i++) {
        if (i < got) html += `<div class="tome-frag"><div class="frag-tag">Tome Fragment ${i + 1}</div>${mdInline(quest.lesson.fragments[i])}</div>`;
        else html += `<div class="tome-frag-locked">🔒 Fragment ${i + 1} — sealed. Slay more ${quest.kills ? ENEMIES[quest.kills.enemy].name + "s" : "foes"} to reveal it.</div>`;
      }
    }
    html += `</div><div class="dlg-buttons" id="tome-btns"></div>`;
    const m = modal(html, { className: "modal-tome" });
    const btns = m.box.querySelector("#tome-btns");
    const stage = Quests.stage(quest.id);
    if (stage === "return") {
      const b = document.createElement("button");
      b.className = "btn btn-flame";
      b.textContent = "⚡ Begin the Trial of Code";
      b.onclick = () => { AudioFX.click(); m.close(); openChallenge(quest, {}); };
      btns.appendChild(b);
    }
    const c = document.createElement("button");
    c.className = "btn";
    c.textContent = "Close the Tome";
    c.onclick = () => { AudioFX.click(); m.close(); };
    btns.appendChild(c);
  }

  /* ---------------- shop ---------------- */
  function openShop(npcDef) {
    const stock = SHOPS[npcDef.shop] || [];
    const m = modal(`<h2 class="gold-header">💰 ${escapeHtml(npcDef.name)}'s Wares</h2>
      <div style="text-align:center;color:#ffd64f;font-size:13px;margin-bottom:10px">Your coins: <b id="shop-coins">${Game.state.coins}</b></div>
      <div id="shop-buy"></div>
      <div class="panel-title" style="margin-top:14px">Sell your goods (half price)</div>
      <div id="shop-sell"></div>`, { className: "modal-shop" });

    function renderShop() {
      m.box.querySelector("#shop-coins").textContent = Game.state.coins;
      const buyEl = m.box.querySelector("#shop-buy");
      buyEl.innerHTML = "";
      for (const id of stock) {
        const item = ITEMS[id];
        const row = document.createElement("div");
        row.className = "shop-row";
        row.appendChild(itemIconCanvas(item, 40));
        const info = document.createElement("div");
        info.className = "shop-info";
        info.innerHTML = `<div class="shop-name r-${item.rarity}">${escapeHtml(item.name)}</div><div class="shop-desc">${escapeHtml(item.desc)}</div>`;
        row.appendChild(info);
        const price = document.createElement("div");
        price.className = "shop-price"; price.textContent = item.price + "c";
        row.appendChild(price);
        const buy = document.createElement("button");
        buy.className = "btn btn-small";
        buy.textContent = "Buy";
        buy.disabled = Game.state.coins < item.price;
        buy.onclick = () => {
          if (Game.state.coins < item.price) return;
          Game.addCoins(-item.price);
          Game.addItem(id, 1);
          AudioFX.coin();
          renderShop(); refresh();
        };
        row.appendChild(buy);
        bindTooltip(row, () => itemTooltipHtml(item));
        buyEl.appendChild(row);
      }
      const sellEl = m.box.querySelector("#shop-sell");
      sellEl.innerHTML = "";
      const sellables = Game.state.inventory.filter((e) => e && !Game.isEquipped(e.id));
      if (!sellables.length) sellEl.innerHTML = `<div class="dim" style="padding:6px">Nothing to sell.</div>`;
      for (const entry of sellables) {
        const item = ITEMS[entry.id];
        const val = Math.floor(item.price / 2);
        const row = document.createElement("div");
        row.className = "shop-row";
        row.appendChild(itemIconCanvas(item, 40));
        const info = document.createElement("div");
        info.className = "shop-info";
        info.innerHTML = `<div class="shop-name r-${item.rarity}">${escapeHtml(item.name)}${entry.qty > 1 ? " ×" + entry.qty : ""}</div>`;
        row.appendChild(info);
        const price = document.createElement("div");
        price.className = "shop-price"; price.textContent = val + "c";
        row.appendChild(price);
        const sell = document.createElement("button");
        sell.className = "btn btn-small";
        sell.textContent = "Sell";
        sell.onclick = () => {
          Game.removeItem(entry.id, 1);
          Game.addCoins(val);
          AudioFX.coin();
          renderShop(); refresh();
        };
        row.appendChild(sell);
        sellEl.appendChild(row);
      }
    }
    renderShop();
  }

  /* ---------------- the code trial editor ---------------- */
  function openChallenge(quest, opts) {
    opts = opts || {};
    const ch = quest.challenge;
    const isBoss = !!opts.boss;
    const draft = Game.state.codeDrafts[quest.id] || ch.starter;

    let probHtml = `<h3>${escapeHtml(ch.title)}</h3>`;
    probHtml += `<p><i>${mdInline(ch.story)}</i></p>`;
    probHtml += renderRich(ch.prompt);
    if (ch.mode === "program" && ch.given) {
      probHtml += `<p><b>Given variables:</b> <code>${escapeHtml(ch.given)}</code> — they already exist; just use them.</p>`;
    }

    const m = modal(`
      <h2 class="gold-header">${isBoss ? "☠ BOSS TRIAL — " : "⚡ Trial of Code — "}${escapeHtml(quest.title)}</h2>
      <div class="code-cols">
        <div class="code-left"><div class="code-problem">${probHtml}</div></div>
        <div class="code-right">
          <div class="editor-wrap">
            <div class="editor-gutter" id="ed-gutter">1</div>
            <textarea class="code-editor" id="ed-code" spellcheck="false"></textarea>
          </div>
          <div class="code-toolbar">
            <button class="btn btn-flame" id="ed-run">▶ Run the Rite</button>
            <button class="btn" id="ed-hint">💡 Hint</button>
            <button class="btn" id="ed-reset">Reset</button>
            <span class="py-status" id="ed-status"></span>
          </div>
          <div class="code-results" id="ed-results"><span class="t-dim">${isBoss ? "⚠ Each failed run lets the boss strike you! " : ""}Write your Python, then Run. The Flame is watching.</span></div>
        </div>
      </div>`,
      { className: "modal-code", closable: true, onClose: () => saveDraft() });

    const ta = m.box.querySelector("#ed-code");
    const gutter = m.box.querySelector("#ed-gutter");
    const results = m.box.querySelector("#ed-results");
    const status = m.box.querySelector("#ed-status");
    const runBtn = m.box.querySelector("#ed-run");
    ta.value = draft;

    function saveDraft() {
      Game.state.codeDrafts[quest.id] = ta.value;
      Game.save();
    }
    function syncGutter() {
      const lines = ta.value.split("\n").length;
      gutter.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
      gutter.scrollTop = ta.scrollTop;
    }
    ta.addEventListener("scroll", () => { gutter.scrollTop = ta.scrollTop; });
    ta.addEventListener("input", syncGutter);
    ta.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Tab") {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
        syncGutter();
      } else if (e.key === "Enter") {
        e.preventDefault();
        const s = ta.selectionStart;
        const before = ta.value.slice(0, s);
        const line = before.slice(before.lastIndexOf("\n") + 1);
        let indent = (line.match(/^\s*/) || [""])[0];
        if (line.trimEnd().endsWith(":")) indent += "    ";
        const insert = "\n" + indent;
        ta.value = before + insert + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + insert.length;
        syncGutter();
      }
    });
    syncGutter();

    m.box.querySelector("#ed-reset").onclick = () => {
      AudioFX.click();
      if (ta.value !== ch.starter && !confirm("Reset your code to the starter?")) return;
      ta.value = ch.starter;
      syncGutter();
    };

    /* hints */
    m.box.querySelector("#ed-hint").onclick = () => {
      AudioFX.click();
      const used = Game.state.hintsUsed[quest.id] || 0;
      if (used >= ch.hints.length) {
        results.innerHTML = `<span class="t-dim">No hints remain — but the final hint held the full answer. Scroll wisely.</span>`;
        return;
      }
      const eq = Game.equipStats();
      const freeHints = eq.freeHint ? 2 : 1;
      let cost = 0, useScroll = false;
      if (used >= freeHints) {
        if (Game.hasItem("scroll_of_insight")) useScroll = true;
        else cost = 20 + quest.act * 10;
      }
      const pay = () => {
        if (useScroll) { Game.removeItem("scroll_of_insight", 1); chat("A Scroll of Insight crumbles to ash...", "chat-sys"); }
        else if (cost > 0) {
          if (Game.state.coins < cost) { results.innerHTML = `<span class="t-fail">This hint costs ${cost} coins (or a Scroll of Insight) — you cannot afford it.</span>`; return false; }
          Game.addCoins(-cost);
        }
        return true;
      };
      if (!pay()) return;
      Game.state.hintsUsed[quest.id] = used + 1;
      Game.save(); refresh();
      const label = useScroll ? "(scroll spent)" : cost > 0 ? `(-${cost} coins)` : "(free)";
      results.innerHTML = `<span class="t-dim">💡 Hint ${used + 1}/${ch.hints.length} ${label}:</span>\n${escapeHtml(ch.hints[used])}`;
    };

    /* run */
    runBtn.onclick = async () => {
      AudioFX.click();
      saveDraft();
      runBtn.disabled = true;
      status.textContent = Py.getStatus() === "ready" ? "Casting..." : "Summoning the Serpent Spirit (first time takes a moment)...";
      results.innerHTML = `<span class="t-dim">Running your Python...</span>`;
      try {
        const out = await Py.runChallenge(ch, ta.value, (msg) => { status.textContent = msg; });
        status.textContent = "";
        renderResults(out);
      } catch (err) {
        status.textContent = "";
        results.innerHTML = `<span class="t-err">${escapeHtml(err.message || String(err))}</span>`;
      }
      runBtn.disabled = false;
    };

    function renderResults(out) {
      if (out.fatal) {
        AudioFX.wrong();
        results.innerHTML = `<span class="t-fail">✖ The rite collapses before it begins:</span>\n<span class="t-err">${escapeHtml(out.fatal)}</span>`;
        if (isBoss && opts.onFail) opts.onFail();
        return;
      }
      let html = "", passed = 0;
      out.results.forEach((r, i) => {
        const label = ch.tests[i].label || `Test ${i + 1}`;
        if (r.ok) { passed++; html += `<span class="t-pass">✔ ${escapeHtml(label)}</span>\n`; }
        else if (r.error) {
          html += `<span class="t-fail">✖ ${escapeHtml(label)}</span>\n  <span class="t-err">${escapeHtml(r.error)}</span>\n`;
        } else {
          html += `<span class="t-fail">✖ ${escapeHtml(label)}</span>\n` +
            `  <span class="t-dim">expected:</span> ${escapeHtml(r.expected)}\n` +
            `  <span class="t-dim">your code:</span> ${escapeHtml(r.got === "" ? "(nothing)" : r.got)}\n`;
          if (r.printed) html += `  <span class="t-dim">printed:</span> ${escapeHtml(r.printed.trim())}\n`;
        }
      });
      const all = passed === out.results.length;
      html = `<b class="${all ? "t-pass" : "t-fail"}">${passed} / ${out.results.length} trials passed</b>\n` + html;
      results.innerHTML = html;
      if (all) {
        AudioFX.victory();
        results.innerHTML += `\n<span class="t-pass"><b>🔥 The Flame accepts your rite!</b></span>`;
        runBtn.disabled = true;
        setTimeout(() => {
          m.close();
          if (isBoss) { if (opts.onWin) opts.onWin(); }
          else Quests.completeChallenge(quest);
        }, 900);
      } else {
        AudioFX.wrong();
        if (isBoss && opts.onFail) {
          const alive = opts.onFail();
          if (alive) refresh();
        }
      }
    }
  }

  /* ---------------- reward modal ---------------- */
  function showReward(quest) {
    const rw = quest.rewards;
    let items = "";
    for (const [id, qty] of rw.items || []) {
      const item = ITEMS[id];
      items += `<div class="reward-item"><canvas width="52" height="52" data-item="${id}"></canvas>
        <div class="nm r-${item.rarity}">${escapeHtml(item.name)}${qty > 1 ? " ×" + qty : ""}</div></div>`;
    }
    const m = modal(`
      <div class="reward-burst">🔥</div>
      <h2 class="gold-header">Quest Complete</h2>
      <div style="color:#e8d8b0;font-family:Georgia,serif;font-size:15px">${escapeHtml(quest.title)}</div>
      <div style="margin-top:10px"><span class="t-pass" style="font-size:14px">+${rw.xp} XP</span> &nbsp;
        <span style="color:#ffd64f;font-size:14px">+${rw.coins} coins</span></div>
      ${rw.title ? `<div style="margin-top:8px;color:#ffd64f">Title earned: <b>${escapeHtml(rw.title)}</b></div>` : ""}
      <div class="reward-list">${items}</div>
      <button class="btn btn-flame" id="rw-ok">Onward</button>`,
      { className: "modal-reward", closable: false });
    m.box.querySelectorAll("canvas[data-item]").forEach((c) => Sprites.drawItemIcon(c, ITEMS[c.dataset.item]));
    m.box.querySelector("#rw-ok").onclick = () => { AudioFX.click(); m.close(); };
  }

  return {
    init, chat, toast, showBanner, updateHintBar, refresh, setTab,
    modal, closeAllModals, isModalOpen,
    openDialogue, openTome, openShop, openChallenge, showReward, showHelp,
    escapeHtml, mdInline, renderRich, itemIconCanvas, bindTooltip, hideTooltip
  };
})();
