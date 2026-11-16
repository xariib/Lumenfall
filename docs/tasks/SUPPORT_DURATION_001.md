# SUPPORT_DURATION_001 - earned Support uptime

Status: implementation and local acceptance pass; final PR CI, integration and
Android delivery pending. [PR57](https://github.com/xariib/Lumenfall/pull/57) is ready,
not merged. Owner: this feature chat; no other chats, agents or messages used.

## Original requirements and decisions

16 November 2026:
> We need to fix that the supports ability is not only 1 second, in late late game players would have a chance to maintain it 100% uptime. Rift screen showing another dmg number than the wisp menu? Is the dmg number in the rift the ability dmg?

User clarification:
> Like early game with 3 seconds is good. Then it can be upgraded to like 5 6 seconds, then we could have an lab that helps ultimate cooldown to go down to maintain the support dmg buff for tide and aurora 100% uptime

User correction: 100% uptime should take time to earn. The user selected **about
three months after the late-game research unlock, even with continuous 8x speed
and maximum research discounts**. The earlier fixed 3/4.5-second suggestion was
superseded. Exact duration/time rules were announced before implementation.

One goal: grow Support duration toward earned late-game uptime and explain the
two damage readouts. Preserve strengths, paid progression, current casts, recast
limits, saves/recovery, chronology and all unrelated gameplay/UI/assets/signing.

## Verified implementation

- Tide/Aurora start at 3s, including their Ultimates. Ultimate keeps its stronger
  +50% buff; existing Forge/Astral strength modifiers remain unchanged.
- New **Support Endurance**, ten levels: +0.3s per level, maximum 6s. Access:
  record Rift500, completed Wisp Damage50 and Ultimate Analysis5. Initial price:
  5,000,000,000 Lumen +200,000,000 Shards, doubling each level; existing
  Procurement discounts apply. New ownership starts0, research/speed queues OFF.
- Each level requires55,542,858 work seconds before earned reductions. At the
  best0.56 work factor and continuous8x, this is45 days per level. Level1 lasts
  3.3s, below the unchanged10/3-second recast floor; level2 lasts3.6s and enables
  sustained per-source uptime after at least90 dedicated days. Full track450 days.
- Existing Charge Rate supplies cooldown development (6s to10/3s); no redundant
  cooldown Lab or other Wisp timing change. Old buff strength/expiry and paid
  study work remain untouched. New study stays in the existing Wisp group.
- The90-day target covers each source/full combined bonus. Alternating two
  sources can cover time earlier at lower strength; explained to the user.
- Rift's number under each Wisp is `chipEffectivePower`: own Wisp Power times
  passive upgrades, general damage Bonds and current Support. It excludes some
  contextual damage Bonds and is not ability damage. The Wisp menu displays
  `wispPower` before those passive combat bonuses. No damage formula changed.

## Baseline, checkout and scope

Main baseline `1a83b5baa4fb5025e3ccb91d99142e1e6e686264`, Android0.2.127.
Branch `fix/support-duration-001`, isolated worktree
`C:/Users/xarib/Documents/ChatGPT/Lumenfall/validation-evidence/support-duration`.
Root PR42 checkout and all other worktrees remain untouched. Only PR57 was open
at the latest overlap check; its base remained1a83b5ba. No independent review.

Product HTML SHA256:
`fc407785579ce6f0505f492aabe1d98ba68e53e8196f86a030c9046c39c5539c`.
Latest pushed head before this checkpoint: `4d09b7491370e916d97825c93923d2c440bc4a87`.
Final corrections in this checkpoint are test-only historical clock adapters and evidence.
Product changes are confined to root `index.html`: duration, additive Lab row,
access/effect and descriptions. Tests/oracles and task/QA docs accompany them.
Mobile/native source, fonts, branding, workflows and save schema remain unchanged.

## Verification and first failures

Node24.22.1 / Chrome157.0.8103.78 locally; required CI pins Node24.19.0 and runs
actual V8 6.0 in its existing legacy lanes. [Evidence and exact hashes](../qa/support-duration-001/README.md).

- Baseline Support1,970/four controls PASS. New duration3,331/four controls and
  recast1,994/four controls PASS, including real paid90-day queue,90 renewals,
  snapshots, save/recovery, live/offline and split-step parity.
- Current Lab2,781/ten controls; Forge9,342/25 controls; contribution8,099 plus
  preservation28,408; Forge pacing479; Auto-Ascend feedback435 PASS.
- Mobile Lab7,044; combined required access/Support UI1,286; six focused browser
  cases PASS. New Lab and Tide screenshots inspected. Duplicate group-heading
  regression fixed; deliberate old insertion is caught by the original assertion.
- All16 later core suites PASS, all14 clock/cycle defects caught. Current split
  and save/reload after every frame both PASS1,100; quest/Ascend browser1,225 PASS.
  Captured clock witnesses explicitly keep their original Support timing only
  for historical controls. The captured frame control requires its unmodified
  positive before its single mutation; normal current-timing paths stay intact.
  No tolerance, deadline, assertion or gate removed/weakened.
- Independent four8-hour one-second windows regenerate exact rewards under the
  approved longer buffs: [88592,4218,97014], [88584,4218,97014],
  [88659,4222,97106], [88854,4231,97313] (kills/Ascends/Prisms). Generator pins
  them and source hash; bulk offline UI remains compared to these independent
  windows. Historical originals and prior reward values remain in Git history.
- Standalone original offline test PASS (697.7s Windows); isolated offline CI
  PASS at every candidate. Local full run had an unchanged300s offline12h timeout
  and an EPERM temporary-profile cleanup exit; never counted as full PASS.
- Earlier CI caught old duration/catalog/default-field assertions. All corrected
  with explicit zero/OFF preservation assertions; archived PR15 hashes retain
  their historical mechanics while current live/offline paths remain checked.
- Browser startup/input timeouts are saved with first-failure receipts. Same-source
  local18-profile boost test993 and intended negative control PASS. Permanent and
  Tree failed jobs passed unchanged retries. Root causes are not claimed proven.
- A workflow edit was rejected because OAuth lacks workflow scope. Workflows
  remain byte-identical; new cases run through existing required Support and
  Lab access entrypoints. No extra account permission requested.

Previous PR head4d09b749 has seven other active workflows PASS; pre-merge43857851726
reached the captured clock fixture and failed its old negative witness. The new
local adapters fix that witness and all14 causal controls. Migration focused
43854621487 passed all three jobs on47849a74 (same product bytes). No APK yet.
[Full earlier checkpoint](../qa/support-duration-001/task-history-before-clock-ci.md)
preserves all milestones, initial candidates, failed runs and dispositions.

## Next concrete action and delivery gates

1. Pass all required exact-head PR CI on this checkpoint, including the
   complete190-case suite plus isolated offline.
2. Recheck current main/overlap, self-review complete diff and integrate PR57.
   Record tested source/merge identity; preserve any actual concurrent changes.
3. Dispatch the nine current validation workflows on exact integrated main;
   require the six established release gates and all relevant extra jobs PASS.
4. Run the established signed Android build/publish with save upgrade, actual
   updater and retail launch. Verify exact public APK/assets/checksums/feed.
5. Save supported status/evidence in GitHub and PROJECT_STATE. Feature remains
   open until required acceptance/delivery passes. Physical phone, exact
   WebView60 DOM and TalkBack are unverified; modern/V8 tests do not prove them.

Task-only controllers are in local `validation-evidence/`; inert copies are in
QA. `support-delivery.cjs status <sha>` saves all runs; `jobs <run>` saves jobs;
`dispatch main <exact-sha>` starts nine current workflows; `build <main-sha> true`
checks the six integrated gates before publishing. Then
`verify-support-public.cjs <build-run> <main-sha>` checks actual signed assets,
save/updater/retail receipts and anonymous public downloads. Standing task
release authorization applies; no general permission or new rule is needed.
