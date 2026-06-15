/* ============================================================
   SaveSystem — localStorage character slots
   ============================================================ */
window.SaveSystem = (function () {
  const KEY = "aofk_save_v1";
  const SLOTS = 3;

  function loadAll() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return new Array(SLOTS).fill(null);
      const arr = JSON.parse(raw);
      while (arr.length < SLOTS) arr.push(null);
      return arr;
    } catch (e) {
      console.error("Save load failed", e);
      return new Array(SLOTS).fill(null);
    }
  }

  function saveAll(slots) {
    try { localStorage.setItem(KEY, JSON.stringify(slots)); }
    catch (e) { console.error("Save failed", e); }
  }

  return {
    SLOTS,
    getSlots() { return loadAll(); },
    save(slotIndex, state) {
      const slots = loadAll();
      state.savedAt = Date.now();
      slots[slotIndex] = state;
      saveAll(slots);
    },
    erase(slotIndex) {
      const slots = loadAll();
      slots[slotIndex] = null;
      saveAll(slots);
    },
    newState(slotIndex, name, faction, appearance) {
      return {
        version: 1,
        slot: slotIndex,
        name, faction, appearance,
        level: 1, xp: 0,
        maxHp: 20, hp: 20,
        coins: 30,
        map: "village", x: 31, y: 27, facing: "down",
        inventory: [
          { id: "ashen_salve", qty: 2 }
        ],
        equipment: { weapon: "dull_blade", armor: "tattered_cloak", charm: null },
        quests: {},          // questId -> {stage, kills, frags}
        codeDrafts: {},      // questId -> source text
        hintsUsed: {},       // questId -> count
        kills: 0, deaths: 0, bossKills: 0,
        ending: null,
        settings: { sound: true },
        playtime: 0,
        createdAt: Date.now(), savedAt: Date.now(),
        introSeen: false
      };
    }
  };
})();
