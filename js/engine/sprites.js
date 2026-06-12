/* ============================================================
   Sprites — all procedural pixel art: tiles, characters,
   enemies, NPCs, item icons. No external assets.
   ============================================================ */
window.Sprites = (function () {
  const TILE = 32;

  // ---------- tile legend ----------
  // solid: blocks movement. mini: minimap color.
  const TILES = {
    "g": { solid: false, mini: "#4a7a32" },  // grass
    "G": { solid: false, mini: "#39632a" },  // dark grass
    "t": { solid: true,  mini: "#1f4416" },  // tree
    "w": { solid: true,  mini: "#3a6ea5" },  // water
    "b": { solid: false, mini: "#8a6a3a" },  // bridge
    "p": { solid: false, mini: "#9c8a5a" },  // path
    "d": { solid: false, mini: "#7a6644" },  // dirt
    "s": { solid: false, mini: "#cbb778" },  // sand
    "r": { solid: true,  mini: "#73716b" },  // boulder
    "f": { solid: true,  mini: "#6a4d2a" },  // fence
    "h": { solid: true,  mini: "#6e6e72" },  // house wall
    "R": { solid: true,  mini: "#7a3b2a" },  // roof
    "D": { solid: true,  mini: "#5a3a1a" },  // door (decorative)
    "S": { solid: false, mini: "#8a8576" },  // stone floor
    "c": { solid: false, mini: "#74705f" },  // cobble
    "W": { solid: true,  mini: "#4f5550" },  // ruined wall
    "P": { solid: true,  mini: "#9a9588" },  // pillar
    "m": { solid: false, mini: "#5d6336" },  // marsh
    "l": { solid: true,  mini: "#d4541b" },  // lava
    "x": { solid: true,  mini: "#0c0a0a" },  // void
    "F": { solid: true,  mini: "#ff8a2a" }   // brazier flame
  };

  function hash(x, y) {
    let h = (x * 374761393 + y * 668265263) ^ 1274126177;
    h = (h ^ (h >> 13)) * 1103515245;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  }

  // ---------- tiles ----------
  function drawTile(ctx, ch, px, py, tx, ty, t) {
    const u = TILE / 16;
    switch (ch) {
      case "g": case "G": {
        ctx.fillStyle = ch === "g" ? "#4a7a32" : "#39632a";
        ctx.fillRect(px, py, TILE, TILE);
        for (let i = 0; i < 5; i++) {
          const hx = hash(tx * 7 + i, ty * 13 + i);
          const hy = hash(tx * 3 + i * 5, ty * 11 + i);
          ctx.fillStyle = hash(tx + i, ty - i) > 0.5 ? "rgba(255,255,200,0.10)" : "rgba(0,0,0,0.12)";
          ctx.fillRect(px + ((hx * 14) | 0) * u, py + ((hy * 14) | 0) * u, u, u * 2);
        }
        break;
      }
      case "t": {
        drawTile(ctx, hash(tx, ty) > 0.5 ? "g" : "G", px, py, tx, ty, t);
        ctx.fillStyle = "#4a2f15";
        ctx.fillRect(px + 13 * u, py + 10 * u, 3 * u, 5 * u);
        const sway = Math.sin(t / 900 + tx * 1.7 + ty) * u * 0.5;
        ctx.fillStyle = "#1d4a14";
        ctx.beginPath(); ctx.arc(px + 8 * u + sway, py + 7 * u, 7.4 * u, 0, 7); ctx.fill();
        ctx.fillStyle = "#2c6420";
        ctx.beginPath(); ctx.arc(px + 6.6 * u + sway, py + 5.6 * u, 5 * u, 0, 7); ctx.fill();
        ctx.fillStyle = "#3f8230";
        ctx.beginPath(); ctx.arc(px + 5.6 * u + sway, py + 4.6 * u, 2.6 * u, 0, 7); ctx.fill();
        break;
      }
      case "w": {
        ctx.fillStyle = "#2d5d92";
        ctx.fillRect(px, py, TILE, TILE);
        ctx.fillStyle = "#3a6ea5";
        const ph = Math.sin(t / 600 + tx * 1.3 + ty * 2.1);
        ctx.fillRect(px, py + (4 + ph * 2) * u, TILE, 3 * u);
        ctx.fillRect(px, py + (11 - ph * 2) * u, TILE, 2 * u);
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        if (hash(tx, ty) > 0.6) ctx.fillRect(px + 3 * u, py + (7 + ph * 3) * u, 5 * u, u);
        break;
      }
      case "b": {
        drawTile(ctx, "w", px, py, tx, ty, t);
        ctx.fillStyle = "#8a6a3a";
        ctx.fillRect(px, py + u, TILE, 14 * u);
        ctx.fillStyle = "#6e5128";
        for (let i = 0; i < 4; i++) ctx.fillRect(px, py + (2 + i * 4) * u, TILE, u);
        ctx.fillStyle = "#5a3f1d";
        ctx.fillRect(px, py, TILE, u); ctx.fillRect(px, py + 15 * u, TILE, u);
        break;
      }
      case "p": case "d": case "s": {
        ctx.fillStyle = ch === "p" ? "#9c8a5a" : ch === "d" ? "#7a6644" : "#cbb778";
        ctx.fillRect(px, py, TILE, TILE);
        for (let i = 0; i < 4; i++) {
          const hx = hash(tx * 5 + i, ty * 9 + i * 3), hy = hash(tx * 9 + i * 2, ty * 5 + i);
          ctx.fillStyle = "rgba(0,0,0,0.10)";
          ctx.fillRect(px + ((hx * 14) | 0) * u, py + ((hy * 14) | 0) * u, 2 * u, u);
        }
        break;
      }
      case "r": {
        drawTile(ctx, "g", px, py, tx, ty, t);
        ctx.fillStyle = "#55534e";
        ctx.beginPath(); ctx.arc(px + 8 * u, py + 9 * u, 6.5 * u, 0, 7); ctx.fill();
        ctx.fillStyle = "#73716b";
        ctx.beginPath(); ctx.arc(px + 7 * u, py + 8 * u, 5 * u, 0, 7); ctx.fill();
        ctx.fillStyle = "#8d8b84";
        ctx.fillRect(px + 5 * u, py + 5 * u, 3 * u, 2 * u);
        break;
      }
      case "f": {
        drawTile(ctx, "g", px, py, tx, ty, t);
        ctx.fillStyle = "#6a4d2a";
        ctx.fillRect(px + 2 * u, py + 5 * u, 2 * u, 9 * u);
        ctx.fillRect(px + 12 * u, py + 5 * u, 2 * u, 9 * u);
        ctx.fillStyle = "#7d5c34";
        ctx.fillRect(px, py + 6 * u, TILE, 2 * u);
        ctx.fillRect(px, py + 10 * u, TILE, 2 * u);
        break;
      }
      case "h": {
        ctx.fillStyle = "#5e5e62";
        ctx.fillRect(px, py, TILE, TILE);
        ctx.fillStyle = "#6e6e72";
        for (let r2 = 0; r2 < 4; r2++)
          for (let c2 = 0; c2 < 2; c2++)
            ctx.fillRect(px + (c2 * 8 + (r2 % 2) * 4) * u + u, py + r2 * 4 * u + u, 6 * u, 2.6 * u);
        break;
      }
      case "R": {
        ctx.fillStyle = "#6e3526";
        ctx.fillRect(px, py, TILE, TILE);
        ctx.fillStyle = "#7f4130";
        for (let r2 = 0; r2 < 4; r2++)
          ctx.fillRect(px, py + r2 * 4 * u, TILE, 2.4 * u);
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        for (let c2 = 0; c2 < 4; c2++)
          ctx.fillRect(px + (c2 * 4 + (Math.floor(ty) % 2) * 2) * u, py, u, TILE);
        break;
      }
      case "D": {
        drawTile(ctx, "h", px, py, tx, ty, t);
        ctx.fillStyle = "#5a3a1a";
        ctx.fillRect(px + 3 * u, py + 3 * u, 10 * u, 13 * u);
        ctx.fillStyle = "#714c24";
        ctx.fillRect(px + 4 * u, py + 4 * u, 8 * u, 12 * u);
        ctx.fillStyle = "#3a2510";
        ctx.fillRect(px + 7.5 * u, py + 4 * u, u, 12 * u);
        ctx.fillStyle = "#d8b75a";
        ctx.fillRect(px + 10 * u, py + 9 * u, 1.4 * u, 1.4 * u);
        break;
      }
      case "S": {
        ctx.fillStyle = "#83806f";
        ctx.fillRect(px, py, TILE, TILE);
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 0.5, py + 0.5, TILE / 2, TILE / 2);
        ctx.strokeRect(px + TILE / 2 + 0.5, py + TILE / 2 + 0.5, TILE / 2 - 1, TILE / 2 - 1);
        if (hash(tx, ty) > 0.8) { ctx.fillStyle = "rgba(70,90,50,0.25)"; ctx.fillRect(px + 4 * u, py + 9 * u, 6 * u, 4 * u); }
        break;
      }
      case "c": {
        ctx.fillStyle = "#6b675a";
        ctx.fillRect(px, py, TILE, TILE);
        for (let i = 0; i < 6; i++) {
          const hx = hash(tx * 4 + i, ty * 6 + i), hy = hash(tx * 6 + i, ty * 4 + i);
          ctx.fillStyle = i % 2 ? "#787463" : "#5d594e";
          ctx.beginPath(); ctx.arc(px + (3 + hx * 10) * u, py + (3 + hy * 10) * u, 2.4 * u, 0, 7); ctx.fill();
        }
        break;
      }
      case "W": {
        ctx.fillStyle = "#41463f";
        ctx.fillRect(px, py, TILE, TILE);
        ctx.fillStyle = "#535a51";
        for (let r2 = 0; r2 < 4; r2++)
          for (let c2 = 0; c2 < 2; c2++)
            if (hash(tx * 4 + r2, ty * 4 + c2) > 0.22)
              ctx.fillRect(px + (c2 * 8 + (r2 % 2) * 4) * u + u, py + r2 * 4 * u + u, 6 * u, 2.6 * u);
        ctx.fillStyle = "rgba(60,110,60,0.30)";
        if (hash(tx, ty) > 0.5) ctx.fillRect(px, py + 12 * u, TILE, 4 * u);
        break;
      }
      case "P": {
        drawTile(ctx, "S", px, py, tx, ty, t);
        ctx.fillStyle = "#9a9588";
        ctx.fillRect(px + 4 * u, py + u, 8 * u, 14 * u);
        ctx.fillStyle = "#b5b0a2";
        ctx.fillRect(px + 4 * u, py + u, 2.4 * u, 14 * u);
        ctx.fillStyle = "#7c7869";
        ctx.fillRect(px + 3 * u, py, 10 * u, 2 * u);
        ctx.fillRect(px + 3 * u, py + 14 * u, 10 * u, 2 * u);
        break;
      }
      case "m": {
        ctx.fillStyle = "#566036";
        ctx.fillRect(px, py, TILE, TILE);
        ctx.fillStyle = "#48542e";
        const ph = Math.sin(t / 800 + tx + ty);
        ctx.fillRect(px, py + (5 + ph) * u, TILE, 2 * u);
        ctx.fillStyle = "#6a7440";
        if (hash(tx, ty) > 0.5) ctx.fillRect(px + 4 * u, py + 10 * u, 3 * u, u);
        break;
      }
      case "l": {
        ctx.fillStyle = "#a32e08";
        ctx.fillRect(px, py, TILE, TILE);
        const ph = Math.sin(t / 350 + tx * 2.1 + ty * 1.4);
        ctx.fillStyle = "#e0561a";
        ctx.fillRect(px, py + (4 + ph * 2.4) * u, TILE, 4 * u);
        ctx.fillStyle = "#ffb53a";
        ctx.fillRect(px + (4 + ph * 3) * u, py + (9 - ph * 2) * u, 4 * u, 2 * u);
        break;
      }
      case "x": {
        ctx.fillStyle = "#0c0a0a";
        ctx.fillRect(px, py, TILE, TILE);
        if (hash(tx, ty) > 0.93) {
          ctx.fillStyle = "rgba(200,120,60,0.18)";
          ctx.fillRect(px + 7 * u, py + 7 * u, u, u);
        }
        break;
      }
      case "F": {
        drawTile(ctx, "S", px, py, tx, ty, t);
        ctx.fillStyle = "#4d4a42";
        ctx.fillRect(px + 4 * u, py + 9 * u, 8 * u, 5 * u);
        ctx.fillStyle = "#33312b";
        ctx.fillRect(px + 5 * u, py + 10 * u, 6 * u, 3 * u);
        const fh = 4 + Math.sin(t / 130 + tx * 3 + ty) * 1.6;
        ctx.fillStyle = "#e0561a";
        ctx.beginPath(); ctx.arc(px + 8 * u, py + (9 - fh / 2) * u, fh * 0.62 * u, 0, 7); ctx.fill();
        ctx.fillStyle = "#ffb53a";
        ctx.beginPath(); ctx.arc(px + 8 * u, py + (9 - fh / 2.4) * u, fh * 0.34 * u, 0, 7); ctx.fill();
        break;
      }
      default: {
        ctx.fillStyle = "#222";
        ctx.fillRect(px, py, TILE, TILE);
      }
    }
  }

  // ---------- humanoid ----------
  // opts: {skin, hair, hairStyle(0..3), shirt, pants, robe, hat, hatColor, weaponTint}
  function drawHumanoid(ctx, cx, cy, o, facing, walkFrame, scale) {
    const s = (scale || 1) * (TILE / 16);
    const X = (dx) => cx + dx * s;
    const Y = (dy) => cy + dy * s;
    const R = (dx, dy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(X(dx), Y(dy), w * s, h * s); };

    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.30)";
    ctx.beginPath(); ctx.ellipse(cx, cy + 7.6 * s, 5 * s, 1.8 * s, 0, 0, 7); ctx.fill();

    const legOff = walkFrame === 1 ? 1 : walkFrame === 2 ? -1 : 0;
    const side = facing === "left" ? -1 : facing === "right" ? 1 : 0;

    if (o.robe) {
      R(-3.5, -1, 7, 8, o.robe);
      R(-3.5, 5.5, 7, 1.6, shade(o.robe, -25));
      R(-1 + legOff, 6.6, 2, 1.2, "#2a2118");
    } else {
      // legs
      R(-2.6, 3.4 + (legOff > 0 ? 0.7 : 0), 2.2, 3.6 - (legOff > 0 ? 0.7 : 0), o.pants);
      R(0.6, 3.4 + (legOff < 0 ? 0.7 : 0), 2.2, 3.6 - (legOff < 0 ? 0.7 : 0), o.pants);
      R(-2.6, 6.6, 2.2, 1, "#2a2118");
      R(0.6, 6.6, 2.2, 1, "#2a2118");
      // torso
      R(-3, -1, 6, 4.8, o.shirt);
      R(-3, 2.6, 6, 1.2, shade(o.shirt, -30));
      // arms
      R(-4.2 + (side < 0 ? -0.4 : 0), -0.6, 1.4, 4, shade(o.shirt, -15));
      R(2.8 + (side > 0 ? 0.4 : 0), -0.6, 1.4, 4, shade(o.shirt, -15));
      R(-4.2, 3, 1.4, 1, o.skin);
      R(2.8, 3, 1.4, 1, o.skin);
    }

    // head
    R(-2.6, -6.4, 5.2, 5.2, o.skin);
    // hair
    const hc = o.hair;
    if (o.hairStyle !== 3) {
      if (facing === "up") {
        R(-2.6, -6.8, 5.2, 4.4, hc);
      } else {
        R(-2.6, -6.8, 5.2, 1.8, hc);
        R(-2.9, -6.2, 1, 2.6, hc);
        R(1.9, -6.2, 1, 2.6, hc);
        if (o.hairStyle === 1) { R(-2.9, -6.2, 1, 5, hc); R(1.9, -6.2, 1, 5, hc); }
        if (o.hairStyle === 2) { R(-2.6, -7.4, 2, 1, hc); R(0.4, -7.6, 1.6, 1.2, hc); }
      }
    }
    // face
    if (facing !== "up") {
      ctx.fillStyle = "#1c130c";
      if (facing === "down") {
        ctx.fillRect(X(-1.5), Y(-4.4), s, s);
        ctx.fillRect(X(0.6), Y(-4.4), s, s);
      } else {
        ctx.fillRect(X(side * 1.1 - 0.4), Y(-4.4), s, s);
      }
    }
    // hat
    if (o.hat === "wizard") {
      R(-3.2, -7.2, 6.4, 1.4, o.hatColor || "#3a3270");
      R(-1.8, -10.4, 3.6, 3.4, o.hatColor || "#3a3270");
      R(-0.6, -11.6, 1.6, 1.4, o.hatColor || "#3a3270");
    } else if (o.hat === "hood") {
      R(-3, -7.2, 5.8, 2.6, o.hatColor || "#4a4038");
      R(-3, -5.4, 1.2, 3.4, o.hatColor || "#4a4038");
      R(1.8, -5.4, 1.2, 3.4, o.hatColor || "#4a4038");
    } else if (o.hat === "crown") {
      R(-2.4, -7.8, 4.8, 1.4, "#ffd23f");
      R(-2.4, -8.8, 1, 1, "#ffd23f"); R(-0.5, -8.8, 1, 1, "#ffd23f"); R(1.4, -8.8, 1, 1, "#ffd23f");
    } else if (o.hat === "helm") {
      R(-2.8, -7, 5.6, 3, "#9aa0aa");
      R(-2.8, -4.6, 1, 2.4, "#9aa0aa"); R(1.8, -4.6, 1, 2.4, "#9aa0aa");
      R(-0.4, -8.2, 0.9, 1.6, "#c43e0c");
    }
    // held weapon (small sword at side)
    if (o.weaponTint) {
      ctx.fillStyle = o.weaponTint;
      ctx.fillRect(X(3.6), Y(-3.4), 1 * s, 5 * s);
      ctx.fillStyle = "#6e5128";
      ctx.fillRect(X(3.2), Y(1.2), 1.8 * s, 1 * s);
    }
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  }

  // ---------- enemies ----------
  // def.sprite: {shape, body, accent, eye, scale, crown, aura}
  function drawEnemy(ctx, cx, cy, def, t, scaleMul) {
    const sp = def.sprite;
    const sc = (sp.scale || 1) * (scaleMul || 1);
    const s = (TILE / 16) * sc;
    const bob = Math.sin(t / 260 + (cx + cy) * 0.13) * 1.6 * s;
    const X = (dx) => cx + dx * s;
    const Y = (dy) => cy + dy * s + (sp.shape === "ghost" || sp.shape === "wisp" || sp.shape === "sprite" ? bob : 0);
    const R = (dx, dy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(X(dx), Y(dy), w * s, h * s); };
    const C = (dx, dy, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(dx), Y(dy), r * s, 0, 7); ctx.fill(); };

    if (sp.aura) {
      const g = ctx.createRadialGradient(cx, cy, 2 * s, cx, cy, 12 * s);
      g.addColorStop(0, sp.aura); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - 12 * s, cy - 12 * s, 24 * s, 24 * s);
    }
    // shadow
    if (sp.shape !== "wisp") {
      ctx.fillStyle = "rgba(0,0,0,0.30)";
      ctx.beginPath(); ctx.ellipse(cx, cy + 7.4 * s, 5.6 * s, 1.9 * s, 0, 0, 7); ctx.fill();
    }

    const squish = Math.sin(t / 300 + cx) * 0.6;
    switch (sp.shape) {
      case "blob": {
        C(0, 2 + squish * 0.4, 5.6, sp.body);
        C(-1.4, 0.6 + squish * 0.4, 3.4, shade2(sp.body, 28));
        ctx.fillStyle = sp.eye || "#1c130c";
        ctx.fillRect(X(-2.2), Y(0.6), 1.4 * s, 1.8 * s);
        ctx.fillRect(X(1), Y(0.6), 1.4 * s, 1.8 * s);
        break;
      }
      case "rat": {
        // tail
        ctx.strokeStyle = sp.accent; ctx.lineWidth = s;
        ctx.beginPath(); ctx.moveTo(X(4), Y(5)); ctx.quadraticCurveTo(X(8), Y(4), X(8.6), Y(1)); ctx.stroke();
        C(0.4, 4, 4.6, sp.body);                       // body
        C(-3.6, 2.6, 2.8, sp.body);                    // head
        C(-4.6, 0.4, 1.2, sp.accent);                  // ear
        C(-2.6, 0.6, 1.2, sp.accent);
        ctx.fillStyle = sp.eye || "#e03b3b";
        ctx.fillRect(X(-4.6), Y(2), s, s);
        R(-6.4, 3.4, 1.4, 0.8, sp.accent);             // snout
        break;
      }
      case "wolf": {
        C(0.6, 3.4, 5.4, sp.body);                     // body
        R(-6.6, -1.2, 5, 4.6, sp.body);                // head
        R(-6.4, -3, 1.6, 2, sp.accent);                // ears
        R(-3.4, -3, 1.6, 2, sp.accent);
        R(-7.8, 0.6, 2, 1.6, sp.accent);               // muzzle
        ctx.fillStyle = sp.eye || "#ffd23f";
        ctx.fillRect(X(-5.8), Y(-0.4), 1.2 * s, 1.2 * s);
        ctx.fillRect(X(-3.6), Y(-0.4), 1.2 * s, 1.2 * s);
        R(-3.4, 6, 1.6, 2.4, shade2(sp.body, -20));    // legs
        R(2.6, 6, 1.6, 2.4, shade2(sp.body, -20));
        break;
      }
      case "imp": {
        R(-2.6, -1, 5.2, 5.4, sp.body);                // torso
        C(0, -4, 3, sp.body);                          // head
        R(-2.8, -6.6, 1.2, 2.2, sp.accent);            // horns
        R(1.6, -6.6, 1.2, 2.2, sp.accent);
        ctx.fillStyle = sp.eye || "#ffe24a";
        ctx.fillRect(X(-1.6), Y(-4.6), 1.2 * s, 1.2 * s);
        ctx.fillRect(X(0.6), Y(-4.6), 1.2 * s, 1.2 * s);
        R(-2.2, 4.4, 1.6, 2.8, shade2(sp.body, -25));  // legs
        R(0.8, 4.4, 1.6, 2.8, shade2(sp.body, -25));
        // wings
        ctx.fillStyle = shade2(sp.body, -35);
        ctx.beginPath(); ctx.moveTo(X(-2.6), Y(-1)); ctx.lineTo(X(-6), Y(-4)); ctx.lineTo(X(-4.4), Y(0.6)); ctx.fill();
        ctx.beginPath(); ctx.moveTo(X(2.6), Y(-1)); ctx.lineTo(X(6), Y(-4)); ctx.lineTo(X(4.4), Y(0.6)); ctx.fill();
        break;
      }
      case "ghost": {
        ctx.globalAlpha = 0.82;
        C(0, -2, 4.6, sp.body);
        R(-4.6, -2, 9.2, 6.4, sp.body);
        for (let i = 0; i < 4; i++) {
          const wob = Math.sin(t / 200 + i) * 0.6;
          R(-4.6 + i * 2.5, 4.4 + wob, 1.8, 2.4, sp.body);
        }
        ctx.fillStyle = sp.eye || "#0d2b3d";
        ctx.fillRect(X(-2.4), Y(-3.4), 1.5 * s, 2 * s);
        ctx.fillRect(X(0.9), Y(-3.4), 1.5 * s, 2 * s);
        ctx.globalAlpha = 1;
        break;
      }
      case "robed": {
        R(-3.6, -2, 7.2, 9, sp.body);                  // robe
        R(-3.6, 6, 7.2, 1, shade2(sp.body, -30));
        C(0, -4.4, 2.8, sp.accent);                    // hooded head
        R(-3, -6.2, 6, 2.4, sp.body);                  // hood
        ctx.fillStyle = sp.eye || "#7be0ff";
        ctx.fillRect(X(-1.7), Y(-4.8), 1.2 * s, 1.2 * s);
        ctx.fillRect(X(0.5), Y(-4.8), 1.2 * s, 1.2 * s);
        break;
      }
      case "insect": {
        C(0, 2.6, 4.8, sp.body);                       // shell
        C(0, 0.6, 3, shade2(sp.body, 25));
        C(-3.8, 4.4, 1.8, sp.accent);                  // head low-left? center head:
        ctx.fillStyle = sp.eye || "#3df0c0";
        ctx.fillRect(X(-1.6), Y(-0.6), 1.1 * s, 1.1 * s);
        ctx.fillRect(X(0.5), Y(-0.6), 1.1 * s, 1.1 * s);
        ctx.strokeStyle = shade2(sp.body, -30); ctx.lineWidth = s * 0.8;
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath(); ctx.moveTo(X(-4.4), Y(2 + i * 2)); ctx.lineTo(X(-7), Y(3.4 + i * 2.4)); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(X(4.4), Y(2 + i * 2)); ctx.lineTo(X(7), Y(3.4 + i * 2.4)); ctx.stroke();
        }
        break;
      }
      case "knight": {
        R(-3, -1.4, 6, 5.4, sp.body);                  // breastplate
        R(-3, -1.4, 6, 1.4, shade2(sp.body, 30));
        R(-2.6, -6.6, 5.2, 5, sp.accent);              // helm
        R(-2.6, -4.4, 5.2, 1, "#15120c");              // visor slit
        ctx.fillStyle = sp.eye || "#ff5c2a";
        ctx.fillRect(X(-1.6), Y(-4.4), 1.2 * s, 1 * s);
        ctx.fillRect(X(0.6), Y(-4.4), 1.2 * s, 1 * s);
        R(-0.5, -8.2, 1, 1.8, sp.plume || "#c43e0c");  // plume
        R(-2.4, 4, 2, 3.4, shade2(sp.body, -25));      // legs
        R(0.6, 4, 2, 3.4, shade2(sp.body, -25));
        // sword
        ctx.fillStyle = "#cfd6dd";
        ctx.fillRect(X(3.8), Y(-5.4), 1.1 * s, 7 * s);
        ctx.fillStyle = "#6e5128";
        ctx.fillRect(X(3.1), Y(1.4), 2.6 * s, 1 * s);
        break;
      }
      case "serpent": {
        ctx.strokeStyle = sp.body; ctx.lineWidth = 3.6 * s;
        ctx.beginPath();
        for (let i = 0; i <= 14; i++) {
          const xx = X(-6 + i * 0.86);
          const yy = Y(3 + Math.sin(i * 0.8 + t / 220) * 2.2);
          if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        C(5.4, 1 + Math.sin(14 * 0.8 + t / 220) * 2.2, 2.6, sp.body); // head
        ctx.fillStyle = sp.eye || "#ffe24a";
        ctx.fillRect(X(5.6), Y(-0.4 + Math.sin(14 * 0.8 + t / 220) * 2.2), 1.2 * s, 1.2 * s);
        break;
      }
      case "sentinel": {
        R(-3.4, -7, 6.8, 13.6, sp.body);               // monolith
        R(-3.4, -7, 6.8, 1.6, shade2(sp.body, 30));
        R(-2.2, -4.2, 4.4, 4.4, "#15120c");            // core socket
        const fh = 1.6 + Math.sin(t / 160) * 0.6;
        C(0, -2, fh, sp.accent);                       // flame core
        ctx.fillStyle = sp.eye || "#ffb53a";
        C(0, -2, fh * 0.5, sp.eye || "#ffd23f");
        break;
      }
      case "wisp": {
        const r1 = 3.4 + Math.sin(t / 180) * 0.7;
        const g = ctx.createRadialGradient(X(0), Y(0), 0.5 * s, X(0), Y(0), r1 * 2.4 * s);
        g.addColorStop(0, sp.accent); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(X(-9), Y(-9), 18 * s, 18 * s);
        C(0, 0, r1, sp.body);
        C(-0.8, -0.8, r1 * 0.45, "#ffffff");
        break;
      }
      case "gargoyle": {
        ctx.fillStyle = shade2(sp.body, -25);          // wings
        ctx.beginPath(); ctx.moveTo(X(-2), Y(-2)); ctx.lineTo(X(-7.4), Y(-6)); ctx.lineTo(X(-5), Y(0.6)); ctx.fill();
        ctx.beginPath(); ctx.moveTo(X(2), Y(-2)); ctx.lineTo(X(7.4), Y(-6)); ctx.lineTo(X(5), Y(0.6)); ctx.fill();
        R(-3, -2, 6, 6.4, sp.body);
        C(0, -4.4, 2.8, sp.body);
        R(-2.6, -7, 1.2, 2, sp.accent);
        R(1.4, -7, 1.2, 2, sp.accent);
        ctx.fillStyle = sp.eye || "#ff8a2a";
        ctx.fillRect(X(-1.7), Y(-5), 1.2 * s, 1.1 * s);
        ctx.fillRect(X(0.5), Y(-5), 1.2 * s, 1.1 * s);
        R(-2.4, 4.4, 1.8, 2.8, shade2(sp.body, -20));
        R(0.6, 4.4, 1.8, 2.8, shade2(sp.body, -20));
        break;
      }
      case "sprite": {
        const tw = Math.sin(t / 150) * 0.8;
        ctx.fillStyle = sp.accent;
        ctx.beginPath();
        ctx.moveTo(X(0), Y(-4.6)); ctx.lineTo(X(3 + tw), Y(0)); ctx.lineTo(X(0), Y(4.6)); ctx.lineTo(X(-3 - tw), Y(0));
        ctx.fill();
        C(0, 0, 1.8, sp.body);
        ctx.fillStyle = "#fff";
        ctx.fillRect(X(-0.5), Y(-0.5), s, s);
        break;
      }
    }
    if (sp.crown) {
      ctx.fillStyle = "#ffd23f";
      const cyy = sp.shape === "ghost" || sp.shape === "wisp" ? Y(-7.5) : Y(-8.6);
      ctx.fillRect(X(-2.4), cyy, 4.8 * s, 1.2 * s);
      ctx.fillRect(X(-2.4), cyy - 1.1 * s, 1 * s, 1.1 * s);
      ctx.fillRect(X(-0.5), cyy - 1.1 * s, 1 * s, 1.1 * s);
      ctx.fillRect(X(1.4), cyy - 1.1 * s, 1 * s, 1.1 * s);
    }
  }

  function shade2(hex, amt) { return shade(hex, amt); }

  // ---------- item icons ----------
  const RARITY_COLORS = {
    common: "#c8c8c8", uncommon: "#58d858", rare: "#4aa3ff",
    epic: "#c478ff", legendary: "#ff9a2e", mythic: "#ff4242"
  };

  function drawItemIcon(canvas, item) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const s = W / 16;
    const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x * s, y * s, w * s, h * s); };
    const rc = RARITY_COLORS[item.rarity] || "#c8c8c8";

    if (item.rarity === "legendary" || item.rarity === "mythic" || item.rarity === "epic") {
      const g = ctx.createRadialGradient(W / 2, H / 2, 1, W / 2, H / 2, W / 2);
      g.addColorStop(0, rc + "55"); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    const tint = item.tint || rc;
    switch (item.icon) {
      case "sword": {
        ctx.save();
        ctx.translate(W / 2, H / 2); ctx.rotate(-Math.PI / 4); ctx.translate(-W / 2, -H / 2);
        R(7.1, 1.5, 1.8, 9, tint);
        R(7.5, 1, 1, 9.5, "#ffffff66");
        R(5.4, 10.5, 5.2, 1.4, "#8a6a3a");
        R(7.2, 11.9, 1.6, 3, "#5a3f1d");
        R(7, 14.6, 2, 1.2, "#d8b75a");
        ctx.restore();
        break;
      }
      case "club": {
        ctx.save();
        ctx.translate(W / 2, H / 2); ctx.rotate(-Math.PI / 5); ctx.translate(-W / 2, -H / 2);
        R(6.6, 2, 3, 6, tint);
        R(6, 2.5, 4.2, 2, tint);
        R(7.2, 8, 1.8, 6, "#6e5128");
        ctx.restore();
        break;
      }
      case "armor": {
        R(4, 3, 8, 3, tint);
        R(3, 4, 10, 6, tint);
        R(5, 6, 6, 7, tint);
        R(5, 6, 6, 1.4, shade(tint.startsWith("#") ? tint : "#888888", 40));
        R(7.4, 7.6, 1.2, 4, "#00000044");
        break;
      }
      case "cloak": {
        R(5, 2.4, 6, 2, tint);
        R(4, 4, 8, 9, tint);
        R(4.8, 5, 6.4, 8, shade(tint.startsWith("#") ? tint : "#888888", -25));
        R(7.4, 3, 1.2, 1.4, "#d8b75a");
        break;
      }
      case "potion": {
        R(6.6, 2, 2.8, 2, "#b9c2c9");
        R(6, 4, 4, 1.4, "#8a6a3a");
        R(5, 5.4, 6, 8, "#cfdde6aa");
        R(5.7, 8, 4.6, 4.8, item.tint || "#e0561a");
        R(5.7, 8, 4.6, 1, "#ffffff55");
        break;
      }
      case "scroll": {
        R(3.4, 3, 9.2, 10, "#d8c596");
        R(3.4, 3, 9.2, 1.6, "#b39b66");
        R(3.4, 11.4, 9.2, 1.6, "#b39b66");
        R(5.4, 6, 5.4, 0.8, "#7a5a2a");
        R(5.4, 7.8, 4.2, 0.8, "#7a5a2a");
        R(5.4, 9.4, 5, 0.8, "#7a5a2a");
        break;
      }
      case "charm": {
        ctx.strokeStyle = "#d8b75a"; ctx.lineWidth = s;
        ctx.beginPath(); ctx.arc(W / 2, 5 * s, 3.4 * s, Math.PI * 0.9, Math.PI * 2.1); ctx.stroke();
        ctx.fillStyle = tint;
        ctx.beginPath(); ctx.arc(W / 2, 9.4 * s, 3.4 * s, 0, 7); ctx.fill();
        ctx.fillStyle = "#ffffff88";
        ctx.beginPath(); ctx.arc(W / 2 - s, 8.4 * s, 1.1 * s, 0, 7); ctx.fill();
        break;
      }
      case "crown": {
        R(3, 8, 10, 4, "#ffd23f");
        R(3, 5.4, 1.8, 2.6, "#ffd23f");
        R(7.1, 4.4, 1.8, 3.6, "#ffd23f");
        R(11.2, 5.4, 1.8, 2.6, "#ffd23f");
        R(7.4, 9.2, 1.4, 1.6, tint);
        break;
      }
      case "flame": {
        ctx.fillStyle = "#e0561a";
        ctx.beginPath(); ctx.arc(W / 2, 9 * s, 4.4 * s, 0, 7); ctx.fill();
        ctx.fillStyle = "#ffb53a";
        ctx.beginPath(); ctx.arc(W / 2, 9.8 * s, 2.6 * s, 0, 7); ctx.fill();
        R(7.2, 2.6, 1.6, 4, "#e0561a");
        R(9, 4.4, 1.3, 3, "#e0561a");
        break;
      }
      default: {
        R(5, 5, 6, 6, tint);
      }
    }
  }

  // ---------- npc / portraits ----------
  function drawNPCInto(canvas, npc) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    drawHumanoid(ctx, canvas.width / 2, canvas.height / 2 + 6, npc.look, "down", 0, canvas.width / 34);
  }

  function drawEnemyInto(canvas, def) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    drawEnemy(ctx, canvas.width / 2, canvas.height / 2 + 4, def, performance.now(), canvas.width / 42);
  }

  function drawPlayerInto(canvas, appearance, scale) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    drawHumanoid(ctx, canvas.width / 2, canvas.height / 2 + 8, appearance, "down", 0, scale || canvas.width / 30);
  }

  return { TILE, TILES, hash, drawTile, drawHumanoid, drawEnemy, drawItemIcon, drawNPCInto, drawEnemyInto, drawPlayerInto, RARITY_COLORS, shade };
})();
