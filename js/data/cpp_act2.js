/* ============================================================
   ACT II — EMBERWOOD FOREST: Paths in the Dark  (C++ Chronicle)
   Control flow: bool & comparisons, if/else if/else, for, while
   ============================================================ */
window.QUEST_DB.push(

/* ---------------- cpp05 : Paths in the Dark ---------------- */
{
  id: "cpp05", faction: "cpp", act: 2, title: "Paths in the Dark", npc: "yara", map: "forest",
  intro: [
    "Hold. You're the one Maren marked? Good. The forest needs marked hands.",
    "Hollow Wolves prowl the south woods — beasts with nothing inside but a question. Literally. Cut one open and choices spill out.",
    "Hunt <b>4 Hollow Wolves</b>. While you hunt, learn the ranger's first law: <i>at every fork, decide</i>. C++ calls it <b>if / else if / else</b>."
  ],
  acceptLabel: "I'll take the south path.",
  midDialogue: "Still hearing howls from the south woods. A ranger finishes the hunt.",
  returnDialogue: [
    "Clean kills. The wood is quieter — listen.",
    "Last part of the law: prove you can read the howls themselves. Pass this trial and no fork in any road will stop you again."
  ],
  doneDialogue: "You decide like a ranger now. Quick, clean, no second-guessing. The deep forest is yours to walk.",
  lesson: {
    title: "The Ranger's Law — if / else if / else",
    body: [
      "First, **comparisons** — questions with a true/false answer. In C++, `true` prints as `1` and `false` as `0`:",
      ">>>7 > 3      // true   greater than\n7 < 3      // false  less than\nhp == 0    // is hp EQUAL to 0?  (two equals signs!)\nhp != 0    // is hp NOT equal to 0?\nhp >= 10   // greater than or equal",
      "A `bool` holds `true` or `false` — the forest's yes and no.",
      "An `if` takes a path only when its question is true. The condition lives in `(parentheses)`; the path lives in `{ braces }`:",
      ">>>int hp = 3;\nif (hp < 5) {\n    cout << \"Drink a salve!\";\n}",
      "`else` is the other fork; `else if` adds more forks between them. C++ takes the FIRST true path and skips the rest:",
      ">>>if (howls >= 10) {\n    cout << \"The pack hunts\";\n} else if (howls >= 5) {\n    cout << \"Wolves stir\";\n} else {\n    cout << \"The wood sleeps\";\n}",
      "Join questions: `&&` needs both true, `||` needs either, `!` flips. (For a single statement you may drop the braces — but braces are safer.)"
    ],
    fragments: [
      "**Fragment I** — Comparisons answer true/false: `>` `<` `>=` `<=`. And `==` asks 'equal?' — never confuse it with `=`, which *stores*.",
      "**Fragment II** — `if (question) { body }`: the condition in parentheses, the path in braces. The path runs only when the question is true.",
      "**Fragment III** — `else { ... }` catches everything the if rejected. Exactly one of the two paths runs. Never both.",
      "**Fragment IV** — `else if` chains forks: C++ checks top to bottom and takes the FIRST true branch only. Order them strictest to loosest."
    ]
  },
  kills: { enemy: "hollow_wolf", count: 4 },
  questions: [
    { type: "mc", q: "What does 7 > 3 evaluate to, and how does cout print it?",
      choices: ["true, printed as 1", "false, printed as 0", "7", "yes"],
      answer: 0, why: "Comparisons give a bool; 7 is greater than 3, so true — which cout prints as 1." },
    { type: "output", q: "Which path does the ranger take?", code: "int x = 5;\nif (x > 2) {\n    cout << \"big\";\n} else {\n    cout << \"small\";\n}",
      answer: "big", why: "5 > 2 is true, so the if-branch runs." },
    { type: "mc", q: "Which operator asks 'are these equal?'",
      choices: ["==", "=", "!=", "=>"],
      answer: 0, why: "== compares. A single = stores a value. != means NOT equal." },
    { type: "output", q: "Three forks, one path:", code: "int n = 0;\nif (n > 0) cout << \"alive\";\nelse if (n < 0) cout << \"curse\";\nelse cout << \"zero\";",
      answer: "zero", why: "n is 0: not > 0, not < 0, so the else path runs." },
    { type: "fill", q: "Fill the blank so the warning prints when hp is 0 OR BELOW:", code: "if (hp ____ 0) {\n    cout << \"You have fallen\";\n}",
      answer: "<=", accept: ["<="], why: "<= means less than or equal — catches 0 and below." },
    { type: "mc", q: "What joins two conditions that BOTH must be true?",
      choices: ["&&", "||", "!", "=="],
      answer: 0, why: "&& is logical AND — both sides must be true for the whole to be true." },
    { type: "output", q: "Not equal?", code: "int a = 3, b = 3;\ncout << (a != b);",
      answer: "0", why: "a and b are both 3, so 'not equal' is false, which cout prints as 0." }
  ],
  challenge: {
    title: "Reading the Howls",
    story: "Yara closes her eyes. \"Count the howls. Ten or more — the pack hunts tonight. Five to nine — they stir. Fewer — the wood sleeps. Teach the forge to read them.\"",
    prompt: [
      "The input is one integer, `howls`. The starter reads it.",
      "Print exactly one line:",
      ">>>The pack hunts     (when howls is 10 or more)\nWolves stir        (when howls is 5 to 9)\nThe wood sleeps    (when howls is under 5)",
      "Use `if`, `else if`, and `else`."
    ],
    mode: "program",
    starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int howls;\n    cin >> howls;\n    // 10+  -> The pack hunts\n    // 5-9  -> Wolves stir\n    // else -> The wood sleeps\n\n    return 0;\n}\n",
    tests: [
      { stdin: "12", expectOut: "The pack hunts", label: "howls = 12" },
      { stdin: "10", expectOut: "The pack hunts", label: "howls = 10 (the edge!)" },
      { stdin: "7", expectOut: "Wolves stir", label: "howls = 7" },
      { stdin: "5", expectOut: "Wolves stir", label: "howls = 5 (the other edge)" },
      { stdin: "2", expectOut: "The wood sleeps", label: "howls = 2" }
    ],
    hints: [
      "Check the biggest threshold first: if (howls >= 10) { ... }",
      "else if (howls >= 5) catches 5-9, because 10+ was already taken. cout << \"The pack hunts\\n\";",
      "Full answer:\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int howls;\n    cin >> howls;\n    if (howls >= 10) cout << \"The pack hunts\\n\";\n    else if (howls >= 5) cout << \"Wolves stir\\n\";\n    else cout << \"The wood sleeps\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 130, coins: 40, items: [["hardened_leather", 1]] }
},

/* ---------------- cpp06 : The Counting Curse ---------------- */
{
  id: "cpp06", faction: "cpp", act: 2, title: "The Counting Curse", npc: "aldous", map: "forest",
  intro: [
    "One. Two. Three— ah! A visitor. Do you count, traveler? You should. The counting keeps the dark out.",
    "Blight Sprites have infested the north glades — little knots of corrupted repetition. They do the same wicked thing over and over. To unmake them, you must repeat *better* than they do.",
    "Pop <b>4 Blight Sprites</b> and I will teach you the noble art of the <b>for loop</b>. Once. Per sprite. Repeatedly."
  ],
  acceptLabel: "I will learn to count.",
  midDialogue: "Still sprites in the glades. One. Two. I can hear them not-being-dead.",
  returnDialogue: [
    "Four sprites unmade! FOUR. A wonderful number. Almost as good as five.",
    "Now the true test: the ward stones around my hut have gone dark. Light them all — without writing the same line a hundred times like a barbarian."
  ],
  doneDialogue: "The wards burn in perfect sequence! You count like a hermit twice your age. That is a compliment.",
  lesson: {
    title: "The Hermit's Repetition — for loops",
    body: [
      "Why write a spell five times when you can loop it? A C++ **for loop** has three parts: start, condition, step:",
      ">>>for (int i = 0; i < 3; i++) {\n    cout << \"Begone!\\n\";\n}\n// prints Begone! three times",
      "Read it: *start* at `int i = 0`, *keep going while* `i < 3`, *each pass* do `i++` (add one). The loop variable `i` holds the current count — starting at **0**:",
      ">>>for (int i = 0; i < 3; i++) {\n    cout << i << \"\\n\";\n}\n// 0, then 1, then 2",
      "Want to start at 1 and include n? `for (int i = 1; i <= n; i++)`.",
      "Loops love an **accumulator** — a pouch that grows each pass. `total += i;` is short for `total = total + i;`:",
      ">>>int total = 0;\nfor (int i = 0; i < 4; i++) {\n    total += i;\n}\ncout << total;   // 0+1+2+3 = 6",
      "`i++` adds one; `i--` subtracts one; `i += 2` steps by two."
    ],
    fragments: [
      "**Fragment I** — `for (int i = 0; i < n; i++)` repeats the body n times. Three parts — start; condition; step — separated by semicolons.",
      "**Fragment II** — `i < n` starts the count at 0 and stops *before* n. For 1..n inclusive, write `int i = 1; i <= n`.",
      "**Fragment III** — Use the loop variable! `cout << \"Ward \" << i << \" lit\\n\";` speaks a different line each pass.",
      "**Fragment IV** — `total += x;` grows an accumulator: set it to 0 *before* the loop, grow it *inside*, read it *after*."
    ]
  },
  kills: { enemy: "blight_sprite", count: 4 },
  questions: [
    { type: "output", q: "Where does the count begin?", code: "for (int i = 0; i < 3; i++) cout << i << \"\\n\";",
      answer: "0\n1\n2", why: "Starts at 0, stops before 3: 0, 1, 2." },
    { type: "mc", q: "What numbers does for (int i = 2; i <= 5; i++) produce?",
      choices: ["2, 3, 4, 5", "2, 3, 4", "3, 4, 5", "2 and 5"],
      answer: 0, why: "Start at 2, continue while i <= 5: 2, 3, 4, 5." },
    { type: "output", q: "The accumulator grows:", code: "int total = 0;\nfor (int i = 0; i < 4; i++) total += i;\ncout << total;",
      answer: "6", why: "0 + 1 + 2 + 3 = 6." },
    { type: "fill", q: "Fill the blank to loop while i is below 5:", code: "for (int i = 0; i ____ 5; i++) {\n}",
      answer: "<", accept: ["<"], why: "i < 5 runs for i = 0,1,2,3,4 — five passes." },
    { type: "mc", q: "How many times does for (int i = 0; i < 10; i++) run?",
      choices: ["10", "9", "11", "forever"],
      answer: 0, why: "i goes 0 through 9 — ten passes." },
    { type: "output", q: "Counting from one:", code: "for (int i = 1; i <= 3; i++) cout << \"Hit \" << i << \"\\n\";",
      answer: "Hit 1\nHit 2\nHit 3", why: "i <= 3 includes 3; each pass prints Hit and the number." },
    { type: "mc", q: "What does i++ do as the loop's step?",
      choices: ["Adds 1 to i after each pass", "Compares i to 1", "Prints i", "Resets i to 0"],
      answer: 0, why: "i++ increments i by one each pass, marching the count forward." }
  ],
  challenge: {
    title: "Light the Ward Stones",
    story: "Aldous gestures at the dark stones ringing his hut. \"There are n of them. Light each by number — starting from ONE, mind you, stones are not programmers — then declare the ring complete.\"",
    prompt: [
      "The input is one integer, `n` (the number of ward stones).",
      "Print one line per stone, numbered 1 to n, then a final line:",
      ">>>Ward 1 lit\nWard 2 lit\nWard 3 lit\nAll wards burn",
      "(Example for n = 3.) The numbering starts at **1** and includes **n**."
    ],
    mode: "program",
    starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Print: Ward 1 lit ... Ward n lit, then: All wards burn\n\n    return 0;\n}\n",
    tests: [
      { stdin: "3", expectOut: "Ward 1 lit\nWard 2 lit\nWard 3 lit\nAll wards burn", label: "three stones" },
      { stdin: "1", expectOut: "Ward 1 lit\nAll wards burn", label: "a single stone" },
      { stdin: "5", expectOut: "Ward 1 lit\nWard 2 lit\nWard 3 lit\nWard 4 lit\nWard 5 lit\nAll wards burn", label: "five stones" }
    ],
    hints: [
      "Loop 1..n: for (int i = 1; i <= n; i++) — the <= includes n.",
      "Inside: cout << \"Ward \" << i << \" lit\\n\"; After the loop: cout << \"All wards burn\\n\";",
      "Full answer:\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cout << \"Ward \" << i << \" lit\\n\";\n    cout << \"All wards burn\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 150, coins: 45, items: [["scroll_of_insight", 2]] }
},

/* ---------------- cpp07 : The Unbroken Vigil ---------------- */
{
  id: "cpp07", faction: "cpp", act: 2, title: "The Unbroken Vigil", npc: "yara", map: "forest",
  intro: [
    "The husks are back. Dead woodsmen who don't know they're done — they just keep walking the same patrol, night after night, until something drains them dry.",
    "That something is going to be you. Put down <b>5 Restless Husks</b> east of the marsh.",
    "And learn this: a for loop counts a *known* number of steps. But a vigil holds *until a condition breaks*. C++ calls it <b>while</b>."
  ],
  acceptLabel: "I'll hold the vigil.",
  midDialogue: "I can still hear them shuffling out there. The vigil isn't over.",
  returnDialogue: [
    "The shuffling has stopped. Well done.",
    "One trial left: the curse that animates a husk drains a little each night. Predict the night it finally breaks — and the vigil law is yours."
  ],
  doneDialogue: "You can outlast anything now. That's most of survival, honestly — being the one still standing when the condition breaks.",
  lesson: {
    title: "The Vigil — while loops",
    body: [
      "A **while loop** repeats *as long as* its question stays true:",
      ">>>int n = 3;\nwhile (n > 0) {\n    cout << n << \"\\n\";\n    n--;\n}\n// 3, 2, 1 - then n is 0, the question is false, the loop ends",
      "The sacred rule: something inside must **change**, or the question never turns false — an **infinite loop** (the forge will time you out).",
      "`n--` shrinks like `n++` grows. Counters track how many passes you took:",
      ">>>int nights = 0;\nint hp = 10;\nwhile (hp > 0) {\n    hp -= 3;\n    nights++;\n}\ncout << nights;   // 4",
      "(10 -> 7 -> 4 -> 1 -> -2: four drains.)",
      "`break;` storms out of a loop immediately, mid-pass:",
      ">>>while (true) {\n    if (done) break;\n}",
      "Choose your loop: **for** when you know how many steps, **while** when you only know the stopping condition."
    ],
    fragments: [
      "**Fragment I** — `while (question) { ... }` repeats while the question is true. It checks BEFORE every pass.",
      "**Fragment II** — Change something inside, or loop forever. `hp -= drain;` moves the world toward the loop's end.",
      "**Fragment III** — Counters: `int nights = 0;` before, `nights++;` inside, read it after. The counter remembers how many passes happened.",
      "**Fragment IV** — `break;` exits a loop instantly. for = known steps; while = unknown steps, known stopping condition."
    ]
  },
  kills: { enemy: "restless_husk", count: 5 },
  questions: [
    { type: "output", q: "The countdown:", code: "int n = 3;\nwhile (n > 0) {\n    cout << n << \"\\n\";\n    n--;\n}",
      answer: "3\n2\n1", why: "Prints then shrinks: 3, 2, 1. When n hits 0 the condition fails." },
    { type: "mc", q: "What causes an infinite loop?",
      choices: ["The condition never becomes false", "Using too many variables", "A missing cout", "Looping more than 100 times"],
      answer: 0, why: "If nothing inside changes the condition, while never stops (the forge will time you out)." },
    { type: "output", q: "Count the passes:", code: "int count = 0;\nwhile (count < 3) count++;\ncout << count;",
      answer: "3", why: "count grows 1, 2, 3; at 3 the condition (< 3) fails and the loop ends." },
    { type: "mc", q: "What does break; do?",
      choices: ["Exits the loop immediately", "Pauses for one second", "Restarts the loop", "Deletes a variable"],
      answer: 0, why: "break jumps out of the loop at once, skipping the rest of the passes." },
    { type: "fill", q: "Loop while the husk still stands (hp above zero):", code: "while (hp ____ 0) {\n    hp--;\n}",
      answer: ">", accept: [">"], why: "while (hp > 0) keeps looping while hp is positive." },
    { type: "output", q: "Doubling till dawn:", code: "int x = 1;\nwhile (x < 10) x = x * 2;\ncout << x;",
      answer: "16", why: "1->2->4->8->16. At 16, x < 10 is false. The last doubling happened before the check." },
    { type: "mc", q: "You don't know how many tries something needs. Which loop?",
      choices: ["while — repeat until the condition breaks", "for — always", "Neither", "They are identical"],
      answer: 0, why: "while shines when only the stopping condition is known, not the count." }
  ],
  challenge: {
    title: "When the Curse Breaks",
    story: "Yara kneels by a fallen husk. \"Its curse holds `hp` power and loses `drain` every night. Tell me the number of the night it finally breaks. Count carefully.\"",
    prompt: [
      "Two integers are given: `hp` and `drain` (both positive). The starter reads them.",
      "Each night, the curse loses `drain` power. Print one number: **how many nights** until hp drops to 0 or below.",
      ">>>input: 10 3  ->  4\n(10 -> 7 -> 4 -> 1 -> -2: the 4th night breaks it)",
      "Use a while loop and a counter."
    ],
    mode: "program",
    starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int hp, drain;\n    cin >> hp >> drain;\n    int nights = 0;\n    // count the nights until hp <= 0, then print nights\n\n    return 0;\n}\n",
    tests: [
      { stdin: "10 3", expectOut: "4", label: "hp 10, drain 3" },
      { stdin: "12 4", expectOut: "3", label: "hp 12, drain 4" },
      { stdin: "1 1", expectOut: "1", label: "a weak curse" },
      { stdin: "20 6", expectOut: "4", label: "hp 20, drain 6" }
    ],
    hints: [
      "Loop while hp > 0; inside, drain AND count: hp -= drain; nights++;",
      "Print nights AFTER the loop ends.",
      "Full answer:\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int hp, drain;\n    cin >> hp >> drain;\n    int nights = 0;\n    while (hp > 0) {\n        hp -= drain;\n        nights++;\n    }\n    cout << nights << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 170, coins: 50, items: [["wickfire_torchblade", 1]] }
},

/* ---------------- cpp08 : BOSS — Warden of the Embers ---------------- */
{
  id: "cpp08", faction: "cpp", act: 2, title: "Warden of the Embers", npc: "aldous", map: "forest", boss: true,
  bossEnemy: "boss_warden", bossSpot: { map: "forest", x: 38, y: 7 },
  intro: [
    "The counting has gone WRONG, marked one. In the north clearing the Warden has risen — the old kingdom's forester, grown of bark and grudge.",
    "It guarded the road to the Sunken Ruins, once. It counted every traveler: every third it marked with Ember, every fifth with Ash. The numbers were law.",
    "It will test your forks AND your loops together. Face the <b>Warden of the Embers</b> in the north clearing — between the two braziers."
  ],
  acceptLabel: "I will face the Warden.",
  midDialogue: "The Warden waits in the north clearing, counting to itself. It has saved a number for you.",
  returnDialogue: ["The Warden stands in the north clearing. Counting. Always counting."],
  doneDialogue: "You out-counted the forest itself! The road east lies open. The Ruins are damp, dark, and full of excellently organized treasure.",
  lesson: {
    title: "Trial of the Warden (Recap)",
    body: [
      "The Warden tests everything from Emberwood:",
      ">>>if (x > 10) { ... }                    // forks\nfor (int i = 1; i <= n; i++) { ... }    // counted repetition\nwhile (hp > 0) { ... }                  // condition-bound repetition",
      "Its ancient rite marks numbers: multiples of 3 are **Ember**, of 5 are **Ash**, of both **EmberAsh**. The `%` remainder is the key: `i % 3 == 0` means 'i divides cleanly by 3'.",
      "Check the *both* case first — a number divisible by 3 and 5 must not be caught by the 3-only fork."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The Warden creaks: 'Read my remainder.'", code: "cout << 15 % 5;",
      answer: "0", why: "15 divides evenly by 5 — remainder 0. That is how you test divisibility." },
    { type: "mc", q: "'Which question asks: is n divisible by 3?'",
      choices: ["n % 3 == 0", "n / 3 == 0", "n == 3", "3 % n == 0"],
      answer: 0, why: "Divisible means the remainder is zero: n % 3 == 0." },
    { type: "output", q: "'Walk my forks.'", code: "for (int i = 1; i <= 3; i++) {\n    if (i == 2) cout << \"mark\\n\";\n    else cout << i << \"\\n\";\n}",
      answer: "1\nmark\n3", why: "i runs 1,2,3. Only i==2 takes the mark fork." },
    { type: "output", q: "'How long do you last?'", code: "int x = 2;\nwhile (x < 20) x = x * 3;\ncout << x;",
      answer: "54", why: "2->6->18->54. 18 is still < 20, so one more triple to 54." }
  ],
  challenge: {
    title: "The Warden's Count",
    story: "The Warden's bark splits into a hundred tallying notches. \"COUNT,\" it thunders. \"Count as the law demands — and the road is yours.\"",
    prompt: [
      "The input is one integer, `n`.",
      "Count from 1 to n, printing one line per number:",
      "— divisible by **both 3 and 5** -> `EmberAsh`",
      "— else divisible by **3** -> `Ember`",
      "— else divisible by **5** -> `Ash`",
      "— otherwise the number itself.",
      ">>>1\n2\nEmber\n4\nAsh\n(example for n = 5)"
    ],
    mode: "program",
    starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // both 3 and 5 -> EmberAsh | 3 -> Ember | 5 -> Ash | else the number\n    for (int i = 1; i <= n; i++) {\n\n    }\n    return 0;\n}\n",
    tests: [
      { stdin: "5", expectOut: "1\n2\nEmber\n4\nAsh", label: "n = 5" },
      { stdin: "15", expectOut: "1\n2\nEmber\n4\nAsh\nEmber\n7\n8\nEmber\nAsh\n11\nEmber\n13\n14\nEmberAsh", label: "n = 15 (the full law)" },
      { stdin: "3", expectOut: "1\n2\nEmber", label: "n = 3" }
    ],
    hints: [
      "Test the BOTH case first: if (i % 3 == 0 && i % 5 == 0) — otherwise 15 would be caught by the 3-fork.",
      "The chain is: if (both) / else if (% 3) / else if (% 5) / else print i.",
      "Full answer:\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) {\n        if (i % 3 == 0 && i % 5 == 0) cout << \"EmberAsh\\n\";\n        else if (i % 3 == 0) cout << \"Ember\\n\";\n        else if (i % 5 == 0) cout << \"Ash\\n\";\n        else cout << i << \"\\n\";\n    }\n    return 0;\n}"
    ]
  },
  rewards: { xp: 350, coins: 100, items: [["emberforged_falchion", 1], ["ember_charm", 1]], title: "Embercounter", unlocks: "The Sunken Ruins" }
}
);
