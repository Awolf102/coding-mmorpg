/* ============================================================
   ACT IV — KINGSFALL CITADEL: The Soldier's Discipline  (C++)
   Functions, default args & references, building vectors, structs
   ============================================================ */
window.QUEST_DB.push(

/* ---------------- cpp14 : The Soldier's Drill ---------------- */
{
  id: "cpp14", faction: "cpp", act: 4, title: "The Soldier's Drill", npc: "edric", map: "citadel",
  intro: [
    "Halt. State your— ah. The mark. At ease, survivor. I am Edric, castellan of what remains.",
    "The Spectral Knights drilling in the west yard have repeated the same exercise for a thousand years. There is a lesson in that, and also a problem, and both are yours now.",
    "Disperse <b>5 Spectral Knights</b>, and learn the soldier's secret: name a maneuver ONCE, then call it by name forever. C++ calls it a <b>function</b>."
  ],
  acceptLabel: "I'll report to the west yard.",
  midDialogue: "The west yard still echoes with dead drills. Finish the exercise, soldier.",
  returnDialogue: [
    "The yard is clear. Good order, good form.",
    "Final exercise: codify the strike calculation our drill-masters used. Define it once, correctly — and every soldier after you can call it."
  ],
  doneDialogue: "Defined once, called forever. That is how an army outlives its soldiers. Welcome to the officer corps.",
  lesson: {
    title: "The Drill — Defining Functions",
    body: [
      "A **function** is a named maneuver. State its **return type**, its name, and its **parameters** (each with a type):",
      ">>>int doubleIt(int x) {\n    return x * 2;\n}\n\n// elsewhere:\nint hit = doubleIt(6);   // hit is now 12\ncout << doubleIt(5);     // 10",
      "`return` hands a value back to the caller and ends the function instantly. The return type (here `int`) must match what you return.",
      "A function that hands nothing back has return type `void`:",
      ">>>void salute() {\n    cout << \"For the First Kingdom!\\n\";\n}\n\nsalute();   // runs the body, returns nothing",
      "Multiple parameters arrive in order, comma-separated:",
      ">>>int strike(int strength, int bonus) {\n    return strength * 2 + bonus;\n}\ncout << strike(5, 3);   // 13",
      "Define a function ABOVE `main` so `main` can call it. And `return` is not `cout`: cout *shows* a value; return *delivers* one you can store and reuse."
    ],
    fragments: [
      "**Fragment I** — `returnType name(params) { ... }` defines; `name(args)` calls. `int doubleIt(int x)` returns an int.",
      "**Fragment II** — `return value;` hands the result back and ends the function. The caller can store it: `int x = doubleIt(6);`.",
      "**Fragment III** — A function that returns nothing has type `void`. `void salute()` just acts; it hands nothing back.",
      "**Fragment IV** — Parameters fill in order: `strike(5, 3)` means strength=5, bonus=3. return delivers a value; cout only shows one."
    ]
  },
  kills: { enemy: "spectral_knight", count: 5 },
  questions: [
    { type: "output", q: "Stored maneuver:", code: "int doubleIt(int x) {\n    return x * 2;\n}\nint main() {\n    cout << doubleIt(6);\n}",
      answer: "12", why: "doubleIt(6) returns 12, which is printed." },
    { type: "mc", q: "What does return do?",
      choices: ["Hands a value back to the caller and ends the function", "Prints a value", "Restarts the function", "Declares a variable"],
      answer: 0, why: "return delivers the result; the caller can store or use it." },
    { type: "output", q: "Parameters arrive in order:", code: "int strike(int s, int b) {\n    return s * 2 + b;\n}\nint main() {\n    cout << strike(4, 1);\n}",
      answer: "9", why: "s=4, b=1: 4*2 + 1 = 9." },
    { type: "mc", q: "A function that returns nothing has which return type?",
      choices: ["void", "int", "none", "empty"],
      answer: 0, why: "void means the function hands nothing back." },
    { type: "fill", q: "Fill the blank to name a function returning an int:", code: "int ____(int n) {\n    return n + 1;\n}",
      answer: "rally", accept: ["rally", "next", "inc"], why: "The name goes after the return type: int rally(int n). Any valid name works." },
    { type: "output", q: "return ends the function INSTANTLY:", code: "int test(int x) {\n    if (x > 5) return 1;\n    return 0;\n}\nint main() {\n    cout << test(9);\n}",
      answer: "1", why: "x > 5, so the first return fires and the second is never reached." },
    { type: "mc", q: "Why define a function above main (or declare it first)?",
      choices: ["So main knows it exists when it calls it", "To make it run faster", "So it returns void", "It doesn't matter"],
      answer: 0, why: "C++ reads top to bottom; main must know the function before it can call it." }
  ],
  challenge: {
    title: "Codify the Strike",
    story: "Edric chalks the formula on the wall: damage is strength doubled, plus the weapon's bonus. \"Make it a function. The army will call it ten thousand times; you write it once.\"",
    prompt: [
      "Write a function `int strike(int strength, int bonus)` that **returns** `strength * 2 + bonus`.",
      "The starter's `main` reads the two numbers and prints `strike(strength, bonus)` for you.",
      "Examples:",
      ">>>input 5 3   ->  13\ninput 0 7   ->  7\ninput 10 0  ->  20",
      "Use `return` — don't print inside strike."
    ],
    mode: "program",
    starter: "#include <iostream>\nusing namespace std;\n\nint strike(int strength, int bonus) {\n    // return strength doubled, plus the bonus\n    return 0;\n}\n\nint main() {\n    int strength, bonus;\n    cin >> strength >> bonus;\n    cout << strike(strength, bonus) << \"\\n\";\n    return 0;\n}\n",
    tests: [
      { stdin: "5 3", expectOut: "13", label: "strike(5, 3)" },
      { stdin: "0 7", expectOut: "7", label: "strike(0, 7)" },
      { stdin: "10 0", expectOut: "20", label: "strike(10, 0)" },
      { stdin: "12 6", expectOut: "30", label: "strike(12, 6)" }
    ],
    hints: [
      "The whole body of strike is one line: return strength * 2 + bonus;",
      "Leave main alone — it already reads the input and prints strike's result.",
      "Full answer:\n#include <iostream>\nusing namespace std;\n\nint strike(int strength, int bonus) {\n    return strength * 2 + bonus;\n}\n\nint main() {\n    int strength, bonus;\n    cin >> strength >> bonus;\n    cout << strike(strength, bonus) << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 300, coins: 85, items: [["citadel_plate", 1]] }
},

/* ---------------- cpp14b : The Officer's Report ---------------- */
{
  id: "cpp14b", faction: "cpp", act: 4, title: "The Officer's Report", npc: "doran", map: "citadel",
  intro: [
    "Quartermaster Doran. You're Edric's new officer? Then you'll learn to report properly, or you'll learn to dig latrines.",
    "The pact knights drilling the west barracks were bound to an unfinished order — sent to fetch an answer, they never learned to bring one <i>back</i>. Now they just march, reporting nothing.",
    "Put down <b>4 Pact Knights</b>, and I'll teach you a proper report: a function that hands back not one answer, but as many as the order requires."
  ],
  acceptLabel: "I'll learn to report.",
  midDialogue: "Knights still marching the barracks, reporting nothing. Finish them.",
  returnDialogue: [
    "Good. A soldier who can't report is just expensive noise.",
    "A real order asks two things and expects both back. Learn to return many — and to keep your workings to yourself."
  ],
  doneDialogue: "Two answers, one report, no leakage. You report like a quartermaster now. Dismissed — with honors.",
  lesson: {
    title: "The Officer's Orders — Returning a Pair & Scope",
    body: [
      "A function returns ONE value — but that value can be a `std::pair`, carrying two at once. Brace-pack them in the return:",
      ">>>#include <utility>\npair<int,int> extremes(vector<int> v) {\n    int lo = v[0], hi = v[0];\n    for (int x : v) { if (x < lo) lo = x; if (x > hi) hi = x; }\n    return {lo, hi};        // two values, one pair\n}",
      "Unpack it on the way out with a **structured binding**:",
      ">>>auto [lo, hi] = extremes(nums);\ncout << lo << \" \" << hi;\n// or reach in by hand: p.first and p.second",
      "Variables declared inside a function are **local** — they live only during the call and never collide with names outside:",
      ">>>int f() {\n    int x = 99;   // local to f\n    return x;\n}",
      "By default a parameter is passed **by value** — the function gets its own copy, so changing it doesn't touch the caller's variable. (References, which you'll meet next, are the exception.)",
      "So a clean function takes inputs, works on its own locals, and reports results back — sealed, composable orders."
    ],
    fragments: [
      "**Fragment I** — `pair<int,int>` carries two values. `return {a, b};` packs them; `p.first` and `p.second` read them.",
      "**Fragment II** — `auto [x, y] = f();` is a structured binding — it unpacks a returned pair into two names at once.",
      "**Fragment III** — Variables declared inside a function are local: they vanish when it returns and don't clash with outside names.",
      "**Fragment IV** — Parameters are passed by value by default (the function gets a copy), so changing a parameter doesn't change the caller's variable."
    ]
  },
  kills: { enemy: "pact_knight", count: 4 },
  questions: [
    { type: "mc", q: "How can a C++ function hand back TWO values at once?",
      choices: ["return a std::pair", "with two return statements", "by printing them", "it cannot"],
      answer: 0, why: "A function returns one value — make that value a pair (or struct) to carry two." },
    { type: "output", q: "Reading a pair's halves:", code: "pair<int,int> p = {3, 7};\ncout << p.first << \" \" << p.second;",
      answer: "3 7", why: ".first is the first value (3), .second the second (7)." },
    { type: "mc", q: "What does `auto [a, b] = makePair();` do?",
      choices: ["unpacks the returned pair into a and b", "creates two functions", "makes an array", "is a syntax error"],
      answer: 0, why: "A structured binding splits a returned pair (or tuple/struct) into named variables." },
    { type: "output", q: "By value — the caller's copy is safe:", code: "int f(int x) { x = 99; return 0; }\nint n = 5;\nf(n);\ncout << n;",
      answer: "5", why: "x is a copy; changing it inside f doesn't touch n. (A reference would.)" },
    { type: "mc", q: "Which header declares std::pair?",
      choices: ["<utility>", "<vector>", "<string>", "<algorithm>"],
      answer: 0, why: "std::pair lives in <utility>. (It also comes in transitively with <map>.)" },
    { type: "output", q: "Pack two, then read one:", code: "pair<int,int> p = {2, 8};\nauto [lo, hi] = p;\ncout << hi;",
      answer: "8", why: "The structured binding gives lo = 2, hi = 8; hi prints 8." }
  ],
  challenge: {
    title: "The Officer's Report",
    story: "Doran taps the muster roll. \"One report, two numbers: how many stand ready, and how many are still recruits. Bring me BOTH at once.\"",
    prompt: [
      "The input is an integer `n`, then `n` soldier levels. The starter reads `n`.",
      "Count the levels `>= 10` (ready) and the levels `< 10` (recruits). Print **two lines**:",
      "1. the ready count, then 2. the recruit count.",
      ">>>2\n2",
      "(Example for the input `4` then `5 12 9 30` — two ready, two recruits.)"
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <vector>\n#include <utility>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // read n levels; count ready (>= 10) and recruits (< 10); print each on a line\n\n    return 0;\n}\n",
    tests: [
      { stdin: "4\n5 12 9 30", expectOut: "2\n2", label: "mixed muster" },
      { stdin: "2\n1 2", expectOut: "0\n2", label: "all recruits" },
      { stdin: "2\n10 20", expectOut: "2\n0", label: "all ready" }
    ],
    hints: [
      "Tally as you read: for each level, if (l >= 10) ready++; else recruits++;",
      "A pair-returning helper is idiomatic: pair<int,int> report(...) { ...; return {ready, recruits}; }",
      "Full answer:\n#include <iostream>\n#include <vector>\n#include <utility>\nusing namespace std;\n\npair<int,int> report(vector<int> levels) {\n    int ready = 0, recruits = 0;\n    for (int l : levels) { if (l >= 10) ready++; else recruits++; }\n    return {ready, recruits};\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> levels;\n    for (int i = 0; i < n; i++) { int l; cin >> l; levels.push_back(l); }\n    auto [r, c] = report(levels);\n    cout << r << \"\\n\" << c << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 310, coins: 88, items: [["scroll_of_insight", 2]] }
},

/* ---------------- cpp15 : Sigils of Binding ---------------- */
{
  id: "cpp15", faction: "cpp", act: 4, title: "Sigils of Binding", npc: "wynn", map: "citadel",
  intro: [
    "I dreamed you would arrive today. I also dreamed you would arrive yesterday, so do not be too impressed.",
    "The Flame Revenants in the inner keep are unfinished functions — maneuvers that were never given their full parameters. They burn with missing arguments.",
    "Quench <b>5 Flame Revenants</b>, and I will complete your training: default arguments, borrowing by reference, and functions that judge whole armies at once."
  ],
  acceptLabel: "I'll complete what they could not.",
  midDialogue: "The revenants still burn in the keep. They are missing their endings — give them yours.",
  returnDialogue: [
    "The keep cools. The unfinished are finished.",
    "Now the binding trial: the citadel must count its battle-ready soldiers at any threshold. Write the function the garrison will live by."
  ],
  doneDialogue: "Bound and sealed. The garrison calls your function nightly now. You are quoted in watchtowers.",
  lesson: {
    title: "Deeper Bindings — Defaults, References & Counting",
    body: [
      "A parameter can carry a **default** — used when the caller stays silent. Defaults go last:",
      ">>>int forge(int metal, int heat = 100) {\n    return metal + heat;\n}\ncout << forge(5);        // 105 - default heat used\ncout << forge(5, 300);   // 305 - default overridden",
      "Pass big things (like a vector) by **reference** to avoid copying. `const vector<int>&` means 'borrow it, don't change it':",
      ">>>int count_ready(const vector<int>& levels, int threshold) {\n    int count = 0;\n    for (int lvl : levels) {\n        if (lvl >= threshold) count++;\n    }\n    return count;\n}",
      "That shape — *start a counter, loop, test, count, return* — runs half the kingdom's old machinery. Learn it by heart.",
      "Combine them: a default threshold AND a borrowed vector:",
      ">>>int count_ready(const vector<int>& levels, int threshold = 10) { ... }\ncount_ready(army);        // uses 10\ncount_ready(army, 25);    // uses 25"
    ],
    fragments: [
      "**Fragment I** — `int f(int x, int y = 10)` gives y a default. `f(3)` uses 10; `f(3, 99)` overrides. Defaults come AFTER required parameters.",
      "**Fragment II** — Pass big values by reference to avoid copying: `const vector<int>& v`. The `&` borrows; `const` promises not to change it.",
      "**Fragment III** — The counting shape: `int count = 0;` -> loop -> `if (cond) count++;` -> `return count;`. Four moves that run kingdoms.",
      "**Fragment IV** — A `return` inside a loop exits the WHOLE function immediately — loop and all."
    ]
  },
  kills: { enemy: "flame_revenant", count: 5 },
  questions: [
    { type: "output", q: "The silent caller:", code: "int forge(int metal, int heat = 100) {\n    return metal + heat;\n}\nint main() {\n    cout << forge(5);\n}",
      answer: "105", why: "No second argument, so the default heat=100 is used: 5 + 100." },
    { type: "mc", q: "int f(int a, int b = 5); — which call is INVALID?",
      choices: ["f()", "f(1)", "f(1, 2)", "f(9, 9)"],
      answer: 0, why: "a has no default — the caller must supply it. f() leaves a empty." },
    { type: "output", q: "Override the default:", code: "int ward(int power = 1) {\n    return power * 3;\n}\nint main() {\n    cout << ward(4);\n}",
      answer: "12", why: "The caller passed 4, overriding the default: 4*3 = 12." },
    { type: "mc", q: "What does const vector<int>& as a parameter mean?",
      choices: ["Borrow the vector without copying, and don't change it", "Make a fresh copy", "Return a vector", "Sort the vector"],
      answer: 0, why: "& borrows (no copy); const promises the function won't modify it." },
    { type: "output", q: "Judge the army:", code: "int count_high(const vector<int>& v, int limit) {\n    int c = 0;\n    for (int n : v) if (n > limit) c++;\n    return c;\n}\nint main() {\n    vector<int> a = {4, 8, 15};\n    cout << count_high(a, 5);\n}",
      answer: "2", why: "8 and 15 exceed 5: count is 2." },
    { type: "mc", q: "Where must default parameters sit?",
      choices: ["After all required parameters", "Before required parameters", "Anywhere", "Alone"],
      answer: 0, why: "int f(int a, int b=2) is valid; int f(int a=2, int b) is an error." },
    { type: "mc", q: "What does return inside a for loop (inside a function) do?",
      choices: ["Exits the whole function immediately, loop and all", "Skips one pass", "Only ends the loop", "Nothing"],
      answer: 0, why: "return is absolute: function over, value delivered, loop abandoned." }
  ],
  challenge: {
    title: "The Garrison Count",
    story: "Wynn's eyes go white. \"I see ten thousand musters. In every one, the castellan asks: how many stand ready? Write it once, and the question is answered forever.\"",
    prompt: [
      "Write `int count_ready(const vector<int>& levels, int threshold = 10)` that returns how many levels are `>= threshold`, with `threshold` **defaulting to 10**.",
      "The starter's `main` reads the levels and a threshold, then prints TWO lines: `count_ready(levels)` (using the default 10) and `count_ready(levels, threshold)`.",
      ">>>levels 5 12 9 30, threshold 25  ->  2 (default 10), then 1 (>= 25)",
      "Input: line 1 `n`; line 2 `n` levels; line 3 the threshold."
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint count_ready(const vector<int>& levels, int threshold = 10) {\n    // count how many levels are >= threshold\n    int count = 0;\n    return count;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> levels(n);\n    for (int i = 0; i < n; i++) cin >> levels[i];\n    int threshold;\n    cin >> threshold;\n    cout << count_ready(levels) << \"\\n\";\n    cout << count_ready(levels, threshold) << \"\\n\";\n    return 0;\n}\n",
    tests: [
      { stdin: "4\n5 12 9 30\n25", expectOut: "2\n1", label: "default 10 (2), then >= 25 (1)" },
      { stdin: "3\n1 2 3\n2", expectOut: "0\n2", label: "default 10 (0), then >= 2 (2)" },
      { stdin: "0\n5", expectOut: "0\n0", label: "an empty muster" },
      { stdin: "1\n10\n10", expectOut: "1\n1", label: "exactly at the threshold" }
    ],
    hints: [
      "Fill the counting shape: for (int lvl : levels) if (lvl >= threshold) count++; return count;",
      "Don't touch main — it calls count_ready twice: once WITHOUT a threshold (the default 10) and once WITH it.",
      "Full answer:\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint count_ready(const vector<int>& levels, int threshold = 10) {\n    int count = 0;\n    for (int lvl : levels) {\n        if (lvl >= threshold) count++;\n    }\n    return count;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> levels(n);\n    for (int i = 0; i < n; i++) cin >> levels[i];\n    int threshold;\n    cin >> threshold;\n    cout << count_ready(levels) << \"\\n\";\n    cout << count_ready(levels, threshold) << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 320, coins: 90, items: [["pyreheart_cleaver", 1]] }
},

/* ---------------- cpp16 : The Shaping of Many ---------------- */
{
  id: "cpp16", faction: "cpp", act: 4, title: "The Shaping of Many", npc: "wynn", map: "citadel",
  intro: [
    "Another vision: you, building a new roster the hard way. It was fine, actually. Tedious, but fine. Let me show you the clean way regardless.",
    "The Molten Gargoyles on the east wall were shaped by the old masons one chisel-stroke at a time. There is a tidier way to shape many — and the gargoyles hate it.",
    "Shatter <b>5 Molten Gargoyles</b>, and learn the shaping-of-many: build a new vector by filtering and transforming an old one."
  ],
  acceptLabel: "Show me the clean way.",
  midDialogue: "The gargoyles still squat on the east wall, judging your loop bodies.",
  returnDialogue: [
    "Shattered, all five. The wall is just a wall again.",
    "The final shaping: empower a roster of veterans in one clean pass. Filter the worthy, double their strength, return the new roster."
  ],
  doneDialogue: "Clean and exact. The masons' ghosts approve. Precision, it turns out, is also a weapon.",
  lesson: {
    title: "The Shaping of Many — Building Vectors",
    body: [
      "Often you build a NEW vector from an old one. Start empty, push what you want:",
      ">>>vector<int> doubled;\nfor (int x : nums) {\n    doubled.push_back(x * 2);\n}",
      "Add an `if` to **filter** — only matching items get pushed:",
      ">>>vector<int> veterans;\nfor (int lvl : levels) {\n    if (lvl >= 10) veterans.push_back(lvl);\n}",
      "Transform AND filter together — the `if` chooses, the push shapes:",
      ">>>vector<int> empowered;\nfor (int lvl : levels) {\n    if (lvl >= 10) empowered.push_back(lvl * 2);\n}",
      "A function can build and return a whole vector:",
      ">>>vector<int> empower(const vector<int>& levels) {\n    vector<int> out;\n    for (int lvl : levels)\n        if (lvl >= 10) out.push_back(lvl * 2);\n    return out;\n}",
      "(The library's `copy_if` and `transform` can do this in fewer words — but the explicit loop is the clearest spell to learn first.)"
    ],
    fragments: [
      "**Fragment I** — Build a new vector by starting empty and pushing: `vector<int> out; for (...) out.push_back(x);`.",
      "**Fragment II** — A guarding `if` filters: `if (x >= 10) out.push_back(x);` keeps only what passes.",
      "**Fragment III** — Shape and filter together: `if (cond) out.push_back(x * 2);` — the if chooses, the push transforms the chosen.",
      "**Fragment IV** — A function can return a whole vector: `vector<int> f(...) { vector<int> out; ...; return out; }`."
    ]
  },
  kills: { enemy: "molten_gargoyle", count: 5 },
  questions: [
    { type: "output", q: "Build a new vector:", code: "vector<int> out;\nfor (int x : {1, 2, 3}) out.push_back(x * 2);\nfor (int y : out) cout << y << \" \";",
      answer: "2 4 6", why: "Each x is doubled and pushed: 2 4 6." },
    { type: "mc", q: "Which line keeps only levels of 10 or more in a new vector?",
      choices: ["if (lvl >= 10) out.push_back(lvl);", "out.push_back(lvl >= 10);", "if (out >= 10) push_back(lvl);", "out = lvl >= 10;"],
      answer: 0, why: "Guard the push with an if; only passing items get added." },
    { type: "output", q: "Filter, then count:", code: "vector<int> big;\nfor (int n : {4, 11, 8, 20}) if (n > 9) big.push_back(n);\ncout << big.size();",
      answer: "2", why: "11 and 20 pass the filter: size 2." },
    { type: "output", q: "Shape AND filter:", code: "vector<int> out;\nfor (int x : {12, 3, 10}) if (x >= 10) out.push_back(x * 2);\nfor (int y : out) cout << y << \" \";",
      answer: "24 20", why: "12 and 10 pass; doubled to 24 and 20. The 3 is dropped." },
    { type: "mc", q: "How does a function return a whole vector?",
      choices: ["Its return type is vector<int> and it returns the built vector", "It prints each item", "It must use void", "It can't"],
      answer: 0, why: "Declare the return type as the vector type and return the built vector." },
    { type: "fill", q: "Fill the blank to keep only positive numbers:", code: "for (int x : nums)\n    ____ (x > 0) out.push_back(x);",
      answer: "if", why: "The guarding if filters which items get pushed into the new vector." },
    { type: "mc", q: "Why start with an empty vector when building a filtered list?",
      choices: ["So you can push_back only the items that pass", "To make it sorted", "To delete the original", "Empty vectors print faster"],
      answer: 0, why: "You grow the result by pushing only the items you want to keep." }
  ],
  challenge: {
    title: "Empower the Veterans",
    story: "Wynn lays out the muster roll. \"The Flame doubles the strength of every soldier of level 10 or higher. The recruits stay home. Build me the new roster, in order.\"",
    prompt: [
      "Write `vector<int> empower(const vector<int>& levels)` that returns a **new vector**: every level `>= 10`, **doubled**, in the original order. Drop the rest.",
      "The starter's `main` reads the levels, calls `empower`, and prints the result space-separated (an empty line if none).",
      "Examples:",
      ">>>12 3 10    ->  24 20\n1 2        ->  (empty)\n30 9 15 2  ->  60 30",
      "Input: line 1 `n`; line 2 `n` levels."
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> empower(const vector<int>& levels) {\n    vector<int> out;\n    // push back each level >= 10, doubled\n\n    return out;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> levels(n);\n    for (int i = 0; i < n; i++) cin >> levels[i];\n    vector<int> result = empower(levels);\n    bool first = true;\n    for (int v : result) {\n        if (!first) cout << \" \";\n        cout << v;\n        first = false;\n    }\n    cout << \"\\n\";\n    return 0;\n}\n",
    tests: [
      { stdin: "3\n12 3 10", expectOut: "24 20", label: "two veterans" },
      { stdin: "2\n1 2", expectOut: "", label: "all recruits" },
      { stdin: "1\n10", expectOut: "20", label: "exactly level 10" },
      { stdin: "4\n30 9 15 2", expectOut: "60 30", label: "mixed muster" }
    ],
    hints: [
      "Inside empower: for (int lvl : levels) if (lvl >= 10) out.push_back(lvl * 2);",
      "Leave main alone — it prints the returned vector for you.",
      "Full answer:\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> empower(const vector<int>& levels) {\n    vector<int> out;\n    for (int lvl : levels) {\n        if (lvl >= 10) out.push_back(lvl * 2);\n    }\n    return out;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> levels(n);\n    for (int i = 0; i < n; i++) cin >> levels[i];\n    vector<int> result = empower(levels);\n    bool first = true;\n    for (int v : result) {\n        if (!first) cout << \" \";\n        cout << v;\n        first = false;\n    }\n    cout << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 340, coins: 95, items: [["phoenix_draught", 2]] }
},

/* ---------------- cpp17 : Echoes Given Form ---------------- */
{
  id: "cpp17", faction: "cpp", act: 4, title: "Echoes Given Form", npc: "edric", map: "citadel",
  intro: [
    "Soldier. We have a situation in the great hall: the empty armors are walking again. No ghosts inside — the armor itself remembers *being a knight*.",
    "That is the deepest magic of the First Kingdom: they could write down what a thing IS — its data, its behaviors — and stamp living copies from the writing. They called the writing a <b>struct</b>.",
    "Dismantle <b>5 Animated Armors</b> in the great hall, then I will teach you to forge beings of your own."
  ],
  acceptLabel: "I'll handle the armory.",
  midDialogue: "The armors still clatter through the great hall, remembering parade formation.",
  returnDialogue: [
    "Quiet at last. Now — the deep lesson.",
    "Write me a Knight: not one knight, the IDEA of a knight. Name, power, a rallying cry, a strike. From your writing, I could stamp a thousand."
  ],
  doneDialogue: "From your one writing, a thousand knights could stand. This is how the Kingdom built its armies — and perhaps how something rebuilds them today.",
  lesson: {
    title: "The Stamp of Being — Structs & Classes",
    body: [
      "A **struct** is a blueprint; an **object** is one being stamped from it. It bundles **data** (members) with **behavior** (methods):",
      ">>>struct Knight {\n    string name;\n    int power;\n\n    string rally() {\n        return name + \" stands!\";\n    }\n    int strike(int bonus) {\n        return power + bonus;\n    }\n};",
      "Stamp an object and reach its members with a dot:",
      ">>>Knight bors{\"Bors\", 10};\ncout << bors.name;        // Bors\ncout << bors.power;       // 10\ncout << bors.rally();     // Bors stands!\ncout << bors.strike(5);   // 15",
      "Inside a method, a bare member name (`name`, `power`) means *this* object's own data — each stamped Knight keeps its own copy.",
      "(Don't forget the **semicolon** after the closing brace of a struct! And `class` is the same idea, but its members are *private* by default — a `struct` is public by default, friendlier to start with.)"
    ],
    fragments: [
      "**Fragment I** — `struct Name { ... };` is the blueprint (mind the closing semicolon!). `Name obj{...};` stamps an object. Members are data; methods are behavior.",
      "**Fragment II** — Reach members with a dot: `obj.member`, `obj.method()`. Each stamped object keeps its OWN member values.",
      "**Fragment III** — Inside a method, a bare member name (`power`) means THIS object's member. Methods can take extra arguments too.",
      "**Fragment IV** — `class` vs `struct`: the only real default difference is access — struct members are public, class members are private."
    ]
  },
  kills: { enemy: "animated_armor", count: 5 },
  questions: [
    { type: "output", q: "Stamp and read:", code: "struct Torch {\n    int fuel;\n};\nint main() {\n    Torch t{5};\n    cout << t.fuel;\n}",
      answer: "5", why: "The member fuel was set to 5; t.fuel reads it back." },
    { type: "mc", q: "What does a method inside a struct act on?",
      choices: ["This particular object's own members", "The struct blueprint itself", "A global variable", "Nothing"],
      answer: 0, why: "A method reads and writes the members of the object it was called on." },
    { type: "output", q: "The verb of a being:", code: "struct Wolf {\n    string name;\n    string howl() { return name + \"!\"; }\n};\nint main() {\n    Wolf w{\"Fang\"};\n    cout << w.howl();\n}",
      answer: "Fang!", why: "howl reads this Wolf's name and appends !." },
    { type: "mc", q: "How do you call a method named rally on object k?",
      choices: ["k.rally()", "rally(k)", "Knight.rally", "k->rally"],
      answer: 0, why: "Call methods through the object with a dot and parentheses." },
    { type: "output", q: "Two stamps, two beings:", code: "struct Orb {\n    int glow;\n};\nint main() {\n    Orb a{3}, b{8};\n    a.glow = 4;\n    cout << a.glow << \" \" << b.glow;\n}",
      answer: "4 8", why: "Each object owns its members — changing a never touches b." },
    { type: "fill", q: "Fill the blank to begin a blueprint with public members:", code: "____ Knight {\n    string name;\n};",
      answer: "struct", why: "struct begins a blueprint whose members are public by default." },
    { type: "mc", q: "What's the real default difference between struct and class?",
      choices: ["struct members are public; class members are private", "struct can't have methods", "class can't be stamped", "No difference at all"],
      answer: 0, why: "The only real default difference is access: struct = public, class = private." }
  ],
  challenge: {
    title: "Write the Knight",
    story: "Edric hands you the old stamping-plates. \"Name, power, a cry, a strike. Write the IDEA of a knight, and the citadel will do the rest.\"",
    prompt: [
      "Define a `struct Knight` with:",
      "— members `string name;` and `int power;`",
      "— a method `rally()` returning `\"NAME stands!\"` (e.g. `\"Mira stands!\"`)",
      "— a method `strike(int bonus)` returning `power + bonus`.",
      "The starter's `main` reads `name power bonus`, stamps a Knight, and prints: name, power, rally(), strike(bonus).",
      ">>>input: Mira 7 5\nMira\n7\nMira stands!\n12"
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Knight {\n    string name;\n    int power;\n\n    string rally() {\n        // return \"NAME stands!\"\n        return \"\";\n    }\n    int strike(int bonus) {\n        // return power + bonus\n        return 0;\n    }\n};\n\nint main() {\n    string name; int power, bonus;\n    cin >> name >> power >> bonus;\n    Knight k{name, power};\n    cout << k.name << \"\\n\";\n    cout << k.power << \"\\n\";\n    cout << k.rally() << \"\\n\";\n    cout << k.strike(bonus) << \"\\n\";\n    return 0;\n}\n",
    tests: [
      { stdin: "Mira 7 5", expectOut: "Mira\n7\nMira stands!\n12", label: "Mira the knight" },
      { stdin: "Bors 10 0", expectOut: "Bors\n10\nBors stands!\n10", label: "Bors the knight" }
    ],
    hints: [
      "rally: return name + \" stands!\"; — strike: return power + bonus;",
      "Inside a method, name and power already mean THIS knight's members. Leave main alone.",
      "Full answer:\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Knight {\n    string name;\n    int power;\n\n    string rally() {\n        return name + \" stands!\";\n    }\n    int strike(int bonus) {\n        return power + bonus;\n    }\n};\n\nint main() {\n    string name; int power, bonus;\n    cin >> name >> power >> bonus;\n    Knight k{name, power};\n    cout << k.name << \"\\n\";\n    cout << k.power << \"\\n\";\n    cout << k.rally() << \"\\n\";\n    cout << k.strike(bonus) << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 360, coins: 100, items: [["serpent_sigil", 1]] }
},

/* ---------------- cpp17b : The Living Banner ---------------- */
{
  id: "cpp17b", faction: "cpp", act: 4, title: "The Living Banner", npc: "isolde", map: "citadel",
  intro: [
    "Mind the standards — some of them bite now. I'm Isolde, bannerwright. I stitch standards that <i>remember</i>.",
    "The gloom sentinels by the chapel were my finest work once: banners given so much memory they woke up wrong. A being that only remembers, and never forgets, becomes a monster.",
    "Unmake <b>4 Gloom Sentinels</b>, and I'll teach you to give an object a memory it can <i>use</i> — state that changes, and a voice to report itself."
  ],
  acceptLabel: "Teach me the stitching.",
  midDialogue: "Sentinels still brooding by the chapel, remembering old defeats. End them.",
  returnDialogue: [
    "Better. Now — an object is more than stored fields. It can <i>change</i>, and it can <i>speak itself</i>.",
    "Give a banner a tally it grows over time, and a way to describe itself when asked. That is the difference between a record and a living thing."
  ],
  doneDialogue: "It remembers, it grows, it answers when asked — and it knows when to stop. You stitch living things now, bannerwright.",
  lesson: {
    title: "Living Objects — Changing State & a Voice",
    body: [
      "A `struct` (or `class`) groups fields, and its **methods can change those fields** — so the object remembers across calls:",
      ">>>struct Banner {\n    string name;\n    int victories = 0;        // an in-class default — not passed in\n    void win() { victories++; }   // the memory grows\n};\n\nBanner b{\"Ash\"};\nb.win();\nb.win();\ncout << b.victories;   // 2 - it remembered both",
      "That `int victories = 0;` is an **in-class initializer**: a starting value the caller doesn't supply.",
      "Give an object a **voice** with a method that returns its words. Build the string with `to_string` for the numbers:",
      ">>>struct Banner {\n    string name;\n    int victories = 0;\n    string describe() {\n        return name + \" (\" + to_string(victories) + \")\";\n    }\n};\n\nBanner b{\"Ash\"};\ncout << b.describe();   // Ash (0)",
      "(C++ has no `__str__`; the closest idioms are a `describe()` method like this, or overloading `operator<<` so `cout << b` works directly.)",
      "So a living object = fields that **change** (state) + methods that change them + a method that **reports** them."
    ],
    fragments: [
      "**Fragment I** — A method can change its object's fields: `void win() { victories++; }`. The object remembers the change for next time.",
      "**Fragment II** — An in-class initializer sets a default field value: `int victories = 0;` — no constructor argument needed.",
      "**Fragment III** — Give the object a voice with a method returning a string; use `to_string(n)` to fold numbers into text.",
      "**Fragment IV** — Living object = changing state + methods that change it + a method (or operator<<) that reports it."
    ]
  },
  kills: { enemy: "gloom_sentinel", count: 4 },
  questions: [
    { type: "output", q: "The object remembers:", code: "struct Tally { int n = 0; void bump() { n++; } };\nTally t;\nt.bump();\nt.bump();\nt.bump();\ncout << t.n;",
      answer: "3", why: "Each bump() grows t.n; the object keeps the running total between calls." },
    { type: "mc", q: "What does `int victories = 0;` inside a struct do?",
      choices: ["gives the field a default value", "creates a global", "is a syntax error", "declares a function"],
      answer: 0, why: "It is an in-class initializer — every Banner starts with victories = 0 unless set otherwise." },
    { type: "output", q: "The object speaks:", code: "struct Flag { string c; string show() { return \"<\" + c + \">\"; } };\nFlag f{\"ash\"};\ncout << f.show();",
      answer: "<ash>", why: "show() builds and returns \"<ash>\", which cout then prints." },
    { type: "mc", q: "How do you fold an int into a string for a describe() method?",
      choices: ["to_string(n)", "string(n)", "(string)n", "n.str()"],
      answer: 0, why: "to_string(n) converts a number to its text form so it can be concatenated with +." },
    { type: "output", q: "State plus voice:", code: "struct Banner {\n    string name; int wins = 0;\n    void win() { wins++; }\n    string describe() { return name + \" (\" + to_string(wins) + \")\"; }\n};\nBanner b{\"Vale\"};\nb.win();\ncout << b.describe();",
      answer: "Vale (1)", why: "win() grows wins to 1; describe() reports \"Vale (1)\"." },
    { type: "tf", q: "True or False — a method can change its object's fields, and the change persists for later calls.",
      answer: true, why: "Methods mutate the object's own fields; it remembers the new values until changed again." }
  ],
  challenge: {
    title: "The Living Banner",
    story: "Isolde threads her needle. \"Stitch me a banner that counts its victories and can name them aloud — and starts, like all of us, at nothing.\"",
    prompt: [
      "The input is a `name` (one word) and a number of wins `w`. The starter reads them.",
      "Build a Banner that starts with **0** victories, record `w` wins, then print its description in the form `NAME (VICTORIES)`:",
      ">>>Ash (2)",
      "(Example for the input `Ash 2`.)",
      "Use a struct with a field that **changes** (a `win()` method) and a method that **reports** it."
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Banner {\n    string name;\n    int victories = 0;\n    // void win() { ... }\n    // string describe() { return name + \" (\" + to_string(victories) + \")\"; }\n};\n\nint main() {\n    string name;\n    int w;\n    cin >> name >> w;\n    // make a Banner named name; win() it w times; print its description\n\n    return 0;\n}\n",
    tests: [
      { stdin: "Ash 2", expectOut: "Ash (2)", label: "two victories" },
      { stdin: "Vale 0", expectOut: "Vale (0)", label: "an untested banner" },
      { stdin: "Kingsfall 5", expectOut: "Kingsfall (5)", label: "five victories" }
    ],
    hints: [
      "Give the struct: void win() { victories++; } and string describe() { return name + \" (\" + to_string(victories) + \")\"; }",
      "In main: Banner b{name}; then loop w times calling b.win(); then cout << b.describe() << \"\\n\";",
      "Full answer:\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Banner {\n    string name;\n    int victories = 0;\n    void win() { victories++; }\n    string describe() { return name + \" (\" + to_string(victories) + \")\"; }\n};\n\nint main() {\n    string name;\n    int w;\n    cin >> name >> w;\n    Banner b{name};\n    for (int i = 0; i < w; i++) b.win();\n    cout << b.describe() << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 350, coins: 98, items: [["phoenix_draught", 1]] }
},

/* ---------------- cpp18 : BOSS — Sir Kael, the Kingless ---------------- */
{
  id: "cpp18", faction: "cpp", act: 4, title: "Sir Kael, the Kingless", npc: "edric", map: "citadel", boss: true,
  bossEnemy: "boss_kael", bossSpot: { map: "citadel", x: 32, y: 20 },
  intro: [
    "He's here. Sir Kael — the First Kingdom's champion, who refused the crown three times and outlived everyone who didn't.",
    "The Flame has raised him in the great hall, and he is *interviewing* for someone worthy to pass to the Sanctum. The interviews are not going well. For the interviewees.",
    "He will test the officer's art: functions, structs, the whole discipline. Face <b>Sir Kael</b> in the great hall, southeast."
  ],
  acceptLabel: "I'll face the champion.",
  midDialogue: "Kael drills alone in the great hall, southeast. He has been warming up for a thousand years.",
  returnDialogue: ["Sir Kael awaits in the great hall, southeast of the courtyard."],
  doneDialogue: "Beaten by the book HE wrote — he'd respect that. The pass to the Flame Sanctum is yours. What waits there waited a thousand years for you specifically.",
  lesson: {
    title: "Trial of the Kingless (Recap)",
    body: [
      "Kael tests the full officer's art:",
      ">>>int f(int x, int y = 0) { return x + y; }   // functions, defaults\n\nstruct Being {                              // structs with state\n    int hp;\n    bool is_alive() { return hp > 0; }\n    void hurt(int n) { hp = max(0, hp - n); }\n};",
      "His trial is a living thing: a **Hero** who takes damage, heals, and refuses to die past zero. Guard the boundary — hp must never sink below 0.",
      "`max(a, b)` (from `#include <algorithm>`) picks the larger. `max(0, hp - n)` is the classic floor-at-zero."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "Kael lowers his blade: 'Trace my strike.'", code: "int blow(int power, int guard = 2) {\n    return power - guard;\n}\nint main() {\n    cout << blow(10) + blow(10, 5);\n}",
      answer: "13", why: "blow(10) uses the default guard 2 (8); blow(10,5) is 5. 8 + 5 = 13." },
    { type: "mc", q: "'A method must read THIS hero's hp. How?'",
      choices: ["Just write hp", "Only this.hp(hp)", "Hero.hp", "get_hp(hp)"],
      answer: 0, why: "Inside a method, the bare member name hp means this object's hp." },
    { type: "output", q: "'Floor at zero, soldier.'", code: "int hp = 4;\nhp = max(0, hp - 9);\ncout << hp;",
      answer: "0", why: "4 - 9 is -5; max(0, -5) floors it at 0." },
    { type: "output", q: "'Can your beings change?'", code: "struct Hero {\n    int hp = 10;\n    void hurt() { hp -= 3; }\n};\nint main() {\n    Hero h;\n    h.hurt();\n    h.hurt();\n    cout << h.hp;\n}",
      answer: "4", why: "Two hurts: 10 -> 7 -> 4. Methods mutate this object's members." }
  ],
  challenge: {
    title: "The Champion's Form",
    story: "Kael plants his blade. \"Write me a hero who can bleed, mend, and KNOW whether they still stand. If your hero dies past zero — so do you.\"",
    prompt: [
      "Define a `struct Hero` with members `string name;` and `int hp;`, and methods:",
      "— `take_damage(int n)`: reduce hp by n, but **never below 0** (use `max`).",
      "— `heal(int n)`: increase hp by n.",
      "— `is_alive()`: return `true` if hp is greater than 0.",
      "The starter's `main` stamps the hero, runs a list of `damage N` / `heal N` commands, then prints the final hp and `alive` or `dead`.",
      ">>>Bryn, hp 30, commands damage 10 then damage 50  ->  hp 0, then dead",
      "Input: line 1 `name hp`; line 2 `k` (number of commands); then `k` lines of `damage N` or `heal N`."
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstruct Hero {\n    string name;\n    int hp;\n\n    void take_damage(int n) {\n        // reduce hp by n, but never below 0\n\n    }\n    void heal(int n) {\n        // increase hp by n\n\n    }\n    bool is_alive() {\n        // true if hp > 0\n        return false;\n    }\n};\n\nint main() {\n    string name; int hp;\n    cin >> name >> hp;\n    Hero h{name, hp};\n    int k;\n    cin >> k;\n    for (int i = 0; i < k; i++) {\n        string cmd; int amt;\n        cin >> cmd >> amt;\n        if (cmd == \"damage\") h.take_damage(amt);\n        else h.heal(amt);\n    }\n    cout << h.hp << \"\\n\";\n    cout << (h.is_alive() ? \"alive\" : \"dead\") << \"\\n\";\n    return 0;\n}\n",
    tests: [
      { stdin: "Bryn 30\n2\ndamage 10\ndamage 50", expectOut: "0\ndead", label: "overkill floors at 0, then dead" },
      { stdin: "Sora 5\n1\nheal 7", expectOut: "12\nalive", label: "heal 5 -> 12, alive" },
      { stdin: "Kael 30\n1\ndamage 10", expectOut: "20\nalive", label: "take 10 -> 20, alive" },
      { stdin: "Edda 10\n2\ndamage 4\nheal 1", expectOut: "7\nalive", label: "4 down, 1 up -> 7" }
    ],
    hints: [
      "take_damage: hp = max(0, hp - n); — heal: hp += n; — is_alive: return hp > 0;",
      "max(0, hp - n) keeps hp from going negative. Leave main alone — it drives the commands.",
      "Full answer:\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstruct Hero {\n    string name;\n    int hp;\n\n    void take_damage(int n) {\n        hp = max(0, hp - n);\n    }\n    void heal(int n) {\n        hp += n;\n    }\n    bool is_alive() {\n        return hp > 0;\n    }\n};\n\nint main() {\n    string name; int hp;\n    cin >> name >> hp;\n    Hero h{name, hp};\n    int k;\n    cin >> k;\n    for (int i = 0; i < k; i++) {\n        string cmd; int amt;\n        cin >> cmd >> amt;\n        if (cmd == \"damage\") h.take_damage(amt);\n        else h.heal(amt);\n    }\n    cout << h.hp << \"\\n\";\n    cout << (h.is_alive() ? \"alive\" : \"dead\") << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 800, coins: 250, items: [["kingless_blade", 1], ["mantle_of_embers", 1]], title: "Kingslayer", unlocks: "The Flame Sanctum" }
}
);
