/* ============================================================
   ACT I — ASHVEIL VILLAGE: The Mark of the Flame  (C++ Chronicle)
   C++ basics: #include, cout, int & arithmetic, cin, std::string
   ============================================================
   Same world & NPCs as the Python Chronicle; the lessons differ.
   All trials are stdin -> stdout programs, compiled on the forge.
   Lesson body: array of strings; ">>>" prefix = code block,
   `x` = inline code. C++ source shows literal \n as \\n.
   ============================================================ */
window.QUEST_DB.push(

/* ---------------- cpp01 : Sparks in the Ash ---------------- */
{
  id: "cpp01", faction: "cpp", act: 1, title: "Sparks in the Ash", npc: "elder_maren", map: "village",
  intro: [
    "So. The Flame marked you too. I saw the brand on your hand the moment you crossed the bridge.",
    "A thousand years ago, the First Kingdom spoke to the world in a language of power. The Iron Concord calls its modern echo <b>C++</b> — the tongue that speaks straight to the world's bones, and is obeyed.",
    "The cinder rats gnawing at our beacon feed on silence. Every word of power you compile weakens them. Slay <b>3 Cinder Rats</b> south of the river, and the Flame will teach you to speak as you fight."
  ],
  acceptLabel: "I will learn to speak.",
  midDialogue: "The rats still gnaw at the beacon, marked one. Speak the words. The forge listens.",
  returnDialogue: [
    "The rats fall silent and the beacon hungers for true words.",
    "Now — your first trial. Speak the Words of Kindling <i>exactly</i> as the old rite demands. The forge is precise: one wrong letter and it will not light."
  ],
  doneDialogue: "The beacon burns again. You are no longer ordinary, survivor. You are a smith of the old tongue.",
  lesson: {
    title: "Speaking the Old Tongue — cout & Programs",
    body: [
      "C++ is the language the Eternal Flame understands when it wants the world *moved*. Every spell is a whole **program**, and every program begins the same way:",
      ">>>#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, Ashveil\";\n    return 0;\n}",
      "`#include <iostream>` summons the input/output spirits. `int main() { ... }` is the body of every spell — the Flame begins here. `return 0;` reports the rite ended cleanly.",
      "To speak a word aloud, push it into `cout` with the `<<` arrows. Text — a **string** — must wear double quotes: `\"like this\"`. Without quotes, C++ hunts for a *thing* by that name, not words.",
      ">>>cout << \"Embers\";   // speaks: Embers",
      "Lines do not break on their own. End a line with `\\n` (a newline) inside the quotes, or with `<< endl`:",
      ">>>cout << \"Spark\\n\";\ncout << \"Flame\\n\";",
      "You can chain many pushes in one statement — the arrows flow left to right:",
      ">>>cout << \"Spark\" << \"\\n\" << \"Flame\" << \"\\n\";",
      "Every statement ends with a **semicolon** `;`. Forget it and the Flame will not light (a compile error). Lines that begin with `//` are **comments** — the forge ignores them."
    ],
    fragments: [
      "**Fragment I** — Every spell is a program: `#include <iostream>`, then `int main() { ... return 0; }`. Your words go inside main's braces.",
      "**Fragment II** — `cout << \"word\";` speaks a word. The `<<` arrows push text into the output stream; strings wear double quotes like armor. `cout << Embers;` (no quotes) hunts for a variable.",
      "**Fragment III** — Lines don't break themselves: `\"\\n\"` ends a line, so `cout << \"A\\nB\";` speaks A then B. And every statement ends in a semicolon `;` — miss one and the rite won't compile."
    ]
  },
  kills: { enemy: "cinder_rat", count: 3 },
  questions: [
    { type: "mc", q: "Which incantation correctly speaks the word Ember?",
      choices: ["cout << \"Ember\";", "cout << Ember;", "print(\"Ember\");", "cout >> \"Ember\";"],
      answer: 0, why: "cout << pushes text out, and the text needs double quotes. Without quotes C++ looks for a variable Ember; >> is for input, not output." },
    { type: "output", q: "What does this code speak aloud?", code: "cout << \"Rise\";",
      answer: "Rise", why: "cout << outputs exactly what is inside the quotes: Rise." },
    { type: "mc", q: "What ends (almost) every C++ statement?",
      choices: [";", ":", ".", "the word end"],
      answer: 0, why: "A semicolon ; ends statements. A missing ; is the most common compile error." },
    { type: "output", q: "Two pushes, two lines. What is spoken?", code: "cout << \"Ash\\n\";\ncout << \"Veil\\n\";",
      answer: "Ash\nVeil", why: "Each \\n ends its line: Ash, then Veil beneath it." },
    { type: "fill", q: "Fill the blank to speak the word aloud:", code: "____ << \"Endure\";",
      answer: "cout", why: "cout is the output stream. cout << \"Endure\"; speaks Endure." },
    { type: "mc", q: "What does #include <iostream> do?",
      choices: ["Brings in cout and cin (input/output)", "Ends the program", "Declares a variable", "Repeats a line"],
      answer: 0, why: "<iostream> summons the input/output stream tools — cout for speaking, cin for listening." },
    { type: "output", q: "Careful — what does this speak?", code: "cout << \"2 + 3\";",
      answer: "2 + 3", why: "Quotes make it a string. C++ speaks the characters 2 + 3 — it does not do the math." }
  ],
  challenge: {
    title: "The Words of Kindling",
    story: "Elder Maren leads you to the cold beacon. \"Speak the three Words of Kindling, exactly. The Flame accepts no almost.\"",
    prompt: [
      "Write a program that prints exactly these three lines, in this order:",
      ">>>Spark\nFlame\nASHVEIL ENDURES",
      "End each line with `\\n`. Spelling and capital letters must match perfectly."
    ],
    mode: "program",
    starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Speak the three Words of Kindling, each on its own line:\n    //   Spark\n    //   Flame\n    //   ASHVEIL ENDURES\n\n    return 0;\n}\n",
    tests: [
      { stdin: "", expectOut: "Spark\nFlame\nASHVEIL ENDURES", label: "The rite of kindling" }
    ],
    hints: [
      "Push each word with its own newline: cout << \"Spark\\n\";",
      "Capitals matter! The third line is all uppercase: cout << \"ASHVEIL ENDURES\\n\";",
      "Full answer:\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Spark\\n\";\n    cout << \"Flame\\n\";\n    cout << \"ASHVEIL ENDURES\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 60, coins: 25, items: [["ashen_salve", 2]] }
},

/* ---------------- cpp02 : The Merchant's Ledger ---------------- */
{
  id: "cpp02", faction: "cpp", act: 1, title: "The Merchant's Ledger", npc: "tobin", map: "village",
  intro: [
    "Ah, the marked one! Perfect timing. Ash slimes ate my ledger. My LEDGER. Three years of sums, dissolved in grey goo.",
    "Here's my offer: clear out <b>4 Ash Slimes</b> east of the square, and I'll teach you what every merchant knows — how to make C++ hold numbers and do your arithmetic for you.",
    "Then you'll rebuild my ledger. Deal? Deal."
  ],
  acceptLabel: "Deal.",
  midDialogue: "Still slimes in my stockyard! A merchant never abandons a contract, friend.",
  returnDialogue: [
    "The slimes are mush? Wonderful. Now, the ledger.",
    "I'll feed you the counts. You make the forge do the arithmetic. That's the whole secret of commerce: never do math a program can do for you."
  ],
  doneDialogue: "Balanced to the last coin! You've a merchant's soul under all that destiny, friend.",
  lesson: {
    title: "The Merchant's Arithmetic — Types, Math & cin",
    body: [
      "A **variable** is a labeled coin-pouch — but in C++ you must declare its **type** first. Whole numbers are `int`:",
      ">>>int gold = 12;\nint swords = 3;\ncout << gold;   // speaks: 12",
      "Numbers need no quotes. `12` is a number you can do math with; `\"12\"` is just writing. C++ knows a merchant's every operation:",
      ">>>cout << 7 + 3;   // 10  addition\ncout << 7 - 3;   // 4   subtraction\ncout << 7 * 3;   // 21  multiplication\ncout << 7 / 2;   // 3   INTEGER division drops the remainder!\ncout << 7 % 2;   // 1   modulo - the REMAINDER",
      "Beware the merchant's trap: `int / int` throws the remainder away — `7 / 2` is `3`, not `3.5`. For decimals, use `double`: `7.0 / 2` is `3.5`.",
      "Math follows the old order: `*` `/` `%` before `+` `-`. Parentheses overrule: `(2 + 3) * 4` is `20`.",
      "To **read** a value the world hands you, pull from `cin` with the `>>` arrows — they point the way the data flows:",
      ">>>int n;\ncin >> n;          // reads one number into n\nint a, b;\ncin >> a >> b;     // reads two, in order",
      "A pouch can be refilled, even from itself: `coins = coins + 2;`, or the short form `coins += 2;`."
    ],
    fragments: [
      "**Fragment I** — Declare the type, then the name: `int gold = 12;`. `int` holds whole numbers. One `=` means *store* (two, `==`, compares).",
      "**Fragment II** — `*` `/` `%` run before `+` `-`. But `int / int` drops the remainder: `7 / 2` is `3`. `7 % 2` is the leftover, `1`. Use `double` for decimals.",
      "**Fragment III** — Parentheses overrule order: `10 - 2 * 3` is `4`, but `(10 - 2) * 3` is `24`.",
      "**Fragment IV** — `cin >> n;` reads a value into n; `cin >> a >> b;` reads several in order. `coins += 2;` grows a pouch from itself."
    ]
  },
  kills: { enemy: "ash_slime", count: 4 },
  questions: [
    { type: "output", q: "What does the ledger speak?", code: "int x = 5;\nint y = 3;\ncout << x + y;",
      answer: "8", why: "x holds 5, y holds 3; x + y is 8." },
    { type: "mc", q: "Which line stores 10 in an int called gold?",
      choices: ["int gold = 10;", "gold = int 10;", "int gold == 10;", "gold := 10;"],
      answer: 0, why: "type, name, =, value: int gold = 10;. (== compares; it does not store.)" },
    { type: "output", q: "Mind the order of operations:", code: "cout << 10 - 2 * 3;",
      answer: "4", why: "Multiplication first: 2*3=6, then 10-6=4." },
    { type: "mc", q: "What does 7 / 2 give when both are int?",
      choices: ["3", "3.5", "4", "1"],
      answer: 0, why: "Integer division throws away the remainder: 3. You'd need a double for 3.5." },
    { type: "output", q: "The remainder:", code: "cout << 7 % 3;",
      answer: "1", why: "% is the remainder. 3 fits into 7 twice (6), leaving 1." },
    { type: "output", q: "Refilling the pouch:", code: "int coins = 5;\ncoins += 2;\ncout << coins;",
      answer: "7", why: "coins += 2 adds 2 to coins: 5 + 2 = 7." },
    { type: "mc", q: "How do you read one integer from the merchant into n?",
      choices: ["cin >> n;", "cout << n;", "cin << n;", "read(n);"],
      answer: 0, why: "cin >> n; pulls one value from input into n. cout << is for output; the arrows point the way data flows." }
  ],
  challenge: {
    title: "Rebuild the Ledger",
    story: "Tobin slides you a slate. \"The counts are given on the input already. Make the forge total my sale: the swords times the price, plus the king's tax.\"",
    prompt: [
      "Three numbers are given on the input, in order: `swords`, `price`, `tax`. The starter reads them for you.",
      "Print a single number: the total owed — `swords * price + tax`.",
      "Example: input `3 10 4` prints:",
      ">>>34"
    ],
    mode: "program",
    starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int swords, price, tax;\n    cin >> swords >> price >> tax;\n    // Print the total: swords * price + tax\n\n    return 0;\n}\n",
    tests: [
      { stdin: "3 10 4", expectOut: "34", label: "3 swords at 10c, tax 4" },
      { stdin: "7 12 9", expectOut: "93", label: "7 swords at 12c, tax 9" },
      { stdin: "0 50 2", expectOut: "2", label: "slow market day" }
    ],
    hints: [
      "The variables are already read for you — just use them: swords * price + tax.",
      "Push the result to cout: cout << swords * price + tax << \"\\n\"; (multiplication happens before the + tax).",
      "Full answer:\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int swords, price, tax;\n    cin >> swords >> price >> tax;\n    cout << swords * price + tax << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 80, coins: 30, items: [["militia_shortsword", 1]] }
},

/* ---------------- cpp03 : Words of Power ---------------- */
{
  id: "cpp03", faction: "cpp", act: 1, title: "Words of Power", npc: "sera", map: "village",
  intro: [
    "You're the marked one? Hm. The Flame chose someone with terrible posture.",
    "I am Sera, last scribe of the Royal Scriptorium. The ember imps by the west bank have been stealing my manuscripts — eating the *names* right off the pages. A name unwritten is a person unremembered.",
    "Burn down <b>4 Ember Imps</b> and I will teach you the scribe's art in C++: weaving names and numbers into living sentences."
  ],
  acceptLabel: "The names will be remembered.",
  midDialogue: "The imps still chew on history itself. Go. Write their ending.",
  returnDialogue: [
    "My pages! Singed, but legible. You have my thanks — and one more lesson owed.",
    "Any scribe can copy words. A *royal* scribe weaves them. Show me you can weave a hero's introduction, and the art is yours."
  ],
  doneDialogue: "Beautifully woven. I shall write you into the chronicle — assuming we all survive the next chapter.",
  lesson: {
    title: "The Scribe's Weave — std::string",
    body: [
      "Text lives in a `string` — summon it with `#include <string>`:",
      ">>>string name = \"Bryn\";\ncout << name;   // Bryn",
      "Glue strings with `+`, like gluing parchment:",
      ">>>string a = \"Em\";\nstring b = \"ber\";\ncout << a + b;   // Ember",
      "A string knows its own length with `.size()` (or `.length()`):",
      ">>>cout << name.size();   // 4",
      "Weave names and numbers into one sentence by chaining `<<`:",
      ">>>int level = 9;\ncout << name << \" reached level \" << level;\n// Bryn reached level 9",
      "To read a single word, `cin >> word;`. But a phrase with **spaces** needs `getline`:",
      ">>>string title;\ngetline(cin, title);   // reads a whole line, spaces and all",
      "To SHOUT a string, raise each letter with `toupper` (from `#include <cctype>`), walking the letters with a **reference**:",
      ">>>string cry = name;\nfor (char &c : cry) c = toupper(c);\ncout << cry;   // BRYN",
      "That `char &c` is a reference — `c` *is* each letter, so changing `c` changes the string itself."
    ],
    fragments: [
      "**Fragment I** — `#include <string>`, then `string name = \"Bryn\";`. Glue with `+`: `\"king\" + \"dom\"` is `\"kingdom\"`.",
      "**Fragment II** — `name.size()` counts characters: `\"flame\"` is 5. Chain output freely: `cout << a << \" \" << b;`.",
      "**Fragment III** — `cin >> word;` reads ONE word (it stops at a space). `getline(cin, line);` reads the whole line, spaces included.",
      "**Fragment IV** — Raise a string with a reference and `toupper`: `for (char &c : s) c = toupper(c);`. The `&` means c IS the letter in s, not a copy — so the change sticks."
    ]
  },
  kills: { enemy: "ember_imp", count: 4 },
  questions: [
    { type: "output", q: "Gluing parchment:", code: "string a = \"Em\";\nstring b = \"ber\";\ncout << a + b;",
      answer: "Ember", why: "+ joins the two strings into Ember." },
    { type: "output", q: "The living sentence:", code: "string name = \"Ash\";\ncout << \"Hail \" << name;",
      answer: "Hail Ash", why: "Chained << pushes \"Hail \", then the value of name." },
    { type: "mc", q: "What does string s = \"flame\"; s.size() return?",
      choices: ["5", "4", "\"flame\"", "6"],
      answer: 0, why: "f-l-a-m-e: five characters." },
    { type: "output", q: "Weaving a number in:", code: "int lvl = 9;\ncout << \"Level \" << lvl;",
      answer: "Level 9", why: "<< lvl pushes the number 9 after the text." },
    { type: "mc", q: "Which reads a whole line that may contain spaces?",
      choices: ["getline(cin, line);", "cin >> line;", "cout << line;", "read(line);"],
      answer: 0, why: "cin >> stops at the first space; getline reads the entire line." },
    { type: "output", q: "Raising the war cry:", code: "string s = \"ash\";\nfor (char &c : s) c = toupper(c);\ncout << s;",
      answer: "ASH", why: "toupper raises each letter; the reference & writes it back into s." },
    { type: "mc", q: "Why does for (char &c : s) use the & ?",
      choices: ["So c IS each letter and the change affects s", "Only to make it faster", "It counts the letters", "It reverses the string"],
      answer: 0, why: "The reference & means c is the actual character in s, so assigning to c modifies the string." }
  ],
  challenge: {
    title: "The Hero's Introduction",
    story: "Sera dips her quill. \"Weave me a proper introduction. The input gives a hero's name and their foe — your code must do the rest, whoever the hero may be.\"",
    prompt: [
      "Input is two lines: line 1 is `name` (one word), line 2 is `foe` (which may contain spaces). The starter reads both.",
      "Print exactly three lines:",
      ">>>I am Bryn, bane of ash!\nBRYN RISES!\n4",
      "Line 1: `I am {name}, bane of {foe}!`",
      "Line 2: the name in ALL CAPITALS, then ` RISES!`",
      "Line 3: the number of letters in the name (use `.size()`).",
      "(Example for name = Bryn, foe = ash. Your code must work for any name and foe.)"
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string name, foe;\n    getline(cin, name);\n    getline(cin, foe);\n    // Line 1: I am {name}, bane of {foe}!\n    // Line 2: {NAME IN CAPS} RISES!\n    // Line 3: number of letters in name\n\n    return 0;\n}\n",
    tests: [
      { stdin: "Bryn\nash", expectOut: "I am Bryn, bane of ash!\nBRYN RISES!\n4", label: "Bryn vs ash" },
      { stdin: "Kaelis\nthe dark", expectOut: "I am Kaelis, bane of the dark!\nKAELIS RISES!\n6", label: "Kaelis vs the dark" }
    ],
    hints: [
      "Line 1: cout << \"I am \" << name << \", bane of \" << foe << \"!\\n\";",
      "Capitalize into a copy: string up = name; for (char &c : up) c = toupper(c); then cout << up << \" RISES!\\n\"; and cout << name.size() << \"\\n\";",
      "Full answer:\n#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string name, foe;\n    getline(cin, name);\n    getline(cin, foe);\n    cout << \"I am \" << name << \", bane of \" << foe << \"!\\n\";\n    string up = name;\n    for (char &c : up) c = toupper(c);\n    cout << up << \" RISES!\\n\";\n    cout << name.size() << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 100, coins: 35, items: [["padded_vest", 1]] }
},

/* ---------------- cpp04 : BOSS — The Charred Gatekeeper ---------------- */
{
  id: "cpp04", faction: "cpp", act: 1, title: "The Charred Gatekeeper", npc: "elder_maren", map: "village", boss: true,
  bossEnemy: "boss_gatekeeper", bossSpot: { map: "village", x: 43, y: 11 },
  intro: [
    "It has begun. A knight of the First Kingdom stands at our east gate — dead a thousand years, yet armored in cinders. The Flame's return wakes the old servants first.",
    "He will not let you pass to Emberwood until you prove your speech. Everything you have forged — words, numbers, the weave — bring all of it.",
    "Face <b>The Charred Gatekeeper</b> at the east gate. Answer his riddles, then compile the rite that unbinds him."
  ],
  acceptLabel: "I will face the Gatekeeper.",
  midDialogue: "He waits at the east gate, burning without heat. Do not keep the dead waiting.",
  returnDialogue: ["Go — the Gatekeeper stands at the east gate."],
  doneDialogue: "The gate stands open. Emberwood lies beyond — wilder than the village, and far less forgiving. The Flame goes with you.",
  lesson: {
    title: "Trial of Sparks (Recap)",
    body: [
      "The Gatekeeper tests Act I in full. Remember:",
      ">>>cout << \"words\" << \"\\n\";          // speak strings\nint total = a * b + c;              // ints & arithmetic\ncin >> x >> y;                      // read input\ncout << name << \" lvl \" << lvl;     // weave values\nfor (char &c : s) c = toupper(c);   // SHOUT a string",
      "Boss trials chain riddles together, then demand a full rite — a complete, compiling program. Wrong answers cost blood. Steady hands."
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The Gatekeeper rasps: 'Read the ledger of war.'", code: "int blades = 4;\nint fallen = 9;\ncout << blades * fallen << \" cinders\";",
      answer: "36 cinders", why: "4 * 9 = 36, then the text \" cinders\" is pushed after it." },
    { type: "mc", q: "'Which spell stores my name?'",
      choices: ["string keeper = \"Charred One\";", "keeper = string \"Charred One\";", "string keeper == \"Charred One\";", "cout << keeper;"],
      answer: 0, why: "type, name, =, value: string keeper = \"Charred One\";." },
    { type: "output", q: "'What remains when ninety is split by seven?'", code: "cout << 90 % 7;",
      answer: "6", why: "7*12=84, and 90-84 leaves remainder 6." },
    { type: "output", q: "'Speak my title as the chronicle would.'", code: "string t = \"gatekeeper\";\nfor (char &c : t) c = toupper(c);\ncout << \"THE \" << t;",
      answer: "THE GATEKEEPER", why: "toupper raises each letter; THE + GATEKEEPER." }
  ],
  challenge: {
    title: "The Rite of Unbinding",
    story: "The Gatekeeper kneels, armor glowing at the seams. \"Compile the rite, marked one. Name the hero, weigh the flame, and I am unbound.\"",
    prompt: [
      "Input: line 1 `hero` (one word), line 2 `blade` (may have spaces), line 3 two ints `sparks embers`. The starter reads them.",
      "Print exactly three lines:",
      ">>>Bryn bears the Dull Blade!\nFlame power: 15\nBRYN PREVAILS!",
      "Line 1: `{hero} bears the {blade}!`",
      "Line 2: `Flame power: ` then `sparks * embers`",
      "Line 3: the hero's name in CAPITALS, then ` PREVAILS!`",
      "(Example for hero=Bryn, blade=Dull Blade, sparks=3, embers=5.)"
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string hero, blade;\n    getline(cin, hero);\n    getline(cin, blade);\n    int sparks, embers;\n    cin >> sparks >> embers;\n    // Line 1: {hero} bears the {blade}!\n    // Line 2: Flame power: {sparks * embers}\n    // Line 3: {HERO} PREVAILS!\n\n    return 0;\n}\n",
    tests: [
      { stdin: "Bryn\nDull Blade\n3 5", expectOut: "Bryn bears the Dull Blade!\nFlame power: 15\nBRYN PREVAILS!", label: "Bryn's rite" },
      { stdin: "Sora\nKeen Iron Edge\n7 2", expectOut: "Sora bears the Keen Iron Edge!\nFlame power: 14\nSORA PREVAILS!", label: "Sora's rite" }
    ],
    hints: [
      "Line 1: cout << hero << \" bears the \" << blade << \"!\\n\";",
      "Line 2: cout << \"Flame power: \" << sparks * embers << \"\\n\"; — line 3: capitalize hero into a copy, then PREVAILS!",
      "Full answer:\n#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string hero, blade;\n    getline(cin, hero);\n    getline(cin, blade);\n    int sparks, embers;\n    cin >> sparks >> embers;\n    cout << hero << \" bears the \" << blade << \"!\\n\";\n    cout << \"Flame power: \" << sparks * embers << \"\\n\";\n    string up = hero;\n    for (char &c : up) c = toupper(c);\n    cout << up << \" PREVAILS!\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 200, coins: 60, items: [["keen_iron_edge", 1]], title: "Gatewarden", unlocks: "Emberwood Forest" }
}
);
