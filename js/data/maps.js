/* ============================================================
   MAPS — five zones, built programmatically so walkability
   stays consistent. Tile chars are defined in Sprites.TILES.

   Each map is organised the same way (OSRS/WoW-style):
     · a TOWN where the NPCs live (quest givers, shops, flavor)
     · named MOB ZONES — each enemy type has its own territory
     · a dedicated BOSS ROOM / arena
   `zones` drives the "entering …" discovery banners,
   `theme` drives building & banner colors in the renderer.
   ============================================================ */
window.MAPS = (function () {
  const W = 46, H = 32;

  function makeGrid(base) {
    const g = [];
    for (let y = 0; y < H; y++) g.push(new Array(W).fill(base));
    return g;
  }
  function rect(g, x, y, w, h, ch) {
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++)
        if (yy >= 0 && yy < H && xx >= 0 && xx < W) g[yy][xx] = ch;
  }
  function border(g, ch, n) {
    rect(g, 0, 0, W, n, ch); rect(g, 0, H - n, W, n, ch);
    rect(g, 0, 0, n, H, ch); rect(g, W - n, 0, n, H, ch);
  }
  function scatter(g, ch, count, x, y, w, h, seed, onlyOn) {
    let placed = 0, i = 0;
    while (placed < count && i < count * 30) {
      const hx = x + Math.floor(Sprites.hash(seed + i * 7, seed * 3 + i) * w);
      const hy = y + Math.floor(Sprites.hash(seed * 5 + i, seed + i * 11) * h);
      i++;
      if (hx < 1 || hy < 1 || hx >= W - 1 || hy >= H - 1) continue;
      if (onlyOn && g[hy][hx] !== onlyOn) continue;
      g[hy][hx] = ch;
      placed++;
    }
  }
  function house(g, x, y, w, h) {
    rect(g, x, y, w, h - 1, "R");
    rect(g, x, y + h - 1, w, 1, "h");
    g[y + h - 1][x + Math.floor(w / 2)] = "D";
  }
  function toStrings(g) { return g.map((row) => row.join("")); }
  function clearWalk(g, pts, ch) {
    for (const [x, y] of pts) {
      // only carve if something solid landed there — keeps zone flooring intact
      if (Sprites.TILES[g[y][x]].solid) g[y][x] = ch;
      // ensure at least one adjacent walkable approach tile
      if (Sprites.TILES[g[y + 1][x]].solid && Sprites.TILES[g[y - 1][x]].solid &&
          Sprites.TILES[g[y][x + 1]].solid && Sprites.TILES[g[y][x - 1]].solid) {
        g[y + 1][x] = ch;
      }
    }
  }

  /* ================= ASHVEIL VILLAGE =================
     Town: square w/ well & market, inn, smithy, scriptorium,
     chapel, fisher's pier, Greenrow Farm.
     Mobs: Charred Orchard (imps) · Rat Burrows (rats) · The Mire (slimes).
     Boss room: Easthold Bastion — the Charred Gatekeeper's court. */
  function buildVillage() {
    const g = makeGrid("g");
    border(g, "t", 2);
    // river across the south, the great bridge, and the fisher's pier
    rect(g, 0, 19, W, 3, "w");
    // roads
    rect(g, 22, 3, 1, 16, "p");   // north high road
    rect(g, 6, 10, 32, 1, "p");   // high street, west fields to the bastion
    rect(g, 34, 11, 4, 1, "p");   // widened approach to the east gate
    rect(g, 22, 22, 1, 7, "p");   // south road to the farms
    rect(g, 21, 18, 3, 5, "b");   // the great bridge
    // the cobbled town square
    rect(g, 18, 8, 10, 6, "c");
    // buildings of Ashveil
    house(g, 4, 3, 7, 5);    // the Kindled Crown inn
    house(g, 13, 4, 5, 4);   // cottage
    house(g, 24, 3, 6, 5);   // elder's hall
    house(g, 31, 4, 6, 4);   // the scriptorium
    house(g, 12, 12, 5, 4);  // Hilda's smithy
    house(g, 25, 13, 4, 3);  // fisher's hut
    house(g, 31, 12, 6, 5);  // chapel of the Flame
    house(g, 26, 23, 5, 4);  // farmhouse
    // square dressing: old well, market row, lamps, flower beds
    g[11][22] = "o";
    g[8][18] = "L"; g[8][27] = "L"; g[13][18] = "L"; g[13][27] = "L";
    g[9][24] = "M"; g[9][26] = "M"; g[12][26] = "B";
    g[9][19] = "*"; g[12][19] = "*"; g[13][30] = "*";
    // inn yard + smithy yard + scriptorium lectern
    g[5][11] = "B"; g[8][11] = "L";
    g[13][17] = "j"; g[15][17] = "A"; g[14][11] = "B";
    g[8][35] = "k";
    // chapel graveyard + bridge braziers
    g[16][38] = "+"; g[16][40] = "+";
    g[17][20] = "F"; g[17][24] = "F";
    // fisher's pier into the river
    g[19][27] = "b"; g[20][27] = "b";
    // Greenrow Farm: fenced pen, tilled crop rows
    rect(g, 33, 24, 9, 5, "f");
    rect(g, 34, 25, 7, 3, "d");
    g[26][33] = "g"; // gate into the pen
    for (const [cx, cy] of [[35, 25], [37, 25], [39, 25], [35, 27], [37, 27], [39, 27]]) g[cy][cx] = "C";
    // ---- mob zones ----
    // The Charred Orchard (west) — ember imps among burnt trees
    rect(g, 3, 12, 8, 7, "a");
    scatter(g, "T", 4, 3, 12, 8, 7, 51, "a");
    scatter(g, "e", 2, 3, 12, 8, 7, 57, "a");
    // The Rat Burrows (south-west, past the river)
    rect(g, 3, 22, 12, 8, "a");
    scatter(g, "T", 3, 3, 22, 12, 8, 61, "a");
    scatter(g, "e", 4, 3, 22, 12, 8, 67, "a");
    scatter(g, "r", 2, 3, 22, 12, 8, 71, "a");
    // The Mire (east riverbank) — ash slimes
    rect(g, 35, 17, 9, 2, "m");
    // ---- boss room: Easthold Bastion ----
    rect(g, 38, 7, 7, 1, "h");
    rect(g, 38, 14, 7, 1, "h");
    rect(g, 38, 7, 1, 8, "h");
    rect(g, 39, 8, 6, 6, "a");      // scorched courtyard
    g[10][38] = "p"; g[11][38] = "p"; // the gate
    g[8][39] = "F"; g[13][39] = "F"; g[8][43] = "F"; g[13][43] = "F";
    g[8][44] = "n"; g[13][44] = "n";
    g[9][39] = "j"; g[12][39] = "j";
    // greenery
    scatter(g, "t", 4, 2, 2, 16, 6, 31, "g");
    scatter(g, "t", 5, 15, 22, 7, 8, 7, "g");
    scatter(g, "t", 4, 28, 17, 6, 5, 23, "g");
    scatter(g, "r", 2, 16, 16, 5, 3, 11, "g");

    const npcs = [
      { id: "elder_maren", x: 22, y: 9 },
      { id: "tobin", x: 25, y: 10 },
      { id: "pip", x: 20, y: 11 },
      { id: "sera", x: 34, y: 8 },
      { id: "bram", x: 7, y: 8 },
      { id: "lyrell", x: 5, y: 8 },
      { id: "hilda", x: 14, y: 16 },
      { id: "penna", x: 27, y: 17 },
      { id: "oswin", x: 32, y: 26 },
      { id: "roske", x: 37, y: 12 }
    ];
    const enemies = [
      { type: "cinder_rat", x: 6, y: 24, wander: 2 },
      { type: "cinder_rat", x: 10, y: 26, wander: 2 },
      { type: "cinder_rat", x: 13, y: 23, wander: 2 },
      { type: "cinder_rat", x: 7, y: 28, wander: 2 },
      { type: "ash_slime", x: 37, y: 17, wander: 2 },
      { type: "ash_slime", x: 40, y: 18, wander: 2 },
      { type: "ash_slime", x: 42, y: 17, wander: 2 },
      { type: "ash_slime", x: 38, y: 18, wander: 2 },
      { type: "ember_imp", x: 5, y: 14, wander: 2 },
      { type: "ember_imp", x: 8, y: 16, wander: 2 },
      { type: "ember_imp", x: 4, y: 17, wander: 2 },
      { type: "ember_imp", x: 9, y: 13, wander: 2 }
    ];
    const portals = [
      { x: 44, y: 10, to: "forest", tx: 3, ty: 10, req: "py04", label: "Emberwood Forest" },
      { x: 44, y: 11, to: "forest", tx: 3, ty: 10, req: "py04", label: "Emberwood Forest" }
    ];
    const spawn = { x: 22, y: 25 };
    const zones = [
      { name: "Ashveil Square", x: 18, y: 7, w: 10, h: 7 },
      { name: "The Charred Orchard", x: 2, y: 11, w: 10, h: 8 },
      { name: "The Rat Burrows", x: 2, y: 22, w: 13, h: 8 },
      { name: "The Mire", x: 34, y: 16, w: 11, h: 4 },
      { name: "Greenrow Farm", x: 31, y: 23, w: 11, h: 7 },
      { name: "Easthold Bastion", x: 38, y: 7, w: 8, h: 8 }
    ];
    const theme = {
      wall: "#9a8868", wall2: "#ab9a78", trim: "#6e5a40",
      roof: "#a8843c", roof2: "#c09a4a", roofTrim: "#7a5e2a", ridge: "#5e4a20",
      door: "#553718", door2: "#6b4a22",
      banner: "#a84a2a", canvas: "#8a7a52", rune: "#ffb35a", crystal: "#7be0ff"
    };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]),
      [[spawn.x, spawn.y], [44, 10], [44, 11], [43, 10], [43, 11], [41, 10], [41, 11], [38, 10], [38, 11], [42, 10]]), "g");
    return { id: "village", name: "Ashveil Village", act: 1, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "g", theme, zones };
  }

  /* ================= EMBERWOOD FOREST =================
     Town: Ranger's Rest (Yara's camp) + Wick's Waystation + Hermit's Hollow.
     Mobs: Wolf Den (wolves) · Glimmercap Hollow (sprites) · Drowned Rows (husks).
     Boss room: The Warden's Ring — an ancient stone circle. */
  function buildForest() {
    const g = makeGrid("G");
    border(g, "t", 2);
    // dense woods
    scatter(g, "t", 90, 2, 2, W - 4, H - 4, 7, "G");
    // the winding road, west gate to the ruins
    rect(g, 2, 10, 16, 1, "p");
    rect(g, 17, 10, 1, 5, "p");
    rect(g, 17, 14, 14, 1, "p");
    rect(g, 30, 14, 1, 9, "p");
    rect(g, 30, 22, 13, 1, "p");
    rect(g, 39, 11, 1, 12, "p"); // spur up to the Warden's Ring
    // clearings
    rect(g, 5, 5, 10, 8, "G");    // Ranger's Rest
    rect(g, 19, 3, 12, 6, "G");   // Glimmercap Hollow
    rect(g, 22, 4, 6, 3, "w");    // the still pond
    rect(g, 19, 11, 10, 7, "G");  // Wick's Waystation
    rect(g, 31, 19, 8, 7, "G");   // Hermit's Hollow
    rect(g, 32, 3, 11, 9, "G");   // the Warden's clearing
    rect(g, 34, 4, 8, 6, "S");    // ancient stone floor
    rect(g, 41, 21, 3, 3, "G");   // east portal clearing
    // Ranger's Rest camp
    g[6][6] = "Y"; g[6][9] = "Y"; g[8][8] = "F"; g[6][11] = "B"; g[8][12] = "j";
    // Wick's Waystation
    house(g, 24, 11, 4, 3);
    g[12][21] = "M"; g[15][27] = "B"; g[13][20] = "L"; g[15][19] = "L";
    // Hermit's Hollow
    house(g, 33, 19, 5, 3);
    g[23][32] = "q"; g[24][38] = "q"; g[23][33] = "F"; g[20][31] = "r"; g[19][38] = "r";
    // Glimmercap Hollow mushrooms
    scatter(g, "q", 6, 19, 3, 12, 6, 43, "G");
    // ---- mob zones ----
    // The Wolf Den — packed earth, old bones
    rect(g, 4, 17, 12, 11, "d");
    scatter(g, "e", 5, 4, 17, 12, 11, 47, "d");
    scatter(g, "r", 3, 4, 17, 12, 11, 53, "d");
    scatter(g, "T", 3, 4, 17, 12, 11, 59, "d");
    // The Drowned Rows — a forest burial ground sunk into the marsh
    rect(g, 17, 21, 8, 6, "m");
    scatter(g, "+", 5, 17, 21, 8, 6, 63, "m");
    // ---- boss room: The Warden's Ring ----
    g[4][34] = "O"; g[4][41] = "O"; g[9][34] = "O"; g[9][41] = "O";
    g[4][36] = "F"; g[4][39] = "F";
    g[6][33] = "i"; g[6][42] = "i";

    const npcs = [
      { id: "yara", x: 7, y: 9 },
      { id: "fenna", x: 10, y: 9 },
      { id: "wick", x: 22, y: 15 },
      { id: "mott", x: 20, y: 8 },
      { id: "aldous", x: 34, y: 23 }
    ];
    const enemies = [
      { type: "hollow_wolf", x: 7, y: 19, wander: 3 },
      { type: "hollow_wolf", x: 12, y: 21, wander: 3 },
      { type: "hollow_wolf", x: 6, y: 24, wander: 3 },
      { type: "hollow_wolf", x: 13, y: 25, wander: 3 },
      { type: "hollow_wolf", x: 9, y: 27, wander: 3 },
      { type: "blight_sprite", x: 20, y: 5, wander: 2 },
      { type: "blight_sprite", x: 28, y: 5, wander: 2 },
      { type: "blight_sprite", x: 24, y: 7, wander: 2 },
      { type: "blight_sprite", x: 20, y: 7, wander: 2 },
      { type: "restless_husk", x: 19, y: 22, wander: 2 },
      { type: "restless_husk", x: 22, y: 24, wander: 2 },
      { type: "restless_husk", x: 18, y: 25, wander: 2 },
      { type: "restless_husk", x: 23, y: 26, wander: 2 }
    ];
    const portals = [
      { x: 2, y: 10, to: "village", tx: 42, ty: 10, req: null, label: "Ashveil Village" },
      { x: 43, y: 22, to: "ruins", tx: 4, ty: 16, req: "py08", label: "The Sunken Ruins" }
    ];
    const spawn = { x: 4, y: 10 };
    const zones = [
      { name: "Ranger's Rest", x: 5, y: 4, w: 10, h: 9 },
      { name: "Glimmercap Hollow", x: 19, y: 2, w: 12, h: 7 },
      { name: "Wick's Waystation", x: 19, y: 10, w: 10, h: 8 },
      { name: "The Wolf Den", x: 3, y: 16, w: 13, h: 12 },
      { name: "The Drowned Rows", x: 16, y: 20, w: 9, h: 8 },
      { name: "Hermit's Hollow", x: 31, y: 18, w: 8, h: 8 },
      { name: "The Warden's Ring", x: 32, y: 2, w: 12, h: 10 }
    ];
    const theme = {
      wall: "#5e4a30", wall2: "#6e5838", trim: "#46361f",
      roof: "#5d7a3a", roof2: "#6e8a46", roofTrim: "#46602c", ridge: "#3a5024",
      door: "#3e2c16", door2: "#503a1e",
      banner: "#3f6230", canvas: "#55653e", rune: "#ffb35a", crystal: "#ffc06a"
    };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]),
      [[spawn.x, spawn.y], [2, 10], [3, 10], [43, 22], [42, 22], [38, 7], [37, 7]]), "G");
    return { id: "forest", name: "Emberwood Forest", act: 2, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "G", theme, zones };
  }

  /* ================= SUNKEN RUINS =================
     Town: The Dry Quarter — a survivors' camp of tents and lanterns.
     Mobs: Sunken Chapel (acolytes) · Scarab Dunes (scarabs) ·
           The Boneyard (crawlers) · Wisplight Graveyard (wisps).
     Boss room: the flooded Throne of the Drowned King. */
  function buildRuins() {
    const g = makeGrid("S");
    border(g, "W", 2);
    // flood channels
    rect(g, 2, 12, 18, 2, "w");
    rect(g, 12, 12, 2, 14, "w");
    rect(g, 26, 18, 18, 2, "w");
    rect(g, 32, 4, 2, 16, "w");
    // causeways over the water
    rect(g, 7, 12, 2, 2, "b");
    rect(g, 16, 12, 2, 2, "b");
    rect(g, 12, 21, 2, 2, "b");
    rect(g, 32, 9, 2, 2, "b");
    rect(g, 36, 18, 2, 2, "b");
    // ruins dressing across the waste
    scatter(g, "P", 6, 3, 3, W - 6, H - 6, 41, "S");
    scatter(g, "W", 6, 3, 3, W - 6, H - 6, 13, "S");
    scatter(g, "s", 8, 3, 3, W - 6, H - 6, 29, "S");
    // ---- town: The Dry Quarter ----
    g[5][5] = "Y"; g[4][8] = "Y";
    g[8][4] = "L"; g[8][10] = "L";
    g[9][6] = "B"; g[10][7] = "B";
    g[6][11] = "k";
    g[4][4] = "u";
    g[8][12] = "F"; g[10][12] = "F";
    // ---- mob zones ----
    // Scarab Dunes
    rect(g, 15, 3, 16, 8, "s");
    scatter(g, "P", 3, 15, 3, 16, 8, 13, "s");
    scatter(g, "e", 3, 15, 3, 16, 8, 17, "s");
    // The Sunken Chapel
    rect(g, 4, 17, 7, 1, "W");
    rect(g, 4, 24, 7, 1, "W");
    rect(g, 4, 17, 1, 8, "W");
    rect(g, 10, 17, 1, 8, "W");
    g[17][7] = "S"; g[24][7] = "S";   // broken doorways
    g[18][5] = "P"; g[18][9] = "P";
    g[21][9] = "+"; g[26][5] = "+"; g[26][9] = "+";
    // The Boneyard
    scatter(g, "e", 8, 15, 20, 11, 8, 23, "S");
    scatter(g, "r", 2, 15, 20, 11, 8, 27, "S");
    g[21][16] = "P"; g[25][23] = "P";
    // Wisplight Graveyard
    scatter(g, "+", 8, 34, 21, 10, 8, 31, "S");
    g[23][36] = "i"; g[26][41] = "i"; g[21][39] = "u";
    // ---- boss room: Throne of the Drowned King ----
    rect(g, 34, 3, 11, 1, "W");
    rect(g, 34, 11, 11, 1, "W");
    rect(g, 34, 3, 1, 9, "W");
    rect(g, 35, 4, 9, 7, "c");
    g[9][34] = "c"; g[10][34] = "c"; // hall gates at the causeway
    g[5][37] = "P"; g[5][40] = "P"; g[9][37] = "P"; g[9][40] = "P";
    g[6][36] = "F"; g[8][36] = "F";
    g[7][43] = "Q";
    g[4][42] = "i"; g[10][42] = "i";

    const npcs = [
      { id: "nyra", x: 10, y: 6 },
      { id: "lumen", x: 12, y: 9 },
      { id: "korr", x: 6, y: 10 },
      { id: "edda", x: 5, y: 7 },
      { id: "ronn", x: 8, y: 11 }
    ];
    const enemies = [
      { type: "drowned_acolyte", x: 6, y: 19, wander: 2 },
      { type: "drowned_acolyte", x: 8, y: 20, wander: 2 },
      { type: "drowned_acolyte", x: 6, y: 27, wander: 2 },
      { type: "drowned_acolyte", x: 8, y: 27, wander: 2 },
      { type: "bone_crawler", x: 17, y: 22, wander: 2 },
      { type: "bone_crawler", x: 20, y: 24, wander: 2 },
      { type: "bone_crawler", x: 24, y: 21, wander: 2 },
      { type: "bone_crawler", x: 18, y: 26, wander: 2 },
      { type: "cursed_scarab", x: 17, y: 5, wander: 3 },
      { type: "cursed_scarab", x: 22, y: 7, wander: 3 },
      { type: "cursed_scarab", x: 28, y: 4, wander: 3 },
      { type: "cursed_scarab", x: 25, y: 9, wander: 3 },
      { type: "grave_wisp", x: 35, y: 22, wander: 2 },
      { type: "grave_wisp", x: 40, y: 24, wander: 2 },
      { type: "grave_wisp", x: 43, y: 23, wander: 2 },
      { type: "grave_wisp", x: 37, y: 26, wander: 2 }
    ];
    const portals = [
      { x: 2, y: 16, to: "forest", tx: 41, ty: 22, req: null, label: "Emberwood Forest" },
      { x: 43, y: 14, to: "citadel", tx: 4, ty: 16, req: "py13", label: "Kingsfall Citadel" }
    ];
    const spawn = { x: 4, y: 16 };
    const zones = [
      { name: "The Dry Quarter", x: 3, y: 3, w: 11, h: 9 },
      { name: "Scarab Dunes", x: 15, y: 2, w: 16, h: 9 },
      { name: "The Sunken Chapel", x: 3, y: 17, w: 9, h: 12 },
      { name: "The Boneyard", x: 14, y: 20, w: 12, h: 9 },
      { name: "Wisplight Graveyard", x: 33, y: 20, w: 11, h: 10 },
      { name: "Throne of the Drowned King", x: 34, y: 2, w: 12, h: 10 }
    ];
    const theme = {
      wall: "#5d6e6a", wall2: "#6e807c", trim: "#44524d",
      roof: "#3d6a66", roof2: "#4a7a74", roofTrim: "#2e524e", ridge: "#264440",
      door: "#3a4a48", door2: "#475a57",
      banner: "#2e5a5e", canvas: "#4e6260", rune: "#7be0ff", crystal: "#7be0ff"
    };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]),
      [[spawn.x, spawn.y], [2, 16], [3, 16], [43, 14], [42, 14], [39, 7], [39, 8], [34, 9], [34, 10]]), "S");
    return { id: "ruins", name: "The Sunken Ruins", act: 3, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "S", theme, zones };
  }

  /* ================= KINGSFALL CITADEL =================
     Town: The Last Bastion — Edric's garrison inside the keep.
     Mobs: Western Ramparts (knights) · Burned Chapel (revenants) ·
           Gargoyle Roost (gargoyles) · Armory Yard (animated armor).
     Boss room: The Great Hall of the Kingless. */
  function buildCitadel() {
    const g = makeGrid("c");
    border(g, "h", 2);
    // inner keep walls + gates
    rect(g, 10, 6, 26, 1, "h");
    rect(g, 10, 6, 1, 8, "h");
    rect(g, 35, 6, 1, 8, "h");
    g[6][22] = "c"; g[6][23] = "c"; // north gate
    g[10][10] = "c"; g[10][35] = "c"; // west & east posterns
    // ---- town: The Last Bastion (garrison) ----
    g[8][13] = "Y"; g[8][16] = "Y";
    g[11][12] = "j"; g[11][15] = "j";
    g[8][19] = "B";
    g[8][21] = "n"; g[8][24] = "n";
    g[10][23] = "k";
    house(g, 27, 7, 4, 3);          // Vulka's forge
    g[10][31] = "A";
    g[12][34] = "i"; g[13][32] = "i"; // Wynn's scrying crystals
    g[13][12] = "F"; g[12][26] = "F";
    // Avenue of Kings (west portal -> east portal)
    g[14][12] = "u"; g[18][12] = "u"; g[14][20] = "u"; g[18][20] = "u";
    g[14][26] = "n"; g[18][26] = "n";
    g[14][33] = "F"; g[18][33] = "F";
    // ---- mob zones ----
    // Western Ramparts
    scatter(g, "W", 6, 3, 3, 7, 11, 17, "c");
    scatter(g, "W", 4, 3, 19, 7, 9, 19, "c");
    scatter(g, "T", 2, 3, 19, 7, 9, 29, "c");
    scatter(g, "r", 2, 3, 4, 7, 9, 23, "c");
    scatter(g, "r", 2, 3, 20, 7, 7, 25, "c");
    // The Burned Chapel
    rect(g, 38, 4, 5, 1, "W");
    rect(g, 38, 4, 1, 7, "W");
    rect(g, 42, 4, 1, 7, "W");
    g[5][40] = "F";
    g[11][37] = "+"; g[10][43] = "+"; g[11][41] = "+";
    // Gargoyle Roost
    scatter(g, "W", 5, 10, 19, 11, 10, 37, "c");
    g[21][11] = "P"; g[24][15] = "P"; g[20][18] = "P";
    scatter(g, "T", 2, 10, 19, 11, 10, 43, "c");
    // The Armory Yard
    g[20][22] = "j"; g[20][25] = "j"; g[26][22] = "j";
    g[24][26] = "B";
    // ---- boss room: The Great Hall ----
    rect(g, 28, 19, 16, 1, "W");
    rect(g, 28, 29, 16, 1, "W");
    rect(g, 28, 19, 1, 11, "W");
    rect(g, 29, 20, 15, 9, "S");
    g[19][31] = "S"; g[19][32] = "S"; // the hall gates
    g[18][30] = "u"; g[18][33] = "u"; // kings flanking the entrance
    g[20][30] = "F"; g[28][30] = "F"; g[20][42] = "F"; g[28][42] = "F";
    g[23][30] = "n"; g[25][30] = "n";
    g[22][33] = "P"; g[26][33] = "P"; g[22][36] = "P"; g[26][36] = "P"; g[22][39] = "P"; g[26][39] = "P";
    g[24][41] = "Q";
    g[23][42] = "i"; g[25][42] = "i";

    const npcs = [
      { id: "edric", x: 22, y: 10 },
      { id: "brakka", x: 14, y: 10 },
      { id: "tam", x: 18, y: 12 },
      { id: "vulka", x: 29, y: 11 },
      { id: "wynn", x: 33, y: 12 }
    ];
    const enemies = [
      { type: "spectral_knight", x: 5, y: 7, wander: 2 },
      { type: "spectral_knight", x: 7, y: 11, wander: 2 },
      { type: "spectral_knight", x: 4, y: 22, wander: 2 },
      { type: "spectral_knight", x: 7, y: 25, wander: 2 },
      { type: "flame_revenant", x: 39, y: 6, wander: 2 },
      { type: "flame_revenant", x: 41, y: 8, wander: 2 },
      { type: "flame_revenant", x: 40, y: 11, wander: 2 },
      { type: "flame_revenant", x: 43, y: 7, wander: 2 },
      { type: "molten_gargoyle", x: 12, y: 21, wander: 2 },
      { type: "molten_gargoyle", x: 16, y: 23, wander: 2 },
      { type: "molten_gargoyle", x: 13, y: 26, wander: 2 },
      { type: "molten_gargoyle", x: 19, y: 25, wander: 2 },
      { type: "animated_armor", x: 23, y: 22, wander: 2 },
      { type: "animated_armor", x: 26, y: 21, wander: 2 },
      { type: "animated_armor", x: 22, y: 25, wander: 2 },
      { type: "animated_armor", x: 25, y: 27, wander: 2 }
    ];
    const portals = [
      { x: 2, y: 16, to: "ruins", tx: 41, ty: 14, req: null, label: "The Sunken Ruins" },
      { x: 43, y: 16, to: "sanctum", tx: 4, ty: 16, req: "py18", label: "The Flame Sanctum" }
    ];
    const spawn = { x: 4, y: 16 };
    const zones = [
      { name: "The Last Bastion", x: 10, y: 6, w: 26, h: 8 },
      { name: "Western Ramparts", x: 2, y: 2, w: 8, h: 12 },
      { name: "The Burned Chapel", x: 36, y: 2, w: 8, h: 11 },
      { name: "Gargoyle Roost", x: 10, y: 19, w: 11, h: 11 },
      { name: "The Armory Yard", x: 21, y: 19, w: 7, h: 11 },
      { name: "The Great Hall", x: 28, y: 18, w: 16, h: 12 }
    ];
    const theme = {
      wall: "#6e6e76", wall2: "#7e7e88", trim: "#50505a",
      roof: "#4a4e5e", roof2: "#5a5e70", roofTrim: "#3a3e4c", ridge: "#2e3240",
      door: "#3a3442", door2: "#4a4452",
      banner: "#2e3a6a", canvas: "#4a5066", rune: "#b9c9ff", crystal: "#c478ff"
    };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]),
      [[spawn.x, spawn.y], [2, 16], [3, 16], [43, 16], [42, 16], [35, 24], [35, 23], [31, 19], [32, 19]]), "c");
    return { id: "citadel", name: "Kingsfall Citadel", act: 4, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "c", theme, zones };
  }

  /* ================= THE FLAME SANCTUM =================
     Town: Pilgrims' Rest — the last camp before the end.
     Mobs: Serpent Coils (serpents) · Sentinel Causeway (sentinels) ·
           Field of Echoes (echoes of the first army).
     Boss rooms: The Twin Pyres island + the Dais of the First King. */
  function buildSanctum() {
    const g = makeGrid("x");
    // grand obsidian platform
    rect(g, 3, 3, 40, 26, "S");
    // lava moats
    rect(g, 3, 3, 40, 1, "l");
    rect(g, 3, 28, 40, 1, "l");
    rect(g, 18, 8, 2, 16, "l");
    rect(g, 18, 14, 2, 3, "S"); // crossing
    rect(g, 28, 4, 12, 8, "l");
    rect(g, 30, 6, 8, 4, "S");  // island of the Twin Pyres
    rect(g, 28, 8, 2, 1, "S");  // bridge to the island
    // ---- town: Pilgrims' Rest ----
    g[14][6] = "Y"; g[19][6] = "Y";
    g[17][9] = "M";
    g[13][12] = "F"; g[20][12] = "F";
    g[15][8] = "B";
    g[13][4] = "O"; g[21][4] = "O";
    // ---- mob zones ----
    // The Serpent Coils
    rect(g, 5, 4, 11, 7, "a");
    scatter(g, "^", 4, 5, 4, 11, 7, 19, "a");
    scatter(g, "e", 2, 5, 4, 11, 7, 21, "a");
    // Sentinel Causeway
    rect(g, 4, 24, 12, 2, "c");
    g[23][5] = "P"; g[23][8] = "P"; g[23][11] = "P";
    g[26][5] = "P"; g[26][8] = "P"; g[26][11] = "P";
    g[27][14] = "^";
    // The Field of Echoes — where the first army fell
    rect(g, 21, 13, 10, 13, "a");
    scatter(g, "e", 5, 21, 13, 10, 13, 33, "a");
    scatter(g, "T", 2, 21, 13, 10, 13, 35, "a");
    g[13][23] = "n"; g[13][28] = "n"; // tattered war banners
    g[20][22] = "P"; g[17][29] = "P";
    // ---- boss room: The Twin Pyres ----
    g[6][31] = "F"; g[6][36] = "F";
    g[9][31] = "i"; g[9][36] = "i";
    // ---- boss room: Dais of the First King ----
    rect(g, 33, 14, 9, 9, "c");
    g[14][34] = "F"; g[14][41] = "F"; g[22][34] = "F"; g[22][41] = "F";
    g[18][40] = "Q";
    g[16][32] = "n"; g[20][32] = "n";
    g[13][33] = "O"; g[13][42] = "O"; g[23][33] = "O"; g[23][42] = "O";

    const npcs = [
      { id: "herald", x: 10, y: 15 },
      { id: "ilio", x: 13, y: 16 },
      { id: "keeper", x: 10, y: 18 },
      { id: "vesna", x: 7, y: 21 },
      { id: "flame", x: 37, y: 18 }
    ];
    const enemies = [
      { type: "flame_serpent", x: 7, y: 6, wander: 2 },
      { type: "flame_serpent", x: 12, y: 5, wander: 2 },
      { type: "flame_serpent", x: 6, y: 9, wander: 2 },
      { type: "flame_serpent", x: 14, y: 8, wander: 2 },
      { type: "pyre_sentinel", x: 6, y: 24, wander: 2 },
      { type: "pyre_sentinel", x: 10, y: 25, wander: 2 },
      { type: "pyre_sentinel", x: 13, y: 24, wander: 2 },
      { type: "pyre_sentinel", x: 8, y: 25, wander: 2 },
      { type: "echo_first", x: 24, y: 15, wander: 2 },
      { type: "echo_first", x: 28, y: 19, wander: 2 },
      { type: "echo_first", x: 22, y: 23, wander: 2 },
      { type: "echo_first", x: 27, y: 24, wander: 2 }
    ];
    const portals = [
      { x: 3, y: 16, to: "citadel", tx: 41, ty: 16, req: null, label: "Kingsfall Citadel" }
    ];
    const spawn = { x: 5, y: 16 };
    const zones = [
      { name: "The Serpent Coils", x: 4, y: 3, w: 13, h: 9 },
      { name: "Pilgrims' Rest", x: 3, y: 12, w: 14, h: 10 },
      { name: "Sentinel Causeway", x: 4, y: 22, w: 13, h: 7 },
      { name: "The Field of Echoes", x: 20, y: 12, w: 12, h: 16 },
      { name: "The Twin Pyres", x: 28, y: 4, w: 12, h: 8 },
      { name: "Dais of the First King", x: 32, y: 13, w: 12, h: 12 }
    ];
    const theme = {
      wall: "#3a3034", wall2: "#46383c", trim: "#262022",
      roof: "#5e2a1a", roof2: "#6e3422", roofTrim: "#451f12", ridge: "#33160c",
      door: "#2a1a12", door2: "#3a2418",
      banner: "#c43e0c", canvas: "#5e3026", rune: "#ffd23f", crystal: "#ffb53a"
    };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]),
      [[spawn.x, spawn.y], [3, 16], [4, 16], [33, 8], [34, 8], [36, 20], [36, 19], [28, 8], [29, 8]]), "S");
    return { id: "sanctum", name: "The Flame Sanctum", act: 5, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "S", theme, zones };
  }

  const maps = {};
  for (const b of [buildVillage, buildForest, buildRuins, buildCitadel, buildSanctum]) {
    const m = b();
    maps[m.id] = m;
  }
  return maps;
})();
