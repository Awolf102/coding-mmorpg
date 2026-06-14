/* ============================================================
   Cpp — real C++ for the Iron Concord. Compiles & runs the
   player's code on the Wandbox forge (gcc) over HTTPS and grades
   it with a stdin -> stdout harness. Mirrors the Py interface so
   the UI can dispatch to whichever engine the faction needs.
   ============================================================ */
window.Cpp = (function () {
  const API = "https://wandbox.org/api/compile.json";
  const COMPILER = "gcc-13.2.0";
  const OPTIONS = "warning,gnu++17";
  const REQ_TIMEOUT = 30000; // ms per compile
  const CONCURRENCY = 3;     // be kind to the public forge (5 req/s limit)
  // Transient infra messages from the public forge (overload) — retry, never blame the player.
  const TRANSIENT = /oci runtime|resource temporarily unavailable|cannot allocate|crun:|please try again/i;

  let status = "idle"; // idle | ready | failed

  /* Match the Python harness's output normalization exactly so a
     C++ challenge and its Python twin grade identically. */
  function norm(s) {
    const lines = String(s == null ? "" : s)
      .replace(/\r\n/g, "\n").split("\n").map((l) => l.replace(/\s+$/g, ""));
    while (lines.length && lines[0] === "") lines.shift();
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    return lines.join("\n");
  }

  /* Trim the compiler's stderr to the first useful error lines. */
  function firstErrors(text) {
    const lines = String(text || "").split("\n").filter((l) => l.trim() !== "");
    const errs = lines.filter((l) => /error:/i.test(l));
    const pick = (errs.length ? errs : lines).slice(0, 4);
    return pick.join("\n");
  }

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  /* A single POST to Wandbox. Throws "UNREACHABLE" or "HTTP <n>". */
  async function fetchOnce(code, stdin) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQ_TIMEOUT);
    let res;
    try {
      res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compiler: COMPILER,
          options: OPTIONS,
          code: code,
          stdin: stdin == null ? "" : String(stdin)
        }),
        signal: ctrl.signal
      });
    } catch (e) {
      throw new Error("UNREACHABLE");
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  /* One compile+run, retrying transient forge-overload errors. Throws on
     network failure or persistent overload (UI shows the message). */
  async function compileRun(code, stdin) {
    for (let attempt = 0; ; attempt++) {
      let data;
      try {
        data = await fetchOnce(code, stdin);
      } catch (e) {
        if (e.message === "UNREACHABLE") {
          throw new Error(
            "The Concord's forge is unreachable (could not contact the C++ compiler). " +
            "C++ trials compile online — check your internet connection and try again."
          );
        }
        if (attempt >= 2) throw new Error(`The forge answered with an error (${e.message}). Try again in a moment.`);
        await delay(1200 * (attempt + 1));
        continue;
      }
      status = "ready";
      const blob = (data.compiler_error || "") + " " + (data.program_error || "") + " " + (data.program_message || "");
      if (TRANSIENT.test(blob) && !(data.program_output || "")) {
        if (attempt >= 2) throw new Error(
          "The Concord's forge is overloaded right now (too many smiths at the anvil). " +
          "Wait a few seconds and run the rite again."
        );
        await delay(1500 * (attempt + 1));
        continue;
      }
      const cerr = data.compiler_error || "";
      return {
        compileFailed: /error:/i.test(cerr),
        compilerError: cerr,
        programOutput: data.program_output || "",
        programError: data.program_error || "",
        signal: data.signal || ""
      };
    }
  }

  /* Run up to `limit` async tasks at a time, preserving order. */
  async function mapLimit(items, limit, fn) {
    const out = new Array(items.length);
    let i = 0;
    async function worker() {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    }
    const n = Math.min(limit, items.length);
    await Promise.all(Array.from({ length: n }, worker));
    return out;
  }

  function toResult(run, test) {
    const r = { ok: false, got: "", expected: norm(test.expectOut), printed: "", error: null };
    if (run.signal) {
      r.error = `Runtime stopped (${run.signal})` +
        (/time|kill/i.test(run.signal) ? " - check for an infinite loop or slow code." :
          run.programError ? ": " + run.programError.trim().split("\n").slice(-1)[0] : ".");
      return r;
    }
    r.got = norm(run.programOutput);
    r.ok = (r.got === r.expected);
    if (!r.ok && !r.got && run.programError) {
      r.error = "Runtime error: " + run.programError.trim().split("\n").slice(-1)[0];
    }
    return r;
  }

  /* Public: grade `code` against challenge.tests. Same return shape as Py. */
  async function runChallenge(challenge, code, statusCb) {
    const tests = challenge.tests || [];
    const out = { fatal: null, results: [] };
    if (!tests.length) return out;

    if (statusCb) statusCb(LANG.cpp.summonFirst);
    // Compile once up front (first test): a compile error fails every test.
    const first = await compileRun(code, tests[0].stdin);
    if (first.compileFailed) {
      out.fatal = firstErrors(first.compilerError) || "Your C++ did not compile.";
      return out;
    }
    if (statusCb) statusCb(LANG.cpp.summonReady);

    const restRuns = await mapLimit(tests.slice(1), CONCURRENCY, (t) => compileRun(code, t.stdin));
    // A later test could still surface a compile error (shouldn't, but be safe).
    const all = [first, ...restRuns];
    for (let i = 0; i < all.length; i++) {
      if (all[i].compileFailed) { out.fatal = firstErrors(all[i].compilerError); return out; }
      out.results.push(toResult(all[i], tests[i]));
    }
    return out;
  }

  return {
    runChallenge,
    getStatus() { return status; }
  };
})();

/* ============================================================
   LANG — per-faction flavor strings, so the shared UI can speak
   each language's chronicle without hard-coding "Python".
   ============================================================ */
window.LANG = {
  python: {
    icon: "🐍", name: "Python", wayOf: "Serpent",
    chronicle: "The Python Chronicle",
    engineBlurb: "Python runs in your browser via Pyodide (internet required for code trials).",
    summonReady: "Casting...",
    summonFirst: "Summoning the Serpent Spirit (first time takes a moment)...",
    running: "Running your Python...",
    write: "Write your Python, then Run. The Flame is watching.",
    chronicleDone: "🐍 You have completed the Python Chronicle — from print() to LeetCode-medium. That is a real, marketable spell list."
  },
  cpp: {
    icon: "⚙", name: "C++", wayOf: "Concord",
    chronicle: "The C++ Chronicle",
    engineBlurb: "C++ compiles on the Wandbox forge online (internet required for code trials).",
    summonReady: "Kindling the forge...",
    summonFirst: "Stoking the Concord's forge (compiling C++ — the first run can take a moment)...",
    running: "Forging your C++ on the Concord's anvil...",
    write: "Write your C++, then Run. The forge is watching.",
    chronicleDone: "⚙ You have completed the C++ Chronicle — from cout to LeetCode-medium. That is a real, marketable spell list."
  },
  get(faction) { return this[faction] || this.python; }
};
