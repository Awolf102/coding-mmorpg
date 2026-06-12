/* ============================================================
   Renderer — canvas world drawing: tiles (prerendered),
   animated tiles, entities, markers, minimap, camera.
   ============================================================ */
window.Renderer = (function () {
  const T = Sprites.TILE;
  let canvas, ctx, mini, miniCtx;
  let map = null;
  let staticLayer = null;     // offscreen canvas of all tiles
  let animTiles = [];         // [{ch, x, y}]
  let miniBase = null;
  let cam = { x: 0, y: 0 };

  function init() {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    mini = document.getElementById("minimap");
    miniCtx = mini.getContext("2d");
    window.addEventListener("resize", fit);
    fit();
  }

  function fit() {
    // scale the canvas to fit available space while keeping aspect
    const wrap = document.getElementById("viewport");
    if (!wrap) return;
    const availH = window.innerHeight - 16;
    const availW = window.innerWidth - 252 - 32;
    const scale = Math.min(availW / canvas.width, availH / canvas.height, 1.6);
    canvas.style.width = Math.floor(canvas.width * scale) + "px";
    canvas.style.height = Math.floor(canvas.height * scale) + "px";
  }

  function setMap(m) {
    map = m;
    const w = m.tiles[0].length, h = m.tiles.length;
    staticLayer = document.createElement("canvas");
    staticLayer.width = w * T; staticLayer.height = h * T;
    const sctx = staticLayer.getContext("2d");
    sctx.imageSmoothingEnabled = false;
    animTiles = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const ch = m.tiles[y][x];
        Sprites.drawTile(sctx, ch, x * T, y * T, x, y, 0);
        if (ch === "w" || ch === "l" || ch === "F" || ch === "m") animTiles.push({ ch, x, y });
      }
    }
    // minimap base
    miniBase = document.createElement("canvas");
    miniBase.width = w; miniBase.height = h;
    const mctx = miniBase.getContext("2d");
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        mctx.fillStyle = (Sprites.TILES[m.tiles[y][x]] || { mini: "#000" }).mini;
        mctx.fillRect(x, y, 1, 1);
      }
    document.getElementById("map-name").textContent = m.name;
  }

  function solidAt(x, y) {
    if (!map) return true;
    if (x < 0 || y < 0 || y >= map.tiles.length || x >= map.tiles[0].length) return true;
    const t = Sprites.TILES[map.tiles[y][x]];
    return !t || t.solid;
  }

  function updateCamera() {
    const p = Game.player;
    cam.x = Math.round(p.px - canvas.width / 2);
    cam.y = Math.round(p.py - canvas.height / 2);
    cam.x = Math.max(0, Math.min(cam.x, staticLayer.width - canvas.width));
    cam.y = Math.max(0, Math.min(cam.y, staticLayer.height - canvas.height));
  }

  function drawNameplate(x, y, text, color, sub) {
    ctx.font = "bold 11px Verdana";
    ctx.textAlign = "center";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    if (sub) {
      ctx.font = "9px Verdana";
      ctx.strokeText(sub, x, y + 11);
      ctx.fillStyle = "#c8e6ff";
      ctx.fillText(sub, x, y + 11);
    }
  }

  function drawHpBar(x, y, frac) {
    ctx.fillStyle = "#1a0d0a";
    ctx.fillRect(x - 16, y, 32, 5);
    ctx.fillStyle = frac > 0.4 ? "#3fbf3f" : "#c0392b";
    ctx.fillRect(x - 15, y + 1, 30 * Math.max(0, frac), 3);
  }

  function frame(t) {
    if (!map || !Game.player) return;
    updateCamera();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(staticLayer, -cam.x, -cam.y);

    // animated tiles (only those near the viewport)
    for (const a of animTiles) {
      const px = a.x * T - cam.x, py = a.y * T - cam.y;
      if (px < -T || py < -T || px > canvas.width || py > canvas.height) continue;
      Sprites.drawTile(ctx, a.ch, px, py, a.x, a.y, t);
    }

    // portals glow
    for (const p of map.portals) {
      const px = p.x * T - cam.x + T / 2, py = p.y * T - cam.y + T / 2;
      if (px < -T || py < -T || px > canvas.width + T || py > canvas.height + T) continue;
      const open = !p.req || Quests.isDone(p.req);
      const r = 10 + Math.sin(t / 300) * 3;
      const g = ctx.createRadialGradient(px, py, 2, px, py, r + 8);
      g.addColorStop(0, open ? "rgba(120,220,255,0.85)" : "rgba(255,80,40,0.6)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(px - r - 8, py - r - 8, (r + 8) * 2, (r + 8) * 2);
      ctx.font = "9px Verdana"; ctx.textAlign = "center";
      ctx.fillStyle = open ? "#bfe8ff" : "#ff9a80";
      ctx.fillText(open ? "⬨ " + p.label : "🔒 " + p.label, px, py - 14);
    }

    // click target marker
    const tgt = Game.clickMarker;
    if (tgt && tgt.until > t) {
      const px = tgt.x * T - cam.x + T / 2, py = tgt.y * T - cam.y + T / 2;
      ctx.strokeStyle = "#ffff66";
      ctx.lineWidth = 2;
      const s = 5 + Math.sin(t / 120) * 1.5;
      ctx.beginPath();
      ctx.moveTo(px - s, py - s); ctx.lineTo(px + s, py + s);
      ctx.moveTo(px + s, py - s); ctx.lineTo(px - s, py + s);
      ctx.stroke();
    }

    // build draw list sorted by y
    const drawList = [];
    for (const n of Game.entities.npcs) drawList.push({ y: n.y * T, kind: "npc", e: n });
    for (const en of Game.entities.enemies) if (en.alive) drawList.push({ y: en.py, kind: "enemy", e: en });
    for (const w of Game.entities.walkers) drawList.push({ y: w.py, kind: "walker", e: w });
    drawList.push({ y: Game.player.py, kind: "player", e: Game.player });
    drawList.sort((a, b) => a.y - b.y);

    for (const d of drawList) {
      if (d.kind === "npc") {
        const n = d.e;
        const px = n.x * T - cam.x + T / 2, py = n.y * T - cam.y + T / 2;
        if (px < -T * 2 || px > canvas.width + T * 2 || py < -T * 2 || py > canvas.height + T * 2) continue;
        const bob = Math.sin(t / 600 + n.x) * 1.2;
        Sprites.drawHumanoid(ctx, px, py + bob, n.def.look, "down", 0, 1);
        drawNameplate(px, py - 26 + bob, n.def.name, "#ffff66");
        const marker = Quests.npcMarker(n.def.id);
        if (marker === "!" || marker === "?") {
          ctx.font = "bold 18px Georgia";
          const my = py - 38 + Math.sin(t / 250) * 3;
          ctx.strokeStyle = "rgba(0,0,0,0.9)"; ctx.lineWidth = 4;
          ctx.strokeText(marker, px, my);
          ctx.fillStyle = marker === "!" ? "#ffd23f" : "#7be0ff";
          ctx.fillText(marker, px, my);
        } else if (n.def.shop) {
          ctx.font = "12px Verdana";
          ctx.fillText("💰", px, py - 36);
        }
      } else if (d.kind === "enemy") {
        const en = d.e;
        const px = en.px - cam.x + T / 2, py = en.py - cam.y + T / 2;
        if (px < -T * 3 || px > canvas.width + T * 3 || py < -T * 3 || py > canvas.height + T * 3) continue;
        Sprites.drawEnemy(ctx, px, py, en.def, t);
        const nameColor = en.def.boss ? "#ff8a5c" : "#ffb3a0";
        drawNameplate(px, py - (en.def.boss ? 44 : 26), `${en.def.name} (${en.def.level})`, nameColor);
      } else if (d.kind === "walker") {
        const w = d.e;
        const px = w.px - cam.x + T / 2, py = w.py - cam.y + T / 2;
        if (px < -T * 2 || px > canvas.width + T * 2 || py < -T * 2 || py > canvas.height + T * 2) continue;
        Sprites.drawHumanoid(ctx, px, py, w.look, w.facing, w.moving ? (Math.floor(t / 140) % 2) + 1 : 0, 1);
        drawNameplate(px, py - 26, w.name, "#c8e6ff");
      } else {
        const p = d.e;
        const px = p.px - cam.x + T / 2, py = p.py - cam.y + T / 2;
        const wf = p.moving ? (Math.floor(t / 130) % 2) + 1 : 0;
        const look = Object.assign({}, Game.state.appearance, { weaponTint: Game.weaponTint() });
        Sprites.drawHumanoid(ctx, px, py, look, p.facing, wf, 1);
        drawNameplate(px, py - 26, Game.state.name, "#ffffff",
          Game.state.titleEarned ? "«" + Game.state.titleEarned + "»" : null);
      }
    }

    // subtle ambient vignette per act
    const tint = map.act >= 5 ? "rgba(120,30,0,0.10)" : map.act >= 3 ? "rgba(0,20,40,0.08)" : null;
    if (tint) { ctx.fillStyle = tint; ctx.fillRect(0, 0, canvas.width, canvas.height); }

    drawMinimap();
  }

  function drawMinimap() {
    if (!miniBase) return;
    miniCtx.imageSmoothingEnabled = false;
    miniCtx.clearRect(0, 0, mini.width, mini.height);
    miniCtx.drawImage(miniBase, 0, 0, mini.width, mini.height);
    const sx = mini.width / miniBase.width, sy = mini.height / miniBase.height;
    // npcs
    for (const n of Game.entities.npcs) {
      const m = Quests.npcMarker(n.def.id);
      miniCtx.fillStyle = m === "!" ? "#ffd23f" : m === "?" ? "#7be0ff" : "#e8e8e8";
      miniCtx.fillRect(n.x * sx - 1.5, n.y * sy - 1.5, 3.5, 3.5);
    }
    for (const en of Game.entities.enemies) {
      if (!en.alive) continue;
      miniCtx.fillStyle = en.def.boss ? "#ff4242" : "#ff9a80";
      miniCtx.fillRect(en.x * sx - 1, en.y * sy - 1, en.def.boss ? 4 : 2.4, en.def.boss ? 4 : 2.4);
    }
    for (const p of map.portals) {
      miniCtx.fillStyle = "#bfe8ff";
      miniCtx.fillRect(p.x * sx - 1.5, p.y * sy - 1.5, 3.5, 3.5);
    }
    const pl = Game.player;
    miniCtx.fillStyle = "#ffffff";
    miniCtx.beginPath();
    miniCtx.arc(pl.px / T * sx + sx / 2, pl.py / T * sy + sy / 2, 2.6, 0, 7);
    miniCtx.fill();
  }

  /* convert a mouse event on the canvas to tile coords */
  function eventToTile(e) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (canvas.width / r.width) + cam.x;
    const y = (e.clientY - r.top) * (canvas.height / r.height) + cam.y;
    return { x: Math.floor(x / T), y: Math.floor(y / T), px: x, py: y };
  }

  /* find an interactive entity near a click (pixel radius) */
  function entityAtEvent(e) {
    const { px, py } = eventToTile(e);
    let best = null, bestD = 28; // ~ tile radius
    for (const n of Game.entities.npcs) {
      const d = Math.hypot(n.x * T + T / 2 - px, n.y * T + T / 2 - py);
      if (d < bestD) { best = { kind: "npc", ent: n }; bestD = d; }
    }
    for (const en of Game.entities.enemies) {
      if (!en.alive) continue;
      const r = en.def.boss ? 44 : 28;
      const d = Math.hypot(en.px + T / 2 - px, en.py + T / 2 - py);
      if (d < Math.max(r, bestD)) { best = { kind: "enemy", ent: en }; bestD = d; }
    }
    return best;
  }

  return { init, setMap, frame, solidAt, eventToTile, entityAtEvent, get cam() { return cam; } };
})();
