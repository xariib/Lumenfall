# Lab Speed Up design

## Current checkpoint —31 October

Both approved upstream updates are retained: main3f74661b includes Tap/PR29
and Auto Ascend/PR31. This feature still changes only Lab presentation/input.
Published PR32 headff92edf204dcd93b17fe75494da01300c4c2558b. Final pre-merge
run41143134106; signed non-publishing build41143127589. Other required runs:
permanent41143134150, Comet41143134059, Forge41143134116, Lab41143134170,
shared UI41143134039, Tree41143134073. All seven must pass before integration.
The receipt helper outside this checkout is updated for these exact head/IDs.
The app-code head above is now followed by a documentation correction:
pre-merge41143134106 passed browser/boost/screens, then failed the unchanged
32KiB startup gate after upstream status documentation grew. Shared21007+
RIFT_HINT_READABILITY_00212299=33306 bytes. Compact status summaries retain
task/release/evidence links; shared19888+task12299=32187. All31 workflow-selected
task checks PASS (`context-gates.json`); budget/checker unchanged. Failed log
and byte counts are retained. The documentation head needs fresh seven-gate
CI; all app/native-check code still matches tested ff92edf2 and the APK below.
Signed Android0.2.68/code1000068 PASS on build41143127589 attempt2, unchanged
ff92edf2 source and assertions. Attempt1 missed the first native Rift back-one
tap (25rather than24); log, calibration and diagnostic logcat are retained.
Attempt2 passes installed upgrade, both saves/paid work/legacy entitlements,
UID/origin, Wisp/Farm/native Rift navigation and all15 packaged assets.
Downloaded APK SHA256090b59c73c439864993eebae79ed5e2f7a85cec9627804b36b895006c38e302c,
local ../lab-speed-design-android-final/Lumenfall.apk. No public publication.
Final asset/identity/upgrade receipts use the `final-` filename prefix.
Current product SHA256c1c2e46bc9cf2c24b12cb3010b388fbda72aabfd20ddf6d915bd00f5d85b791b.
Preset668/18profiles and cap20 mobile552/12profiles PASS on these exact bytes.
Four paired one-second replay windows match every full endpoint state against
accepted main3f74661b; its canonical oracle fields are retained, binding updated.
`replay-current-main.json`, `presets-ui-current.json` and `caps-ui.json` qualify
this source; older receipts below are explicitly historical.

Tap/UI head30de063 CI41141947643 failed cap20 browser readiness with
`Inspected target navigated or closed`; raw failed log is retained. The same
unchanged cap test passes552checks locally on final source. Its generated
readiness poll now tolerates only the expected navigation-context transition,
inside the original10000ms deadline. Every game/input/payment/reload assertion
is retained. `readiness-controls.cjs/json` proves navigation retry, immediate
game/browser error propagation, original deadline and original-defect detection.
The corrected matrix also passes552checks/12profiles. No product workaround.

Next: finish/publish the current-main merge, run seven required workflows and
a fresh signed non-publishing APK on that combined head, fix any actual failure,
then integrate PR32 and save final PROJECT_STATE/task/CI/build receipts.
APK0.2.66 and the intermediate tap build qualify older sources only; a fresh
combined APK is required. Physical phone/WebView60/TalkBack/human acceptance
remain open. No public release or chat archive. No local tests are running.

Original request, 30 October 2026: make the Lab Speed Up box close to the
supplied The Tower screenshot, using Lumenfall's game design. Reference1 shows
duration presets, a4×2 multiplier grid, selected boost/cost, queue and actions.
Reference2 shows the current Lumenfall dropdown/slider dialog.

Owner: this chat. Goal: implement that compact preset layout with Lumenfall's
navy panels, teal borders, violet speed choices and serif title.
Baseline: main1f316cc5. Isolated branch feature/lab-speed-design-001.
Open PR29 (tap balance), PR31 (Auto Ascend) also edit index.html; retain their
work during integration. No agents or other chats used.

Preserve8/12/24h, discounts, eight speed tiers, Mote prices, active paid timers,
editable next plan, independent boost/research queues, saves and progression.
Keep the native slider/duration controls available in a collapsed disclosure.
No new gameplay rules or save migrations.

Acceptance: direct duration/multiplier touch and keyboard choices, clear selected
state and quote, queue and active timer retained, red unaffordable quote/disabled
purchase,44px controls,320/390/430px and enlarged text, modal focus/Escape,
existing focused Lab regressions and relevant CI. Save a visual preview.

Status: implemented locally; final verification and delivery in progress.
New duration row and4×2 speed grid use pressed-state buttons. The collapsed
Slider controls disclosure preserves the original native input path. Selected
plan and Mote quote sit above queue; Cancel/Speed Up share the final row.
Paid-boost settings, simulation, prices and save formats are unchanged.

Baseline queue UI327 checks/18profiles PASS. Preset input650 checks/18profiles,
slot modal452/18profiles and permanent UI434/18profiles PASS on candidate1174d446
(product SHA256 prefix). Clarity524/18profiles passed the earlier layout.
Disconnected-preset and locked-next defect controls fail their intended
selection assertions. The final disclosure tabindex correction is under
revalidation. Native Tab checks must follow the new preset/disclosure/Cancel
order; their earlier stale-order failures are retained in local logs.
Node24.20.0, Chrome156.0.8078.80; independent one-second replay uses pinned
Node24.19.0. Four released complete-state hashes match; final binding rerun
in progress. Source syntax/lifecycle and diff checks PASS. Self-review only.

Changed product, focused preset UI test/harness, legacy Lab UI tests (explicitly
open native disclosure; retain input/payment/focus assertions), CI and this task.
Original candidate SHA256017fb8594aff3f4dbc1c341e0c546356c4bba37fcaf7706514e0939ebe862409:
preset input668/18profiles, timed UI1182/12profiles, native Lab1212/6profiles
and core379+67checks/13controls PASS, including disclosure keyboard traversal.
The first local timed run stalled after its browser exited and was interrupted;
a rerun with progress logging (assertions unchanged) completed with clean teardown.
Pinned independent replay regenerated all four unchanged complete-state hashes;
only source binding changed. [Preview and receipts](../qa/lab-speed-design-001/).
PR32: https://github.com/xariib/Lumenfall/pull/32; head136b0dad.
Six of seven required workflows PASS. Pre-merge41136000061 has passed every
focused stage and its separate offline job; the complete stateful suite is now
running on head136b0dad. Remaining workflow IDs: permanent41135999975,
Comet41135999987, Forge41135999991, Lab41135999974 (both jobs),
shared UI41136000074 and Tree41136000016 (all success).
Signed non-publishing Android test build:
https://github.com/xariib/Lumenfall/actions/runs/41136004956.
Android0.2.66/code1000066 PASS on136b0dad: installed Android12/WebView91 upgrade,
both save slots, paid work, legacy entitlements, UID/origin and native controls.
Downloaded APK SHA25686f9d0d1086ac858b99c8ff38ca53f6f4e289e569b396d5582500532d9c2122e;
all15 packaged assets verified locally byte-for-byte against this product.
Receipts: emulator-upgrade.json, android-identity.txt, downloaded-apk-assets.json
in the evidence directory. APK retained locally in ../lab-speed-design-android/.
The available OAuth credential cannot push workflow changes; preset checks run
through the unchanged workflow's existing boost-queue entrypoint, with separate
presetProfiles diagnostics and all original queue profiles/assertions retained.
Next: finish CI and signed test APK acceptance, serialize main integration with
PR29/31, then save final receipts/status. No public release requested here.
Delivery tooling: ../lab-speed-design-ci-receipts.cjs asserts all seven final
run heads/jobs and writes ci.json. Native/core/timed/Android receipts are saved
locally but not pushed yet (avoid restarting source-qualified CI for docs).
No local test processes remain. Git global credential helpers were restored to
the original manager; use a per-command gh credential helper for Git writes.
## Upstream integration checkpoint

Main advanced to92e7497d (PR29/tap balance941538d0) during original CI.
Merged locally; only the golden source-binding line conflicted. Product merges
cleanly and differs from new main only in this UI's53added/7removed lines.
Combined product4c8523a47aab09f05da45e589a7fe2445971eb9538c436e32d7bc447f18a6e13:
preset668checks/18profiles PASS. `replay-current-main.json` proves all four
complete endpoint states equal current main on pinned Windows Node24.19.0.

The old generator still hardcodes pre-tap rewards and correctly rejects the
new approved main outcomes. It remains unchanged. The new portable
`tests/behavioral/lab-speed-replay-compare.cjs` uses the same one-second calls,
asserts approved baseline rewards and exact baseline/candidate state equality.
This host's baseline state hashes differ from accepted canonical hashes;
the paired baseline/candidate hashes match exactly. Preserve main's canonical
oracle fields and change only their source binding after this proof.

Original PR32 CI136b0dad is still running; retain its eventual receipt as
ci-original.json. It does not qualify the combined source. Test APK0.2.66
likewise qualifies only original017fb859, not the new tap baseline.
PR31/Auto Ascend2a3a54ab is also finishing checks; do not promote unmerged work
or treat another open feature as an approval gate. Main merge completed locally
at e17908c; publish this verified tap/UI combination now. Its new PR head will
restart required CI and supersede the original in-progress run (cancelled by
normal workflow concurrency, not a test failure). Incorporate PR31 only if it
is accepted into main before this feature integrates.
Next: publish the combined head, run seven gates and a new signed test APK,
incorporate any actual main advance, then merge and save final source-qualified
documentation. No public release/archive yet.
Physical phone/WebView60/TalkBack and human visual acceptance remain unverified.

Sources: [previous queue contract](LAB_BOOST_QUEUE_001.md),
[workflow](../project/FEATURE_WORKFLOW.md), [product](../../index.html).
