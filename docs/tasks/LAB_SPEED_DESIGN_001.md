# Lab Speed Up design

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
Final product SHA256017fb8594aff3f4dbc1c341e0c546356c4bba37fcaf7706514e0939ebe862409:
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
Main remains1f316cc5. After green CI, merge PR32 with remote head136b0dad pinned,
fetch/fast-forward this worktree, retain pending evidence edits, update this
task/PROJECT_STATE and publish documentation. Verify integrated product hash
and APK assets still match017fb859. No public release or chat archive yet.
Physical phone/WebView60/TalkBack and human visual acceptance remain unverified.

Sources: [previous queue contract](LAB_BOOST_QUEUE_001.md),
[workflow](../project/FEATURE_WORKFLOW.md), [product](../../index.html).
