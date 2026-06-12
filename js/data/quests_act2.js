/* ============================================================
   ACT II — EMBERWOOD FOREST: Paths in the Dark
   Control flow: booleans, if/elif/else, for, range, while
   ============================================================ */
window.QUEST_DB.push(

/* ---------------- py05 : Paths in the Dark ---------------- */
{
  id: "py05", act: 2, title: "Paths in the Dark", npc: "yara", map: "forest",
  intro: [
    "Hold. You're the one Maren marked? Good. The forest needs marked hands.",
    "Hollow Wolves prowl the south woods — beasts with nothing inside but a question. Literally. Cut one open and choices spill out.",
    "Hunt <b>4 Hollow Wolves</b>. While you hunt, learn the ranger's first law: <i>at every fork, decide</i>. The old tongue calls it <b>if / elif / else</b>."
  ],
  acceptLabel: "I'll take the south path.",
  midDialogue: "Still hearing howls from the south woods. A ranger finishes the hunt.",
  returnDialogue: [
    "Clean kills. The woods are quieter — listen.",
    "Last part of the law: prove you can read the howls themselves. Pass this trial and no fork in any road will ever stop you again."
  ],
  doneDialogue: "You decide like a ranger now. Quick, clean, no second-guessing. The deep forest is yours to walk.",
  lesson: {
    title: "The Ranger's Law — if / elif / else",
    body: [
      "First, **comparisons** — questions with True/False answers:",
      ">>>7 > 3      # True   greater than\n7 < 3      # False  less than\nhp == 0    # is hp EQUAL to 0?  (two equals signs!)\nhp != 0    # is hp NOT equal to 0?\nhp >= 10   # greater than or equal",
      "`True` and `False` are called **booleans**. They are the forest's yes and no.",
      "An `if` takes a path only when its question is True. The path itself is **indented** (4 spaces):",
      ">>>hp = 3\nif hp < 5:\n    print(\"Drink a salve!\")   # indented = inside the if",
      "`else` is the other fork. `elif` adds more forks between them — Python takes the FIRST true path and skips the rest:",
      ">>>howls = 7\nif howls >= 10:\n    print(\"The pack hunts\")\nelif howls >= 5:\n    print(\"Wolves stir\")\nelse:\n    print(\"The woods sleep\")",
      "You can join questions: `and` needs both true, `or` needs either, `not` flips."
    ],
    fragments: [
      "**Fragment I** — Comparisons answer True or False: `>` `<` `>=` `<=`. And `==` asks \"equal?\" — never confuse it with `=`, which *stores*.",
      "**Fragment II** — `if question:` then an **indented** body. The indented lines run only when the question is True. Forget the colon or the indent and the spell fizzles.",
      "**Fragment III** — `else:` catches everything the if rejected. Exactly one of the two paths runs. Never both.",
      "**Fragment IV** — `elif` chains forks: Python checks top to bottom and takes the FIRST true branch only. Order your forks from strictest to loosest."
    ]
  },
  kills: { enemy: "hollow_wolf", count: 4 },
  questions: [
    { type: "mc", q: "What does 7 > 3 evaluate to?",
      choices: ["True", "False", "7", "yes"],
      answer: 0, why: "Comparisons produce booleans: True or False. 7 is greater than 3, so True." },
    { type: "output", q: "Which path does the ranger take?", code: "x = 5\nif x > 2:\n    print(\"big\")\nelse:\n    print(\"small\")",
      answer: "big", why: "5 > 2 is True, so the if-branch runs." },
    { type: "mc", q: "Which symbol asks 'are these equal?'",
      choices: ["==", "=", "!=", "=>"],
      answer: 0, why: "== compares. A single = stores a value. != means NOT equal." },
    { type: "output", q: "Three forks, one path:", code: "n = 0\nif n > 0:\n    print(\"alive\")\nelif n < 0:\n    print(\"curse\")\nelse:\n    print(\"zero\")",
      answer: "zero", why: "n is 0: not > 0, not < 0, so the else path runs." },
    { type: "fill", q: "Fill the blank so the warning prints when hp is 0 OR BELOW:", code: "if hp ____ 0:\n    print(\"You have fallen\")",
      answer: "<=", accept: ["<="], why: "<= means less than or equal — catches 0 and below." },
    { type: "mc", q: "Why does Python care about indentation?",
      choices: ["Indented lines belong to the if/loop above them", "It looks nicer", "It runs faster", "It doesn't care"],
      answer: 0, why: "Indentation IS the structure: it marks which lines are inside the branch." },
    { type: "output", q: "Not equal?", code: "a = 3\nb = 3\nprint(a != b)",
      answer: "False", why: "a and b are both 3, so 'not equal' is False." },
    { type: "mc", q: "What is True and False?",
      choices: ["False", "True", "Error", "Maybe"],
      answer: 0, why: "`and` needs BOTH sides true. One is False, so the whole thing is False." },
    { type: "tf", q: "True or False — `=` and `==` do the same thing.",
      answer: false, why: "= STORES a value in a name; == ASKS whether two values are equal. Mixing them up is the oldest blunder in the old tongue." }
  ],
  challenge: {
    title: "Reading the Howls",
    story: "Yara closes her eyes. \"Count the howls. Ten or more — the pack hunts tonight. Five to nine — they stir. Fewer — the woods sleep. Teach the Flame to read them.\"",
    prompt: [
      "You are **given** `howls` (an int).",
      "Print exactly one line:",
      ">>>The pack hunts     (when howls is 10 or more)\nWolves stir        (when howls is 5 to 9)\nThe woods sleep    (when howls is under 5)",
      "Use `if`, `elif`, and `else`."
    ],
    mode: "program",
    given: "howls",
    starter: "# howls is given. Read the howls and print the right line.\n\n",
    tests: [
      { setup: "howls = 12", expectOut: "The pack hunts", label: "howls = 12" },
      { setup: "howls = 10", expectOut: "The pack hunts", label: "howls = 10 (the edge!)" },
      { setup: "howls = 9", expectOut: "Wolves stir", label: "howls = 9 (just under the edge)" },
      { setup: "howls = 7", expectOut: "Wolves stir", label: "howls = 7" },
      { setup: "howls = 5", expectOut: "Wolves stir", label: "howls = 5 (the other edge)" },
      { setup: "howls = 2", expectOut: "The woods sleep", label: "howls = 2" }
    ],
    hints: [
      "The thresholds: 10+ hunts, 5-9 stirs, under 5 sleeps. Check the biggest threshold first: if howls >= 10:",
      "elif howls >= 5: catches 5-9, because 10+ was already taken by the first branch. else: catches the rest.",
      "Full answer:\nif howls >= 10:\n    print(\"The pack hunts\")\nelif howls >= 5:\n    print(\"Wolves stir\")\nelse:\n    print(\"The woods sleep\")"
    ],
    explain: "The chain checks top to bottom and takes the FIRST true branch: `howls >= 10` claims 10 and up, so by the time `elif howls >= 5` is asked, only 5-9 can still be true — and `else` catches everything under 5. Order the forks from strictest to loosest and the ranges sort themselves."
  },
  rewards: { xp: 130, coins: 40, items: [["hardened_leather", 1]] }
},

/* ---------------- py06 : The Counting Curse ---------------- */
{
  id: "py06", act: 2, title: "The Counting Curse", npc: "aldous", map: "forest",
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
    title: "The Hermit's Repetition — for & range",
    body: [
      "Why write a spell five times when you can cast it in a loop? A **for loop** repeats its indented body:",
      ">>>for i in range(3):\n    print(\"Begone!\")\n# prints Begone! three times",
      "`range(n)` counts from **0** up to (but not including) n. The loop variable `i` holds the current count:",
      ">>>for i in range(3):\n    print(i)\n# 0, then 1, then 2  - it starts at ZERO",
      "Want to start somewhere else? `range(start, stop)` — still stops *before* stop:",
      ">>>for i in range(1, 4):\n    print(i)\n# 1, 2, 3",
      "Loops love an **accumulator** — a pouch that grows each pass. `total += i` is the short form of `total = total + i`:",
      ">>>total = 0\nfor i in range(4):\n    total += i\nprint(total)   # 0+1+2+3 = 6",
      "Note: the final `print(total)` is NOT indented — it runs once, after the loop finishes."
    ],
    fragments: [
      "**Fragment I** — `for i in range(n):` repeats the indented body n times. The colon and the indent are sacred.",
      "**Fragment II** — `range(n)` starts at **0** and stops *before* n. `range(4)` gives 0, 1, 2, 3. `range(2, 6)` gives 2, 3, 4, 5.",
      "**Fragment III** — The loop variable changes every pass. Use it! `print(f\"Ward {i} lit\")` speaks a different line each time.",
      "**Fragment IV** — `total += x` grows an accumulator. Set it to 0 *before* the loop, grow it *inside* the loop, read it *after* the loop."
    ]
  },
  kills: { enemy: "blight_sprite", count: 4 },
  questions: [
    { type: "output", q: "Where does the count begin?", code: "for i in range(3):\n    print(i)",
      answer: "0\n1\n2", why: "range(3) yields 0, 1, 2 — it starts at zero and stops before 3." },
    { type: "mc", q: "What numbers does range(2, 6) produce?",
      choices: ["2, 3, 4, 5", "2, 3, 4, 5, 6", "3, 4, 5, 6", "2 and 6"],
      answer: 0, why: "Start at 2, stop BEFORE 6." },
    { type: "output", q: "The accumulator grows:", code: "total = 0\nfor i in range(4):\n    total += i\nprint(total)",
      answer: "6", why: "0 + 0 + 1 + 2 + 3 = 6." },
    { type: "fill", q: "Fill the blank to loop five times:", code: "for i in ____(5):\n    print(\"strike\")",
      answer: "range", why: "range(5) produces 0,1,2,3,4 — five passes." },
    { type: "mc", q: "How many times does the body of `for i in range(10):` run?",
      choices: ["10", "9", "11", "Forever"],
      answer: 0, why: "range(10) yields ten values: 0 through 9." },
    { type: "output", q: "print with two things prints them with a space:", code: "for i in range(1, 4):\n    print(\"Hit\", i)",
      answer: "Hit 1\nHit 2\nHit 3", why: "range(1,4) gives 1,2,3; print(\"Hit\", i) puts a space between them." },
    { type: "mc", q: "What does total += 5 do?",
      choices: ["Adds 5 to total and stores it back", "Compares total to 5", "Prints 5", "Creates a loop"],
      answer: 0, why: "+= is shorthand: total = total + 5." },
    { type: "tf", q: "True or False — `range(5)` includes the number 5.",
      answer: false, why: "range stops BEFORE its limit: range(5) gives 0, 1, 2, 3, 4." }
  ],
  challenge: {
    title: "Light the Ward Stones",
    story: "Aldous gestures at the dark stones ringing his hut. \"There are n of them. Light each by number — starting from ONE, mind you, stones are not programmers — then declare the ring complete.\"",
    prompt: [
      "You are **given** `n` (an int): the number of ward stones.",
      "Print one line per stone, numbered 1 to n, then a final line:",
      ">>>Ward 1 lit\nWard 2 lit\nWard 3 lit\nAll wards burn",
      "(Example for n = 3.) Use a for loop with `range` — the numbering starts at **1** and includes **n**."
    ],
    mode: "program",
    given: "n",
    starter: "# n is given: the number of ward stones.\n# Print: Ward 1 lit ... Ward n lit, then: All wards burn\n\n",
    tests: [
      { setup: "n = 3", expectOut: "Ward 1 lit\nWard 2 lit\nWard 3 lit\nAll wards burn", label: "three stones" },
      { setup: "n = 1", expectOut: "Ward 1 lit\nAll wards burn", label: "a single stone" },
      { setup: "n = 5", expectOut: "Ward 1 lit\nWard 2 lit\nWard 3 lit\nWard 4 lit\nWard 5 lit\nAll wards burn", label: "five stones" }
    ],
    hints: [
      "A for loop with range does the counting: range(1, n + 1) counts 1, 2, ..., n — the +1 matters because range stops early.",
      "Inside the loop: print(f\"Ward {i} lit\"). After the loop (NOT indented): the final line.",
      "Full answer:\nfor i in range(1, n + 1):\n    print(f\"Ward {i} lit\")\nprint(\"All wards burn\")"
    ],
    explain: "`range(1, n + 1)` starts at 1 and stops just before n + 1 — exactly the stones 1 through n. The f-string speaks a different ward number each pass, and the final print sits UNindented, so it runs once, after the loop closes."
  },
  rewards: { xp: 150, coins: 45, items: [["scroll_of_insight", 2]] }
},

/* ---------------- py07 : The Unbroken Vigil ---------------- */
{
  id: "py07", act: 2, title: "The Unbroken Vigil", npc: "yara", map: "forest",
  intro: [
    "The husks are back. Dead woodsmen who don't know they're done — they just keep walking the same patrol, night after night, until something drains them dry.",
    "That something is going to be you. Put down <b>5 Restless Husks</b> east of the marsh.",
    "And learn this: a for loop counts a *known* number of steps. But a vigil — a vigil holds *until a condition breaks*. The old tongue calls it <b>while</b>."
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
      "A **while loop** repeats *as long as* its question stays True:",
      ">>>n = 3\nwhile n > 0:\n    print(n)\n    n -= 1\n# 3, 2, 1 - then n is 0, the question is False, the loop ends",
      "The sacred rule: something inside the loop must **change**, or the question never turns False — an **infinite loop**, the husk's own curse.",
      "`-=` shrinks like `+=` grows. Counters track how many passes you took:",
      ">>>nights = 0\nhp = 10\nwhile hp > 0:\n    hp -= 3\n    nights += 1\nprint(nights)   # how many passes until hp ran out? 4",
      "(10 → 7 → 4 → 1 → -2: four drains.)",
      "`break` storms out of a loop immediately, mid-pass:",
      ">>>while True:\n    word = \"halt\"\n    if word == \"halt\":\n        break",
      "Choose your loop like a ranger: **for** when you know how many steps, **while** when you only know the stopping condition."
    ],
    fragments: [
      "**Fragment I** — `while question:` repeats while the question is True. It checks BEFORE every pass.",
      "**Fragment II** — Change something inside, or loop forever. `hp -= drain` moves the world toward the end of the loop.",
      "**Fragment III** — Counters: start `nights = 0` before; `nights += 1` inside; read it after. The counter remembers how many passes happened.",
      "**Fragment IV** — `break` exits a loop instantly. Useful with `while True:` for 'loop until I say stop'.",
      "**Fragment V** — for = known steps. while = unknown steps, known stopping condition. The husk walks while; you count for."
    ]
  },
  kills: { enemy: "restless_husk", count: 5 },
  questions: [
    { type: "output", q: "The countdown:", code: "n = 3\nwhile n > 0:\n    print(n)\n    n -= 1",
      answer: "3\n2\n1", why: "Prints then shrinks: 3, 2, 1. When n hits 0 the condition fails." },
    { type: "mc", q: "What causes an infinite loop?",
      choices: ["The condition never becomes False", "Using too many variables", "A missing print", "Looping more than 100 times"],
      answer: 0, why: "If nothing changes the condition, while never stops. (The Flame will time you out!)" },
    { type: "output", q: "Count the passes:", code: "count = 0\nwhile count < 3:\n    count += 1\nprint(count)",
      answer: "3", why: "count grows 1, 2, 3; at 3 the condition (< 3) fails and the loop ends." },
    { type: "mc", q: "What does break do?",
      choices: ["Exits the loop immediately", "Pauses for one second", "Restarts the loop", "Deletes a variable"],
      answer: 0, why: "break jumps out of the loop at once, skipping the rest of the passes." },
    { type: "fill", q: "Loop while the husk still stands (hp above zero):", code: "while hp ____ 0:\n    hp -= 1",
      answer: ">", accept: [">"], why: "while hp > 0 keeps looping while hp is positive." },
    { type: "output", q: "Doubling till dawn:", code: "x = 1\nwhile x < 10:\n    x = x * 2\nprint(x)",
      answer: "16", why: "1→2→4→8→16. At 16, x < 10 is False. The last doubling happened before the check." },
    { type: "mc", q: "You don't know how many tries something needs. Which loop?",
      choices: ["while — repeat until the condition breaks", "for — always", "Neither", "Both are identical"],
      answer: 0, why: "while shines when only the stopping condition is known, not the count." },
    { type: "tf", q: "True or False — a while loop checks its condition BEFORE every pass.",
      answer: true, why: "If the condition is already False at the start, the body never runs at all." }
  ],
  challenge: {
    title: "When the Curse Breaks",
    story: "Yara kneels by a fallen husk. \"Its curse holds `hp` power and loses `drain` every night. Tell me the number of the night it finally breaks. Count carefully.\"",
    prompt: [
      "You are **given** `hp` and `drain` (ints, both positive).",
      "Each night, the curse loses `drain` power. Print one number: **how many nights** until hp drops to 0 or below.",
      ">>>hp = 10, drain = 3  ->  4\n(10 -> 7 -> 4 -> 1 -> -2: the 4th night breaks it)",
      "Use a while loop and a counter."
    ],
    mode: "program",
    given: "hp, drain",
    starter: "# hp and drain are given.\n# Count the nights until hp <= 0, then print the count.\n\n",
    tests: [
      { setup: "hp = 10\ndrain = 3", expectOut: "4", label: "hp 10, drain 3" },
      { setup: "hp = 12\ndrain = 4", expectOut: "3", label: "hp 12, drain 4" },
      { setup: "hp = 1\ndrain = 1", expectOut: "1", label: "a weak curse" },
      { setup: "hp = 20\ndrain = 6", expectOut: "4", label: "hp 20, drain 6" }
    ],
    hints: [
      "Start a counter at 0, then loop: while hp > 0. Inside, drain the hp AND count the night: hp -= drain, nights += 1",
      "Print nights AFTER the loop ends (unindented).",
      "Full answer:\nnights = 0\nwhile hp > 0:\n    hp -= drain\n    nights += 1\nprint(nights)"
    ],
    explain: "Every pass drains the curse and tallies one night; the moment hp sinks to 0 or below, the `while hp > 0` question turns False and the loop releases. The counter — started before, grown inside, read after — is the vigil's whole answer."
  },
  rewards: { xp: 170, coins: 50, items: [["wickfire_torchblade", 1]] }
},

/* ---------------- py08 : BOSS — Warden of the Embers ---------------- */
{
  id: "py08", act: 2, title: "Warden of the Embers", npc: "aldous", map: "forest", boss: true,
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
      ">>>if x > 10:        # forks: if / elif / else\n    ...\nfor i in range(1, n+1):   # counted repetition\n    ...\nwhile hp > 0:     # condition-bound repetition\n    ...",
      "Its ancient rite marks numbers: multiples of 3 are **Ember**, multiples of 5 are **Ash**, multiples of both are **EmberAsh**. The `%` remainder is the key: `i % 3 == 0` means 'i divides cleanly by 3'.",
      "Check the *both* case first — a number divisible by 3 and 5 must not be caught by the 3-only fork."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The Warden creaks: 'Read my remainder.'", code: "print(15 % 5)",
      answer: "0", why: "15 divides evenly by 5 — remainder 0. That's how you test divisibility." },
    { type: "mc", q: "'Which question asks: is n divisible by 3?'",
      choices: ["n % 3 == 0", "n // 3 == 0", "n == 3", "3 % n == 0"],
      answer: 0, why: "Divisible means the remainder is zero: n % 3 == 0." },
    { type: "output", q: "'Walk my forks.'", code: "for i in range(1, 4):\n    if i == 2:\n        print(\"mark\")\n    else:\n        print(i)",
      answer: "1\nmark\n3", why: "i runs 1,2,3. Only i==2 takes the mark fork." },
    { type: "output", q: "'How long do you last?'", code: "x = 2\nwhile x < 20:\n    x = x * 3\nprint(x)",
      answer: "54", why: "2→6→18→54. 18 is still < 20, so one more triple to 54." }
  ],
  challenge: {
    title: "The Warden's Count",
    story: "The Warden's bark splits into a hundred tallying notches. \"COUNT,\" it thunders. \"Count as the law demands — and the road is yours.\"",
    prompt: [
      "You are **given** `n` (an int).",
      "Count from 1 to n, printing one line per number:",
      "— if the number is divisible by **both 3 and 5**, print `EmberAsh`",
      "— else if divisible by **3**, print `Ember`",
      "— else if divisible by **5**, print `Ash`",
      "— otherwise print the number itself.",
      ">>>1\n2\nEmber\n4\nAsh\n(example for n = 5)"
    ],
    mode: "program",
    given: "n",
    starter: "# n is given. Count 1..n by the Warden's law:\n# both 3 and 5 -> EmberAsh | 3 -> Ember | 5 -> Ash | else the number\n\nfor i in range(1, n + 1):\n    \n",
    tests: [
      { setup: "n = 5", expectOut: "1\n2\nEmber\n4\nAsh", label: "n = 5" },
      { setup: "n = 15", expectOut: "1\n2\nEmber\n4\nAsh\nEmber\n7\n8\nEmber\nAsh\n11\nEmber\n13\n14\nEmberAsh", label: "n = 15 (the full law)" },
      { setup: "n = 3", expectOut: "1\n2\nEmber", label: "n = 3" }
    ],
    hints: [
      "Test the BOTH case first: if i % 3 == 0 and i % 5 == 0: — otherwise 15 would be caught by the 3-fork.",
      "The chain is: if (both) / elif (% 3) / elif (% 5) / else print(i).",
      "Full answer:\nfor i in range(1, n + 1):\n    if i % 3 == 0 and i % 5 == 0:\n        print(\"EmberAsh\")\n    elif i % 3 == 0:\n        print(\"Ember\")\n    elif i % 5 == 0:\n        print(\"Ash\")\n    else:\n        print(i)"
    ],
    explain: "Order saves the law: 15 divides by BOTH 3 and 5, so the both-case must be checked first or the 3-fork would steal it. `i % 3 == 0` is the divisibility test — remainder zero means a clean split — and the elif chain takes only the first true branch each pass."
  },
  rewards: { xp: 350, coins: 100, items: [["emberforged_falchion", 1], ["ember_charm", 1]], title: "Embercounter", unlocks: "The Sunken Ruins" }
}
);
