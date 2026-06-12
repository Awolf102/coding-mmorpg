/* ============================================================
   MAPS — five zones, built programmatically so walkability
   stays consistent. Tile chars are defined in Sprites.TILES.
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
    const g = makeGrid("g");
    border(g, "t", 2);
    // river across the south, with the great bridge (like the old screenshots)
    rect(g, 0, 19, W, 3, "w");
    rect(g, 21, 18, 3, 5, "b");
    // main road
    rect(g, 22, 3, 1, 16, "p");
    rect(g, 6, 10, 36, 1, "p");
    rect(g, 22, 23, 1, 6, "p");
    rect(g, 40, 10, 5, 2, "p"); // road to the east gate
    // houses
    house(g, 5, 3, 6, 4);
    house(g, 13, 4, 6, 4);
    house(g, 27, 3, 7, 4);
    house(g, 36, 4, 6, 4);
    house(g, 7, 12, 6, 4);
    house(g, 32, 13, 7, 4);
    // village square braziers
    g[9][19] = "F"; g[9][26] = "F";
    g[13][20] = "F"; g[13][25] = "F";
    // farm pen, south-east of the river
    rect(g, 33, 24, 9, 5, "f");
    rect(g, 34, 25, 7, 3, "d");
    g[26][33] = "g"; // gap into the pen
    // trees + rocks
    scatter(g, "t", 8, 3, 23, 16, 7, 11, "g");
    scatter(g, "r", 4, 26, 23, 14, 6, 23, "g");
    scatter(g, "t", 5, 3, 13, 12, 5, 31, "g");

    const npcs = [
      { id: "elder_maren", x: 24, y: 8 },
      { id: "tobin", x: 18, y: 12 },
      { id: "sera", x: 29, y: 9 }
    ];
    const enemies = [
      { type: "cinder_rat", x: 10, y: 25, wander: 3 },
      { type: "cinder_rat", x: 15, y: 27, wander: 3 },
      { type: "cinder_rat", x: 28, y: 25, wander: 3 },
      { type: "cinder_rat", x: 31, y: 27, wander: 3 },
      { type: "ash_slime", x: 39, y: 18, wander: 3 },
      { type: "ash_slime", x: 41, y: 17, wander: 3 },
      { type: "ash_slime", x: 36, y: 18, wander: 3 },
      { type: "ember_imp", x: 6, y: 16, wander: 3 },
      { type: "ember_imp", x: 9, y: 18, wander: 3 },
      { type: "ember_imp", x: 4, y: 18, wander: 3 }
    ];
    const portals = [
      { x: 44, y: 10, to: "forest", tx: 3, ty: 10, req: "py04", label: "Emberwood Forest" },
      { x: 44, y: 11, to: "forest", tx: 3, ty: 10, req: "py04", label: "Emberwood Forest" }
    ];
    const spawn = { x: 22, y: 25 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [44, 10], [44, 11], [43, 10], [43, 11], [38, 8]]), "g");
    return { id: "village", name: "Ashveil Village", act: 1, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "g" };
  }

  /* ================= EMBERWOOD FOREST ================= */
  function buildForest() {
    const g = makeGrid("G");
    border(g, "t", 2);
    // dense woods
    scatter(g, "t", 90, 2, 2, W - 4, H - 4, 7, "G");
    // winding path west -> east
    rect(g, 2, 10, 16, 1, "p");
    rect(g, 17, 10, 1, 5, "p");
    rect(g, 17, 14, 14, 1, "p");
    rect(g, 30, 14, 1, 9, "p");
    rect(g, 30, 22, 13, 1, "p");
    rect(g, 36, 8, 1, 7, "p");
    // clearings
    rect(g, 6, 6, 9, 8, "G");
    rect(g, 20, 11, 9, 7, "G");
    rect(g, 26, 19, 10, 8, "G");
    rect(g, 33, 4, 10, 8, "G");
    rect(g, 4, 16, 12, 11, "G");
    // marsh + pond
    rect(g, 8, 21, 6, 4, "m");
    rect(g, 38, 24, 5, 4, "m");
    rect(g, 22, 4, 6, 3, "w");
    // hermit hut
    house(g, 31, 19, 5, 3);
    // braziers marking the warden's clearing
    g[5][35] = "F"; g[5][41] = "F";

    const npcs = [
      { id: "yara", x: 9, y: 9 },
      { id: "wick", x: 24, y: 13 },
      { id: "aldous", x: 32, y: 23 }
    ];
    const enemies = [
      { type: "hollow_wolf", x: 7, y: 18, wander: 3 },
      { type: "hollow_wolf", x: 13, y: 23, wander: 3 },
      { type: "hollow_wolf", x: 5, y: 25, wander: 3 },
      { type: "hollow_wolf", x: 15, y: 19, wander: 3 },
      { type: "blight_sprite", x: 24, y: 12, wander: 3 },
      { type: "blight_sprite", x: 27, y: 16, wander: 3 },
      { type: "blight_sprite", x: 21, y: 15, wander: 3 },
      { type: "blight_sprite", x: 26, y: 12, wander: 3 },
      { type: "restless_husk", x: 28, y: 21, wander: 3 },
      { type: "restless_husk", x: 33, y: 26, wander: 3 },
      { type: "restless_husk", x: 28, y: 25, wander: 3 },
      { type: "restless_husk", x: 35, y: 24, wander: 3 }
    ];
    const portals = [
      { x: 2, y: 10, to: "village", tx: 42, ty: 10, req: null, label: "Ashveil Village" },
      { x: 43, y: 22, to: "ruins", tx: 4, ty: 16, req: "py08", label: "The Sunken Ruins" }
    ];
    const spawn = { x: 4, y: 10 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [2, 10], [3, 10], [43, 22], [42, 22], [38, 7]]), "G");
    return { id: "forest", name: "Emberwood Forest", act: 2, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "G" };
  }

  /* ================= SUNKEN RUINS ================= */
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
    rect(g, 12, 21, 2, 2, "b");
    rect(g, 32, 9, 2, 2, "b");
    rect(g, 36, 18, 2, 2, "b");
    rect(g, 16, 12, 2, 2, "b");
    // broken halls
    rect(g, 18, 4, 1, 6, "W"); rect(g, 24, 4, 1, 6, "W");
    rect(g, 18, 4, 7, 1, "W"); g[4][21] = "S";
    rect(g, 4, 22, 6, 1, "W"); rect(g, 4, 26, 6, 1, "W");
    rect(g, 36, 24, 8, 1, "W");
    // pillars and sand
    scatter(g, "P", 14, 3, 3, W - 6, H - 6, 13, "S");
    scatter(g, "s", 16, 3, 3, W - 6, H - 6, 29, "S");
    scatter(g, "W", 10, 3, 3, W - 6, H - 6, 41, "S");
    // throne of the Drowned King
    rect(g, 36, 6, 7, 5, "c");
    g[6][37] = "F"; g[6][41] = "F";

    const npcs = [
      { id: "nyra", x: 11, y: 8 },
      { id: "lumen", x: 28, y: 22 },
      { id: "korr", x: 19, y: 26 }
    ];
    const enemies = [
      { type: "drowned_acolyte", x: 7, y: 19, wander: 3 },
      { type: "drowned_acolyte", x: 5, y: 16, wander: 3 },
      { type: "drowned_acolyte", x: 9, y: 24, wander: 3 },
      { type: "drowned_acolyte", x: 16, y: 18, wander: 3 },
      { type: "bone_crawler", x: 22, y: 8, wander: 3 },
      { type: "bone_crawler", x: 27, y: 6, wander: 3 },
      { type: "bone_crawler", x: 29, y: 12, wander: 3 },
      { type: "bone_crawler", x: 25, y: 14, wander: 3 },
      { type: "grave_wisp", x: 34, y: 22, wander: 3 },
      { type: "grave_wisp", x: 39, y: 21, wander: 3 },
      { type: "grave_wisp", x: 36, y: 26, wander: 3 },
      { type: "grave_wisp", x: 41, y: 27, wander: 3 },
      { type: "cursed_scarab", x: 16, y: 5, wander: 3 },
      { type: "cursed_scarab", x: 14, y: 8, wander: 3 },
      { type: "cursed_scarab", x: 27, y: 26, wander: 3 },
      { type: "cursed_scarab", x: 23, y: 22, wander: 3 }
    ];
    const portals = [
      { x: 2, y: 16, to: "forest", tx: 41, ty: 22, req: null, label: "Emberwood Forest" },
      { x: 43, y: 14, to: "citadel", tx: 4, ty: 16, req: "py13", label: "Kingsfall Citadel" }
    ];
    const spawn = { x: 4, y: 16 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [2, 16], [3, 16], [43, 14], [42, 14], [39, 9]]), "S");
    return { id: "ruins", name: "The Sunken Ruins", act: 3, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "S" };
  }

  /* ================= KINGSFALL CITADEL ================= */
  function buildCitadel() {
    const g = makeGrid("c");
    border(g, "h", 2);
    // inner keep walls
    rect(g, 10, 6, 26, 1, "h");
    rect(g, 10, 6, 1, 8, "h");
    rect(g, 35, 6, 1, 8, "h");
    g[6][22] = "c"; g[6][23] = "c"; // north gate
    g[13][10] = "h"; g[10][10] = "c"; // west gap
    g[10][35] = "c"; // east gap
    // great hall (boss court)
    rect(g, 28, 20, 14, 9, "S");
    rect(g, 28, 20, 14, 1, "W");
    rect(g, 28, 28, 14, 1, "W");
    rect(g, 28, 20, 1, 9, "W");
    g[24][28] = "S"; g[24][27] = "c";
    // braziers along the main aisle
    g[9][14] = "F"; g[9][31] = "F";
    g[17][8] = "F"; g[17][37] = "F";
    g[24][32] = "F"; g[24][38] = "F";
    // rubble
    scatter(g, "W", 12, 3, 3, W - 6, H - 6, 17, "c");
    scatter(g, "r", 8, 3, 3, W - 6, H - 6, 23, "c");
    scatter(g, "S", 20, 3, 3, W - 6, H - 6, 37, "c");

    const npcs = [
      { id: "edric", x: 14, y: 10 },
      { id: "wynn", x: 28, y: 9 },
      { id: "vulka", x: 16, y: 22 }
    ];
    const enemies = [
      { type: "spectral_knight", x: 7, y: 18, wander: 3 },
      { type: "spectral_knight", x: 10, y: 24, wander: 3 },
      { type: "spectral_knight", x: 5, y: 27, wander: 3 },
      { type: "spectral_knight", x: 13, y: 17, wander: 3 },
      { type: "flame_revenant", x: 20, y: 10, wander: 3 },
      { type: "flame_revenant", x: 24, y: 12, wander: 3 },
      { type: "flame_revenant", x: 31, y: 10, wander: 3 },
      { type: "flame_revenant", x: 26, y: 8, wander: 3 },
      { type: "molten_gargoyle", x: 38, y: 10, wander: 3 },
      { type: "molten_gargoyle", x: 41, y: 14, wander: 3 },
      { type: "molten_gargoyle", x: 39, y: 18, wander: 3 },
      { type: "molten_gargoyle", x: 42, y: 8, wander: 3 },
      { type: "animated_armor", x: 20, y: 25, wander: 3 },
      { type: "animated_armor", x: 23, y: 27, wander: 3 },
      { type: "animated_armor", x: 18, y: 28, wander: 3 },
      { type: "animated_armor", x: 25, y: 24, wander: 3 }
    ];
    const portals = [
      { x: 2, y: 16, to: "ruins", tx: 41, ty: 14, req: null, label: "The Sunken Ruins" },
      { x: 43, y: 16, to: "sanctum", tx: 4, ty: 16, req: "py18", label: "The Flame Sanctum" }
    ];
    const spawn = { x: 4, y: 16 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [2, 16], [3, 16], [43, 16], [42, 16], [35, 24]]), "c");
    return { id: "citadel", name: "Kingsfall Citadel", act: 4, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "c" };
  }

  /* ================= THE FLAME SANCTUM ================= */
  function buildSanctum() {
    const g = makeGrid("x");
    // grand platform
    rect(g, 3, 3, 40, 26, "S");
    // lava moats
    rect(g, 3, 3, 40, 1, "l");
    rect(g, 3, 28, 40, 1, "l");
    rect(g, 18, 8, 2, 16, "l");
    rect(g, 18, 14, 2, 3, "S"); // crossing
    rect(g, 28, 4, 12, 8, "l");
    rect(g, 30, 6, 8, 4, "S");  // island in the lava (twin flames)
    rect(g, 28, 8, 2, 1, "S");  // bridge to island
    // the dais of the Eternal Flame
    rect(g, 33, 14, 9, 9, "c");
    g[14][34] = "F"; g[14][41] = "F";
    g[22][34] = "F"; g[22][41] = "F";
    // pillars
    scatter(g, "P", 12, 4, 4, 38, 24, 19, "S");
    g[16][3] = "S"; g[16][4] = "S";

    const npcs = [
      { id: "herald", x: 9, y: 16 },
      { id: "ilio", x: 12, y: 8 },
      { id: "keeper", x: 10, y: 24 },
      { id: "flame", x: 37, y: 18 }
    ];
    const enemies = [
      { type: "flame_serpent", x: 7, y: 6, wander: 3 },
      { type: "flame_serpent", x: 14, y: 5, wander: 3 },
      { type: "flame_serpent", x: 6, y: 12, wander: 3 },
      { type: "flame_serpent", x: 15, y: 11, wander: 3 },
      { type: "pyre_sentinel", x: 7, y: 20, wander: 3 },
      { type: "pyre_sentinel", x: 13, y: 21, wander: 3 },
      { type: "pyre_sentinel", x: 6, y: 26, wander: 3 },
      { type: "pyre_sentinel", x: 14, y: 26, wander: 3 },
      { type: "echo_first", x: 24, y: 8, wander: 3 },
      { type: "echo_first", x: 23, y: 25, wander: 3 },
      { type: "echo_first", x: 26, y: 18, wander: 3 },
      { type: "echo_first", x: 24, y: 13, wander: 3 }
    ];
    const portals = [
      { x: 3, y: 16, to: "citadel", tx: 41, ty: 16, req: null, label: "Kingsfall Citadel" }
    ];
    const spawn = { x: 5, y: 16 };
    clearWalk(g, npcs.map(n => [n.x, n.y]).concat(enemies.map(e => [e.x, e.y]), [[spawn.x, spawn.y], [3, 16], [4, 16], [33, 8], [37, 19], [25, 16]]), "S");
    return { id: "sanctum", name: "The Flame Sanctum", act: 5, tiles: toStrings(g), spawn, npcs, enemies, portals, walk: "S" };
  }

  const maps = {};
  for (const b of [buildVillage, buildForest, buildRuins, buildCitadel, buildSanctum]) {
    const m = b();
    maps[m.id] = m;
  }
  return maps;
})();
