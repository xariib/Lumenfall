# Endless Forge and earned Lab access

Status: in progress. Owner: this feature chat. Baseline: `a75763d3` on
`origin/main`, published Android 0.2.95. Isolated branch/worktree:
`feature/endless-forge-lab-pacing-002`, `../endless-forge-lab-pacing-002`.

## Original requirement, 5 November 2026

The user reports that 5–8 hours farming lower Rifts provides enough currency
to nearly goldbox a Forge upgrade. An endless game should retain upgrades
worth purchasing throughout play. Always use The Tower idle game as a reference;
its Workshop is difficult to finish. Powerful Lab upgrades should also require
meaningful investment and should not be easy to unlock or access.

## Investigation and intended scope

Current main contains three 300-level enhancements but most other Forge tracks
cap at 2–20. Existing Lab work already spans months; access and first-start
requirements need examination separately from duration. Prior several-month
Forge and year-long Lab targets remain useful context:
[Forge pacing](FORGE_WORKSHOP_PACING_001.md), [Lab duration](LAB_LONG_DURATION_001.md).

Continue the three scalable Forge enhancements beyond level 300 with their
existing additive effects and growing prices. Retain short utility ceilings
where effects must be bounded. The user selected **Rift milestones + prerequisite
research** for powerful Lab access. Preserve all existing paid levels, effects,
running/paused work, boosts, queues, saves and recovery.

Reference structure, not copied numbers: [Workshop](https://the-tower-idle-tower-defense.game-vault.net/wiki/Workshop),
[Laboratory](https://the-tower-idle-tower-defense.fandom.com/wiki/Laboratory).

## Acceptance

- No final goldbox for continuing Forge enhancements; real manual, bulk and
  queued purchases, increasing prices and effects work past the former cap.
- Measure generous 5/8-hour lower-Rift farm budgets and repeat purchases.
- Powerful Lab first-start gates apply consistently to manual and queued work;
  UI explains each unmet requirement. Paid research remains accessible.
- Save/recovery/rollback, Ascend, paid work/boosts, live/offline parity and
  mobile affordability remain intact. No reset or retroactive debit.
- Required existing checks and CI must pass on integrated source before
  completion; Android delivery and device limitations must be recorded.

## Baseline checks and next action

Node 24.20.0: existing Forge pacing with four negative controls PASS;
existing Lab long-tail with negative controls PASS. Raw receipts:
`docs/qa/endless-forge-lab-pacing-002/baseline-forge.json` and `baseline-lab.json`.
Other worktrees are untouched. No subagents or messages used.

## Implementation and verification checkpoint

Battle, Arcane and Harvest Tempering have no final level. Their current prices,
Rift unlocks and additive +1 percentage point per paid level continue. The
three effects are still separate: passive Wisp damage, damaging abilities, and
Lumen/Shard kill rewards. Bounded Forge utilities retain their original caps.

First access requires both the record Rift and completed research below. These
are Lumenfall balance choices, with existing prices, work and boost rules kept.

| Research | Record Rift | Completed prerequisite |
| --- | ---: | --- |
| Wisp Damage | 25 | Wisp Ascendancy 5 |
| Wisp Critical Chance | 75 | Wisp Damage 10 |
| Research Procurement | 100 | Lumen Wellspring 10 |
| Focused Apparatus | 125 | Guardian's Mastery 15 |
| Wisp Critical Damage | 150 | Wisp Critical Chance 10 |
| Measured Inquiry | 150 | Wisp Ascendancy 25 |
| Mote Catalysis | 200 | Luminous Sense 10 |
| Balanced Curriculum | 250 | Measured Inquiry 3 |

Paid levels and active/paused work retain access automatically. A large wallet
and a previously enabled queue cannot bypass an unearned first-start gate.
Prerequisite completion can start an eligible queue at the same event boundary
online and offline. No schema change or new currency.

New core: 501 assertions, four causal controls. Generous actual offline farms
at Rifts 32/101/501 spend eight-hour wallets on 47–61 / 122–136 / 209–223
enhancement ranks respectively; each quote gets the entire budget separately.
The model grants mature economic effects and level 300 enhancements up front.
Five-hour budgets and the existing three-day pacing forecasts also pass. Human
playthrough pacing is unverified. New Lab UI: 890 assertions across 12 viewport,
text and motion profiles. Existing long Lab UI passes its gameplay/layout checks.
[Focused evidence](../qa/endless-forge-lab-pacing-002/README.md).

The historical `forge-lab-caps.cjs` oracle already fails on unchanged main
because its old Lab catalogue predates three Wisp projects. The active cap
audit and original bounded Forge/slot checks remain in force. A concurrent
local browser run reported a browser close deadline after a passing Inquiry
contract result; rerun on isolated staging before interpreting it as a pass.

Next: publish the reviewed source and test evidence, check all required CI on
the exact candidate, then integrate and verify Android within authorized scope.
Physical-device/human pacing acceptance remains open; no APK is published.
