# SUPPORT_DURATION_001 — Support uptime and damage display explanation

Status: in progress; Lab progression choice awaiting user response. No gameplay changes.

## Original request and scope

16 November 2026 user request:
> We need to fix that the supports ability is not only 1 second, in late late game players would have a chance to maintain it 100% uptime. Rift screen showing another dmg number than the wisp menu? Is the dmg number in the rift the ability dmg?

One goal: make Support duration support the agreed late-game uptime and explain
the existing Rift/Wisp menu numbers. Same owner chat; no agents or other chats.
Preserve buff strength, paid progression, save/backup/recovery, independent recast
limits, chronological live/offline combat and unrelated gameplay/UI.

User clarification:
> Like early game with 3 seconds is good. Then it can be upgraded to like 5 6 seconds, then we could have an lab that helps ultimate cooldown to go down to maintain the support dmg buff for tide and aurora 100% uptime

Accepted direction: start Support at 3 seconds; duration should grow toward
5–6 seconds, with sustainable Tide/Aurora uptime later. The earlier fixed
3/4.5-second suggestion was not selected. Lab upgrade design remains unresolved.

## Baseline and observations

- Current main `1a83b5baa4fb5025e3ccb91d99142e1e6e686264`, Android 0.2.127.
- Isolated branch `fix/support-duration-001`, worktree
  `validation-evidence/support-duration`. No open PRs returned by connected
  GitHub search at startup. Existing worktrees left untouched.
- Root checkout remains on its earlier PR42 branch. Read current main's project
  state and affected code; fetched main before creating the isolated checkout.
- `supportAbilityProfile`: 1,000 ms normal / 1,500 ms Ultimate, fixed durations.
- `abilityCycleSeconds`: 6 seconds initially, floor 10/3 seconds at Charge Rate
  level 10. Each Support maintains its independent recast deadline even when
  external grants fill charge. Existing regression explicitly enforces downtime.
- Under each Wisp on Rift, `chipEffectivePower` displays Wisp Power multiplied
  by passive global upgrades, general damage Bonds and the current Support buff.
  It is not ability damage and does not include every contextual damage Bond.
- The Wisp menu displays `wispPower`, before those passive multipliers and buffs.
  `abilityBurstDamage` is a separate calculation with ability-specific factors.

## Pending decision and acceptance

Explained that existing Charge Rate already reaches 3.33 seconds, so upgrading
duration to 5–6 seconds permits sustained uptime without an additional cooldown
Lab. Follow-up asks whether to use a new Support-duration Lab with existing
Charge Rate, or duration upgrades plus a separate Ultimate cooldown Lab.
Do not silently add a redundant study or change all Wisp cooldowns. Prices,
levels, access gates, Ultimate duration and cooldown scope are not yet agreed.
Await the design response before implementing the coupled balance change.

After duration selection: update actual casts, duration descriptions and focused
tests; prove early gaps and late continuous uptime, retained independent recast
limits and saved buffs, online/offline and split-step parity, and accurate HUD
estimates. Review the full diff, pass relevant existing/required integrated CI,
save evidence in GitHub and perform required Android build/upgrade/publication
checks before completion. Physical-phone/exact WebView60/TalkBack acceptance
remain unverified at baseline.

## Checks and next action

- Node.js 24.22.1 (CI pins 24.19.0).
- `node tests/behavioral/support-recast-current.cjs index.html --negative`:
  PASS 1,970 checks / four causal negative controls on unchanged current main.
  Source SHA256 `f7008f0e1b7d09af02552e0325446a53d5fd40a91639e4ddc64d9410eb973c51`.
  [Raw baseline result](../qa/support-duration-001/baseline.json).
- Task-aware context check PASS: 29 entrypoints, 47 local links, startup below
  32 KiB. `git diff --check` PASS; checkpoint reviewed, no product changes.
- Worktree creation initially failed on Windows path length; retried with
  command-local `core.longpaths=true`, successfully preserving the complete tree.
- Changed files: this task checkpoint and baseline evidence only.
- Next action: resolve the Lab progression choice, then implement and validate the
  scoped gameplay change. No integration, new APK or completion claim yet.
