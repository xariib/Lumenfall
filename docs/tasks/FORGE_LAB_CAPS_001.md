# FORGE_LAB_CAPS_001 — explicit high-cap decision

14 October 2026. Owner: this chat. Status: proposal locally verified; user
balance decision REQUIRED before implementation. Local work only; no delegation,
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

## Verified proposal checkpoint

Read live affected catalogs, prices/effects, study work/modifiers, purchase/cap/
scheduler and normalization paths, current Forge/Lab expansion requirements and
designs, plus campaign evidence. Historical requirements do not add new gates.
No product/assets/test implementation change. No cap or blanket rebalance chosen.

[Full proposal and implications](../qa/forge-lab-caps-001/PROPOSAL.md),
[40-entry live catalog](../qa/forge-lab-caps-001/CATALOG.md) and
[source-bound receipts/commands](../qa/forge-lab-caps-001/README.md) are saved.
Suggested choices (subject to user decision):

- A recommended: Arcane Calibration/arcanecal=20, Resource Conduction/conduction=20,
  Boss Survey/bossledger=20, Luminous Distillation/luminousdistill=20.
- B: same four IDs, Forge=50 and Lab=20. Very late Forge material sinks, new
  reachable quote precision requires additional handling/coverage.
- C: current caps10 for those IDs. Explicit named subsets/caps are also allowed.

Other caps/rules remain in all choices; five current Lab foundations are
uncapped and are not silently capped. Existing per-level effects, unlocks,
cost/work growth, speed tiers, discounts, running paid work, current refund/value
records and productive offline cap remain. Upward caps retain raw historical
levels, including effective effects under the newly chosen cap; no erasure or
new refund. No independent-review claim; complete diff self-reviewed.

Cap20 costs and times are formula estimates, not campaign reach guarantees.
Boss Survey/Luminous Distillation final cap20 levels require9.70/12.93 days of
neutral work, or14.26/19.01 hours with existing maximum work reductions and8x.
Final Lab50 alone would require113/150 productive years even in that optimized
case, so it is not recommended without a separate work-curve decision.

Node24.19.0. Exact current product source remains the baseline hash above.
Catalog review403 assertions PASS;35 capped IDs reject next purchase/start with
unchanged state; all20+20 active entries recorded. Existing Forge9315/25 causal
controls, Lab2465/10, reward/purchase-boundary2344/5 PASS on this exact source.
Source syntax/16 IDs/lifecycle and actual task context/links/budget/whitespace PASS.
These results cover current rules, not an unchosen extension or Android.

Unrelated baseline finding saved in evidence: the original Forge generic bulk
price path has one-unit discrepancies versus rational ceil for11 Arcane and13
Conduction queries within the existing cap10. Exact quoted debits still pass.
No old quote repricing or refund is introduced. Extended cap50 queries show
additional differences up to2/7 units; handle new reachability if B is selected.

Changed files: this task, PROJECT_STATE, local queue and docs/qa/forge-lab-caps-001/
catalog review helper/generated catalog/proposal/baseline receipts/preview manifest.
Current index.html/fonts/branding refreshed in ignored mobile/www; all 15 files
match source/staging/HTTP. [Preview manifest](../qa/forge-lab-caps-001/preview-assets.json).
The playable preview stays the accepted game at http://127.0.0.1:4174/index.html.
App opening returned queued; visible-tab inspection is not claimed.

## Required decision and continuation

Next: user selects A, B, C or explicit named IDs/numeric caps. TASK7 itself requires
this gameplay decision; do not infer approval from elapsed time or the earlier
comment. Save the decision here before implementation. Then only agreed IDs may
change; run the acceptance matrix above plus current Forge/Lab suites, relevant
mobile/core/source gates and source/asset checks before a new local checkpoint.

Keep task/chat OPEN. Inherited Prism deadline, Windows standard dump-DOM/POSIX
tooling, final combined/full required CI and Android/device/WebView60/textZoom/
TalkBack acceptance remain pending. Browser/VM checks do not prove Android.
No remote/push/APK/signing/archive action.
