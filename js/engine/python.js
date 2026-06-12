/* ============================================================
   Py — Pyodide wrapper. Loads real Python (WASM) from CDN and
   grades code challenges with a sandboxed test harness.
   ============================================================ */
window.Py = (function () {
  const CDN_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  let pyodide = null;
  let loadingPromise = null;
  let status = "idle"; // idle | loading | ready | failed

  const HARNESS = `
import json, sys, io, time, traceback

__aofk_deadline = [0.0]

def __aofk_tracer(frame, event, arg):
    if time.time() > __aofk_deadline[0]:
        raise TimeoutError("Your code ran for too long - check for an infinite loop!")
    return __aofk_tracer

def __aofk_make_input(lines):
    it = iter(list(lines))
    def _input(prompt=""):
        try:
            return next(it)
        except StopIteration:
            raise RuntimeError("input() was called but no more values were provided")
    return _input

def __aofk_no_input(prompt=""):
    raise RuntimeError("input() is not available here - use the variables you are given")

def __aofk_norm(s):
    lines = [ln.rstrip() for ln in s.replace("\\r\\n", "\\n").split("\\n")]
    while lines and lines[0] == "":
        lines.pop(0)
    while lines and lines[-1] == "":
        lines.pop()
    return "\\n".join(lines)

def __aofk_eq(a, b):
    if isinstance(a, tuple):
        a = list(a)
    if isinstance(b, tuple):
        b = list(b)
    if isinstance(a, bool) != isinstance(b, bool):
        return False
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) < 1e-6
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(__aofk_eq(x, y) for x, y in zip(a, b))
    return a == b

def __aofk_errinfo(exc, user_file):
    tb = exc.__traceback__
    line = None
    for fr in traceback.extract_tb(tb):
        if fr.filename == user_file:
            line = fr.lineno
    name = type(exc).__name__
    msg = str(exc)
    where = f" (line {line})" if line else ""
    return f"{name}: {msg}{where}"

def __aofk_exec(compiled, ns):
    sys.settrace(__aofk_tracer)
    try:
        exec(compiled, ns)
    finally:
        sys.settrace(None)

def __aofk_call(fn, args):
    sys.settrace(__aofk_tracer)
    try:
        return fn(*args)
    finally:
        sys.settrace(None)

def __aofk_eval(expr, ns):
    sys.settrace(__aofk_tracer)
    try:
        return eval(expr, ns)
    finally:
        sys.settrace(None)

def __aofk_run(payload_json):
    p = json.loads(payload_json)
    mode = p["mode"]
    code = p["code"]
    func_name = p.get("funcName")
    tests = p["tests"]
    out = {"fatal": None, "results": []}
    USER_FILE = "<your code>"

    try:
        compiled = compile(code, USER_FILE, "exec")
    except SyntaxError as e:
        loc = f" (line {e.lineno})" if e.lineno else ""
        out["fatal"] = f"SyntaxError: {e.msg}{loc}"
        return json.dumps(out)

    timed_out = False
    for t in tests:
        r = {"ok": False, "got": "", "expected": "", "printed": "", "error": None}
        if timed_out:
            r["error"] = "skipped - an earlier test ran forever (infinite loop?)"
            out["results"].append(r)
            continue
        ns = {"__name__": "__main__"}
        if t.get("inputs") is not None:
            ns["input"] = __aofk_make_input(t["inputs"])
        else:
            ns["input"] = __aofk_no_input
        __aofk_deadline[0] = time.time() + 4.5
        buf = io.StringIO()
        old_stdout = sys.stdout
        try:
            if mode == "program":
                setup = t.get("setup")
                if setup:
                    exec(compile(setup, "<given>", "exec"), ns)
                sys.stdout = buf
                try:
                    __aofk_exec(compiled, ns)
                finally:
                    sys.stdout = old_stdout
                got = __aofk_norm(buf.getvalue())
                exp = __aofk_norm(t["expectOut"])
                r["got"] = got
                r["expected"] = exp
                r["ok"] = (got == exp)
            else:
                sys.stdout = buf
                try:
                    __aofk_exec(compiled, ns)
                    if t.get("pysetup"):
                        exec(compile(t["pysetup"], "<test setup>", "exec"), ns)
                    if t.get("expr"):
                        result = __aofk_eval(t["expr"], ns)
                    else:
                        fn = ns.get(func_name)
                        if not callable(fn):
                            r["error"] = f"You must define a function named {func_name}(...)"
                            out["results"].append(r)
                            continue
                        result = __aofk_call(fn, t["args"])
                finally:
                    sys.stdout = old_stdout
                r["printed"] = buf.getvalue()[:600]
                exp = t["expect"]
                r["got"] = repr(result)
                r["expected"] = repr(exp)
                r["ok"] = __aofk_eq(result, exp)
        except BaseException as e:
            sys.stdout = old_stdout
            r["error"] = __aofk_errinfo(e, USER_FILE)
            if isinstance(e, TimeoutError):
                timed_out = True
        out["results"].append(r)
    return json.dumps(out)
`;

  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Could not load Pyodide from the CDN"));
      document.head.appendChild(s);
    });
  }

  async function ensure(statusCb) {
    if (pyodide) return pyodide;
    if (loadingPromise) return loadingPromise;
    loadingPromise = (async () => {
      try {
        status = "loading";
        if (statusCb) statusCb("Summoning the Serpent Spirit (loading Python)...");
        if (typeof loadPyodide === "undefined") {
          await injectScript(CDN_BASE + "pyodide.js");
        }
        if (statusCb) statusCb("Binding the Serpent Spirit (starting Python)...");
        pyodide = await loadPyodide({ indexURL: CDN_BASE });
        pyodide.runPython(HARNESS);
        status = "ready";
        if (statusCb) statusCb("");
        return pyodide;
      } catch (e) {
        status = "failed";
        loadingPromise = null;
        console.error("Pyodide failed to load:", e);
        throw new Error(
          "The Serpent Spirit could not be summoned (Python failed to load). " +
          "Check your internet connection - Python runs in your browser via a CDN - then try again."
        );
      }
    })();
    return loadingPromise;
  }

  async function runChallenge(challenge, code, statusCb) {
    const py = await ensure(statusCb);
    // let the UI paint "Running..." before the synchronous run
    await new Promise((r) => setTimeout(r, 40));
    const payload = {
      mode: challenge.mode,
      code: code,
      funcName: challenge.funcName || null,
      tests: challenge.tests
    };
    py.globals.set("__aofk_payload", JSON.stringify(payload));
    const res = py.runPython("__aofk_run(__aofk_payload)");
    return JSON.parse(res);
  }

  return {
    ensure,
    runChallenge,
    getStatus() { return status; }
  };
})();
