/* ============================================================
   MAPS — five zones, built programmatically so walkability
   stays consistent. Tile chars are defined in Sprites.TILES.
   ============================================================ */
window.MAPS = (function () {
  // Default dimensions (used by any map that doesn't declare its own).
  // Each build function may shadow these with a local W/H — the helpers
  // below derive the working size from the grid they are handed, so maps
  // of different sizes coexist.
  const W = 46, H = 32;

  function makeGrid(base, w, h) {
    w = w || W; h = h || H;
    const g = [];
    for (let y = 0; y < h; y++) g.push(new Array(w).fill(base));
    return g;
  }
  function rect(g, x, y, w, h, ch) {
    const GW = g[0].length, GH = g.length;
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++)
        if (yy >= 0 && yy < GH && xx >= 0 && xx < GW) g[yy][xx] = ch;
  }
  function border(g, ch, n) {
    const GW = g[0].length, GH = g.length;
    rect(g, 0, 0, GW, n, ch); rect(g, 0, GH - n, GW, n, ch);
    rect(g, 0, 0, n, GH, ch); rect(g, GW - n, 0, n, GH, ch);
  }
  function scatter(g, ch, count, x, y, w, h, seed, onlyOn) {
    const GW = g[0].length, GH = g.length;
    let placed = 0, i = 0;
    while (placed < count && i < count * 30) {
      const hx = x + Math.floor(Sprites.hash(seed + i * 7, seed * 3 + i) * w);
      const hy = y + Math.floor(Sprites.hash(seed * 5 + i, seed + i * 11) * h);
      i++;
      if (hx < 1 || hy < 1 || hx >= GW - 1 || hy >= GH - 1) continue;
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
      g[y][x] = ch;
      // ensure at least one adjacent walkable approach tile
      if (Sprites.TILES[g[y + 1][x]].solid && Sprites.TILES[g[y - 1][x]].solid &&
          Sprites.TILES[g[y][x + 1]].solid && Sprites.TILES[g[y][x - 1]].solid) {
        g[y + 1][x] = ch;
      }
    }
  }

  /* ================= ASHVEIL VILLAGE ================= */
  function buildVillage() {
    const W = 64, H = 44;                 // larger than the default — room to breathe
    const g = makeGrid("g", W, H);
    border(g, "t", 2);

    // ---- biomes ----
    // the scorched western quarter, where the Flame's return burned first
    rect(g, 2, 2, 10, H - 4, "a");
    // a craggy, pine-topped knoll in the north-west
    rect(g, 3, 3, 9, 6, "k");
    rect(g, 5, 4, 6, 4, "g");             // a walkable shelf cut into the crag
    scatter(g, "e", 5, 4, 3, 9, 7, 83, "g");
    // the river across the south, with two crossings
    rect(g, 0, 30, W, 3, "w");
    rect(g, 30, 29, 3, 6, "b");           // the great bridge
    rect(g, 48, 30, 2, 3, "b");           // the eastern footbridge
    // a calm mill-pond in the north-east
    rect(g, 50, 5, 8, 5, "w");
    // a bog where the river backs up, south-west
    rect(g, 5, 33, 8, 5, "u");
    // farmland terraces, south-east across the river
    rect(g, 38, 34, 20, 7, "o");
    // the village green — a flowering commons at the heart of town
    rect(g, 26, 14, 12, 8, "q");

    // ---- roads ----
    rect(g, 31, 2, 1, 28, "p");           // north gate -> great bridge (the spine)
    rect(g, 8, 20, 50, 1, "p");           // the east-west high road
    rect(g, 31, 33, 1, 9, "p");           // bridge -> south fields
    rect(g, 49, 33, 1, 8, "p");           // footbridge -> fields
    rect(g, 57, 18, 6, 2, "p");           // road to the east gate
    rect(g, 8, 10, 1, 11, "p");           // the west lane

    // ---- buildings ----
    house(g, 14, 4, 6, 4);                // north homes
    house(g, 22, 4, 6, 4);
    house(g, 40, 4, 7, 4);
    house(g, 36, 8, 8, 5);                // the chapel / longhouse
    house(g, 11, 14, 6, 4);               // Tobin's shop (west)
    house(g, 48, 12, 7, 5);               // Hesper's granary (east)
    house(g, 16, 24, 6, 4);               // south-of-road homes
    house(g, 44, 24, 7, 4);
    house(g, 20, 34, 6, 4);               // the mill by the river
    // a gatehouse framing the east road
    rect(g, 58, 16, 4, 1, "h");
    rect(g, 58, 21, 4, 1, "h");

    // a decorative stock pen in the fields (no gate needed — purely scenery)
    rect(g, 52, 35, 6, 5, "f");
    rect(g, 53, 36, 4, 3, "d");

    // ---- details ----
    // braziers ring the green, and a shard of the Flame's mark rests at its centre
    g[15][29] = "F"; g[15][36] = "F";
    g[21][29] = "F"; g[21][36] = "F";
    g[18][32] = "C";
    // orchard rows, riverbank trees, rocks, burnt snags
    scatter(g, "t", 16, 40, 23, 20, 6, 23, "g");   // orchard fringe (south-east)
    scatter(g, "t", 12, 14, 33, 12, 8, 11, "g");   // riverbank woods (south-west)
    scatter(g, "r", 7, 44, 5, 17, 11, 29, "g");    // rocks by the pond
    scatter(g, "t", 7, 4, 22, 8, 7, 31, "a");      // burnt snags in the scorched quarter
    scatter(g, "q", 16, 24, 12, 16, 12, 47, "g");  // wildflowers spilling from the green

    const npcs = [
      { id: "elder_maren", x: 33, y: 13 },
      { id: "tobin", x: 14, y: 18 },
      { id: "sera", x: 41, y: 14 },
      { id: "pip", x: 33, y: 16 },          // tending the beacon on the green
      { id: "hesper", x: 51, y: 18 }        // at her granary door
    ];
    const enemies = [
      // cinder rats — the riverbanks and the south fields
      { type: "cinder_rat", x: 16, y: 35, wander: 3 },
      { type: "cinder_rat", x: 26, y: 38, wander: 3 },
      { type: "cinder_rat", x: 40, y: 36, wander: 3 },
      { type: "cinder_rat", x: 50, y: 34, wander: 3 },
      // ash slimes — the eastern approach and scorched fringes
      { type: "ash_slime", x: 54, y: 23, wander: 3 },
      { type: "ash_slime", x: 57, y: 26, wander: 3 },
      { type: "ash_slime", x: 6, y: 17, wander: 3 },
      { type: "ash_slime", x: 9, y: 25, wander: 3 },
      // ember imps — the burnt western quarter
      { type: "ember_imp", x: 7, y: 12, wander: 3 },
      { type: "ember_imp", x: 10, y: 15, wander: 3 },
      { type: "ember_imp", x: 8, y: 28, wander: 3 },
      { type: "ember_imp", x: 6, y: 27, wander: 3 },
      // ash moths — fluttering around the green and the beacon
      { type: "ash_moth", x: 27, y: 16, wander: 3 },
      { type: "ash_moth", x: 35, y: 17, wander: 3 },
      { type: "ash_moth", x: 29, y: 23, wander: 3 },
      { type: "ash_moth", x: 24, y: 25, wander: 3 },
      // tallow grubs — the granary stores and the harvest fields
      { type: "tallow_grub", x: 47, y: 18, wander: 3 },
      { type: "tallow_grub", x: 53, y: 21, wander: 3 },
      { type: "tallow_grub", x: 45, y: 36, wander: 3 },
      { type: "tallow_grub", x: 52, y: 33, wander: 3 }
    ];
    const portals = [
      { x: 62, y: 18, to: "forest", tx: 4, ty: 22, req: "py04", label: "Emberwood Forest" },
      { x: 62, y: 19, to: "forest", tx: 4, ty: 22, req: "py04", label: "Emberwood Forest" }
    ];
    const spawn = { x: 31, y: 27 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [62, 18], [62, 19], [61, 18], [61, 19], [57, 19]]), "g");
    return { id: "village", name: "Ashveil Village", act: 1, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "g" };
  }

  /* ================= EMBERWOOD FOREST ================= */
  function buildForest() {
    const W = 64, H = 44;
    const g = makeGrid("G", W, H);
    border(g, "t", 2);
    // dense woods
    scatter(g, "t", 170, 2, 2, W - 4, H - 4, 7, "G");

    // ---- glades carved from the woods (the connected, walkable heart) ----
    rect(g, 4, 17, 16, 13, "G");      // west glade (entrance)
    rect(g, 24, 13, 14, 10, "q");     // the fae meadow (a bright glade)
    rect(g, 28, 4, 16, 9, "G");       // north clearing — the Warden's
    rect(g, 42, 16, 17, 13, "G");     // east glade
    rect(g, 6, 31, 17, 10, "G");      // south marsh glade

    // pine stands & a mossy crag for texture (in the deep woods)
    scatter(g, "e", 22, 44, 4, 17, 11, 61, "G");
    scatter(g, "e", 14, 4, 4, 18, 9, 67, "G");
    rect(g, 56, 9, 6, 6, "k");
    rect(g, 57, 10, 4, 4, "G");

    // water features
    rect(g, 10, 34, 8, 5, "m");       // marsh
    rect(g, 6, 37, 5, 3, "u");        // bog
    rect(g, 47, 23, 7, 4, "w");       // forest pool
    rect(g, 30, 5, 5, 3, "w");        // the sacred spring

    // fae crystals glittering in the meadow
    g[15][27] = "C"; g[16][34] = "C";

    // ---- paths weaving the glades together ----
    rect(g, 2, 22, 23, 1, "p");       // west entrance -> west glade -> meadow
    rect(g, 31, 8, 1, 6, "p");        // meadow -> north clearing (spur)
    rect(g, 37, 22, 6, 1, "p");       // meadow -> east glade
    rect(g, 58, 22, 4, 1, "p");       // east glade -> east exit
    rect(g, 11, 29, 1, 3, "p");       // west glade -> south marsh glade

    // structures (in glades, clear of the paths)
    house(g, 5, 18, 5, 3);            // Fenn's snare-lodge (west glade)
    house(g, 15, 25, 5, 3);           // Aldous's hut (west glade)
    house(g, 50, 18, 5, 3);           // Bryony's lamp-shrine (east glade)

    // braziers
    g[4][31] = "F"; g[4][40] = "F";   // the Warden's clearing
    g[22][12] = "F"; g[22][45] = "F"; // path-side lamps

    const npcs = [
      { id: "yara", x: 10, y: 23 },        // west entrance
      { id: "fenn", x: 7, y: 21 },         // by his snare-lodge
      { id: "aldous", x: 17, y: 28 },      // by his hut
      { id: "wick", x: 30, y: 17 },        // merchant in the meadow
      { id: "bryony", x: 52, y: 21 }       // by her lamp-shrine
    ];
    const enemies = [
      // hollow wolves — the south marsh woods
      { type: "hollow_wolf", x: 10, y: 33, wander: 3 },
      { type: "hollow_wolf", x: 16, y: 37, wander: 3 },
      { type: "hollow_wolf", x: 20, y: 34, wander: 3 },
      { type: "hollow_wolf", x: 9, y: 39, wander: 3 },
      // blight sprites — the north clearing
      { type: "blight_sprite", x: 30, y: 9, wander: 3 },
      { type: "blight_sprite", x: 35, y: 6, wander: 3 },
      { type: "blight_sprite", x: 39, y: 9, wander: 3 },
      { type: "blight_sprite", x: 33, y: 10, wander: 3 },
      // restless husks — the east glade
      { type: "restless_husk", x: 44, y: 20, wander: 3 },
      { type: "restless_husk", x: 50, y: 20, wander: 3 },
      { type: "restless_husk", x: 46, y: 27, wander: 3 },
      { type: "restless_husk", x: 55, y: 21, wander: 3 },
      { type: "restless_husk", x: 48, y: 18, wander: 3 },
      // bramble crawlers — Fenn's west glade
      { type: "bramble_crawler", x: 8, y: 24, wander: 3 },
      { type: "bramble_crawler", x: 13, y: 19, wander: 3 },
      { type: "bramble_crawler", x: 11, y: 22, wander: 3 },
      { type: "bramble_crawler", x: 18, y: 22, wander: 3 },
      // mire lurkers — the east glade and its pool
      { type: "mire_lurker", x: 44, y: 24, wander: 3 },
      { type: "mire_lurker", x: 54, y: 24, wander: 3 },
      { type: "mire_lurker", x: 45, y: 21, wander: 3 },
      { type: "mire_lurker", x: 56, y: 26, wander: 3 }
    ];
    const portals = [
      { x: 2, y: 22, to: "village", tx: 59, ty: 18, req: null, label: "Ashveil Village" },
      { x: 61, y: 22, to: "ruins", tx: 4, ty: 22, req: "py08", label: "The Sunken Ruins" },
      { x: 61, y: 23, to: "ruins", tx: 4, ty: 22, req: "py08", label: "The Sunken Ruins" }
    ];
    const spawn = { x: 4, y: 22 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [2, 22], [3, 22], [61, 22], [61, 23], [60, 22], [38, 7]]), "G");
    return { id: "forest", name: "Emberwood Forest", act: 2, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "G" };
  }

  /* ================= SUNKEN RUINS ================= */
  function buildRuins() {
    const W = 64, H = 44;
    const g = makeGrid("S", W, H);
    border(g, "W", 2);

    // ---- flood channels (localized, each spanned by a causeway) ----
    rect(g, 20, 5, 3, 15, "w");        // north-west channel
    rect(g, 20, 11, 3, 2, "b");        // causeway
    rect(g, 41, 24, 3, 14, "w");       // south-east channel
    rect(g, 41, 29, 3, 2, "b");        // causeway
    rect(g, 26, 30, 14, 3, "w");       // the central pool
    rect(g, 31, 30, 2, 3, "b");        // causeway

    // ---- broken halls ----
    rect(g, 6, 8, 1, 11, "W"); rect(g, 6, 8, 11, 1, "W");
    rect(g, 50, 16, 1, 12, "W"); rect(g, 40, 16, 11, 1, "W");
    rect(g, 28, 6, 1, 7, "W"); rect(g, 36, 6, 1, 7, "W"); rect(g, 28, 6, 9, 1, "W");

    // ---- the flooded throne (boss court, north-east) ----
    rect(g, 48, 8, 10, 6, "c");
    g[8][49] = "F"; g[8][56] = "F";

    // ---- biomes ----
    scatter(g, "P", 18, 3, 3, W - 6, H - 6, 13, "S");   // standing pillars
    scatter(g, "s", 24, 3, 3, W - 6, H - 6, 29, "S");   // sand banks
    scatter(g, "W", 14, 3, 3, W - 6, H - 6, 41, "S");   // scattered rubble
    rect(g, 6, 34, 9, 5, "u");         // silt bog (south-west)
    rect(g, 49, 34, 9, 5, "u");        // silt bog (south-east)
    rect(g, 8, 21, 7, 6, "q");         // a mossy reclaimed court
    rect(g, 53, 18, 6, 5, "k");        // a rubble crag
    rect(g, 54, 19, 4, 3, "S");        // its shelf
    g[16][11] = "C"; g[24][32] = "C"; g[11][44] = "C"; g[37][24] = "C";  // relic crystals

    const npcs = [
      { id: "nyra", x: 9, y: 18 },         // near the west entrance
      { id: "sael", x: 13, y: 24 },        // by the salvage court
      { id: "lumen", x: 33, y: 22 },       // central plaza
      { id: "korr", x: 26, y: 25 },        // merchant
      { id: "orin", x: 46, y: 20 }         // tallymaster, near the throne approach
    ];
    const enemies = [
      // drowned acolytes — the west stacks
      { type: "drowned_acolyte", x: 8, y: 14, wander: 3 },
      { type: "drowned_acolyte", x: 12, y: 16, wander: 3 },
      { type: "drowned_acolyte", x: 7, y: 26, wander: 3 },
      { type: "drowned_acolyte", x: 15, y: 30, wander: 3 },
      // bone crawlers — the north halls
      { type: "bone_crawler", x: 26, y: 10, wander: 3 },
      { type: "bone_crawler", x: 31, y: 8, wander: 3 },
      { type: "bone_crawler", x: 35, y: 11, wander: 3 },
      { type: "bone_crawler", x: 30, y: 14, wander: 3 },
      // grave wisps — the south aisles
      { type: "grave_wisp", x: 24, y: 26, wander: 3 },
      { type: "grave_wisp", x: 36, y: 27, wander: 3 },
      { type: "grave_wisp", x: 20, y: 35, wander: 3 },
      { type: "grave_wisp", x: 44, y: 35, wander: 3 },
      // cursed scarabs — the outer east halls
      { type: "cursed_scarab", x: 46, y: 24, wander: 3 },
      { type: "cursed_scarab", x: 52, y: 26, wander: 3 },
      { type: "cursed_scarab", x: 48, y: 30, wander: 3 },
      { type: "cursed_scarab", x: 55, y: 24, wander: 3 },
      // silt serpents — Sael's flooded salvage court
      { type: "silt_serpent", x: 10, y: 22, wander: 3 },
      { type: "silt_serpent", x: 14, y: 27, wander: 3 },
      { type: "silt_serpent", x: 9, y: 36, wander: 3 },
      { type: "silt_serpent", x: 17, y: 33, wander: 3 },
      // coral golems — Orin's east hoard
      { type: "coral_golem", x: 45, y: 17, wander: 3 },
      { type: "coral_golem", x: 47, y: 26, wander: 3 },
      { type: "coral_golem", x: 51, y: 31, wander: 3 },
      { type: "coral_golem", x: 56, y: 25, wander: 3 }
    ];
    const portals = [
      { x: 2, y: 22, to: "forest", tx: 60, ty: 22, req: null, label: "Emberwood Forest" },
      { x: 61, y: 22, to: "citadel", tx: 4, ty: 22, req: "py13", label: "Kingsfall Citadel" },
      { x: 61, y: 23, to: "citadel", tx: 4, ty: 22, req: "py13", label: "Kingsfall Citadel" }
    ];
    const spawn = { x: 4, y: 22 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [2, 22], [3, 22], [61, 22], [61, 23], [60, 22], [53, 11]]), "S");
    return { id: "ruins", name: "The Sunken Ruins", act: 3, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "S" };
  }

  /* ================= KINGSFALL CITADEL ================= */
  function buildCitadel() {
    const W = 64, H = 44;
    const g = makeGrid("c", W, H);
    border(g, "h", 2);

    // ---- the great hall (boss court): walled stone with a south breach ----
    rect(g, 27, 14, 12, 12, "S");
    rect(g, 27, 14, 12, 1, "W"); rect(g, 27, 25, 12, 1, "W");
    rect(g, 27, 14, 1, 12, "W"); rect(g, 38, 14, 1, 12, "W");
    g[25][32] = "S"; g[25][33] = "S";        // a breach in the south wall

    // ---- inner keep wall-stubs (flavor; wide gaps, never spanning) ----
    rect(g, 18, 6, 1, 9, "h");
    rect(g, 46, 6, 1, 9, "h");
    rect(g, 14, 33, 13, 1, "h"); g[33][20] = "c";

    // ---- buildings ----
    house(g, 6, 6, 6, 5);     // west barracks (Doran)
    house(g, 51, 6, 6, 5);    // east tower hall
    house(g, 7, 35, 6, 4);    // west armory (Vulka)
    house(g, 51, 34, 6, 4);   // east chapel (Isolde)

    // ---- biomes ----
    rect(g, 5, 17, 9, 7, "a");      // a scorched siege-yard (west)
    rect(g, 49, 16, 9, 8, "q");     // a reclaimed garden court (east)
    rect(g, 6, 39, 8, 3, "w");      // the cistern
    scatter(g, "k", 8, 40, 34, 18, 7, 51, "c");    // fallen masonry
    scatter(g, "W", 14, 3, 3, W - 6, H - 6, 17, "c");
    scatter(g, "r", 8, 3, 3, W - 6, H - 6, 23, "c");
    g[18][55] = "C"; g[33][29] = "C";   // relic shards

    // ---- braziers ----
    g[12][29] = "F"; g[12][36] = "F";
    g[28][30] = "F"; g[28][35] = "F";

    const npcs = [
      { id: "edric", x: 31, y: 30 },       // central bailey, before the hall
      { id: "doran", x: 10, y: 12 },       // west barracks
      { id: "vulka", x: 10, y: 34 },       // west armory
      { id: "wynn", x: 52, y: 20 },        // east garden court
      { id: "isolde", x: 54, y: 33 }       // east chapel
    ];
    const enemies = [
      // spectral knights — the west yard
      { type: "spectral_knight", x: 8, y: 20, wander: 3 },
      { type: "spectral_knight", x: 12, y: 23, wander: 3 },
      { type: "spectral_knight", x: 6, y: 27, wander: 3 },
      { type: "spectral_knight", x: 14, y: 18, wander: 3 },
      // flame revenants — the central bailey, north of the hall
      { type: "flame_revenant", x: 28, y: 9, wander: 3 },
      { type: "flame_revenant", x: 33, y: 8, wander: 3 },
      { type: "flame_revenant", x: 36, y: 11, wander: 3 },
      { type: "flame_revenant", x: 30, y: 11, wander: 3 },
      // molten gargoyles — the east ramparts
      { type: "molten_gargoyle", x: 45, y: 9, wander: 3 },
      { type: "molten_gargoyle", x: 49, y: 12, wander: 3 },
      { type: "molten_gargoyle", x: 55, y: 11, wander: 3 },
      { type: "molten_gargoyle", x: 44, y: 13, wander: 3 },
      // animated armors — the central bailey, south of the hall
      { type: "animated_armor", x: 28, y: 32, wander: 3 },
      { type: "animated_armor", x: 33, y: 34, wander: 3 },
      { type: "animated_armor", x: 36, y: 31, wander: 3 },
      { type: "animated_armor", x: 30, y: 37, wander: 3 },
      // pact knights — Doran's west barracks ground
      { type: "pact_knight", x: 9, y: 9, wander: 3 },
      { type: "pact_knight", x: 14, y: 12, wander: 3 },
      { type: "pact_knight", x: 8, y: 15, wander: 3 },
      { type: "pact_knight", x: 16, y: 30, wander: 3 },
      // gloom sentinels — Isolde's east chapel ground
      { type: "gloom_sentinel", x: 50, y: 28, wander: 3 },
      { type: "gloom_sentinel", x: 55, y: 30, wander: 3 },
      { type: "gloom_sentinel", x: 48, y: 33, wander: 3 },
      { type: "gloom_sentinel", x: 57, y: 26, wander: 3 }
    ];
    const portals = [
      { x: 2, y: 22, to: "ruins", tx: 60, ty: 22, req: null, label: "The Sunken Ruins" },
      { x: 61, y: 22, to: "sanctum", tx: 4, ty: 22, req: "py18", label: "The Flame Sanctum" },
      { x: 61, y: 23, to: "sanctum", tx: 4, ty: 22, req: "py18", label: "The Flame Sanctum" }
    ];
    const spawn = { x: 4, y: 22 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [2, 22], [3, 22], [61, 22], [61, 23], [60, 22], [32, 20]]), "c");
    return { id: "citadel", name: "Kingsfall Citadel", act: 4, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "c" };
  }

  /* ================= THE FLAME SANCTUM ================= */
  function buildSanctum() {
    const W = 64, H = 44;
    const g = makeGrid("x", W, H);     // the void

    // the grand platform, floating on fire
    rect(g, 3, 3, 58, 38, "S");
    rect(g, 3, 3, 58, 1, "l"); rect(g, 3, 40, 58, 1, "l");   // lava rim
    rect(g, 3, 3, 1, 38, "l"); rect(g, 60, 3, 1, 38, "l");
    rect(g, 2, 21, 3, 4, "S");         // the west landing dock

    // the central lava chasm, crossed by a single span
    rect(g, 30, 12, 4, 22, "l");
    rect(g, 30, 21, 4, 3, "S");        // the crossing

    // the twin-flame lava isle (north-west)
    rect(g, 8, 4, 12, 8, "l");
    rect(g, 10, 5, 8, 5, "S");         // the isle
    rect(g, 13, 9, 2, 4, "S");         // bridge to the platform

    // the dais of the Eternal Flame (the final throne, east)
    rect(g, 46, 16, 12, 10, "c");
    g[16][47] = "F"; g[16][56] = "F";
    g[25][47] = "F"; g[25][56] = "F";

    // biomes
    rect(g, 6, 31, 9, 6, "a");         // ash flats (south-west)
    scatter(g, "k", 14, 36, 5, 22, 31, 51, "S");   // obsidian crags (east)
    scatter(g, "P", 14, 4, 4, 24, 34, 19, "S");    // pillars (west galleries)
    g[14][13] = "C"; g[20][40] = "C"; g[30][26] = "C";   // relic crystals

    const npcs = [
      { id: "herald", x: 20, y: 16 },
      { id: "vesh", x: 16, y: 20 },         // cartographer (grid lesson)
      { id: "ilio", x: 22, y: 26 },
      { id: "quill", x: 25, y: 30 },        // loremaster (recursion lesson)
      { id: "keeper", x: 9, y: 33 },        // quartermaster's last shop
      { id: "flame", x: 52, y: 22 }         // the Eternal Flame, at the dais
    ];
    const enemies = [
      // flame serpents — the north gallery
      { type: "flame_serpent", x: 22, y: 7, wander: 3 },
      { type: "flame_serpent", x: 25, y: 9, wander: 3 },
      { type: "flame_serpent", x: 27, y: 6, wander: 3 },
      { type: "flame_serpent", x: 20, y: 10, wander: 3 },
      { type: "flame_serpent", x: 24, y: 11, wander: 3 },
      // pyre sentinels — the south gallery
      { type: "pyre_sentinel", x: 16, y: 36, wander: 3 },
      { type: "pyre_sentinel", x: 22, y: 34, wander: 3 },
      { type: "pyre_sentinel", x: 18, y: 38, wander: 3 },
      { type: "pyre_sentinel", x: 26, y: 37, wander: 3 },
      { type: "pyre_sentinel", x: 12, y: 38, wander: 3 },
      // echoes of the first — the east gallery
      { type: "echo_first", x: 38, y: 9, wander: 3 },
      { type: "echo_first", x: 42, y: 14, wander: 3 },
      { type: "echo_first", x: 40, y: 33, wander: 3 },
      { type: "echo_first", x: 44, y: 30, wander: 3 },
      // furnace drakes — Vesh's furnace grid (west)
      { type: "furnace_drake", x: 14, y: 16, wander: 3 },
      { type: "furnace_drake", x: 18, y: 22, wander: 3 },
      { type: "furnace_drake", x: 12, y: 20, wander: 3 },
      { type: "furnace_drake", x: 20, y: 18, wander: 3 },
      // verse wraiths — Quill's recursion gallery (south-west)
      { type: "verse_wraith", x: 22, y: 29, wander: 3 },
      { type: "verse_wraith", x: 26, y: 31, wander: 3 },
      { type: "verse_wraith", x: 20, y: 33, wander: 3 },
      { type: "verse_wraith", x: 24, y: 27, wander: 3 }
    ];
    const portals = [
      { x: 2, y: 22, to: "citadel", tx: 60, ty: 22, req: null, label: "Kingsfall Citadel" }
    ];
    const spawn = { x: 4, y: 22 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [2, 22], [3, 22], [13, 7], [51, 21], [32, 22]]), "S");
    return { id: "sanctum", name: "The Flame Sanctum", act: 5, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "S" };
  }

  const maps = {};
  for (const b of [buildVillage, buildForest, buildRuins, buildCitadel, buildSanctum]) {
    const m = b();
    maps[m.id] = m;
  }
  return maps;
})();
