/* ============================================================
   Models3D — low-poly model factory (RuneScape-style):
   humanoids, enemies, and the offscreen portrait renderer
   that feeds 2D UI canvases (dialogue faces, combat art,
   character previews). Requires three.min.js + sprites.js.
   ============================================================ */
window.Models3D = (function () {
  const shade = Sprites.shade;

  /* ---------- shared textures ---------- */
  let _glowTex = null;
  function glowTexture() {
    if (_glowTex) return _glowTex;
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.45)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    _glowTex = tex;
    return tex;
  }

  function makeGlowSprite(color, size, opacity) {
    const mat = new THREE.SpriteMaterial({
      map: glowTexture(), color: color, transparent: true,
      opacity: opacity == null ? 0.7 : opacity,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const s = new THREE.Sprite(mat);
    s.scale.set(size, size, 1);
    return s;
  }

  function parseAura(rgba) {
    const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?/.exec(rgba || "");
    if (!m) return { color: 0xffaa55, alpha: 0.25 };
    return {
      color: (parseInt(m[1]) << 16) | (parseInt(m[2]) << 8) | parseInt(m[3]),
      alpha: m[4] ? parseFloat(m[4]) : 0.25
    };
  }

  /* ---------- small builders ---------- */
  function lam(color) { return new THREE.MeshLambertMaterial({ color: color }); }
  function glow(color) { return new THREE.MeshBasicMaterial({ color: color }); }

  function box(parent, w, h, d, color, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof color === "string" || typeof color === "number" ? lam(color) : color);
    m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  function cyl(parent, rTop, rBot, h, seg, color, x, y, z) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg || 8), typeof color === "string" || typeof color === "number" ? lam(color) : color);
    m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  function cone(parent, r, h, seg, color, x, y, z) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg || 8), typeof color === "string" || typeof color === "number" ? lam(color) : color);
    m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  function ball(parent, r, color, x, y, z, wseg, hseg) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, wseg || 10, hseg || 8), typeof color === "string" || typeof color === "number" ? lam(color) : color);
    m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  function tri(parent, a, b, c, color) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute([a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]], 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshLambertMaterial({ color: color, side: THREE.DoubleSide });
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    parent.add(m);
    return m;
  }

  function addCrown(parent, y) {
    const g = new THREE.Group();
    cyl(g, 0.2, 0.2, 0.11, 8, "#ffd23f", 0, 0, 0);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      cone(g, 0.045, 0.14, 4, "#ffd23f", Math.sin(a) * 0.17, 0.11, Math.cos(a) * 0.17);
    }
    g.position.y = y;
    parent.add(g);
    return g;
  }

  /* ============================================================
     WEAPON FORGE — one silhouette per weapon class, grip at the
     origin, blade up +y. Slightly oversized, the way MMO weapons
     read at a distance. vis: {model, tint, rarity, flame}
     ============================================================ */
  const RARITY_SCALE = { common: 1, uncommon: 1.04, rare: 1.08, epic: 1.13, legendary: 1.2, mythic: 1.28 };

  function buildWeapon(vis) {
    const tint = vis.tint || "#b9c2c9";
    const g = new THREE.Group();
    const steel = new THREE.MeshLambertMaterial({ color: tint, emissive: new THREE.Color(tint).multiplyScalar(0.18) });
    const dark = lam(shade(tint, -60));
    const wood = lam("#5a3f1d");
    const gold = lam("#c8a04a");
    switch (vis.model) {
      case "club": {
        cyl(g, 0.045, 0.06, 0.55, 6, wood, 0, 0.2, 0);
        box(g, 0.17, 0.26, 0.17, steel, 0, 0.55, 0).rotation.y = 0.6;
        box(g, 0.2, 0.07, 0.2, dark, 0, 0.46, 0).rotation.y = 0.3;
        ball(g, 0.05, wood, 0, -0.08, 0, 6, 5);
        break;
      }
      case "sabre": {
        box(g, 0.06, 0.4, 0.03, steel, 0, 0.32, 0);
        box(g, 0.055, 0.32, 0.028, steel, -0.045, 0.66, 0).rotation.z = 0.22;
        cone(g, 0.04, 0.13, 4, steel, -0.115, 0.85, 0).rotation.z = 0.38;
        cyl(g, 0.085, 0.085, 0.035, 8, gold, 0, 0.1, 0);
        box(g, 0.05, 0.17, 0.05, wood, 0, 0, 0);
        ball(g, 0.04, gold, 0, -0.1, 0, 6, 5);
        break;
      }
      case "greatsword": {
        box(g, 0.1, 0.78, 0.04, steel, 0, 0.55, 0);
        box(g, 0.035, 0.66, 0.045, shade(tint, 26), 0, 0.5, 0); // fuller
        cone(g, 0.07, 0.18, 4, steel, 0, 1.02, 0);
        box(g, 0.3, 0.06, 0.09, gold, 0, 0.14, 0);
        cone(g, 0.045, 0.1, 4, gold, -0.17, 0.14, 0).rotation.z = Math.PI / 2;
        cone(g, 0.045, 0.1, 4, gold, 0.17, 0.14, 0).rotation.z = -Math.PI / 2;
        box(g, 0.055, 0.26, 0.055, dark, 0, -0.02, 0);
        ball(g, 0.055, gold, 0, -0.17, 0, 6, 5);
        break;
      }
      case "cleaver": {
        box(g, 0.09, 0.52, 0.035, steel, 0.01, 0.38, 0);
        box(g, 0.17, 0.34, 0.03, steel, 0.06, 0.47, 0);   // broad belly
        box(g, 0.05, 0.4, 0.04, dark, -0.045, 0.34, 0);   // blunt spine
        box(g, 0.2, 0.05, 0.07, dark, 0, 0.11, 0);
        box(g, 0.05, 0.18, 0.05, wood, 0, 0, 0);
        ball(g, 0.045, dark, 0, -0.1, 0, 6, 5);
        break;
      }
      case "warblade": {
        const bodyM = lam(shade(tint, -40));
        box(g, 0.08, 0.64, 0.035, bodyM, 0, 0.44, 0);
        cone(g, 0.055, 0.14, 4, bodyM, 0, 0.83, 0);
        for (let i = 0; i < 3; i++)                        // runes of the old tongue
          box(g, 0.035, 0.07, 0.045, glow(tint), 0, 0.24 + i * 0.18, 0).castShadow = false;
        box(g, 0.24, 0.05, 0.07, dark, 0, 0.1, 0);
        box(g, 0.05, 0.18, 0.05, dark, 0, 0, 0);
        ball(g, 0.045, lam(tint), 0, -0.1, 0, 6, 5);
        const halo = makeGlowSprite(tint, 0.55, 0.3);
        halo.position.y = 0.45;
        g.add(halo);
        break;
      }
      case "brand": {
        // not forged — remembered. A sword-shaped tongue of the Eternal Flame.
        const coreM = glow(tint);
        const casing = lam("#2a1410");
        box(g, 0.09, 0.3, 0.045, casing, 0, 0.22, 0);
        for (let i = 0; i < 4; i++) {
          const fb = box(g, 0.085 - i * 0.015, 0.2, 0.03, coreM, (i % 2 ? -1 : 1) * 0.02, 0.4 + i * 0.15, 0);
          fb.rotation.z = (i % 2 ? -1 : 1) * 0.16;
          fb.castShadow = false;
        }
        cone(g, 0.045, 0.16, 4, coreM, 0, 1.02, 0).castShadow = false;
        box(g, 0.24, 0.06, 0.08, casing, 0, 0.1, 0);
        box(g, 0.05, 0.18, 0.05, casing, 0, 0, 0);
        const halo = makeGlowSprite(tint, 1.0, 0.5);
        halo.position.y = 0.55;
        g.add(halo);
        break;
      }
      default: { // sword
        box(g, 0.07, 0.6, 0.032, steel, 0, 0.42, 0);
        box(g, 0.026, 0.5, 0.038, shade(tint, 26), 0, 0.38, 0); // fuller
        cone(g, 0.05, 0.13, 4, steel, 0, 0.785, 0);
        box(g, 0.2, 0.05, 0.07, gold, 0, 0.1, 0);
        box(g, 0.05, 0.17, 0.05, wood, 0, 0, 0);
        ball(g, 0.042, gold, 0, -0.1, 0, 6, 5);
      }
    }
    if (vis.flame && vis.model !== "brand") {
      cone(g, 0.05, 0.16, 5, glow("#ffd23f"), 0, vis.model === "greatsword" ? 1.06 : 0.8, 0).castShadow = false;
      const halo = makeGlowSprite(0xff8a2a, 0.7, 0.4);
      halo.position.y = 0.5;
      g.add(halo);
    }
    g.scale.setScalar(RARITY_SCALE[vis.rarity] || 1);
    return g;
  }

  /* ============================================================
     HUMANOID — heroic low-poly MMO build, ~1.7 units tall:
     broad shoulders, tapered torso, chunky fists and boots.
     look: {skin, hair, hairStyle 0..3, shirt, pants, robe,
            hat (wizard|hood|crown|helm), hatColor, plume, weaponTint}
     ============================================================ */
  function buildHumanoid(look) {
    look = look || {};
    const skin = look.skin || "#d8a878";
    const g = new THREE.Group();
    const body = new THREE.Group(); // bobs with the gait; yaw stays on g
    g.add(body);
    const parts = { armL: null, armR: null, legL: null, legR: null, torso: null };

    if (look.robe) {
      const robe = look.robe;
      cyl(body, 0.28, 0.5, 1.08, 7, robe, 0, 0.56, 0);
      cyl(body, 0.51, 0.515, 0.09, 7, shade(robe, -30), 0, 0.085, 0);
      box(body, 0.58, 0.18, 0.34, shade(robe, -8), 0, 1.06, 0);   // shoulder mantle
      cyl(body, 0.36, 0.36, 0.06, 7, shade(robe, -40), 0, 0.78, 0); // rope belt
      // arms (sleeves with flared cuffs)
      parts.armL = new THREE.Group(); parts.armL.position.set(-0.33, 1.0, 0);
      parts.armR = new THREE.Group(); parts.armR.position.set(0.33, 1.0, 0);
      for (const a of [parts.armL, parts.armR]) {
        box(a, 0.15, 0.34, 0.17, shade(robe, -14), 0, -0.16, 0);
        box(a, 0.18, 0.14, 0.19, shade(robe, -24), 0, -0.38, 0);
        box(a, 0.11, 0.12, 0.12, skin, 0, -0.49, 0);
        body.add(a);
      }
    } else {
      const shirt = look.shirt || "#7a3000";
      const pants = look.pants || "#3a2c18";
      // legs: thigh + heavy boot
      parts.legL = new THREE.Group(); parts.legL.position.set(-0.13, 0.5, 0);
      parts.legR = new THREE.Group(); parts.legR.position.set(0.13, 0.5, 0);
      for (const l of [parts.legL, parts.legR]) {
        box(l, 0.19, 0.34, 0.21, pants, 0, -0.16, 0);
        box(l, 0.2, 0.16, 0.27, "#2a2118", 0, -0.42, 0.02);
        body.add(l);
      }
      // tapered torso: narrow waist under a broad chest
      box(body, 0.38, 0.2, 0.26, shade(shirt, -10), 0, 0.62, 0);
      parts.torso = box(body, 0.52, 0.38, 0.3, shirt, 0, 0.89, 0);
      // belt + buckle
      box(body, 0.42, 0.08, 0.28, "#2a2118", 0, 0.72, 0);
      box(body, 0.08, 0.08, 0.29, "#c8a04a", 0, 0.72, 0);
      // shoulder slab
      box(body, 0.64, 0.12, 0.3, shade(shirt, -18), 0, 1.06, 0);
      // arms: sleeve, forearm, fist
      parts.armL = new THREE.Group(); parts.armL.position.set(-0.36, 1.04, 0);
      parts.armR = new THREE.Group(); parts.armR.position.set(0.36, 1.04, 0);
      for (const a of [parts.armL, parts.armR]) {
        box(a, 0.15, 0.28, 0.17, shade(shirt, -14), 0, -0.12, 0);
        box(a, 0.13, 0.18, 0.15, skin, 0, -0.33, 0);
        box(a, 0.13, 0.12, 0.15, shade(skin, -14), 0, -0.47, 0.01); // fist
        body.add(a);
      }
    }

    // neck + head (chunky, reads at a distance)
    box(body, 0.14, 0.08, 0.14, skin, 0, 1.14, 0);
    box(body, 0.36, 0.34, 0.34, skin, 0, 1.33, 0);

    // face (skip when full helm)
    if (look.hat !== "helm") {
      box(body, 0.055, 0.06, 0.02, "#20140c", -0.08, 1.35, 0.175);
      box(body, 0.055, 0.06, 0.02, "#20140c", 0.08, 1.35, 0.175);
      box(body, 0.2, 0.025, 0.02, shade(skin, -32), 0, 1.41, 0.175); // brow line
    }

    // hair
    const hc = look.hair || "#3a2412";
    const style = look.hairStyle == null ? 0 : look.hairStyle;
    if (style !== 3 && look.hat !== "helm") {
      box(body, 0.39, 0.1, 0.38, hc, 0, 1.49, -0.005);
      box(body, 0.39, 0.1, 0.07, hc, 0, 1.46, 0.16);
      box(body, 0.39, 0.22, 0.08, hc, 0, 1.37, -0.16); // hugs the back of the head
      if (style === 1) { // long
        box(body, 0.39, 0.44, 0.1, hc, 0, 1.26, -0.18);
        box(body, 0.08, 0.32, 0.32, hc, -0.175, 1.3, -0.02);
        box(body, 0.08, 0.32, 0.32, hc, 0.175, 1.3, -0.02);
      }
      if (style === 2) { // wild
        box(body, 0.17, 0.15, 0.17, hc, -0.1, 1.59, 0.04).rotation.z = 0.4;
        box(body, 0.15, 0.17, 0.15, hc, 0.09, 1.61, -0.06).rotation.z = -0.35;
        box(body, 0.13, 0.14, 0.13, hc, 0.02, 1.62, 0.09).rotation.x = 0.3;
      }
    }

    // hats
    let topY = 1.68;
    const hcol = look.hatColor || "#3a3270";
    if (look.hat === "wizard") {
      cyl(body, 0.38, 0.38, 0.05, 8, hcol, 0, 1.5, 0);
      const c = cone(body, 0.27, 0.6, 8, hcol, 0.02, 1.81, 0);
      c.rotation.z = -0.1;
      topY = 2.12;
    } else if (look.hat === "hood") {
      box(body, 0.42, 0.38, 0.38, hcol, 0, 1.36, -0.035);
      box(body, 0.44, 0.28, 0.13, hcol, 0, 1.14, -0.17);
      box(body, 0.08, 0.36, 0.36, hcol, -0.195, 1.31, -0.02);
      box(body, 0.08, 0.36, 0.36, hcol, 0.195, 1.31, -0.02);
      topY = 1.6;
    } else if (look.hat === "crown") {
      addCrown(body, 1.55);
      topY = 1.78;
    } else if (look.hat === "helm") {
      box(body, 0.4, 0.38, 0.38, "#98a1ab", 0, 1.34, 0);
      box(body, 0.33, 0.05, 0.025, "#15120c", 0, 1.36, 0.19);
      box(body, 0.06, 0.14, 0.05, "#7d858e", 0, 1.25, 0.19);
      box(body, 0.42, 0.06, 0.4, "#7d858e", 0, 1.17, 0); // flared rim
      if (look.plume) {
        box(body, 0.05, 0.17, 0.28, look.plume, 0, 1.62, -0.04);
        box(body, 0.05, 0.14, 0.2, look.plume, 0, 1.52, -0.24);
      }
      topY = 1.72;
    }

    /* ----- held weapon: parented to the right arm so it swings
       with the stride instead of hovering at the hip ----- */
    let weapon = null, weaponKey = "";
    function setWeapon(vis) {
      const key = vis ? [vis.model, vis.tint, vis.rarity, vis.flame ? 1 : 0].join("|") : "";
      if (key === weaponKey) return;
      weaponKey = key;
      if (weapon) { parts.armR.remove(weapon); weapon = null; }
      if (!vis) return;
      weapon = buildWeapon(vis);
      weapon.position.set(0.02, look.robe ? -0.52 : -0.5, 0.04);
      weapon.rotation.x = 0.14; // blade tips forward, clear of the leg
      weapon.rotation.z = -0.1;
      parts.armR.add(weapon);
    }
    // legacy tint-only callers (knights, look.weaponTint) get a plain sword
    function setWeaponTint(tint) {
      setWeapon(tint ? { model: "sword", tint: tint } : null);
    }

    /* ----- worn armor overlays (player gear made visible) ----- */
    let armorMeshes = [], armorKey = "";
    function setArmor(vis) {
      const key = vis ? vis.model + "|" + vis.tint : "";
      if (key === armorKey) return;
      armorKey = key;
      for (const o of armorMeshes) o.parent && o.parent.remove(o);
      armorMeshes = [];
      if (!vis || look.robe) return;
      const tint = vis.tint || "#8a6a3a";
      const M = armorMeshes;
      switch (vis.model) {
        case "cloak": {
          M.push(box(body, 0.5, 0.06, 0.36, tint, 0, 1.1, -0.04)); // clasped collar
          const cape = box(body, 0.5, 0.78, 0.05, shade(tint, -10), 0, 0.72, -0.22);
          cape.rotation.x = 0.1; M.push(cape);
          for (let i = 0; i < 3; i++)                               // ragged hem
            M.push(box(body, 0.13, 0.12, 0.05, shade(tint, -22), -0.16 + i * 0.16, 0.32 - (i % 2) * 0.05, -0.26));
          break;
        }
        case "vest": {
          M.push(box(body, 0.55, 0.4, 0.33, tint, 0, 0.89, 0));
          M.push(box(body, 0.56, 0.05, 0.34, shade(tint, -26), 0, 0.8, 0)); // quilted seams
          M.push(box(body, 0.56, 0.05, 0.34, shade(tint, -26), 0, 0.98, 0));
          break;
        }
        case "leather": {
          M.push(box(body, 0.55, 0.4, 0.33, tint, 0, 0.89, 0));
          const s1 = box(body, 0.08, 0.46, 0.35, shade(tint, -32), -0.1, 0.9, 0); s1.rotation.z = 0.5; M.push(s1);
          const s2 = box(body, 0.08, 0.46, 0.35, shade(tint, -32), 0.1, 0.9, 0); s2.rotation.z = -0.5; M.push(s2);
          M.push(box(body, 0.66, 0.13, 0.32, shade(tint, -14), 0, 1.07, 0)); // mantle
          for (const a of [parts.armL, parts.armR])
            M.push(box(a, 0.15, 0.16, 0.17, shade(tint, -8), 0, -0.34, 0)); // bracers
          M.push(box(body, 0.14, 0.14, 0.1, shade(tint, -20), 0.18, 0.66, 0.16)); // belt pouch
          break;
        }
        case "mail": {
          M.push(box(body, 0.55, 0.4, 0.33, tint, 0, 0.89, 0));
          M.push(box(body, 0.4, 0.18, 0.3, shade(tint, -16), 0, 0.58, 0)); // mail skirt
          M.push(box(body, 0.66, 0.13, 0.32, shade(tint, -24), 0, 1.07, 0));
          for (const a of [parts.armL, parts.armR])
            M.push(box(a, 0.17, 0.26, 0.19, shade(tint, -8), 0, -0.12, 0)); // mail sleeves
          break;
        }
        case "plate": case "aegis": {
          M.push(box(body, 0.55, 0.4, 0.33, tint, 0, 0.89, 0));
          M.push(box(body, 0.07, 0.42, 0.345, shade(tint, 22), 0, 0.89, 0)); // center ridge
          M.push(box(body, 0.45, 0.1, 0.33, shade(tint, -18), 0, 0.66, 0));  // faulds
          for (const a of [parts.armL, parts.armR]) {
            M.push(box(a, 0.2, 0.16, 0.22, shade(tint, 10), 0, 0.02, 0));   // pauldron
            M.push(box(a, 0.16, 0.16, 0.18, shade(tint, -6), 0, -0.34, 0)); // gauntlet cuff
          }
          if (vis.model === "aegis") {
            const crest = box(body, 0.12, 0.12, 0.03, glow("#ffd23f"), 0, 0.92, 0.175);
            crest.rotation.z = Math.PI / 4; crest.castShadow = false; M.push(crest);
            for (const a of [parts.armL, parts.armR])
              M.push(cone(a, 0.05, 0.12, 4, "#ffd23f", 0, 0.13, 0)); // crowned pauldrons
          }
          break;
        }
        case "mantle": {
          M.push(box(body, 0.52, 0.07, 0.37, tint, 0, 1.09, -0.03));
          const cape = box(body, 0.5, 0.78, 0.05, shade(tint, -24), 0, 0.72, -0.22);
          cape.rotation.x = 0.1; M.push(cape);
          const trim = box(body, 0.5, 0.1, 0.052, glow("#ffb35a"), 0, 0.34, -0.255);
          trim.rotation.x = 0.1; trim.castShadow = false; M.push(trim);
          for (const sx of [-0.2, 0.2]) {
            const emb = box(body, 0.07, 0.07, 0.07, glow("#ff8a2a"), sx, 1.12, -0.02);
            emb.castShadow = false; M.push(emb);
          }
          break;
        }
      }
    }

    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    if (look.weaponTint) setWeaponTint(look.weaponTint);

    function setWalk(t, moving) {
      const s = moving ? Math.sin(t * 9) : 0;
      const sway = Math.sin(t * 1.7) * 0.04;
      if (parts.legL) { parts.legL.rotation.x = s * 0.75; parts.legR.rotation.x = -s * 0.75; }
      parts.armL.rotation.x = -s * 0.6;
      // the weapon arm swings shorter, keeping the blade under control
      parts.armR.rotation.x = s * (weapon ? 0.32 : 0.6) + (moving ? 0 : sway * 0.5);
      parts.armL.rotation.z = moving ? 0.07 : 0.05 + sway;
      parts.armR.rotation.z = (moving ? -0.07 : -0.05 - sway) - (weapon ? 0.05 : 0);
      // heel-strike bob + a touch of forward lean while striding
      body.position.y = moving ? Math.abs(Math.sin(t * 9)) * 0.045 : (sway + 0.04) * 0.3;
      body.rotation.x = moving ? 0.05 : 0;
    }

    return { group: g, inner: body, setWalk, setWeapon, setArmor, setWeaponTint, height: topY + 0.1 };
  }

  /* ============================================================
     ENEMIES — one builder per silhouette shape.
     Returns {group, animate(t, moving), height}
     ============================================================ */
  function buildEnemy(def) {
    const sp = def.sprite || { shape: "blob", body: "#888888" };
    const body = sp.body || "#888888";
    const accent = sp.accent || shade(body, -25);
    const eye = sp.eye || "#ffe24a";
    const g = new THREE.Group();
    let animate = function () {};
    let baseH = 1.0;

    switch (sp.shape) {
      case "blob": {
        const b = ball(g, 0.42, body, 0, 0.34, 0, 9, 7);
        b.scale.y = 0.8;
        const hl = ball(g, 0.2, shade(body, 30), -0.13, 0.46, 0.16, 7, 6);
        glowEyes(g, eye, 0.09, 0.4, 0.33, 0.05);
        baseH = 0.72;
        animate = (t) => {
          const sq = 1 + Math.sin(t * 3.2) * 0.07;
          b.scale.set(2 - sq, sq * 0.8, 2 - sq);
          hl.position.y = 0.46 * sq;
        };
        break;
      }
      case "rat": {
        const bod = ball(g, 0.3, body, 0, 0.24, -0.04, 9, 7);
        bod.scale.set(0.9, 0.75, 1.5);
        const head = ball(g, 0.17, body, 0, 0.23, 0.42, 8, 6);
        head.scale.set(0.85, 0.8, 1.2);
        cone(g, 0.02, 0.06, 4, accent, 0, 0.2, 0.62);
        ball(g, 0.07, accent, -0.1, 0.37, 0.42, 6, 5);
        ball(g, 0.07, accent, 0.1, 0.37, 0.42, 6, 5);
        glowEyes(g, eye, 0.07, 0.27, 0.55, 0.028);
        // tail segments
        const tail = new THREE.Group();
        for (let i = 0; i < 3; i++) {
          const seg = cyl(tail, 0.028 - i * 0.007, 0.034 - i * 0.007, 0.24, 5, accent, 0, 0, -0.1 - i * 0.2);
          seg.rotation.x = Math.PI / 2 - 0.35 - i * 0.25;
        }
        tail.position.set(0, 0.22, -0.42);
        g.add(tail);
        baseH = 0.55;
        animate = (t, moving) => {
          g.position.y = moving ? Math.abs(Math.sin(t * 13)) * 0.05 : 0;
          tail.rotation.y = Math.sin(t * 4) * 0.4;
        };
        break;
      }
      case "wolf": {
        const bod = box(g, 0.42, 0.4, 0.92, body, 0, 0.52, -0.05);
        box(g, 0.44, 0.3, 0.34, shade(body, 12), 0, 0.58, 0.32);
        box(g, 0.3, 0.28, 0.3, body, 0, 0.72, 0.56);
        box(g, 0.16, 0.13, 0.2, accent, 0, 0.64, 0.76);
        cone(g, 0.06, 0.16, 4, accent, -0.1, 0.92, 0.5);
        cone(g, 0.06, 0.16, 4, accent, 0.1, 0.92, 0.5);
        glowEyes(g, eye, 0.08, 0.75, 0.71, 0.035);
        const legs = [];
        for (const [lx, lz] of [[-0.14, 0.3], [0.14, 0.3], [-0.14, -0.36], [0.14, -0.36]]) {
          const leg = new THREE.Group(); leg.position.set(lx, 0.42, lz);
          box(leg, 0.11, 0.4, 0.12, shade(body, -18), 0, -0.2, 0);
          g.add(leg); legs.push(leg);
        }
        const tail = box(g, 0.1, 0.1, 0.36, shade(body, -10), 0, 0.62, -0.6);
        tail.rotation.x = -0.55;
        baseH = 1.0;
        animate = (t, moving) => {
          const s = moving ? Math.sin(t * 10) : 0;
          legs[0].rotation.x = s * 0.6; legs[3].rotation.x = s * 0.6;
          legs[1].rotation.x = -s * 0.6; legs[2].rotation.x = -s * 0.6;
          bod.position.y = 0.52 + (moving ? Math.abs(Math.sin(t * 10)) * 0.03 : Math.sin(t * 1.8) * 0.012);
          tail.rotation.x = -0.55 + Math.sin(t * 3) * 0.15;
        };
        break;
      }
      case "imp": {
        const bod = box(g, 0.32, 0.4, 0.24, body, 0, 0.52, 0);
        const head = ball(g, 0.18, body, 0, 0.85, 0, 9, 7);
        cone(g, 0.05, 0.18, 4, accent, -0.11, 1.02, 0);
        cone(g, 0.05, 0.18, 4, accent, 0.11, 1.02, 0);
        glowEyes(g, eye, 0.07, 0.88, 0.15, 0.04);
        box(g, 0.1, 0.24, 0.11, shade(body, -22), -0.09, 0.2, 0);
        box(g, 0.1, 0.24, 0.11, shade(body, -22), 0.09, 0.2, 0);
        box(g, 0.09, 0.26, 0.1, shade(body, -12), -0.21, 0.5, 0).rotation.z = 0.25;
        box(g, 0.09, 0.26, 0.1, shade(body, -12), 0.21, 0.5, 0).rotation.z = -0.25;
        const wL = tri(g, [0, 0, 0], [-0.36, 0.26, -0.06], [-0.26, -0.08, -0.08], shade(body, -32));
        const wR = tri(g, [0, 0, 0], [0.36, 0.26, -0.06], [0.26, -0.08, -0.08], shade(body, -32));
        wL.position.set(-0.14, 0.66, -0.12); wR.position.set(0.14, 0.66, -0.12);
        baseH = 1.1;
        animate = (t) => {
          g.position.y = Math.abs(Math.sin(t * 5)) * 0.07;
          wL.rotation.y = Math.sin(t * 9) * 0.45;
          wR.rotation.y = -Math.sin(t * 9) * 0.45;
        };
        break;
      }
      case "ghost": {
        const mat = new THREE.MeshLambertMaterial({ color: body, transparent: true, opacity: 0.72 });
        const skirt = cyl(g, 0.34, 0.16, 0.62, 8, mat, 0, 0.55, 0);
        skirt.material = mat; skirt.castShadow = false;
        const head = ball(g, 0.32, mat, 0, 0.92, 0, 10, 8);
        head.material = mat; head.castShadow = false;
        const wisps = [];
        for (let i = 0; i < 4; i++) {
          const w = ball(g, 0.09, mat, -0.24 + i * 0.16, 0.22, 0.05, 6, 5);
          w.material = mat; w.castShadow = false; wisps.push(w);
        }
        glowEyes(g, eye, 0.1, 0.96, 0.27, 0.05);
        baseH = 1.25;
        animate = (t) => {
          g.position.y = 0.1 + Math.sin(t * 2.2) * 0.07;
          wisps.forEach((w, i) => { w.position.y = 0.22 + Math.sin(t * 4 + i * 1.5) * 0.05; });
        };
        break;
      }
      case "robed": {
        cyl(g, 0.28, 0.5, 1.15, 7, body, 0, 0.58, 0);
        cyl(g, 0.51, 0.52, 0.09, 7, shade(body, -30), 0, 0.08, 0);
        box(g, 0.56, 0.16, 0.32, shade(body, -8), 0, 1.12, 0);
        ball(g, 0.2, "#0d1217", 0, 1.34, 0.02, 8, 6);
        box(g, 0.42, 0.36, 0.38, body, 0, 1.38, -0.05);
        box(g, 0.44, 0.3, 0.14, body, 0, 1.12, -0.18);
        glowEyes(g, eye, 0.08, 1.34, 0.14, 0.045);
        box(g, 0.13, 0.36, 0.15, shade(body, -14), -0.32, 0.92, 0).rotation.z = 0.2;
        box(g, 0.13, 0.36, 0.15, shade(body, -14), 0.32, 0.92, 0).rotation.z = -0.2;
        baseH = 1.6;
        animate = (t) => { g.position.y = Math.sin(t * 1.9) * 0.02; };
        break;
      }
      case "insect": {
        const shell = ball(g, 0.44, body, 0, 0.3, 0, 10, 8);
        shell.scale.set(0.95, 0.6, 1.25);
        const shine = ball(g, 0.3, shade(body, 24), -0.08, 0.4, -0.1, 8, 6);
        shine.scale.set(0.7, 0.4, 0.9);
        const head = ball(g, 0.17, accent, 0, 0.24, 0.5, 8, 6);
        glowEyes(g, eye, 0.07, 0.3, 0.62, 0.035);
        const legs = [];
        for (let i = -1; i <= 1; i++) {
          for (const side of [-1, 1]) {
            const leg = cyl(g, 0.022, 0.028, 0.46, 4, shade(body, -30), side * 0.38, 0.22, i * 0.26);
            leg.rotation.z = side * 1.1;
            legs.push(leg);
          }
        }
        baseH = 0.7;
        animate = (t, moving) => {
          shell.position.y = 0.3 + Math.sin(t * 3) * 0.015;
          if (moving) legs.forEach((l, i) => { l.rotation.x = Math.sin(t * 14 + i * 1.1) * 0.3; });
        };
        break;
      }
      case "knight": {
        const h = buildHumanoid({
          skin: accent, shirt: body, pants: shade(body, -22),
          hat: "helm", plume: sp.plume || "#c43e0c", weaponTint: "#cfd6dd"
        });
        // breastplate sheen + glowing visor eyes (on the inner body so they bob with the gait)
        box(h.inner, 0.56, 0.2, 0.34, shade(body, 26), 0, 0.9, 0);
        glowEyes(h.inner, eye, 0.075, 1.36, 0.2, 0.04);
        g.add(h.group);
        baseH = h.height;
        animate = (t, moving) => h.setWalk(t, moving);
        break;
      }
      case "serpent": {
        const segs = [];
        for (let i = 0; i < 7; i++) {
          const r = 0.16 - i * 0.013;
          const s = ball(g, r, i === 0 ? shade(body, 10) : body, 0, r + 0.02, 0.55 - i * 0.21, 8, 6);
          segs.push(s);
        }
        segs[0].scale.set(1.25, 1, 1.3);
        glowEyes(g, eye, 0.07, 0.34, 0.74, 0.032);
        cone(g, 0.012, 0.1, 3, "#c03030", 0, 0.26, 0.78).rotation.x = Math.PI / 2;
        baseH = 0.7;
        animate = (t) => {
          segs.forEach((s, i) => {
            s.position.x = Math.sin(i * 0.9 - t * 3.4) * 0.16 * (i > 0 ? 1 : 0.4);
            if (i === 0) s.position.y = 0.3 + Math.sin(t * 2.4) * 0.04;
          });
        };
        break;
      }
      case "sentinel": {
        box(g, 0.78, 0.22, 0.6, shade(body, -18), 0, 0.11, 0);
        box(g, 0.62, 1.85, 0.46, body, 0, 1.12, 0);
        box(g, 0.68, 0.14, 0.52, shade(body, 24), 0, 2.06, 0);
        box(g, 0.4, 0.46, 0.1, "#15120c", 0, 1.32, 0.2);
        const core = ball(g, 0.15, glow(accent), 0, 1.32, 0.22, 8, 6);
        core.castShadow = false;
        const halo = makeGlowSprite(accent, 1.1, 0.55);
        halo.position.set(0, 1.32, 0.25);
        g.add(halo);
        baseH = 2.2;
        animate = (t) => {
          const p = 1 + Math.sin(t * 4.2) * 0.22;
          core.scale.setScalar(p);
          halo.material.opacity = 0.4 + Math.sin(t * 4.2) * 0.18;
        };
        break;
      }
      case "wisp": {
        const core = ball(g, 0.26, glow("#ffffff"), 0, 0.85, 0, 10, 8);
        core.castShadow = false;
        const shellM = new THREE.MeshBasicMaterial({ color: body, transparent: true, opacity: 0.5 });
        const shell = ball(g, 0.38, shellM, 0, 0.85, 0, 10, 8);
        shell.castShadow = false;
        const halo = makeGlowSprite(body, 2.2, 0.8);
        halo.position.y = 0.85;
        g.add(halo);
        baseH = 1.35;
        animate = (t) => {
          g.position.y = Math.sin(t * 2) * 0.12;
          shell.scale.setScalar(1 + Math.sin(t * 3.4) * 0.12);
          halo.material.opacity = 0.6 + Math.sin(t * 3.4) * 0.2;
        };
        break;
      }
      case "gargoyle": {
        box(g, 0.52, 0.56, 0.34, body, 0, 0.74, 0);
        box(g, 0.6, 0.14, 0.36, shade(body, 14), 0, 0.98, 0);
        ball(g, 0.2, body, 0, 1.22, 0.02, 8, 7);
        cone(g, 0.05, 0.17, 4, accent, -0.12, 1.41, 0);
        cone(g, 0.05, 0.17, 4, accent, 0.12, 1.41, 0);
        glowEyes(g, eye, 0.08, 1.24, 0.17, 0.04);
        box(g, 0.15, 0.34, 0.16, shade(body, -20), -0.14, 0.24, 0);
        box(g, 0.15, 0.34, 0.16, shade(body, -20), 0.14, 0.24, 0);
        const wL = tri(g, [0, 0, 0], [-0.62, 0.5, -0.12], [-0.5, -0.05, -0.16], shade(body, -25));
        const wR = tri(g, [0, 0, 0], [0.62, 0.5, -0.12], [0.5, -0.05, -0.16], shade(body, -25));
        wL.position.set(-0.2, 0.9, -0.16); wR.position.set(0.2, 0.9, -0.16);
        baseH = 1.55;
        animate = (t) => {
          wL.rotation.y = 0.15 + Math.sin(t * 2.6) * 0.25;
          wR.rotation.y = -0.15 - Math.sin(t * 2.6) * 0.25;
          g.position.y = Math.sin(t * 2.6) * 0.03;
        };
        break;
      }
      case "sprite": {
        const oct = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), glow(accent));
        oct.position.y = 0.8; oct.castShadow = false;
        g.add(oct);
        const core = ball(g, 0.12, glow("#ffffff"), 0, 0.8, 0, 7, 6);
        core.castShadow = false;
        const halo = makeGlowSprite(accent, 1.4, 0.7);
        halo.position.y = 0.8;
        g.add(halo);
        baseH = 1.2;
        animate = (t) => {
          oct.rotation.y = t * 2.4;
          oct.rotation.x = Math.sin(t * 1.4) * 0.4;
          g.position.y = Math.sin(t * 2.8) * 0.1;
        };
        break;
      }
      default: {
        ball(g, 0.4, body, 0, 0.4, 0, 9, 7);
        baseH = 0.8;
      }
    }

    const scale = (sp.scale || 1) * 0.95;
    g.scale.setScalar(scale);

    if (sp.crown) addCrown(g, baseH + 0.04);
    if (sp.aura) {
      const a = parseAura(sp.aura);
      const s = makeGlowSprite(a.color, 2.6, Math.min(0.65, a.alpha * 2.4));
      s.position.y = baseH * 0.45;
      g.add(s);
    }

    return { group: g, animate, height: (baseH + (sp.crown ? 0.3 : 0)) * scale };
  }

  function glowEyes(parent, color, dx, y, z, r) {
    const m = glow(color);
    const e1 = ball(parent, r, m, -dx, y, z, 5, 4); e1.material = m; e1.castShadow = false;
    const e2 = ball(parent, r, m, dx, y, z, 5, 4); e2.material = m; e2.castShadow = false;
  }

  /* ============================================================
     PORTRAITS — offscreen WebGL rig blitted into 2D canvases.
     Overrides Sprites.drawNPCInto / drawEnemyInto / drawPlayerInto.
     ============================================================ */
  const P = { renderer: null, scene: null, cam: null, holder: null };
  function ensureRig() {
    if (P.renderer) return;
    P.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    P.renderer.setSize(360, 360);
    P.renderer.setClearColor(0x000000, 0);
    P.scene = new THREE.Scene();
    P.cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    P.scene.add(new THREE.HemisphereLight(0xfff0dc, 0x4a3a2c, 0.95));
    const key = new THREE.DirectionalLight(0xffe2bb, 0.95);
    key.position.set(1.6, 2.6, 2.2);
    P.scene.add(key);
    const rim = new THREE.DirectionalLight(0x8aa6ff, 0.55);
    rim.position.set(-2, 1.2, -2.4);
    P.scene.add(rim);
    P.holder = new THREE.Group();
    P.scene.add(P.holder);
  }

  function blit(canvas) {
    // up-res target canvas once, keeping its on-screen CSS size
    if (!canvas.dataset.hd) {
      canvas.dataset.hd = "1";
      if (!canvas.style.width) {
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
      }
      canvas.width = 360; canvas.height = 360;
    }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(P.renderer.domElement, 0, 0, canvas.width, canvas.height);
  }

  function renderInto(canvas, group, height, yaw) {
    ensureRig();
    while (P.holder.children.length) P.holder.remove(P.holder.children[0]);
    P.holder.add(group);
    group.rotation.y = yaw == null ? -0.32 : yaw;
    const h = Math.max(0.8, height || 1.7);
    P.cam.position.set(0, h * 0.62, h * 1.85);
    P.cam.lookAt(0, h * 0.46, 0);
    P.renderer.render(P.scene, P.cam);
    blit(canvas);
  }

  // cache models per-canvas so animated portraits don't rebuild
  const portraitCache = new WeakMap();
  function cached(canvas, key, build) {
    let e = portraitCache.get(canvas);
    if (!e || e.key !== key) {
      e = { key, model: build() };
      portraitCache.set(canvas, e);
    }
    return e.model;
  }

  Sprites.drawNPCInto = function (canvas, npc) {
    const model = cached(canvas, "npc:" + npc.id, () => buildHumanoid(npc.look));
    renderInto(canvas, model.group, model.height);
  };
  Sprites.drawEnemyInto = function (canvas, def) {
    const model = cached(canvas, "enemy:" + def.id, () => buildEnemy(def));
    model.animate(performance.now() / 1000, false);
    renderInto(canvas, model.group, Math.max(model.height, 1.1));
  };
  Sprites.drawPlayerInto = function (canvas, appearance) {
    const model = cached(canvas, "pl:" + JSON.stringify(appearance), () => buildHumanoid(appearance));
    renderInto(canvas, model.group, model.height);
  };

  return { buildHumanoid, buildEnemy, makeGlowSprite, glowTexture, parseAura };
})();
