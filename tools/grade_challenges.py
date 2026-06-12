"""Grade every challenge's reference solution with the same logic the game uses."""
import json, sys, io, os

HERE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(HERE, "challenges.json"), encoding="utf-8") as f:
    CHALLENGES = json.load(f)

def norm(s):
    lines = [ln.rstrip() for ln in s.replace("\r\n", "\n").split("\n")]
    while lines and lines[0] == "":
        lines.pop(0)
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(lines)

def eq(a, b):
    if isinstance(a, tuple): a = list(a)
    if isinstance(b, tuple): b = list(b)
    if isinstance(a, bool) != isinstance(b, bool):
        return False
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) < 1e-6
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(eq(x, y) for x, y in zip(a, b))
    return a == b

failures = 0
for ch in CHALLENGES:
    for i, t in enumerate(ch["tests"]):
        ns = {"__name__": "__main__"}
        label = t.get("label", f"test {i}")
        try:
            if ch["mode"] == "program":
                if t.get("setup"):
                    exec(t["setup"], ns)
                buf = io.StringIO()
                old = sys.stdout
                sys.stdout = buf
                try:
                    exec(ch["solution"], ns)
                finally:
                    sys.stdout = old
                got, exp = norm(buf.getvalue()), norm(t["expectOut"])
                if got != exp:
                    failures += 1
                    print(f"FAIL {ch['id']} [{label}]\n  expected: {exp!r}\n  got:      {got!r}")
            else:
                exec(ch["solution"], ns)
                if t.get("pysetup"):
                    exec(t["pysetup"], ns)
                if t.get("expr"):
                    result = eval(t["expr"], ns)
                else:
                    fn = ns.get(ch["funcName"])
                    if not callable(fn):
                        raise RuntimeError(f"function {ch['funcName']} not defined")
                    result = fn(*t["args"])
                if not eq(result, t["expect"]):
                    failures += 1
                    print(f"FAIL {ch['id']} [{label}]\n  expected: {t['expect']!r}\n  got:      {result!r}")
        except Exception as e:
            failures += 1
            print(f"ERROR {ch['id']} [{label}]: {type(e).__name__}: {e}")
    print(f"ok  {ch['id']:6s} {ch['title']}")

print()
print("ALL REFERENCE SOLUTIONS PASS" if failures == 0 else f"{failures} FAILURE(S)")
sys.exit(1 if failures else 0)
