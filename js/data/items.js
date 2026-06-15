/* ============================================================
   ITEMS — gear, consumables, relics.
   slot: weapon | armor | charm | consumable
   dmg  = damage dealt per correct answer in combat
   def  = damage blocked when you answer wrong
   ============================================================ */
window.ITEMS = {
  /* ---------- weapons: common ---------- */
  dull_blade:        { id: "dull_blade", name: "Dull Blade", slot: "weapon", rarity: "common", icon: "sword", tint: "#9a9a9a", dmg: 2, price: 10,
                       desc: "A blade so dull it mostly bruises. Every survivor starts somewhere." },
  splintered_cudgel: { id: "splintered_cudgel", name: "Splintered Cudgel", slot: "weapon", rarity: "common", icon: "club", tint: "#8a6a3a", dmg: 2, price: 12,
                       desc: "Half firewood, half weapon. Smells faintly of regret." },
  militia_shortsword:{ id: "militia_shortsword", name: "Militia Shortsword", slot: "weapon", rarity: "common", icon: "sword", tint: "#b9c2c9", dmg: 3, price: 35,
                       desc: "Standard issue of the Ashveil militia. Reliable, unremarkable." },

  /* ---------- weapons: uncommon ---------- */
  keen_iron_edge:    { id: "keen_iron_edge", name: "Keen Iron Edge", slot: "weapon", rarity: "uncommon", icon: "sword", tint: "#cdd6de", dmg: 4, price: 90,
                       desc: "Iron honed by a smith who still remembers the old ways." },
  soldiers_sabre:    { id: "soldiers_sabre", name: "Soldier's Sabre", slot: "weapon", rarity: "uncommon", icon: "sword", tint: "#c9d2c0", dmg: 4, price: 95,
                       desc: "Carried by a soldier of the First Kingdom. The grip remembers a steadier hand." },
  wickfire_torchblade:{ id: "wickfire_torchblade", name: "Wickfire Torchblade", slot: "weapon", rarity: "uncommon", icon: "sword", tint: "#f0a050", dmg: 5, price: 160,
                       desc: "Its edge smolders faintly, like a candle that refuses to die." },

  /* ---------- weapons: rare ---------- */
  emberforged_falchion:{ id: "emberforged_falchion", name: "Emberforged Falchion", slot: "weapon", rarity: "rare", icon: "sword", tint: "#ff9a52", dmg: 6, price: 320,
                       desc: "Forged in a furnace fed with relic-coal from the Sunken Ruins." },
  watchmans_greatsword:{ id: "watchmans_greatsword", name: "Watchman's Greatsword", slot: "weapon", rarity: "rare", icon: "sword", tint: "#9fb6d9", dmg: 6, price: 340,
                       desc: "The night watch of Kingsfall never abandoned their posts. Even after death." },

  /* ---------- weapons: epic ---------- */
  runic_warblade:    { id: "runic_warblade", name: "Runic Warblade", slot: "weapon", rarity: "epic", icon: "sword", tint: "#c478ff", dmg: 8, price: 700,
                       desc: "Runes of the old tongue crawl along the fuller, rearranging when unobserved." },
  pyreheart_cleaver: { id: "pyreheart_cleaver", name: "Pyreheart Cleaver", slot: "weapon", rarity: "epic", icon: "sword", tint: "#ff6a3a", dmg: 9, price: 850,
                       desc: "Cleaved from the heart of a funeral pyre that burned for a hundred years." },

  /* ---------- weapons: legendary ---------- */
  dawnpiercer:       { id: "dawnpiercer", name: "Dawnpiercer", slot: "weapon", rarity: "legendary", icon: "sword", tint: "#ffe24a", dmg: 11, price: 1500,
                       desc: "Said to have split the first sunrise after the Kingdom fell." },
  cinderfall:        { id: "cinderfall", name: "Cinderfall", slot: "weapon", rarity: "legendary", icon: "sword", tint: "#ff8a2a", dmg: 12, price: 1800,
                       desc: "Where it strikes, cinders fall like snow." },
  ashen_vow:         { id: "ashen_vow", name: "Ashen Vow", slot: "weapon", rarity: "legendary", icon: "sword", tint: "#d8d8d8", dmg: 12, price: 1800,
                       desc: "Sworn in ash, kept in steel. The blade of an oath that outlived its speaker." },
  kingless_blade:    { id: "kingless_blade", name: "The Kingless Blade", slot: "weapon", rarity: "legendary", icon: "sword", tint: "#b9c9ff", dmg: 13, price: 2400,
                       desc: "Sir Kael's sword, which refused every crown offered to it." },
  sovereigns_ruin:   { id: "sovereigns_ruin", name: "Sovereign's Ruin", slot: "weapon", rarity: "legendary", icon: "sword", tint: "#ff5c8a", dmg: 13, price: 2600,
                       desc: "It has ended three dynasties. It is patient about the fourth." },
  flame_of_the_forgotten:{ id: "flame_of_the_forgotten", name: "Flame of the Forgotten", slot: "weapon", rarity: "legendary", icon: "sword", tint: "#ffb53a", dmg: 14, price: 3000,
                       desc: "Burns with the memory of every name history failed to keep." },
  emberwake:         { id: "emberwake", name: "Emberwake", slot: "weapon", rarity: "legendary", icon: "sword", tint: "#ff7a1a", dmg: 14, price: 3200,
                       desc: "Leaves a wake of embers that spell out dead languages." },
  firstflame_edge:   { id: "firstflame_edge", name: "Firstflame Edge", slot: "weapon", rarity: "legendary", icon: "sword", tint: "#ffd23f", dmg: 15, price: 4000,
                       desc: "An edge honed on the Eternal Flame itself, before it vanished." },

  /* ---------- weapons: mythic ---------- */
  eternal_brand:     { id: "eternal_brand", name: "The Eternal Brand", slot: "weapon", rarity: "mythic", icon: "flame", tint: "#ff4242", dmg: 18, price: 9999,
                       desc: "Not forged. Remembered. The Eternal Flame given the shape of a sword." },

  /* ---------- armor ---------- */
  tattered_cloak:    { id: "tattered_cloak", name: "Tattered Cloak", slot: "armor", rarity: "common", icon: "cloak", tint: "#7a6644", def: 0, price: 5,
                       desc: "It keeps out the rain. Some of it." },
  padded_vest:       { id: "padded_vest", name: "Padded Vest", slot: "armor", rarity: "common", icon: "armor", tint: "#a08f66", def: 1, price: 40,
                       desc: "Stuffed with wool and optimism." },
  hardened_leather:  { id: "hardened_leather", name: "Hardened Leather", slot: "armor", rarity: "uncommon", icon: "armor", tint: "#8a5a2a", def: 2, price: 150,
                       desc: "Boiled in wax by the rangers of Emberwood." },
  ashguard_mail:     { id: "ashguard_mail", name: "Ashguard Mail", slot: "armor", rarity: "rare", icon: "armor", tint: "#9aa0aa", def: 3, price: 380,
                       desc: "Mail rings quenched in ash-water. Sparks slide right off." },
  citadel_plate:     { id: "citadel_plate", name: "Citadel Plate", slot: "armor", rarity: "epic", icon: "armor", tint: "#c4cdf0", def: 4, price: 900,
                       desc: "Worn by the honor guard of Kingsfall Citadel." },
  mantle_of_embers:  { id: "mantle_of_embers", name: "Mantle of Embers", slot: "armor", rarity: "legendary", icon: "cloak", tint: "#ff8a2a", def: 5, price: 2200,
                       desc: "A cloak of banked coals that warms its bearer and chars its enemies." },
  aegis_of_the_first:{ id: "aegis_of_the_first", name: "Aegis of the First", slot: "armor", rarity: "legendary", icon: "armor", tint: "#ffd23f", def: 6, price: 3500,
                       desc: "The First King's own aegis. It has never once cracked." },

  /* ---------- charms ---------- */
  ember_charm:       { id: "ember_charm", name: "Ember Charm", slot: "charm", rarity: "uncommon", icon: "charm", tint: "#ff8a2a", xpBoost: 0.10, price: 120,
                       desc: "+10% experience. A warm coal that never cools." },
  scribes_talisman:  { id: "scribes_talisman", name: "Scribe's Talisman", slot: "charm", rarity: "rare", icon: "charm", tint: "#4aa3ff", freeHint: true, price: 300,
                       desc: "First hint of every trial is free. Sera's own quill-charm." },
  serpent_sigil:     { id: "serpent_sigil", name: "Serpent Sigil", slot: "charm", rarity: "epic", icon: "charm", tint: "#58d858", xpBoost: 0.15, freeHint: true, price: 800,
                       desc: "+15% experience and a free first hint. The serpent eats its own syntax errors." },
  last_crown:        { id: "last_crown", name: "The Last Crown", slot: "charm", rarity: "mythic", icon: "crown", tint: "#ff4242", xpBoost: 0.25, freeHint: true, price: 9999,
                       desc: "+25% experience, free first hints. The crown no one would wear — so it chose you." },

  /* ---------- consumables ---------- */
  ashen_salve:       { id: "ashen_salve", name: "Ashen Salve", slot: "consumable", rarity: "common", icon: "potion", tint: "#a8c87a", heal: 15, price: 12,
                       desc: "Restores 15 HP. Tastes like a campfire smells." },
  flamewater_flask:  { id: "flamewater_flask", name: "Flamewater Flask", slot: "consumable", rarity: "uncommon", icon: "potion", tint: "#ff8a2a", heal: 40, price: 45,
                       desc: "Restores 40 HP. Burns going down — in a good way." },
  phoenix_draught:   { id: "phoenix_draught", name: "Phoenix Draught", slot: "consumable", rarity: "rare", icon: "potion", tint: "#ffd23f", heal: 999, price: 130,
                       desc: "Fully restores HP. Bottled second chances." },
  scroll_of_insight: { id: "scroll_of_insight", name: "Scroll of Insight", slot: "consumable", rarity: "uncommon", icon: "scroll", tint: "#d8c596", hintToken: true, price: 30,
                       desc: "Unrolls into a free hint during any trial of code." }
};

/* loot tables per act: [itemId, weight] — rolled on enemy kill (small chance) */
window.LOOT_TABLES = {
  1: [["ashen_salve", 60], ["splintered_cudgel", 15], ["padded_vest", 15], ["scroll_of_insight", 10]],
  2: [["ashen_salve", 45], ["flamewater_flask", 20], ["keen_iron_edge", 12], ["hardened_leather", 12], ["scroll_of_insight", 11]],
  3: [["flamewater_flask", 40], ["scroll_of_insight", 20], ["soldiers_sabre", 12], ["ashguard_mail", 14], ["emberforged_falchion", 8], ["ember_charm", 6]],
  4: [["flamewater_flask", 35], ["phoenix_draught", 15], ["scroll_of_insight", 18], ["watchmans_greatsword", 12], ["citadel_plate", 10], ["runic_warblade", 6], ["scribes_talisman", 4]],
  5: [["phoenix_draught", 30], ["scroll_of_insight", 20], ["pyreheart_cleaver", 14], ["mantle_of_embers", 10], ["dawnpiercer", 9], ["ashen_vow", 8], ["cinderfall", 7], ["serpent_sigil", 2]]
};

/* shop inventories by npc id */
window.SHOPS = {
  tobin:   ["ashen_salve", "scroll_of_insight", "padded_vest", "militia_shortsword", "splintered_cudgel"],
  hesper:  ["ashen_salve", "scroll_of_insight", "tattered_cloak", "padded_vest", "splintered_cudgel"],
  wick:    ["ashen_salve", "flamewater_flask", "scroll_of_insight", "keen_iron_edge", "hardened_leather", "wickfire_torchblade"],
  korr:    ["flamewater_flask", "scroll_of_insight", "soldiers_sabre", "ashguard_mail", "emberforged_falchion", "ember_charm"],
  vulka:   ["flamewater_flask", "phoenix_draught", "scroll_of_insight", "watchmans_greatsword", "citadel_plate", "runic_warblade", "scribes_talisman"],
  keeper:  ["phoenix_draught", "scroll_of_insight", "pyreheart_cleaver", "mantle_of_embers", "sovereigns_ruin", "serpent_sigil"]
};
