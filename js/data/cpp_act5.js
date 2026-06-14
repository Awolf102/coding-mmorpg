/* ============================================================
   ACT V — THE FLAME SANCTUM: The Shape of Fire  (C++ Chronicle)
   Nested loops & 2D vectors, sort & lambdas, recursion,
   and the final algorithm trials (Two Sum, Longest Substring)
   ============================================================ */
window.QUEST_DB.push(

/* ---------------- cpp19 : The Labyrinth of Coals ---------------- */
{
  id: "cpp19", faction: "cpp", act: 5, title: "The Labyrinth of Coals", npc: "herald", map: "sanctum",
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
    title: "The Grid — Nested Loops & 2D Vectors",
    body: [
      "A loop inside a loop: the outer picks a row, the inner walks it. Every combination happens:",
      ">>>for (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 3; j++) {\n        cout << i << \" \" << j << \"\\n\";\n    }\n}\n// 0 0 / 0 1 / 0 2 / 1 0 / 1 1 / 1 2",
      "A **2D grid** is a vector of vectors — `vector<vector<int>>`, a list of rows:",
      ">>>vector<vector<int>> grid = {{1, 0, 1},\n                          {0, 1, 1}};\ncout << grid[1][2];   // 1 - row 1, column 2",
      "`grid[row][col]` — row first, column second. Always. `grid.size()` counts rows; `grid[0].size()` counts columns.",
      "To visit every cell, nest the walks — a range-for over rows, then over each row's cells:",
      ">>>int count = 0;\nfor (const auto& row : grid) {\n    for (int cell : row) {\n        if (cell == 1) count++;\n    }\n}\ncout << count;   // 4",
      "This row-by-row sweep is how the Flame reads battlefields, dungeons, and hearts."
    ],
    fragments: [
      "**Fragment I** — Nested loops: the inner loop runs FULLY for each pass of the outer. 2 outer × 3 inner = 6 visits.",
      "**Fragment II** — A 2D grid is `vector<vector<int>>`. `grid[r][c]` is one cell — row first, column second.",
      "**Fragment III** — The full sweep: `for (const auto& row : grid)` then `for (int cell : row)`. Every cell, in reading order.",
      "**Fragment IV** — `grid.size()` counts rows; `grid[0].size()` counts columns. A grid knows its own size."
    ]
  },
  kills: { enemy: "flame_serpent", count: 5 },
  questions: [
    { type: "output", q: "The full unrolling:", code: "for (int i = 0; i < 2; i++)\n    for (int j = 0; j < 2; j++)\n        cout << i << \" \" << j << \"\\n\";",
      answer: "0 0\n0 1\n1 0\n1 1", why: "For each i, j runs its full course: 4 combinations." },
    { type: "mc", q: "In grid[r][c], which index comes first?",
      choices: ["The row", "The column", "Either works", "The diagonal"],
      answer: 0, why: "Row first, column second — grid[1][2] is row 1, column 2." },
    { type: "output", q: "Read the cell:", code: "vector<vector<int>> g = {{5, 6}, {7, 8}};\ncout << g[1][0];",
      answer: "7", why: "Row 1 is {7, 8}; its column 0 is 7." },
    { type: "output", q: "Sweep and add:", code: "vector<vector<int>> g = {{1, 0}, {1, 1}};\nint c = 0;\nfor (auto& row : g)\n    for (int cell : row)\n        c += cell;\ncout << c;",
      answer: "3", why: "Adding every cell: 1+0+1+1 = 3. (Summing 0s and 1s counts the 1s.)" },
    { type: "mc", q: "How many times does the inner body run? (outer i < 3, inner j < 4)",
      choices: ["12", "7", "3", "4"],
      answer: 0, why: "3 outer passes × 4 inner passes = 12." },
    { type: "output", q: "Count the rows:", code: "vector<vector<int>> g = {{9, 9}, {2, 2}, {5, 5}};\ncout << g.size();",
      answer: "3", why: "g.size() counts ROWS: there are 3." },
    { type: "fill", q: "Fill the blank to walk each cell of the current row:", code: "for (auto& row : grid)\n    for (int cell : ____)\n        cout << cell;",
      answer: "row", why: "The inner loop walks the row the outer loop just picked." }
  ],
  challenge: {
    title: "Count the Living Embers",
    story: "The Herald unrolls a scorched map — the Labyrinth, drawn as 0s and 1s. \"Each 1 is an ember still burning. The Flame demands an exact count. It always demands exactness.\"",
    prompt: [
      "Input: line 1 is `rows cols`; then `rows` lines, each with `cols` numbers (0 or 1). The starter reads it into a `vector<vector<int>>`.",
      "Print one number: how many cells are `1`.",
      ">>>2 2\n1 0\n0 1\n->  2",
      "Sweep every row, every cell."
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int rows, cols;\n    cin >> rows >> cols;\n    vector<vector<int>> grid(rows, vector<int>(cols));\n    for (int r = 0; r < rows; r++)\n        for (int c = 0; c < cols; c++)\n            cin >> grid[r][c];\n    // count how many cells are 1, then print the count\n\n    return 0;\n}\n",
    tests: [
      { stdin: "2 2\n1 0\n0 1", expectOut: "2", label: "2x2 labyrinth" },
      { stdin: "1 3\n0 0 0", expectOut: "0", label: "a cold corridor" },
      { stdin: "2 3\n1 1 1\n1 1 1", expectOut: "6", label: "fully ablaze" },
      { stdin: "3 3\n0 1 0\n1 0 1\n0 1 0", expectOut: "4", label: "the ember cross" }
    ],
    hints: [
      "Nest the sweep: for (auto& row : grid) for (int cell : row) if (cell == 1) count++;",
      "Declare count = 0 before the loops; print it after both close.",
      "Full answer:\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int rows, cols;\n    cin >> rows >> cols;\n    vector<vector<int>> grid(rows, vector<int>(cols));\n    for (int r = 0; r < rows; r++)\n        for (int c = 0; c < cols; c++)\n            cin >> grid[r][c];\n    int count = 0;\n    for (const auto& row : grid)\n        for (int cell : row)\n            if (cell == 1) count++;\n    cout << count << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 420, coins: 120, items: [["aegis_of_the_first", 1]] }
},

/* ---------------- cpp20 : Order from Ash ---------------- */
{
  id: "cpp20", faction: "cpp", act: 5, title: "Order from Ash", npc: "herald", map: "sanctum",
  intro: [
    "The Pyre Sentinels in the south gallery were the Kingdom's adjudicators — they ranked everything. Soldiers by valor. Cities by worth. Kings by *flammability*, toward the end.",
    "They have begun ranking YOU, and their criteria are unkind.",
    "Topple <b>5 Pyre Sentinels</b>, and take their art: sorting — by any measure, in any order."
  ],
  acceptLabel: "Rank me when I'm done.",
  midDialogue: "The Sentinels still deliberate in the south gallery. Your current rank: 'unfinished'.",
  returnDialogue: [
    "Toppled. Their final verdict on you, before the end: 'promising'.",
    "Inherit their art: the champions of the old kingdom must be ranked once more, strongest first. The Flame will only speak to a properly sorted lineage."
  ],
  doneDialogue: "Order from ash — literally. The lineage is ranked and the Flame hums approval through the floor.",
  lesson: {
    title: "The Adjudicator's Art — sort & Lambdas",
    body: [
      "`sort` (from `#include <algorithm>`) rearranges a vector **in place**, smallest first:",
      ">>>vector<int> v = {3, 1, 2};\nsort(v.begin(), v.end());\n// v is now {1, 2, 3}",
      "To sort by your own rule, hand `sort` a **comparator** — a function `(a, b)` that returns true if a should come BEFORE b. A **lambda** is a tiny inline function, perfect for this:",
      ">>>sort(v.begin(), v.end(), [](int a, int b) {\n    return a > b;   // bigger first -> descending\n});",
      "Read `[](int a, int b) { ... }` as 'an unnamed function taking a and b'. The `[]` is where every lambda begins.",
      "Pairs and structs sort beautifully — pick which field to judge by. `pair<string,int> p` holds `p.first` and `p.second`:",
      ">>>vector<pair<string,int>> champs = {{\"Bryn\", 12}, {\"Sora\", 30}};\nsort(champs.begin(), champs.end(), [](const auto& a, const auto& b) {\n    return a.second > b.second;   // by power, strongest first\n});\n// {\"Sora\", 30}, {\"Bryn\", 12}"
    ],
    fragments: [
      "**Fragment I** — `sort(v.begin(), v.end());` sorts in place, smallest first. It rearranges the original vector.",
      "**Fragment II** — A comparator `[](int a, int b){ return a > b; }` flips to descending: it says a comes before b when a is bigger.",
      "**Fragment III** — A lambda `[](params){ body }` is a tiny unnamed function. The `[]` starts it; pass it straight to sort.",
      "**Fragment IV** — `pair<string,int>` bundles two values: `.first` and `.second`. Sort pairs by `.second` to rank by the second field."
    ]
  },
  kills: { enemy: "pyre_sentinel", count: 5 },
  questions: [
    { type: "output", q: "The basic verdict:", code: "vector<int> v = {3, 1, 2};\nsort(v.begin(), v.end());\nfor (int x : v) cout << x;",
      answer: "123", why: "sort rearranges in place, smallest first: 1 2 3 -> 123." },
    { type: "output", q: "Flip the verdict:", code: "vector<int> v = {3, 1, 2};\nsort(v.begin(), v.end(), [](int a, int b){ return a > b; });\nfor (int x : v) cout << x;",
      answer: "321", why: "The comparator a > b sorts descending: 3 2 1." },
    { type: "mc", q: "What is a lambda?",
      choices: ["A tiny unnamed function written inline", "A type of vector", "A loop", "A header file"],
      answer: 0, why: "A lambda [](params){body} is an inline, unnamed function — ideal as a comparator." },
    { type: "mc", q: "A sort comparator returns true when...",
      choices: ["the first argument should come BEFORE the second", "the arguments are equal", "the vector is sorted", "always"],
      answer: 0, why: "sort uses the comparator to decide ordering: true means 'a before b'." },
    { type: "output", q: "Reach into a pair:", code: "pair<string,int> p = {\"ash\", 9};\ncout << p.second;",
      answer: "9", why: "p.second is the second value of the pair: 9." },
    { type: "fill", q: "Fill the blank to sort descending:", code: "sort(v.begin(), v.end(), [](int a, int b){ return a ____ b; });",
      answer: ">", accept: [">"], why: "a > b means bigger comes first — descending order." },
    { type: "mc", q: "sort(v.begin(), v.end()) changes what?",
      choices: ["The vector itself, in place", "A sorted copy it returns", "Nothing", "Only the first element"],
      answer: 0, why: "sort rearranges the original vector in place; it does not return a copy." }
  ],
  challenge: {
    title: "Rank the Champions",
    story: "The Herald lays out the lineage stones, each carved with a name and a power. \"Strongest first. Names only. The Flame reads lineages aloud, and it does not enjoy surprises.\"",
    prompt: [
      "Input: line 1 `n`; the next `n` lines each give `name power` (name one word, power an int). No two share a power. The starter reads them into pairs.",
      "Print the champions' **names**, strongest (highest power) first, one per line.",
      ">>>Bryn 12, Sora 30, Edda 7  ->  Sora / Bryn / Edda",
      "Sort the pairs by power descending with a lambda, then print the names."
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<pair<string, int>> champs(n);\n    for (int i = 0; i < n; i++) cin >> champs[i].first >> champs[i].second;\n    // sort by power (the .second) strongest first, then print each name on its own line\n\n    return 0;\n}\n",
    tests: [
      { stdin: "3\nBryn 12\nSora 30\nEdda 7", expectOut: "Sora\nBryn\nEdda", label: "three champions" },
      { stdin: "1\nA 1", expectOut: "A", label: "a lineage of one" },
      { stdin: "2\nX 5\nY 9", expectOut: "Y\nX", label: "two rivals" },
      { stdin: "2\nKael 40\nMaren 41", expectOut: "Maren\nKael", label: "a close contest" }
    ],
    hints: [
      "sort(champs.begin(), champs.end(), [](const auto& a, const auto& b){ return a.second > b.second; });",
      "Then: for (const auto& c : champs) cout << c.first << \"\\n\";",
      "Full answer:\n#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<pair<string, int>> champs(n);\n    for (int i = 0; i < n; i++) cin >> champs[i].first >> champs[i].second;\n    sort(champs.begin(), champs.end(), [](const auto& a, const auto& b) {\n        return a.second > b.second;\n    });\n    for (const auto& c : champs) cout << c.first << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 450, coins: 130, items: [["flame_of_the_forgotten", 1]] }
},

/* ---------------- cpp21 : The Rite of Return ---------------- */
{
  id: "cpp21", faction: "cpp", act: 5, title: "The Rite of Return", npc: "ilio", map: "sanctum",
  intro: [
    "Ah. You. Again. Or — no, forgive me. *First* time, for you. It blurs.",
    "I am Ilio. I have climbed this Sanctum many times, and each climb required a smaller climb, which required a smaller one still. Eventually a climb so small it simply... was done. Then all the climbs above it completed in reverse.",
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
      ">>>void countdown(int n) {\n    if (n == 0) {        // BASE CASE - answer directly, no call\n        cout << \"Ignite!\\n\";\n        return;\n    }\n    cout << n << \"\\n\";\n    countdown(n - 1);    // RECURSIVE CASE - a smaller self\n}\n// countdown(3): 3, 2, 1, Ignite!",
      "Two sacred parts. **The base case** — the smallest question, answered without recursion. Without it, the calls never stop (a stack overflow — the Echo's curse).",
      "**The recursive case** — do one piece, delegate the rest to a *smaller* call.",
      "The classic: factorial. `5! = 5 * 4 * 3 * 2 * 1`:",
      ">>>long long fact(int n) {\n    if (n <= 1) return 1;       // base case\n    return n * fact(n - 1);     // n times the smaller answer\n}\ncout << fact(4);   // 24",
      "Trace it: `fact(4)` waits on `fact(3)` waits on `fact(2)` waits on `fact(1)` -> 1. Then they resolve upward: 2*1=2, 3*2=6, 4*6=24. Trust the smaller call to be correct — just do YOUR one step."
    ],
    fragments: [
      "**Fragment I** — Recursion = a function calling itself on a smaller problem. Smaller every time, or it never ends.",
      "**Fragment II** — The base case answers the tiniest question directly: `if (n <= 1) return 1;`. It is the floor the whole tower stands on.",
      "**Fragment III** — The recursive case does ONE step and delegates: `return n * fact(n - 1);`. Compute your slice, not the whole thing.",
      "**Fragment IV** — Trace fact(3): 3 * fact(2) -> 3 * (2 * fact(1)) -> 3 * 2 * 1 = 6. Calls go down; answers climb back up. Trust the smaller call."
    ]
  },
  kills: { enemy: "echo_first", count: 5 },
  questions: [
    { type: "mc", q: "What is a base case?",
      choices: ["The condition where the function answers WITHOUT calling itself", "The first call", "The largest input", "A type of loop"],
      answer: 0, why: "The base case stops the descent — the smallest question, answered directly." },
    { type: "output", q: "Trace the descent:", code: "long long f(int n) {\n    if (n <= 1) return 1;\n    return n * f(n - 1);\n}\nint main() { cout << f(3); }",
      answer: "6", why: "f(3) = 3 * f(2) = 3 * 2 * f(1) = 3 * 2 * 1 = 6." },
    { type: "mc", q: "What happens with NO base case?",
      choices: ["The calls never stop — a stack overflow", "It returns 0", "C++ adds one automatically", "It runs once"],
      answer: 0, why: "Without a floor, the function calls itself forever until the stack overflows." },
    { type: "output", q: "Sum by rite:", code: "int total(int n) {\n    if (n == 0) return 0;\n    return n + total(n - 1);\n}\nint main() { cout << total(4); }",
      answer: "10", why: "4 + 3 + 2 + 1 + 0 = 10." },
    { type: "fill", q: "Fill the blank — the recursive case must shrink:", code: "long long fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(____);\n}",
      answer: "n - 1", accept: ["n-1", "n - 1"], why: "Each call must be smaller: fact(n - 1)." },
    { type: "output", q: "The echo grows:", code: "int echo(int n) {\n    if (n == 0) return 0;\n    return 2 + echo(n - 1);\n}\nint main() { cout << echo(3); }",
      answer: "6", why: "2 + 2 + 2 + 0 = 6: three additions of 2." },
    { type: "mc", q: "Which problems suit recursion best?",
      choices: ["Problems made of smaller copies of themselves", "Problems with no structure", "Only math problems", "Problems with exactly two steps"],
      answer: 0, why: "Self-similar problems — trees, nested data, divide-and-conquer — are recursion's home." }
  ],
  challenge: {
    title: "Forge the Flame Chain",
    story: "Ilio holds up a chain of n links. \"Each link's power is its number times the power of all links before it. Link 1 has power 1. So does link 0 — the empty chain burns at 1, don't ask, it's load-bearing. Forge the function.\"",
    prompt: [
      "Write `long long flame_chain(int n)` **recursively**:",
      "— if `n` is 1 or less: return `1` (the base case).",
      "— otherwise: return `n * flame_chain(n - 1)`.",
      "(Yes — this is the factorial, the First Kingdom's favorite rite.)",
      "The starter's `main` reads `n` and prints `flame_chain(n)`.",
      ">>>1 -> 1    4 -> 24    6 -> 720    0 -> 1"
    ],
    mode: "program",
    starter: "#include <iostream>\nusing namespace std;\n\nlong long flame_chain(int n) {\n    // base case: n <= 1 -> 1\n    // recursive case: n * flame_chain(n - 1)\n    return 1;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << flame_chain(n) << \"\\n\";\n    return 0;\n}\n",
    tests: [
      { stdin: "1", expectOut: "1", label: "one link" },
      { stdin: "4", expectOut: "24", label: "four links" },
      { stdin: "6", expectOut: "720", label: "six links" },
      { stdin: "0", expectOut: "1", label: "the empty chain" }
    ],
    hints: [
      "Two lines: if (n <= 1) return 1; then return n * flame_chain(n - 1);",
      "Trust the smaller call: flame_chain(n - 1) is already correct — just multiply by n.",
      "Full answer:\n#include <iostream>\nusing namespace std;\n\nlong long flame_chain(int n) {\n    if (n <= 1) return 1;\n    return n * flame_chain(n - 1);\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << flame_chain(n) << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 480, coins: 140, items: [["firstflame_edge", 1]] }
},

/* ---------------- cpp22 : BOSS — The Twin Flames ---------------- */
{
  id: "cpp22", faction: "cpp", act: 5, title: "The Twin Flames", npc: "herald", map: "sanctum", boss: true,
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
      ">>>for (int i = 0; i < n; i++)\n    for (int j = i + 1; j < n; j++)\n        if (runes[i] + runes[j] == target)\n            // found indices i and j",
      "Note `j = i + 1`: j always walks AHEAD of i — no pair checked twice, no rune paired with itself.",
      "The elegant way — one pass with an unordered_map of 'seen' runes. For each rune, ask if its *partner* (`target - rune`) was already seen:",
      ">>>unordered_map<int,int> seen;   // value -> index\nfor (int i = 0; i < n; i++) {\n    int partner = target - runes[i];\n    if (seen.count(partner)) {\n        // answer: seen[partner] and i\n    }\n    seen[runes[i]] = i;\n}",
      "Either way wins. The map way is the one the Flame whispers about — one pass instead of two."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The Twins hum: 'Walk the pairs.'", code: "for (int i = 0; i < 3; i++)\n    for (int j = i + 1; j < 3; j++)\n        cout << i << \" \" << j << \"\\n\";",
      answer: "0 1\n0 2\n1 2", why: "j starts past i: each pair appears exactly once." },
    { type: "mc", q: "'For rune 7 and target 9, what partner do you seek?'",
      choices: ["2, because 9 - 7 = 2", "7", "9", "16"],
      answer: 0, why: "The partner is target minus the rune: 9 - 7 = 2." },
    { type: "output", q: "'Has my partner passed this way?'", code: "unordered_map<int,int> seen;\nseen[5] = 0;\ncout << seen.count(5);",
      answer: "1", why: "count checks a key — the 'seen' pattern's heartbeat. 5 is present, so 1." },
    { type: "mc", q: "'Why does j begin at i + 1, not 0?'",
      choices: ["So no rune pairs with itself and no pair is checked twice", "It is faster to type", "j must always be odd", "No reason"],
      answer: 0, why: "Starting past i means each unordered pair is visited exactly once." }
  ],
  challenge: {
    title: "The Riddle of the Twin Marks",
    story: "The Twin Flames coil around each other. \"AMONG THE RUNES,\" they roar in unison, \"TWO OF US SUM TO THE TARGET. NAME OUR PLACES — THE EARLIER FIRST.\"",
    prompt: [
      "Input: line 1 `n`; line 2 `n` runes (ints); line 3 the `target`. **Exactly one** pair of positions i < j has `runes[i] + runes[j] == target`. The starter reads them.",
      "Print the two **indices**, smaller first, space-separated: `i j`.",
      ">>>runes 2 7 11 15, target 9  ->  0 1   (2 + 7 = 9)",
      "(Yes, adventurer — this is the fabled Two Sum. You are ready.)"
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> runes(n);\n    for (int i = 0; i < n; i++) cin >> runes[i];\n    int target;\n    cin >> target;\n    // find indices i < j with runes[i] + runes[j] == target; print \"i j\"\n\n    return 0;\n}\n",
    tests: [
      { stdin: "4\n2 7 11 15\n9", expectOut: "0 1", label: "the classic" },
      { stdin: "3\n3 2 4\n6", expectOut: "1 2", label: "not always the first two" },
      { stdin: "2\n3 3\n6", expectOut: "0 1", label: "twin twins" },
      { stdin: "4\n1 5 9 13\n22", expectOut: "2 3", label: "deep in the list" },
      { stdin: "3\n5 75 25\n100", expectOut: "1 2", label: "the vault code" }
    ],
    hints: [
      "Nested loops: for i, then for j = i+1; if runes[i] + runes[j] == target, print i and j and return.",
      "Map way: unordered_map<int,int> seen; for each i, if seen has target - runes[i], print seen[partner] and i; else seen[runes[i]] = i.",
      "Full answer:\n#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> runes(n);\n    for (int i = 0; i < n; i++) cin >> runes[i];\n    int target;\n    cin >> target;\n    unordered_map<int,int> seen;\n    for (int i = 0; i < n; i++) {\n        int partner = target - runes[i];\n        if (seen.count(partner)) {\n            cout << seen[partner] << \" \" << i << \"\\n\";\n            return 0;\n        }\n        seen[runes[i]] = i;\n    }\n    return 0;\n}"
    ]
  },
  rewards: { xp: 1200, coins: 400, items: [["last_crown", 1], ["phoenix_draught", 2]], title: "Twinsbane" }
},

/* ---------------- cpp23 : FINAL BOSS — The First King Ascendant ---------------- */
{
  id: "cpp23", faction: "cpp", act: 5, title: "The First King Ascendant", npc: "herald", map: "sanctum", boss: true,
  bossEnemy: "boss_first_king", bossSpot: { map: "sanctum", x: 36, y: 20 },
  intro: [
    "He has risen. The First King stands at the dais of the Eternal Flame, wearing a thousand years of dust like a coronation robe.",
    "He speaks only in the Verse of Ascension — the incantation that united every race under one banner. But his verse has *rotted*: letters repeat, and a repeated letter breaks the casting.",
    "Find the longest **clean** stretch of his verse — no letter repeated — and the casting fails. Everything you have forged, marked one. All of it. At the <b>dais</b>.",
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
      "The elegant way — the **sliding window**: one pass, two edges. Keep `start` at the window's left. When a character repeats *inside* the window, slide `start` past the old copy. Track the best width as you go:",
      ">>>unordered_map<char,int> last;   // char -> last index seen\nint start = 0, best = 0;\nfor (int i = 0; i < (int)s.size(); i++) {\n    char ch = s[i];\n    if (last.count(ch) && last[ch] >= start)\n        start = last[ch] + 1;        // slide past the old copy\n    last[ch] = i;\n    best = max(best, i - start + 1);\n}",
      "`i - start + 1` is the current clean window's width; `max` (from `#include <algorithm>`) keeps the biggest. Maps, loops, max — every lesson, one verse."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The King intones: 'Track the greatest so far.'", code: "int best = 0;\nfor (int n : {3, 1, 5, 2}) best = max(best, n);\ncout << best;",
      answer: "5", why: "max(best, n) keeps the running peak: 3, 3, 5, 5." },
    { type: "mc", q: "'A SUBSTRING of my verse is...'",
      choices: ["A contiguous run of characters", "Any characters in any order", "Only the first half", "A single character"],
      answer: 0, why: "Substrings are unbroken stretches — \"wke\" in \"pwwkew\", never \"pwk\"." },
    { type: "output", q: "'Read my length.'", code: "string s = \"ash\";\ncout << s.size();",
      answer: "3", why: "\"ash\" has three characters." },
    { type: "output", q: "'How wide is my window?'", code: "int start = 2, i = 5;\ncout << i - start + 1;",
      answer: "4", why: "The window from index 2 to 5 inclusive has width 5 - 2 + 1 = 4." },
    { type: "mc", q: "'When my verse repeats a letter inside the window, start must...'",
      choices: ["Slide just past the previous copy of that letter", "Reset to 0 always", "Stop entirely", "Skip the letter"],
      answer: 0, why: "The window stays clean by moving its left edge just past the old occurrence." }
  ],
  challenge: {
    title: "The Verse of Ascension",
    story: "The First King raises the Flame, and the rotten verse pours out in fire. \"MEASURE IT,\" he commands. \"THE LONGEST CLEAN BREATH OF MY VERSE — OR KNEEL.\"",
    prompt: [
      "Input: one line — the string `s` (it may be empty). The starter reads it with `getline`.",
      "Print one number: the **length** of the longest substring of `s` with **no repeated characters**.",
      ">>>\"abcabcbb\" -> 3    \"bbbbb\" -> 1    \"pwwkew\" -> 3    \"\" -> 0",
      "This is the King's own trial — a true medium-rank riddle from the world beyond. The sliding window honors him."
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // print the length of the longest substring of s with no repeated characters\n\n    return 0;\n}\n",
    tests: [
      { stdin: "abcabcbb", expectOut: "3", label: "abcabcbb -> 3" },
      { stdin: "bbbbb", expectOut: "1", label: "bbbbb -> 1" },
      { stdin: "pwwkew", expectOut: "3", label: "pwwkew -> 3" },
      { stdin: "", expectOut: "0", label: "the empty verse" },
      { stdin: "firstking", expectOut: "7", label: "firstking -> 7 (rstking)" },
      { stdin: "au", expectOut: "2", label: "au -> 2" }
    ],
    hints: [
      "Sliding window: keep last[char] = index and a window start. On a repeat inside the window (last[ch] >= start), set start = last[ch] + 1.",
      "Each step: last[ch] = i; best = max(best, i - start + 1). Print best at the end.",
      "Full answer:\n#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    unordered_map<char,int> last;\n    int start = 0, best = 0;\n    for (int i = 0; i < (int)s.size(); i++) {\n        char ch = s[i];\n        if (last.count(ch) && last[ch] >= start)\n            start = last[ch] + 1;\n        last[ch] = i;\n        best = max(best, i - start + 1);\n    }\n    cout << best << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 3000, coins: 1000, items: [["eternal_brand", 1]], title: "Flamebearer", final: true }
}
);
