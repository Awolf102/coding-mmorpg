/* ============================================================
   ENEMIES + NPCS
   Enemy hp is depleted by correct answers (weapon dmg each).
   Enemy dmg is what you take for a wrong answer (minus armor).
   ============================================================ */
window.ENEMIES = {
  /* ---- Act I : Ashveil Village ---- */
  cinder_rat:     { id: "cinder_rat", name: "Cinder Rat", level: 1, hp: 4, dmg: 3, xp: 12, coins: [2, 6], act: 1,
                    sprite: { shape: "rat", body: "#6e5a4a", accent: "#4a3a2c", eye: "#ff5c2a" } },
  ash_slime:      { id: "ash_slime", name: "Ash Slime", level: 2, hp: 6, dmg: 3, xp: 16, coins: [3, 8], act: 1,
                    sprite: { shape: "blob", body: "#8a8578", eye: "#2b251d" } },
  ember_imp:      { id: "ember_imp", name: "Ember Imp", level: 3, hp: 6, dmg: 4, xp: 20, coins: [4, 10], act: 1,
                    sprite: { shape: "imp", body: "#b8472a", accent: "#5e1f12", eye: "#ffe24a" } },
  boss_gatekeeper:{ id: "boss_gatekeeper", name: "The Charred Gatekeeper", level: 6, hp: 12, dmg: 5, xp: 90, coins: [30, 50], act: 1, boss: true,
                    sprite: { shape: "knight", body: "#3a3530", accent: "#2a2622", eye: "#ff7a1a", plume: "#ff7a1a", scale: 1.7, aura: "rgba(255,122,26,0.20)" } },

  /* ---- Act II : Emberwood Forest ---- */
  hollow_wolf:    { id: "hollow_wolf", name: "Hollow Wolf", level: 7, hp: 10, dmg: 5, xp: 30, coins: [6, 14], act: 2,
                    sprite: { shape: "wolf", body: "#4a4742", accent: "#33312c", eye: "#7be0ff" } },
  blight_sprite:  { id: "blight_sprite", name: "Blight Sprite", level: 8, hp: 12, dmg: 6, xp: 34, coins: [7, 15], act: 2,
                    sprite: { shape: "sprite", body: "#d8ffd8", accent: "#3f8230", eye: "#ffffff" } },
  restless_husk:  { id: "restless_husk", name: "Restless Husk", level: 9, hp: 12, dmg: 6, xp: 38, coins: [8, 16], act: 2,
                    sprite: { shape: "ghost", body: "#9aa58a", eye: "#2d3a22" } },
  boss_warden:    { id: "boss_warden", name: "Warden of the Embers", level: 12, hp: 20, dmg: 7, xp: 200, coins: [60, 90], act: 2, boss: true,
                    sprite: { shape: "gargoyle", body: "#5a4a36", accent: "#7a3b2a", eye: "#ff8a2a", scale: 1.8, aura: "rgba(255,138,42,0.20)" } },

  /* ---- Act III : Sunken Ruins ---- */
  drowned_acolyte:{ id: "drowned_acolyte", name: "Drowned Acolyte", level: 13, hp: 15, dmg: 7, xp: 46, coins: [10, 20], act: 3,
                    sprite: { shape: "robed", body: "#2e5a5e", accent: "#7aa0a0", eye: "#7be0ff" } },
  bone_crawler:   { id: "bone_crawler", name: "Bone Crawler", level: 14, hp: 18, dmg: 8, xp: 50, coins: [11, 22], act: 3,
                    sprite: { shape: "insect", body: "#cfc8b4", accent: "#8a836e", eye: "#3df0c0" } },
  grave_wisp:     { id: "grave_wisp", name: "Grave Wisp", level: 15, hp: 18, dmg: 8, xp: 54, coins: [12, 24], act: 3,
                    sprite: { shape: "wisp", body: "#bfe8ff", accent: "rgba(120,200,255,0.5)" } },
  cursed_scarab:  { id: "cursed_scarab", name: "Cursed Scarab", level: 16, hp: 18, dmg: 9, xp: 58, coins: [13, 26], act: 3,
                    sprite: { shape: "insect", body: "#3a5a2e", accent: "#27411f", eye: "#ffd23f" } },
  boss_drowned_king:{ id: "boss_drowned_king", name: "The Drowned King", level: 20, hp: 30, dmg: 10, xp: 420, coins: [120, 180], act: 3, boss: true,
                    sprite: { shape: "robed", body: "#1d4a52", accent: "#9ac8c8", eye: "#7be0ff", scale: 1.9, crown: true, aura: "rgba(80,180,220,0.22)" } },

  /* ---- Act IV : Kingsfall Citadel ---- */
  spectral_knight:{ id: "spectral_knight", name: "Spectral Knight", level: 21, hp: 21, dmg: 9, xp: 66, coins: [15, 30], act: 4,
                    sprite: { shape: "knight", body: "#5a6a8a", accent: "#7a8aa8", eye: "#7be0ff", plume: "#7be0ff" } },
  flame_revenant: { id: "flame_revenant", name: "Flame Revenant", level: 22, hp: 24, dmg: 10, xp: 72, coins: [16, 32], act: 4,
                    sprite: { shape: "ghost", body: "#c0552a", eye: "#ffe24a" } },
  molten_gargoyle:{ id: "molten_gargoyle", name: "Molten Gargoyle", level: 23, hp: 24, dmg: 10, xp: 78, coins: [17, 34], act: 4,
                    sprite: { shape: "gargoyle", body: "#6e4232", accent: "#ff7a1a", eye: "#ffb53a" } },
  animated_armor: { id: "animated_armor", name: "Animated Armor", level: 24, hp: 24, dmg: 11, xp: 84, coins: [18, 36], act: 4,
                    sprite: { shape: "knight", body: "#8a8f9a", accent: "#6a6f7a", eye: "#c478ff", plume: "#c478ff" } },
  boss_kael:      { id: "boss_kael", name: "Sir Kael, the Kingless", level: 28, hp: 36, dmg: 12, xp: 800, coins: [250, 350], act: 4, boss: true,
                    sprite: { shape: "knight", body: "#3a4a6a", accent: "#b9c9ff", eye: "#b9c9ff", plume: "#b9c9ff", scale: 1.9, aura: "rgba(150,180,255,0.22)" } },

  /* ---- Act V : The Flame Sanctum ---- */
  flame_serpent:  { id: "flame_serpent", name: "Flame Serpent", level: 29, hp: 33, dmg: 11, xp: 95, coins: [20, 40], act: 5,
                    sprite: { shape: "serpent", body: "#d4541b", eye: "#ffe24a" } },
  pyre_sentinel:  { id: "pyre_sentinel", name: "Pyre Sentinel", level: 31, hp: 36, dmg: 12, xp: 105, coins: [22, 44], act: 5,
                    sprite: { shape: "sentinel", body: "#4d4a42", accent: "#e0561a", eye: "#ffd23f" } },
  echo_first:     { id: "echo_first", name: "Echo of the First", level: 33, hp: 36, dmg: 13, xp: 115, coins: [24, 48], act: 5,
                    sprite: { shape: "ghost", body: "#c8b46a", eye: "#7a5a17" } },
  boss_twin_flame:{ id: "boss_twin_flame", name: "The Twin Flames", level: 36, hp: 40, dmg: 13, xp: 1400, coins: [400, 500], act: 5, boss: true,
                    sprite: { shape: "wisp", body: "#ffb53a", accent: "rgba(255,140,40,0.6)", scale: 2.1, crown: true } },
  boss_first_king:{ id: "boss_first_king", name: "The First King Ascendant", level: 40, hp: 50, dmg: 14, xp: 2500, coins: [800, 1000], act: 5, boss: true,
                    sprite: { shape: "knight", body: "#7a5a17", accent: "#ffd23f", eye: "#ff4242", plume: "#ff4242", scale: 2.2, crown: true, aura: "rgba(255,210,63,0.25)" } }
};

/* ============================================================
   NPCS — quest givers, merchants, story figures
   ============================================================ */
window.NPCS = {
  elder_maren: {
    id: "elder_maren", name: "Elder Maren", title: "Keeper of Ashveil",
    look: { skin: "#d8a878", hair: "#cfcfcf", hairStyle: 1, robe: "#5a4a36", hat: "hood", hatColor: "#4a3a28" },
    lines: ["The Flame marks whom it will. It marked you.",
            "Ashveil endures. Barely, but it endures."]
  },
  tobin: {
    id: "tobin", name: "Merchant Tobin", title: "Purveyor of Oddments", shop: "tobin",
    look: { skin: "#e8b88a", hair: "#6a3a1a", hairStyle: 0, shirt: "#7a3000", pants: "#3a2c18" },
    lines: ["Finest goods this side of the ruins! Mostly because there are no goods on the other side.",
            "Coin is coin, friend. Even at the end of the world."]
  },
  sera: {
    id: "sera", name: "Sera the Scribe", title: "Last of the Royal Scriptorium",
    look: { skin: "#c89060", hair: "#1a1a2a", hairStyle: 1, robe: "#2e4a7a", hat: null },
    lines: ["Words are power. Literal power, in the old tongue.",
            "I have ink, parchment, and questions. Mostly questions."]
  },
  bram: {
    id: "bram", name: "Innkeep Bram", title: "Keeper of the Kindled Crown", shop: "bram",
    look: { skin: "#e8b88a", hair: "#6a3a1a", hairStyle: 2, shirt: "#7a5a17", pants: "#3a2c18" },
    lines: ["Beds are clean, stew is hot, and the roof only leaks when it rains.",
            "The Crown's hearth hasn't gone out since the Flame returned. I'm not brave enough to let it."]
  },
  lyrell: {
    id: "lyrell", name: "Lyrell the Bard", title: "Voice of the Common Room",
    look: { skin: "#c89060", hair: "#e8d23f", hairStyle: 1, shirt: "#5a3a7a", pants: "#3a2c18" },
    lines: ["🎵 The kingdom fell, the kingdom burns, the for-loop spins, the while returns... 🎵",
            "Every tavern needs a song. Every song needs a tragedy. Lucky me — we're standing in one."]
  },
  hilda: {
    id: "hilda", name: "Smith Hilda", title: "Anvil of Ashveil", shop: "hilda",
    look: { skin: "#b87f50", hair: "#c0392b", hairStyle: 2, shirt: "#6e3526", pants: "#2a2118" },
    lines: ["Iron doesn't care about the end of the world. It only cares if you heat it evenly.",
            "That gate-thing rattles my anvil every night. Somebody ought to feed it a sword."]
  },
  oswin: {
    id: "oswin", name: "Farmer Oswin", title: "Of Greenrow Farm",
    look: { skin: "#d8a878", hair: "#8a7a5a", hairStyle: 0, shirt: "#3f6230", pants: "#3a2c18" },
    lines: ["Greenrow's soil is half ash now. Things still grow. Stubbornness, mostly.",
            "Rats got into the turnips again. Big as dogs, eyes like coals."]
  },
  penna: {
    id: "penna", name: "Penna", title: "Fisher of the Ashveil Run",
    look: { skin: "#b87f50", hair: "#1a1a2a", hairStyle: 1, shirt: "#3a5a5e", pants: "#2a2118", hat: "hood", hatColor: "#2c4448" },
    lines: ["The river still gives fish. They glow a little now, but they fry up fine.",
            "Saw something pale drift under the bridge last new moon. Didn't cast again 'til sunrise."]
  },
  roske: {
    id: "roske", name: "Gatewarden Roske", title: "Watcher of Easthold",
    look: { skin: "#d8a878", hair: "#3a2412", hairStyle: 0, shirt: "#5a6a8a", pants: "#2a2e3a", hat: "helm" },
    lines: ["The Bastion holds. As long as you don't ask what it holds against.",
            "Past this gate it's all embers and teeth, friend. Mind your footing."]
  },
  pip: {
    id: "pip", name: "Pip", title: "Future Archmage (Self-Declared)",
    look: { skin: "#e8c8a0", hair: "#6a3a1a", hairStyle: 2, shirt: "#2e4a7a", pants: "#3a2c18" },
    lines: ["When I grow up I'm going to learn the old tongue and print my OWN name!",
            "Elder Maren says the Flame is sleeping in your hand. Can I see it?? Please?"]
  },
  yara: {
    id: "yara", name: "Ranger Yara", title: "Warden of Emberwood",
    look: { skin: "#b87f50", hair: "#3a2412", hairStyle: 2, shirt: "#3f6230", pants: "#3a2c18", hat: "hood", hatColor: "#2c481f" },
    lines: ["The forest remembers when it was a garden.",
            "Step where I step. The marsh eats boots."]
  },
  aldous: {
    id: "aldous", name: "Hermit Aldous", title: "Who Counts the Trees",
    look: { skin: "#d8a878", hair: "#cfcfcf", hairStyle: 3, robe: "#4a3a5e", hat: "wizard", hatColor: "#3a3270" },
    lines: ["One. Two. Three. The counting keeps the dark out.",
            "Loops, child. The world runs on loops. Sunrise, sunset, sunrise..."]
  },
  wick: {
    id: "wick", name: "Wickfire Trader", title: "Merchant of the Deep Paths", shop: "wick",
    look: { skin: "#a87850", hair: "#1a1a1a", hairStyle: 0, shirt: "#7a5a17", pants: "#2a2118", hat: "hood", hatColor: "#5a4a17" },
    lines: ["Everything's flammable if you believe in yourself.",
            "Buy a blade. The trees have teeth out here."]
  },
  fenna: {
    id: "fenna", name: "Scout Fenna", title: "Eyes of Ranger's Rest",
    look: { skin: "#c89060", hair: "#3a2412", hairStyle: 1, shirt: "#46602c", pants: "#3a2c18", hat: "hood", hatColor: "#2c481f" },
    lines: ["Three wolf packs between here and the ruins. I count them so you don't have to.",
            "Yara taught me everything. Mostly: 'step where I step.'"]
  },
  mott: {
    id: "mott", name: "Forager Mott", title: "Connoisseur of Questionable Caps",
    look: { skin: "#d8a878", hair: "#cfcfcf", hairStyle: 2, shirt: "#55653e", pants: "#3a2c18" },
    lines: ["The glowing mushrooms are safe to eat. The REALLY glowing ones... less so.",
            "The sprites guard the hollow like it owes them money."]
  },
  nyra: {
    id: "nyra", name: "Archivist Nyra", title: "Reader of Drowned Pages",
    look: { skin: "#c89060", hair: "#7a8a9a", hairStyle: 1, robe: "#2e5a5e", hat: null },
    lines: ["The ruins keep lists of everything. Lists within lists.",
            "Every relic has an index. Lose the index, lose the relic."]
  },
  lumen: {
    id: "lumen", name: "Priestess Lumen", title: "Keeper of the Last Light",
    look: { skin: "#e8c8a0", hair: "#f0e8d0", hairStyle: 1, robe: "#c8c0a8", hat: null },
    lines: ["Every soul has a name, and every name a key.",
            "The dead are not gone. They are merely... stored."]
  },
  korr: {
    id: "korr", name: "Dredger Korr", title: "Salvage and Sundries", shop: "korr",
    look: { skin: "#8a9a8a", hair: "#2a3a2a", hairStyle: 0, shirt: "#3a4a4a", pants: "#2a2a2a" },
    lines: ["Pulled all this up from the deep myself. Mind the barnacles.",
            "The drowned don't haggle. You shouldn't either."]
  },
  edda: {
    id: "edda", name: "Edda", title: "Elder of the Dry Quarter",
    look: { skin: "#d8a878", hair: "#cfcfcf", hairStyle: 1, robe: "#4e6260", hat: "hood", hatColor: "#3a4a48" },
    lines: ["We dried out this corner of the ruins one bucket at a time. Welcome to the Quarter.",
            "Don't sleep past the lantern line. The wisps sing, and you'll want to follow."]
  },
  ronn: {
    id: "ronn", name: "Diver Ronn", title: "Who Robs the Drowned",
    look: { skin: "#a87850", hair: "#1a1a2a", hairStyle: 0, shirt: "#2e5a5e", pants: "#2a2a2a" },
    lines: ["I dive the drowned halls for salvage. The dead don't need their spoons.",
            "The King's hall is across the causeway. The water there... it watches."]
  },
  edric: {
    id: "edric", name: "Castellan Edric", title: "Last Officer of Kingsfall",
    look: { skin: "#d8a878", hair: "#8a7a5a", hairStyle: 0, shirt: "#5a6a8a", pants: "#2a2e3a", hat: "helm" },
    lines: ["The citadel stands because someone must stand in it.",
            "Discipline. Routine. Functions. That is how an army thinks."]
  },
  wynn: {
    id: "wynn", name: "Oracle Wynn", title: "Who Sees in Patterns",
    look: { skin: "#c8a8c8", hair: "#e8e8ff", hairStyle: 1, robe: "#5a3a7a", hat: "wizard", hatColor: "#4a2e6a" },
    lines: ["I have seen ten thousand futures. In most of them, you ask me about list comprehensions.",
            "The pattern is the thing. See the pattern, skip the toil."]
  },
  vulka: {
    id: "vulka", name: "Forgemaster Vulka", title: "Armorer of the Citadel", shop: "vulka",
    look: { skin: "#b87f50", hair: "#c0392b", hairStyle: 2, shirt: "#6e3526", pants: "#2a2118" },
    lines: ["Steel listens if you shout at it hot enough.",
            "Wear plate. The dead swing hard."]
  },
  brakka: {
    id: "brakka", name: "Sergeant Brakka", title: "Of the Last Bastion",
    look: { skin: "#8d5524", hair: "#1a1a1a", hairStyle: 0, shirt: "#5a6a8a", pants: "#2a2e3a", hat: "helm" },
    lines: ["Hold the line! Even if the line is two tents and a soup pot.",
            "The spectral knights drill at dusk on the west wall. Old habits outlive the soldier."]
  },
  tam: {
    id: "tam", name: "Squire Tam", title: "Polisher of Other People's Glory",
    look: { skin: "#e8c8a0", hair: "#6a3a1a", hairStyle: 0, shirt: "#7a8aa8", pants: "#2a2e3a" },
    lines: ["I polish the Castellan's armor. The armor in the yard polishes itself. Unsettling.",
            "One day I'll be a knight. A LIVING one, thank you very much."]
  },
  herald: {
    id: "herald", name: "The Last Herald", title: "Voice of the Eternal Flame",
    look: { skin: "#e8c8a0", hair: "#ffd23f", hairStyle: 1, robe: "#9a6a17", hat: null },
    lines: ["The Flame speaks seldom. When it does, kingdoms move.",
            "You carry its mark. It carries your name."]
  },
  ilio: {
    id: "ilio", name: "Ember Sage Ilio", title: "Who Returns and Returns",
    look: { skin: "#a87850", hair: "#ff8a2a", hairStyle: 3, robe: "#8a4a17", hat: "wizard", hatColor: "#c43e0c" },
    lines: ["To understand recursion, you must first understand recursion.",
            "I have died here before. I will die here again. The base case approaches."]
  },
  keeper: {
    id: "keeper", name: "Keeper of Embers", title: "Quartermaster of the End", shop: "keeper",
    look: { skin: "#d8a878", hair: "#3a3a3a", hairStyle: 0, shirt: "#7a3000", pants: "#2a2118", hat: "hood", hatColor: "#5e1f12" },
    lines: ["Last shop before the end of the world. Stock up.",
            "The Flame doesn't take coin. I do."]
  },
  vesna: {
    id: "vesna", name: "Pilgrim Vesna", title: "Who Walked from Ashveil",
    look: { skin: "#e8c8a0", hair: "#f0e8d0", hairStyle: 1, robe: "#8a4a17", hat: "hood", hatColor: "#5e3026" },
    lines: ["I walked here from Ashveil with one candle. The Flame kept it lit the whole way.",
            "Pilgrims bring questions. The Flame answers in homework."]
  },
  flame: {
    id: "flame", name: "The Eternal Flame", title: "That Which Remains",
    look: { skin: "#ffb53a", hair: "#ff7a1a", hairStyle: 2, robe: "#c43e0c", hat: "crown" },
    lines: ["..."]
  }
};
