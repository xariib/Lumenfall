# AUTO_ASCEND_CHALLENGES_001 — earn Auto-Ascend Ritual

Status: combined candidate includes PR30 and depends on PR29; fresh CI/APK pending.
Owner: current feature chat; no delegation. Keep task/chat open until required acceptance.
Baseline: main41566c97020036934c9529b396420e910b41cb5f (Lab/Deeds PR28).
Branch: feature/auto-ascend-challenges-001; worktree ../auto-ascend-challenges-001.
[PR31](https://github.com/xariib/Lumenfall/pull/31).

## Accepted requirement and scope

30 October2026: “Auto ascend ritual is too easy to unlock. There must be some
challenges there too.” User accepted the recommended requirements with “Let's take that”:
25 Ascensions, highest Rift150,50 completed current Lab levels across6 subjects,
plus the existing100 Comet price. Every condition is required and progress is visible.
Saved milestones count; existing owners retain ownership/automation. No new save fields.
Retired subjects and unfinished paid/paused work do not count as completed.

Previously the Ritual cost100 Comets without gameplay prerequisites. Implement
first-purchase authorization in getCometBuyPlan/buyShopItem and live progress in
the existing Deeds card. Ascend's locked shortcut reaches the challenge card.
Preserve other prices/features, existing paid work, both saves/recovery, rollback,
Auto-Ascend targets/toggles and chronological online/offline simulation. Preserve
mobile/touch/focus,320px and200% text, WebView60 syntax and established Android identity.
No new binding rule. Standing task authorization covers necessary CI/integration/build.

Changed product: root index.html,59-line focused diff. Added canonical requirements,
four counters/checkmarks, visible/red-if-short100-Comet price, wrapping card/button,
locked shortcut focus, and shop-only viewport preservation after the tall list vanishes.
Existing owners bypass only the new challenges. No simulation or save-schema changes.

Tests: new auto-ascend-challenges.cjs and UI helper run from existing Comet entrypoints.
Old payment/focus fixtures now earn accepted milestones; original assertions, gates,
timeouts and causal controls remain. Native driver default expectation follows its
new eligible highest Rift150. bridge.js adds test-only native-input control. The
independent golden changes only its source hash after an unchanged-generator replay.

## Source and verification

Earlier-base candidate a54912a8db5ae67dfb0a121ba4a67607017a1608;
tree ec885729560dc4f29bb5d1743eca3cb3d54db0fa;
tested merge5f49b70b7e5ebb5e5d623561c0321f02f80317f0 has the same tree.
Earlier product SHA256 c2d44d074fe7fa4a0df56c33190804dd269d16adf43d0a84d10295225e03da1d.
Main remained41566c97 at the last check. PR29 Guardian taps and PR30 Rift navigation
also edit index.html; recheck current main/tested merge before integrating, preserving
other work. Native Git worktree was used after the managed nested sourceRoot failed;
core.longpaths fixed the first rolled-back checkout. Git-data publishing verifies
all blobs/complete tree because normal push has no usable credential.

Local Node24.20.0. Focused suite PASS118 assertions/seven causal controls: independent
missing goals/rich-wallet bypass/exact100 debit/duplicate rejection, real25th Ascend
and Rift150, retired/unfinished exclusion, schemas0..6 ownership, export/recovery,
primary/both failure rollback and recovery-only authoritative-primary acceptance.
Original Comet12 cases PASS. Original stationary matrix PASS492checks/96cases/three
controls on final source; Workshop UI PASS524/18profiles; offline focus PASS9profiles;
corrected native Auto-Ascend target PASS20profiles/clean teardown. Source validation PASS.

On preceding7af13586 source before the viewport-only correction: Comet12554, Forge9341,
permanent4003, feedback360/four controls, Lab/offline67/eight, target contract928,
complete Comet UI12470/12profiles/10causal pairs. Collection prices6180/four controls
passed on earlier41d9501b source; its receipt preserves that exact provenance.
Final CI reruns those paths on c2d44d07. Screenshots320px normal/200% top/footer were
self-inspected. One repeat UI run passed six profiles then failed browser shutdown;
it remains a failed run. Two exploratory wrong test names were corrected, not counted.
Evidence: [core](../qa/auto-ascend-challenges-001/core.json),
[local](../qa/auto-ascend-challenges-001/local.json),
[regressions](../qa/auto-ascend-challenges-001/regressions.json),
[focus](../qa/auto-ascend-challenges-001/focus.json),
[native target](../qa/auto-ascend-challenges-001/native-target.json).

Official checksum-verified Node24.19.0 ran the unchanged offline golden generator:
115200 independent one-second calls/four8h windows. Every released outcome AND full
state hash matched exactly; only sourceSha256 changed. Generator/old state hashes
unchanged. [Replay proof](../qa/auto-ascend-challenges-001/independent-replay.json).

## CI history and current checks

Earlier heads remain failed:4c6e1fce old payment fixtures;cfb725e7 enabled Workshop/
offline focus fixtures; a353ea3f stale independent-reference source binding.
Head963557f6 passed six focused workflows plus isolated offline, but main41118157227
passed187/189 cases: only two native target modes still bought at Rift56 without
goals. Corrected fixture/default now passes20 original native profiles locally.
[All189 prior outcomes](../qa/auto-ascend-challenges-001/ci-attempt-963557f6.json).
Product has stayedc2d44d07 since the viewport fix; no weakened acceptance.

Earlier-base runs: main41126703259, Comet41126703334, Lab41126703324,
permanent41126703234, shared UI41126703429, Tree41126703326, Forge41126703361.
Lab(two jobs), Comet, shared UI, Tree and permanent PASS; isolated offline job
124306976159 PASS. Permanent's first job124306975292 failed before any assertion
at CDP Browser.getVersion; same-head retry124308301979 PASS. Forge PASS. Main188/189: only enemy-normal-reload snapshot failed; all Ritual and native target cases PASS.
Verify all seven workflows/nine jobs against exact head/tree before merge.

## Android route, limitations and next action

The GitHub connector lacks dispatch; normal push credentials are unavailable.
User chose “I'll enable browser use”; browser API still reported disabled after
reset. Native Computer Use then stopped because it could not confidently determine
the browser URL on Windows. No further UI actions occurred this turn.

A supported Git-data fallback now runs the existing Android workflow on isolated
QA branch qa/auto-ascend-challenges-001-apk, commit4764c9839c0aa0bcfb036ac2573161a0e3a35854,
run41127553627. Only five trigger lines differ from the exact tested candidate;
index.html/mobile/tests/scripts are byte-identical. The added push trigger matches
only this branch/workflow path; absent publish input is false. Main/PR workflow
stays unchanged. Signing/package/assets/origin and installed emulator
upgrade/exact-APK receipt PASS. Local APK checksum8fb3bcdb matches the artifact;
embedded index.html matchesc2d44d07. Both saves/paid work/old Ritual ownership,
UID/origin and native Wisp touch retained on Android12/API31/WebView91.
[Build evidence](../qa/auto-ascend-challenges-001/android/build.json) retains exact
versions/hashes/artifact metadata and the browser limitation. Trigger retired
after the successful build; QA branch restored to the tested candidate tree.
No publication and no release claim.

Automated review covered initial4c6e1fce; later corrections were self-reviewed.
No independent human review, physical phone, exact WebView60 DOM, TalkBack or human
pacing/performance acceptance is claimed. Missing required acceptance keeps the task
open per [feature workflow](../project/FEATURE_WORKFLOW.md).



## Combined integration checkpoint

Main advanced during the final run: PR30 navigation merged at90c20a26, then
metadata1f316cc5ece42badac9fb53c851feaad18335ba9. The final preflight caught
that change before merging. No outdated-source integration occurred.
[Old188/189 run](../qa/auto-ascend-challenges-001/ci-attempt-a54912a8.json)
retains every result and the single enemy snapshot miss.

Rift navigation combined cleanly; only the golden source binding conflicted.
115200 independent calls preserved every original outcome/full state hash.
[Replay](../qa/auto-ascend-challenges-001/independent-replay-combined.json) and
[12 native profiles](../qa/auto-ascend-challenges-001/navigation-combined-ui.json)
PASS on intermediate eb4bfd67. APK0.2.63 is earlier-base proof, not this candidate.

PR31 now also consumes pending PR29 head1fb827eaaa95565e015b84426a2b49984b4ffe9d
as an integration dependency. Its tap/timing implementation remains owned by that
feature. DO NOT merge PR31 until PR29 is merged at the tested dependency head.
This lets the long CI pass validate all overlapping source together. Preserve
both Comet footer outputs after their test conflict: timer controls/source identity
and all118 Ritual checks/seven controls. No original assertion is removed.

Combined app SHA256:e5f2ee84f7422461b0f9b1e66d59567fd01d49437617d46475f725f08842d5fa.
Comet12/two timer controls plus118/seven Ritual controls PASS. Paired Windows
Node24.19 one-second candidate/dependency replays each made115200calls; all
actual full states match exactly, as do candidate Node24.20 results. Their
triples match PR29's new balance; local full hashes differ from its recorded
reference. Retain its reference vectors and run a Linux paired replay in the
isolated APK workflow. [Qualified proof](../qa/auto-ascend-challenges-001/independent-replay-tap-combined.json).

The enemy observer was measuring after host-startup combat. Pause only the two
static reload cases from boot. Both original ratio/tolerance/save-reload assertions
now PASS; deliberate HP-reset mutations still fail both. Product persistence and
clock are unchanged. [Observer proof](../qa/auto-ascend-challenges-001/enemy-reload-observer.json).

Next: finish/publish this dependency merge, rerun all seven workflows on the new
head (190 main plus1 isolated scenario), build a fresh signed non-publishing APK
with Linux reference proof, wait for PR29 integration, then verify the combined
product/test identity against current main before merging PR31. Save exact final
CI/integration/status receipts. Physical phone/WebView60/TalkBack remain open;
do not archive. No further Computer Use actions this turn.
