# Paid Study foreground jitter review repair

Source SHA-256 `42b180adfb9f59268bbcadc6b0abc907317c138768caf82835ceeb73e2689e5c`.
The actual `tick()` at97/113/89/101ms wall spacing formerly stalled a Study
starting at1e16 remaining, speed8:600 callbacks retained1e16 instead of
1e16-480. The new test calls the actual tick and performs12 real autosaves.

Only paid Study time follows earned logical ticks across callback jitter;
combat, buff deadlines and save wall-clock timestamps retain their existing
clock. State replacement resets the origin; canonical saves rebind it.
22 Swift groups/110 purchase boundaries and16 causal controls pass, including
restoring the jitter bug. Existing ordinary100ms/live/offline parity remains.

The old source-bound offline golden was stale; it was regenerated with four
independent28800 one-second advance windows from these exact product bytes.
This is an independent stepping oracle, not a weakened comparison or hash-only
edit. Historical golden files and receipts remain in git history.

All six exact-head CI lanes and signed APK/native acceptance remain pending.

Full38241843968 at4ed9efd2 finished with exactly seven failures: the two
stale golden guards, plus Rift accessibility timing, Bond duration text,
legacy-buff deadline, Amplifier role and Wisp formula expectations still
using4s/8s. All182 original scenarios remain; exact expected business values
now use approved1s/1.5s and saved recast deadlines. Five affected scenarios
pass locally. Parallel Rift first timed out at the unchanged CDP deadline;
alone it passed. Both receipts are preserved, no deadline was weakened.
