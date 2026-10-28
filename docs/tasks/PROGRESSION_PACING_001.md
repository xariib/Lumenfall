# PROGRESSION_PACING_001 — stop shallow-farm inflation and preserve Farm intent

Status: integrated, app/device and human pacing acceptance pending. Owner: this feature chat. Baseline: `main` 7f25faf9
(Android 0.2.48). Branch: `fix/progression-pacing-farm-intent-001`.

## User requirement, 27 October 2026

The player reports almost finishing Forge within one day, excessive Masterwork
power and extremely fast farming at Rift 32 with three Wisps. The supplied
11-second videos show Farm Rift 32 and 51, rapidly changing wallets and damage
many orders above enemy HP. Build/save files were not supplied; elapsed account
age and exact investments cannot be independently recovered from the videos.
Provide meaningful early, middle, late and very late progression, inspired by
The Tower and Firestone rather than finishing everything in 2–3 days. Also fix
manually selected Farm becoming Push after closing the game with Auto Ascend ON.
Existing levels, wallets, purchases and paid Lab work must survive the update.

## Verified causes and implementation scope

- Masterwork currently compounds `1.25^level` (level 21 exceeds 100x).
- Farm passive simulation converts all damage into kills, with no encounter
  throughput bound: more power on a low Rift yields arbitrarily many rewards.
- Gale/Thorn cast currencies scale with own Power, independently of current Rift.
- Offline boss retry cannot distinguish manual farming from automatic retreat.

Use additive +5 percentage points of base Power per Masterwork level; retain
all purchased ranks and their Mastery capacity. Open five Masterwork levels at
Rift 70 and five more per 50 record Rifts. Bulk/manual/queue/UI must agree.
Keep the existing finite caps (500 Masterwork, 250 scalable foundations); small
caps on bounded charge/regen/limited-use mechanics are deliberate. Increasing
those ceilings would reintroduce combat loops rather than add useful longevity.
Bound passive Farm throughput to two ordinary enemy HP per second; ability and
tap kills remain discrete and additional. This is a passive throughput limit,
not a claim that all combat has a global spawn timer. Cap Gale/Thorn's base
resource Power by current Rift (40×1.09^curve / 100×1.11^curve respectively),
then apply their purchased resource multipliers. Push damage remains unchanged
except the intentionally rebalanced Masterwork factor.

Persist an additive `farmAutoResume` boolean, true only for an automatic boss
retreat. Manual selection clears it, including selection of the same Rift.
Legacy Farm saves default to manual because their original intent is unknowable.
Only an automatic retreat may retry a boss; Auto Ascend stays enabled but dormant
while the player has selected Farm. Do not reset progress or claw back wallets.

## Acceptance

- Reproduce the original manual-Farm retry, then reject it with Auto Ascend ON
  and OFF through live/offline, both save slots, cold reload and backup/recovery.
- Automatic boss retreat and subsequent retry still work, including reload;
  explicit manual takeover cancels retry and failed persistence rolls back.
- Independent numerical tests of Masterwork levels 0/1/20/100/500, development
  boundaries, bulk/queue behavior, exact payment and rollback.
- A wildly overpowered three-Wisp Rift32/51 fixture has bounded passive kills;
  actual cast income rewards deeper farming, not unbounded shallow overkill.
- Live and offline chronological partitioning preserve paid work and outcomes;
  the existing 12-hour productive offline cap and Mote cooldown remain intact.
- Rebase only expectations intentionally changed by these requirements; retain
  historical outcomes and meaningful causal controls. Run relevant and required
  CI gates, integrate a reviewed PR, and document remaining device/pacing limits.
- A simulation or automated test is not evidence of a year of enjoyable play.
  Long-term calendar targets remain hypotheses until measured playtesting.

## Sources and inspiration

The Tower: [workshop](https://the-tower-idle-tower-defense.fandom.com/wiki/Workshop_Upgrades)
and [Labs](https://the-tower-idle-tower-defense.fandom.com/wiki/Lab_Upgrades)
describe permanent investment, milestone unlocks and time-based research.
[Firestone publisher research guide](https://fs.r2games.com/content/research_10263.html)
describes linear bonuses with diminishing relative gains and timed research;
[developer Steam listing](https://store.steampowered.com/app/1013320/Firestone_Idle_RPG/)
describes gradually unlocked layers and permanent progression. Use these
principles, not copied assets, currencies or an unsupported claim of equal pacing.

Related contracts: [Forge/Lab caps](LAB_FORGE_LONGTAIL_001.md),
[endless progression](ENDLESS_PROGRESSION_001.md),
[current delivery](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md).

## Checkpoint — integrated, acceptance pending

[PR #15](https://github.com/xariib/Lumenfall/pull/15) merged at
`96af28bd49f008e26474fc786064e7e9575e3da5`. Tested PR head:
`ea2814fa02a33c660b4c53a7a4e592d3c82a6fac`; tested merge:
`f4d910d4f9b21fed78787305da34206685eb709d`. The integrated tree exactly matches
tested tree `b32f63e26a7bae652febd177867d405f89bb10ca`.
Product SHA-256: `ce4223a749cc307760895f84b8983e4cc2348e57df251c3dff357a07d021d8ba`.
[Final CI/tree receipt](../qa/progression-pacing-001/ci-final.json).

All seven required workflows PASS on that head: pre-merge, Forge, Lab,
Tree, Comet/Deeds, shared UI and permanent progression. Both complete
pre-merge jobs PASS: 189 main + 1 isolated offline scenarios, with runtime smoke
at 390×844. The actual CI checkout/source binding was verified. Self-review
of the complete diff and automated checks found no remaining failure; there was
no independent reviewer and no external review/thread to resolve.

Current source checks: pacing 221/five controls; Farm recap 353/old-recap control;
Forge 9,335 assertions/25 controls; Lab numerical boundary 2,346; actual
Node 8.3.0/V8 6.0 Forge 2,486; all 14 clock defect controls PASS. The complete
original offline regression (18 records/five groups) also passes locally in
194 seconds with its exact historical assertions. Four independent 8h
one-second windows retain every original kill/Ascend/Prism result and state
hash, with renewed source binding.
[Current focused/offline evidence](../qa/progression-pacing-001/recap-scope.json).

## Measured pacing and remaining limits

[Final-source campaigns](../qa/progression-pacing-001/campaign-final.json) use
only earned currencies, actual sessions and chronological offline play.
Regular policy (3×10 active minutes/day): record Rifts 40/50/60, Lab 10/13/15
after days 1/2/3; Masterwork remains locked. The identical released-source
policy reaches Rift70/306/467. Final-source continuation after 12 days:
Rift158, Lab24, Masterwork10/500, 269 Ascends and 151 total Forge levels.
Efficient policy (6×15 minutes/day): Rift50/68/70 after three days, Lab16 and
Masterwork5. These are synthetic observations, not a year-long pacing promise.
The preceding `b301e15b` and `6dc24bee` campaign receipts remain separately
bound to their earlier sources; do not relabel them as current measurements.

Conceptual phases: foundations below Rift70; Masterwork development and roster
investment 70–250; late Comet/Ultimate/Mastery paths 250–1000; higher Mastery
and remaining 500-level Lab/Forge investment beyond 1000. Dates depend on play
policy and require human testing. Existing saves retain prior ranks, wallets and
paid work, so already accumulated inflation can leave them ahead of fresh pacing.

No APK was requested or published for this change. Android build is an unchanged
manual workflow; no release is triggered by the merge. Local Chrome launch was
blocked before startup by the UNIX socket policy; CI supplied browser acceptance.
V8 6.0 tests establish numerical/syntax compatibility, not physical WebView60
DOM, Android upgrade, TalkBack or human visual acceptance. Keep the feature open.

## Preserved regression history

The original manual-Farm reproduction retried a boss and Ascended four times
within ten seconds. The saved intent flag fixes that while retaining automatic
retreat/retry, manual same-Rift takeover, failed-save rollback, both slots and
backup/recovery. The original `b301e15b` Farm ceiling used canonical HP;
`6dc24bee` also bound a legacy encounter's actually saved maximum HP.

Historical huge-count arithmetic oracles now supply independently observed raw
DPS explicitly, preserving their original expected values and causal controls.
The actual public Farm ceiling is separately required by production-path tests.
Three frozen clock oracles pin only their historical `1.25^rank` numeric input;
their modified source hashes are distinct from production. Current-balance
campaigns, native/cold-frame parity and wide-Power policy use current production.
[Earlier clock evidence](../qa/progression-pacing-001/clock-regression.json).

Earlier CI exposed an instant31-kill Lab fixture (its original fractional-wallet
predictor reproduction is retained), a wide-count Farm assumption, and a mobile
guide expecting Forge despite a locked development band. The corrected guide
requires Push while locked and verifies the real Forge focus after development.
A separate Lab Browser.getVersion timeout ran zero cases; it was preserved as
runner failure, and final Lab CI passes unchanged acceptance.

At head `4ae88295`, pre-merge run `40510871105` completed with three failures:
two numerical/native tests still observed capped DPS through their raw helper;
the original four-hour parity tolerance exposed a 5.09e-6 Lumen recap drift.
The helper now observes actual raw passive Power, and the recap compensates
fractional credits without changing any wallet.
[Broader recap checkpoint](../qa/progression-pacing-001/recap-fix.json).

At `8af118e2`, isolated job `122244703196` in run `40520146329` caught
a one-ULP change to a historical Push-start recap. Current `ce4223a7`
compensates only Farm portions of Farm-start windows; Push-start windows,
including automatic retreat, retain exact native addition. The original
assertions/tolerances remain, and both full final jobs pass. An earlier automatic
upload review rejection was resolved by verifying authenticated owner xariib,
the public repository, admin permission and public/synthetic payload.

Next: authorized app build/installed upgrade and physical phone/WebView60/
TalkBack checks, followed by human pacing measurements across the phases above.
The code is integrated; app/device and long-term acceptance remain pending.

## Android delivery — 28 October 2026

Included in signed Android0.2.51 from `d3420c15`. Seven source-bound workflows,
both full jobs (189+1), runtime smoke, installed emulator upgrade and public
APK verification PASS. Both saves/paid work retained.
[Delivery evidence](../qa/game-check-apk-release-001/release.json).
Physical phone, exact WebView60, TalkBack and human pacing remain open.
