/* ============================================================
   Drills — redemption questions. When the player misses a
   question, variantFor() builds a fresh question on the SAME
   concept with different numbers/words, asked immediately
   after, so the idea gets re-tested in a new form.
   ============================================================ */
window.Drills = (function () {
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[ri(0, arr.length - 1)];
  const WORDS = ["ember", "ash", "flame", "kingdom", "wolf", "torch", "stone", "raven", "cinder", "veil"];

  function out(qText, code, answer, why) {
    return { type: "output", drill: true, q: qText, code, answer, why };
  }

  /* Ordered: the first matching concept wins, so the more specific
     symbols (** // % +=) are tested before the generic ones. */
  const GENS = [
    { // power: 2 ** 4
      detect: /\*\*/,
      gen() {
        const pairs = [[2, 2], [2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [4, 2], [5, 2], [10, 2]];
        const [a, b] = pick(pairs);
        const v = Math.pow(a, b);
        return out("Same idea, new numbers:", `print(${a} ** ${b})`, String(v),
          `\`**\` is power: ${a} multiplied by itself ${b} times is ${v}.`);
      }
    },
    { // accumulator: total += i
      detect: /\+=/,
      gen() {
        const n = ri(3, 5);
        let total = 0;
        for (let i = 0; i < n; i++) total += i;
        return out("Grow the accumulator again:", `total = 0\nfor i in range(${n}):\n    total += i\nprint(total)`,
          String(total), `It adds 0 through ${n - 1}: ${Array.from({ length: n }, (_, i) => i).join("+")} = ${total}.`);
      }
    },
    { // floor division: 7 // 2
      detect: /\/\//,
      gen() {
        const b = ri(2, 9), q = ri(2, 12), r = ri(1, b - 1), a = b * q + r;
        return out("Floor division, fresh numbers:", `print(${a} // ${b})`, String(q),
          `${a} / ${b} is ${q} remainder ${r}; \`//\` keeps only the whole ${q}.`);
      }
    },
    { // modulo: 90 % 7
      detect: /%/,
      gen() {
        const b = ri(3, 9), q = ri(2, 14), r = ri(0, b - 1), a = b * q + r;
        return out("The remainder, fresh numbers:", `print(${a} % ${b})`, String(r),
          `${b} fits into ${a} ${q} times (${b * q}), leaving remainder ${r}.`);
      }
    },
    { // order of operations: 10 - 2 * 3
      detect: /\d\s*[+\-]\s*\d+\s*\*\s*\d|\*\s*\d+\s*[+\-]\s*\d/,
      gen() {
        const a = ri(8, 20), b = ri(2, 4), c = ri(2, 5);
        return out("Mind the old order again:", `print(${a} - ${b} * ${c})`, String(a - b * c),
          `Multiplication first: ${b}*${c} = ${b * c}, then ${a} - ${b * c} = ${a - b * c}.`);
      }
    },
    { // range loops
      detect: /range\(/,
      gen() {
        if (Math.random() < 0.5) {
          const n = ri(3, 5);
          return out("Walk the count again:", `for i in range(${n}):\n    print(i)`,
            Array.from({ length: n }, (_, i) => i).join("\n"),
            `range(${n}) yields ${n} values: 0 up to ${n - 1} — starts at zero, stops before ${n}.`);
        }
        const s = ri(1, 4), e = s + ri(2, 3);
        return out("Start and stop:", `for i in range(${s}, ${e}):\n    print(i)`,
          Array.from({ length: e - s }, (_, i) => s + i).join("\n"),
          `range(${s}, ${e}) starts at ${s} and stops BEFORE ${e}.`);
      }
    },
    { // len()
      detect: /len\(/,
      gen() {
        const w = pick(WORDS);
        return out("Measure a new word:", `print(len("${w}"))`, String(w.length),
          `len counts characters: "${w}" has ${w.length}.`);
      }
    },
    { // .upper() / .lower()
      detect: /\.(upper|lower)\(/,
      gen() {
        const w = pick(WORDS);
        if (Math.random() < 0.5)
          return out("Another war cry:", `print("${w}".upper())`, w.toUpperCase(),
            ".upper() makes every letter a capital.");
        return out("Another whisper:", `print("${w.toUpperCase()}".lower())`, w,
          ".lower() makes every letter lowercase.");
      }
    },
    { // quoted "digits" glued with +
      detect: /"[^"]*"\s*\+\s*"/,
      gen() {
        const d1 = ri(1, 9), d2 = ri(1, 9);
        return out("Strings, not numbers:", `print("${d1}" + "${d2}")`, `${d1}${d2}`,
          `Quoted digits are text — + glues them into "${d1}${d2}". No math happens.`);
      }
    },
    { // sum / max / min over a list
      detect: /\b(sum|max|min)\(/,
      gen() {
        const lst = [ri(1, 9), ri(1, 9), ri(1, 9)];
        const fn = pick(["sum", "max", "min"]);
        const v = fn === "sum" ? lst[0] + lst[1] + lst[2] : fn === "max" ? Math.max(...lst) : Math.min(...lst);
        return out("Measure this list instead:", `print(${fn}([${lst.join(", ")}]))`, String(v),
          `${fn} of [${lst.join(", ")}] is ${v}.`);
      }
    },
    { // list indexing
      detect: /\[\s*-?\d+\s*\]/,
      gen() {
        const lst = [ri(1, 9), ri(10, 19), ri(20, 29), ri(30, 39)];
        const i = pick([0, 1, 2, -1]);
        const v = i === -1 ? lst[3] : lst[i];
        return out("Read a different shelf:", `lst = [${lst.join(", ")}]\nprint(lst[${i}])`, String(v),
          i === -1 ? `-1 reads from the END: ${v}.` : `Index ${i} is the ${["first", "second", "third"][i]} item: ${v}.`);
      }
    },
    { // comparisons -> True/False
      detect: /[<>]=?|==|!=/,
      gen() {
        const a = ri(1, 12), b = ri(1, 12);
        const op = pick([">", "<", ">=", "<=", "==", "!="]);
        const val = { ">": a > b, "<": a < b, ">=": a >= b, "<=": a <= b, "==": a === b, "!=": a !== b }[op];
        return { type: "tf", drill: true, q: "Same idea, new numbers — what does this evaluate to?",
          code: `print(${a} ${op} ${b})`, answer: val,
          why: `${a} ${op} ${b} is ${val ? "True" : "False"} — comparisons always produce a boolean.` };
      }
    }
  ];

  function variantFor(q) {
    const hay = (q.code || "") + "\n" + (q.q || "") + "\n" + String(q.answer);
    for (const g of GENS) {
      if (g.detect.test(hay)) {
        try { return g.gen(); } catch (e) { return null; }
      }
    }
    return null;
  }

  return { variantFor };
})();
