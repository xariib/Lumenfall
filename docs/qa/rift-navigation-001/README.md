# Direct Rift navigation evidence

Baseline main41566c97; final feature head86414d5c. See
[task](../../tasks/RIFT_NAVIGATION_001.md).
Current product SHA256 is2c2db6f01dfe3c277a332de4fd4b84f250a0e25eb5ee730275558356c9331d36.
core/pacing/farm/golden contain numerical/persistence checks and unchanged four
golden state hashes. mobile-final.json records final-source Linux native input:
434 checks across18 profiles PASS. mobile-initial.json is a historical candidate.
guidance-complete.json and midgame-complete.json summarize16/160 and18 profiles;
their json.gz files retain complete original measurements. guidance-compact.json
records the immutable baseline/copy/layout inverses. All these checks PASS.

Initial Brave DOM runner stalled without a result; the pipe transport completed
layout assertions but sometimes failed browser shutdown on Windows. Chrome156
pipe rerun also retained a first-profile shutdown failure alongside passing
assertions. Preserve these distinctions; no timeout is a passing process check.
These early Windows failures remain distinct from later passing native input.

Initial Linux pre-merge failed the real candidate at320×640/200% text: party
bottom456 overlapped boost top454. The baseline's fragmented word was expected.
guidance-fixed.json and guidance-five-samples.json record PASS after removing
only the heading gap on short screens. This preserves the original layout gates.
The one-gap correction was subsequently replaced by the compact header below.

The later complete16-profile run exposed a safe-inset overlap on the two-row
short-screen layout. The final compact44px heading passes16 profiles/160 samples
(guidance-complete.json),18 midgame profiles and the complete immutable guidance
baseline/inverses (guidance-compact.json). Current source is pinned in these files
and in golden.json. Android0.2.60 in android-initial.json predates this layout.

Final signed test APK0.2.62: android-test.json and android-test-identity.txt.
Installed API31/WebView91 upgrade, all six native arrow/−10 taps, Rift1 bounds,
Push26, UID/origin, both saves, paid work and legacy purchases PASS. Packaged
source/assets were verified locally as identical. Android attempt1 missed its
existing offline recap before navigation; the unchanged retry passed. Preserve
android-recap-failure.json. Physical phone, exact WebView60 and TalkBack remain open.
All seven required CI workflows PASS: main189 scenarios plus isolated offline1,
with exact source/tree binding in ci-final.json. PR30 integrated90c20a26 has the
same complete tree as the tested merge. keyboard-fixed.json preserves all four
corrected native keyboard scenarios across12 profiles. Final receipt updates are
documentation only; tested application/test files remain unchanged.
