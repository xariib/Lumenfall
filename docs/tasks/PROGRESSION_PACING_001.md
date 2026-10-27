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

Current product SHA-256: `1ac463ff61a6c67cf81ded90098991c994382b6e5fef893dfa59ef360e4f80df`.
The latest revision changes only Farm recap summation; wallets and gameplay
credits are identical. Earlier campaign/browser evidence below is bound to
`6dc24bee`, before this recap-only correction; do not relabel those receipts.
The preceding `b301e15b` candidate used canonical HP for the throughput ceiling;
the final revision also handles a legacy encounter's actually saved maximum HP.
The original manual-Farm fixture reproduced a retry and four unintended Ascends
within ten seconds. Focused new suite: 221 checks and five defect controls PASS.
Forge: 9,335 assertions / 25 controls PASS; paid caps 2,278 PASS; Lab 2,676 PASS;
permanent upgrades 3,748 PASS; permanent offline 214 PASS; income 632,726 PASS;
endless core 237 PASS; late advice 186 PASS; slot contract 54 PASS.
Evidence: [source-bound results](../qa/progression-pacing-001/).

Independent four eight-hour one-second windows regenerated the source binding:
kills/Ascends/Prisms match all four historical outcomes exactly. The additive
intent default is separately checked before historical state comparisons.
Frozen resource-reference tests apply only the newly specified current-Rift
currency ceiling; they retain original rounding, multipliers and chronology.

Three-day regular policy rerun on the final product (three ten-minute sessions/day plus real offline play)
reaches record Rifts 40/50/60 and Wisp Ascendancy 10/13/15; Masterwork is not yet
unlocked. Identical policy on the released source reaches Rift70/306/467.
The preceding candidate's 12-day continuation reaches Rift158, Lab24 and still
has unfinished Forge investment. Its different source hash is retained explicitly.
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

The previous candidate's full isolated offline CI passes; local complete offline
regression also passes (465.8 s). Final source-bound one-second windows retain
all four historical outcomes. Actual V8 6.0 parses the full final source and its
Forge suite passes 2,486 checks. A CI Lab clock fixture expected 31 instant kills:
its numerical fractional-wallet oracle stays unchanged, while its chronological
test now uses 2 kills/s, non-damaging Support casts and exact 75% rewards. It
passes 2,346 checks and original defect controls. Existing huge-count Farm
arithmetic probes explicitly supply the independently observed raw DPS, keeping
their original arithmetic expectations/controls; the public ceiling is separately
required by the new production-path suite. No assertion or gate was deleted.
Other saved results with `b301e15b` are earlier-candidate results, not final CI.

CI Lab speed initially timed out before Browser.getVersion (zero test cases).
Preserve this runner failure; rerun unchanged after the full run terminates.
The numerical Lab fixture failure is addressed as above, not retried away.

Current main was verified; no overlapping pacing work was found. Unrelated
checkout/test-generated scratch files are not part of the change.
[PR #15](https://github.com/xariib/Lumenfall/pull/15) remains draft. Initial heads
`fa65ea23` / `2c44c0ff` / `d6fa701b` were followed by the clock and mobile fixtures.
The wide-count arithmetic assertions remain and separately require exactly two
public Farm kills even with wide legacy Power. Three frozen clock oracles
pin only their original Masterwork numeric input, preserving the immutable dyadic
transcript, transaction checks and failure controls. Current-balance automation
transitions also run alongside the captured historical rate reproduction.
All 14 clock defect controls are caught; current-balance native/cold-frame parity,
wide Power, real campaigns and progression tests remain on unmodified production.
[Clock evidence](../qa/progression-pacing-001/clock-regression.json) distinguishes
the pinned `f1752f70` oracle source from the actual `6dc24bee` product.
A transient automatic upload review
rejection was resolved by verifying authenticated owner xariib, exact public repo,
admin permission and the existing public test payload; no user data was uploaded.

At head `4ae88295`, all six specialist workflows and isolated offline PASS.
Pre-merge run `40510871105` completed the full suite with three failures:
the numerical/native arithmetic tests still observed capped DPS via their raw
input helper; long high-Power parity exceeded its original recap tolerance by
5.09e-6 Lumen after four hours. All other full-suite scenarios passed. Keep this
failure; do not increase tolerances or remove the historical arithmetic oracles.

The raw-DPS helper now observes actual uncapped passive Power explicitly. A
nonserialized compensated sum corrects Farm recap totals only; native wallets,
Push credits and wide exact credits retain their old policy. The new
`farm-recap-parity.cjs` runs the original four-hour fixture at 60/300/14400-second
partitions, preserves its original tolerance and native endpoint wallets, and
rejects the old recap implementation. Its 352 checks/control PASS. VM numerical
356 and conservation 15,899 checks with original causal controls PASS. Focused
pacing 221 and Forge 9,335/25 controls PASS on `1ac463ff`.
[Latest focused evidence](../qa/progression-pacing-001/recap-fix.json).

Next: publish this recap correction and renewed independent source binding,
require seven green workflows on the resulting PR head, then integrate and
verify the exact tree/source on main. App/device and human pacing acceptance
remain open; no APK has been published by this task.
