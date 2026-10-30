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

## PR31 and first CI findings

[PR31](https://github.com/xariib/Lumenfall/pull/31), head4c6e1fce,
treea35262a314caf2df44294d3246db6d24a493204f, exactly matches the local
candidate. Seven required workflows started; first main/comet runs41114331355/
41114331381 failed on older fixtures that bought the Ritual before challenges.
Updated only their eligible starting progress: stationary purchase, independent
Comet arithmetic, current permanent Comet browser, collection prices and wide
Comet wallet. Original debit, rollback, price, scroll and causal assertions remain.
The first stationary fixture had silently selected Astral Core when Ritual locked,
then checked boolean ownership instead of the Astral level; it now selects Ritual
explicitly with earned goals. Numerical1097372checks/seven controls and wide
Comet693checks PASS after fixture corrections. Collection prices6180checks/four
controls PASS. The first Lab and permanent workflows passed.

The corrected stationary fixture exposed an introduced320px/200%refresh scroll
jump after buying Ritual: its taller challenge list disappears, leaving the
surviving focused Open Ascend button offscreen. Preserve the shop focus snapshot
even offscreen on later refreshes; other viewport capture callers retain their
old policy. Also emit owned-only hidden challenge markup before layout. Tests/
tolerances unchanged. Initial scroll failures and the insufficient markup-only
attempt remain recorded locally; final original scroll rerun pending.

Final scroll rerun PASS on productc2d44d074fe7fa4a0df56c33190804dd269d16adf43d0a84d10295225e03da1d.
The complete original fixture matrix and all three causal controls pass unchanged.
Focused118/seven controls and original Comet12cases also PASS on these bytes.
Corrected full Comet browser suite PASS12470checks/12profiles/10causal pairs on
preceding7af13586 product bytes; final CI will exercise the viewport correction.

The GitHub connector cannot dispatch Android workflows. Browser tool reports
“Local browser use is disabled in Work settings”; no settings change attempted.
Continue CI/integration through connected GitHub, then record Android build as
pending until an authorized dispatch path is available. No signed build exists
for this feature yet. Physical phone/WebView60/TalkBack also remain open.

Second headcfb725e7/treef12885919f4bce4f7f2d9bc38d69c774b7ad29bd:
Comet, Lab and permanent workflows PASS. Main41115551829 passed the corrected
stationary/rollback, clock replay, full-game audit and native Lab input checks,
then failed an older workshop focus fixture: it focused a now-disabled Ritual
button without the required milestones. Supply earned goals for that fixture;
the existing action-focus/pure-refresh assertions stay unchanged. Local workshop
UI PASS524checks/18profiles on productc2d44d07. Also qualify offline12h UI's
Ritual focus fixture so its focus assertion continues testing an enabled purchase,
with all original refund amounts/keyboard/contrast checks retained.

Third heada353ea3f: Comet/Lab/permanent/shared UI/Tree workflows PASS; isolated
offline job PASS. Main41116475538 passed prior fixtures, progression, boosts,
identity/tooling/source checks, then rejected the stale independent reference's
source hash. Downloaded official checksum-verified Node24.19.0 Windows runtime;
ran the unchanged generate-offline-swift-golden.cjs --write:115200independent
one-second calls. All four released outcomes AND full-state hashes match exactly;
only the golden sourceSha256 line changes. [Replay proof](../qa/auto-ascend-challenges-001/independent-replay.json).
Preserve the generator, original state hashes, all gates and replay assertions.
Final CI will validate this binding; no gameplay changes after productc2d44d07.
