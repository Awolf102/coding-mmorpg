/* ============================================================
   Sprites — tile metadata, shared helpers, and painterly 2D
   item icons. World/character art now lives in the 3D pipeline
   (js/game/models3d.js + render3d.js), which overrides the
   portrait functions below once it loads.
   ============================================================ */
window.Sprites = (function () {
  const TILE = 32;

  // ---------- tile legend ----------
  // solid: blocks movement. mini: minimap color.
  const TILES = {
    "g": { solid: false, mini: "#5d8a3f" },  // grass
    "G": { solid: false, mini: "#3f672c" },  // dark grass
    "t": { solid: true,  mini: "#23501a" },  // tree
    "w": { solid: true,  mini: "#2c6b94" },  // water
    "b": { solid: false, mini: "#8a6a3e" },  // bridge
    "p": { solid: false, mini: "#a48d58" },  // path
    "d": { solid: false, mini: "#7c6945" },  // dirt
    "s": { solid: false, mini: "#cdb87e" },  // sand
    "r": { solid: true,  mini: "#73716b" },  // boulder
    "f": { solid: true,  mini: "#6a4d2a" },  // fence
    "h": { solid: true,  mini: "#6e6e72" },  // house wall
    "R": { solid: true,  mini: "#7c4030" },  // roof
    "D": { solid: true,  mini: "#5a3a1a" },  // door (decorative)
    "S": { solid: false, mini: "#8b8674" },  // stone floor
    "c": { solid: false, mini: "#6f6b5c" },  // cobble
    "W": { solid: true,  mini: "#4f5550" },  // ruined wall
    "P": { solid: true,  mini: "#9a9588" },  // pillar
    "m": { solid: false, mini: "#566036" },  // marsh
    "l": { solid: true,  mini: "#d4541b" },  // lava
    "x": { solid: true,  mini: "#0c0a0a" },  // void
    "F": { solid: true,  mini: "#ff8a2a" },  // brazier flame
    /* --- themed world dressing --- */
    "a": { solid: false, mini: "#4f463c" },  // ash / scorched ground
    "e": { solid: false, mini: "#5a5148" },  // bone-littered ground
    "*": { solid: false, mini: "#6fa04a" },  // flower bed
    "C": { solid: true,  mini: "#9a8a3a" },  // crop rows
    "o": { solid: true,  mini: "#8a8a8a" },  // village well
    "M": { solid: true,  mini: "#a04a3a" },  // market stall
    "L": { solid: true,  mini: "#caa84a" },  // lamp post
    "A": { solid: true,  mini: "#4a4a4e" },  // anvil & forge
    "B": { solid: true,  mini: "#7a5c34" },  // barrels & crates
    "Y": { solid: true,  mini: "#6a6a52" },  // tent
    "O": { solid: true,  mini: "#9a9588" },  // runestone / standing stone
    "u": { solid: true,  mini: "#8a8a82" },  // statue
    "n": { solid: true,  mini: "#7a3030" },  // banner pole
    "+": { solid: true,  mini: "#6e6e66" },  // gravestone
    "i": { solid: true,  mini: "#ffba5a" },  // glowing crystal
    "T": { solid: true,  mini: "#3a322c" },  // dead / charred tree
    "Q": { solid: true,  mini: "#caa23a" },  // throne
    "k": { solid: true,  mini: "#6a4a2a" },  // lectern & books
    "j": { solid: true,  mini: "#7a7a7e" },  // weapon rack
    "q": { solid: true,  mini: "#7ad88a" },  // glowing mushrooms
    "^": { solid: true,  mini: "#2a2226" }   // obsidian spike
  };

  function hash(x, y) {
    let h = (x * 374761393 + y * 668265263) ^ 1274126177;
    h = (h ^ (h >> 13)) * 1103515245;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  }

  // ---------- item icons (painterly, WoW-style slots) ----------
  const RARITY_COLORS = {
    common: "#c8c8c8", uncommon: "#58d858", rare: "#4aa3ff",
    epic: "#c478ff", legendary: "#ff9a2e", mythic: "#ff4242"
  };

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawItemIcon(canvas, item) {
    // up-res once, preserving on-screen size
    if (!canvas.dataset.hd) {
      canvas.dataset.hd = "1";
      if (!canvas.style.width && canvas.parentElement) {
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
      }
      canvas.width = canvas.height = 128;
    }
    const ctx = canvas.getContext("2d");
    const S = canvas.width;
    ctx.clearRect(0, 0, S, S);
    ctx.save();
    ctx.scale(S / 128, S / 128);

    const rc = RARITY_COLORS[item.rarity] || "#c8c8c8";
    const tint = item.tint || rc;
    const fancy = ["rare", "epic", "legendary", "mythic"].includes(item.rarity);

    // slot backplate
    const bg = ctx.createLinearGradient(0, 0, 0, 128);
    bg.addColorStop(0, "#322a20");
    bg.addColorStop(1, "#15110c");
    rr(ctx, 3, 3, 122, 122, 14);
    ctx.fillStyle = bg;
    ctx.fill();
    const sheen = ctx.createRadialGradient(64, 34, 4, 64, 50, 80);
    sheen.addColorStop(0, "rgba(255,240,210,0.13)");
    sheen.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sheen;
    rr(ctx, 3, 3, 122, 122, 14);
    ctx.fill();
    if (fancy) {
      const glow = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
      glow.addColorStop(0, hexA(tint, 0.32));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      rr(ctx, 3, 3, 122, 122, 14);
      ctx.fill();
    }
    // rarity rim
    rr(ctx, 4.5, 4.5, 119, 119, 13);
    ctx.lineWidth = 3;
    ctx.strokeStyle = hexA(rc, item.rarity === "common" ? 0.45 : 0.85);
    ctx.stroke();
    rr(ctx, 8, 8, 112, 112, 10);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.stroke();

    if (fancy) { ctx.shadowColor = tint; ctx.shadowBlur = 12; }

    switch (item.icon) {
      case "sword": paintSword(ctx, tint); break;
      case "club": paintClub(ctx, tint); break;
      case "armor": paintArmor(ctx, tint); break;
      case "cloak": paintCloak(ctx, tint); break;
      case "potion": paintPotion(ctx, item.tint || "#e0561a"); break;
      case "scroll": paintScroll(ctx); break;
      case "charm": paintCharm(ctx, tint); break;
      case "crown": paintCrown(ctx, tint); break;
      case "flame": paintFlame(ctx); break;
      default: {
        ctx.fillStyle = tint;
        rr(ctx, 44, 44, 40, 40, 8);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function paintSword(ctx, tint) {
    ctx.save();
    ctx.translate(64, 64);
    ctx.rotate(-Math.PI / 4);
    // blade
    const bg = ctx.createLinearGradient(-7, 0, 7, 0);
    bg.addColorStop(0, shade(tint, -50));
    bg.addColorStop(0.45, tint);
    bg.addColorStop(0.55, "#ffffff");
    bg.addColorStop(0.7, tint);
    bg.addColorStop(1, shade(tint, -40));
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.lineTo(7, -42);
    ctx.lineTo(7, 16);
    ctx.lineTo(-7, 16);
    ctx.lineTo(-7, -42);
    ctx.closePath();
    ctx.fill();
    // fuller
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(0, 12); ctx.stroke();
    // crossguard
    const gg = ctx.createLinearGradient(0, 16, 0, 24);
    gg.addColorStop(0, "#e8c879"); gg.addColorStop(1, "#8a652e");
    ctx.fillStyle = gg;
    rr(ctx, -19, 16, 38, 8, 4);
    ctx.fill();
    // grip
    ctx.fillStyle = "#4a3520";
    rr(ctx, -4.5, 24, 9, 22, 4);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,220,150,0.35)";
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(-4.5, 28 + i * 4.5); ctx.lineTo(4.5, 26.5 + i * 4.5); ctx.stroke();
    }
    // pommel
    const pg = ctx.createRadialGradient(-1.5, 49, 1, 0, 50, 7);
    pg.addColorStop(0, "#ffe9a8"); pg.addColorStop(1, "#8a652e");
    ctx.fillStyle = pg;
    ctx.beginPath(); ctx.arc(0, 50, 6, 0, 7); ctx.fill();
    ctx.restore();
  }

  function paintClub(ctx, tint) {
    ctx.save();
    ctx.translate(64, 64);
    ctx.rotate(-Math.PI / 4.5);
    const wg = ctx.createLinearGradient(-14, 0, 14, 0);
    wg.addColorStop(0, shade(tint, -45));
    wg.addColorStop(0.5, shade(tint, 18));
    wg.addColorStop(1, shade(tint, -35));
    ctx.fillStyle = wg;
    ctx.beginPath();
    ctx.moveTo(-13, -46);
    ctx.quadraticCurveTo(-17, -20, -6, 8);
    ctx.lineTo(-4.5, 48);
    ctx.lineTo(4.5, 48);
    ctx.lineTo(6, 8);
    ctx.quadraticCurveTo(17, -20, 13, -46);
    ctx.quadraticCurveTo(0, -56, -13, -46);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 2;
    for (const y of [-36, -22, -8]) {
      ctx.beginPath(); ctx.moveTo(-14 + Math.abs(y) * 0.08, y); ctx.quadraticCurveTo(0, y + 4, 14 - Math.abs(y) * 0.08, y); ctx.stroke();
    }
    ctx.restore();
  }

  function paintArmor(ctx, tint) {
    const mg = ctx.createLinearGradient(34, 0, 94, 0);
    mg.addColorStop(0, shade(tint, -55));
    mg.addColorStop(0.5, shade(tint, 22));
    mg.addColorStop(1, shade(tint, -45));
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.moveTo(36, 32);                       // left shoulder
    ctx.lineTo(54, 26); ctx.lineTo(74, 26); ctx.lineTo(92, 32);
    ctx.quadraticCurveTo(98, 52, 90, 66);
    ctx.quadraticCurveTo(86, 92, 64, 102);
    ctx.quadraticCurveTo(42, 92, 38, 66);
    ctx.quadraticCurveTo(30, 52, 36, 32);
    ctx.fill();
    // neckline
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.moveTo(54, 26); ctx.quadraticCurveTo(64, 40, 74, 26);
    ctx.closePath(); ctx.fill();
    // center ridge
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(64, 42); ctx.lineTo(64, 98); ctx.stroke();
    // rivets
    ctx.fillStyle = shade(tint, 60);
    for (const [x, y] of [[44, 38], [84, 38], [46, 60], [82, 60]]) {
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, 7); ctx.fill();
    }
  }

  function paintCloak(ctx, tint) {
    const cg = ctx.createLinearGradient(40, 30, 92, 100);
    cg.addColorStop(0, shade(tint, 15));
    cg.addColorStop(1, shade(tint, -50));
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.moveTo(48, 28);
    ctx.quadraticCurveTo(64, 22, 80, 28);
    ctx.quadraticCurveTo(96, 50, 92, 96);
    ctx.lineTo(84, 88); ctx.lineTo(76, 100); ctx.lineTo(64, 90);
    ctx.lineTo(52, 100); ctx.lineTo(44, 88); ctx.lineTo(36, 96);
    ctx.quadraticCurveTo(32, 50, 48, 28);
    ctx.fill();
    // fold shadows
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 3;
    for (const x of [50, 64, 78]) {
      ctx.beginPath(); ctx.moveTo(x, 38); ctx.quadraticCurveTo(x + 3, 64, x - 2, 90); ctx.stroke();
    }
    // brooch
    const bgm = ctx.createRadialGradient(62, 28, 1, 64, 30, 7);
    bgm.addColorStop(0, "#ffe9a8"); bgm.addColorStop(1, "#8a652e");
    ctx.fillStyle = bgm;
    ctx.beginPath(); ctx.arc(64, 30, 6, 0, 7); ctx.fill();
  }

  function paintPotion(ctx, liquid) {
    // cork + neck
    ctx.fillStyle = "#9a7748";
    rr(ctx, 57, 22, 14, 10, 3); ctx.fill();
    ctx.fillStyle = "rgba(200,220,235,0.5)";
    rr(ctx, 55, 32, 18, 12, 2); ctx.fill();
    // bulb glass
    ctx.beginPath();
    ctx.arc(64, 74, 26, 0, 7);
    ctx.fillStyle = "rgba(195,220,235,0.28)";
    ctx.fill();
    ctx.strokeStyle = "rgba(225,240,250,0.55)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // liquid
    ctx.save();
    ctx.beginPath(); ctx.arc(64, 74, 23, 0, 7); ctx.clip();
    const lg = ctx.createLinearGradient(0, 58, 0, 100);
    lg.addColorStop(0, shade(liquid, 35)); lg.addColorStop(1, shade(liquid, -35));
    ctx.fillStyle = lg;
    ctx.fillRect(38, 62, 52, 40);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath(); ctx.ellipse(64, 63, 22, 4, 0, 0, 7); ctx.fill();
    ctx.restore();
    // shine
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath(); ctx.ellipse(53, 68, 4, 9, -0.5, 0, 7); ctx.fill();
  }

  function paintScroll(ctx) {
    const pg = ctx.createLinearGradient(0, 36, 0, 92);
    pg.addColorStop(0, "#e8d6a8"); pg.addColorStop(1, "#c2a878");
    ctx.fillStyle = pg;
    rr(ctx, 34, 36, 60, 56, 4); ctx.fill();
    // rolled ends
    ctx.fillStyle = "#a8854f";
    rr(ctx, 30, 32, 68, 10, 5); ctx.fill();
    rr(ctx, 30, 86, 68, 10, 5); ctx.fill();
    ctx.fillStyle = "rgba(255,240,200,0.5)";
    rr(ctx, 30, 33, 68, 3, 2); ctx.fill();
    // text
    ctx.strokeStyle = "#6e5128";
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(42, 50 + i * 9);
      ctx.lineTo(42 + (i % 2 ? 36 : 44), 50 + i * 9);
      ctx.stroke();
    }
    // wax seal
    const sg = ctx.createRadialGradient(80, 80, 1, 82, 82, 9);
    sg.addColorStop(0, "#e05c4a"); sg.addColorStop(1, "#7a1f12");
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(82, 82, 8, 0, 7); ctx.fill();
  }

  function paintCharm(ctx, tint) {
    // chain
    ctx.strokeStyle = "#c8a04a";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(64, 56, 26, Math.PI * 0.85, Math.PI * 2.15); ctx.stroke();
    ctx.strokeStyle = "rgba(255,235,170,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(64, 55, 26, Math.PI * 0.9, Math.PI * 2.1); ctx.stroke();
    // gem (teardrop)
    const gg = ctx.createLinearGradient(48, 64, 84, 100);
    gg.addColorStop(0, shade(tint, 45)); gg.addColorStop(1, shade(tint, -45));
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.moveTo(64, 58);
    ctx.quadraticCurveTo(86, 78, 64, 100);
    ctx.quadraticCurveTo(42, 78, 64, 58);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath(); ctx.ellipse(57, 74, 4, 8, -0.4, 0, 7); ctx.fill();
  }

  function paintCrown(ctx, tint) {
    const gg = ctx.createLinearGradient(0, 50, 0, 92);
    gg.addColorStop(0, "#ffe289"); gg.addColorStop(0.5, "#e8b84e"); gg.addColorStop(1, "#9a6f24");
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.moveTo(34, 90);
    ctx.lineTo(32, 56); ctx.lineTo(46, 70); ctx.lineTo(58, 46);
    ctx.lineTo(64, 64); ctx.lineTo(70, 46); ctx.lineTo(82, 70);
    ctx.lineTo(96, 56); ctx.lineTo(94, 90);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#8a6320";
    rr(ctx, 34, 82, 60, 9, 3); ctx.fill();
    ctx.fillStyle = "#ffe9a8";
    rr(ctx, 34, 80, 60, 3, 1.5); ctx.fill();
    const gemP = [[44, 86], [64, 86], [84, 86]];
    for (const [x, y] of gemP) {
      ctx.fillStyle = tint;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath(); ctx.arc(x - 1.2, y - 1.2, 1.4, 0, 7); ctx.fill();
    }
  }

  function paintFlame(ctx) {
    const layers = [
      { c: "#c43e0c", s: 1.0 }, { c: "#ff7a1a", s: 0.74 },
      { c: "#ffb53a", s: 0.5 }, { c: "#fff0b0", s: 0.26 }
    ];
    for (const L of layers) {
      ctx.fillStyle = L.c;
      ctx.beginPath();
      const cx2 = 64, base = 100, h = 72 * L.s, w = 30 * L.s;
      ctx.moveTo(cx2, base - h);
      ctx.quadraticCurveTo(cx2 + w * 0.9, base - h * 0.62, cx2 + w * 0.62, base - h * 0.3);
      ctx.quadraticCurveTo(cx2 + w, base - h * 0.12, cx2, base);
      ctx.quadraticCurveTo(cx2 - w, base - h * 0.12, cx2 - w * 0.62, base - h * 0.3);
      ctx.quadraticCurveTo(cx2 - w * 0.9, base - h * 0.62, cx2, base - h);
      ctx.fill();
    }
  }

  /* ---------- portrait hooks (overridden by Models3D) ---------- */
  function drawNPCInto() {}
  function drawEnemyInto() {}
  function drawPlayerInto() {}

  return { TILE, TILES, hash, shade, RARITY_COLORS, drawItemIcon, drawNPCInto, drawEnemyInto, drawPlayerInto };
})();
