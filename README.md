# 🔥 Ashes of the First Kingdom

*A coding MMORPG. Learn real Python — or real C++ — by quest, blade, and flame.*

An old-school-MMO-styled game (RuneScape-inspired) where the language of magic is the one you choose.
Pick your faction (a programming language — **Python** or **C++**), take quests from NPCs, fight
monsters by answering questions, and defeat bosses by writing **real programs** that run in your
browser and are graded against test cases.

---

## ▶ How to Play

**Easiest:** double-click **`Play-Game.bat`** (starts a tiny local server and opens your browser).

**Or with Python directly:**
```
python serve.py
```
then open http://localhost:8000

**Or with no Python at all:** just open `index.html` in Chrome/Edge/Firefox.

> 🌐 An internet connection is needed for the *Trials of Code* — real Python runs in your browser
> via [Pyodide](https://pyodide.org) (CDN), and real C++ compiles on the [Wandbox](https://wandbox.org)
> forge. Everything else works offline. Saves are stored in your browser (localStorage), 3 character slots.

## 🎮 Controls

| Action | Input |
|---|---|
| Walk | **Click** the ground (golden ring marks the spot) or **WASD / arrows** (camera-relative) |
| Camera | **Right-drag / middle-drag** to orbit · **scroll wheel** to zoom |
| Talk / Fight | **Click** an NPC or monster (or press **E / Space** when adjacent) |
| Quest with **!** | That NPC has a new chapter for you |
| Sidebar tabs | Inventory 🎒 · Equipment ⚔ · Skills 📊 · Quests 📜 · Settings ⚙ |
| Re-read a lesson | Quest Journal → click the quest → your **Tome of Embers** |

## 🐍 The Python Chronicle — 23 chapters, 5 acts

| Act | Region | You learn |
|---|---|---|
| I | Ashveil Village | `print`, strings, variables, arithmetic, f-strings |
| II | Emberwood Forest | booleans, `if/elif/else`, `for`+`range`, `while` |
| III | The Sunken Ruins | lists, slices, `in`, dicts, sets, tuples, the tally pattern |
| IV | Kingsfall Citadel | functions, defaults, list comprehensions, classes & objects |
| V | The Flame Sanctum | nested loops & grids, sorting & lambdas, recursion |

Boss trials are full programs: **FizzBuzz** (Act II), **most-frequent-element** (Act III),
a **class with damage/heal logic** (Act IV), **Two Sum** (Act V), and the final boss —
**Longest Substring Without Repeating Characters**, a genuine LeetCode-medium.

## ⚙ The C++ Chronicle — 23 chapters, 5 acts

The **Iron Concord** teaches **real, idiomatic C++** across the same five regions — the world is
shared, but the Concord smith learns a different tongue (all trials compile on real GCC):

| Act | Region | You learn |
|---|---|---|
| I | Ashveil Village | `#include`, `cout`, `int`/`double` & integer division, `cin`, `std::string` |
| II | Emberwood Forest | `bool` & comparisons, `if/else if/else`, `for`, `while` |
| III | The Sunken Ruins | `std::vector`, measuring (`accumulate`/`max_element`/`find`), `unordered_map`, `set` |
| IV | Kingsfall Citadel | functions, default args & references, building vectors, `struct`/`class` & methods |
| V | The Flame Sanctum | nested loops & 2D `vector<vector<int>>`, `std::sort` & lambdas, recursion |

It ends on the same algorithms — FizzBuzz, most-frequent-element, a damage/heal class, **Two Sum**,
and the finale **Longest Substring Without Repeating Characters** — written as real C++ read from stdin.

## ⚔ How combat teaches

- Accepting a quest sears a **lesson** into your Tome.
- Each quest-monster kill reveals another **Tome fragment** (and asks you questions —
  correct answers strike with your weapon's damage, wrong answers cost HP).
- Quest complete → return to the NPC for a **Trial of Code**: a real editor, real tests,
  hints if you need them (first one's free).
- Bosses chain a question gauntlet into a final program — failed runs let the boss hit you!

## 🗡 Loot

Six rarities from **common** (Dull Blade) to **mythic** (The Eternal Brand). Legendary blades
of the old kingdom — Dawnpiercer, Cinderfall, Ashen Vow, The Kingless Blade, Sovereign's Ruin,
Flame of the Forgotten, Emberwake, Firstflame Edge — wait in boss hoards, rare drops, and the
deepest shops. Better weapons kill in fewer answers; armor blunts wrong answers; charms boost
XP and grant free hints.

## 🏰 The story

Thousands of years ago the First Kingdom united every race using the **Eternal Flame**.
When the Flame vanished, the kingdom collapsed. Now the Flame has returned — waking ancient
kings, dead armies and forgotten gods — and it has burned its mark into your hand.
At the end, the choice is yours: **restore** the kingdom, **destroy** the Flame, or **claim** it.

## 🧱 Tech

- Pure HTML/CSS/JS + a vendored copy of [Three.js](https://threejs.org) — no build step, no image assets.
  The world is a **low-poly 3D scene** (RuneScape-style) generated from the tile maps: vertex-painted
  terrain, merged prop geometry, animated water/lava shaders, per-act lighting & weather, and blocky
  3D characters whose portraits are rendered live into the 2D UI. Item icons are painted procedurally
  on canvas.
- Python execution & grading: Pyodide (CPython in WebAssembly) with a sandboxed test harness,
  per-test timeouts (infinite-loop protection), and friendly error reporting.
- C++ execution & grading: real GCC on the [Wandbox](https://wandbox.org) compiler service, with a
  stdin→stdout test harness, transient-overload retries, and friendly compile/runtime error reporting.
- Factions are data-driven — one quest file per language in `js/data/` (e.g. `cpp_act1.js`), tagged
  with a `faction` field. **Python** and **C++** ship full 23-chapter chronicles; JavaScript and Rust
  remain sealed. To verify C++ reference solutions: `python3 tools/grade_cpp_challenges.py`.
