/* ============================================================
   ACT III — THE SUNKEN RUINS: Lists of the Drowned
   Data structures: lists, slices, dicts, sets, tuples
   ============================================================ */
window.QUEST_DB.push(

/* ---------------- py09 : Relics of the Drowned ---------------- */
{
  id: "py09", act: 3, title: "Relics of the Drowned", npc: "nyra", map: "ruins",
  intro: [
    "Welcome to the library at the end of the world. Mind the puddles — some of them are load-bearing.",
    "The First Kingdom kept lists of *everything*: relics, debts, kings, regrets. The Drowned Acolytes you see shambling about? Librarians, once. They guard the catalogues still.",
    "Retire <b>5 Drowned Acolytes</b> west of the channel, and I will teach you the kingdom's greatest invention: the <b>list</b>."
  ],
  acceptLabel: "Show me the catalogues.",
  midDialogue: "The acolytes still patrol the west stacks. Overdue, all of them.",
  returnDialogue: [
    "The stacks are quiet. Now — the real work.",
    "A crate of recovered relics needs cataloguing. Show me you can read a list end to end, and add to it without smudging."
  ],
  doneDialogue: "Catalogued, indexed, immortal. You'd have made a fine librarian in a less interesting age.",
  lesson: {
    title: "The Catalogue — Lists",
    body: [
      "A **list** holds many values in order, in square brackets:",
      ">>>relics = [\"Crown Shard\", \"Old Coin\", \"Mask\"]\nprint(len(relics))   # 3 - len counts items",
      "Each item has an **index** — its shelf number — starting at **0**:",
      ">>>print(relics[0])    # Crown Shard - the FIRST item\nprint(relics[2])    # Mask\nprint(relics[-1])   # Mask - negative counts from the END",
      "`.append(x)` adds to the end; assignment replaces a shelf:",
      ">>>relics.append(\"Sigil\")    # now 4 items\nrelics[0] = \"Repaired Crown\"  # replaces the first",
      "And a for loop visits every item, in order:",
      ">>>for r in relics:\n    print(\"Catalogued:\", r)",
      "Reading past the end (`relics[99]`) angers the archive: **IndexError**."
    ],
    fragments: [
      "**Fragment I** — `[a, b, c]` builds a list; `len(lst)` counts it. Lists keep their order — the archive never shuffles.",
      "**Fragment II** — Indexes start at **0**: `lst[0]` is the first item. Negatives read from the end: `lst[-1]` is the last.",
      "**Fragment III** — `lst.append(x)` adds to the end. `lst[i] = x` replaces shelf i. The list grows and changes in place.",
      "**Fragment IV** — `for item in lst:` walks the whole list in order, no indexes needed.",
      "**Fragment V** — `print(\"a\", \"b\")` with a comma prints them space-separated: `a b`. Handy for labels: `print(\"Found:\", relic)`."
    ]
  },
  kills: { enemy: "drowned_acolyte", count: 5 },
  questions: [
    { type: "output", q: "Which shelf is first?", code: "lst = [3, 5, 7]\nprint(lst[0])",
      answer: "3", why: "Index 0 is the FIRST item: 3." },
    { type: "mc", q: "How do you read the LAST item of any list?",
      choices: ["lst[-1]", "lst[last]", "lst[end]", "lst[1]"],
      answer: 0, why: "Negative indexes count from the end; -1 is the last item." },
    { type: "output", q: "The catalogue grows:", code: "lst = [\"a\", \"b\"]\nlst.append(\"c\")\nprint(len(lst))",
      answer: "3", why: "append adds one item; the list now holds a, b, c." },
    { type: "fill", q: "Fill the blank to add a relic to the end:", code: "relics.____(\"gem\")",
      answer: "append", why: ".append(x) adds x to the end of the list." },
    { type: "output", q: "Replacing a shelf (note how Python prints a list):", code: "lst = [1, 2, 3]\nlst[1] = 9\nprint(lst)",
      answer: "[1, 9, 3]", why: "Index 1 is the SECOND item. Python prints lists as [1, 9, 3] — brackets, commas, spaces." },
    { type: "mc", q: "lst = [10, 20, 30]. What does lst[3] do?",
      choices: ["Raises an IndexError", "Returns 30", "Returns nothing", "Adds a shelf"],
      answer: 0, why: "Indexes are 0,1,2 — there is no shelf 3. Python raises IndexError." },
    { type: "output", q: "Walking the stacks:", code: "for x in [2, 4]:\n    print(x * 2)",
      answer: "4\n8", why: "The loop visits 2 then 4, doubling each." },
    { type: "tf", q: "True or False — `lst[1]` reads the FIRST item of a list.",
      answer: false, why: "Shelves start at 0: lst[0] is the first item, lst[1] is the second." }
  ],
  challenge: {
    title: "Catalogue the Crate",
    story: "Nyra pries open a dripping crate. \"Count them, read me the first and the last, add the Flame Sigil we found, then read the full catalogue aloud. Standard intake.\"",
    prompt: [
      "You are **given** `relics` (a list of strings, never empty).",
      "Do these steps in order:",
      "1. Print how many relics there are.",
      "2. Print the first relic.",
      "3. Print the last relic (use a negative index!).",
      "4. Append `\"Flame Sigil\"` to the list.",
      "5. Loop over the list and print `Catalogued: X` for each relic (use `print(\"Catalogued:\", r)`).",
      ">>>2\nCrown Shard\nOld Coin\nCatalogued: Crown Shard\nCatalogued: Old Coin\nCatalogued: Flame Sigil",
      "(Example for relics = [\"Crown Shard\", \"Old Coin\"].)"
    ],
    mode: "program",
    given: "relics",
    starter: "# relics (a list of strings) is given.\n# 1) count  2) first  3) last  4) append \"Flame Sigil\"  5) loop: Catalogued: X\n\n",
    tests: [
      { setup: "relics = [\"Crown Shard\", \"Old Coin\"]", expectOut: "2\nCrown Shard\nOld Coin\nCatalogued: Crown Shard\nCatalogued: Old Coin\nCatalogued: Flame Sigil", label: "two relics" },
      { setup: "relics = [\"Mask\", \"Urn\", \"Bell\"]", expectOut: "3\nMask\nBell\nCatalogued: Mask\nCatalogued: Urn\nCatalogued: Bell\nCatalogued: Flame Sigil", label: "three relics" }
    ],
    hints: [
      "Steps 1-3: print(len(relics)), print(relics[0]), print(relics[-1])",
      "Append BEFORE the loop, so the Flame Sigil is catalogued too.",
      "Full answer:\nprint(len(relics))\nprint(relics[0])\nprint(relics[-1])\nrelics.append(\"Flame Sigil\")\nfor r in relics:\n    print(\"Catalogued:\", r)"
    ],
    explain: "Order mattered: count and read FIRST (the crate held 2 then), append BEFORE the loop (so the Flame Sigil gets catalogued too). `relics[0]` and `relics[-1]` read the two ends — negative indexes count backward — and the for loop walks the shelves in order without ever touching an index."
  },
  rewards: { xp: 200, coins: 60, items: [["flamewater_flask", 2]] }
},

/* ---------------- py10 : Shards and Slices ---------------- */
{
  id: "py10", act: 3, title: "Shards and Slices", npc: "nyra", map: "ruins",
  intro: [
    "Back so soon? Good. The Bone Crawlers in the east halls have been chewing the archive's measurements — depth markers, weight tallies, all of it.",
    "Crack <b>5 Bone Crawlers</b>, and I'll teach you the surveyor's tools: slicing a list cleanly, summing it, and finding its extremes.",
    "A list you cannot measure is just expensive clutter."
  ],
  acceptLabel: "I'll fetch my boots.",
  midDialogue: "Crawlers still skitter in the east halls. I can hear them doing arithmetic. Badly.",
  returnDialogue: [
    "Crunchy work, but somebody must. The measurements are safe.",
    "Final intake: the depth survey of the flooded vault. Measure it every way the archive demands."
  ],
  doneDialogue: "Sum, peak, floor, slice — measured like a master surveyor. The archive approves, and the archive approves of very little.",
  lesson: {
    title: "The Surveyor's Tools — Slices, in, sum/min/max",
    body: [
      "A **slice** cuts a copy of part of a list: `lst[start:stop]` — stops *before* stop, like range:",
      ">>>depths = [5, 13, 2, 8, 21]\nprint(depths[1:3])   # [13, 2]  - items 1 and 2\nprint(depths[:3])    # [5, 13, 2] - the first three\nprint(depths[2:])    # [2, 8, 21] - from item 2 to the end",
      "The `in` operator asks if something is present — a True/False question:",
      ">>>print(13 in depths)    # True\nprint(99 in depths)    # False",
      "Python measures lists natively:",
      ">>>print(sum(depths))   # 49 - total\nprint(max(depths))   # 21 - the peak\nprint(min(depths))   # 2  - the floor\nprint(depths.count(8))  # 1 - how many times 8 appears",
      "Strings slice too — they are lists of characters at heart: `\"kingdom\"[0:4]` is `\"king\"`."
    ],
    fragments: [
      "**Fragment I** — `lst[1:3]` copies items 1 and 2 — start included, stop excluded. The slice is a NEW list.",
      "**Fragment II** — `lst[:3]` means 'the first three'. `lst[3:]` means 'from index 3 to the end'. An empty side means 'from the edge'.",
      "**Fragment III** — `x in lst` answers True/False. Works on strings too: `\"king\" in \"kingdom\"` is True.",
      "**Fragment IV** — `sum()`, `max()`, `min()` measure a whole list of numbers in one word. `.count(x)` tallies one value.",
      "**Fragment V** — Strings slice like lists: `\"kingdom\"[0:4]` is `\"king\"`. Index 0 is the first letter."
    ]
  },
  kills: { enemy: "bone_crawler", count: 5 },
  questions: [
    { type: "output", q: "Cut cleanly:", code: "lst = [1, 2, 3, 4, 5]\nprint(lst[1:3])",
      answer: "[2, 3]", why: "Start at index 1 (value 2), stop before index 3: [2, 3]." },
    { type: "output", q: "The total:", code: "print(sum([2, 3, 4]))",
      answer: "9", why: "sum adds every item: 2+3+4 = 9." },
    { type: "mc", q: "What does \"ash\" in [\"ember\", \"ash\"] evaluate to?",
      choices: ["True", "False", "1", "\"ash\""],
      answer: 0, why: "in checks membership: \"ash\" is in the list, so True." },
    { type: "output", q: "The peak:", code: "print(max([3, 9, 1]))",
      answer: "9", why: "max finds the largest value." },
    { type: "output", q: "Strings slice too:", code: "s = \"kingdom\"\nprint(s[0:4])",
      answer: "king", why: "Characters 0,1,2,3 spell king." },
    { type: "mc", q: "What does lst[:2] give you?",
      choices: ["The first two items", "The last two items", "Item 2 only", "Everything but item 2"],
      answer: 0, why: "An empty start means 'from the beginning': items 0 and 1." },
    { type: "output", q: "The tally:", code: "print([1, 2, 2, 3].count(2))",
      answer: "2", why: ".count(2) counts how many 2s: there are two." }
  ],
  challenge: {
    title: "The Depth Survey",
    story: "Nyra unrolls a soggy chart. \"The vault's depth readings. The archive wants the usual five measurements. You know the drill — or you're about to.\"",
    prompt: [
      "You are **given** `depths` (a list of ints, at least three).",
      "Print five lines, in order:",
      "1. The **sum** of all readings.",
      "2. The **deepest** (largest) reading.",
      "3. The **shallowest** (smallest) reading.",
      "4. The **first three** readings, as a list (slice it!).",
      "5. Whether the cursed depth **13** appears: `True` or `False` (use `in`).",
      ">>>49\n21\n2\n[5, 13, 2]\nTrue",
      "(Example for depths = [5, 13, 2, 8, 21].)"
    ],
    mode: "program",
    given: "depths",
    starter: "# depths (a list of ints) is given.\n# Print: sum, max, min, first three (slice), 13 in depths\n\n",
    tests: [
      { setup: "depths = [5, 13, 2, 8, 21]", expectOut: "49\n21\n2\n[5, 13, 2]\nTrue", label: "the flooded vault" },
      { setup: "depths = [4, 4, 4, 9]", expectOut: "21\n9\n4\n[4, 4, 4]\nFalse", label: "the still pool" }
    ],
    hints: [
      "Lines 1-3 are one word each: sum(depths), max(depths), min(depths).",
      "Line 4: print(depths[:3]) — printing a list shows its brackets. Line 5: print(13 in depths).",
      "Full answer:\nprint(sum(depths))\nprint(max(depths))\nprint(min(depths))\nprint(depths[:3])\nprint(13 in depths)"
    ],
    explain: "`sum`, `max` and `min` each measure the whole list in one word — no loop needed. `depths[:3]` slices a COPY of the first three (empty start means 'from the edge'), and `13 in depths` is a True/False question Python answers directly, so printing it prints the verdict."
  },
  rewards: { xp: 220, coins: 65, items: [["ashguard_mail", 1]] }
},

/* ---------------- py10b : Sort the Salvage ---------------- */
{
  id: "py10b", act: 3, title: "Sort the Salvage", npc: "sael", map: "ruins",
  intro: [
    "Mind the silt — it bites. I'm Sael. The tide drags treasure up in heaps, and the heaps are my livelihood.",
    "But silt serpents have fouled my sorting court, and a heap unsorted is just weight. I need a hand that can <i>pick</i> from a pile, keep what's worth keeping, and lay it out in order.",
    "Clear <b>4 Silt Serpents</b> from the court, and I'll teach you to build a list from nothing — gather, filter, and sort."
  ],
  acceptLabel: "I'll sort your salvage.",
  midDialogue: "Serpents still in the silt, tangling my piles. Thin them.",
  returnDialogue: [
    "Better. Now the real skill — not reading a list, but <i>building</i> one.",
    "You start with an empty hand. You walk the heap. You keep what passes, and lay it out in order. That's the whole trade."
  ],
  doneDialogue: "You sort like a tidewife thrice your age. Build, filter, order — the heaps will never master you again.",
  lesson: {
    title: "Building Lists — append, enumerate & sort",
    body: [
      "Start with an **empty list** and grow it with `.append()` — the build pattern:",
      ">>>keep = []                # an empty hand\nfor w in [5, 12, 8, 20]:\n    if w >= 10:\n        keep.append(w)     # keep only the heavy finds\nprint(keep)                # [12, 20]",
      "`enumerate` hands you the **index and the value** together — no manual counter needed:",
      ">>>for i, name in enumerate([\"urn\", \"bell\"]):\n    print(i, name)\n# 0 urn / 1 bell",
      "Start the count somewhere else with a second argument:",
      ">>>for i, name in enumerate([\"urn\", \"bell\"], 1):\n    print(i, name)\n# 1 urn / 2 bell",
      "To order a list, `sorted()` returns a **new** sorted list; `.sort()` reorders the list **in place**:",
      ">>>print(sorted([3, 1, 2]))               # [1, 2, 3]  (a new list)\nprint(sorted([3, 1, 2], reverse=True))  # [3, 2, 1]  (descending)\nnums = [3, 1, 2]\nnums.sort()                              # nums is now [1, 2, 3]",
      "So: an empty list, `.append()` inside a loop, and a final `sorted()` — that's how a heap becomes a catalogue."
    ],
    fragments: [
      "**Fragment I** — The build pattern: `result = []` before the loop, `result.append(x)` inside it. The list grows one item at a time.",
      "**Fragment II** — Filter while you build: guard the append with an `if`. Only what passes the test joins the list.",
      "**Fragment III** — `enumerate(lst)` yields `(index, value)` pairs starting at 0; `enumerate(lst, 1)` starts at 1.",
      "**Fragment IV** — `sorted(lst)` returns a NEW sorted list; `lst.sort()` reorders in place. Add `reverse=True` for largest-first."
    ]
  },
  kills: { enemy: "silt_serpent", count: 4 },
  questions: [
    { type: "output", q: "The build pattern, filtering as it goes:", code: "keep = []\nfor w in [5, 12, 8, 20]:\n    if w >= 10:\n        keep.append(w)\nprint(keep)",
      answer: "[12, 20]", why: "Only 12 and 20 pass w >= 10, so the list builds up to [12, 20]." },
    { type: "output", q: "Index and value together:", code: "for i, c in enumerate([\"a\", \"b\", \"c\"]):\n    print(i, c)",
      answer: "0 a\n1 b\n2 c", why: "enumerate yields (0,'a'), (1,'b'), (2,'c') — index then value." },
    { type: "mc", q: "How do sorted(lst) and lst.sort() differ?",
      choices: ["sorted() returns a NEW list; .sort() reorders in place", "They are identical", "sorted() is only for numbers", ".sort() returns a new list"],
      answer: 0, why: "sorted() leaves the original alone and hands back a new list; .sort() rearranges the list itself and returns None." },
    { type: "output", q: "Largest first:", code: "print(sorted([2, 9, 4], reverse=True))",
      answer: "[9, 4, 2]", why: "reverse=True sorts in descending order." },
    { type: "fill", q: "Fill the blank to add a find to the end of the list:", code: "keep.____(find)",
      answer: "append", why: ".append(x) grows the list by one item at the end." },
    { type: "output", q: "Counting from one:", code: "for i, name in enumerate([\"urn\", \"bell\"], 1):\n    print(i, name)",
      answer: "1 urn\n2 bell", why: "The second argument to enumerate sets the starting index — here, 1." },
    { type: "tf", q: "True or False — `lst.sort()` returns a new sorted list and leaves lst unchanged.",
      answer: false, why: ".sort() reorders lst IN PLACE and returns None. It is sorted() that returns a new list." }
  ],
  challenge: {
    title: "Sort the Salvage",
    story: "Sael upends a dripping net. \"Pick the heavy finds — ten weight or more. Count them, then lay them out in order, lightest to heaviest.\"",
    prompt: [
      "You are **given** `weights` (a list of ints, possibly empty).",
      "Build a new list of only the weights that are **10 or more**. Then print two lines:",
      "1. How many heavy finds there are.",
      "2. The heavy finds as a list, **sorted** lightest to heaviest.",
      ">>>3\n[10, 12, 20]",
      "(Example for weights = [5, 12, 8, 20, 10].)"
    ],
    mode: "program",
    given: "weights",
    starter: "# weights (a list of ints) is given.\n# Build a list of weights >= 10, then print: count, then the sorted list.\n\nheavy = []\n",
    tests: [
      { setup: "weights = [5, 12, 8, 20, 10]", expectOut: "3\n[10, 12, 20]", label: "the heavy net" },
      { setup: "weights = [1, 2, 3]", expectOut: "0\n[]", label: "all too light" },
      { setup: "weights = [30, 10, 30]", expectOut: "3\n[10, 30, 30]", label: "duplicates kept" }
    ],
    hints: [
      "Build with the pattern: for w in weights: if w >= 10: heavy.append(w)",
      "Then: print(len(heavy)) and print(sorted(heavy)).",
      "Full answer:\nheavy = []\nfor w in weights:\n    if w >= 10:\n        heavy.append(w)\nprint(len(heavy))\nprint(sorted(heavy))"
    ],
    explain: "An empty list, an `append` guarded by `if w >= 10`, and the heavy finds gather themselves — the build-and-filter pattern in three lines. `sorted(heavy)` hands back a new list in order without disturbing the gathering, so the count and the catalogue both come out right."
  },
  rewards: { xp: 210, coins: 62, items: [["scroll_of_insight", 2]] }
},

/* ---------------- py11 : Names of the Dead ---------------- */
{
  id: "py11", act: 3, title: "Names of the Dead", npc: "lumen", map: "ruins",
  intro: [
    "Softly, marked one. You stand in the Hall of Accounts, where every soul of the old kingdom is paired with its debt.",
    "The Grave Wisps drifting through the south aisles are unpaired names — keys that lost their values. They ache, and aching things bite.",
    "Lay <b>5 Grave Wisps</b> to rest, and I will teach you the holiest of structures: the <b>dictionary</b> — where every key knows its value."
  ],
  acceptLabel: "I will pair the names.",
  midDialogue: "The wisps still drift unpaired. Listen — you can hear the missing values whistling through them.",
  returnDialogue: [
    "The aisles are still. The names rest.",
    "Now, the Ledger of Souls itself. Show me you can read it, amend it, and recite it — and the dead will trust you with their accounts."
  ],
  doneDialogue: "Every name, every debt, perfectly paired. The dead sleep easier tonight because of you.",
  lesson: {
    title: "The Ledger of Souls — Dictionaries",
    body: [
      "A **dictionary** pairs keys with values, in curly braces:",
      ">>>souls = {\"Bryn\": 3, \"Sora\": 7}\nprint(souls[\"Bryn\"])   # 3 - look up a key, get its value",
      "Add or update with assignment — same motion for both:",
      ">>>souls[\"Maren\"] = 0   # new pair added\nsouls[\"Bryn\"] = 4     # existing value replaced",
      "Asking for a missing key raises **KeyError**. The safe prayer is `.get`, which returns a default instead:",
      ">>>print(souls.get(\"Unknown\", \"unjudged\"))   # unjudged - no error",
      "`in` checks the **keys**; `len` counts the pairs:",
      ">>>print(\"Bryn\" in souls)   # True\nprint(len(souls))        # 3",
      "And `.items()` walks the pairs, two loop variables at once:",
      ">>>for name, debt in souls.items():\n    print(f\"{name} owes {debt}\")",
      "Dictionaries remember their insertion order — the ledger reads back as it was written."
    ],
    fragments: [
      "**Fragment I** — `{\"key\": value}` builds the ledger; `d[\"key\"]` reads one entry. Keys are usually strings; values are anything.",
      "**Fragment II** — `d[\"new\"] = x` adds a pair. If the key exists, the old value is replaced. Same syntax for both — the ledger overwrites in silence.",
      "**Fragment III** — `d.get(key, default)` reads safely: missing keys return your default instead of a KeyError.",
      "**Fragment IV** — `key in d` asks if a key exists; `len(d)` counts pairs.",
      "**Fragment V** — `for k, v in d.items():` walks every pair in written order. Two variables, one comma."
    ]
  },
  kills: { enemy: "grave_wisp", count: 5 },
  questions: [
    { type: "output", q: "Read the entry:", code: "d = {\"hp\": 9}\nprint(d[\"hp\"])",
      answer: "9", why: "d[\"hp\"] looks up the key \"hp\" and returns its value." },
    { type: "mc", q: "How do you add the pair mp: 5 to dictionary d?",
      choices: ["d[\"mp\"] = 5", "d.append(\"mp\", 5)", "d + {\"mp\": 5}", "add d[\"mp\"] 5"],
      answer: 0, why: "Assignment with a new key adds the pair. append is for lists." },
    { type: "output", q: "The silent overwrite:", code: "d = {\"a\": 1}\nd[\"a\"] = 2\nprint(d[\"a\"])",
      answer: "2", why: "Assigning to an existing key replaces its value." },
    { type: "mc", q: "d.get(\"x\", 0) when \"x\" is NOT in d returns...",
      choices: ["0", "KeyError", "None always", "\"x\""],
      answer: 0, why: ".get returns the default (0 here) instead of raising KeyError." },
    { type: "output", q: "Checking the keys:", code: "d = {\"ash\": 4, \"oak\": 2}\nprint(\"oak\" in d)",
      answer: "True", why: "in checks the KEYS of a dict: \"oak\" is a key." },
    { type: "fill", q: "Walk the pairs:", code: "for k, v in d.____():\n    print(k, v)",
      answer: "items", why: ".items() yields (key, value) pairs for the loop to unpack." },
    { type: "output", q: "Grow a tally from nothing:", code: "d = {}\nd[\"k\"] = 1\nd[\"k\"] += 1\nprint(d[\"k\"])",
      answer: "2", why: "Start the key at 1, then += grows it to 2. This is the counting pattern!" }
  ],
  challenge: {
    title: "Amend the Ledger",
    story: "Lumen lays the great book before you. \"Count the souls. Pray for the unknown one. Add Maren — she insists on paying nothing, bless her. Then recite the ledger, every name, every debt.\"",
    prompt: [
      "You are **given** `souls` (a dict mapping names to debts).",
      "Do these steps in order:",
      "1. Print how many souls are in the ledger.",
      "2. Print `souls.get(\"Unknown\", \"unjudged\")` — the prayer for the missing.",
      "3. Add the pair `\"Maren\": 0`.",
      "4. Loop with `.items()` and print `NAME owes DEBT` for each pair.",
      ">>>2\nunjudged\nBryn owes 3\nSora owes 7\nMaren owes 0",
      "(Example for souls = {\"Bryn\": 3, \"Sora\": 7}.)"
    ],
    mode: "program",
    given: "souls",
    starter: "# souls (a dict of name -> debt) is given.\n# 1) count  2) the prayer (.get)  3) add Maren: 0  4) recite: NAME owes DEBT\n\n",
    tests: [
      { setup: "souls = {\"Bryn\": 3, \"Sora\": 7}", expectOut: "2\nunjudged\nBryn owes 3\nSora owes 7\nMaren owes 0", label: "two souls" },
      { setup: "souls = {\"Edda\": 1}", expectOut: "1\nunjudged\nEdda owes 1\nMaren owes 0", label: "one soul" }
    ],
    hints: [
      "Step 1 is len(souls) BEFORE adding Maren. Step 3: souls[\"Maren\"] = 0.",
      "The recital: for name, debt in souls.items(): print(f\"{name} owes {debt}\")",
      "Full answer:\nprint(len(souls))\nprint(souls.get(\"Unknown\", \"unjudged\"))\nsouls[\"Maren\"] = 0\nfor name, debt in souls.items():\n    print(f\"{name} owes {debt}\")"
    ],
    explain: "`len` counted the pairs BEFORE Maren joined. `.get` returned your default instead of raising KeyError for the missing soul. Assigning to a new key simply adds the pair, and `.items()` hands the loop both halves of each pair, in the order they were written."
  },
  rewards: { xp: 240, coins: 70, items: [["watchmans_greatsword", 1]] }
},

/* ---------------- py11b : Tally the Hoard ---------------- */
{
  id: "py11b", act: 3, title: "Tally the Hoard", npc: "orin", map: "ruins",
  intro: [
    "You there — marked one. Orin, tallymaster. I read hoards the way Lumen reads souls: by their shape.",
    "The coral golems out east have grown <i>over</i> the king's hoard — accreting relics into their shells until no one can say what's there or how much. A ledger you cannot total is no ledger at all.",
    "Break <b>4 Coral Golems</b> and free the count, and I'll teach you to read a whole ledger at once: its total, its kinds, and which entries truly matter."
  ],
  acceptLabel: "I'll free the count.",
  midDialogue: "Golems still hoarding the relics in their shells. Crack them open.",
  returnDialogue: [
    "Good. Now — a dictionary is a ledger, and a ledger has a shape.",
    "How much, in total? How many kinds? Which entries clear the bar? Read all three from the pairs, and the hoard holds no more secrets."
  ],
  doneDialogue: "You total a hoard at a glance now. The dead kept careful books — and so, it seems, do you.",
  lesson: {
    title: "Reading the Ledger — Dictionary Aggregation",
    body: [
      "A dictionary's halves come apart with `.keys()`, `.values()`, and `.items()`:",
      ">>>hoard = {\"coin\": 3, \"mask\": 1, \"urn\": 2}\nprint(list(hoard.keys()))     # ['coin', 'mask', 'urn']\nprint(list(hoard.values()))   # [3, 1, 2]",
      "Aggregate the values to read the hoard's **shape**:",
      ">>>print(sum(hoard.values()))   # 6  - the grand total\nprint(len(hoard))             # 3  - how many KINDS",
      "Walk the pairs to **filter** — report only the entries that matter:",
      ">>>for name, count in hoard.items():\n    if count >= 2:\n        print(name, count)\n# coin 3 / urn 2   (mask, with 1, is skipped)",
      "The values are just a list of numbers, so every list tool fits: `max(hoard.values())` is the largest count, `min(...)` the smallest.",
      "Remember: `in` and iteration walk the **keys** by default — `for k in hoard:` is the same as `for k in hoard.keys()`."
    ],
    fragments: [
      "**Fragment I** — `.keys()` gives the keys, `.values()` the values, `.items()` the (key, value) pairs. Wrap in `list(...)` to see them as a list.",
      "**Fragment II** — `sum(d.values())` totals the values; `len(d)` counts the pairs (the number of kinds).",
      "**Fragment III** — Filter while you walk: `for k, v in d.items(): if v >= 2: ...` reports only the entries that clear the bar.",
      "**Fragment IV** — The values are a list of numbers — `max(d.values())` and `min(d.values())` measure them like any list."
    ]
  },
  kills: { enemy: "coral_golem", count: 4 },
  questions: [
    { type: "output", q: "The grand total:", code: "d = {\"a\": 2, \"b\": 5}\nprint(sum(d.values()))",
      answer: "7", why: "sum(d.values()) adds every value: 2 + 5 = 7." },
    { type: "output", q: "How many kinds?", code: "d = {\"a\": 2, \"b\": 5, \"c\": 1}\nprint(len(d))",
      answer: "3", why: "len(d) counts the pairs — three kinds." },
    { type: "mc", q: "What does d.values() give you?",
      choices: ["just the values", "just the keys", "the (key, value) pairs", "the number of pairs"],
      answer: 0, why: ".values() yields the values alone; .keys() the keys; .items() the pairs." },
    { type: "output", q: "Filter as you walk:", code: "d = {\"x\": 1, \"y\": 4}\nfor k, v in d.items():\n    if v >= 2:\n        print(k, v)",
      answer: "y 4", why: "Only y clears v >= 2; x (value 1) is skipped." },
    { type: "fill", q: "Fill the blank to total a dict's values:", code: "total = sum(d.______())",
      answer: "values", why: "d.values() yields the values; sum() totals them." },
    { type: "output", q: "Largest count:", code: "d = {\"a\": 3, \"b\": 9, \"c\": 5}\nprint(max(d.values()))",
      answer: "9", why: "The values are 3, 9, 5; max picks 9." },
    { type: "tf", q: "True or False — `for k in d:` walks the dictionary's keys.",
      answer: true, why: "Iterating a dict directly walks its keys — the same as for k in d.keys()." }
  ],
  challenge: {
    title: "Tally the Hoard",
    story: "Orin spreads the freed ledger. \"Total it. Count its kinds. Then read me the entries that truly matter — two or more of a thing.\"",
    prompt: [
      "You are **given** `hoard` (a dict mapping relic names to counts).",
      "Print, in order:",
      "1. The **total** of all counts (`sum` the values).",
      "2. The number of **distinct kinds** (`len`).",
      "3. For each entry with a count of **2 or more**, in ledger order, print `name: count`.",
      ">>>6\n3\ncoin: 3\nurn: 2",
      "(Example for hoard = {\"coin\": 3, \"mask\": 1, \"urn\": 2}.)"
    ],
    mode: "program",
    given: "hoard",
    starter: "# hoard (a dict of name -> count) is given.\n# 1) total = sum of values  2) number of kinds  3) entries with count >= 2: name: count\n\n",
    tests: [
      { setup: "hoard = {\"coin\": 3, \"mask\": 1, \"urn\": 2}", expectOut: "6\n3\ncoin: 3\nurn: 2", label: "the king's hoard" },
      { setup: "hoard = {\"gem\": 5}", expectOut: "5\n1\ngem: 5", label: "a single kind" },
      { setup: "hoard = {\"a\": 1, \"b\": 1}", expectOut: "2\n2", label: "nothing clears the bar" }
    ],
    hints: [
      "Line 1: print(sum(hoard.values())). Line 2: print(len(hoard)).",
      "Lines 3+: for name, count in hoard.items(): if count >= 2: print(f\"{name}: {count}\")",
      "Full answer:\nprint(sum(hoard.values()))\nprint(len(hoard))\nfor name, count in hoard.items():\n    if count >= 2:\n        print(f\"{name}: {count}\")"
    ],
    explain: "`sum(hoard.values())` totals the counts and `len(hoard)` counts the kinds — the hoard's whole shape in two words. Then `.items()` walks the pairs in ledger order, and the `if count >= 2` guard reports only the entries that matter, skipping the lonely singletons."
  },
  rewards: { xp: 230, coins: 68, items: [["soldiers_sabre", 1]] }
},

/* ---------------- py12 : The Unrepeatable Rite ---------------- */
{
  id: "py12", act: 3, title: "The Unrepeatable Rite", npc: "lumen", map: "ruins",
  intro: [
    "One more service, marked one. The Cursed Scarabs in the outer halls — they multiply by *copying*. Each carries a sigil, and most are duplicates. Forgeries of being.",
    "The rite that banishes them tolerates no repetition: each sigil may be spoken **once**. Only once.",
    "Crush <b>5 Cursed Scarabs</b>, and learn the structure that cannot repeat itself: the <b>set</b>."
  ],
  acceptLabel: "Once, and only once.",
  midDialogue: "The scarabs still copy themselves in the outer halls. Vile plagiarists.",
  returnDialogue: [
    "The copying has stopped. The originals rest.",
    "The final rite: a sack of recovered sigils, most of them forgeries. Distill it to the true names and speak them in order."
  ],
  doneDialogue: "No repetition, perfect order. The rite holds. You are ready for what sleeps below — and I am sorry about what sleeps below.",
  lesson: {
    title: "The Unrepeatable — Sets & Tuples",
    body: [
      "A **set** is a bag that refuses duplicates. Build one with braces or by converting a list:",
      ">>>marks = {1, 2, 2, 3}\nprint(len(marks))        # 3 - the duplicate 2 simply vanished\nunique = set([\"a\", \"b\", \"a\"])\nprint(len(unique))       # 2",
      "Sets add with `.add`, and answer `in` very fast:",
      ">>>seen = set()\nseen.add(\"flame\")\nseen.add(\"flame\")    # ignored - already present\nprint(\"flame\" in seen)   # True",
      "The dedupe spell every coder knows: `len(set(lst))` counts unique items in one breath.",
      "Sets have no order. To recite them ceremonially, use `sorted()` — it returns a **sorted list**:",
      ">>>print(sorted({\"oak\", \"ash\"}))   # ['ash', 'oak']",
      "A **tuple** is a list locked shut — parentheses, immutable, perfect for things that must not change:",
      ">>>point = (4, 5)\nprint(point[0])   # 4\npoint[0] = 9      # ERROR - tuples cannot be changed"
    ],
    fragments: [
      "**Fragment I** — Sets hold each value once. `{1, 2, 2, 3}` collapses to three items. Duplicates don't error — they vanish.",
      "**Fragment II** — `set(lst)` converts a list, dropping duplicates. `len(set(lst))` = the count of unique items. Memorize that one.",
      "**Fragment III** — `s.add(x)` inserts; adding twice changes nothing. `x in s` is the set's favorite question, answered instantly.",
      "**Fragment IV** — Sets are unordered. `sorted(anything)` returns an ordered LIST — use it to recite a set predictably.",
      "**Fragment V** — Tuples `(a, b)` are immutable: index them, loop them, but never reassign them. The kingdom sealed its coordinates in tuples."
    ]
  },
  kills: { enemy: "cursed_scarab", count: 5 },
  questions: [
    { type: "output", q: "Where did the duplicate go?", code: "print(len({1, 2, 2, 3}))",
      answer: "3", why: "Sets keep one of each: {1, 2, 3} — three items." },
    { type: "mc", q: "What is special about a set?",
      choices: ["It cannot contain duplicates", "It stays sorted", "It is immutable", "It only holds numbers"],
      answer: 0, why: "Sets hold unique values. (They're also unordered — sorted() fixes that for reciting.)" },
    { type: "output", q: "Adding twice:", code: "s = set()\ns.add(\"x\")\ns.add(\"x\")\nprint(len(s))",
      answer: "1", why: "The second add is ignored: sets refuse repeats." },
    { type: "output", q: "Order from chaos:", code: "print(sorted([3, 1, 2]))",
      answer: "[1, 2, 3]", why: "sorted() returns a new sorted list." },
    { type: "mc", q: "How do tuples differ from lists?",
      choices: ["Tuples cannot be changed after creation", "Tuples are faster to append to", "Tuples hold only two items", "No difference"],
      answer: 0, why: "Tuples are immutable — no append, no item assignment." },
    { type: "output", q: "Reading a sealed pair:", code: "t = (4, 5)\nprint(t[0])",
      answer: "4", why: "Tuples index like lists — they just can't be modified." },
    { type: "mc", q: "The quickest spell to count UNIQUE items in lst?",
      choices: ["len(set(lst))", "len(lst)", "sum(lst)", "lst.count(unique)"],
      answer: 0, why: "Convert to a set (dropping duplicates), then count it." }
  ],
  challenge: {
    title: "Distill the True Sigils",
    story: "Lumen empties the sack: sigils clatter out, most identical. \"Distill them. Count the true names, recite them in order, and tell me if 'flame' walks among them.\"",
    prompt: [
      "You are **given** `sigils` (a list of strings, with duplicates).",
      "Print three lines:",
      "1. The number of **unique** sigils.",
      "2. The unique sigils **sorted**, printed as a list.",
      "3. Whether `\"flame\"` is among them: `True` or `False`.",
      ">>>3\n['ash', 'flame', 'oak']\nTrue",
      "(Example for sigils = [\"ash\", \"flame\", \"ash\", \"oak\", \"flame\"].)"
    ],
    mode: "program",
    given: "sigils",
    starter: "# sigils (a list with duplicates) is given.\n# 1) unique count  2) sorted unique list  3) \"flame\" in it?\n\nunique = set(sigils)\n",
    tests: [
      { setup: "sigils = [\"ash\", \"flame\", \"ash\", \"oak\", \"flame\"]", expectOut: "3\n['ash', 'flame', 'oak']\nTrue", label: "the forged sack" },
      { setup: "sigils = [\"a\", \"a\", \"a\"]", expectOut: "1\n['a']\nFalse", label: "one true name" }
    ],
    hints: [
      "set(sigils) drops the duplicates. len() of that is line 1.",
      "Line 2: print(sorted(unique)) — sorted returns a list, and printing it shows ['like', 'this'].",
      "Full answer:\nunique = set(sigils)\nprint(len(unique))\nprint(sorted(unique))\nprint(\"flame\" in unique)"
    ],
    explain: "`set(sigils)` collapses every duplicate on contact — that's the whole distillation. Sets keep no order, so `sorted()` turns the survivors into a recitable list, and `in` asks the set its favorite question: instant membership, True or False."
  },
  rewards: { xp: 260, coins: 75, items: [["scribes_talisman", 1]] }
},

/* ---------------- py13 : BOSS — The Drowned King ---------------- */
{
  id: "py13", act: 3, title: "The Drowned King", npc: "nyra", map: "ruins", boss: true,
  bossEnemy: "boss_drowned_king", bossSpot: { map: "ruins", x: 53, y: 11 },
  intro: [
    "It's awake. The throne room lights are burning blue and the water is flowing *upward*. The Drowned King has risen, and he is taking inventory.",
    "He was the kingdom's treasurer once — drowned in his own vault, counting as the water rose. He will not rest until someone proves the count can be done *right*.",
    "Take everything the archive taught you — lists, dictionaries, the tally pattern — and face him at the <b>flooded throne</b>, northeast."
  ],
  acceptLabel: "I will settle his accounts.",
  midDialogue: "He counts coins in the throne room. The same coins. Over and over. End it.",
  returnDialogue: ["The Drowned King waits at his flooded throne, northeast of here."],
  doneDialogue: "The water flows downward again. He left his hoard — and a path to Kingsfall Citadel. The capital, marked one. What's left of it.",
  lesson: {
    title: "Trial of the Drowned (Recap)",
    body: [
      "The Drowned King demands a full audit. You will need:",
      ">>>counts = {}                      # an empty ledger\nfor item in items:               # walk the list\n    counts[item] = counts.get(item, 0) + 1   # the TALLY pattern",
      "That one line is the heart of it: `.get(item, 0)` reads the current tally (0 if new), `+ 1` adds this sighting, and the assignment writes it back.",
      "Then find the largest: walk `.items()` keeping the best so far:",
      ">>>best = None\nfor k, v in counts.items():\n    if best is None or v > counts[best]:\n        best = k"
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The King gurgles: 'Begin the tally.'", code: "counts = {}\ncounts[\"coin\"] = counts.get(\"coin\", 0) + 1\ncounts[\"coin\"] = counts.get(\"coin\", 0) + 1\nprint(counts[\"coin\"])",
      answer: "2", why: "First .get returns 0 (+1 = 1), second returns 1 (+1 = 2). The tally pattern." },
    { type: "mc", q: "'Why .get(item, 0) and not counts[item]?'",
      choices: ["A missing key would raise KeyError; .get returns 0 instead", "It is faster", "It sorts the dict", "It prevents duplicates"],
      answer: 0, why: "The first time you see an item, it has no entry yet — .get supplies the 0 to start from." },
    { type: "output", q: "'Audit my hoard.'", code: "hoard = [\"coin\", \"mask\", \"coin\"]\nprint(hoard.count(\"coin\"))",
      answer: "2", why: ".count tallies one value in a list: two coins." },
    { type: "output", q: "'Walk my ledger in written order.'", code: "d = {\"urn\": 2, \"bell\": 5}\nfor k, v in d.items():\n    print(k, v)",
      answer: "urn 2\nbell 5", why: "Dicts keep insertion order; .items() yields each pair." }
  ],
  challenge: {
    title: "The Final Audit",
    story: "The Drowned King spreads his waterlogged hoard before you. \"COUNT,\" the water roars. \"Find what I hoarded most, and how many. Get it right, and I will finally rest.\"",
    prompt: [
      "You are **given** `relics` (a list of strings, never empty). One relic name appears **strictly more often** than any other.",
      "Print two lines:",
      "1. The most common relic's name.",
      "2. How many times it appears.",
      ">>>coin\n3",
      "(Example for relics = [\"coin\", \"crown\", \"coin\", \"mask\", \"coin\"].)",
      "Build a tally dict with the `.get` pattern, then find the key with the highest count."
    ],
    mode: "program",
    given: "relics",
    starter: "# relics (a list of strings) is given.\n# 1) tally each name in a dict\n# 2) find the name with the highest tally; print name, then count\n\ncounts = {}\nfor r in relics:\n    \n",
    tests: [
      { setup: "relics = [\"coin\", \"crown\", \"coin\", \"mask\", \"coin\"]", expectOut: "coin\n3", label: "the coin hoard" },
      { setup: "relics = [\"urn\", \"urn\", \"mask\"]", expectOut: "urn\n2", label: "the urn pair" },
      { setup: "relics = [\"sigil\"]", expectOut: "sigil\n1", label: "a single relic" }
    ],
    hints: [
      "Tally: counts[r] = counts.get(r, 0) + 1 inside the loop.",
      "Then track the best: best = None; for k, v in counts.items(): if best is None or v > counts[best]: best = k",
      "Full answer:\ncounts = {}\nfor r in relics:\n    counts[r] = counts.get(r, 0) + 1\nbest = None\nfor k, v in counts.items():\n    if best is None or v > counts[best]:\n        best = k\nprint(best)\nprint(counts[best])"
    ],
    explain: "`counts[r] = counts.get(r, 0) + 1` is the tally pattern: .get supplies 0 the first time a relic appears, +1 records the sighting, and the assignment writes it back. The second walk keeps whichever key holds the highest tally — best-so-far, the oldest trick in the audit."
  },
  rewards: { xp: 500, coins: 150, items: [["runic_warblade", 1], ["phoenix_draught", 1]], title: "Tidebreaker", unlocks: "Kingsfall Citadel" }
}
);
