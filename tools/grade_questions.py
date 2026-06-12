"""Verify every output-type combat question by actually running its code."""
import json, sys, io, os

HERE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(HERE, "questions.json"), encoding="utf-8") as f:
    QUESTIONS = json.load(f)

def norm(s):
    lines = [ln.rstrip() for ln in s.replace("\r\n", "\n").split("\n")]
    while lines and lines[0] == "":
        lines.pop(0)
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(lines)

failures = 0
for q in QUESTIONS:
    ns = {"__name__": "__main__"}
    buf = io.StringIO()
    old = sys.stdout
    sys.stdout = buf
    try:
        exec(q["code"], ns)
    except Exception as e:
        sys.stdout = old
        failures += 1
        print(f"ERROR {q['id']}: {type(e).__name__}: {e}")
        continue
    finally:
        sys.stdout = old
    got, exp = norm(buf.getvalue()), norm(q["answer"])
    if got != exp:
        failures += 1
        print(f"FAIL {q['id']}\n  stated:  {exp!r}\n  actual:  {got!r}")

print(f"{len(QUESTIONS)} output questions checked — " + ("ALL CORRECT" if failures == 0 else f"{failures} WRONG"))
sys.exit(1 if failures else 0)
