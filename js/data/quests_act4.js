/* ============================================================
   ACT IV — KINGSFALL CITADEL: The Soldier's Discipline
   Functions, parameters, returns, comprehensions, classes
   ============================================================ */
window.QUEST_DB.push(

/* ---------------- py14 : The Soldier's Drill ---------------- */
{
  id: "py14", act: 4, title: "The Soldier's Drill", npc: "edric", map: "citadel",
  intro: [
    "Halt. State your— ah. The mark. At ease, survivor. I am Edric, castellan of what remains.",
    "The Spectral Knights drilling in the west yard have repeated the same exercise for a thousand years. There is a lesson in that, and also a problem, and both are yours now.",
    "Disperse <b>5 Spectral Knights</b>, and learn the soldier's secret: name a maneuver ONCE, then call it by name forever. The old tongue calls it a <b>function</b>."
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
      "A **function** is a named maneuver: define it once with `def`, call it by name whenever needed:",
      ">>>def salute():\n    print(\"For the First Kingdom!\")\n\nsalute()   # runs the body\nsalute()   # and again",
      "**Parameters** let the same maneuver work on different targets:",
      ">>>def greet(name):\n    print(f\"Hail, {name}!\")\n\ngreet(\"Bryn\")   # Hail, Bryn!\ngreet(\"Sora\")   # Hail, Sora!",
      "The true power is **return** — a function that hands its result back, for you to store or reuse:",
      ">>>def double(x):\n    return x * 2\n\nhit = double(6)        # hit is now 12\nprint(double(5) + 1)   # 11",
      "`return` ends the function instantly and delivers the value. `print` only *shows* a value — it hands back nothing. A function with no return gives back `None`.",
      "Multiple parameters arrive in order:",
      ">>>def strike(strength, bonus):\n    return strength * 2 + bonus\n\nprint(strike(5, 3))   # 13"
    ],
    fragments: [
      "**Fragment I** — `def name():` defines; `name()` calls. The body is indented. Defining alone runs NOTHING — only the call does.",
      "**Fragment II** — Parameters are the function's inputs: `def greet(name):`. The caller fills them: `greet(\"Bryn\")`. Order matters.",
      "**Fragment III** — `return value` hands the result back and ends the function. The caller can store it: `x = double(6)`.",
      "**Fragment IV** — return ≠ print. print shows; return delivers. A function that only prints returns `None` — useless for further math.",
      "**Fragment V** — `def strike(strength, bonus):` — two parameters, filled in order: `strike(5, 3)` means strength=5, bonus=3."
    ]
  },
  kills: { enemy: "spectral_knight", count: 5 },
  questions: [
    { type: "output", q: "Define, then call:", code: "def cry():\n    print(\"Charge!\")\n\ncry()\ncry()",
      answer: "Charge!\nCharge!", why: "The definition runs nothing; each call runs the body once." },
    { type: "mc", q: "What does return do?",
      choices: ["Hands a value back to the caller and ends the function", "Prints a value", "Restarts the function", "Deletes the function"],
      answer: 0, why: "return delivers the result; the caller can store or use it." },
    { type: "output", q: "Stored maneuver:", code: "def double(x):\n    return x * 2\n\nhit = double(6)\nprint(hit)",
      answer: "12", why: "double(6) returns 12, stored in hit, then printed." },
    { type: "mc", q: "A function has no return statement. What does it give back?",
      choices: ["None", "0", "Its last printed value", "An error"],
      answer: 0, why: "No return means the function hands back None." },
    { type: "output", q: "Parameters arrive in order:", code: "def strike(strength, bonus):\n    return strength * 2 + bonus\n\nprint(strike(4, 1))",
      answer: "9", why: "strength=4, bonus=1: 4*2+1 = 9." },
    { type: "fill", q: "Fill the blank to define the maneuver:", code: "____ rally(name):\n    return f\"{name} stands!\"",
      answer: "def", why: "def begins every function definition." },
    { type: "output", q: "Return ends the function INSTANTLY:", code: "def test(x):\n    if x > 5:\n        return \"high\"\n    return \"low\"\n\nprint(test(9))",
      answer: "high", why: "x > 5, so the first return fires and \"low\" is never reached." }
  ],
  challenge: {
    title: "Codify the Strike",
    story: "Edric chalks the formula on the wall: damage is strength doubled, plus the weapon's bonus. \"Make it a function. The army will call it ten thousand times; you will write it once.\"",
    prompt: [
      "Define a function `strike(strength, bonus)` that **returns** the damage:",
      ">>>strength * 2 + bonus",
      "Examples:",
      ">>>strike(5, 3)   ->  13\nstrike(0, 7)   ->  7\nstrike(10, 0)  ->  20",
      "Use `return` — do not print. The drill-masters will test your function directly."
    ],
    mode: "function",
    funcName: "strike",
    starter: "def strike(strength, bonus):\n    # return strength doubled, plus the bonus\n    \n",
    tests: [
      { args: [5, 3], expect: 13, label: "strike(5, 3)" },
      { args: [0, 7], expect: 7, label: "strike(0, 7)" },
      { args: [10, 0], expect: 20, label: "strike(10, 0)" },
      { args: [12, 6], expect: 30, label: "strike(12, 6)" }
    ],
    hints: [
      "The whole body is one line starting with return.",
      "return strength * 2 + bonus — no print() anywhere.",
      "Full answer:\ndef strike(strength, bonus):\n    return strength * 2 + bonus"
    ],
    explain: "`return` is why the drill-masters could test your function directly: it hands the computed number back to whoever called. A print would only have DISPLAYED it — the function would return None, and the army's math would collapse."
  },
  rewards: { xp: 300, coins: 85, items: [["citadel_plate", 1]] }
},

/* ---------------- py14b : The Officer's Report ---------------- */
{
  id: "py14b", act: 4, title: "The Officer's Report", npc: "doran", map: "citadel",
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
    title: "The Officer's Orders — Returning Many & Scope",
    body: [
      "A function can hand back **more than one value** — separate them with commas, and the caller **unpacks** them:",
      ">>>def extremes(nums):\n    return min(nums), max(nums)\n\nlo, hi = extremes([3, 9, 1])\nprint(lo, hi)   # 1 9",
      "What `return a, b` really hands back is a **tuple** `(a, b)` — unpacking just splits it into names.",
      "Variables created inside a function are **local**: they live only during the call and never collide with names outside:",
      ">>>def f():\n    x = 99        # local to f - a different x\n    return x\n\nx = 1\nf()\nprint(x)          # still 1 - the inner x was separate",
      "Parameters are local too. A clean function reads its inputs, works on its own locals, and hands results back through `return` — it doesn't reach outside for stray variables.",
      "This is why functions compose: each one is a sealed order. You give it inputs, it gives you outputs, and nothing leaks."
    ],
    fragments: [
      "**Fragment I** — `return a, b` hands back two values at once (as a tuple). The caller unpacks: `x, y = f()`.",
      "**Fragment II** — Unpacking splits a returned pair into names in order: `lo, hi = extremes(nums)`.",
      "**Fragment III** — Variables made inside a function are LOCAL: they vanish when it returns and don't clash with outside names.",
      "**Fragment IV** — A function should take inputs as parameters and give outputs via return — not depend on or change outside variables. Sealed orders compose."
    ]
  },
  kills: { enemy: "pact_knight", count: 4 },
  questions: [
    { type: "output", q: "Two values, unpacked:", code: "def pair():\n    return 3, 7\n\na, b = pair()\nprint(a, b)",
      answer: "3 7", why: "return 3, 7 hands back both; a, b = ... unpacks them in order." },
    { type: "mc", q: "What does `return a, b` actually return?",
      choices: ["a tuple (a, b)", "just a", "just b", "two separate functions"],
      answer: 0, why: "Commas pack the values into a tuple; unpacking splits it back apart." },
    { type: "output", q: "Local stays local:", code: "def f():\n    n = 99\n    return n\n\nn = 1\nf()\nprint(n)",
      answer: "1", why: "The n inside f is a separate, local variable; the outer n is untouched." },
    { type: "fill", q: "Fill the blanks to unpack the two returned values:", code: "lo, ____ = extremes(nums)",
      answer: "hi", why: "Unpacking names each returned value in order: lo gets the first, hi the second." },
    { type: "output", q: "Smallest and largest at once:", code: "def ends(xs):\n    return min(xs), max(xs)\n\nprint(ends([5, 2, 8]))",
      answer: "(2, 8)", why: "The function returns the tuple (2, 8); printing a tuple shows its parentheses." },
    { type: "mc", q: "Variables created inside a function are...",
      choices: ["local — they vanish when the function returns", "global — visible everywhere", "saved forever", "shared with the caller"],
      answer: 0, why: "Locals live only for the duration of the call; they don't leak outside." },
    { type: "tf", q: "True or False — a function can return several values at once.",
      answer: true, why: "Separate them with commas: `return a, b, c` hands back a tuple of all three." }
  ],
  challenge: {
    title: "The Officer's Report",
    story: "Doran taps the muster roll. \"One report, two numbers: how many stand ready, and how many are still recruits. Bring me BOTH at once.\"",
    prompt: [
      "Define a function `report(levels)`:",
      "— `levels` is a list of soldier levels (ints).",
      "— **Return two values**: the count of levels `>= 10` (ready), then the count `< 10` (recruits).",
      "Examples:",
      ">>>report([5, 12, 9, 30])   ->  (2, 2)\nreport([1, 2])           ->  (0, 2)\nreport([10, 20])         ->  (2, 0)",
      "Use `return ready, recruits` — two values, one report."
    ],
    mode: "function",
    funcName: "report",
    starter: "def report(levels):\n    ready = 0\n    recruits = 0\n    # count each level into ready (>= 10) or recruits (< 10)\n    # then: return ready, recruits\n    \n",
    tests: [
      { args: [[5, 12, 9, 30]], expect: [2, 2], label: "mixed muster" },
      { args: [[1, 2]], expect: [0, 2], label: "all recruits" },
      { args: [[10, 20]], expect: [2, 0], label: "all ready" },
      { args: [[]], expect: [0, 0], label: "empty muster" }
    ],
    hints: [
      "Loop the levels: if lvl >= 10: ready += 1, else: recruits += 1.",
      "Hand both back at once: return ready, recruits",
      "Full answer:\ndef report(levels):\n    ready = 0\n    recruits = 0\n    for lvl in levels:\n        if lvl >= 10:\n            ready += 1\n        else:\n            recruits += 1\n    return ready, recruits"
    ],
    explain: "`return ready, recruits` packs both tallies into one tuple, so a single call answers the whole order — the caller unpacks it with `r, c = report(...)`. Both counters are locals, started fresh each call, so every report is clean and self-contained."
  },
  rewards: { xp: 310, coins: 88, items: [["scroll_of_insight", 2]] }
},

/* ---------------- py15 : Sigils of Binding ---------------- */
{
  id: "py15", act: 4, title: "Sigils of Binding", npc: "wynn", map: "citadel",
  intro: [
    "I dreamed you would arrive today. I also dreamed you would arrive yesterday, so do not be too impressed.",
    "The Flame Revenants in the inner keep are unfinished functions — maneuvers that were never given their full parameters. They burn with missing arguments.",
    "Quench <b>5 Flame Revenants</b>, and I will complete your training: defaults, early returns, and functions that judge whole armies at once."
  ],
  acceptLabel: "I'll complete what they could not.",
  midDialogue: "The revenants still burn in the keep. They are missing their endings — give them yours.",
  returnDialogue: [
    "The keep cools. The unfinished are finished.",
    "Now the binding trial: the citadel must count its battle-ready soldiers at any threshold. Write the function the garrison will live by."
  ],
  doneDialogue: "Bound and sealed. The garrison calls your function nightly now. You are quoted in watchtowers.",
  lesson: {
    title: "Deeper Bindings — Defaults & Functions over Lists",
    body: [
      "A parameter can carry a **default** — used when the caller stays silent:",
      ">>>def forge(metal, heat=100):\n    return f\"{metal} at {heat}\"\n\nprint(forge(\"iron\"))        # iron at 100 - default used\nprint(forge(\"iron\", 300))   # iron at 300 - default overridden",
      "Functions can **end early** — a return anywhere stops everything:",
      ">>>def judge(power):\n    if power <= 0:\n        return \"unfit\"\n    return \"ready\"",
      "And functions take **lists** like any other value. Loop inside, count, return the verdict:",
      ">>>def count_ready(levels, threshold):\n    count = 0\n    for lvl in levels:\n        if lvl >= threshold:\n            count += 1\n    return count\n\nprint(count_ready([5, 12, 9, 30], 10))   # 2",
      "This shape — *loop, test, count, return* — runs half the kingdom's old machinery. Learn it by heart."
    ],
    fragments: [
      "**Fragment I** — `def f(x, y=10):` gives y a default. Callers may omit it: `f(3)` uses 10; `f(3, 99)` overrides.",
      "**Fragment II** — A return inside an if exits immediately. Code after it in the function simply never runs for that call.",
      "**Fragment III** — Lists pass into functions whole: `def audit(levels):` then loop `for lvl in levels:` inside.",
      "**Fragment IV** — The counting shape: `count = 0` → loop → `if condition: count += 1` → `return count`. Four lines that run kingdoms.",
      "**Fragment V** — Defaults must come AFTER required parameters: `def f(a, b=2):` is law; `def f(a=2, b):` is heresy (SyntaxError)."
    ]
  },
  kills: { enemy: "flame_revenant", count: 5 },
  questions: [
    { type: "output", q: "The silent caller:", code: "def forge(metal, heat=100):\n    return f\"{metal} at {heat}\"\n\nprint(forge(\"iron\"))",
      answer: "iron at 100", why: "No second argument given, so the default heat=100 is used." },
    { type: "mc", q: "def f(a, b=5): — which call is INVALID?",
      choices: ["f()", "f(1)", "f(1, 2)", "f(9, 9)"],
      answer: 0, why: "a has no default — the caller must supply it. f() leaves a empty." },
    { type: "output", q: "The early exit:", code: "def judge(power):\n    if power <= 0:\n        return \"unfit\"\n    return \"ready\"\n\nprint(judge(-3))",
      answer: "unfit", why: "-3 <= 0, so the early return fires." },
    { type: "output", q: "Judge the army:", code: "def count_high(nums, limit):\n    c = 0\n    for n in nums:\n        if n > limit:\n            c += 1\n    return c\n\nprint(count_high([4, 8, 15], 5))",
      answer: "2", why: "8 and 15 exceed 5: count is 2." },
    { type: "mc", q: "Where must default parameters sit?",
      choices: ["After all required parameters", "Before required parameters", "Anywhere", "Alone"],
      answer: 0, why: "def f(a, b=2) is valid; def f(a=2, b) is a SyntaxError." },
    { type: "output", q: "Override the default:", code: "def ward(power=1):\n    return power * 3\n\nprint(ward(4))",
      answer: "12", why: "The caller supplied 4, overriding the default: 4*3 = 12." },
    { type: "mc", q: "What does `return` inside a for loop (inside a function) do?",
      choices: ["Exits the whole function immediately, loop and all", "Skips one pass", "Only ends the loop", "Nothing"],
      answer: 0, why: "return is absolute: function over, value delivered, loop abandoned." }
  ],
  challenge: {
    title: "The Garrison Count",
    story: "Wynn's eyes go white. \"I see ten thousand musters. In every one, the castellan asks: how many stand ready? Write it once, and the question is answered forever.\"",
    prompt: [
      "Define `count_ready(levels, threshold=10)`:",
      "— `levels` is a list of soldier levels (ints).",
      "— Return how many are `>= threshold`.",
      "— `threshold` must **default to 10** when the caller omits it.",
      "Examples:",
      ">>>count_ready([5, 12, 9, 30])      ->  2   (uses default 10)\ncount_ready([1, 2, 3], 2)        ->  2\ncount_ready([], 5)               ->  0"
    ],
    mode: "function",
    funcName: "count_ready",
    starter: "def count_ready(levels, threshold=10):\n    # count how many levels are >= threshold\n    count = 0\n    \n",
    tests: [
      { args: [[5, 12, 9, 30]], expect: 2, label: "default threshold (10)" },
      { args: [[1, 2, 3], 2], expect: 2, label: "threshold 2" },
      { args: [[], 5], expect: 0, label: "an empty muster" },
      { args: [[10], 10], expect: 1, label: "exactly at the threshold" }
    ],
    hints: [
      "The counting shape: count = 0, loop the list, if lvl >= threshold: count += 1, return count.",
      "The default goes in the def line: def count_ready(levels, threshold=10):",
      "Full answer:\ndef count_ready(levels, threshold=10):\n    count = 0\n    for lvl in levels:\n        if lvl >= threshold:\n            count += 1\n    return count"
    ],
    explain: "`threshold=10` in the def line makes a silent caller mean 10 — that's why count_ready([5, 12, 9, 30]) worked with one argument. Inside is the counting shape: start at 0, test every level, += 1 on a match, return after the loop. An empty muster simply never enters the loop and returns 0."
  },
  rewards: { xp: 320, coins: 90, items: [["pyreheart_cleaver", 1]] }
},

/* ---------------- py16 : The Shaping of Many ---------------- */
{
  id: "py16", act: 4, title: "The Shaping of Many", npc: "wynn", map: "citadel",
  intro: [
    "Another vision: you, writing four lines where one would do. I wept. The other oracles wept. We must prevent this future.",
    "The Molten Gargoyles on the east wall were shaped by the old masons one chisel-stroke at a time. There is a faster way to shape many — and the gargoyles hate it.",
    "Shatter <b>5 Molten Gargoyles</b>, and learn the shaping-of-many: the <b>list comprehension</b>."
  ],
  acceptLabel: "Show me the faster way.",
  midDialogue: "The gargoyles still squat on the east wall, judging your loop syntax.",
  returnDialogue: [
    "Shattered, all five. The wall is just a wall again.",
    "The final shaping: empower a roster of veterans in a single stroke. One line, marked one. I have seen you write it."
  ],
  doneDialogue: "One line! The masons' ghosts applaud. Brevity, it turns out, is also a weapon.",
  lesson: {
    title: "The Shaping of Many — List Comprehensions",
    body: [
      "You know this loop — build a new list from an old one:",
      ">>>doubled = []\nfor x in [1, 2, 3]:\n    doubled.append(x * 2)\n# [2, 4, 6]",
      "The **comprehension** shapes it in one stroke — same meaning, one line:",
      ">>>doubled = [x * 2 for x in [1, 2, 3]]   # [2, 4, 6]",
      "Read it aloud: *\"x times 2, for each x in the list.\"* The expression comes first, the loop after.",
      "Add an `if` at the end to **filter** — only matching items survive:",
      ">>>levels = [12, 3, 10, 8]\nveterans = [lvl for lvl in levels if lvl >= 10]   # [12, 10]",
      "Transform AND filter together — the filter chooses, the expression shapes:",
      ">>>empowered = [lvl * 2 for lvl in levels if lvl >= 10]   # [24, 20]",
      "They work on any iterable: `[c.upper() for c in \"ash\"]` is `['A', 'S', 'H']`, and `[i * i for i in range(4)]` is `[0, 1, 4, 9]`."
    ],
    fragments: [
      "**Fragment I** — `[expression for item in lst]` builds a new list in one stroke. `[x * 2 for x in nums]` doubles everything.",
      "**Fragment II** — Append-loop and comprehension are the same spell in different robes. If you can write the loop, you can fold it.",
      "**Fragment III** — A trailing `if` filters: `[x for x in nums if x > 0]` keeps only the positives.",
      "**Fragment IV** — Shape and filter together: `[x * 2 for x in nums if x >= 10]` — the if chooses, the expression transforms the chosen.",
      "**Fragment V** — Comprehensions drink from any source: strings, ranges, other lists. `[i * i for i in range(4)]` is `[0, 1, 4, 9]`."
    ]
  },
  kills: { enemy: "molten_gargoyle", count: 5 },
  questions: [
    { type: "output", q: "The one-stroke shape:", code: "print([x * 2 for x in [1, 2, 3]])",
      answer: "[2, 4, 6]", why: "Each x is doubled into a new list." },
    { type: "mc", q: "Which comprehension keeps only positive numbers?",
      choices: ["[x for x in nums if x > 0]", "[x > 0 for x in nums]", "[if x > 0: x for nums]", "[x for x > 0 in nums]"],
      answer: 0, why: "The filter if goes at the END: [x for x in nums if x > 0]." },
    { type: "output", q: "Filter, then count:", code: "nums = [4, 11, 8, 20]\nbig = [n for n in nums if n > 9]\nprint(len(big))",
      answer: "2", why: "11 and 20 pass the filter: a list of two." },
    { type: "output", q: "Shape a range:", code: "print([i * i for i in range(4)])",
      answer: "[0, 1, 4, 9]", why: "Squares of 0,1,2,3." },
    { type: "mc", q: "What loop does [w.upper() for w in words] replace?",
      choices: ["A for loop that appends w.upper() to a new list", "A while loop", "An if/else chain", "Nothing — it's different"],
      answer: 0, why: "It's exactly the build-a-new-list loop, folded into one line." },
    { type: "output", q: "Shape AND filter:", code: "lv = [12, 3, 10]\nprint([x * 2 for x in lv if x >= 10])",
      answer: "[24, 20]", why: "12 and 10 pass the filter, then double: [24, 20]. The 3 is discarded." },
    { type: "fill", q: "Fill the blank to keep strings longer than 3:", code: "long = [w for w in words ____ len(w) > 3]",
      answer: "if", why: "The trailing if filters which items enter the new list." }
  ],
  challenge: {
    title: "Empower the Veterans",
    story: "Wynn lays out the muster roll. \"The Flame will double the strength of every soldier of level 10 or higher. The recruits stay home. One line, remember. I have *seen* it.\"",
    prompt: [
      "Define `empower(levels)`:",
      "— `levels` is a list of ints.",
      "— Return a **new list**: every level that is `>= 10`, **doubled**. Drop the rest.",
      "— Keep the original order.",
      "Examples:",
      ">>>empower([12, 3, 10])   ->  [24, 20]\nempower([1, 2])         ->  []\nempower([10])           ->  [20]",
      "A single list comprehension is the intended shape (a loop works too — but where's the artistry?)."
    ],
    mode: "function",
    funcName: "empower",
    starter: "def empower(levels):\n    # return [each level * 2, for levels >= 10]\n    return \n",
    tests: [
      { args: [[12, 3, 10]], expect: [24, 20], label: "two veterans" },
      { args: [[1, 2]], expect: [], label: "all recruits" },
      { args: [[10]], expect: [20], label: "exactly level 10" },
      { args: [[30, 9, 15, 2]], expect: [60, 30], label: "mixed muster" }
    ],
    hints: [
      "Shape: [lvl * 2 for lvl in levels if lvl >= 10]",
      "Return it directly — return [lvl * 2 for lvl in levels if lvl >= 10]",
      "Full answer:\ndef empower(levels):\n    return [lvl * 2 for lvl in levels if lvl >= 10]"
    ],
    explain: "One comprehension, two jobs: the trailing `if lvl >= 10` chooses who marches, and the leading `lvl * 2` shapes the chosen. Recruits never enter the new list at all, and because the comprehension walks in order, the veterans keep their ranks."
  },
  rewards: { xp: 340, coins: 95, items: [["phoenix_draught", 2]] }
},

/* ---------------- py17 : Echoes Given Form ---------------- */
{
  id: "py17", act: 4, title: "Echoes Given Form", npc: "edric", map: "citadel",
  intro: [
    "Soldier. We have a situation in the great hall: the empty armors are walking again. No ghosts inside — the armor itself remembers *being a knight*.",
    "That is the deepest magic of the First Kingdom: they could write down what a thing IS — its properties, its behaviors — and stamp living copies from the writing. They called the writing a <b>class</b>.",
    "Dismantle <b>5 Animated Armors</b> in the great hall, then I will teach you to write beings of your own."
  ],
  acceptLabel: "I'll handle the armory.",
  midDialogue: "The armors still clatter through the great hall, remembering parade formation.",
  returnDialogue: [
    "Quiet at last. Now — the deep lesson.",
    "Write me a Knight: not one knight, the IDEA of a knight. Name, power, a rallying cry, a strike. From your writing, I could stamp a thousand."
  ],
  doneDialogue: "From your one writing, a thousand knights could stand. This is how the Kingdom built its armies — and perhaps how something rebuilds them today.",
  lesson: {
    title: "The Stamp of Being — Classes & Objects",
    body: [
      "A **class** is a blueprint; an **object** (instance) is one being stamped from it:",
      ">>>class Knight:\n    def __init__(self, name, power):\n        self.name = name\n        self.power = power\n\nbors = Knight(\"Bors\", 10)   # stamping an instance\nprint(bors.name)    # Bors\nprint(bors.power)   # 10",
      "`__init__` is the forging rite — it runs once per new object, storing the **attributes** onto `self`.",
      "`self` IS the object being worked on. Every method's first parameter is self — Python fills it in automatically when you call.",
      "**Methods** are functions that live in the class and act on self:",
      ">>>class Knight:\n    def __init__(self, name, power):\n        self.name = name\n        self.power = power\n\n    def rally(self):\n        return f\"{self.name} stands!\"\n\n    def strike(self, bonus):\n        return self.power + bonus\n\nmira = Knight(\"Mira\", 7)\nprint(mira.rally())      # Mira stands!\nprint(mira.strike(5))    # 12",
      "Each object keeps its OWN attributes: `Knight(\"Bors\", 10)` and `Knight(\"Mira\", 7)` do not share power."
    ],
    fragments: [
      "**Fragment I** — `class Name:` writes the blueprint. `Name(args)` stamps an object. The class is the idea; the object is the thing.",
      "**Fragment II** — `__init__(self, ...)` runs at stamping. Store attributes onto self: `self.name = name`. Two underscores on each side!",
      "**Fragment III** — `self` is 'this very object'. Methods always take it first; callers never pass it — Python does.",
      "**Fragment IV** — Methods are the being's verbs: `def rally(self):` ... called as `bors.rally()`. They can read self's attributes and take extra arguments.",
      "**Fragment V** — Every stamped object owns its attributes separately. Changing `mira.power` never touches `bors.power`."
    ]
  },
  kills: { enemy: "animated_armor", count: 5 },
  questions: [
    { type: "output", q: "Stamp and read:", code: "class Torch:\n    def __init__(self, fuel):\n        self.fuel = fuel\n\nt = Torch(5)\nprint(t.fuel)",
      answer: "5", why: "__init__ stored 5 onto self.fuel; t.fuel reads it back." },
    { type: "mc", q: "What is __init__?",
      choices: ["The method that runs when an object is created", "A loop", "The class's name", "A built-in print"],
      answer: 0, why: "__init__ initializes each new object — the forging rite." },
    { type: "mc", q: "What is self?",
      choices: ["The specific object the method is acting on", "The class itself", "A keyword for loops", "The first argument the CALLER must pass"],
      answer: 0, why: "self is this-very-object. Python passes it automatically on method calls." },
    { type: "output", q: "The verb of a being:", code: "class Wolf:\n    def __init__(self, name):\n        self.name = name\n    def howl(self):\n        return self.name + \"!\"\n\nw = Wolf(\"Fang\")\nprint(w.howl())",
      answer: "Fang!", why: "howl reads self.name and appends !." },
    { type: "output", q: "Two stamps, two beings:", code: "class Orb:\n    def __init__(self, glow):\n        self.glow = glow\n\na = Orb(3)\nb = Orb(8)\na.glow = 4\nprint(a.glow, b.glow)",
      answer: "4 8", why: "Each object owns its attributes — changing a never touches b." },
    { type: "fill", q: "Fill the blank in the forging rite:", code: "class Knight:\n    def __init__(____, name):\n        self.name = name",
      answer: "self", why: "Every method's first parameter is self — including __init__." },
    { type: "mc", q: "Given k = Knight(\"Bors\", 10), how do you call its rally method?",
      choices: ["k.rally()", "rally(k)", "Knight.rally", "k.rally"],
      answer: 0, why: "Methods are called through the object with a dot and parentheses." }
  ],
  challenge: {
    title: "Write the Knight",
    story: "Edric hands you the old stamping-plates. \"Name, power, a cry, a strike. Write the IDEA of a knight, and the citadel will do the rest.\"",
    prompt: [
      "Define a class `Knight`:",
      "— `__init__(self, name, power)` stores both onto self.",
      "— Method `rally(self)` returns the string `\"NAME stands!\"` (e.g. `\"Mira stands!\"`).",
      "— Method `strike(self, bonus)` returns `power + bonus`.",
      "The drill-masters will stamp knights and test them:",
      ">>>k = Knight(\"Mira\", 7)\nk.name        ->  \"Mira\"\nk.power       ->  7\nk.rally()     ->  \"Mira stands!\"\nk.strike(5)   ->  12"
    ],
    mode: "function",
    funcName: "Knight",
    starter: "class Knight:\n    def __init__(self, name, power):\n        # store name and power onto self\n        \n\n    def rally(self):\n        # return \"NAME stands!\"\n        \n\n    def strike(self, bonus):\n        # return power + bonus\n        \n",
    tests: [
      { expr: "Knight('Bors', 10).power", expect: 10, label: "stores power" },
      { expr: "Knight('Bors', 10).name", expect: "Bors", label: "stores name" },
      { expr: "Knight('Mira', 7).rally()", expect: "Mira stands!", label: "rally()" },
      { expr: "Knight('Mira', 7).strike(5)", expect: 12, label: "strike(5)" }
    ],
    hints: [
      "__init__ body: self.name = name and self.power = power",
      "rally: return f\"{self.name} stands!\" — strike: return self.power + bonus",
      "Full answer:\nclass Knight:\n    def __init__(self, name, power):\n        self.name = name\n        self.power = power\n\n    def rally(self):\n        return f\"{self.name} stands!\"\n\n    def strike(self, bonus):\n        return self.power + bonus"
    ],
    explain: "`__init__` runs once per stamping and stores each knight's own name and power onto `self`. rally and strike read them back through self — so Bors answers with Bors's values and Mira with Mira's, from the same single piece of writing."
  },
  rewards: { xp: 360, coins: 100, items: [["serpent_sigil", 1]] }
},

/* ---------------- py17b : The Living Banner ---------------- */
{
  id: "py17b", act: 4, title: "The Living Banner", npc: "isolde", map: "citadel",
  intro: [
    "Mind the standards — some of them bite now. I'm Isolde, bannerwright. I stitch standards that <i>remember</i>.",
    "The gloom sentinels by the chapel were my finest work once: banners given so much memory they woke up wrong. A being that only remembers, and never forgets, becomes a monster.",
    "Unmake <b>4 Gloom Sentinels</b>, and I'll teach you to give an object a memory it can <i>use</i> — state that changes, and a voice to report itself."
  ],
  acceptLabel: "Teach me the stitching.",
  midDialogue: "Sentinels still brooding by the chapel, remembering old defeats. End them.",
  returnDialogue: [
    "Better. Now — an object is more than stored facts. It can <i>change</i>, and it can <i>speak itself</i>.",
    "Give a banner a tally it grows over time, and a way to describe itself when asked. That is the difference between a record and a living thing."
  ],
  doneDialogue: "It remembers, it grows, it answers when asked — and it knows when to stop. You stitch living things now, bannerwright.",
  lesson: {
    title: "Living Objects — Changing State & __str__",
    body: [
      "An object's methods can **change its own attributes** — so the object remembers across calls:",
      ">>>class Banner:\n    def __init__(self, name):\n        self.name = name\n        self.victories = 0      # starts at zero\n    def win(self):\n        self.victories += 1     # the memory grows\n\nb = Banner(\"Ash\")\nb.win()\nb.win()\nprint(b.victories)   # 2 - it remembered both",
      "Notice `__init__` can set a starting value that the caller doesn't pass — `self.victories = 0`. Not every attribute comes from a parameter.",
      "Give an object a **voice** with `__str__` — Python calls it whenever the object is printed or turned into a string:",
      ">>>class Banner:\n    def __init__(self, name):\n        self.name = name\n        self.victories = 0\n    def __str__(self):\n        return f\"{self.name} ({self.victories})\"\n\nprint(Banner(\"Ash\"))   # Ash (0)  - __str__ supplied the words",
      "Without `__str__`, printing an object shows an ugly `<__main__.Banner object at 0x...>`. With it, the object speaks for itself.",
      "So a living object = attributes that **change** (state) + methods that change them + a `__str__` that reports them."
    ],
    fragments: [
      "**Fragment I** — A method can change self's attributes: `self.victories += 1`. The object remembers the change for next time.",
      "**Fragment II** — `__init__` may set defaults that aren't parameters: `self.victories = 0`. Not every attribute is passed in.",
      "**Fragment III** — `__str__(self)` returns the object's words; Python calls it on `print(obj)` or `str(obj)`. Two underscores each side.",
      "**Fragment IV** — Living object = changing state + methods that change it + a `__str__` voice. That's the whole pattern."
    ]
  },
  kills: { enemy: "gloom_sentinel", count: 4 },
  questions: [
    { type: "output", q: "The object remembers:", code: "class Tally:\n    def __init__(self):\n        self.n = 0\n    def bump(self):\n        self.n += 1\n\nt = Tally()\nt.bump()\nt.bump()\nt.bump()\nprint(t.n)",
      answer: "3", why: "Each bump() grows self.n; the object keeps the running total between calls." },
    { type: "mc", q: "When does Python call an object's __str__ method?",
      choices: ["when the object is printed or turned into a string", "when it is created", "every loop", "never automatically"],
      answer: 0, why: "print(obj) and str(obj) call __str__ to get the object's words." },
    { type: "output", q: "The object speaks:", code: "class Flag:\n    def __init__(self, c):\n        self.c = c\n    def __str__(self):\n        return f\"<{self.c}>\"\n\nprint(Flag(\"ash\"))",
      answer: "<ash>", why: "__str__ returns \"<ash>\", which print then shows." },
    { type: "mc", q: "Where can __init__ set an attribute the caller never passes?",
      choices: ["self.count = 0 — a starting value not from a parameter", "only from parameters", "nowhere", "only with __str__"],
      answer: 0, why: "__init__ can initialize any attribute, including constants like self.count = 0." },
    { type: "output", q: "State plus voice:", code: "class Banner:\n    def __init__(self, name):\n        self.name = name\n        self.wins = 0\n    def win(self):\n        self.wins += 1\n    def __str__(self):\n        return f\"{self.name} ({self.wins})\"\n\nb = Banner(\"Vale\")\nb.win()\nprint(b)",
      answer: "Vale (1)", why: "win() grows wins to 1; print(b) calls __str__, which reports \"Vale (1)\"." },
    { type: "fill", q: "Fill the blank to give an object a printable voice:", code: "def ______(self):\n    return self.name",
      answer: "__str__", why: "__str__ is the method Python calls to turn an object into a string." },
    { type: "tf", q: "True or False — a method can change the object's own attributes, and the change persists for later calls.",
      answer: true, why: "Methods mutate self's attributes; the object remembers the new values until changed again." }
  ],
  challenge: {
    title: "The Living Banner",
    story: "Isolde threads her needle. \"Stitch me a banner that counts its victories and can name them aloud — and starts, like all of us, at nothing.\"",
    prompt: [
      "Define a class `Banner`:",
      "— `__init__(self, name)` stores `name` and sets `victories` to **0**.",
      "— `win(self)` increases `victories` by 1.",
      "— `__str__(self)` returns the string `\"NAME (VICTORIES)\"`, e.g. `\"Ash (2)\"`.",
      ">>>b = Banner(\"Ash\")\nb.victories   ->  0\nb.win()\nb.win()\nstr(b)        ->  \"Ash (2)\""
    ],
    mode: "function",
    funcName: "Banner",
    starter: "class Banner:\n    def __init__(self, name):\n        # store name; set victories to 0\n        \n\n    def win(self):\n        # one more victory\n        \n\n    def __str__(self):\n        # return \"NAME (VICTORIES)\"\n        \n",
    tests: [
      { expr: "Banner('Ash').victories", expect: 0, label: "starts at 0 victories" },
      { pysetup: "b = Banner('Ash')\nb.win()\nb.win()", expr: "b.victories", expect: 2, label: "two wins remembered" },
      { expr: "str(Banner('Vale'))", expect: "Vale (0)", label: "__str__ at zero" },
      { pysetup: "b = Banner('Ash')\nb.win()", expr: "str(b)", expect: "Ash (1)", label: "__str__ after a win" }
    ],
    hints: [
      "__init__: self.name = name and self.victories = 0 (a starting value, not a parameter).",
      "win: self.victories += 1. __str__: return f\"{self.name} ({self.victories})\".",
      "Full answer:\nclass Banner:\n    def __init__(self, name):\n        self.name = name\n        self.victories = 0\n\n    def win(self):\n        self.victories += 1\n\n    def __str__(self):\n        return f\"{self.name} ({self.victories})\""
    ],
    explain: "`__init__` seeds `self.victories = 0` even though no one passes it — not every attribute is a parameter. `win()` mutates that attribute, so the banner remembers each victory, and `__str__` gives the object a voice: `print(banner)` reports its current state in words."
  },
  rewards: { xp: 350, coins: 98, items: [["phoenix_draught", 1]] }
},

/* ---------------- py18 : BOSS — Sir Kael, the Kingless ---------------- */
{
  id: "py18", act: 4, title: "Sir Kael, the Kingless", npc: "edric", map: "citadel", boss: true,
  bossEnemy: "boss_kael", bossSpot: { map: "citadel", x: 32, y: 20 },
  intro: [
    "He's here. Sir Kael — the First Kingdom's champion, who refused the crown three times and outlived everyone who didn't.",
    "The Flame has raised him in the great hall, and he is *interviewing* for someone worthy to pass to the Sanctum. The interviews are not going well. For the interviewees.",
    "He will test the officer's art: functions, classes, the whole discipline. Face <b>Sir Kael</b> in the great hall, southeast."
  ],
  acceptLabel: "I'll face the champion.",
  midDialogue: "Kael drills alone in the great hall, southeast. He has been warming up for a thousand years.",
  returnDialogue: ["Sir Kael awaits in the great hall, southeast of the courtyard."],
  doneDialogue: "Beaten by the book HE wrote — he'd respect that. The pass to the Flame Sanctum is yours. What waits there waited a thousand years for you specifically.",
  lesson: {
    title: "Trial of the Kingless (Recap)",
    body: [
      "Kael tests the full officer's art:",
      ">>>def f(x, y=0):        # functions, defaults, return\n    return x + y\n\nclass Being:           # classes\n    def __init__(self, hp):\n        self.hp = hp\n    def is_alive(self):\n        return self.hp > 0",
      "His trial is a living thing: a **Hero** who takes damage, heals, and refuses to die past zero. Guard the boundaries — hp must never sink below 0.",
      "`max(a, b)` picks the larger — `max(0, hp - n)` is the classic floor-at-zero."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "Kael lowers his blade: 'Trace my strike.'", code: "def blow(power, guard=2):\n    return power - guard\n\nprint(blow(10) + blow(10, 5))",
      answer: "13", why: "blow(10) uses the default guard (10-2=8); blow(10,5) is 5. Total 13." },
    { type: "mc", q: "'A method must read THIS knight's power. How?'",
      choices: ["self.power", "power", "Knight.power", "this.power"],
      answer: 0, why: "Attributes live on self — the object the method acts upon." },
    { type: "output", q: "'Floor at zero, soldier.'", code: "hp = 4\nhp = max(0, hp - 9)\nprint(hp)",
      answer: "0", why: "4-9 is -5; max(0, -5) floors it at 0." },
    { type: "output", q: "'Can your beings change?'", code: "class Hero:\n    def __init__(self):\n        self.hp = 10\n    def hurt(self):\n        self.hp -= 3\n\nh = Hero()\nh.hurt()\nh.hurt()\nprint(h.hp)",
      answer: "4", why: "Two hurts: 10 → 7 → 4. Methods mutate self's attributes." }
  ],
  challenge: {
    title: "The Champion's Form",
    story: "Kael plants his blade. \"Write me a hero who can bleed, mend, and KNOW whether they still stand. If your hero dies past zero or heals from the grave incorrectly — so do you.\"",
    prompt: [
      "Define a class `Hero`:",
      "— `__init__(self, name, hp)` stores both onto self.",
      "— `take_damage(self, n)`: reduce hp by n, but **never below 0** (use `max`).",
      "— `heal(self, n)`: increase hp by n.",
      "— `is_alive(self)`: return `True` if hp is greater than 0, else `False`.",
      ">>>h = Hero(\"Bryn\", 30)\nh.take_damage(10)   # hp -> 20\nh.take_damage(50)   # hp -> 0, not -30!\nh.is_alive()        # False\nh.heal(7)           # hp -> 7"
    ],
    mode: "function",
    funcName: "Hero",
    starter: "class Hero:\n    def __init__(self, name, hp):\n        \n\n    def take_damage(self, n):\n        # hp goes down by n, but never below 0\n        \n\n    def heal(self, n):\n        \n\n    def is_alive(self):\n        # True if hp > 0\n        \n",
    tests: [
      { pysetup: "h = Hero('Bryn', 30)\nh.take_damage(10)", expr: "h.hp", expect: 20, label: "take_damage(10): 30 -> 20" },
      { pysetup: "h = Hero('Bryn', 30)\nh.take_damage(50)", expr: "h.hp", expect: 0, label: "overkill floors at 0" },
      { pysetup: "h = Hero('Bryn', 30)\nh.take_damage(50)", expr: "h.is_alive()", expect: false, label: "fallen hero is_alive() False" },
      { pysetup: "h = Hero('Sora', 5)\nh.heal(7)", expr: "h.hp", expect: 12, label: "heal(7): 5 -> 12" },
      { pysetup: "h = Hero('Sora', 5)", expr: "h.is_alive()", expect: true, label: "standing hero is_alive() True" }
    ],
    hints: [
      "take_damage: self.hp = max(0, self.hp - n) — max() keeps it from going negative.",
      "is_alive: return self.hp > 0 — the comparison already IS a True/False value.",
      "Full answer:\nclass Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\n    def take_damage(self, n):\n        self.hp = max(0, self.hp - n)\n\n    def heal(self, n):\n        self.hp += n\n\n    def is_alive(self):\n        return self.hp > 0"
    ],
    explain: "`max(0, self.hp - n)` is the floor-at-zero rite — overkill can't dig below the ground. And `self.hp > 0` already IS a True/False value, so is_alive returns the comparison itself, no if/else required. Methods mutate self's attributes; the object remembers between calls."
  },
  rewards: { xp: 800, coins: 250, items: [["kingless_blade", 1], ["mantle_of_embers", 1]], title: "Kingslayer", unlocks: "The Flame Sanctum" }
}
);
