/* ============================================================
   ACT I — ASHVEIL VILLAGE: The Mark of the Flame
   Python basics: print, strings, variables, numbers, f-strings
   ============================================================
   Lesson body format: array of strings; a string starting with
   ">>>" renders as a code block. `x` renders as inline code.
   ============================================================ */
window.QUEST_DB = window.QUEST_DB || [];

window.QUEST_DB.push(

/* ---------------- py01 : Sparks in the Ash ---------------- */
{
  id: "py01", act: 1, title: "Sparks in the Ash", npc: "elder_maren", map: "village",
  intro: [
    "So. The Flame marked you too. I saw the brand on your hand the moment you crossed the bridge.",
    "A thousand years ago, the First Kingdom spoke to the world in a language of power — and the world *listened*. We call its modern echo <b>Python</b>.",
    "The cinder rats gnawing at our beacon feed on silence. Every word of power you speak weakens them. Slay <b>3 Cinder Rats</b> south of the river, and the Flame will teach you to speak as you fight."
  ],
  acceptLabel: "I will learn to speak.",
  midDialogue: "The rats still gnaw at the beacon, marked one. Speak the words. The Flame listens.",
  returnDialogue: [
    "The rats fall silent and the beacon hungers for true words.",
    "Now — your first trial. Speak the Words of Kindling <i>exactly</i> as the old rite demands. The Flame is precise: one wrong letter and it will not light."
  ],
  doneDialogue: "The beacon burns again. You are no longer ordinary, survivor. You are a speaker of the old tongue.",
  lesson: {
    title: "Speaking the Old Tongue — print() and Strings",
    body: [
      "Python is the language the Eternal Flame understands. To make it speak a word aloud, use `print()`:",
      ">>>print(\"Hello, Ashveil\")",
      "Whatever you put between the parentheses is spoken. Text — what coders call a **string** — must be wrapped in quotes: `\"like this\"` or `'like this'`. Without quotes, Python thinks you are naming a thing, not saying words.",
      ">>>print(\"Embers\")     # speaks: Embers\nprint('Ash')        # speaks: Ash\nprint(Ash)          # ERROR! no quotes — Python looks for a thing called Ash",
      "Each `print()` speaks on its **own line**. Two prints, two lines:",
      ">>>print(\"Spark\")\nprint(\"Flame\")",
      "Lines that begin with `#` are **comments** — notes to yourself. The Flame ignores them entirely."
    ],
    fragments: [
      "**Fragment I** — `print(\"word\")` speaks a word. The parentheses are the mouth; the quotes hold the breath. `print(\"Rise\")` speaks `Rise`.",
      "**Fragment II** — Strings wear quotes like armor. `\"flame\"` and `'flame'` are both fine — just match the pair. `\"flame'` is broken armor and angers the Flame (SyntaxError).",
      "**Fragment III** — Every `print()` ends its line. To speak three words on three lines, cast `print()` three times, one beneath the other."
    ]
  },
  kills: { enemy: "cinder_rat", count: 3 },
  questions: [
    { type: "mc", q: "Which incantation correctly speaks the word Ember?",
      choices: ["print(\"Ember\")", "print(Ember)", "say \"Ember\"", "print[\"Ember\"]"],
      answer: 0, why: "print needs parentheses ( ) and the text needs quotes. print(Ember) without quotes looks for a variable named Ember." },
    { type: "output", q: "What does this code speak aloud?", code: "print(\"Rise\")",
      answer: "Rise", why: "print() outputs exactly what is inside the quotes: Rise." },
    { type: "mc", q: "What is a 'string' in the old tongue?",
      choices: ["Text wrapped in quotes", "A number", "A kind of loop", "A weapon"],
      answer: 0, why: "A string is text data, written between quotes: \"like this\"." },
    { type: "output", q: "Two castings, two lines. What is spoken?", code: "print(\"Ash\")\nprint(\"Veil\")",
      answer: "Ash\nVeil", why: "Each print() speaks on its own line: Ash, then Veil." },
    { type: "fill", q: "Fill the blank to speak the word aloud:", code: "____(\"Endure\")",
      answer: "print", why: "print is the word-of-speaking. print(\"Endure\") speaks Endure." },
    { type: "mc", q: "Which of these is a valid string?",
      choices: ["'flame'", "flame", "\"flame'", "(flame)"],
      answer: 0, why: "'flame' has matching single quotes. Mismatched or missing quotes break the spell." },
    { type: "output", q: "Careful — what does this speak?", code: "print(\"2 + 3\")",
      answer: "2 + 3", why: "Quotes make it a string. Python speaks the characters 2 + 3 — it does not do the math." },
    { type: "tf", q: "True or False — `print(\"Ash\")` and `print('Ash')` speak the same word.",
      answer: true, why: "Double or single quotes both make a string — just match the pair." }
  ],
  challenge: {
    title: "The Words of Kindling",
    story: "Elder Maren leads you to the cold beacon. \"Speak the three Words of Kindling, exactly. The Flame accepts no almost.\"",
    prompt: [
      "Write a program that prints exactly these three lines, in this order:",
      ">>>Spark\nFlame\nASHVEIL ENDURES",
      "Use one `print()` for each line. Spelling and capital letters must match perfectly."
    ],
    mode: "program",
    starter: "# Speak the three Words of Kindling.\n# Line 1: Spark\n# Line 2: Flame\n# Line 3: ASHVEIL ENDURES\n\n",
    tests: [
      { expectOut: "Spark\nFlame\nASHVEIL ENDURES", label: "The rite of kindling" }
    ],
    hints: [
      "Each line needs its own print(), like: print(\"Spark\")",
      "Capitals matter! The third line is all uppercase: print(\"ASHVEIL ENDURES\")",
      "Full answer:\nprint(\"Spark\")\nprint(\"Flame\")\nprint(\"ASHVEIL ENDURES\")"
    ],
    explain: "Each `print()` speaks exactly one line, top to bottom — so three prints make three lines in order. The quotes hold the text exactly as written, and the Flame compared it character for character: spelling, spaces, and capitals all count."
  },
  rewards: { xp: 60, coins: 25, items: [["ashen_salve", 2]] }
},

/* ---------------- py01b : The Beacon's Rhythm ---------------- */
{
  id: "py01b", act: 1, title: "The Beacon's Rhythm", npc: "pip", map: "village",
  intro: [
    "You're the one Elder Maren marked? Good. I'm Pip — I keep the beacon tolling, and lately it tolls <i>crooked</i>.",
    "Ash moths have got into the beacon-smoke. They scatter every word the Flame speaks until the lines run together into mush — no spacing, no breaks, no sense.",
    "Swat <b>3 Ash Moths</b> off the green, and I'll teach you to make the Flame speak in clean, ordered lines — spacing, breaks, and the little marks that matter."
  ],
  acceptLabel: "Teach me clean lines.",
  midDialogue: "Still moths in the smoke — hear how the words slur together? Clear them out.",
  returnDialogue: [
    "Listen — the smoke runs straight again. Now, the craft of clean speech.",
    "Any fool can make the Flame shout. A bellhand makes it speak in <i>measured lines</i>. Mind the marks."
  ],
  doneDialogue: "Crisp as a struck bell. The beacon will keep your rhythm now, marked one.",
  lesson: {
    title: "Speaking in Clean Lines — print() in Depth",
    body: [
      "A single `print()` ends its own line — but you can also break a line from <i>inside</i> the words with `\\n`, the newline mark:",
      ">>>print(\"Spark\\nFlame\")   # two lines from one print",
      "`print()` can speak **several things at once** — separate them with commas, and it drops a single space between each:",
      ">>>print(\"HP\", 12, \"MP\", 5)   # HP 12 MP 5",
      "Two knobs tune how it speaks. `sep=` sets what goes <i>between</i> the pieces; `end=` sets what comes <i>after</i> the line (normally the newline):",
      ">>>print(\"a\", \"b\", \"c\", sep=\"-\")   # a-b-c\nprint(\"loading\", end=\"...\")        # no line break after",
      "A backslash `\\` begins an **escape** — one mark standing for something special: `\\n` a new line, `\\t` a tab, `\\\"` a literal quote, `\\\\` a literal backslash:",
      ">>>print(\"Name:\\tAsh\")        # Name:   Ash\nprint(\"She said \\\"run\\\"\")     # She said \"run\"",
      "Or sidestep quote-trouble entirely: wrap the text in the <i>other</i> kind of quote. `'She said \"run\"'` needs no escapes at all."
    ],
    fragments: [
      "**Fragment I** — `\\n` inside a string breaks the line right there: `print(\"A\\nB\")` speaks A, then B. One print, two lines.",
      "**Fragment II** — Commas make one `print()` speak many things with a space between: `print(\"HP\", 12)` → `HP 12`. `sep=\"x\"` changes that spacer; `end=\"\"` removes the line break at the end.",
      "**Fragment III** — A backslash escapes the next mark: `\\t` tab, `\\\"` a quote, `\\\\` a backslash. Or wrap text in the <i>other</i> quote to use one kind freely inside."
    ]
  },
  kills: { enemy: "ash_moth", count: 3 },
  questions: [
    { type: "output", q: "One print, with a newline mark inside it:", code: "print(\"Spark\\nFlame\")",
      answer: "Spark\nFlame", why: "\\n breaks the line right inside the string, so one print speaks two lines." },
    { type: "mc", q: "Which speaks exactly: HP 12 (one space between)?",
      choices: ["print(\"HP\", 12)", "print(\"HP\"12)", "print(\"HP\", 12, sep=\"\")", "print(\"HP12\")"],
      answer: 0, why: "Commas join items with a single space. sep=\"\" would give HP12, and \"HP12\" is already glued." },
    { type: "output", q: "Changing the spacer:", code: "print(\"a\", \"b\", \"c\", sep=\"*\")",
      answer: "a*b*c", why: "sep= replaces the space that normally sits between comma-separated items." },
    { type: "fill", q: "Fill the blank so the line does NOT break after printing:", code: "print(\"Ash\", ____=\"\")",
      answer: "end", why: "end= sets what follows the line; \"\" removes the usual newline." },
    { type: "tf", q: "True or False — print(\"x\", \"y\") puts a space between x and y by default.",
      answer: true, why: "print separates comma-separated items with a single space unless you change sep=." },
    { type: "output", q: "Mind the end= on the middle line:", code: "print(\"Line1\")\nprint(\"Line2\", end=\"\")\nprint(\"Line3\")",
      answer: "Line1\nLine2Line3", why: "end=\"\" removes the second print's newline, so Line3 follows Line2 with no break." }
  ],
  challenge: {
    title: "The Beacon's Toll",
    story: "Pip hands you the striker. \"Toll the status of the beacon — three lines, exactly. Spacing and breaks must ring true.\"",
    prompt: [
      "Print exactly these three lines:",
      ">>>ASHVEIL\nspark-flame-ember\nready...go",
      "Line 1: the word `ASHVEIL`.",
      "Line 2: the words `spark`, `flame`, `ember` joined by dashes — try `print(\"spark\", \"flame\", \"ember\", sep=\"-\")`.",
      "Line 3: `ready` and `go` on one line with `...` between — try `end=\"...\"`."
    ],
    mode: "program",
    starter: "# Toll three clean lines:\n#   ASHVEIL\n#   spark-flame-ember\n#   ready...go\n\n",
    tests: [
      { expectOut: "ASHVEIL\nspark-flame-ember\nready...go", label: "The beacon's toll" }
    ],
    hints: [
      "Line 2 is easiest with sep: print(\"spark\", \"flame\", \"ember\", sep=\"-\")",
      "For line 3, stop the newline after 'ready': print(\"ready\", end=\"...\") then print(\"go\")",
      "Full answer:\nprint(\"ASHVEIL\")\nprint(\"spark\", \"flame\", \"ember\", sep=\"-\")\nprint(\"ready\", end=\"...\")\nprint(\"go\")"
    ],
    explain: "`sep=\"-\"` slips a dash between each comma-separated word, and `end=\"...\"` swaps the line-break after `ready` for three dots — so `go` lands on the same line. The newline mark `\\n` inside a single string could do the very same work."
  },
  rewards: { xp: 70, coins: 25, items: [["scroll_of_insight", 1]] }
},

/* ---------------- py02 : The Merchant's Ledger ---------------- */
{
  id: "py02", act: 1, title: "The Merchant's Ledger", npc: "tobin", map: "village",
  intro: [
    "Ah, the marked one! Perfect timing. Ash slimes ate my ledger. My LEDGER. Three years of sums, dissolved in grey goo.",
    "Here's my offer: clear out <b>4 Ash Slimes</b> east of the square, and I'll teach you what every merchant knows — how to make the old tongue hold numbers and do your arithmetic for you.",
    "Then you'll rebuild my ledger. Deal? Deal."
  ],
  acceptLabel: "Deal.",
  midDialogue: "Still slimes in my stockyard! A merchant never abandons a contract, friend.",
  returnDialogue: [
    "The slimes are mush? Wonderful. Now, the ledger.",
    "I'll give you the counts. You make the Flame do the arithmetic. That's the whole secret of commerce: never do math a spell can do for you."
  ],
  doneDialogue: "Balanced to the last coin! You've a merchant's soul under all that destiny, friend.",
  lesson: {
    title: "The Merchant's Arithmetic — Variables & Numbers",
    body: [
      "A **variable** is a labeled coin-pouch: a name that stores a value. You fill it with `=`:",
      ">>>gold = 12\nswords = 3\nprint(gold)      # speaks: 12",
      "Numbers need **no quotes**. `12` is a number you can do math with; `\"12\"` is just writing.",
      "Python knows a merchant's every operation:",
      ">>>print(7 + 3)    # 10  addition\nprint(7 - 3)    # 4   subtraction\nprint(7 * 3)    # 21  multiplication\nprint(7 / 2)    # 3.5 division (always gives a decimal)\nprint(7 // 2)   # 3   floor division (drops the remainder)\nprint(7 % 3)    # 1   modulo - the REMAINDER after dividing\nprint(2 ** 3)   # 8   power: 2 to the 3rd",
      "Math follows the old order: `*` and `/` before `+` and `-`. Use parentheses to overrule it: `(2 + 3) * 4` is `20`.",
      "A pouch can be refilled — even using its own contents:",
      ">>>coins = 5\ncoins = coins + 2   # now 7\nprint(coins)"
    ],
    fragments: [
      "**Fragment I** — `name = value` stores a value. One `=` means *store*. `gold = 10` puts 10 in the pouch called gold.",
      "**Fragment II** — `*` multiplies, `/` divides (3.5-style decimals), `//` divides and drops the remainder, `%` gives only the remainder. `7 % 3` is `1`.",
      "**Fragment III** — Order of operations: multiplication before addition. `10 - 2 * 3` is `4`, not `24`. Parentheses overrule everything.",
      "**Fragment IV** — A variable can be rebuilt from itself: `coins = coins + 2` adds two coins to the pouch. `2 ** 3` raises 2 to the power 3: it is 8."
    ]
  },
  kills: { enemy: "ash_slime", count: 4 },
  questions: [
    { type: "output", q: "What does the ledger speak?", code: "x = 5\ny = 3\nprint(x + y)",
      answer: "8", why: "x holds 5, y holds 3; x + y is 8." },
    { type: "mc", q: "Which line stores 10 in a pouch called gold?",
      choices: ["gold = 10", "10 = gold", "gold == 10", "pouch gold 10"],
      answer: 0, why: "name = value. The name goes left, the value right. (== is for comparing, not storing.)" },
    { type: "output", q: "Mind the old order of operations:", code: "print(10 - 2 * 3)",
      answer: "4", why: "Multiplication first: 2*3=6, then 10-6=4." },
    { type: "mc", q: "What does 7 % 3 equal?",
      choices: ["1", "2", "2.33", "21"],
      answer: 0, why: "% is the remainder. 3 fits into 7 twice (6), leaving remainder 1." },
    { type: "output", q: "Floor division drops the remainder:", code: "print(7 // 2)",
      answer: "3", why: "7 / 2 is 3.5, but // floors it down to 3." },
    { type: "output", q: "Refilling the pouch:", code: "coins = 5\ncoins = coins + 2\nprint(coins)",
      answer: "7", why: "coins becomes its old value plus 2: 5 + 2 = 7." },
    { type: "mc", q: "What does `2 ** 4` equal?",
      choices: ["16", "8", "6", "24"],
      answer: 0, why: "`**` is power. `2 ** 4` = `2*2*2*2` = 16." },
    { type: "output", q: "Doubling the stock:", code: "a = 4\na = a * 2\nprint(a)",
      answer: "8", why: "a is rebuilt as 4 * 2 = 8." },
    { type: "tf", q: "True or False — `7 / 2` gives `3.5` in Python.",
      answer: true, why: "A single / always gives a decimal. Use // to drop the remainder instead." }
  ],
  challenge: {
    title: "Rebuild the Ledger",
    story: "Tobin slides you a slate. \"The counts are set down for you already. Make the Flame total my sale: the swords times the price, plus the king's tax.\"",
    prompt: [
      "Three variables are **already given** to your program (do not create them yourself):",
      ">>>swords   # how many swords were sold\nprice    # coins per sword\ntax      # the king's tax, added once",
      "Print a single number: the total owed — `swords * price + tax`.",
      "Example: if `swords = 3`, `price = 10`, `tax = 4`, your program prints:",
      ">>>34"
    ],
    mode: "program",
    given: "swords, price, tax",
    starter: "# swords, price and tax are already given!\n# Print the total: swords * price + tax\n\n",
    tests: [
      { setup: "swords = 3\nprice = 10\ntax = 4", expectOut: "34", label: "3 swords at 10c, tax 4" },
      { setup: "swords = 7\nprice = 12\ntax = 9", expectOut: "93", label: "7 swords at 12c, tax 9" },
      { setup: "swords = 0\nprice = 50\ntax = 2", expectOut: "2", label: "slow market day" }
    ],
    hints: [
      "The variables already exist — just use them: swords * price",
      "Order of operations does the right thing here: multiplication happens before the + tax.",
      "Full answer:\nprint(swords * price + tax)"
    ],
    explain: "`swords * price + tax` works because Python multiplies before it adds — the sale is totaled first, then the king's tax lands once on top. The variables were already filled by the ledger, so your one line works for ANY counts Tobin throws at it."
  },
  rewards: { xp: 80, coins: 30, items: [["militia_shortsword", 1]] }
},

/* ---------------- py03 : Words of Power ---------------- */
{
  id: "py03", act: 1, title: "Words of Power", npc: "sera", map: "village",
  intro: [
    "You're the marked one? Hm. The Flame chose someone with terrible posture.",
    "I am Sera, last scribe of the Royal Scriptorium. The ember imps by the west bank have been stealing my manuscripts — eating the *names* right off the pages. A name unwritten is a person unremembered.",
    "Burn down <b>4 Ember Imps</b> and I will teach you the scribe's art: weaving names and numbers into living sentences."
  ],
  acceptLabel: "The names will be remembered.",
  midDialogue: "The imps still chew on history itself. Go. Write their ending.",
  returnDialogue: [
    "My pages! Singed, but legible. You have my thanks — and one more lesson owed.",
    "Any scribe can copy words. A *royal* scribe weaves them. Show me you can weave a hero's introduction, and the art is yours."
  ],
  doneDialogue: "Beautifully woven. I shall write you into the chronicle — assuming we all survive the next chapter.",
  lesson: {
    title: "The Scribe's Weave — f-strings & String Craft",
    body: [
      "Strings can be **joined** with `+`, like gluing parchment:",
      ">>>print(\"Em\" + \"ber\")   # Ember",
      "But the scribe's true art is the **f-string**: put an `f` before the quotes, and anything in `{curly braces}` is replaced by its living value:",
      ">>>name = \"Bryn\"\nlevel = 9\nprint(f\"{name} reached level {level}\")\n# Bryn reached level 9",
      "Strings carry tools of their own, summoned with a dot:",
      ">>>war_cry = \"ashveil\"\nprint(war_cry.upper())   # ASHVEIL  - all capitals\nprint(\"DOOM\".lower())    # doom     - all lowercase",
      "And `len()` measures any string's length in characters:",
      ">>>print(len(\"flame\"))   # 5",
      "You can even use tools *inside* an f-string: `f\"{name.upper()} RISES\"`."
    ],
    fragments: [
      "**Fragment I** — `+` glues strings: `\"king\" + \"dom\"` is `\"kingdom\"`. Beware: `\"5\" + \"5\"` is `\"55\"` — quoted numbers are just writing.",
      "**Fragment II** — f-strings breathe life into text: `f\"Hail {name}\"` swaps `{name}` for whatever the pouch holds. Don't forget the `f` before the quote!",
      "**Fragment III** — `len(\"word\")` counts characters: `len(\"flame\")` is 5. Spaces count too.",
      "**Fragment IV** — `.upper()` SHOUTS, `.lower()` whispers. They are summoned with a dot: `\"ash\".upper()` is `\"ASH\"`. Works on variables: `name.upper()`."
    ]
  },
  kills: { enemy: "ember_imp", count: 4 },
  questions: [
    { type: "output", q: "Gluing parchment:", code: "print(\"Em\" + \"ber\")",
      answer: "Ember", why: "+ joins the two strings into Ember." },
    { type: "output", q: "The living sentence:", code: "name = \"Ash\"\nprint(f\"Hail {name}\")",
      answer: "Hail Ash", why: "The f-string swaps {name} for its value: Hail Ash." },
    { type: "mc", q: "What does len(\"flame\") return?",
      choices: ["5", "4", "\"flame\"", "6"],
      answer: 0, why: "f-l-a-m-e: five characters." },
    { type: "output", q: "The war cry:", code: "print(\"ash\".upper())",
      answer: "ASH", why: ".upper() makes every letter a capital." },
    { type: "output", q: "Weaving a number in:", code: "lvl = 9\nprint(f\"Level {lvl}\")",
      answer: "Level 9", why: "{lvl} becomes 9 inside the f-string." },
    { type: "mc", q: "Which one is a true f-string that greets Bryn?",
      choices: ["f\"Hi {name}\"", "\"Hi {name}\"", "f\"Hi name\"", "print{Hi + name}"],
      answer: 0, why: "It needs both the f prefix AND {braces}. Without the f, Python prints the braces literally." },
    { type: "output", q: "The whisper:", code: "word = \"KINGDOM\"\nprint(word.lower())",
      answer: "kingdom", why: ".lower() makes every letter lowercase." },
    { type: "output", q: "A classic scribe's blunder:", code: "print(\"5\" + \"5\")",
      answer: "55", why: "These are strings, not numbers — + glues them into \"55\"." },
    { type: "tf", q: "True or False — without the `f` prefix, `print(\"Hail {name}\")` prints the braces literally.",
      answer: true, why: "The f is what brings the braces to life. Without it, {name} is just eight ordinary characters." }
  ],
  challenge: {
    title: "The Hero's Introduction",
    story: "Sera dips her quill. \"Weave me a proper introduction. The chronicle is given a hero's name and their foe — your code must do the rest, whoever the hero may be.\"",
    prompt: [
      "Two string variables are **given**: `name` (the hero) and `foe` (their enemy).",
      "Print exactly three lines:",
      ">>>I am Bryn, bane of ash!\nBRYN RISES!\n4",
      "Line 1: `I am {name}, bane of {foe}!`",
      "Line 2: the name in ALL CAPITALS, then ` RISES!`",
      "Line 3: the number of letters in the name (use `len`).",
      "(The example above is for `name = \"Bryn\"`, `foe = \"ash\"` — your code must work for any name and foe.)"
    ],
    mode: "program",
    given: "name, foe",
    starter: "# name and foe are already given!\n# Line 1: I am {name}, bane of {foe}!\n# Line 2: {NAME IN CAPS} RISES!\n# Line 3: the length of the name\n\n",
    tests: [
      { setup: "name = \"Bryn\"\nfoe = \"ash\"", expectOut: "I am Bryn, bane of ash!\nBRYN RISES!\n4", label: "Bryn vs ash" },
      { setup: "name = \"Kaelis\"\nfoe = \"the dark\"", expectOut: "I am Kaelis, bane of the dark!\nKAELIS RISES!\n6", label: "Kaelis vs the dark" }
    ],
    hints: [
      "Line 1 is an f-string: print(f\"I am {name}, bane of {foe}!\")",
      "You can call .upper() inside the braces: f\"{name.upper()} RISES!\"",
      "Full answer:\nprint(f\"I am {name}, bane of {foe}!\")\nprint(f\"{name.upper()} RISES!\")\nprint(len(name))"
    ],
    explain: "f-strings swap each `{...}` for its living value, so one line of code introduces ANY hero. Tools run right inside the braces — `{name.upper()}` shouts whoever the name holds — and `len(name)` measures it, 4 for Bryn, 6 for Kaelis."
  },
  rewards: { xp: 100, coins: 35, items: [["padded_vest", 1]] }
},

/* ---------------- py03b : The Granary Count ---------------- */
{
  id: "py03b", act: 1, title: "The Granary Count", npc: "hesper", map: "village",
  intro: [
    "Marked or not, you look like someone who can count. Good — because something cannot.",
    "Tallow grubs are in my granary, and every sack they touch comes back labelled in <i>words</i> instead of <i>numbers</i>. \"Twelve\" you cannot add. `12` you can. The whole harvest tally is ruined.",
    "Clear out <b>3 Tallow Grubs</b> from the stores and the fields, and I'll teach you the keeper's secret: how the Flame <i>listens</i>, and how to turn a spoken word into a number you can actually reckon with."
  ],
  acceptLabel: "I'll set the count right.",
  midDialogue: "Still grubs in the grain — and still words where numbers ought to be. Go on.",
  returnDialogue: [
    "Stores are clear. Now — the reckoning.",
    "The Flame can <i>listen</i> as well as speak. But everything it hears comes back as words. A keeper's first task is turning those words into true numbers."
  ],
  doneDialogue: "Tallied to the grain. You've the makings of a quartermaster, marked one — don't let the Citadel hear, they're always short.",
  lesson: {
    title: "The Flame Listens — input() & Type Conversion",
    body: [
      "`input()` makes the Flame <i>listen</i>: it waits for a line and hands it back to you. You usually store it in a pouch:",
      ">>>name = input()\nprint(f\"Hail {name}\")",
      "But beware — **everything `input()` returns is a string**, even if it looks like a number. Quoted digits are just writing:",
      ">>>print(\"5\" + \"5\")   # 55  (glued text, not math!)\nprint(5 + 5)       # 10  (real numbers)",
      "To do math on a typed-in number, **convert** it. `int()` makes a whole number, `float()` a decimal, `str()` turns a number back into text:",
      ">>>age = int(\"12\")      # the number 12\nprint(age + 1)         # 13\nprice = float(\"3.5\")   # the number 3.5",
      "So the keeper's pattern is: listen, then convert — often in one breath:",
      ">>>sacks = int(input())   # read a line AND make it a number\nprint(sacks * 2)",
      "Mixing types is an error: `\"5\" + 5` makes the Flame recoil (TypeError). Convert first — `int(\"5\") + 5` is `10`, and `str(5) + \"5\"` is `\"55\"`."
    ],
    fragments: [
      "**Fragment I** — `input()` reads one line and returns it **as a string** — always. `n = input()` puts whatever was typed into n, as text.",
      "**Fragment II** — `int(\"12\")` is the number 12; `float(\"3.5\")` is 3.5; `str(12)` is the text \"12\". Convert a typed number before doing math on it.",
      "**Fragment III** — `\"5\" + \"5\"` is `\"55\"` (text glued); `5 + 5` is `10` (math). And `\"5\" + 5` is an error — never mix words and numbers without converting."
    ]
  },
  kills: { enemy: "tallow_grub", count: 3 },
  questions: [
    { type: "output", q: "Two strings, glued — not added:", code: "print(\"5\" + \"5\")",
      answer: "55", why: "Quoted digits are text. + glues them into \"55\". Only unquoted numbers do math." },
    { type: "mc", q: "input() always returns a value of what type?",
      choices: ["a string (text)", "an int", "a float", "whatever type you typed"],
      answer: 0, why: "input() hands back a string every time, even \"12\". Convert it with int() to do math." },
    { type: "output", q: "Convert, then add one:", code: "n = int(\"12\")\nprint(n + 1)",
      answer: "13", why: "int(\"12\") becomes the number 12; 12 + 1 is 13." },
    { type: "mc", q: "Which turns the text \"7\" into a number you can multiply?",
      choices: ["int(\"7\")", "str(\"7\")", "\"7\" * 1", "print(\"7\")"],
      answer: 0, why: "int(\"7\") gives the number 7. str() keeps it text; \"7\" * 1 just repeats the text once." },
    { type: "output", q: "Listen, convert, reckon (here input() returns \"4\"):", code: "sacks = int(input())\nprint(sacks * 3)",
      answer: "12", why: "input() reads \"4\", int() makes it the number 4, and 4 * 3 is 12." },
    { type: "tf", q: "True or False — `\"5\" + 5` raises an error in Python.",
      answer: true, why: "You can't add text and a number. Convert first: int(\"5\") + 5 is 10." },
    { type: "fill", q: "Fill the blank to turn typed text into a whole number:", code: "count = ____(input())",
      answer: "int", why: "int() converts the string from input() into a whole number." }
  ],
  challenge: {
    title: "The Harvest Tally",
    story: "Hesper sets three slips before you. \"The Flame will read you the count: a name, then two numbers of sacks. Give me the keeper's tally.\"",
    prompt: [
      "Your program must **read three lines** with `input()`, in this order:",
      ">>>a farmer's name\nthe morning sacks (a whole number)\nthe evening sacks (a whole number)",
      "Then print exactly two lines:",
      ">>>Ledger for Bryn\nTotal sacks: 12",
      "Line 1: `Ledger for ` then the name.",
      "Line 2: `Total sacks: ` then the two counts **added as numbers** (remember to convert!).",
      "(Example is for the inputs Bryn, 5, 7 → 5 + 7 = 12.)"
    ],
    mode: "program",
    starter: "# Read three lines with input():\n#   name    = input()\n#   morning = ...convert to a number...\n#   evening = ...convert to a number...\n# Then print the two ledger lines.\n\n",
    tests: [
      { inputs: ["Bryn", "5", "7"], expectOut: "Ledger for Bryn\nTotal sacks: 12", label: "Bryn: 5 + 7" },
      { inputs: ["Sora", "10", "14"], expectOut: "Ledger for Sora\nTotal sacks: 24", label: "Sora: 10 + 14" },
      { inputs: ["Kael", "0", "9"], expectOut: "Ledger for Kael\nTotal sacks: 9", label: "Kael: 0 + 9" }
    ],
    hints: [
      "Read the name first: name = input(). It is already text, so use it as-is.",
      "Convert each number as you read it: morning = int(input()), then evening = int(input())",
      "Full answer:\nname = input()\nmorning = int(input())\nevening = int(input())\nprint(f\"Ledger for {name}\")\nprint(f\"Total sacks: {morning + evening}\")"
    ],
    explain: "`input()` hands back text, so the name prints as-is — but the two counts must pass through `int()` before they add as numbers, or `\"5\" + \"7\"` would glue into `57`. Convert on the way in, and the tally is always true."
  },
  rewards: { xp: 110, coins: 35, items: [["ember_charm", 1]] }
},

/* ---------------- py04 : BOSS — The Charred Gatekeeper ---------------- */
{
  id: "py04", act: 1, title: "The Charred Gatekeeper", npc: "elder_maren", map: "village", boss: true,
  bossEnemy: "boss_gatekeeper", bossSpot: { map: "village", x: 57, y: 19 },
  intro: [
    "It has begun. A knight of the First Kingdom stands at our east gate — dead a thousand years, yet armored in cinders. The Flame's return wakes the old servants first.",
    "He will not let you pass to Emberwood until you prove your speech. Everything you have learned — words, numbers, the weave — bring all of it.",
    "Face <b>The Charred Gatekeeper</b> at the east gate. Answer his riddles, then speak the rite that unbinds him."
  ],
  acceptLabel: "I will face the Gatekeeper.",
  midDialogue: "He waits at the east gate, burning without heat. Do not keep the dead waiting.",
  returnDialogue: ["Go — the Gatekeeper stands at the east gate."],
  doneDialogue: "The gate stands open. Emberwood lies beyond — wilder than the village, and far less forgiving. The Flame goes with you.",
  lesson: {
    title: "Trial of Sparks (Recap)",
    body: [
      "The Gatekeeper tests Act I in full. Remember:",
      ">>>print(\"words\")          # speak strings\ntotal = a * b + c        # variables & arithmetic\nprint(f\"Hail {name}\")    # f-strings weave values in\nname.upper()             # the war-cry form\nlen(name)                # measure a string",
      "Boss trials chain riddles together, then demand a full rite — a complete program. Wrong answers cost blood. Steady hands."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The Gatekeeper rasps: 'Read the ledger of war.'", code: "blades = 4\nfallen = 9\nprint(f\"{blades * fallen} cinders\")",
      answer: "36 cinders", why: "4 * 9 = 36, woven into the f-string." },
    { type: "mc", q: "'Which spell stores my name?'",
      choices: ["keeper = \"Charred One\"", "\"Charred One\" = keeper", "keeper == \"Charred One\"", "print(keeper)"],
      answer: 0, why: "Assignment puts the name (left) before the = and the value (right) after." },
    { type: "output", q: "'What remains when ninety is split by seven?'", code: "print(90 % 7)",
      answer: "6", why: "7*12=84, and 90-84 leaves remainder 6." },
    { type: "output", q: "'Speak my title as the chronicle would.'", code: "title = \"gatekeeper\"\nprint(f\"THE {title.upper()}\")",
      answer: "THE GATEKEEPER", why: ".upper() inside the f-string turns gatekeeper into GATEKEEPER." }
  ],
  challenge: {
    title: "The Rite of Unbinding",
    story: "The Gatekeeper kneels, armor glowing at the seams. \"Speak the rite, marked one. Name the hero, weigh the flame, and I am unbound.\"",
    prompt: [
      "You are **given**: `hero` (string), `blade` (string), `sparks` (int), `embers` (int).",
      "Print exactly three lines:",
      ">>>Bryn bears the Dull Blade!\nFlame power: 15\nBRYN PREVAILS!",
      "Line 1: `{hero} bears the {blade}!`",
      "Line 2: `Flame power: ` followed by `sparks * embers`",
      "Line 3: the hero's name in CAPITALS, then ` PREVAILS!`",
      "(Example shown is for hero=Bryn, blade=Dull Blade, sparks=3, embers=5.)"
    ],
    mode: "program",
    given: "hero, blade, sparks, embers",
    starter: "# hero, blade, sparks, embers are given.\n# Line 1: {hero} bears the {blade}!\n# Line 2: Flame power: {sparks * embers}\n# Line 3: {HERO} PREVAILS!\n\n",
    tests: [
      { setup: "hero = \"Bryn\"\nblade = \"Dull Blade\"\nsparks = 3\nembers = 5", expectOut: "Bryn bears the Dull Blade!\nFlame power: 15\nBRYN PREVAILS!", label: "Bryn's rite" },
      { setup: "hero = \"Sora\"\nblade = \"Keen Iron Edge\"\nsparks = 7\nembers = 2", expectOut: "Sora bears the Keen Iron Edge!\nFlame power: 14\nSORA PREVAILS!", label: "Sora's rite" }
    ],
    hints: [
      "Three f-strings, three prints. Line 1: print(f\"{hero} bears the {blade}!\")",
      "You can do math inside braces: f\"Flame power: {sparks * embers}\"",
      "Full answer:\nprint(f\"{hero} bears the {blade}!\")\nprint(f\"Flame power: {sparks * embers}\")\nprint(f\"{hero.upper()} PREVAILS!\")"
    ],
    explain: "Three f-strings carried the whole rite: `{hero}` and `{blade}` drop stored values into a sentence, `{sparks * embers}` proves real math runs inside the braces, and `{hero.upper()}` calls a string tool mid-weave. Everything Act I taught, in three lines."
  },
  rewards: { xp: 200, coins: 60, items: [["keen_iron_edge", 1]], title: "Gatewarden", unlocks: "Emberwood Forest" }
}
);
