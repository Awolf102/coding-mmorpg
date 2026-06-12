/* ============================================================
   ACT V — THE FLAME SANCTUM: The Shape of Fire
   Nested loops, 2D grids, sorting & lambdas, recursion,
   and the final algorithm trials (Two Sum, Longest Substring)
   ============================================================ */
window.QUEST_DB.push(

/* ---------------- py19 : The Labyrinth of Coals ---------------- */
{
  id: "py19", act: 5, title: "The Labyrinth of Coals", npc: "herald", map: "sanctum",
  intro: [
    "You stand in the Sanctum, marked one. Beneath this floor sleeps the Eternal Flame — and between you and it, everything the Kingdom ever feared.",
    "The Flame Serpents in the north gallery slither in rows and columns — living grid-work. The Flame thinks in grids: maps, floors, legions. To read its mind, you must read grids.",
    "Scatter <b>5 Flame Serpents</b>, and learn the loop within the loop."
  ],
  acceptLabel: "I will walk the grid.",
  midDialogue: "The serpents still weave their rows and columns in the north gallery.",
  returnDialogue: [
    "The gallery is still. The grid lies bare.",
    "Now read one: the Labyrinth of Coals, mapped as rows of 0s and 1s. Count every live ember. The Flame is watching how you walk it."
  ],
  doneDialogue: "Row by row, cell by cell, nothing missed. The Flame stirred when you finished. It *noticed* you.",
  lesson: {
    title: "The Grid — Nested Loops & 2D Lists",
    body: [
      "A loop inside a loop: the outer picks a row, the inner walks it. Every combination happens:",
      ">>>for i in range(2):\n    for j in range(3):\n        print(i, j)\n# 0 0 / 0 1 / 0 2 / 1 0 / 1 1 / 1 2",
      "A **2D list** is a list of lists — a grid of rows:",
      ">>>grid = [[1, 0, 1],\n        [0, 1, 1]]\nprint(grid[0])      # [1, 0, 1] - the first ROW\nprint(grid[1][2])   # 1 - row 1, column 2",
      "`grid[row][col]` — row first, column second. Always.",
      "To visit every cell, nest the walks:",
      ">>>count = 0\nfor row in grid:\n    for cell in row:\n        if cell == 1:\n            count += 1\nprint(count)   # 4 embers alive",
      "This row-by-row sweep is how the Flame reads battlefields, dungeons, and hearts."
    ],
    fragments: [
      "**Fragment I** — Nested loops: the inner loop runs FULLY for each pass of the outer. 2 outer × 3 inner = 6 visits.",
      "**Fragment II** — A 2D list is rows in a list: `grid[0]` is the whole first row; `grid[r][c]` is one cell — row first, column second.",
      "**Fragment III** — The full sweep: `for row in grid:` then `for cell in row:`. Every cell, in reading order.",
      "**Fragment IV** — Combine the sweep with the counting shape: test each cell, `count += 1` on a match, return after BOTH loops close.",
      "**Fragment V** — `len(grid)` counts rows; `len(grid[0])` counts columns. A grid knows its own size."
    ]
  },
  kills: { enemy: "flame_serpent", count: 5 },
  questions: [
    { type: "output", q: "The full unrolling:", code: "for i in range(2):\n    for j in range(2):\n        print(i, j)",
      answer: "0 0\n0 1\n1 0\n1 1", why: "For each i, j runs its full course: 4 combinations." },
    { type: "mc", q: "In grid[r][c], which index comes first?",
      choices: ["The row", "The column", "Either works", "The diagonal"],
      answer: 0, why: "Row first, column second — grid[1][2] is row 1, column 2." },
    { type: "output", q: "Read the cell:", code: "grid = [[5, 6], [7, 8]]\nprint(grid[1][0])",
      answer: "7", why: "Row 1 is [7, 8]; its column 0 is 7." },
    { type: "output", q: "Sweep and count:", code: "g = [[1, 0], [1, 1]]\nc = 0\nfor row in g:\n    for cell in row:\n        c += cell\nprint(c)",
      answer: "3", why: "Adding every cell: 1+0+1+1 = 3. (Adding 0s and 1s IS counting the 1s.)" },
    { type: "mc", q: "How many times does the inner body run?", code: "for i in range(3):\n    for j in range(4):\n        ...",
      choices: ["12", "7", "3", "4"],
      answer: 0, why: "3 outer passes × 4 inner passes = 12." },
    { type: "output", q: "Rows are whole values:", code: "grid = [[9, 9], [2, 2], [5, 5]]\nprint(len(grid))",
      answer: "3", why: "len(grid) counts ROWS: there are 3." },
    { type: "fill", q: "Fill the blank to walk each cell of the current row:", code: "for row in grid:\n    for cell in ____:\n        print(cell)",
      answer: "row", why: "The inner loop walks the row the outer loop just picked." }
  ],
  challenge: {
    title: "Count the Living Embers",
    story: "The Herald unrolls a scorched map — the Labyrinth, drawn as 0s and 1s. \"Each 1 is an ember still burning. The Flame demands an exact count. It always demands exactness.\"",
    prompt: [
      "Define `count_embers(grid)`:",
      "— `grid` is a 2D list (a list of rows) of 0s and 1s.",
      "— Return how many cells are `1`.",
      "Examples:",
      ">>>count_embers([[1, 0], [0, 1]])           ->  2\ncount_embers([[0, 0, 0]])                ->  0\ncount_embers([[1, 1, 1], [1, 1, 1]])     ->  6"
    ],
    mode: "function",
    funcName: "count_embers",
    starter: "def count_embers(grid):\n    count = 0\n    # sweep every row, every cell\n    \n    return count\n",
    tests: [
      { args: [[[1, 0], [0, 1]]], expect: 2, label: "2x2 labyrinth" },
      { args: [[[0, 0, 0]]], expect: 0, label: "a cold corridor" },
      { args: [[[1, 1, 1], [1, 1, 1]]], expect: 6, label: "fully ablaze" },
      { args: [[[0, 1, 0], [1, 0, 1], [0, 1, 0]]], expect: 4, label: "the ember cross" }
    ],
    hints: [
      "Nest the loops: for row in grid: / for cell in row:",
      "Inside: if cell == 1: count += 1 (or simply count += cell).",
      "Full answer:\ndef count_embers(grid):\n    count = 0\n    for row in grid:\n        for cell in row:\n            if cell == 1:\n                count += 1\n    return count"
    ]
  },
  rewards: { xp: 420, coins: 120, items: [["aegis_of_the_first", 1]] }
},

/* ---------------- py20 : Order from Ash ---------------- */
{
  id: "py20", act: 5, title: "Order from Ash", npc: "herald", map: "sanctum",
  intro: [
    "The Pyre Sentinels in the south gallery were the Kingdom's adjudicators — they ranked everything. Soldiers by valor. Cities by worth. Kings by *flammability*, toward the end.",
    "They have begun ranking YOU, and their criteria are unkind.",
    "Topple <b>5 Pyre Sentinels</b>, and take their art: sorting — by any measure, in any order."
  ],
  acceptLabel: "Rank me when I'm done.",
  midDialogue: "The Sentinels still deliberate in the south gallery. Your current rank: 'unfinished'.",
  returnDialogue: [
    "Toppled. Their final verdict on you, before the end: 'promising'.",
    "Inherit their art, then: the champions of the old kingdom must be ranked once more, strongest first. The Flame will only speak to a properly sorted lineage."
  ],
  doneDialogue: "Order from ash — literally. The lineage is ranked and the Flame hums approval through the floor.",
  lesson: {
    title: "The Adjudicator's Art — Sorting & Lambdas",
    body: [
      "`sorted(lst)` returns a new sorted list, smallest first. `reverse=True` flips it:",
      ">>>print(sorted([3, 1, 2]))                # [1, 2, 3]\nprint(sorted([3, 1, 2], reverse=True))  # [3, 2, 1]",
      "(`lst.sort()` does the same but rearranges the list in place.)",
      "To sort by a *measure*, hand `sorted` a `key` — a function that extracts the measure from each item:",
      ">>>words = [\"oak\", \"a\", \"ember\"]\nprint(sorted(words, key=len))   # ['a', 'oak', 'ember'] - by length",
      "A **lambda** is a tiny unnamed function, perfect for keys:",
      ">>>double = lambda x: x * 2     # same as def double(x): return x * 2",
      "Pairs sort beautifully with lambdas — pick which slot to judge by:",
      ">>>champs = [[\"Bryn\", 12], [\"Sora\", 30]]\nby_power = sorted(champs, key=lambda c: c[1], reverse=True)\n# [['Sora', 30], ['Bryn', 12]] - strongest first",
      "Extract a column with a comprehension afterward: `[c[0] for c in by_power]` → just the names."
    ],
    fragments: [
      "**Fragment I** — `sorted(lst)` returns a NEW sorted list (original untouched). `lst.sort()` sorts in place. Both go smallest-first.",
      "**Fragment II** — `reverse=True` flips the verdict: largest first. The Sentinels' favorite direction.",
      "**Fragment III** — `key=` tells sorted what to measure: `sorted(words, key=len)` ranks by length, not alphabet.",
      "**Fragment IV** — `lambda x: expression` is a one-breath function. `lambda c: c[1]` plucks the second slot of a pair.",
      "**Fragment V** — The ranking rite: `sorted(pairs, key=lambda p: p[1], reverse=True)` — judge pairs by their second value, greatest first."
    ]
  },
  kills: { enemy: "pyre_sentinel", count: 5 },
  questions: [
    { type: "output", q: "The basic verdict:", code: "print(sorted([3, 1, 2]))",
      answer: "[1, 2, 3]", why: "sorted returns a new list, smallest first." },
    { type: "output", q: "Flip the verdict:", code: "print(sorted([3, 1, 2], reverse=True))",
      answer: "[3, 2, 1]", why: "reverse=True ranks largest first." },
    { type: "mc", q: "What does key=len do in sorted(words, key=len)?",
      choices: ["Sorts the words by their length", "Sorts alphabetically", "Removes long words", "Counts the words"],
      answer: 0, why: "key extracts the measure — here each word's length — and sorts by THAT." },
    { type: "output", q: "The one-breath function:", code: "f = lambda x: x + 10\nprint(f(5))",
      answer: "15", why: "lambda x: x + 10 is a tiny function; f(5) returns 15." },
    { type: "output", q: "Judge by the second slot:", code: "pairs = [[\"a\", 9], [\"b\", 2]]\nprint(sorted(pairs, key=lambda p: p[1]))",
      answer: "[['b', 2], ['a', 9]]", why: "Sorted by p[1] ascending: 2 before 9." },
    { type: "mc", q: "sorted(lst) vs lst.sort() — the difference?",
      choices: ["sorted returns a new list; .sort() rearranges the original", "They are identical", ".sort() is for strings only", "sorted is slower always"],
      answer: 0, why: "sorted leaves the original untouched and hands you a sorted copy." },
    { type: "fill", q: "Fill the blank to rank strongest-first:", code: "ranked = sorted(powers, ____=True)",
      answer: "reverse", why: "reverse=True sorts descending." }
  ],
  challenge: {
    title: "Rank the Champions",
    story: "The Herald lays out the lineage stones, each carved with a name and a power. \"Strongest first. Names only. The Flame reads lineages aloud, and it does not enjoy surprises.\"",
    prompt: [
      "Define `rank_champions(champions)`:",
      "— `champions` is a list of `[name, power]` pairs.",
      "— Return a list of just the **names**, ordered strongest (highest power) first.",
      "— No two champions share a power.",
      "Examples:",
      ">>>rank_champions([[\"Bryn\", 12], [\"Sora\", 30], [\"Edda\", 7]])\n->  [\"Sora\", \"Bryn\", \"Edda\"]\nrank_champions([[\"X\", 5], [\"Y\", 9]])   ->  [\"Y\", \"X\"]"
    ],
    mode: "function",
    funcName: "rank_champions",
    starter: "def rank_champions(champions):\n    # 1) sort the pairs by power (slot 1), strongest first\n    # 2) return just the names (slot 0)\n    \n",
    tests: [
      { args: [[["Bryn", 12], ["Sora", 30], ["Edda", 7]]], expect: ["Sora", "Bryn", "Edda"], label: "three champions" },
      { args: [[["A", 1]]], expect: ["A"], label: "a lineage of one" },
      { args: [[["X", 5], ["Y", 9]]], expect: ["Y", "X"], label: "two rivals" },
      { args: [[["Kael", 40], ["Maren", 40.5]]], expect: ["Maren", "Kael"], label: "a close contest" }
    ],
    hints: [
      "Sort first: ranked = sorted(champions, key=lambda c: c[1], reverse=True)",
      "Then extract names: return [c[0] for c in ranked]",
      "Full answer:\ndef rank_champions(champions):\n    ranked = sorted(champions, key=lambda c: c[1], reverse=True)\n    return [c[0] for c in ranked]"
    ]
  },
  rewards: { xp: 450, coins: 130, items: [["flame_of_the_forgotten", 1]] }
},

/* ---------------- py21 : The Rite of Return ---------------- */
{
  id: "py21", act: 5, title: "The Rite of Return", npc: "ilio", map: "sanctum",
  intro: [
    "Ah. You. Again. Or — no, forgive me. *First* time, for you. It blurs.",
    "I am Ilio. I have climbed this Sanctum many times, and each climb required a smaller climb, which required a smaller one still. Eventually a climb so small it simply... was done. Then all the climbs above it completed in reverse. You will understand shortly, or eventually, which is the same thing here.",
    "The Echoes of the First in the east gallery are unfinished returns — calls that never found their base case. Complete <b>5 Echoes of the First</b>, and learn the Rite of Return: <b>recursion</b>."
  ],
  acceptLabel: "I will return. And return.",
  midDialogue: "The Echoes still call out in the east gallery, waiting for their base case. Be it.",
  returnDialogue: [
    "The Echoes rest. Their calls finally returned.",
    "Now the rite itself: the Flame Chain — each link's power forged from all the links before it. Write the function that calls itself, and trust it."
  ],
  doneDialogue: "You wrote a function that believes in itself. That is the entire trick, and most people never learn it.",
  lesson: {
    title: "The Rite of Return — Recursion",
    body: [
      "A **recursive** function calls *itself* — each call on a smaller piece, until one is small enough to answer directly:",
      ">>>def countdown(n):\n    if n == 0:           # BASE CASE - answer directly, no call\n        print(\"Ignite!\")\n        return\n    print(n)\n    countdown(n - 1)     # RECURSIVE CASE - a smaller self\n\ncountdown(3)   # 3, 2, 1, Ignite!",
      "Two sacred parts:",
      "**The base case** — the smallest question, answered without recursion. Without it, the calls never stop (RecursionError — the Echo's curse).",
      "**The recursive case** — do one piece, delegate the rest to a *smaller* call.",
      "The classic: factorial. `5! = 5 × 4 × 3 × 2 × 1`:",
      ">>>def fact(n):\n    if n <= 1:\n        return 1            # base case\n    return n * fact(n - 1)  # n times the smaller answer\n\nprint(fact(4))   # 24",
      "Trace it like a stack of scrolls: `fact(4)` waits on `fact(3)` waits on `fact(2)` waits on `fact(1)`→1. Then they resolve upward: 2×1=2, 3×2=6, 4×6=24.",
      "Trust the recursion: assume the smaller call is already correct, and just do YOUR one step."
    ],
    fragments: [
      "**Fragment I** — Recursion = a function calling itself on a smaller problem. Smaller every time, or it never ends.",
      "**Fragment II** — The base case answers the tiniest question directly: `if n <= 1: return 1`. It is the floor the whole tower stands on.",
      "**Fragment III** — The recursive case does ONE step and delegates: `return n * fact(n - 1)`. Don't compute the whole thing — compute your slice.",
      "**Fragment IV** — Trace fact(3): fact(3) → 3 * fact(2) → 3 * (2 * fact(1)) → 3 * (2 * 1) = 6. Calls go down; answers climb back up.",
      "**Fragment V** — Trust the rite: assume fact(n-1) is already right. Your only duty is combining it with n. (This is the part Ilio says everyone fights.)"
    ]
  },
  kills: { enemy: "echo_first", count: 5 },
  questions: [
    { type: "mc", q: "What is a base case?",
      choices: ["The condition where the function answers WITHOUT calling itself", "The first call", "The largest input", "A type of loop"],
      answer: 0, why: "The base case stops the descent — the smallest question, answered directly." },
    { type: "output", q: "Trace the descent:", code: "def f(n):\n    if n <= 1:\n        return 1\n    return n * f(n - 1)\n\nprint(f(3))",
      answer: "6", why: "f(3) = 3 * f(2) = 3 * 2 * f(1) = 3 * 2 * 1 = 6." },
    { type: "mc", q: "What happens with NO base case?",
      choices: ["The calls never stop — RecursionError", "It returns 0", "Python adds one automatically", "It runs once"],
      answer: 0, why: "Without a floor, the function calls itself forever until Python halts it." },
    { type: "output", q: "The echo speaks:", code: "def echo(n):\n    if n == 0:\n        return \"!\"\n    return \"ash\" + echo(n - 1)\n\nprint(echo(2))",
      answer: "ashash!", why: "echo(2) = \"ash\" + echo(1) = \"ash\" + \"ash\" + echo(0) = \"ashash!\"." },
    { type: "fill", q: "Fill the blank — the recursive case must shrink:", code: "def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(____)",
      answer: "n - 1", accept: ["n-1", "n - 1"], why: "Each call must be smaller: fact(n - 1)." },
    { type: "output", q: "Sum by rite:", code: "def total(n):\n    if n == 0:\n        return 0\n    return n + total(n - 1)\n\nprint(total(4))",
      answer: "10", why: "4+3+2+1+0 = 10." },
    { type: "mc", q: "Which problems suit recursion best?",
      choices: ["Problems made of smaller copies of themselves", "Problems with no structure", "Only math problems", "Problems with exactly two steps"],
      answer: 0, why: "Self-similar problems — trees, nested data, divide-and-conquer — are recursion's home." }
  ],
  challenge: {
    title: "Forge the Flame Chain",
    story: "Ilio holds up a chain of n links. \"Each link's power is its number times the power of all links before it. Link 1 has power 1. So does link 0 — the empty chain burns at 1, don't ask, it's load-bearing. Forge the function.\"",
    prompt: [
      "Define `flame_chain(n)` **recursively**:",
      "— If `n` is 1 or less: return `1` (the base case).",
      "— Otherwise: return `n * flame_chain(n - 1)`.",
      "(Yes — this is the factorial, the First Kingdom's favorite rite.)",
      "Examples:",
      ">>>flame_chain(1)   ->  1\nflame_chain(4)   ->  24\nflame_chain(6)   ->  720\nflame_chain(0)   ->  1"
    ],
    mode: "function",
    funcName: "flame_chain",
    starter: "def flame_chain(n):\n    # base case: n <= 1 -> 1\n    # recursive case: n * flame_chain(n - 1)\n    \n",
    tests: [
      { args: [1], expect: 1, label: "one link" },
      { args: [4], expect: 24, label: "four links" },
      { args: [6], expect: 720, label: "six links" },
      { args: [0], expect: 1, label: "the empty chain" }
    ],
    hints: [
      "Two lines of logic: if n <= 1: return 1, then the recursive return.",
      "The recursive case: return n * flame_chain(n - 1) — trust the smaller call.",
      "Full answer:\ndef flame_chain(n):\n    if n <= 1:\n        return 1\n    return n * flame_chain(n - 1)"
    ]
  },
  rewards: { xp: 480, coins: 140, items: [["firstflame_edge", 1]] }
},

/* ---------------- py22 : BOSS — The Twin Flames ---------------- */
{
  id: "py22", act: 5, title: "The Twin Flames", npc: "herald", map: "sanctum", boss: true,
  bossEnemy: "boss_twin_flame", bossSpot: { map: "sanctum", x: 33, y: 8 },
  intro: [
    "The Flame is testing you directly now. It has split two of itself onto the lava isle — the Twin Flames, who burn only as a PAIR.",
    "The old riddle: among many runes, exactly two together equal the target power. Find WHERE they stand — their positions, not their values.",
    "This riddle guarded the Flame's heart for a thousand years. Solve it on the <b>lava isle</b>, north."
  ],
  acceptLabel: "I will find the pair.",
  midDialogue: "The Twins dance on the lava isle, always exactly two, always summing to something.",
  returnDialogue: ["The Twin Flames burn on the lava isle, north across the bridge."],
  doneDialogue: "The Twins bow and merge. One trial remains, marked one — and it is the King himself.",
  lesson: {
    title: "Trial of the Twins (Recap)",
    body: [
      "The Twins' riddle is the kingdom's oldest: **two runes that sum to a target — return their indices**.",
      "The honest way — check every pair with nested loops:",
      ">>>for i in range(len(runes)):\n    for j in range(i + 1, len(runes)):\n        if runes[i] + runes[j] == target:\n            return [i, j]",
      "Note `range(i + 1, ...)`: j always walks AHEAD of i — no pair checked twice, no rune paired with itself.",
      "The elegant way — one pass with a dict of 'seen' runes: for each rune, ask if its *partner* (`target - rune`) was already seen:",
      ">>>seen = {}                       # value -> index\nfor i in range(len(runes)):\n    partner = target - runes[i]\n    if partner in seen:\n        return [seen[partner], i]\n    seen[runes[i]] = i",
      "Either way wins. The dict way is the one the Flame whispers about."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The Twins hum: 'Walk the pairs.'", code: "for i in range(3):\n    for j in range(i + 1, 3):\n        print(i, j)",
      answer: "0 1\n0 2\n1 2", why: "j starts past i: each pair appears exactly once." },
    { type: "mc", q: "'For rune 7 and target 9, what partner do you seek?'",
      choices: ["2, because 9 - 7 = 2", "7", "9", "16"],
      answer: 0, why: "The partner is target minus the rune: 9 - 7 = 2." },
    { type: "output", q: "'Has my partner passed this way?'", code: "seen = {\"5\": 0}\nprint(\"5\" in seen)",
      answer: "True", why: "in checks a dict's keys — the 'seen' pattern's heartbeat." },
    { type: "mc", q: "'Why does j begin at i + 1, not 0?'",
      choices: ["So no rune pairs with itself and no pair is checked twice", "It is faster to type", "j must always be odd", "No reason"],
      answer: 0, why: "Starting past i means each unordered pair is visited exactly once." }
  ],
  challenge: {
    title: "The Riddle of the Twin Marks",
    story: "The Twin Flames coil around each other. \"AMONG THE RUNES,\" they roar in unison, \"TWO OF US SUM TO THE TARGET. NAME OUR PLACES — THE EARLIER FIRST.\"",
    prompt: [
      "Define `twin_marks(runes, target)`:",
      "— `runes` is a list of ints; `target` is an int.",
      "— **Exactly one pair** of positions i < j satisfies `runes[i] + runes[j] == target`.",
      "— Return `[i, j]` — the two **indices**, smaller index first.",
      "Examples:",
      ">>>twin_marks([2, 7, 11, 15], 9)   ->  [0, 1]   (2 + 7 = 9)\ntwin_marks([3, 2, 4], 6)        ->  [1, 2]   (2 + 4 = 6)\ntwin_marks([3, 3], 6)           ->  [0, 1]",
      "(Yes, adventurer — this is the fabled Two Sum. You are ready.)"
    ],
    mode: "function",
    funcName: "twin_marks",
    starter: "def twin_marks(runes, target):\n    # find the two indices whose runes sum to target\n    # nested loops work; the dict of 'seen' runes is elegant\n    \n",
    tests: [
      { args: [[2, 7, 11, 15], 9], expect: [0, 1], label: "the classic" },
      { args: [[3, 2, 4], 6], expect: [1, 2], label: "not always the first two" },
      { args: [[3, 3], 6], expect: [0, 1], label: "twin twins" },
      { args: [[1, 5, 9, 13], 22], expect: [2, 3], label: "deep in the list" },
      { args: [[5, 75, 25], 100], expect: [1, 2], label: "the vault code" }
    ],
    hints: [
      "Nested loops: for i in range(len(runes)): for j in range(i + 1, len(runes)): if they sum to target, return [i, j].",
      "Dict way: keep seen = {value: index}; for each rune ask if (target - rune) is in seen.",
      "Full answer (either works):\ndef twin_marks(runes, target):\n    seen = {}\n    for i in range(len(runes)):\n        partner = target - runes[i]\n        if partner in seen:\n            return [seen[partner], i]\n        seen[runes[i]] = i"
    ]
  },
  rewards: { xp: 1200, coins: 400, items: [["last_crown", 1], ["phoenix_draught", 2]], title: "Twinsbane" }
},

/* ---------------- py23 : FINAL BOSS — The First King Ascendant ---------------- */
{
  id: "py23", act: 5, title: "The First King Ascendant", npc: "herald", map: "sanctum", boss: true,
  bossEnemy: "boss_first_king", bossSpot: { map: "sanctum", x: 36, y: 20 },
  intro: [
    "He has risen. The First King stands at the dais of the Eternal Flame, wearing a thousand years of dust like a coronation robe.",
    "He speaks only in the Verse of Ascension — the incantation that united every race under one banner. But his verse has *rotted*: letters repeat, and a repeated letter breaks the casting.",
    "Find the longest **clean** stretch of his verse — no letter repeated — and the casting fails. Everything you have learned, marked one. All of it. At the <b>dais</b>.",
    "Whatever you choose to do with the Flame after... that choice is yours alone."
  ],
  acceptLabel: "I am ready to end this.",
  midDialogue: "The King chants at the dais. The verse rots as he speaks it. Hurry.",
  returnDialogue: ["The First King awaits at the dais of the Eternal Flame."],
  doneDialogue: "It is done. The King kneels, the Flame is unbound — and it is asking for YOU.",
  lesson: {
    title: "Trial of Ascension (Recap)",
    body: [
      "The final riddle: in a string, find the length of the **longest substring with no repeated characters**.",
      ">>>\"abcabcbb\"  ->  3   (\"abc\")\n\"bbbbb\"     ->  1   (\"b\")\n\"pwwkew\"    ->  3   (\"wke\" - substring, not subsequence!)",
      "The honest way — test every starting point, extend with a `set` until a repeat:",
      ">>>best = 0\nfor i in range(len(s)):\n    seen = set()\n    for ch in s[i:]:\n        if ch in seen:\n            break\n        seen.add(ch)\n    best = max(best, len(seen))",
      "The elegant way — the **sliding window**: one pass, two fingers. When the right finger meets a repeat, the left finger slides past the old copy:",
      ">>>last = {}      # char -> last index seen\nstart = 0      # left edge of the clean window\nbest = 0\nfor i, ch in enumerate(s):\n    if ch in last and last[ch] >= start:\n        start = last[ch] + 1     # slide past the old copy\n    last[ch] = i\n    best = max(best, i - start + 1)",
      "Both pass the King's trial. Sets, dicts, loops, max — every lesson, one verse."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The King intones: 'What does my set remember?'", code: "seen = set()\nfor ch in \"aba\":\n    if ch in seen:\n        break\n    seen.add(ch)\nprint(len(seen))",
      answer: "2", why: "a, then b; the second a triggers the break. The set holds {a, b}." },
    { type: "mc", q: "'A SUBSTRING of my verse is...'",
      choices: ["A contiguous run of characters", "Any characters in any order", "Only the first half", "A single character"],
      answer: 0, why: "Substrings are unbroken stretches — \"wke\" in \"pwwkew\", never \"pwk\"." },
    { type: "output", q: "'Track the greatest so far.'", code: "best = 0\nfor n in [3, 1, 5, 2]:\n    best = max(best, n)\nprint(best)",
      answer: "5", why: "max(best, n) keeps the running peak: 3, 3, 5, 5." },
    { type: "output", q: "'Read my positions.'", code: "for i, ch in enumerate(\"ash\"):\n    print(i, ch)",
      answer: "0 a\n1 s\n2 h", why: "enumerate yields index and character together." },
    { type: "mc", q: "'When my verse repeats a letter, your window must...'",
      choices: ["Slide its start past the previous copy of that letter", "Reset to empty always", "Stop entirely", "Skip the letter"],
      answer: 0, why: "The window stays clean by moving its left edge just past the old occurrence." }
  ],
  challenge: {
    title: "The Verse of Ascension",
    story: "The First King raises the Flame, and the rotten verse pours out in fire. \"MEASURE IT,\" he commands. \"THE LONGEST CLEAN BREATH OF MY VERSE — OR KNEEL.\"",
    prompt: [
      "Define `clean_verse(s)`:",
      "— `s` is a string (possibly empty).",
      "— Return the **length** of the longest substring of `s` containing **no repeated characters**.",
      "Examples:",
      ">>>clean_verse(\"abcabcbb\")   ->  3   (\"abc\")\nclean_verse(\"bbbbb\")      ->  1\nclean_verse(\"pwwkew\")     ->  3   (\"wke\")\nclean_verse(\"\")           ->  0",
      "This is the King's own trial — a true medium-rank riddle from the world beyond. Brute force with sets passes; the sliding window honors him."
    ],
    mode: "function",
    funcName: "clean_verse",
    starter: "def clean_verse(s):\n    # longest substring without repeating characters\n    # honest way: for each start, extend with a set until a repeat\n    # elegant way: sliding window with a dict of last positions\n    \n",
    tests: [
      { args: ["abcabcbb"], expect: 3, label: "abcabcbb -> 3" },
      { args: ["bbbbb"], expect: 1, label: "bbbbb -> 1" },
      { args: ["pwwkew"], expect: 3, label: "pwwkew -> 3" },
      { args: [""], expect: 0, label: "the empty verse" },
      { args: ["firstking"], expect: 7, label: "firstking -> 7 (rstking)" },
      { args: ["au"], expect: 2, label: "au -> 2" }
    ],
    hints: [
      "Brute force: loop every start i; walk forward adding chars to a set; break on a repeat; track the best length with max().",
      "Sliding window: keep last = {char: index} and a window start; on a repeat inside the window, move start past the old copy; best = max(best, i - start + 1).",
      "Full answer (brute force):\ndef clean_verse(s):\n    best = 0\n    for i in range(len(s)):\n        seen = set()\n        for ch in s[i:]:\n            if ch in seen:\n                break\n            seen.add(ch)\n        best = max(best, len(seen))\n    return best"
    ]
  },
  rewards: { xp: 3000, coins: 1000, items: [["eternal_brand", 1]], title: "Flamebearer", final: true }
}
);
