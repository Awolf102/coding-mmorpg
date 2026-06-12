# 🔥 Ashes of the First Kingdom

*A coding MMORPG. Learn real Python by quest, blade, and flame.*

An old-school-MMO-styled game (RuneScape-inspired) where the language of magic is **Python**.
Pick your faction (a programming language), take quests from NPCs, fight monsters by
answering Python questions, and defeat bosses by writing **real Python programs** that run
in your browser and are graded against test cases.

---

## ▶ How to Play

**Easiest:** double-click **`Play-Game.bat`** (starts a tiny local server and opens your browser).

**Or with Python directly:**
```
python serve.py
```
then open http://localhost:8000

**Or with no Python at all:** just open `index.html` in Chrome/Edge/Firefox.

> 🌐 An internet connection is needed for the *Trials of Code* (the in-game Python editor) —
> real Python runs in your browser via [Pyodide](https://pyodide.org) loaded from a CDN.
> Everything else works offline. Saves are stored in your browser (localStorage), 3 character slots.

## 🎮 Controls

| Action | Input |
|---|---|
| Walk | **Click** the ground (yellow X marks the spot) or **WASD / arrows** |
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

- Pure HTML/CSS/JS — no build step, no dependencies, no image assets (all art is procedural canvas).
- Python execution & grading: Pyodide (CPython in WebAssembly) with a sandboxed test harness,
  per-test timeouts (infinite-loop protection), and friendly error reporting.
- More factions (JavaScript, C++, Rust) are data-driven: add a new quest file to `js/data/`.
