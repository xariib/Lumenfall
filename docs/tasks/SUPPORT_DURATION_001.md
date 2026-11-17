# SUPPORT_DURATION_001 - earned Support uptime

Status: released as [Android0.2.128](https://github.com/xariib/Lumenfall/releases/tag/android-1000128).
PR/local/integrated/native/public acceptance PASS; physical-phone, exact WebView60
DOM, TalkBack and human pacing acceptance remain open. [PR57](https://github.com/xariib/Lumenfall/pull/57)
merged at `f16ffd9b4319ff64fe3ecfb28ddc07a881620ec8`. Owner: this chat; no other
chats, agents or message tools used. Keep this chat open for outstanding human acceptance.

17 November correction: the user supersedes the90-day uptime target with
roughly one year of earned late progression. Current correction is owned by
[TEAM_PROGRESSION_001](TEAM_PROGRESSION_001.md); see
[year-earned Support](../decisions/2026-11-17-year-earned-support.md). The0.2.128
implementation/evidence below remains historical and is not the current target.

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
Latest pushed head: `bc6329af397f4b4e6870ffae3fda9a8ea0d5fcaa`.
Its final corrections are test-only historical clock adapters and evidence.
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

Latest headbc6329af: Comet43868722292, Lab43868722572, Tree43868722800,
Permanent43868722251, Wisp43868722814, Shared UI43868722291 and
Forge43868722325 PASS. Pre-merge43868722738 PASS:190 main plus1 isolated offline;
full logs and receipts saved under QA/remote. Merge tree exactly matchesbc6329af.
Eight integrated workflows PASS: Comet43878440827, Forge43878445177,
Lab43878448789, Shared UI43878453760, Tree43878458295, Permanent43878461994,
Wisp43878466061 and Migration43878469794 (all three jobs). Lab initially timed
out on Browser.getVersion with zero checks; its unchanged failed-job retry passes.
Both failure and pass raw logs/receipts are saved. Pre-merge43878436458 PASS:
all preceding checks,190 main scenarios,1 isolated offline. Full logs/receipts
saved. All nine integrated workflows pass. Guarded signed build43888872736 PASS,
published0.2.128/versionCode1000128 fromf16ffd9b. Main stayed fixed through publication.
Migration focused43854621487 passed
all three jobs on47849a74 (same product bytes). Earlier failed receipts remain.
[Full earlier checkpoint](../qa/support-duration-001/task-history-before-clock-ci.md)
preserves all milestones, initial candidates, failed runs and dispositions.

## Android delivery and remaining acceptance

[Public verification](../qa/support-duration-001/android-release/public-verification.json)
PASS at2026-11-16T15:05:46Z: versioned and latest anonymous downloads, release
feed, metadata, exact source/assets, packagecom.lumenfall.app and established
signing certificate all match. APK SHA256:
`3789ccc679687c9786a4705a9eabb33a0de8566cc4ee5ba73944de0dc9e37d06`,5,163,947 bytes.
Signed emulator upgrade retains UID, both save slots, progress, paid study and
legacy entitlements. Actual system-approved updater/install/open and normal
retail Android12 launch PASS. Production is non-debuggable, without QA hooks;
native menu scroll, currency labels, Bonds and Deeds remain preserved. Retail
launch screenshot inspected. All raw receipts/logs are under task QA.

Implementation, integration, automated acceptance and public delivery are done.
Final documentation-only closeout records these receipts and PROJECT_STATE;
it does not change the released product or require another APK. No independent
review claimed. Remaining next action: physical-phone, exact WebView60 DOM,
TalkBack and human pacing review when available. Keep unknown human acceptance
open; no owner or unrelated chat archived.

Task-only controllers are in local `validation-evidence/`; inert copies are in
QA. `support-delivery.cjs status <sha>` saves all runs; `jobs <run>` saves jobs;
`dispatch main <exact-sha>` starts nine current workflows; `build <main-sha> true`
checks the six integrated gates before publishing. Then
`verify-support-public.cjs <build-run> <main-sha>` checks actual signed assets,
save/updater/retail receipts and anonymous public downloads. Standing task
release authorization applies; no general permission or new rule is needed.
