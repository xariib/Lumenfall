# PROGRESSION_PACING_001 — stop shallow-farm inflation and preserve Farm intent

Status: in progress. Owner: this feature chat. Baseline: `main` 7f25faf9
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

## Checkpoint

Product candidate SHA-256: `b301e15bec8282b07b67d78bc87e301bbcfe19e4787351c2881e8f8a48ee4640`.
The original manual-Farm fixture reproduced a retry and four unintended Ascends
within ten seconds. Focused new suite: 219 checks and five defect controls PASS.
Forge: 9,335 assertions / 25 controls PASS; paid caps 2,278 PASS; Lab 2,676 PASS;
permanent upgrades 3,748 PASS; permanent offline 214 PASS; income 632,726 PASS;
endless core 237 PASS; late advice 186 PASS; slot contract 54 PASS.
Evidence: [source-bound results](../qa/progression-pacing-001/).

Independent four eight-hour one-second windows regenerated the source binding:
kills/Ascends/Prisms match all four historical outcomes exactly. The additive
intent default is separately checked before historical state comparisons.
Frozen resource-reference tests apply only the newly specified current-Rift
currency ceiling; they retain original rounding, multipliers and chronology.

Three-day regular policy (three ten-minute sessions/day plus real offline play)
reaches record Rifts 40/50/60 and Wisp Ascendancy 10/13/15; Masterwork is not yet
unlocked. Longer simulation and identical-policy baseline comparison continue.
These are observations, not calendar guarantees or target promises. Conceptual
phases: foundations below Rift70; Masterwork development and roster investment
70–250; late Comet/Ultimate/Mastery paths 250–1000; very late higher Mastery and
remaining 500-level Lab/Forge investments beyond 1000. Their actual dates depend
on investment and play policy, and must be assessed after further testing.

Local Chrome 156 was downloaded/extracted successfully, but browser launch is
blocked by the environment's UNIX socket policy (socket EPERM), before a test
case runs. Do not call this a product failure or a browser PASS. Required remote
browser gates, full regression and Android/device acceptance remain pending.
No APK is requested/published by this task. Keep this feature open for acceptance.

Current main was verified; only historical documentation PR #2 was open and no
overlapping pacing branch was found. Unrelated checkout/test-generated scratch
files are not part of the change. Remote feature branch now exists at baseline.
Next: publish this coherent candidate as a draft PR, finish the longer simulation,
resolve real regression failures and require green CI before integration.
