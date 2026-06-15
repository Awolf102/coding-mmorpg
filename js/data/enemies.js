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
  ash_moth:       { id: "ash_moth", name: "Ash Moth", level: 2, hp: 5, dmg: 3, xp: 14, coins: [3, 7], act: 1,
                    sprite: { shape: "sprite", body: "#cdbb9a", accent: "#8a6a3a", eye: "#ffb24a" } },
  tallow_grub:    { id: "tallow_grub", name: "Tallow Grub", level: 3, hp: 7, dmg: 4, xp: 18, coins: [4, 9], act: 1,
                    sprite: { shape: "insect", body: "#e6d9a8", accent: "#b59a55", eye: "#c44a2a" } },
  boss_gatekeeper:{ id: "boss_gatekeeper", name: "The Charred Gatekeeper", level: 6, hp: 12, dmg: 5, xp: 90, coins: [30, 50], act: 1, boss: true,
                    sprite: { shape: "knight", body: "#3a3530", accent: "#2a2622", eye: "#ff7a1a", plume: "#ff7a1a", scale: 1.7, aura: "rgba(255,122,26,0.20)" } },

  /* ---- Act II : Emberwood Forest ---- */
  hollow_wolf:    { id: "hollow_wolf", name: "Hollow Wolf", level: 7, hp: 10, dmg: 5, xp: 30, coins: [6, 14], act: 2,
                    sprite: { shape: "wolf", body: "#4a4742", accent: "#33312c", eye: "#7be0ff" } },
  blight_sprite:  { id: "blight_sprite", name: "Blight Sprite", level: 8, hp: 12, dmg: 6, xp: 34, coins: [7, 15], act: 2,
                    sprite: { shape: "sprite", body: "#d8ffd8", accent: "#3f8230", eye: "#ffffff" } },
  restless_husk:  { id: "restless_husk", name: "Restless Husk", level: 9, hp: 12, dmg: 6, xp: 38, coins: [8, 16], act: 2,
                    sprite: { shape: "ghost", body: "#9aa58a", eye: "#2d3a22" } },
  bramble_crawler:{ id: "bramble_crawler", name: "Bramble Crawler", level: 8, hp: 11, dmg: 5, xp: 32, coins: [7, 15], act: 2,
                    sprite: { shape: "insect", body: "#5a6a30", accent: "#37431d", eye: "#cfe84a" } },
  mire_lurker:    { id: "mire_lurker", name: "Mire Lurker", level: 10, hp: 13, dmg: 6, xp: 42, coins: [9, 18], act: 2,
                    sprite: { shape: "blob", body: "#46583e", accent: "#2a3626", eye: "#9ad0ff" } },
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
  silt_serpent:   { id: "silt_serpent", name: "Silt Serpent", level: 14, hp: 17, dmg: 7, xp: 50, coins: [11, 22], act: 3,
                    sprite: { shape: "serpent", body: "#356a5a", eye: "#9ad0ff" } },
  coral_golem:    { id: "coral_golem", name: "Coral Golem", level: 17, hp: 20, dmg: 9, xp: 60, coins: [13, 27], act: 3,
                    sprite: { shape: "sentinel", body: "#5a6a6a", accent: "#c87a5a", eye: "#7be0ff" } },
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
  pact_knight:    { id: "pact_knight", name: "Pact Knight", level: 22, hp: 22, dmg: 9, xp: 70, coins: [16, 32], act: 4,
                    sprite: { shape: "knight", body: "#6a5a7a", accent: "#9a8ab0", eye: "#c478ff", plume: "#c478ff" } },
  gloom_sentinel: { id: "gloom_sentinel", name: "Gloom Sentinel", level: 25, hp: 25, dmg: 11, xp: 88, coins: [18, 37], act: 4,
                    sprite: { shape: "sentinel", body: "#4a4452", accent: "#7a5ac0", eye: "#b388ff" } },
  boss_kael:      { id: "boss_kael", name: "Sir Kael, the Kingless", level: 28, hp: 36, dmg: 12, xp: 800, coins: [250, 350], act: 4, boss: true,
                    sprite: { shape: "knight", body: "#3a4a6a", accent: "#b9c9ff", eye: "#b9c9ff", plume: "#b9c9ff", scale: 1.9, aura: "rgba(150,180,255,0.22)" } },

  /* ---- Act V : The Flame Sanctum ---- */
  flame_serpent:  { id: "flame_serpent", name: "Flame Serpent", level: 29, hp: 33, dmg: 11, xp: 95, coins: [20, 40], act: 5,
                    sprite: { shape: "serpent", body: "#d4541b", eye: "#ffe24a" } },
  pyre_sentinel:  { id: "pyre_sentinel", name: "Pyre Sentinel", level: 31, hp: 36, dmg: 12, xp: 105, coins: [22, 44], act: 5,
                    sprite: { shape: "sentinel", body: "#4d4a42", accent: "#e0561a", eye: "#ffd23f" } },
  echo_first:     { id: "echo_first", name: "Echo of the First", level: 33, hp: 36, dmg: 13, xp: 115, coins: [24, 48], act: 5,
                    sprite: { shape: "ghost", body: "#c8b46a", eye: "#7a5a17" } },
  furnace_drake:  { id: "furnace_drake", name: "Furnace Drake", level: 30, hp: 34, dmg: 11, xp: 100, coins: [21, 42], act: 5,
                    sprite: { shape: "serpent", body: "#c4541b", eye: "#ffd23f" } },
  verse_wraith:   { id: "verse_wraith", name: "Verse Wraith", level: 32, hp: 37, dmg: 12, xp: 110, coins: [23, 46], act: 5,
                    sprite: { shape: "ghost", body: "#b89a5a", eye: "#ffe24a" } },
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
  pip: {
    id: "pip", name: "Pip the Bellhand", title: "Who Keeps the Beacon's Rhythm",
    look: { skin: "#e0b48a", hair: "#caa24a", hairStyle: 2, shirt: "#9a6a2a", pants: "#3a2c18", hat: "hood", hatColor: "#7a5320" },
    lines: ["A word spoken crooked is a word wasted. Speak it in clean lines!",
            "The beacon answers rhythm. One toll, one line, one breath."]
  },
  hesper: {
    id: "hesper", name: "Goodwife Hesper", title: "Keeper of the Granary", shop: "hesper",
    look: { skin: "#d8a878", hair: "#b4b0a4", hairStyle: 1, shirt: "#7a5a3a", pants: "#4a3a28", hat: "hood", hatColor: "#5a4632" },
    lines: ["A word and a number are not the same thing, and the granary suffers when you confuse them.",
            "Tell me a count and I'll make it true. Numbers don't lie — unless you leave them as words."]
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
  fenn: {
    id: "fenn", name: "Fenn the Snarewright", title: "Who Reads the Signs",
    look: { skin: "#b87f50", hair: "#2a1a0e", hairStyle: 2, shirt: "#4a5a2e", pants: "#3a2c18", hat: "hood", hatColor: "#2c3a1c" },
    lines: ["A snare springs on a true answer and a true answer only. AND, OR, NOT — that is the whole craft.",
            "Two signs together tell you more than either alone. Read them right and the forest feeds you."]
  },
  bryony: {
    id: "bryony", name: "Lampwright Bryony", title: "Who Walks the Long Patrol",
    look: { skin: "#d8a878", hair: "#7a3a1a", hairStyle: 1, shirt: "#6a4a6a", pants: "#3a2c18", hat: null },
    lines: ["Some lamps you light, some you skip, and at some you simply stop. A patrol is knowing which is which.",
            "Don't walk every lamp the same. Skip the broken ones. Halt when you've found what you came for."]
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
  sael: {
    id: "sael", name: "Sael the Salvager", title: "Who Sorts the Tide's Gifts",
    look: { skin: "#a89060", hair: "#6a7a72", hairStyle: 0, robe: "#2e5a5e", hat: null },
    lines: ["The tide gives in a heap. The work is the sorting — pick, keep, line them up in order.",
            "An unsorted pile is just weight. A sorted list is a treasury. Learn the difference."]
  },
  orin: {
    id: "orin", name: "Tallymaster Orin", title: "Who Counts the Hoard",
    look: { skin: "#c89060", hair: "#3a3a2a", hairStyle: 0, shirt: "#5a4a3a", pants: "#2a2a2a", hat: "hood", hatColor: "#3a3226" },
    lines: ["Every hoard has a shape, if you tally it right: how much, how many kinds, which ones matter.",
            "Give me a ledger and a moment, and I'll tell you what the dead were really keeping."]
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
  doran: {
    id: "doran", name: "Quartermaster Doran", title: "Who Reports the Count",
    look: { skin: "#c89060", hair: "#5a5a5a", hairStyle: 0, shirt: "#5a6a8a", pants: "#2a2e3a", hat: "helm" },
    lines: ["A good report carries two numbers, not one. Hand them both back at once.",
            "Send a soldier for an answer, get an answer back. That is the whole of an order."]
  },
  isolde: {
    id: "isolde", name: "Bannerwright Isolde", title: "Who Stitches the Standards",
    look: { skin: "#e8c8a0", hair: "#7a3a6a", hairStyle: 1, robe: "#6a3a7a", hat: null },
    lines: ["A banner remembers what it has seen — battles won, banners fallen. Give a thing a memory and it becomes a being.",
            "I stitch standards that keep their own count. Each one knows its name when you ask it."]
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
  vesh: {
    id: "vesh", name: "Cartographer Vesh", title: "Who Maps the Furnace",
    look: { skin: "#c89060", hair: "#3a3a4a", hairStyle: 0, robe: "#7a4a17", hat: "wizard", hatColor: "#5a3010" },
    lines: ["The Flame thinks in grids — rows of fire, columns of ash. Read one right and you read its mind.",
            "Every furnace has a hottest row and a hottest cell. Find them, and you find where to strike."]
  },
  quill: {
    id: "quill", name: "Loremaster Quill", title: "Who Recites in Circles",
    look: { skin: "#e8c8a0", hair: "#ff8a2a", hairStyle: 3, robe: "#9a6a17", hat: "wizard", hatColor: "#c43e0c" },
    lines: ["A verse that contains itself is the strongest verse of all. Speak the small one, and the great one finishes.",
            "Reverse a thing by reversing all but its first letter, then setting that letter last. Trust the smaller telling."]
  },
  keeper: {
    id: "keeper", name: "Keeper of Embers", title: "Quartermaster of the End", shop: "keeper",
    look: { skin: "#d8a878", hair: "#3a3a3a", hairStyle: 0, shirt: "#7a3000", pants: "#2a2118", hat: "hood", hatColor: "#5e1f12" },
    lines: ["Last shop before the end of the world. Stock up.",
            "The Flame doesn't take coin. I do."]
  },
  flame: {
    id: "flame", name: "The Eternal Flame", title: "That Which Remains",
    look: { skin: "#ffb53a", hair: "#ff7a1a", hairStyle: 2, robe: "#c43e0c", hat: "crown" },
    lines: ["..."]
  }
};
