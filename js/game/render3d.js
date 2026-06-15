/* ============================================================
   Renderer (3D) — low-poly MMO world built from the tile maps:
   vertex-painted terrain, merged static props, animated water
   and lava, per-act atmosphere, entity rigs with nameplates,
   orbit camera, picking, and the classic 2D minimap.
   Public API matches the old 2D renderer:
   init, setMap, frame, solidAt, eventToTile, entityAtEvent.
   ============================================================ */
window.Renderer = (function () {
  const T = Sprites.TILE;          // px per tile (game logic units)
  const hash = Sprites.hash;

  let canvas, renderer, scene, camera;
  let hemi, sun, sunTarget, skyMat;
  let map = null, W = 0, H = 0;
  let worldGroup = null;           // everything map-specific
  let terrainMesh = null, heights = null;
  let waterMat = null, lavaMat = null;
  let flames = [], portals = [], particles = null;
  let rigs = new Map();            // entity object -> rig
  let playerRig = null, playerKey = "";
  let clickRing = null, playerLight = null;
  let mini, miniCtx, miniBase = null, miniTimer = 0;
  const orbit = { yaw: 0, pitch: 0.96, dist: 11.5 };
  const camTarget = new THREE.Vector3();
  let lastT = 0;
  const raycaster = new THREE.Raycaster();
  const mouseNdc = new THREE.Vector2();

  /* ---------------- per-act environments ---------------- */
  const ENVS = {
    1: { skyTop: 0x5e9fd8, skyHor: 0xf2d8a8, fog: 0xc9bd96, fogN: 26, fogF: 66,
         hemiSky: 0xfff2da, hemiGnd: 0x6a5a40, hemiI: 0.78, sunC: 0xffeac2, sunI: 1.0,
         sunDir: [-0.55, 1, 0.4], water: [0x2c6b94, 0x67a8c8], particle: "pollen" },
    2: { skyTop: 0x5b88b8, skyHor: 0xc2d49a, fog: 0x9db387, fogN: 16, fogF: 50,
         hemiSky: 0xeaf2cf, hemiGnd: 0x42523a, hemiI: 0.7, sunC: 0xf2ffd9, sunI: 0.85,
         sunDir: [-0.4, 1, 0.55], water: [0x29586c, 0x4e8b8c], particle: "fireflies" },
    3: { skyTop: 0x2e3c5e, skyHor: 0x7787a6, fog: 0x46536e, fogN: 19, fogF: 58,
         hemiSky: 0x97aece, hemiGnd: 0x2c3846, hemiI: 0.48, sunC: 0x9cb9e8, sunI: 0.55,
         sunDir: [0.6, 0.7, 0.3], water: [0x14324a, 0x356784], particle: "mist" },
    4: { skyTop: 0x453d4d, skyHor: 0x9a7860, fog: 0x76665e, fogN: 14, fogF: 46,
         hemiSky: 0xdcc2b0, hemiGnd: 0x3e332d, hemiI: 0.62, sunC: 0xffd1a1, sunI: 0.72,
         sunDir: [0.5, 0.8, -0.4], water: [0x1f3a50, 0x3a627e], particle: "ash" },
    5: { skyTop: 0x170a0b, skyHor: 0x5c2410, fog: 0x3c1407, fogN: 11, fogF: 36,
         hemiSky: 0xff9a60, hemiGnd: 0x280d07, hemiI: 0.55, sunC: 0xff8244, sunI: 0.62,
         sunDir: [-0.3, 1, -0.5], water: [0x2c6b94, 0x67a8c8], particle: "embers" }
  };

  /* ---------------- terrain palette ---------------- */
  const GROUND = {
    g: "#5d8a3f", G: "#3f672c", p: "#a48d58", d: "#7c6945", s: "#cdb87e",
    S: "#8b8674", c: "#6f6b5c", m: "#566036", b: "#8a6a3e",
    w: "#1d4866", l: "#2a0a03", x: "#070605",
    a: "#564a3c", e: "#5d5246", "*": "#5d8a3f"
  };
  const PROPCH = "trfhRDWPFCoMLABYOun+iTQkjq^"; // solid props standing on ground
  const NATURAL = "gGdsmtrfae*T^q+";            // gets bigger height noise

  /* per-map building & dressing palette (overridable via map.theme) */
  const DEFAULT_THEME = {
    wall: "#71716f", wall2: "#84847e", trim: "#54544e",
    roof: "#7c4030", roof2: "#94503a", roofTrim: "#5e2f22", ridge: "#54281c",
    door: "#553718", door2: "#6b4a22",
    banner: "#7a2030", canvas: "#6a6a52", rune: "#ffb35a", crystal: "#7be0ff"
  };
  let TH = DEFAULT_THEME;

  /* props inherit the dominant walkable ground around them, so a charred
     tree in an ash field sits on ash, not on the map's default grass */
  let groundGrid = null;
  function resolveGround(x, y) {
    const ch = tileAt(x, y);
    if (!PROPCH.includes(ch)) return GROUND[ch] || GROUND[map.walk] || GROUND.g;
    const counts = {};
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]) {
      const nch = tileAt(x + dx, y + dy);
      if (PROPCH.includes(nch) || "wlxb".includes(nch) || !GROUND[nch]) continue;
      counts[nch] = (counts[nch] || 0) + 1;
    }
    let best = null, bestN = 0;
    for (const k in counts) if (counts[k] > bestN) { best = k; bestN = counts[k]; }
    return GROUND[best || map.walk] || GROUND.g;
  }
  function buildGroundGrid() {
    groundGrid = [];
    for (let y = 0; y < H; y++) {
      const row = [];
      for (let x = 0; x < W; x++) row.push(resolveGround(x, y));
      groundGrid.push(row);
    }
  }
  function groundColorAt(x, y) {
    if (x < 0) x = 0; if (y < 0) y = 0;
    if (x >= W) x = W - 1; if (y >= H) y = H - 1;
    return groundGrid[y][x];
  }
  function baseHeight(ch) {
    if (ch === "w") return -0.5;
    if (ch === "l") return -0.42;
    if (ch === "x") return -0.85;
    if (ch === "m") return -0.07;
    return 0;
  }
  function tileAt(x, y) {
    if (x < 0) x = 0; if (y < 0) y = 0;
    if (x >= W) x = W - 1; if (y >= H) y = H - 1;
    return map.tiles[y][x];
  }

  /* ============================================================ */
  function init() {
    canvas = document.getElementById("game-canvas");
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.5, 220);

    hemi = new THREE.HemisphereLight(0xfff2da, 0x6a5a40, 0.8);
    scene.add(hemi);
    sun = new THREE.DirectionalLight(0xffeac2, 1.0);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -22; sun.shadow.camera.right = 22;
    sun.shadow.camera.top = 22; sun.shadow.camera.bottom = -22;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 90;
    sun.shadow.bias = -0.0015;
    sunTarget = new THREE.Object3D();
    scene.add(sunTarget);
    sun.target = sunTarget;
    scene.add(sun);

    // sky dome (vertical gradient, follows the camera)
    const skyGeo = new THREE.SphereGeometry(120, 16, 10);
    skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { uTop: { value: new THREE.Color(0x5e9fd8) }, uHor: { value: new THREE.Color(0xf2d8a8) } },
      vertexShader: "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: "uniform vec3 uTop; uniform vec3 uHor; varying vec3 vP; void main(){ float h = clamp(normalize(vP).y*1.6, 0.0, 1.0); gl_FragColor = vec4(mix(uHor, uTop, pow(h,0.8)), 1.0); }"
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.renderOrder = -10;
    sky.name = "sky";
    scene.add(sky);

    // click marker ring
    clickRing = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(0.3, 0.42, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe24a, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    clickRing.add(ring);
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), ringMat.clone());
    dot.rotation.x = -Math.PI / 2;
    dot.position.y = 0.005;
    clickRing.add(dot);
    clickRing.visible = false;
    scene.add(clickRing);

    // warm glow that follows the player (the Mark of the Flame)
    playerLight = new THREE.PointLight(0xffb070, 0.4, 7, 2);
    scene.add(playerLight);

    mini = document.getElementById("minimap");
    miniCtx = mini.getContext("2d");

    bindCameraControls();
    window.addEventListener("resize", fit);
    fit();
  }

  function fit() {
    if (!renderer) return;
    const wrap = document.getElementById("viewport");
    const w = wrap.clientWidth || 960, h = wrap.clientHeight || 600;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* ---------------- camera controls ---------------- */
  function bindCameraControls() {
    let dragging = false, lx = 0, ly = 0;
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 1 || e.button === 2) { dragging = true; lx = e.clientX; ly = e.clientY; e.preventDefault(); }
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      orbit.yaw -= (e.clientX - lx) * 0.0065;
      orbit.pitch = Math.max(0.42, Math.min(1.42, orbit.pitch + (e.clientY - ly) * 0.005));
      lx = e.clientX; ly = e.clientY;
    });
    window.addEventListener("mouseup", () => { dragging = false; });
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      orbit.dist = Math.max(5.5, Math.min(20, orbit.dist * (e.deltaY > 0 ? 1.1 : 0.91)));
    }, { passive: false });
  }

  // rotate a cardinal key direction by the camera yaw (camera-relative WASD)
  function remapDir(d) {
    const fwd = Math.atan2(-Math.sin(orbit.yaw), -Math.cos(orbit.yaw)); // angle of "away from camera"
    let ang = fwd;
    if (d.f === "down") ang = fwd + Math.PI;
    else if (d.f === "right") ang = fwd - Math.PI / 2;
    else if (d.f === "left") ang = fwd + Math.PI / 2;
    const snapped = Math.round(ang / (Math.PI / 2)) * (Math.PI / 2);
    const dx = Math.round(Math.sin(snapped)), dy = Math.round(Math.cos(snapped));
    const f = dx === 1 ? "right" : dx === -1 ? "left" : dy === 1 ? "down" : "up";
    return { dx, dy, f };
  }

  /* ============================================================
     MAP BUILD
     ============================================================ */
  function setMap(m) {
    map = m;
    W = m.tiles[0].length; H = m.tiles.length;
    if (worldGroup) {
      scene.remove(worldGroup);
      worldGroup.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material && o.material.map && o.material.map !== Models3D.glowTexture()) o.material.map.dispose && o.material.map.dispose();
      });
    }
    rigs = new Map();
    playerRig = null; playerKey = "";
    flames = []; portals = []; particles = null;
    worldGroup = new THREE.Group();
    scene.add(worldGroup);

    TH = Object.assign({}, DEFAULT_THEME, m.theme || {});
    buildHeights();
    buildGroundGrid();
    worldGroup.add(buildTerrain());
    buildLiquids();
    buildProps();
    buildPortals();
    applyEnv(ENVS[m.act] || ENVS[1]);
    buildParticles((ENVS[m.act] || ENVS[1]).particle);
    buildMinimapBase();

    const sp = m.spawn;
    camTarget.set(sp.x + 0.5, 0, sp.y + 0.5);
    document.getElementById("map-name").textContent = m.name;
  }

  function applyEnv(env) {
    scene.fog = new THREE.Fog(env.fog, env.fogN, env.fogF);
    hemi.color.set(env.hemiSky); hemi.groundColor.set(env.hemiGnd); hemi.intensity = env.hemiI;
    sun.color.set(env.sunC); sun.intensity = env.sunI;
    sun.userData.dir = new THREE.Vector3(env.sunDir[0], env.sunDir[1], env.sunDir[2]).normalize();
    skyMat.uniforms.uTop.value.set(env.skyTop);
    skyMat.uniforms.uHor.value.set(env.skyHor);
  }

  /* corner heights with smoothing + noise */
  function buildHeights() {
    heights = new Float32Array((W + 1) * (H + 1));
    for (let cy = 0; cy <= H; cy++) {
      for (let cx = 0; cx <= W; cx++) {
        const adj = [tileAt(cx - 1, cy - 1), tileAt(cx, cy - 1), tileAt(cx - 1, cy), tileAt(cx, cy)];
        if (adj.includes("b")) { heights[cy * (W + 1) + cx] = 0; continue; }
        let sum = 0;
        for (const ch of adj) sum += baseHeight(ch);
        let amp = adj.every((ch) => NATURAL.includes(ch)) ? 0.22 : 0.045;
        if (adj.some((ch) => "wlx".includes(ch))) amp = 0.03;
        heights[cy * (W + 1) + cx] = sum / 4 + (hash(cx * 3 + 7, cy * 5 + 3) - 0.5) * amp;
      }
    }
  }

  function cornerH(cx, cy) { return heights[cy * (W + 1) + cx]; }

  function heightAt(wx, wz) {
    if (!heights) return 0;
    const x = Math.max(0, Math.min(W - 0.001, wx)), z = Math.max(0, Math.min(H - 0.001, wz));
    const x0 = Math.floor(x), z0 = Math.floor(z);
    const fx = x - x0, fz = z - z0;
    const h00 = cornerH(x0, z0), h10 = cornerH(x0 + 1, z0), h01 = cornerH(x0, z0 + 1), h11 = cornerH(x0 + 1, z0 + 1);
    return (h00 * (1 - fx) + h10 * fx) * (1 - fz) + (h01 * (1 - fx) + h11 * fx) * fz;
  }

  function buildTerrain() {
    const pos = [], col = [], idx = [];
    const c = new THREE.Color(), cc = new THREE.Color();
    for (let cy = 0; cy <= H; cy++) {
      for (let cx = 0; cx <= W; cx++) {
        pos.push(cx, cornerH(cx, cy), cy);
        // corner color = average of adjacent tile colors + gentle patchiness
        c.setRGB(0, 0, 0);
        const adj = [groundColorAt(cx - 1, cy - 1), groundColorAt(cx, cy - 1), groundColorAt(cx - 1, cy), groundColorAt(cx, cy)];
        for (const col of adj) { cc.set(col); c.r += cc.r / 4; c.g += cc.g / 4; c.b += cc.b / 4; }
        const v = 0.9 + hash(cx, cy) * 0.2;
        const patch = 0.94 + hash(cx >> 2, cy >> 2) * 0.12;
        col.push(c.r * v * patch, c.g * v * patch, c.b * v * patch);
      }
    }
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const a = y * (W + 1) + x, b = a + 1, d = a + W + 1, e = d + 1;
        idx.push(a, d, b, b, d, e);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    geo.setIndex(idx);
    /* shatter into facets: flat-shaded triangles with mostly per-face color,
       so the ground reads as deliberately low-poly as the models standing on it */
    const flat = geo.toNonIndexed();
    const ca = flat.attributes.color;
    for (let i = 0; i < ca.count; i += 3) {
      const f = i / 3;
      const j = 0.93 + hash(f * 7 + 1, f * 13 + 5) * 0.14;
      const r = ((ca.getX(i) + ca.getX(i + 1) + ca.getX(i + 2)) / 3) * j;
      const g = ((ca.getY(i) + ca.getY(i + 1) + ca.getY(i + 2)) / 3) * j;
      const b = ((ca.getZ(i) + ca.getZ(i + 1) + ca.getZ(i + 2)) / 3) * j;
      for (let k = i; k < i + 3; k++) {
        // keep a whisper of the corner gradient so zone borders still blend
        ca.setXYZ(k, ca.getX(k) * 0.25 + r * 0.75, ca.getY(k) * 0.25 + g * 0.75, ca.getZ(k) * 0.25 + b * 0.75);
      }
    }
    flat.computeVertexNormals();
    terrainMesh = new THREE.Mesh(flat, new THREE.MeshLambertMaterial({ vertexColors: true }));
    terrainMesh.receiveShadow = true;
    terrainMesh.name = "terrain";
    return terrainMesh;
  }

  /* ---------------- water & lava ---------------- */
  function liquidShader(deep, shallow, isLava, opacity) {
    return new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uDeep: { value: new THREE.Color(deep) },
        uShallow: { value: new THREE.Color(shallow) },
        uFogColor: { value: scene.fog ? scene.fog.color.clone() : new THREE.Color(0x888888) },
        uFogNear: { value: scene.fog ? scene.fog.near : 20 },
        uFogFar: { value: scene.fog ? scene.fog.far : 60 },
        uLava: { value: isLava ? 1.0 : 0.0 },
        uOpacity: { value: opacity }
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vW;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          wp.y += sin(uTime*1.5 + wp.x*1.9) * 0.045 + cos(uTime*1.05 + wp.z*2.3) * 0.045;
          vW = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `
        uniform float uTime, uFogNear, uFogFar, uLava, uOpacity;
        uniform vec3 uDeep, uShallow, uFogColor;
        varying vec3 vW;
        void main() {
          float w1 = sin(vW.x*2.1 + uTime*1.3)*0.5+0.5;
          float w2 = sin(vW.z*2.5 - uTime*1.05)*0.5+0.5;
          vec3 col = mix(uDeep, uShallow, w1*0.36 + w2*0.36);
          float fl = sin(vW.x*3.0 + uTime*1.9) * sin(vW.z*2.7 - uTime*1.6);
          if (uLava > 0.5) {
            float crack = smoothstep(0.55, 0.95, fl);
            col = mix(col, vec3(1.0, 0.93, 0.55), crack*0.85);
          } else {
            float foam = smoothstep(0.86, 1.0, fl);
            col = mix(col, vec3(0.82, 0.9, 0.94), foam*0.45);
          }
          float dist = distance(vW, cameraPosition);
          float f = smoothstep(uFogNear, uFogFar, dist) * (uLava > 0.5 ? 0.55 : 1.0);
          col = mix(col, uFogColor, f);
          gl_FragColor = vec4(col, uOpacity);
        }`
    });
  }

  function buildLiquids() {
    const env = ENVS[map.act] || ENVS[1];
    const water = [], lava = [];
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const ch = map.tiles[y][x];
        if (ch === "w" || ch === "b") water.push([x, y]); // bridges keep water lapping at their edges
        else if (ch === "l") lava.push([x, y]);
      }
    waterMat = lavaMat = null;
    if (water.length) {
      waterMat = liquidShader(env.water[0], env.water[1], false, 0.88);
      worldGroup.add(quadPatch(water, -0.24, waterMat));
    }
    if (lava.length) {
      lavaMat = liquidShader(0xd33b08, 0xff9a2e, true, 1.0);
      worldGroup.add(quadPatch(lava, -0.2, lavaMat));
    }
  }

  function quadPatch(tiles, yLevel, mat) {
    const pos = [], idx = [];
    let n = 0;
    for (const [x, y] of tiles) {
      pos.push(x, yLevel, y, x + 1, yLevel, y, x, yLevel, y + 1, x + 1, yLevel, y + 1);
      idx.push(n, n + 2, n + 1, n + 1, n + 2, n + 3);
      n += 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 1;
    return mesh;
  }

  /* ---------------- static props (merged into one mesh) ---------------- */
  const _tpl = {};
  function tpl(name) {
    if (_tpl[name]) return _tpl[name];
    let g;
    if (name === "box") g = new THREE.BoxGeometry(1, 1, 1);
    else if (name === "cyl") g = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
    else if (name === "cyl6") g = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
    else if (name === "cone") g = new THREE.ConeGeometry(0.5, 1, 7);
    else if (name === "ico") g = new THREE.IcosahedronGeometry(0.5, 0);
    else if (name === "dodec") g = new THREE.DodecahedronGeometry(0.5, 0);
    if (g.index) g = g.toNonIndexed();
    g.computeVertexNormals();
    _tpl[name] = g;
    return g;
  }

  function Bucket() { this.pos = []; this.nor = []; this.col = []; }
  Bucket.prototype.add = function (tplName, color, x, y, z, sx, sy, sz, ry, rz) {
    const g = tpl(tplName);
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(x, y, z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry || 0, rz || 0)),
      new THREE.Vector3(sx, sy, sz)
    );
    const nm = new THREE.Matrix3().getNormalMatrix(m);
    const p = g.attributes.position, n = g.attributes.normal;
    const v = new THREE.Vector3(), w = new THREE.Vector3();
    const c = new THREE.Color(color);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(m);
      this.pos.push(v.x, v.y, v.z);
      w.fromBufferAttribute(n, i).applyMatrix3(nm).normalize();
      this.nor.push(w.x, w.y, w.z);
      this.col.push(c.r, c.g, c.b);
    }
  };
  Bucket.prototype.build = function (selfLit) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(this.pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(this.nor, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(this.col, 3));
    const mesh = new THREE.Mesh(geo, selfLit
      ? new THREE.MeshBasicMaterial({ vertexColors: true })
      : new THREE.MeshLambertMaterial({ vertexColors: true }));
    mesh.castShadow = !selfLit;
    mesh.receiveShadow = !selfLit;
    return mesh;
  };

  function mixHex(a, b, f) {
    const ca = new THREE.Color(a), cb = new THREE.Color(b);
    return ca.lerp(cb, f);
  }

  function buildProps() {
    const B = new Bucket();          // lit geometry
    const G = new Bucket();          // self-lit geometry (runes, crystals, mushroom caps)
    const glows = [];                // soft halo sprites added after merge
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const ch = map.tiles[y][x];
        const cx = x + 0.5, cz = y + 0.5;
        const gh = heightAt(cx, cz);
        const h1 = hash(x * 7 + 1, y * 13 + 2), h2 = hash(x * 3 + 5, y * 11 + 7), h3 = hash(x * 17 + 3, y * 5 + 1);
        switch (ch) {
          case "t": {
            const s = 0.85 + h1 * 0.45;
            const lean = (h2 - 0.5) * 0.14;
            B.add("cyl6", mixHex("#4a2f15", "#6a4828", h2), cx + lean * 0.3, gh + 0.5 * s, cz, 0.17 * s, 1.05 * s, 0.17 * s, h1 * 3, lean);
            const dk = map.walk === "G";
            const c1 = mixHex(dk ? "#1d4a14" : "#2c6420", dk ? "#2f6322" : "#4a8a34", h2);
            const c2 = mixHex(dk ? "#2f6322" : "#3f8230", dk ? "#4a8a3a" : "#5fa344", h3);
            B.add("ico", c1, cx + lean, gh + (1.15 + 0.25 * h2) * s, cz, 1.15 * s, 1.0 * s, 1.15 * s, h1 * 6, 0);
            B.add("ico", c2, cx + lean + (h3 - 0.5) * 0.4, gh + (1.7 + 0.3 * h3) * s, cz + (h1 - 0.5) * 0.4, 0.8 * s, 0.75 * s, 0.8 * s, h2 * 6, 0);
            break;
          }
          case "r": {
            const s = 0.6 + h1 * 0.5;
            B.add("dodec", mixHex("#6b6962", "#8d8b84", h2), cx, gh + 0.26 * s, cz, s, 0.7 * s, s, h1 * 6, (h2 - 0.5) * 0.3);
            if (h3 > 0.5) B.add("dodec", "#7a786f", cx + (h2 - 0.5) * 0.6, gh + 0.1, cz + (h1 - 0.5) * 0.6, 0.34, 0.24, 0.34, h3 * 6, 0);
            break;
          }
          case "f": {
            B.add("box", "#5e4426", cx, gh + 0.36, cz, 0.13, 0.72, 0.13, 0, 0);
            if (x + 1 < W && map.tiles[y][x + 1] === "f") {
              B.add("box", "#7d5c34", cx + 0.5, gh + 0.52, cz, 1.0, 0.07, 0.06, 0, 0);
              B.add("box", "#6e4f2c", cx + 0.5, gh + 0.28, cz, 1.0, 0.07, 0.06, 0, 0);
            }
            if (y + 1 < H && map.tiles[y + 1][x] === "f") {
              B.add("box", "#7d5c34", cx, gh + 0.52, cz + 0.5, 0.06, 0.07, 1.0, 0, 0);
              B.add("box", "#6e4f2c", cx, gh + 0.28, cz + 0.5, 0.06, 0.07, 1.0, 0, 0);
            }
            break;
          }
          case "h": case "D": {
            const wallC = mixHex(TH.wall, TH.wall2, h1);
            B.add("box", wallC, cx, 0.8, cz, 1.001, 1.6, 1.001, 0, 0);
            B.add("box", mixHex(TH.trim, Sprites.shade(TH.trim, 14), h2), cx, 1.66, cz, 1.04, 0.12, 1.04, 0, 0);
            if (ch === "D") {
              B.add("box", TH.door, cx, 0.62, cz + 0.49, 0.6, 1.24, 0.1, 0, 0);
              B.add("box", TH.door2, cx, 0.6, cz + 0.52, 0.46, 1.1, 0.08, 0, 0);
              B.add("box", "#d8b75a", cx + 0.16, 0.6, cz + 0.57, 0.05, 0.05, 0.03, 0, 0);
            } else if (h3 > 0.55 && y > 0 && map.tiles[y - 1][x] === "R") {
              // house front: shuttered window with a warm lit pane
              B.add("box", TH.trim, cx, 1.02, cz + 0.51, 0.4, 0.42, 0.05, 0, 0);
              G.add("box", "#ffd98a", cx, 1.02, cz + 0.53, 0.26, 0.28, 0.03, 0, 0);
            }
            break;
          }
          case "R": {
            const roofC = mixHex(TH.roof, TH.roof2, h1);
            B.add("box", roofC, cx, 1.05, cz, 1.001, 2.1, 1.001, 0, 0);
            B.add("box", mixHex(TH.roofTrim, Sprites.shade(TH.roofTrim, 12), h2), cx, 2.16, cz, 1.05, 0.12, 1.05, 0, 0);
            // ridge cap on top
            B.add("box", TH.ridge, cx, 2.3, cz, 0.55, 0.18, 0.55, 0, 0);
            break;
          }
          case "W": {
            const hh = 0.45 + h1 * 1.0;
            const c = mixHex("#4f5550", "#5f665c", h2);
            if (h3 > 0.55) c.lerp(new THREE.Color("#4e6a48"), 0.35); // mossy
            B.add("box", c, cx, gh + hh / 2, cz, 0.96, hh, 0.96, 0, 0);
            break;
          }
          case "P": {
            const broken = h1 > 0.68;
            const ph = broken ? 0.7 + h2 * 0.6 : 1.9;
            const c = mixHex("#9a9588", "#b0ab9c", h2);
            B.add("box", "#7c7869", cx, gh + 0.09, cz, 0.72, 0.18, 0.72, 0, 0);
            B.add("cyl", c, cx, gh + 0.18 + ph / 2, cz, 0.46, ph, 0.46, 0, broken ? (h3 - 0.5) * 0.12 : 0);
            if (!broken) B.add("box", "#7c7869", cx, gh + 2.16, cz, 0.68, 0.16, 0.68, 0, 0);
            break;
          }
          case "F": {
            B.add("cyl", "#3e3b35", cx, gh + 0.1, cz, 0.5, 0.2, 0.5, 0, 0);
            B.add("cyl", "#55524a", cx, gh + 0.34, cz, 0.62, 0.32, 0.62, 0, 0);
            B.add("cyl", "#2a2722", cx, gh + 0.46, cz, 0.5, 0.1, 0.5, 0, 0);
            flames.push({ x: cx, z: cz, y: gh + 0.5, phase: h1 * 6 });
            break;
          }
          case "b": {
            // rails along edges that border water
            const nb = [[0, -1, 0, -0.46], [0, 1, 0, 0.46], [-1, 0, -0.46, 0], [1, 0, 0.46, 0]];
            for (const [dx, dy, ox, oz] of nb) {
              const nx = x + dx, ny = y + dy;
              if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
              if (map.tiles[ny][nx] !== "w") continue;
              const horiz = dy !== 0;
              B.add("box", "#5e4426", cx + ox, 0.22, cz + oz, horiz ? 1.0 : 0.08, 0.1, horiz ? 0.08 : 1.0, 0, 0);
              B.add("box", "#4e3a20", cx + ox - (horiz ? 0.42 : 0), 0.12, cz + oz - (horiz ? 0 : 0.42), 0.09, 0.34, 0.09, 0, 0);
              B.add("box", "#4e3a20", cx + ox + (horiz ? 0.42 : 0), 0.12, cz + oz + (horiz ? 0 : 0.42), 0.09, 0.34, 0.09, 0, 0);
            }
            break;
          }
          case "m": {
            if (h1 > 0.45) {
              for (let i = 0; i < 2; i++) {
                const rx = cx + (hash(x + i * 3, y * 2 + i) - 0.5) * 0.7;
                const rz = cz + (hash(x * 2 + i, y + i * 5) - 0.5) * 0.7;
                B.add("cone", mixHex("#6a7a40", "#8a9a50", h2), rx, heightAt(rx, rz) + 0.25, rz, 0.07, 0.5 + h2 * 0.3, 0.07, 0, (h3 - 0.5) * 0.3);
              }
            }
            break;
          }
          case "g": case "G": {
            // occasional grass tufts / tiny flowers for life
            if (h1 > 0.86) {
              const gc = ch === "g" ? "#6fa04a" : "#4d7a36";
              B.add("cone", gc, cx + (h2 - 0.5) * 0.6, gh + 0.12, cz + (h3 - 0.5) * 0.6, 0.1, 0.26, 0.1, 0, (h2 - 0.5) * 0.4);
              if (h2 > 0.8 && map.act === 1) B.add("box", h3 > 0.5 ? "#e8d23f" : "#d86a8a", cx + (h2 - 0.5) * 0.5, gh + 0.22, cz + (h3 - 0.5) * 0.5, 0.07, 0.07, 0.07, h1 * 3, 0);
            }
            break;
          }
          case "a": {
            // scorched earth: charred stumps and cinder rocks
            if (h1 > 0.74) B.add("cyl6", "#2e2722", cx + (h2 - 0.5) * 0.6, gh + 0.12, cz + (h3 - 0.5) * 0.6, 0.08, 0.2 + h2 * 0.22, 0.08, 0, (h3 - 0.5) * 0.5);
            if (h2 > 0.84) B.add("dodec", "#3a322a", cx + (h3 - 0.5) * 0.6, gh + 0.05, cz + (h1 - 0.5) * 0.6, 0.13, 0.09, 0.13, h1 * 6, 0);
            break;
          }
          case "e": {
            // old bones half-buried in the dirt
            if (h1 > 0.3) {
              B.add("box", "#cfc6b0", cx + (h2 - 0.5) * 0.5, gh + 0.05, cz + (h3 - 0.5) * 0.5, 0.32, 0.05, 0.07, h1 * 6, 0);
              B.add("box", "#bfb6a0", cx + (h3 - 0.5) * 0.6, gh + 0.05, cz + (h2 - 0.5) * 0.6, 0.22, 0.05, 0.06, h2 * 6, 0);
            }
            if (h1 > 0.66) B.add("ico", "#d8d0bc", cx + (h2 - 0.5) * 0.4, gh + 0.09, cz + (h3 - 0.5) * 0.4, 0.17, 0.14, 0.19, h3 * 6, 0);
            if (h2 > 0.8) B.add("cone", "#cfc6b0", cx + (h1 - 0.5) * 0.5, gh + 0.12, cz - (h3 - 0.5) * 0.5, 0.05, 0.26, 0.05, 0, 0.6 + h3);
            break;
          }
          case "*": {
            // tended flower bed
            const FLW = ["#e8d23f", "#d86a8a", "#e07a3a", "#c8e0ff", "#b070d8"];
            for (let i = 0; i < 4; i++) {
              const fx = cx + (hash(x * 5 + i, y * 3 + i * 7) - 0.5) * 0.8;
              const fz = cz + (hash(x * 9 + i * 3, y * 7 + i) - 0.5) * 0.8;
              const fy = heightAt(fx, fz);
              B.add("cone", "#4d7a36", fx, fy + 0.11, fz, 0.07, 0.22, 0.07, 0, 0);
              B.add("box", FLW[Math.floor(hash(x + i * 11, y + i * 5) * FLW.length)], fx, fy + 0.24, fz, 0.09, 0.08, 0.09, i * 1.2, 0);
            }
            break;
          }
          case "C": {
            // crop rows on tilled soil
            B.add("box", "#5e4a2e", cx, gh + 0.05, cz, 0.96, 0.12, 0.96, 0, 0);
            for (let i = 0; i < 3; i++)
              B.add("cone", mixHex("#7a9a3a", "#a8b84a", hash(x * 3 + i, y + i * 7)), cx - 0.3 + i * 0.3, gh + 0.34, cz + (h1 - 0.5) * 0.3, 0.1, 0.44 + h2 * 0.16, 0.1, 0, (h3 - 0.5) * 0.2);
            if (h1 > 0.78) B.add("ico", "#d8843a", cx + 0.26, gh + 0.17, cz + 0.28, 0.17, 0.13, 0.17, h2 * 6, 0);
            break;
          }
          case "o": {
            // village well
            B.add("cyl", mixHex("#84847e", "#96968c", h1), cx, gh + 0.3, cz, 0.8, 0.6, 0.8, 0, 0);
            B.add("cyl", "#1a2530", cx, gh + 0.61, cz, 0.6, 0.04, 0.6, 0, 0);
            B.add("box", "#5e4426", cx - 0.42, gh + 0.95, cz, 0.1, 1.3, 0.1, 0, 0);
            B.add("box", "#5e4426", cx + 0.42, gh + 0.95, cz, 0.1, 1.3, 0.1, 0, 0);
            B.add("box", "#6e4f2c", cx, gh + 1.56, cz, 1.06, 0.08, 0.1, 0, 0);
            B.add("cone", TH.roof, cx, gh + 1.86, cz, 1.5, 0.55, 1.5, 0, 0);
            B.add("box", "#7d5c34", cx + 0.12, gh + 1.1, cz, 0.16, 0.2, 0.16, 0.4, 0); // bucket
            break;
          }
          case "M": {
            // market stall with striped awning
            const AWN = ["#a04038", "#3a6a8a", "#9a7a2a", "#5e7a3a"];
            const awn = AWN[Math.floor(h1 * AWN.length)];
            B.add("box", "#6e4f2c", cx, gh + 0.42, cz, 0.95, 0.5, 0.6, 0, 0);
            B.add("box", "#7d5c34", cx, gh + 0.7, cz, 1.02, 0.07, 0.68, 0, 0);
            for (const ox of [-0.44, 0.44]) for (const oz of [-0.32, 0.32])
              B.add("box", "#55432a", cx + ox, gh + 0.8, cz + oz, 0.08, 1.7, 0.08, 0, 0);
            B.add("box", awn, cx - 0.27, gh + 1.7, cz, 0.62, 0.06, 0.98, 0, 0.2);
            B.add("box", "#e8e0cc", cx + 0.27, gh + 1.76, cz, 0.62, 0.06, 0.98, 0, -0.2);
            B.add("ico", "#c8a04a", cx - 0.2, gh + 0.84, cz + 0.1, 0.18, 0.14, 0.18, h2 * 6, 0);
            B.add("box", "#7a3030", cx + 0.22, gh + 0.82, cz - 0.08, 0.18, 0.15, 0.22, h3, 0);
            break;
          }
          case "L": {
            // iron lamp post (lit)
            B.add("cyl", "#3a3a3e", cx, gh + 0.08, cz, 0.32, 0.16, 0.32, 0, 0);
            B.add("cyl6", "#4a4a50", cx, gh + 0.8, cz, 0.09, 1.5, 0.09, 0, 0);
            B.add("box", "#3a3a3e", cx, gh + 1.58, cz, 0.3, 0.06, 0.3, 0, 0);
            B.add("box", "#2e2e32", cx, gh + 1.86, cz, 0.24, 0.06, 0.24, 0, 0);
            flames.push({ x: cx, z: cz, y: gh + 1.52, phase: h1 * 6, lamp: true });
            break;
          }
          case "A": {
            // anvil on a stump + forge coals
            B.add("cyl6", "#55432a", cx - 0.15, gh + 0.2, cz, 0.5, 0.4, 0.5, 0, 0);
            B.add("box", "#3e3e44", cx - 0.15, gh + 0.5, cz, 0.46, 0.2, 0.26, 0, 0);
            B.add("box", "#4a4a52", cx - 0.15, gh + 0.63, cz, 0.62, 0.09, 0.3, 0, 0);
            B.add("cone", "#4a4a52", cx + 0.22, gh + 0.63, cz, 0.4, 0.3, 0.4, 0, -Math.PI / 2);
            B.add("box", "#5e5852", cx + 0.34, gh + 0.25, cz + 0.32, 0.5, 0.5, 0.5, 0.3, 0);
            flames.push({ x: cx + 0.34, z: cz + 0.32, y: gh + 0.5, phase: h1 * 6, lamp: true });
            break;
          }
          case "B": {
            // barrels and crates
            B.add("cyl", "#6e4f2c", cx - 0.2, gh + 0.3, cz + 0.15, 0.5, 0.6, 0.5, 0, 0);
            B.add("cyl", "#4e3a20", cx - 0.2, gh + 0.32, cz + 0.15, 0.53, 0.07, 0.53, 0, 0);
            B.add("box", "#7d5c34", cx + 0.25, gh + 0.21, cz - 0.18, 0.42, 0.42, 0.42, h1, 0);
            if (h2 > 0.45) B.add("box", "#8a6a3e", cx + 0.18, gh + 0.56, cz - 0.12, 0.3, 0.3, 0.3, h2 * 2, 0);
            break;
          }
          case "Y": {
            // canvas tent (themed color), open toward +z
            const cv = TH.canvas;
            const cvd = Sprites.shade(cv, -22);
            B.add("box", cv, cx - 0.35, gh + 0.52, cz, 0.98, 0.07, 1.15, 0, 0.96);
            B.add("box", cvd, cx + 0.35, gh + 0.52, cz, 0.98, 0.07, 1.15, 0, -0.96);
            B.add("box", "#55432a", cx, gh + 0.92, cz, 0.07, 0.1, 1.28, 0, 0);
            B.add("box", cvd, cx, gh + 0.4, cz - 0.52, 0.78, 0.8, 0.06, 0, 0);
            break;
          }
          case "O": {
            // ancient runestone
            const oc = mixHex("#847f72", "#a8a396", h2);
            B.add("box", oc, cx, gh + 0.8, cz, 0.6, 1.6, 0.42, h1 * 0.5, (h2 - 0.5) * 0.1);
            B.add("box", oc, cx, gh + 1.66, cz, 0.42, 0.3, 0.34, h1 * 0.5, 0);
            G.add("box", TH.rune, cx, gh + 0.95, cz + 0.21, 0.1, 0.7, 0.04, h1 * 0.5, 0);
            G.add("box", TH.rune, cx, gh + 1.4, cz + 0.2, 0.18, 0.1, 0.04, h1 * 0.5, 0);
            glows.push({ x: cx, y: gh + 1.1, z: cz, color: TH.rune, size: 1.5, opacity: 0.3 });
            break;
          }
          case "u": {
            // weathered statue of a fallen hero
            const st = mixHex("#7e7e78", "#96968c", h1);
            if (map.act === 3 && h3 > 0.4) st.lerp(new THREE.Color("#5a7a5e"), 0.3);
            B.add("box", "#6a6a64", cx, gh + 0.15, cz, 0.84, 0.3, 0.84, 0, 0);
            B.add("box", st, cx, gh + 0.45, cz, 0.52, 0.32, 0.52, 0, 0);
            B.add("box", st, cx, gh + 0.95, cz, 0.34, 0.7, 0.26, 0, 0);
            B.add("box", st, cx, gh + 1.44, cz, 0.44, 0.4, 0.3, 0, 0);
            B.add("box", st, cx, gh + 1.76, cz, 0.25, 0.25, 0.25, 0, 0);
            B.add("box", st, cx + 0.3, gh + 1.3, cz + 0.08, 0.12, 0.46, 0.12, 0, -0.35);
            B.add("box", st, cx + 0.4, gh + 0.92, cz + 0.16, 0.07, 0.85, 0.09, 0, 0);
            break;
          }
          case "n": {
            // banner pole with themed cloth
            B.add("cyl6", "#4a3a28", cx, gh + 1.15, cz, 0.09, 2.3, 0.09, 0, 0);
            B.add("cone", "#c8a04a", cx, gh + 2.4, cz, 0.13, 0.2, 0.13, 0, 0);
            B.add("box", "#5e4426", cx, gh + 2.2, cz, 0.8, 0.06, 0.08, 0, 0);
            B.add("box", TH.banner, cx, gh + 1.68, cz, 0.62, 1.0, 0.045, 0, 0);
            B.add("box", Sprites.shade(TH.banner, -26), cx, gh + 1.14, cz, 0.62, 0.12, 0.05, 0, 0);
            G.add("box", "#e8c879", cx, gh + 1.74, cz + 0.04, 0.18, 0.26, 0.02, 0, 0);
            break;
          }
          case "+": {
            // leaning gravestone
            const gc2 = mixHex("#73736b", "#8a8a80", h2);
            if (h3 > 0.5) gc2.lerp(new THREE.Color("#5a7a4e"), 0.3);
            B.add("box", gc2, cx, gh + 0.32, cz, 0.42, 0.62, 0.13, (h1 - 0.5) * 0.4, (h2 - 0.5) * 0.3);
            B.add("box", gc2, cx, gh + 0.64, cz, 0.3, 0.16, 0.11, (h1 - 0.5) * 0.4, (h2 - 0.5) * 0.3);
            if (h1 > 0.62) B.add("box", "#6a6a62", cx + (h2 - 0.5) * 0.4, gh + 0.06, cz + 0.3, 0.5, 0.12, 0.32, h3, 0);
            break;
          }
          case "i": {
            // glowing crystal shards
            const cc2 = TH.crystal;
            B.add("dodec", "#4a463e", cx, gh + 0.07, cz, 0.52, 0.2, 0.52, h2 * 6, 0);
            G.add("ico", cc2, cx, gh + 0.5, cz, 0.3, 0.9, 0.3, h1 * 6, (h2 - 0.5) * 0.25);
            G.add("ico", cc2, cx + (h2 - 0.5) * 0.55, gh + 0.22, cz + (h3 - 0.5) * 0.55, 0.16, 0.42, 0.16, h3 * 6, (h1 - 0.5) * 0.5);
            glows.push({ x: cx, y: gh + 0.6, z: cz, color: cc2, size: 1.7, opacity: 0.42 });
            break;
          }
          case "T": {
            // charred dead tree
            const ts = 0.8 + h1 * 0.45;
            const tc = mixHex("#332b24", "#4a3e32", h2);
            B.add("cyl6", tc, cx, gh + 0.65 * ts, cz, 0.15 * ts, 1.3 * ts, 0.15 * ts, h1 * 3, (h2 - 0.5) * 0.18);
            B.add("cyl6", tc, cx + 0.2 * ts, gh + 1.3 * ts, cz, 0.06 * ts, 0.75 * ts, 0.06 * ts, 0, -0.7);
            B.add("cyl6", tc, cx - 0.16 * ts, gh + 1.15 * ts, cz + 0.06, 0.05 * ts, 0.6 * ts, 0.05 * ts, 0.5, 0.75);
            break;
          }
          case "Q": {
            // throne of the old kingdom
            B.add("box", "#6a665c", cx, gh + 0.12, cz, 1.0, 0.24, 1.0, 0, 0);
            B.add("box", "#7a766a", cx, gh + 0.4, cz, 0.72, 0.32, 0.72, 0, 0);
            B.add("box", "#8a8678", cx, gh + 1.05, cz - 0.3, 0.72, 1.4, 0.15, 0, 0);
            B.add("box", "#7a2030", cx, gh + 1.0, cz - 0.21, 0.5, 1.0, 0.05, 0, 0);
            B.add("box", "#c8a04a", cx, gh + 1.8, cz - 0.3, 0.78, 0.1, 0.17, 0, 0);
            B.add("cone", "#c8a04a", cx - 0.33, gh + 1.95, cz - 0.3, 0.16, 0.2, 0.16, 0, 0);
            B.add("cone", "#c8a04a", cx + 0.33, gh + 1.95, cz - 0.3, 0.16, 0.2, 0.16, 0, 0);
            B.add("box", "#8a8678", cx - 0.32, gh + 0.66, cz + 0.1, 0.13, 0.3, 0.5, 0, 0);
            B.add("box", "#8a8678", cx + 0.32, gh + 0.66, cz + 0.1, 0.13, 0.3, 0.5, 0, 0);
            G.add("box", TH.crystal, cx, gh + 1.62, cz - 0.27, 0.12, 0.14, 0.04, 0, 0);
            glows.push({ x: cx, y: gh + 1.6, z: cz - 0.2, color: TH.crystal, size: 1.2, opacity: 0.3 });
            break;
          }
          case "k": {
            // scribe's lectern with an open tome
            B.add("cyl6", "#5e4426", cx, gh + 0.45, cz, 0.15, 0.9, 0.15, 0, 0);
            B.add("box", "#4a3a28", cx, gh + 0.06, cz, 0.5, 0.12, 0.5, 0, 0);
            B.add("box", "#6e4f2c", cx, gh + 0.96, cz, 0.62, 0.08, 0.46, 0, 0.22);
            B.add("box", "#7a2020", cx, gh + 1.02, cz, 0.46, 0.05, 0.36, 0, 0.22);
            B.add("box", "#e8dcc0", cx, gh + 1.06, cz, 0.4, 0.04, 0.3, 0, 0.22);
            break;
          }
          case "j": {
            // weapon rack with leaning blades
            B.add("box", "#55432a", cx - 0.4, gh + 0.5, cz, 0.09, 1.0, 0.09, 0, 0);
            B.add("box", "#55432a", cx + 0.4, gh + 0.5, cz, 0.09, 1.0, 0.09, 0, 0);
            B.add("box", "#6e4f2c", cx, gh + 0.94, cz, 0.95, 0.08, 0.09, 0, 0);
            for (let i = 0; i < 3; i++) {
              const lx = cx - 0.24 + i * 0.24;
              B.add("box", "#aab4bc", lx, gh + 0.52, cz + 0.07, 0.05, 0.95, 0.025, 0, 0.14 - i * 0.14);
              B.add("box", "#6a5a2a", lx, gh + 0.24, cz + 0.07, 0.16, 0.04, 0.05, 0, 0.14 - i * 0.14);
            }
            break;
          }
          case "q": {
            // bioluminescent mushroom cluster
            const ms = 0.7 + h1 * 0.5;
            B.add("cyl6", "#d8d0c0", cx, gh + 0.3 * ms, cz, 0.13 * ms, 0.6 * ms, 0.17 * ms, 0, (h2 - 0.5) * 0.2);
            G.add("cone", "#5ac87a", cx, gh + 0.72 * ms, cz, 1.1 * ms, 0.42 * ms, 1.1 * ms, h1 * 3, 0);
            B.add("cyl6", "#cfc6b4", cx + (h2 - 0.5) * 0.7, gh + 0.13, cz + (h3 - 0.5) * 0.7, 0.06, 0.26, 0.08, 0, (h1 - 0.5) * 0.4);
            G.add("cone", "#6ad88a", cx + (h2 - 0.5) * 0.7, gh + 0.32, cz + (h3 - 0.5) * 0.7, 0.4, 0.18, 0.4, 0, (h1 - 0.5) * 0.4);
            glows.push({ x: cx, y: gh + 0.7 * ms, z: cz, color: "#5ac87a", size: 1.5, opacity: 0.3 });
            break;
          }
          case "^": {
            // obsidian spike
            const os = 0.7 + h1 * 0.6;
            B.add("cone", "#1e181c", cx, gh + 0.6 * os, cz, 1.0 * os, 1.4 * os, 1.0 * os, h1 * 6, (h2 - 0.5) * 0.2);
            B.add("cone", "#2a2228", cx + (h2 - 0.5) * 0.6, gh + 0.32, cz + (h3 - 0.5) * 0.6, 0.6, 0.75, 0.6, h3 * 6, (h1 - 0.5) * 0.3);
            if (map.act === 5) glows.push({ x: cx, y: gh + 0.2, z: cz, color: 0xff7a30, size: 1.1, opacity: 0.22 });
            break;
          }
        }
      }
    }
    worldGroup.add(B.build());
    worldGroup.add(G.build(true));
    for (const gl of glows) {
      const s = Models3D.makeGlowSprite(gl.color, gl.size, gl.opacity);
      s.position.set(gl.x, gl.y, gl.z);
      worldGroup.add(s);
    }

    // brazier / lamp flames (animated) + lights
    for (const f of flames) {
      const sc = f.lamp ? 0.55 : 1;
      f.s = sc;
      const grp = new THREE.Group();
      grp.position.set(f.x, f.y, f.z);
      const outer = new THREE.Mesh(new THREE.ConeGeometry(0.17 * sc, 0.55 * sc, 6), new THREE.MeshBasicMaterial({ color: 0xff7a1a }));
      outer.position.y = 0.27 * sc;
      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.09 * sc, 0.34 * sc, 6), new THREE.MeshBasicMaterial({ color: 0xffd23f }));
      inner.position.y = 0.22 * sc;
      const halo = Models3D.makeGlowSprite(0xff8a2a, 1.6 * sc, 0.55);
      halo.position.y = 0.4 * sc;
      const light = new THREE.PointLight(0xff8a3a, f.lamp ? 0.85 : 1.15, f.lamp ? 6 : 7.5, 2);
      light.position.y = 0.7 * sc;
      grp.add(outer, inner, halo, light);
      worldGroup.add(grp);
      f.outer = outer; f.inner = inner; f.halo = halo; f.light = light;
    }
  }

  /* ---------------- portals ---------------- */
  function buildPortals() {
    // group adjacent portal tiles that lead to the same place
    const groups = {};
    for (const p of map.portals) {
      const k = p.to + "|" + p.label;
      (groups[k] = groups[k] || []).push(p);
    }
    for (const k in groups) {
      const list = groups[k];
      const x = list.reduce((s, p) => s + p.x, 0) / list.length + 0.5;
      const z = list.reduce((s, p) => s + p.y, 0) / list.length + 0.5;
      const y = heightAt(x, z);
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0x7be0ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.55, 3.4, 10, 1, true), beamMat);
      beam.position.y = 1.7;
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x7be0ff, transparent: true, opacity: 0.75, depthWrite: false, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.68, 20), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.04;
      const halo = Models3D.makeGlowSprite(0x7be0ff, 2.2, 0.5);
      halo.position.y = 0.5;
      const label = makeTextSprite(list[0].label, { color: "#bfe8ff", size: 30, sub: null });
      label.position.y = 3.0;
      grp.add(beam, ring, halo, label);
      worldGroup.add(grp);
      portals.push({ def: list[0], beamMat, ringMat, halo, label, grp, lastOpen: null });
    }
  }

  /* ---------------- ambient particles ---------------- */
  function buildParticles(kind) {
    if (!kind) return;
    const conf = {
      pollen: { n: 40, color: 0xfff0c0, size: 0.09, opacity: 0.4, blending: THREE.AdditiveBlending, vy: 0.025, drift: 0.4, span: 26, hBase: 0.4, hSpan: 2.4 },
      fireflies: { n: 70, color: 0xcdf07a, size: 0.14, opacity: 0.8, blending: THREE.AdditiveBlending, vy: 0.06, drift: 0.35, span: 26, hBase: 0.4, hSpan: 2.2 },
      mist: { n: 55, color: 0x9ab8d8, size: 0.34, opacity: 0.09, blending: THREE.NormalBlending, vy: 0.03, drift: 0.25, span: 30, hBase: 0.2, hSpan: 1.6 },
      ash: { n: 110, color: 0xb8aFa6, size: 0.1, opacity: 0.5, blending: THREE.NormalBlending, vy: -0.22, drift: 0.3, span: 28, hBase: 0.5, hSpan: 5 },
      embers: { n: 130, color: 0xff9a40, size: 0.13, opacity: 0.85, blending: THREE.AdditiveBlending, vy: 0.5, drift: 0.5, span: 30, hBase: 0.2, hSpan: 4.5 }
    }[kind];
    if (!conf) return;
    const pos = new Float32Array(conf.n * 3);
    const seed = new Float32Array(conf.n);
    for (let i = 0; i < conf.n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * conf.span;
      pos[i * 3 + 1] = conf.hBase + Math.random() * conf.hSpan;
      pos[i * 3 + 2] = (Math.random() - 0.5) * conf.span;
      seed[i] = Math.random() * 10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      map: Models3D.glowTexture(), color: conf.color, size: conf.size,
      transparent: true, opacity: conf.opacity, depthWrite: false,
      blending: conf.blending, sizeAttenuation: true
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    worldGroup.add(pts);
    particles = { pts, conf, seed };
  }

  function updateParticles(dt, t) {
    if (!particles) return;
    const { pts, conf, seed } = particles;
    const arr = pts.geometry.attributes.position.array;
    const cx = camTarget.x, cz = camTarget.z;
    pts.position.set(cx, 0, cz);
    for (let i = 0; i < conf.n; i++) {
      arr[i * 3] += Math.sin(t * 0.7 + seed[i]) * conf.drift * dt;
      arr[i * 3 + 1] += conf.vy * dt * (0.6 + Math.sin(seed[i]) * 0.4 + 0.4);
      arr[i * 3 + 2] += Math.cos(t * 0.6 + seed[i] * 1.7) * conf.drift * dt;
      const hs = conf.hBase, he = conf.hBase + conf.hSpan;
      if (arr[i * 3 + 1] > he) arr[i * 3 + 1] = hs;
      if (arr[i * 3 + 1] < hs - 0.5) arr[i * 3 + 1] = he;
      if (arr[i * 3] > conf.span / 2) arr[i * 3] = -conf.span / 2;
      if (arr[i * 3] < -conf.span / 2) arr[i * 3] = conf.span / 2;
      if (arr[i * 3 + 2] > conf.span / 2) arr[i * 3 + 2] = -conf.span / 2;
      if (arr[i * 3 + 2] < -conf.span / 2) arr[i * 3 + 2] = conf.span / 2;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  }

  /* ============================================================
     TEXT SPRITES (nameplates, markers)
     ============================================================ */
  function makeTextSprite(text, opts) {
    opts = opts || {};
    const size = opts.size || 34;
    const sub = opts.sub;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    const font = `bold ${size}px ${opts.serif ? "Georgia, serif" : "Verdana, sans-serif"}`;
    ctx.font = font;
    const w = Math.max(64, Math.ceil(ctx.measureText(text).width) + 22);
    const subH = sub ? size * 0.85 : 0;
    c.width = w; c.height = size + 18 + subH;
    ctx.font = font;
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.lineWidth = Math.max(4, size / 6);
    ctx.strokeStyle = "rgba(0,0,0,0.85)";
    ctx.lineJoin = "round";
    ctx.strokeText(text, w / 2, 6);
    ctx.fillStyle = opts.color || "#ffffff";
    ctx.fillText(text, w / 2, 6);
    if (sub) {
      ctx.font = `${Math.round(size * 0.62)}px Verdana, sans-serif`;
      ctx.strokeText(sub, w / 2, size + 10);
      ctx.fillStyle = opts.subColor || "#c8e6ff";
      ctx.fillText(sub, w / 2, size + 10);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
    const s = new THREE.Sprite(mat);
    const hScale = opts.scale || 0.42;
    s.scale.set((c.width / c.height) * hScale, hScale, 1);
    s.renderOrder = 50;
    return s;
  }

  function makeMarkerSprite(glyph, color) {
    const c = document.createElement("canvas");
    c.width = 64; c.height = 64;
    const ctx = c.getContext("2d");
    ctx.font = "bold 52px Georgia, serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.lineWidth = 9; ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(0,0,0,0.9)";
    ctx.strokeText(glyph, 32, 36);
    ctx.fillStyle = color;
    ctx.fillText(glyph, 32, 36);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
    const s = new THREE.Sprite(mat);
    s.scale.set(0.55, 0.55, 1);
    s.renderOrder = 51;
    return s;
  }

  /* ============================================================
     ENTITY RIGS
     ============================================================ */
  function pxToWorld(px) { return px / T + 0.5; }

  function getRig(key, makeFn) {
    let r = rigs.get(key);
    if (!r) { r = makeFn(); rigs.set(key, r); worldGroup.add(r.root); }
    return r;
  }

  function humanoidRig(look, name, nameColor, sub, subColor) {
    const root = new THREE.Group();
    const model = Models3D.buildHumanoid(look);
    root.add(model.group);
    let nameSprite = null;
    if (name) {
      nameSprite = makeTextSprite(name, { color: nameColor, sub, subColor });
      nameSprite.position.y = model.height + 0.42;
      root.add(nameSprite);
    }
    return { root, model, nameSprite, yaw: 0, kind: "humanoid" };
  }

  function faceYaw(rig, targetYaw, dt) {
    let d = targetYaw - rig.yaw;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    rig.yaw += d * Math.min(1, dt * 14);
    rig.model.group.rotation.y = rig.yaw;
  }

  const FACING_YAW = { down: 0, up: Math.PI, left: -Math.PI / 2, right: Math.PI / 2 };

  function syncEntities(t, dt) {
    if (!Game.player || !Game.state) return;

    /* ----- player ----- */
    const st = Game.state;
    const key = JSON.stringify(st.appearance) + "|" + st.name + "|" + (st.titleEarned || "");
    if (!playerRig || playerKey !== key) {
      if (playerRig) worldGroup.remove(playerRig.root);
      playerRig = humanoidRig(st.appearance, st.name, "#ffffff",
        st.titleEarned ? "«" + st.titleEarned + "»" : null, "#ffd76e");
      playerKey = key;
      worldGroup.add(playerRig.root);
    }
    playerRig.model.setWeapon(Game.weaponVisual());
    playerRig.model.setArmor(Game.armorVisual());
    const p = Game.player;
    const pwx = pxToWorld(p.px), pwz = pxToWorld(p.py);
    playerRig.root.position.set(pwx, heightAt(pwx, pwz), pwz);
    faceYaw(playerRig, FACING_YAW[p.facing] || 0, dt);
    playerRig.model.setWalk(t, p.moving);

    /* ----- npcs ----- */
    for (const n of Game.entities.npcs) {
      const rig = getRig(n, () => {
        const r = humanoidRig(n.def.look, n.def.name, "#ffe96a", n.def.title, "#bfa86a");
        const wx = n.x + 0.5, wz = n.y + 0.5;
        r.root.position.set(wx, heightAt(wx, wz), wz);
        r.markerState = "none";
        return r;
      });
      const marker = Quests.npcMarker(n.def.id) || (n.def.shop ? "$" : "none");
      if (marker !== rig.markerState) {
        rig.markerState = marker;
        if (rig.marker) { rig.root.remove(rig.marker); rig.marker = null; }
        if (marker === "!") rig.marker = makeMarkerSprite("!", "#ffd23f");
        else if (marker === "?") rig.marker = makeMarkerSprite("?", "#7be0ff");
        else if (marker === "$") rig.marker = makeMarkerSprite("💰", "#ffd23f");
        if (rig.marker) {
          rig.marker.position.y = rig.model.height + 0.95;
          rig.root.add(rig.marker);
        }
      }
      if (rig.marker) rig.marker.position.y = rig.model.height + 0.95 + Math.sin(t * 2.4) * 0.09;
      // face the player when close
      const dx = pwx - rig.root.position.x, dz = pwz - rig.root.position.z;
      if (dx * dx + dz * dz < 16) faceYaw(rig, Math.atan2(dx, dz), dt);
      rig.model.setWalk(t + n.x, false);
    }

    /* ----- enemies ----- */
    for (const e of Game.entities.enemies) {
      const rig = getRig(e, () => {
        const model = Models3D.buildEnemy(e.def);
        const root = new THREE.Group();
        root.add(model.group);
        const name = makeTextSprite(`${e.def.name}  (${e.def.level})`, {
          color: e.def.boss ? "#ff7a55" : "#ffb3a0",
          scale: e.def.boss ? 0.55 : 0.4
        });
        name.position.y = Math.max(model.height, 0.9) + 0.45;
        root.add(name);
        return { root, model, yaw: 0, kind: "enemy" };
      });
      rig.root.visible = e.alive;
      if (!e.alive) continue;
      const wx = pxToWorld(e.px), wz = pxToWorld(e.py);
      rig.root.position.set(wx, heightAt(wx, wz), wz);
      const mvx = e.toX - e.fromX, mvy = e.toY - e.fromY;
      const moving = e.moveProg < 1;
      if (moving && (mvx || mvy)) faceYaw(rig, Math.atan2(mvx, mvy), dt);
      else {
        const dx = pwx - wx, dz = pwz - wz;
        if (dx * dx + dz * dz < 20) faceYaw(rig, Math.atan2(dx, dz), dt);
      }
      rig.model.animate(t + (e.uid || 0), moving);
    }

    /* ----- walkers (ambient adventurers) ----- */
    for (const w of Game.entities.walkers) {
      const rig = getRig(w, () => humanoidRig(w.look, w.name, "#bcd9ff"));
      const wx = pxToWorld(w.px), wz = pxToWorld(w.py);
      rig.root.position.set(wx, heightAt(wx, wz), wz);
      faceYaw(rig, FACING_YAW[w.facing] || 0, dt);
      rig.model.setWalk(t, w.moving);
    }
  }

  /* ============================================================
     FRAME
     ============================================================ */
  function frame(tms) {
    if (!map || !Game.player) return;
    const t = tms / 1000;
    const dt = Math.min(0.06, t - lastT || 0.016);
    lastT = t;

    // camera follow
    const p = Game.player;
    const wx = pxToWorld(p.px), wz = pxToWorld(p.py);
    const ty = heightAt(wx, wz);
    camTarget.lerp(new THREE.Vector3(wx, ty, wz), Math.min(1, dt * 7));
    const cp = Math.cos(orbit.pitch), sp = Math.sin(orbit.pitch);
    camera.position.set(
      camTarget.x + Math.sin(orbit.yaw) * cp * orbit.dist,
      camTarget.y + sp * orbit.dist,
      camTarget.z + Math.cos(orbit.yaw) * cp * orbit.dist
    );
    camera.lookAt(camTarget.x, camTarget.y + 1.0, camTarget.z);

    // sky + sun follow
    const sky = scene.getObjectByName("sky");
    if (sky) sky.position.copy(camTarget);
    const sd = sun.userData.dir || new THREE.Vector3(0, 1, 0);
    sun.position.set(camTarget.x + sd.x * 32, camTarget.y + sd.y * 32, camTarget.z + sd.z * 32);
    sunTarget.position.copy(camTarget);
    if (playerLight) {
      playerLight.position.set(wx, ty + 1.8, wz);
      playerLight.intensity = (map.act >= 3 ? 0.55 : 0.3) + Math.sin(t * 2.6) * 0.06;
    }

    // liquids
    if (waterMat) waterMat.uniforms.uTime.value = t;
    if (lavaMat) lavaMat.uniforms.uTime.value = t;

    // flames flicker
    for (const f of flames) {
      const fl = 1 + Math.sin(t * 11 + f.phase) * 0.18 + Math.sin(t * 23 + f.phase * 2) * 0.1;
      if (f.outer) {
        f.outer.scale.set(fl, fl * (1 + Math.sin(t * 7 + f.phase) * 0.12), fl);
        f.inner.scale.copy(f.outer.scale);
        f.halo.material.opacity = 0.4 + fl * 0.12;
        f.light.intensity = (f.lamp ? 0.6 : 0.95) + fl * 0.25;
      }
    }

    // portals
    for (const po of portals) {
      const open = !po.def.req || Quests.isDone(po.def.req);
      if (open !== po.lastOpen) {
        po.lastOpen = open;
        const col = open ? 0x7be0ff : 0xff5c3a;
        po.beamMat.color.set(col); po.ringMat.color.set(col);
        po.halo.material.color.set(col);
        const old = po.label;
        po.label = makeTextSprite((open ? "" : "🔒 ") + po.def.label, { color: open ? "#bfe8ff" : "#ffb3a0" });
        po.label.position.copy(old.position);
        po.grp.remove(old); po.grp.add(po.label);
      }
      po.beamMat.opacity = 0.22 + Math.sin(t * 2.2) * 0.08;
      po.halo.material.opacity = 0.38 + Math.sin(t * 2.2) * 0.12;
      po.grp.rotation.y = t * 0.4;
      po.label.position.y = 3.0 + Math.sin(t * 1.6) * 0.08;
    }

    updateParticles(dt, t);

    // click marker
    const cm = Game.clickMarker;
    if (cm && cm.until > tms) {
      clickRing.visible = true;
      const mx = cm.x + 0.5, mz = cm.y + 0.5;
      clickRing.position.set(mx, heightAt(mx, mz) + 0.04, mz);
      const pulse = 1 + Math.sin(t * 7) * 0.18;
      clickRing.scale.set(pulse, 1, pulse);
      const remain = (cm.until - tms) / 1000;
      const op = Math.min(1, remain / 0.8) * 0.9;
      clickRing.children.forEach((ch) => { ch.material.opacity = op; });
    } else clickRing.visible = false;

    syncEntities(t, dt);

    renderer.render(scene, camera);

    miniTimer -= dt;
    if (miniTimer <= 0) { miniTimer = 0.12; drawMinimap(); }
  }

  /* ============================================================
     MINIMAP (classic 2D)
     ============================================================ */
  function buildMinimapBase() {
    miniBase = document.createElement("canvas");
    miniBase.width = W; miniBase.height = H;
    const mctx = miniBase.getContext("2d");
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        mctx.fillStyle = (Sprites.TILES[map.tiles[y][x]] || { mini: "#000" }).mini;
        mctx.fillRect(x, y, 1, 1);
      }
  }

  function drawMinimap() {
    if (!miniBase || !Game.player) return;
    miniCtx.imageSmoothingEnabled = false;
    miniCtx.clearRect(0, 0, mini.width, mini.height);
    miniCtx.drawImage(miniBase, 0, 0, mini.width, mini.height);
    const sx = mini.width / W, sy = mini.height / H;
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
    miniCtx.strokeStyle = "#000";
    miniCtx.beginPath();
    miniCtx.arc(pl.px / T * sx + sx / 2, pl.py / T * sy + sy / 2, 2.6, 0, 7);
    miniCtx.fill();
  }

  /* ============================================================
     PICKING + WALKABILITY
     ============================================================ */
  function solidAt(x, y) {
    if (!map) return true;
    if (x < 0 || y < 0 || y >= H || x >= W) return true;
    const t = Sprites.TILES[map.tiles[y][x]];
    return !t || t.solid;
  }

  function ndcFromEvent(e) {
    const r = canvas.getBoundingClientRect();
    mouseNdc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouseNdc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    return mouseNdc;
  }

  function eventToTile(e) {
    raycaster.setFromCamera(ndcFromEvent(e), camera);
    const hits = raycaster.intersectObject(terrainMesh);
    if (!hits.length) return { x: -1, y: -1, px: -1, py: -1 };
    const pt = hits[0].point;
    return { x: Math.floor(pt.x), y: Math.floor(pt.z), px: (pt.x - 0.5) * T, py: (pt.z - 0.5) * T };
  }

  function entityAtEvent(e) {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const v = new THREE.Vector3();
    let best = null, bestD = Infinity;
    const test = (wx, wz, yMid, radius, payload) => {
      v.set(wx, heightAt(wx, wz) + yMid, wz).project(camera);
      if (v.z > 1) return;
      const sx = (v.x * 0.5 + 0.5) * r.width, sy = (-v.y * 0.5 + 0.5) * r.height;
      const d = Math.hypot(sx - mx, sy - my);
      const zoomScale = Math.max(0.6, Math.min(1.8, 11.5 / orbit.dist));
      if (d < radius * zoomScale && d < bestD) { best = payload; bestD = d; }
    };
    for (const n of Game.entities.npcs)
      test(n.x + 0.5, n.y + 0.5, 0.85, 34, { kind: "npc", ent: n });
    for (const en of Game.entities.enemies) {
      if (!en.alive) continue;
      test(pxToWorld(en.px), pxToWorld(en.py), 0.6, en.def.boss ? 55 : 36, { kind: "enemy", ent: en });
    }
    return best;
  }

  return {
    init, setMap, frame, fit, solidAt, eventToTile, entityAtEvent, remapDir, heightAt,
    get cam() { return { x: camTarget.x * T, y: camTarget.z * T }; }
  };
})();
