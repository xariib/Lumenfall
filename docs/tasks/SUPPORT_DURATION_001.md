# SUPPORT_DURATION_001 — Support uptime and damage display explanation

Status: local implementation and focused checks passing; broader validation in progress.

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

## Accepted direction and acceptance

Explained that existing Charge Rate already reaches 3.33 seconds, so upgrading
duration to 5–6 seconds permits sustained uptime without an additional cooldown
Lab. The user's subsequent correction established that the key constraint is
earning sustained uptime over a substantial period, rather than an easy upgrade.
User correction: earning 100% uptime must take time. User selected **about
3 months after unlocking the late-game research, even with continuous 8x and
maximum work reductions**. The timing requirement is accepted, not pending.

## Implementation decision, announced before editing

- Both Supports start at 3 seconds. Ultimate retains +50% strength (plus existing
  purchased strength modifiers); duration comes from research for both forms.
- New **Support Endurance**: ten levels, +0.3 seconds per level, maximum 6s.
  Access: record Rift 500, completed Wisp Damage 50 and Ultimate Analysis 5.
  Initial prices: 5,000,000,000 Lumen and 200,000,000 Shards, doubling each level;
  existing Procurement discounts remain applicable.
- Work per level: 55,542,858 seconds before earned reductions. At best 0.56
  future-work factor and continuous 8x this is exactly 45 days per level.
  Level 1 lasts 3.3s, below the existing 10/3-second recast floor; level 2 lasts
  3.6s, enabling each source's sustained uptime after at least 90 dedicated days.
  Full track: at least 450 days under those fastest-case assumptions.
- Existing Charge Rate supplies cooldown development; no redundant cooldown Lab
  or change to other Wisp timing. Saved buff strength/deadlines are untouched.
- The target is each Support's own buff/full combined bonus. Alternating two
  sources can cover time earlier at lower strength; explained to the user.

These choices implement the user's duration/time requirements. No unrelated
progression or general project instruction is changed.

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
- Local candidate HTML SHA256 `0c6861fec8a7fa7f0d9281cceeaf0c5a31f3eb933b5b31ac2075e360b3bea65f`.
  New Support test PASS 3,331 assertions/four controls; actual paid queue reaches
  level 2 at 90 days with 90 paid renewals. Recast 1,994/four controls, Lab expansion
  2,781/ten controls, boundary 2,346, stress, long-tail 353, contribution 8,099,
  Swift and Forge/Lab pacing 568 PASS. Raw local results are under
  `../qa/support-duration-001/local/` (not all checks collected yet).
- Changed product: only Support duration/profile/text and additive Lab catalog,
  access and effect. Tests/oracles updated to the new accepted timing/catalog;
  new core/mobile checks called by the existing required Support and Lab access
  entrypoints. Workflow files are unchanged: first push rejected a workflow edit
  because installed OAuth credentials lack workflow scope. Removed the need for
  that permission by extending the tests already run by required CI.
- Browser: new mobile Support checks PASS 206; all nine access rules PASS 1,082
  across 12 width/text/motion profiles outside sandbox. Sandbox run initially
  failed application-ready; no product change was made to resolve that run.
  Browser Chrome 157.0.8103.78. Modern browser is not exact WebView60 acceptance.
- Forge calibration PASS 3,134 after updating its one-second near-regeneration
  fixture to the exact three-second time average, retaining precision/HP checks.
- Open validation: original offline comparison first caught the additive Lab ID
  in default OFF intent; added its explicit zero/OFF default assertions before
  comparing all original fields. Full 190-case browser and offline reruns ongoing.
  Legacy Lab test invoked on Node24 correctly refused: requires actual V8 6.0;
  the unchanged required CI lane supplies that runtime. No local legacy PASS claim.
- Next action: finish browser/precision/offline/full regression; fix any introduced
  issues, review complete diff, save evidence, open PR and pass required gates,
  integrate and complete signed Android acceptance. No completion/archive claim.
