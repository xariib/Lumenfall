# PERMANENT_PROGRESSION_UI_001

Status: implementation and regression acceptance in progress. PR14 is draft; main and Android are unchanged. No APK publication in the approved upload/PR scope.

Baseline main:73f4e3f17504cba50276a17c374d7c4c78a5f7f5 (Android0.2.43). Branch:codex/permanent-progression-ui. PR:https://github.com/xariib/Lumenfall/pull/14. Current remote checkpoint2f2d0dcbf0df51a4e1838bea618b81c05f4a89c2; working source9894ed09f9753b3fd76e4092bf7f78e70ab861604a705d44c2de0c9387ccb7fd awaits publication. All uploads use bounded Base64 chunks and exact local/remote Git blob verification; large shell-output transport can truncate the monolith silently.

## Requirements and authorization

The user approved the public source upload and PR on27 October2026: "Godkendt", replying to the exact source-upload/PR permission question. No repeated permission is needed. Do not use subagents or rename chats.

- Remove open/close upgrade controls from game cards. Unfinished Wisp upgrades remain directly visible; completed sections become gold and their completed purchase controls disappear. The whole Wisp is gold only after Empower10000, Rarity5, Ability20, Ultimate and Mastery2000. Keep readable inline ability explanations, original progression and native same-card focus.
- Rift-locked upgrades show "Unlocks at Rift XX" without currency prices. Preserve prerequisite enforcement and earned access.
- Five compact Lab slots, inspired by The Tower: click the row/name to choose research, no Change button. Back to Labs returns to slots. Separate Speed Up editor and visible timed summary. Existing paid work, slot associations, saved old-speed floors and independent slot-owned boost deadlines survive changing/clearing research and offline play. No recurring Mote purchases.
- Choose an earlier cleared non-boss farming Rift without Ascend, including a12-back shortcut. Preserve the current Push frontier, max-depth history and all currencies; Push returns to that frontier. Save/reload retains the exact chosen Rift. Primary failure rolls back the complete switch.
- Fixed Forge multipliers buy exactly the selected count or nothing; show the full exact requested cost, red for each insufficient resource. Reject a fixed count that exceeds remaining cap. Only Max buys an affordable remainder. Preserve original price/effect arithmetic and free queued1x behavior.
- Remove Comet commands and consumable purchases, including Quest Refresh. Comets fund difficult permanent Wisp investments. No tournament/mission-box system was requested or invented. Auto-Ascend remains100Comets.

## Current design and save contract

Astral Core:Rift250/base750Comets/×1.25 own Wisp Power per rank. Astral Echo:Rift500/base1250/×1.3 automatic ability damage and Lumen/Shard ability rewards. Astral Convergence:Rift1000/base2000/×1.25 unlocked Ultimate damage/rewards and Support Ultimate bonus strength. Each has10 permanent ranks, costs ceil(base×1.2^rank). No consumable charges or manual activations.

Schema6 adds a strict closed astralUpgrades map and commandRefund:{policy:'commands-retired-v1',total,paid}. Retain original command ownership/ranks/earned events/claims as immutable history; refund original known prices once. Unrepresentable native credits remain pending, wide credits stay exact. A saved already-called enemy still earns its old objective once on its real defeat. No recharge or new commands. Invalid current ranks/refund receipts protect both raw saves and block overwrites while displaying valid recovery. Old migrations, balances, paid work, timers, chronology, natural Motes, package/certificate and other progression are preserved. No transient action glows.

## Files and validation

Product:index.html. Focused tests:permanent-progression.cjs, permanent-progression-offline.cjs, permanent-progression-ui.cjs, permanent-progression-controls.cjs and permanent-progression-v8.cjs in tests/behavioral. Existing regression tests are adapted individually for removed disclosures/commands and fixed quantities; no workflow/gate is disabled. generate-offline-swift-golden.cjs independently advances one-second windows and verifies all four protected historical kill/Ascend/Prism count tuples before rebinding the source hash. Required original workflows remain enabled, with an additive permanent-progression validation workflow.

Passing current/recorded milestones:

- Core3,748 checks;13 semantic mutants; offline214 checks plus5 offline source controls; actual Node8.3/V8 6.0 permanent acceptance1,267 checks, including133 valid old paid subsets and all current prices, faults, cold backups, lifecycle and saved Call completion.
- Original Comet numerical lane1,097,372 assertions/8 controls. Core retained over12,000 checks. Forge9,335 assertions/25 mutants; Lab2,676/10. Original Forge V8:2,486; Tree V8:2,881; Lab V8:580.
- Native focused progression416 checks/18 profiles; Lab editor1,182/12; concise cards524/18; original Lab expansion6,588; Tree26,756; Wisp layout23,760, compact37,386 and scroll/focus3,277. Full old Forge contracts6,254 plus4 mutants and real balance/native purchase audits pass after updating full-quote accounting.
- All15 retained model suites pass on766e (wide amounts, income, counters, controls, chronology, campaign offline, Wisp preservation, Support recast and early curve). Endlessly scaled mobile acceptance passes853 checks on9894, including actual Lab recommendation navigation. Navigation now opens the requested active slot's Speed Up editor before focusing its real slider, with no payment or saved preference change.
- Original isolated offline CI passes on539f, as do original Comet/Deeds (including exact two-hunk protected-warning source reversion), Lab and focused progression CI. Local pinned Node24.19 isolated offline also passes unchanged deadlines, all long windows, boundary chronology, rollback/retry/recovery, host cost and wall-clock cases.

Exact full CI on the final committed source remains mandatory. The latest premerge failure on539f was a test-only stale DOM reference after opening Speed Up in a fresh iframe; fixed lab-ui.js requeries the live card/control. Settled320/390/430px tests pass and2f2d contains that fix. The189-case local main run launched before that last test fix can still report its old failure; do not mislabel it current acceptance.

Local Chrome156 native hints input also fails the same untouched assertion on unchanged main. Keep its assertions/deadlines and compare committed CI; do not weaken it. [Baseline control](../qa/permanent-progression-ui-001/guidance-baseline-control.json). [Retained model results](../qa/permanent-progression-ui-001/retained-model-regression.json). [Historical checkpoints](../qa/permanent-progression-ui-001/implementation-checkpoints.md). Earlier candidate receipts remain historical, not proof of the new hash. A local protected-warning wrapper correctly rejected concurrent source edits; only the closed committed CI receipt counts.

## Next action and completion

Publish9894 with its independently rebound golden and corrected late-Lab navigation. Then inspect all required CI on one committed candidate, fix regressions without bypassing gates, and finish the current native/full-suite results. Full product diff has been reviewed against baseline (self-review, no independent reviewer). Recheck main for overlapping work before integrating. Merge only after required checks pass; verify the integrated source exactly matches the tested source. Save final status/evidence in this task and PROJECT_STATE. Android/device acceptance remains a separate unresolved delivery limitation; do not claim a released APK or completed device acceptance. Do not archive while acceptance is open.

Latest remote candidate is70a54dbdb9d4429105dde2e43816e0013c34687f (source9894). The original premerge lane passed settled startup UI and isolated offline, then stopped because the unchanged historical RIFT_HINT_READABILITY_002 task exceeded the mandatory32KiB startup budget. Its repeated historical prose is condensed with acceptance, counts and evidence links retained; the budget/gate is unchanged. Publish this documentation-only fix and rerun original CI. All15 automation-clock/cycle suites additionally pass locally on9894, including persistence, resource/native-wallet replay, split, overflow and causal controls.

The existing installed-APK driver also assumed an upgrade disclosure. It now requires directly visible unfinished upgrades and retains the real Android touch purchase, exact debit, geometry, recovery and identity checks. This updates acceptance to the approved UI; no Android acceptance is claimed before a successful non-publishing emulator run. The build workflow's publication input remains false unless separately within approved release scope.
