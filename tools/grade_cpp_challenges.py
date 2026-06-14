"""Grade every C++ challenge's reference solution by compiling and running it
on the Wandbox forge (the same compiler the game uses) against its tests.

Input: tools/cpp_challenges.json — an array of
    { "id", "title", "tests": [{"stdin","expectOut","label"}], "solution" }
Produce that file from the loaded game with tools/export_cpp_challenges.js
(or the in-browser exporter). This script needs only python3 + curl.

Usage:  python3 tools/grade_cpp_challenges.py
"""
import json, os, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
API = "https://wandbox.org/api/compile.json"
COMPILER = "gcc-13.2.0"
OPTIONS = "warning,gnu++17"
# Transient infra messages from the public forge (overload / rate limit) — retry, don't fail.
TRANSIENT = ("oci runtime", "resource temporarily unavailable", "cannot allocate", "try again")


def norm(s):
    lines = [ln.rstrip() for ln in (s or "").replace("\r\n", "\n").split("\n")]
    while lines and lines[0] == "":
        lines.pop(0)
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(lines)


def wandbox(code, stdin, retries=8):
    body = json.dumps({"compiler": COMPILER, "options": OPTIONS,
                       "code": code, "stdin": stdin or ""})
    last = ""
    for attempt in range(retries):
        p = subprocess.run(
            ["curl", "-s", "--max-time", "60", "-H", "Content-Type: application/json",
             "--data-binary", "@-", API],
            input=body, capture_output=True, text=True)
        if p.returncode == 0 and p.stdout.strip():
            d = json.loads(p.stdout)
            blob = " ".join([(d.get("compiler_error") or ""),
                             (d.get("program_error") or ""),
                             (d.get("program_message") or "")]).lower()
            if any(t in blob for t in TRANSIENT):
                last = "forge overloaded"
            else:
                return d
        else:
            last = p.stderr.strip()[:160] or "empty response"
        time.sleep(3 + attempt * 3)  # back off: 3s, 6s, 9s, ...
    raise RuntimeError(f"forge unavailable after {retries} tries ({last})")


def grade_one(ch):
    """Return (id, [failure strings])."""
    fails = []
    for t in ch["tests"]:
        label = t.get("label", "test")
        try:
            d = wandbox(ch["solution"], t.get("stdin", ""))
        except Exception as e:
            fails.append(f"[{label}] {e}")
            continue
        cerr = d.get("compiler_error", "") or ""
        if "error:" in cerr.lower():
            first = next((l for l in cerr.splitlines() if "error:" in l.lower()), cerr[:160])
            fails.append(f"[{label}] COMPILE ERROR: {first.strip()}")
            continue
        got, exp = norm(d.get("program_output", "")), norm(t.get("expectOut", ""))
        if got != exp:
            fails.append(f"[{label}] expected {exp!r}, got {got!r}"
                         + (f"  (stderr: {d.get('program_error','').strip()[:120]})"
                            if d.get("program_error") else ""))
    return ch["id"], fails


def main():
    path = os.path.join(HERE, "cpp_challenges.json")
    if not os.path.exists(path):
        print(f"missing {path} — export it from the loaded game first "
              f"(tools/export_cpp_challenges.js).")
        sys.exit(2)
    with open(path, encoding="utf-8") as f:
        challenges = json.load(f)

    print(f"Grading {len(challenges)} C++ reference solutions on {COMPILER} "
          f"({sum(len(c['tests']) for c in challenges)} test runs)...\n")

    total_fail = 0
    # Fully sequential — the public forge rate-limits bursts hard.
    with ThreadPoolExecutor(max_workers=1) as ex:
        results = list(ex.map(grade_one, challenges))
    # Preserve input order for a tidy report.
    by_id = dict(results)
    for ch in challenges:
        cid = ch["id"]
        fails = by_id[cid]
        if not fails:
            print(f"ok    {cid:7s} {ch['title']}")
        else:
            total_fail += len(fails)
            print(f"FAIL  {cid:7s} {ch['title']}")
            for fmsg in fails:
                print(f"        {fmsg}")

    print()
    print("ALL C++ REFERENCE SOLUTIONS PASS" if not total_fail
          else f"{total_fail} FAILURE(S)")
    sys.exit(1 if total_fail else 0)


if __name__ == "__main__":
    main()
