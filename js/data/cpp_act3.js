/* ============================================================
   ACT III — THE SUNKEN RUINS: Lists of the Drowned  (C++ Chronicle)
   Containers: std::vector, measuring, unordered_map, set
   ============================================================ */
window.QUEST_DB.push(

/* ---------------- cpp09 : Relics of the Drowned ---------------- */
{
  id: "cpp09", faction: "cpp", act: 3, title: "Relics of the Drowned", npc: "nyra", map: "ruins",
  intro: [
    "Welcome to the library at the end of the world. Mind the puddles — some of them are load-bearing.",
    "The First Kingdom kept lists of *everything*. The Drowned Acolytes you see shambling about? Librarians, once. They guard the catalogues still.",
    "Retire <b>5 Drowned Acolytes</b> west of the channel, and I will teach you the smith's growable list: the <b>vector</b>."
  ],
  acceptLabel: "Show me the catalogues.",
  midDialogue: "The acolytes still patrol the west stacks. Overdue, all of them.",
  returnDialogue: [
    "The stacks are quiet. Now — the real work.",
    "A crate of recovered relics needs cataloguing. Show me you can read a vector end to end, and grow it without smudging."
  ],
  doneDialogue: "Catalogued, indexed, immortal. You'd have made a fine librarian in a less interesting age.",
  lesson: {
    title: "The Catalogue — std::vector",
    body: [
      "A **vector** holds many values in order — a list that can grow. Summon it with `#include <vector>`:",
      ">>>vector<string> relics = {\"Crown Shard\", \"Old Coin\", \"Mask\"};\ncout << relics.size();   // 3 - .size() counts items",
      "The `<string>` inside `vector<string>` is the **type** of each item. Each item has an **index** — its shelf number — starting at **0**:",
      ">>>cout << relics[0];        // Crown Shard - the FIRST item\ncout << relics[2];        // Mask\ncout << relics.front();   // Crown Shard - the first\ncout << relics.back();    // Mask - the last",
      "`.push_back(x)` adds to the end; assignment replaces a shelf:",
      ">>>relics.push_back(\"Sigil\");    // now 4 items\nrelics[0] = \"Repaired Crown\";   // replaces the first",
      "A **range-for** visits every item in order — read each with a reference to avoid copying:",
      ">>>for (const string &r : relics) {\n    cout << \"Catalogued: \" << r << \"\\n\";\n}",
      "Reading past the end (`relics[99]`) is undefined — the archive's oldest curse. Stay in bounds."
    ],
    fragments: [
      "**Fragment I** — `vector<string> v = {a, b, c};` builds a growable list; `v.size()` counts it. The `<string>` names the item type.",
      "**Fragment II** — Indexes start at **0**: `v[0]` is the first. `v.front()` and `v.back()` grab the first and last directly.",
      "**Fragment III** — `v.push_back(x)` adds to the end. `v[i] = x` replaces shelf i. The vector grows and changes in place.",
      "**Fragment IV** — `for (const string &r : v)` walks every item in order. The `&` reads each without copying; `const` promises not to change it."
    ]
  },
  kills: { enemy: "drowned_acolyte", count: 5 },
  questions: [
    { type: "output", q: "Which shelf is first?", code: "vector<int> v = {3, 5, 7};\ncout << v[0];",
      answer: "3", why: "Index 0 is the FIRST item: 3." },
    { type: "mc", q: "How do you read the LAST item of a vector v?",
      choices: ["v.back()", "v.last()", "v.end()", "v[1]"],
      answer: 0, why: ".back() returns the last item; .front() the first. (.end() is one PAST the last.)" },
    { type: "output", q: "The catalogue grows:", code: "vector<int> v = {1, 2};\nv.push_back(3);\ncout << v.size();",
      answer: "3", why: "push_back adds one item; the vector now holds 1, 2, 3." },
    { type: "fill", q: "Fill the blank to add a relic to the end:", code: "relics.____(\"gem\");",
      answer: "push_back", why: ".push_back(x) appends x to the end of the vector." },
    { type: "output", q: "Replacing a shelf:", code: "vector<int> v = {1, 2, 3};\nv[1] = 9;\ncout << v[0] << v[1] << v[2];",
      answer: "193", why: "Index 1 is the SECOND item; it becomes 9. Printed with no spaces: 193." },
    { type: "mc", q: "What type does vector<int> hold?",
      choices: ["Integers", "Strings", "Anything at all", "Only 0 and 1"],
      answer: 0, why: "The angle brackets name the item type: vector<int> holds ints." },
    { type: "output", q: "Walking the stacks:", code: "vector<int> v = {2, 4};\nfor (int x : v) cout << x * 2 << \"\\n\";",
      answer: "4\n8", why: "The range-for visits 2 then 4, doubling each." }
  ],
  challenge: {
    title: "Catalogue the Crate",
    story: "Nyra pries open a dripping crate. \"Count them, read me the first and the last, add the Flame Sigil we found, then read the full catalogue aloud. Standard intake.\"",
    prompt: [
      "Input: line 1 is an integer `m`; the next `m` lines are relic names (each may contain spaces). The starter reads them into a `vector<string>`.",
      "Do these steps in order:",
      "1. Print how many relics there are.",
      "2. Print the first relic.",
      "3. Print the last relic.",
      "4. Add `\"Flame Sigil\"` to the end.",
      "5. Loop over the vector and print `Catalogued: X` for each relic.",
      ">>>2\nCrown Shard\nOld Coin\nCatalogued: Crown Shard\nCatalogued: Old Coin\nCatalogued: Flame Sigil",
      "(Example for relics = Crown Shard, Old Coin.)"
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint main() {\n    int m;\n    cin >> m;\n    cin.ignore();\n    vector<string> relics(m);\n    for (int i = 0; i < m; i++) getline(cin, relics[i]);\n    // 1) count  2) first  3) last  4) push_back \"Flame Sigil\"  5) loop: Catalogued: X\n\n    return 0;\n}\n",
    tests: [
      { stdin: "2\nCrown Shard\nOld Coin", expectOut: "2\nCrown Shard\nOld Coin\nCatalogued: Crown Shard\nCatalogued: Old Coin\nCatalogued: Flame Sigil", label: "two relics" },
      { stdin: "3\nMask\nUrn\nBell", expectOut: "3\nMask\nBell\nCatalogued: Mask\nCatalogued: Urn\nCatalogued: Bell\nCatalogued: Flame Sigil", label: "three relics" }
    ],
    hints: [
      "Steps 1-3: cout << relics.size(); then relics.front(); then relics.back(); (each followed by \\n).",
      "push_back BEFORE the loop, so the Flame Sigil is catalogued too.",
      "Full answer:\n#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint main() {\n    int m;\n    cin >> m;\n    cin.ignore();\n    vector<string> relics(m);\n    for (int i = 0; i < m; i++) getline(cin, relics[i]);\n    cout << relics.size() << \"\\n\";\n    cout << relics.front() << \"\\n\";\n    cout << relics.back() << \"\\n\";\n    relics.push_back(\"Flame Sigil\");\n    for (const string &r : relics) cout << \"Catalogued: \" << r << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 200, coins: 60, items: [["flamewater_flask", 2]] }
},

/* ---------------- cpp10 : Shards and Measures ---------------- */
{
  id: "cpp10", faction: "cpp", act: 3, title: "Shards and Measures", npc: "nyra", map: "ruins",
  intro: [
    "Back so soon? Good. The Bone Crawlers in the east halls have been chewing the archive's measurements — depth markers, weight tallies, all of it.",
    "Crack <b>5 Bone Crawlers</b>, and I'll teach you the surveyor's tools: summing a vector, finding its extremes, and asking whether a value is present.",
    "A list you cannot measure is just expensive clutter."
  ],
  acceptLabel: "I'll fetch my boots.",
  midDialogue: "Crawlers still skitter in the east halls. I can hear them doing arithmetic. Badly.",
  returnDialogue: [
    "Crunchy work, but somebody must. The measurements are safe.",
    "Final intake: the depth survey of the flooded vault. Measure it every way the archive demands."
  ],
  doneDialogue: "Sum, peak, floor, presence — measured like a master surveyor. The archive approves, and the archive approves of very little.",
  lesson: {
    title: "The Surveyor's Tools — Measuring a Vector",
    body: [
      "A vector of numbers can be measured whole. The sum comes from `#include <numeric>`:",
      ">>>vector<int> depths = {5, 13, 2, 8, 21};\ncout << accumulate(depths.begin(), depths.end(), 0);   // 49 - the sum",
      "Those `.begin()` and `.end()` mark the start and just-past-the-end of the range — most C++ tools take a pair like this.",
      "Find the extremes with `max_element` / `min_element` (from `#include <algorithm>`). They return a *pointer* to the item, so read it with a `*`:",
      ">>>cout << *max_element(depths.begin(), depths.end());   // 21 - the peak\ncout << *min_element(depths.begin(), depths.end());   // 2  - the floor",
      "Ask 'is it present?' with `find` — it returns `.end()` when the value is missing:",
      ">>>bool has13 = find(depths.begin(), depths.end(), 13) != depths.end();\ncout << has13;   // 1 (true)",
      "Index directly when you know the spot: `depths[0]`, `depths[1]`, `depths[2]` are the first three readings."
    ],
    fragments: [
      "**Fragment I** — Most tools take a range `(v.begin(), v.end())`. `accumulate(v.begin(), v.end(), 0)` sums it, starting from 0.",
      "**Fragment II** — `max_element` / `min_element` return a pointer; read the value with `*`: `*max_element(v.begin(), v.end())`.",
      "**Fragment III** — `find(v.begin(), v.end(), x)` returns `v.end()` when x is absent. So `find(...) != v.end()` means 'present'.",
      "**Fragment IV** — `#include <numeric>` for accumulate; `#include <algorithm>` for max_element / min_element / find. Index with `v[i]` when the spot is known."
    ]
  },
  kills: { enemy: "bone_crawler", count: 5 },
  questions: [
    { type: "output", q: "The total:", code: "vector<int> v = {2, 3, 4};\ncout << accumulate(v.begin(), v.end(), 0);",
      answer: "9", why: "accumulate sums the range starting from 0: 2+3+4 = 9." },
    { type: "mc", q: "What does max_element return?",
      choices: ["A pointer to the largest item (read it with *)", "The largest value directly", "The index of the largest", "A sorted vector"],
      answer: 0, why: "It returns an iterator/pointer; dereference with * to get the value." },
    { type: "output", q: "The peak:", code: "vector<int> v = {3, 9, 1};\ncout << *max_element(v.begin(), v.end());",
      answer: "9", why: "max_element points at 9; * reads the value." },
    { type: "mc", q: "find(v.begin(), v.end(), x) returns v.end() when...",
      choices: ["x is NOT in the vector", "x IS in the vector", "the vector is sorted", "x is zero"],
      answer: 0, why: "find returns end() to mean 'not found'." },
    { type: "output", q: "The first three, by index:", code: "vector<int> v = {5, 13, 2, 8};\ncout << v[0] << \" \" << v[1] << \" \" << v[2];",
      answer: "5 13 2", why: "Indexes 0, 1, 2 are the first three: 5 13 2." },
    { type: "fill", q: "Fill the blank to sum the vector:", code: "int total = ____(v.begin(), v.end(), 0);",
      answer: "accumulate", why: "accumulate adds the range to a starting value (0)." },
    { type: "mc", q: "Which header gives you accumulate?",
      choices: ["<numeric>", "<algorithm>", "<vector>", "<string>"],
      answer: 0, why: "accumulate lives in <numeric>; find/sort/max_element live in <algorithm>." }
  ],
  challenge: {
    title: "The Depth Survey",
    story: "Nyra unrolls a soggy chart. \"The vault's depth readings. The archive wants the usual five measurements. You know the drill — or you're about to.\"",
    prompt: [
      "Input: line 1 is `n`; line 2 is `n` integers (at least three) — the depth readings. The starter reads them.",
      "Print five lines, in order:",
      "1. The **sum** of all readings.",
      "2. The **deepest** (largest) reading.",
      "3. The **shallowest** (smallest) reading.",
      "4. The **first three** readings, space-separated.",
      "5. `yes` if the cursed depth **13** appears, else `no`.",
      ">>>49\n21\n2\n5 13 2\nyes",
      "(Example for depths = 5 13 2 8 21.)"
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> depths(n);\n    for (int i = 0; i < n; i++) cin >> depths[i];\n    // 1) sum  2) max  3) min  4) first three (space-separated)  5) yes/no for 13\n\n    return 0;\n}\n",
    tests: [
      { stdin: "5\n5 13 2 8 21", expectOut: "49\n21\n2\n5 13 2\nyes", label: "the flooded vault" },
      { stdin: "4\n4 4 4 9", expectOut: "21\n9\n4\n4 4 4\nno", label: "the still pool" }
    ],
    hints: [
      "Lines 1-3: accumulate(depths.begin(), depths.end(), 0), then *max_element(...), then *min_element(...).",
      "Line 4: cout << depths[0] << \" \" << depths[1] << \" \" << depths[2] << \"\\n\"; Line 5: find(...) != depths.end() ? \"yes\" : \"no\".",
      "Full answer:\n#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> depths(n);\n    for (int i = 0; i < n; i++) cin >> depths[i];\n    cout << accumulate(depths.begin(), depths.end(), 0) << \"\\n\";\n    cout << *max_element(depths.begin(), depths.end()) << \"\\n\";\n    cout << *min_element(depths.begin(), depths.end()) << \"\\n\";\n    cout << depths[0] << \" \" << depths[1] << \" \" << depths[2] << \"\\n\";\n    bool has13 = find(depths.begin(), depths.end(), 13) != depths.end();\n    cout << (has13 ? \"yes\" : \"no\") << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 220, coins: 65, items: [["ashguard_mail", 1]] }
},

/* ---------------- cpp11 : Names of the Dead ---------------- */
{
  id: "cpp11", faction: "cpp", act: 3, title: "Names of the Dead", npc: "lumen", map: "ruins",
  intro: [
    "Softly, marked one. You stand in the Hall of Accounts, where every soul of the old kingdom is paired with its debt.",
    "The Grave Wisps drifting through the south aisles are unpaired names — keys that lost their values. They ache, and aching things bite.",
    "Lay <b>5 Grave Wisps</b> to rest, and I will teach you the structure that pairs every key with its value: the <b>unordered_map</b>."
  ],
  acceptLabel: "I will pair the names.",
  midDialogue: "The wisps still drift unpaired. Listen — you can hear the missing values whistling through them.",
  returnDialogue: [
    "The aisles are still. The names rest.",
    "Now, the Ledger of Souls itself. Show me you can read it and answer for any name asked — and the dead will trust you with their accounts."
  ],
  doneDialogue: "Every name, every debt, perfectly paired. The dead sleep easier tonight because of you.",
  lesson: {
    title: "The Ledger of Souls — unordered_map",
    body: [
      "An **unordered_map** pairs keys with values — the C++ dictionary. From `#include <unordered_map>`:",
      ">>>unordered_map<string, int> souls;\nsouls[\"Bryn\"] = 3;\nsouls[\"Sora\"] = 7;\ncout << souls[\"Bryn\"];   // 3 - look up a key, get its value",
      "The `<string, int>` names the **key** type and the **value** type. Add or update with assignment — same motion for both:",
      ">>>souls[\"Maren\"] = 0;   // new pair added\nsouls[\"Bryn\"] = 4;     // existing value replaced",
      "Beware: reading a *missing* key with `[]` silently **creates** it (value 0). To ask safely whether a key exists, use `.count` — 1 if present, 0 if not:",
      ">>>if (souls.count(\"Maren\")) {\n    cout << souls[\"Maren\"];\n} else {\n    cout << \"unjudged\";\n}",
      "Walk every pair with a range-for and **structured bindings** `auto [key, value]`:",
      ">>>for (auto [name, debt] : souls) {\n    cout << name << \" owes \" << debt << \"\\n\";\n}",
      "An unordered_map has no fixed order — its pairs come back in any order. When order matters, look keys up directly instead of iterating."
    ],
    fragments: [
      "**Fragment I** — `unordered_map<string,int> m;` then `m[\"key\"] = value;`. `m[\"key\"]` reads it back. The brackets name the key and value types.",
      "**Fragment II** — Assigning a new key adds a pair; assigning an existing key replaces its value. Same syntax, silent overwrite.",
      "**Fragment III** — `m.count(key)` returns 1 if the key exists, 0 if not — the safe check before reading. (Plain `m[key]` on a missing key CREATES it at 0!)",
      "**Fragment IV** — `for (auto [k, v] : m)` walks every pair. But unordered_map has NO fixed order — don't rely on it for ordered output."
    ]
  },
  kills: { enemy: "grave_wisp", count: 5 },
  questions: [
    { type: "output", q: "Read the entry:", code: "unordered_map<string,int> d;\nd[\"hp\"] = 9;\ncout << d[\"hp\"];",
      answer: "9", why: "d[\"hp\"] looks up the key and returns its value: 9." },
    { type: "mc", q: "How do you add the pair mp -> 5 to map d?",
      choices: ["d[\"mp\"] = 5;", "d.push_back(\"mp\", 5);", "d + {\"mp\", 5};", "add d[\"mp\"] 5;"],
      answer: 0, why: "Assignment with a new key adds the pair. push_back is for vectors." },
    { type: "output", q: "The silent overwrite:", code: "unordered_map<string,int> d;\nd[\"a\"] = 1;\nd[\"a\"] = 2;\ncout << d[\"a\"];",
      answer: "2", why: "Assigning to an existing key replaces its value." },
    { type: "mc", q: "d.count(\"x\") when \"x\" is NOT a key returns...",
      choices: ["0", "1", "an error", "\"x\""],
      answer: 0, why: ".count returns 0 when the key is absent, 1 when present." },
    { type: "output", q: "Checking a key safely:", code: "unordered_map<string,int> d;\nd[\"oak\"] = 2;\ncout << d.count(\"oak\");",
      answer: "1", why: ".count returns 1 because \"oak\" is a key." },
    { type: "fill", q: "Fill the blank to walk every pair:", code: "for (auto [k, v] : d) {\n    cout << k << \" \" << ____ << \"\\n\";\n}",
      answer: "v", why: "The structured binding names each pair's key k and value v." },
    { type: "mc", q: "Why can't you rely on the order an unordered_map prints in?",
      choices: ["It stores pairs by hash, in no fixed order", "It sorts by value", "It reverses insertion order", "It only holds one pair"],
      answer: 0, why: "unordered_map is hash-based; its iteration order is unspecified." }
  ],
  challenge: {
    title: "The Ledger of Souls",
    story: "Lumen lays the great book before you. \"I will name the dead, one by one. For each, tell me their debt — or that they go unjudged. The ledger does not care what order I ask in.\"",
    prompt: [
      "Input: line 1 is `m`; the next `m` lines each give `name debt` (name is one word, debt an int). Then a line `q`; the next `q` lines each give a name to look up. The starter reads them.",
      "For each queried name, print one line:",
      "— if the name is in the ledger: `NAME owes DEBT`",
      "— otherwise: `NAME unjudged`",
      ">>>Bryn owes 3\nMaren unjudged\nSora owes 7",
      "(Example: ledger Bryn 3, Sora 7; queries Bryn, Maren, Sora.)"
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int m;\n    cin >> m;\n    unordered_map<string, int> souls;\n    for (int i = 0; i < m; i++) {\n        string name; int debt;\n        cin >> name >> debt;\n        souls[name] = debt;\n    }\n    int q;\n    cin >> q;\n    for (int i = 0; i < q; i++) {\n        string name;\n        cin >> name;\n        // print \"NAME owes DEBT\" if known, else \"NAME unjudged\"\n\n    }\n    return 0;\n}\n",
    tests: [
      { stdin: "2\nBryn 3\nSora 7\n3\nBryn\nMaren\nSora", expectOut: "Bryn owes 3\nMaren unjudged\nSora owes 7", label: "three queries" },
      { stdin: "1\nEdda 1\n2\nEdda\nGorm", expectOut: "Edda owes 1\nGorm unjudged", label: "one soul, two asked" }
    ],
    hints: [
      "Check before reading: if (souls.count(name)) cout << name << \" owes \" << souls[name] << \"\\n\";",
      "else cout << name << \" unjudged\\n\"; — output order follows the queries, so the map's own order never matters.",
      "Full answer:\n#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int m;\n    cin >> m;\n    unordered_map<string, int> souls;\n    for (int i = 0; i < m; i++) {\n        string name; int debt;\n        cin >> name >> debt;\n        souls[name] = debt;\n    }\n    int q;\n    cin >> q;\n    for (int i = 0; i < q; i++) {\n        string name;\n        cin >> name;\n        if (souls.count(name)) cout << name << \" owes \" << souls[name] << \"\\n\";\n        else cout << name << \" unjudged\\n\";\n    }\n    return 0;\n}"
    ]
  },
  rewards: { xp: 240, coins: 70, items: [["watchmans_greatsword", 1]] }
},

/* ---------------- cpp12 : The Unrepeatable Rite ---------------- */
{
  id: "cpp12", faction: "cpp", act: 3, title: "The Unrepeatable Rite", npc: "lumen", map: "ruins",
  intro: [
    "One more service, marked one. The Cursed Scarabs in the outer halls multiply by *copying*. Each carries a sigil, and most are duplicates. Forgeries of being.",
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
    title: "The Unrepeatable — Sets",
    body: [
      "A **set** is a bag that refuses duplicates. `std::set` (from `#include <set>`) also keeps its contents **sorted**:",
      ">>>set<string> marks;\nmarks.insert(\"oak\");\nmarks.insert(\"ash\");\nmarks.insert(\"oak\");   // ignored - already present\ncout << marks.size();   // 2",
      "`.insert(x)` adds; inserting twice changes nothing. `.count(x)` answers membership (1 or 0):",
      ">>>cout << marks.count(\"ash\");   // 1",
      "Because `std::set` is sorted, a range-for walks it in **sorted order** — perfect for reciting cleanly:",
      ">>>for (const string &m : marks) cout << m << \" \";\n// ash oak",
      "The dedupe spell: pour values into a set, and its `.size()` is the count of unique items.",
      "When you only need fast membership and don't care about order, use `unordered_set` (from `#include <unordered_set>`) — same `.insert` / `.count`, faster, but unsorted."
    ],
    fragments: [
      "**Fragment I** — `set<string> s;` holds each value once AND keeps them sorted. `s.insert(x)` adds; a repeat is silently ignored.",
      "**Fragment II** — `s.count(x)` is the set's favorite question: 1 if present, 0 if not — answered fast.",
      "**Fragment III** — A range-for over a `std::set` visits items in SORTED order. Use it to recite a deduped list predictably.",
      "**Fragment IV** — `unordered_set` is the same idea without sorting: faster membership, no order. Choose `set` when you need sorted output."
    ]
  },
  kills: { enemy: "cursed_scarab", count: 5 },
  questions: [
    { type: "output", q: "Where did the duplicate go?", code: "set<int> s = {1, 2, 2, 3};\ncout << s.size();",
      answer: "3", why: "Sets keep one of each: {1, 2, 3} — three items." },
    { type: "mc", q: "What is special about a std::set?",
      choices: ["No duplicates, and kept sorted", "It preserves insertion order", "It can hold duplicates", "It only holds numbers"],
      answer: 0, why: "std::set stores unique values in sorted order." },
    { type: "output", q: "Inserting twice:", code: "set<string> s;\ns.insert(\"x\");\ns.insert(\"x\");\ncout << s.size();",
      answer: "1", why: "The second insert is ignored: sets refuse repeats." },
    { type: "output", q: "Reciting in order:", code: "set<int> s = {3, 1, 2};\nfor (int x : s) cout << x;",
      answer: "123", why: "A std::set walks in sorted order: 1, 2, 3 -> 123." },
    { type: "mc", q: "How do sets differ from vectors?",
      choices: ["Sets reject duplicates (and std::set stays sorted)", "Sets are faster to push_back", "Sets hold only two items", "No difference"],
      answer: 0, why: "Sets keep unique values; std::set also keeps them sorted." },
    { type: "output", q: "Membership:", code: "set<string> s = {\"ash\", \"oak\"};\ncout << s.count(\"oak\");",
      answer: "1", why: ".count returns 1 because \"oak\" is in the set." },
    { type: "mc", q: "You need fast membership but DON'T care about order. Which?",
      choices: ["unordered_set", "set", "vector", "string"],
      answer: 0, why: "unordered_set gives fast membership without the cost of sorting." }
  ],
  challenge: {
    title: "Distill the True Sigils",
    story: "Lumen empties the sack: sigils clatter out, most identical. \"Distill them. Count the true names, recite them in order, and tell me if 'flame' walks among them.\"",
    prompt: [
      "Input: line 1 is `m`; then `m` sigil words (whitespace-separated). The starter reads them into a `set<string>`.",
      "Print three lines:",
      "1. The number of **unique** sigils.",
      "2. The unique sigils in **sorted** order, space-separated.",
      "3. `yes` if `\"flame\"` is among them, else `no`.",
      ">>>3\nash flame oak\nyes",
      "(Example for sigils = ash flame ash oak flame.)"
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\n#include <set>\nusing namespace std;\n\nint main() {\n    int m;\n    cin >> m;\n    set<string> uniq;\n    for (int i = 0; i < m; i++) {\n        string s;\n        cin >> s;\n        uniq.insert(s);\n    }\n    // 1) unique count  2) sorted unique, space-separated  3) yes/no for \"flame\"\n\n    return 0;\n}\n",
    tests: [
      { stdin: "5\nash flame ash oak flame", expectOut: "3\nash flame oak\nyes", label: "the forged sack" },
      { stdin: "3\na a a", expectOut: "1\na\nno", label: "one true name" }
    ],
    hints: [
      "uniq.size() is line 1. A std::set is already sorted, so just walk it for line 2.",
      "Use a 'first' flag so spaces go BETWEEN items, not after the last. Line 3: uniq.count(\"flame\") ? \"yes\" : \"no\".",
      "Full answer:\n#include <iostream>\n#include <string>\n#include <set>\nusing namespace std;\n\nint main() {\n    int m;\n    cin >> m;\n    set<string> uniq;\n    for (int i = 0; i < m; i++) {\n        string s;\n        cin >> s;\n        uniq.insert(s);\n    }\n    cout << uniq.size() << \"\\n\";\n    bool first = true;\n    for (const string &s : uniq) {\n        if (!first) cout << \" \";\n        cout << s;\n        first = false;\n    }\n    cout << \"\\n\";\n    cout << (uniq.count(\"flame\") ? \"yes\" : \"no\") << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 260, coins: 75, items: [["scribes_talisman", 1]] }
},

/* ---------------- cpp13 : BOSS — The Drowned King ---------------- */
{
  id: "cpp13", faction: "cpp", act: 3, title: "The Drowned King", npc: "nyra", map: "ruins", boss: true,
  bossEnemy: "boss_drowned_king", bossSpot: { map: "ruins", x: 39, y: 9 },
  intro: [
    "It's awake. The throne room lights are burning blue and the water is flowing *upward*. The Drowned King has risen, and he is taking inventory.",
    "He was the kingdom's treasurer once — drowned in his own vault, counting as the water rose. He will not rest until someone proves the count can be done *right*.",
    "Take everything the archive taught you — vectors, maps, the tally pattern — and face him at the <b>flooded throne</b>, northeast."
  ],
  acceptLabel: "I will settle his accounts.",
  midDialogue: "He counts coins in the throne room. The same coins. Over and over. End it.",
  returnDialogue: ["The Drowned King waits at his flooded throne, northeast of here."],
  doneDialogue: "The water flows downward again. He left his hoard — and a path to Kingsfall Citadel. The capital, marked one. What's left of it.",
  lesson: {
    title: "Trial of the Drowned (Recap)",
    body: [
      "The Drowned King demands a full audit. The heart of it is the **tally** pattern with an unordered_map:",
      ">>>unordered_map<string, int> counts;\nfor (const string &item : items) {\n    counts[item]++;   // [] starts a new key at 0, ++ adds one\n}",
      "That `counts[item]++` is the whole trick: a key you've never seen starts at 0, and `++` raises it to 1, then 2, then 3...",
      "Then find the largest by walking the pairs, keeping the best so far:",
      ">>>string best; int most = -1;\nfor (auto [name, n] : counts) {\n    if (n > most) { most = n; best = name; }\n}"
    ],
    fragments: []
  },
  kills: null,
  questions: [
    { type: "output", q: "The King gurgles: 'Begin the tally.'", code: "unordered_map<string,int> c;\nc[\"coin\"]++;\nc[\"coin\"]++;\ncout << c[\"coin\"];",
      answer: "2", why: "The first ++ starts \"coin\" at 0 then raises to 1; the second to 2. The tally pattern." },
    { type: "mc", q: "'Why counts[item]++ with no check first?'",
      choices: ["[] starts a missing key at 0, so ++ safely makes it 1", "It sorts the map", "It removes duplicates", "It is the only legal syntax"],
      answer: 0, why: "operator[] default-creates the key at 0, so ++ works even the first time you see an item." },
    { type: "output", q: "'Walk my ledger.'", code: "unordered_map<string,int> c;\nc[\"urn\"] = 2;\nint total = 0;\nfor (auto [k, v] : c) total += v;\ncout << total;",
      answer: "2", why: "Only one pair, value 2; summing the values gives 2." },
    { type: "mc", q: "'How do I track the highest count as I walk?'",
      choices: ["Keep a best-so-far and update it when a bigger one appears", "Sort the map first", "Use push_back", "Count to ten"],
      answer: 0, why: "Track the running maximum: if (n > most) update most and best." }
  ],
  challenge: {
    title: "The Final Audit",
    story: "The Drowned King spreads his waterlogged hoard before you. \"COUNT,\" the water roars. \"Find what I hoarded most, and how many. Get it right, and I will finally rest.\"",
    prompt: [
      "Input: line 1 is `m`; then `m` relic words. One name appears **strictly more often** than any other. The starter reads them.",
      "Print two lines:",
      "1. The most common relic's name.",
      "2. How many times it appears.",
      ">>>coin\n3",
      "(Example for relics = coin crown coin mask coin.)",
      "Tally with an `unordered_map`, then find the key with the highest count."
    ],
    mode: "program",
    starter: "#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int m;\n    cin >> m;\n    unordered_map<string, int> counts;\n    for (int i = 0; i < m; i++) {\n        string r;\n        cin >> r;\n        // tally r\n\n    }\n    // find the name with the highest count; print name, then count\n\n    return 0;\n}\n",
    tests: [
      { stdin: "5\ncoin crown coin mask coin", expectOut: "coin\n3", label: "the coin hoard" },
      { stdin: "3\nurn urn mask", expectOut: "urn\n2", label: "the urn pair" },
      { stdin: "1\nsigil", expectOut: "sigil\n1", label: "a single relic" }
    ],
    hints: [
      "Tally inside the loop: counts[r]++;",
      "Then walk the pairs tracking the best: string best; int most = -1; for (auto [k, v] : counts) if (v > most) { most = v; best = k; }",
      "Full answer:\n#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int m;\n    cin >> m;\n    unordered_map<string, int> counts;\n    for (int i = 0; i < m; i++) {\n        string r;\n        cin >> r;\n        counts[r]++;\n    }\n    string best; int most = -1;\n    for (auto [k, v] : counts) {\n        if (v > most) { most = v; best = k; }\n    }\n    cout << best << \"\\n\" << most << \"\\n\";\n    return 0;\n}"
    ]
  },
  rewards: { xp: 500, coins: 150, items: [["runic_warblade", 1], ["phoenix_draught", 1]], title: "Tidebreaker", unlocks: "Kingsfall Citadel" }
}
);
