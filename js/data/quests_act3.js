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
  bossEnemy: "boss_drowned_king", bossSpot: { map: "ruins", x: 39, y: 9 },
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
