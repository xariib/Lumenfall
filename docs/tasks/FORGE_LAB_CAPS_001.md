# FORGE_LAB_CAPS_001 — explicit high-cap decision

14 October 2026. Owner: this chat. Status: LOCAL IMPLEMENTATION VERIFIED for A.
User balance decision saved below. Local work only; no delegation,
new chat, remote/push, APK release or signing change.

## Original requirement

TASK 7: review allowing very high caps on some Forge upgrades and Lab projects.
Inspect the current catalog and propose specific named upgrades/projects with
numeric caps and cost/effect/pacing implications. Ask the user which proposal to
implement before changing balance. The comment permits consideration, not a
specific cap or blanket rebalance. After the decision, implement only agreed
changes and verify saved progress, paid value/refunds, old saves, online/offline
parity and finite prices/effects.

## Baseline and scope

Read AGENTS.md, PROJECT_BOOTSTRAP.txt, [state](../PROJECT_STATE.md),
[queue](LOCAL_IMPROVEMENTS_PLAN_001.md), CODEX_START, CONTEXT_INDEX and workflow.
Clean `local/full-debug` at `27f433da85d367d195fe743be29706d0f1905462`, latest local
Rift label checkpoint. No overlapping dirty edits observed. Current source hash:
`f8f787fd4a520ec277b350f40c6caeefa519c48cb55ddeb9bbe486e4cd0200b6`.
Use live catalogs/functions and current expansion requirements; historical
proposals do not authorize changes.

Initial milestone: reproduce/measure current cap behavior, inspect actual prices,
effects, study work, unlocks and migration paths; save source-bound catalog and
specific options locally. Keep product/assets/tests unchanged while awaiting the
user's numeric balance decision. Do not infer a lower or higher cap from the
older queue wording; the current request is to consider allowing high caps.

## Acceptance after decision

- Record the chosen IDs/caps and any explicitly approved price/effect changes.
- Targeted implementation only; preserve unaffected systems and paid value.
- Cover old/current save loading, existing levels and queued/active work, refunds
  only if required, idempotent migration/backup/recovery, offline/live parity,
  cap/bulk/scheduler boundaries, finite prices/effects and mobile UI.
- Run focused and relevant existing gates without weakening tests. Review full
  diff, update task/state, commit local checkpoint, refresh current mobile/www
  assets and show playable preview. Keep any required blocked acceptance pending.

## Verified pre-decision proposal

Review saved at `fe42861`: [full proposal](../qa/forge-lab-caps-001/PROPOSAL.md),
[original 40-entry catalog](../qa/forge-lab-caps-001/CATALOG.md),
[source-bound receipts](../qa/forge-lab-caps-001/README.md). Reproduced 35 old cap
gates with 403 checks; existing Forge9315/25 controls, Lab2465/10 and boundary2344/5
PASS on baseline f8f787fd. Recommended A20 for four IDs; B Forge50/Lab20; C unchanged.
High Lab50 work takes113/150 productive years for the final level under best
existing reductions/8x; no work-curve retune was authorized. Five foundations
stay uncapped. Existing one-unit original Forge quote discrepancies are recorded
as a separate baseline finding; no old quote repricing/refund.

## Required decision and continuation

### User decision — 14 October 2026

User selected **A: All four to 20 (Recommended)** in the explicit choice prompt.
Implement arcanecal=20, conduction=20, bossledger=20, luminousdistill=20 only.
Other caps and price/effect/work curves remain unchanged. Saved levels/paid work,
speed, queues and existing refund/value records must be retained. No blanket
rebalance, downward cap/refund or other catalog change is authorized.
Decision baseline: clean `fe42861fce2895c24b9e24de18714606973481ea` proposal
checkpoint on `local/full-debug`; product hash still `f8f787fd` above.
The choice fulfills TASK7's gameplay decision requirement; no repeated permission
request is needed for the selected implementation.

## Verified implementation checkpoint

Candidate source SHA-256:
`509b2dcb98f45207d4b9125cbf39f194adcb58e05690381d306352c733b0b050`.
Node24.19.0 / Chrome151.0.7922.34. [Current evidence](../qa/forge-lab-caps-001/IMPLEMENTATION.md).
Only six product lines change: four cap fields and two Lab endpoint descriptions.
Arcane source factor now caps1.60; Conduction1.80; Boss Survey+100% Lumen/Shards;
Luminous Distillation+200% Lumen/Shards. All other catalog properties match the
accepted baseline. Prices/work/per-level effects unchanged. Saves/paid active
work/speeds/queues/refund records retained; upward caps need no new migration/refund.

Focused2179/3 causal controls; existing Forge9315/25, Lab2675/10, boundary2344/5,
charge/combat calibration3134/7 PASS. Existing eight Forge browser scenarios PASS
(contracts6105/effects1952/chronology13/balance36 plus save/restore/recovery/baseline).
Focused mobile552/12 profiles and full existing Lab mobile6588/12 PASS,320/390/430px,
normal/200% root text and both motion modes. Rift1738/navigation415 PASS.
Source syntax/IDs/lifecycle, context/startup links/budget and whitespace PASS.
Complete diff self-reviewed; no independent review. Tests retain all original
assertions, update only approved cap expectations and add boundary coverage.

Two test diagnostics corrected before acceptance: an unquoted numeric selector
in the new mobile driver, and the old chronology fixture treating10 as maxed.
Receipts saved; final source-bound checks pass. No product regression established.

Current source/fonts/branding staged in ignored mobile/www; all15 files match
source/staging/HTTP. The open playable preview reloaded; both complete scripts
match current source (`22ed0bd0` combined hash), both Forge20 caps observed.
No user save/queue/balance preferences edited in the preview; production keeps
running normally. [Preview](http://127.0.0.1:4174/index.html).

Changed: index.html; tests/behavioral/forge-lab-caps.cjs and mobile driver;
forge.js/bridge.js/lab-expansion.cjs approved cap expectations; task/state/queue
and docs/qa/forge-lab-caps-001 evidence/preview helper. No archived code promoted.

## Next action and deferred acceptance

Next: user reviews the playable preview. Rerun focused caps (using immutable
fe42861 baseline history), Forge/Lab/calibration/boundary/mobile and earlier
improvement preservation checks on the eventual final combined source, with
full behavioral/required CI and staged-asset verification. Keep original quote
diagnostics separate; selected cap20 creates no new rational price discrepancy.

Keep task/chat OPEN. Inherited Prism deadline, Windows standard dump-DOM/POSIX
tooling, final combined/full required CI and Android/device/WebView60/textZoom/
TalkBack acceptance remain pending. Browser/VM checks do not prove Android.
No remote/push/APK/signing/archive action.
