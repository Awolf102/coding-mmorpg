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
     HUMANOID — blocky MMO style, ~1.6 units tall.
     look: {skin, hair, hairStyle 0..3, shirt, pants, robe,
            hat (wizard|hood|crown|helm), hatColor, plume, weaponTint}
     ============================================================ */
  function buildHumanoid(look) {
    look = look || {};
    const skin = look.skin || "#d8a878";
    const g = new THREE.Group();
    const parts = { armL: null, armR: null, legL: null, legR: null, torso: null };

    if (look.robe) {
      const robe = look.robe;
      cyl(g, 0.27, 0.46, 1.0, 7, robe, 0, 0.52, 0);
      cyl(g, 0.47, 0.475, 0.09, 7, shade(robe, -30), 0, 0.085, 0);
      box(g, 0.52, 0.16, 0.3, shade(robe, -8), 0, 0.99, 0);
      // arms (sleeves)
      parts.armL = new THREE.Group(); parts.armL.position.set(-0.31, 0.93, 0);
      parts.armR = new THREE.Group(); parts.armR.position.set(0.31, 0.93, 0);
      for (const a of [parts.armL, parts.armR]) {
        box(a, 0.14, 0.34, 0.16, shade(robe, -14), 0, -0.15, 0);
        box(a, 0.115, 0.16, 0.13, skin, 0, -0.39, 0);
        g.add(a);
      }
    } else {
      const shirt = look.shirt || "#7a3000";
      const pants = look.pants || "#3a2c18";
      // legs
      parts.legL = new THREE.Group(); parts.legL.position.set(-0.115, 0.47, 0);
      parts.legR = new THREE.Group(); parts.legR.position.set(0.115, 0.47, 0);
      for (const l of [parts.legL, parts.legR]) {
        box(l, 0.17, 0.36, 0.19, pants, 0, -0.18, 0);
        box(l, 0.18, 0.13, 0.22, "#2a2118", 0, -0.41, 0.012);
        g.add(l);
      }
      // torso + belt
      parts.torso = box(g, 0.46, 0.52, 0.27, shirt, 0, 0.73, 0);
      box(g, 0.48, 0.07, 0.29, "#2a2118", 0, 0.5, 0);
      box(g, 0.07, 0.07, 0.3, "#c8a04a", 0, 0.5, 0);
      // shoulders
      box(g, 0.56, 0.1, 0.28, shade(shirt, -18), 0, 0.95, 0);
      // arms
      parts.armL = new THREE.Group(); parts.armL.position.set(-0.3, 0.93, 0);
      parts.armR = new THREE.Group(); parts.armR.position.set(0.3, 0.93, 0);
      for (const a of [parts.armL, parts.armR]) {
        box(a, 0.13, 0.32, 0.15, shade(shirt, -14), 0, -0.14, 0);
        box(a, 0.11, 0.18, 0.13, skin, 0, -0.38, 0);
        g.add(a);
      }
    }

    // head + neck
    box(g, 0.13, 0.08, 0.13, skin, 0, 1.0, 0);
    box(g, 0.34, 0.32, 0.32, skin, 0, 1.18, 0);

    // face (skip when full helm)
    if (look.hat !== "helm") {
      box(g, 0.05, 0.055, 0.02, "#20140c", -0.075, 1.2, 0.165);
      box(g, 0.05, 0.055, 0.02, "#20140c", 0.075, 1.2, 0.165);
    }

    // hair
    const hc = look.hair || "#3a2412";
    const style = look.hairStyle == null ? 0 : look.hairStyle;
    if (style !== 3 && look.hat !== "helm") {
      box(g, 0.37, 0.09, 0.36, hc, 0, 1.33, -0.005);
      box(g, 0.37, 0.1, 0.06, hc, 0, 1.3, 0.15);
      box(g, 0.37, 0.2, 0.07, hc, 0, 1.22, -0.15); // hugs the back of the head
      if (style === 1) { // long
        box(g, 0.37, 0.42, 0.09, hc, 0, 1.12, -0.17);
        box(g, 0.07, 0.3, 0.3, hc, -0.165, 1.16, -0.02);
        box(g, 0.07, 0.3, 0.3, hc, 0.165, 1.16, -0.02);
      }
      if (style === 2) { // wild
        box(g, 0.16, 0.14, 0.16, hc, -0.1, 1.43, 0.04).rotation.z = 0.4;
        box(g, 0.14, 0.16, 0.14, hc, 0.09, 1.45, -0.06).rotation.z = -0.35;
        box(g, 0.12, 0.13, 0.12, hc, 0.02, 1.46, 0.09).rotation.x = 0.3;
      }
    }

    // hats
    let topY = 1.52;
    const hcol = look.hatColor || "#3a3270";
    if (look.hat === "wizard") {
      cyl(g, 0.36, 0.36, 0.05, 8, hcol, 0, 1.345, 0);
      const c = cone(g, 0.26, 0.58, 8, hcol, 0.02, 1.64, 0);
      c.rotation.z = -0.1;
      topY = 1.95;
    } else if (look.hat === "hood") {
      box(g, 0.4, 0.36, 0.36, hcol, 0, 1.21, -0.035);
      box(g, 0.42, 0.26, 0.12, hcol, 0, 1.0, -0.16);
      box(g, 0.07, 0.34, 0.34, hcol, -0.185, 1.16, -0.02);
      box(g, 0.07, 0.34, 0.34, hcol, 0.185, 1.16, -0.02);
      topY = 1.45;
    } else if (look.hat === "crown") {
      addCrown(g, 1.4);
      topY = 1.62;
    } else if (look.hat === "helm") {
      box(g, 0.38, 0.36, 0.36, "#98a1ab", 0, 1.19, 0);
      box(g, 0.31, 0.05, 0.025, "#15120c", 0, 1.2, 0.18);
      box(g, 0.06, 0.13, 0.05, "#7d858e", 0, 1.1, 0.18);
      if (look.plume) {
        box(g, 0.05, 0.16, 0.26, look.plume, 0, 1.45, -0.04);
        box(g, 0.05, 0.13, 0.18, look.plume, 0, 1.36, -0.22);
      }
      topY = 1.55;
    }

    // weapon (right hand)
    let weapon = null, bladeMat = null;
    function setWeaponTint(tint) {
      if (!tint) { if (weapon) { g.remove(weapon); weapon = null; } return; }
      if (!weapon) {
        weapon = new THREE.Group();
        bladeMat = new THREE.MeshLambertMaterial({ color: tint, emissive: new THREE.Color(tint).multiplyScalar(0.22) });
        const blade = box(weapon, 0.055, 0.6, 0.028, bladeMat, 0, 0.47, 0);
        blade.material = bladeMat;
        cone(weapon, 0.04, 0.09, 4, bladeMat, 0, 0.8, 0).material = bladeMat;
        box(weapon, 0.17, 0.05, 0.06, "#b08d4f", 0, 0.14, 0);
        box(weapon, 0.05, 0.16, 0.05, "#5a3f1d", 0, 0.04, 0);
        ball(weapon, 0.04, "#d8b75a", 0, -0.05, 0, 6, 5);
        weapon.position.set(0.36, 0.42, 0.05);
        weapon.rotation.z = -0.14;
        g.add(weapon);
      } else {
        bladeMat.color.set(tint);
        bladeMat.emissive.set(tint).multiplyScalar(0.22);
      }
    }
    if (look.weaponTint) setWeaponTint(look.weaponTint);

    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });

    function setWalk(t, moving) {
      const s = moving ? Math.sin(t * 9) : 0;
      const sway = Math.sin(t * 1.7) * 0.04;
      if (parts.legL) { parts.legL.rotation.x = s * 0.7; parts.legR.rotation.x = -s * 0.7; }
      parts.armL.rotation.x = -s * 0.55;
      parts.armR.rotation.x = s * 0.55 + (moving ? 0 : sway * 0.5);
      parts.armL.rotation.z = moving ? 0.06 : 0.05 + sway;
      parts.armR.rotation.z = moving ? -0.06 : -0.05 - sway;
    }

    return { group: g, setWalk, setWeaponTint, height: topY + 0.1 };
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
        // breastplate sheen + glowing visor eyes
        box(h.group, 0.5, 0.2, 0.3, shade(body, 26), 0, 0.88, 0);
        glowEyes(h.group, eye, 0.075, 1.2, 0.185, 0.04);
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
