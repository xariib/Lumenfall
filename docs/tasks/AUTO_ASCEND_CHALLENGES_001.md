# AUTO_ASCEND_CHALLENGES_001 — earn Auto-Ascend Ritual

Status: local implementation/targeted checks PASS; PR/CI/integration pending.
Owner: current feature chat; no delegation.
Baseline: origin/main41566c97020036934c9529b396420e910b41cb5f.
Branch: feature/auto-ascend-challenges-001; worktree ../auto-ascend-challenges-001.

## Original requirement and accepted choice

30 October2026: “Auto ascend ritual is too easy to unlock. There must be some
challenges there too.” Goal: add meaningful challenges before first purchase.
Current verified behavior: Auto-Ascend Ritual costs100Comets and has no gameplay
prerequisites. Other automation gained multi-condition challenges in PR28.

User accepted the recommended concrete set with “Let's take that”:
25Ascensions, highest Rift150,50completed current Lab levels across6subjects,
plus the existing100Comet price. Every condition is required with visible progress.
Existing owners retain ownership/automation; saved milestones count. No new save
fields. Retired subjects and unfinished paid/paused work do not count as completed.

## Findings, scope and acceptance

Purchase authorization is getCometBuyPlan/buyShopItem; presentation is
cometBuyRequirement/updateCometShopCard/renderAchievements. Ascend's locked card
links to the Deeds purchase. Persisted owned.autoascend is already preserved by
normalization. Ascend count, highest Rift and completed Lab levels are available
without new save fields. Count only current, nonretired Lab studies. Preserve
Comet prices/other purchases, paid work, both saves/recovery, rollback, Auto-Ascend
targets/toggles, chronological online/offline behavior, mobile/touch contracts.

Acceptance after a choice: each independent missing requirement and exact boundary;
purchase fails without currency/state mutation while locked; exact100Comet debit
and permanent ownership when eligible; saved owners remain usable below new gates
through normal/recovery load; readable live progress at320px and200%text; existing
purchase/Ascend/save suites and required CI pass. Integration/Android acceptance
follow [feature workflow](../project/FEATURE_WORKFLOW.md).

Open overlap: PR29 changes Guardian taps/clock scheduling and PR30 changes Rift
navigation in index.html; those changes concern different implementation areas.
Do not overwrite them; rebase/recheck current main before integration. PR2 is a
separate docs audit. Current main remained41566c97 at the last local fetch.

Managed worktree creation rejected the nested sourceRoot; a native Git worktree
was created instead. Its first checkout failed on Windows long paths and rolled
back; enabling repository core.longpaths and retrying succeeded. No product edits.

## Checks and next action

Local Node24.20.0. Baseline comet-unlocks-core.cjs PASS12cases, including exact
purchase debits, normalization/backup/recovery, live/offline chronology and atomic
failure/retry. Context checker PASS29entrypoints/61links; shared startup20358bytes,
with this task23507bytes before recording this result (below unchanged32KiBbudget).
New auto-ascend-challenges.cjs PASS118checks/seven causal controls. Original
Comet12cases also PASS, with the accepted unlock fixture and new suite integrated.
validate_source.cjs PASS. Initial test incorrectly expected recovery-only write
failure to cancel payment; existing authoritative-primary policy accepts that
payment. Corrected coverage explicitly checks primary/both-failure rollback and
recovery-only successful primary commit/unchanged older recovery. Product save
policy was not changed.

Product changes: canonical first-purchase gate, per-condition live progress,
price retained/red when short, wrapping card/button, locked Ascend shortcut focus
to disabled purchase's card. Existing-owner gate bypass only; purchase still
requires canonical lifecycle/currency/exact debit. No simulation changes.
Tests use the existing Comet core/mobile entrypoints so required CI runs the new
coverage without workflow edits. New browser helper covers native touch, focus,
live affordability,320/390/430px with normal/200%text and both motion preferences.
Next: finish UI and existing Ascend regressions, review diff, publish PR/run gates,
integrate and verify required Android artifact. No completion claim yet.

Local final product7af13586c602739c3812d7c1c5204938e69d78c1ce27e80a329dfe9c51df6a9b:
Comet12554checks; Forge9341; permanent4003; original feedback360/four controls;
Lab/offline67/eight controls; browser Auto-Ascend contract928 PASS. All12Comet
phone/text/motion profiles PASS, each exercising new live progress, native locked
and paid input, exact debit/both saves, no overflow and disabled-shortcut focus.
320px/200% screenshot self-inspected. [Core](../qa/auto-ascend-challenges-001/core.json)
and [local receipt](../qa/auto-ascend-challenges-001/local.json).
Two exploratory commands used nonexistent test names (auto-ascend-target-core and
forge-expansion-core.cjs); corrected contract/forge-expansion commands passed above.
No acceptance claim comes from those failed invocations. No independent human
review, physical phone, exact WebView60 DOM or TalkBack acceptance is claimed.

Repeat normal-motion UI run completed all6profiles with all assertions passing,
then failed the existing browser-close deadline; it is not an overall PASS.
Earlier12profile PASS receipts remain source-qualified. The repeat added only
the extra screenshot of the tall320px/200%card's top. Its top and footer were
self-inspected. Git credential helper hung; stopped only this task's push tree.
Noninteractive push reported no usable password. Publish via connected GitHub
Git-data tools instead, checking every blob and complete tree against local Git.
