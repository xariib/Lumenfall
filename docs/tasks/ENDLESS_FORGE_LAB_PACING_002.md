# Endless Forge and earned Lab access

Status: release continuation in progress. Original baseline `a75763d3` was
published as Android 0.2.95. See the local continuation below for the current
branch and baseline.

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

New core: 528 assertions, four causal controls. Generous actual offline farms
at Rifts 32/101/501 spend eight-hour wallets on 47–61 / 122–136 / 209–223
enhancement ranks respectively; each quote gets the entire budget separately.
The model grants mature economic effects and level 300 enhancements up front.
A second equal eight-hour budget buys another 7–8 ranks in these fixtures.
Five-hour budgets and the existing three-day pacing forecasts also pass. Human
playthrough pacing is unverified. New Lab UI: 890 assertions across 12 viewport,
text and motion profiles. Existing long Lab UI passes its gameplay/layout checks.
[Focused evidence](../qa/endless-forge-lab-pacing-002/README.md).

The historical `forge-lab-caps.cjs` oracle already fails on unchanged main
because its old Lab catalogue predates three Wisp projects. The active cap
audit and original bounded Forge/slot checks remain in force. A concurrent
local browser run reported a browser close deadline after a passing Inquiry
contract result; rerun on isolated staging before interpreting it as a pass.

[PR42](https://github.com/xariib/Lumenfall/pull/42) is open. Browser Forge
32,040 assertions and Lab 6,588 assertions passed across 12 profiles each;
the Forge native purchase at level300 continues to301 with next prices and
queue controls. The isolated Inquiry contract and R3 navigation reruns passed.
CI found capped-only expectations in the original bulk purchase and early Wisp
oracles. The updated fixtures exercise bulk purchases on both sides of the old
enhancement cap and preserve every bounded and frozen-history assertion. Local
permanent progression (4,333), workshop clarity (417), early Wisp (2,802 with
controls) and Comet core (12,884 with controls) pass. Product bytes did not
change in that follow-up. The isolated long-tail browser retry passed all 326
checks and teardown.

The source binding gate required new replay evidence. The paired run actually
executed 115,200 independent one-second calls for each of baseline and candidate.
All four full saved states and the original canonical hashes match exactly.
Only the source binding in the frozen oracle changes.
[Replay receipt](../qa/endless-forge-lab-pacing-002/independent-replay.json).
A [non-publishing signed Android run](https://github.com/xariib/Lumenfall/actions/runs/42089012106)
tests commit `7e7b90cd` with the same product SHA-256
`b30a0222d837bf6192aa1ea1568c709b9f693ee81ab542e9f6cae10d15b82648`.

The eight applicable PR workflows passed on `819c681d`, including
[full pre-merge validation](https://github.com/xariib/Lumenfall/actions/runs/42090472807).
Those results apply to the original PR head. [Historical evidence](../qa/endless-forge-lab-pacing-002/README.md).

## Local continuation, 9 November 2026

Local branch `codex/endless-forge-lab-pacing-002-local` combines PR #42 at
`819c681d` with current `main` at `721ccbbc`, verified against GitHub. Current
main includes Android 0.2.104's exponential Rift bands, monotonic gameplay
clock and offline recap fix. The product changes merged cleanly. The only
conflict was the source binding in the offline replay oracle.

Current main passed the Forge pacing and Lab long-tail baselines. The combined
`index.html` SHA-256 is
`19c47b8a47fb2e408ac941477faf4cec085595432de9b3ff473e00488d5639c5`.
On Windows with Node 24.22.1, both sources independently advanced 115,200
one-second steps. All four complete saved states, reward totals and canonical
hashes matched, so only the source binding was refreshed.
[Current-main replay](../qa/endless-forge-lab-pacing-002/current-main-replay.json).

The combined source passed 528 focused assertions and all four defect controls,
the Forge and Lab core regressions, the Rift curve and clock exploit checks,
and the purchase rollback checks. Lab slots, queue continuity, timed boosts,
boost queues, and Farm recap parity also passed. The 8-hour farm and repeat-
purchase rank ranges above still hold. Chromium 157 passed 32,040 Forge,
890 Lab access and 6,588 Lab expansion assertions over 12 mobile profiles
each, including trusted input past Forge level 300 and into newly earned
Lab work. The offline catch-up core suite passed all 18 records in 299 seconds
locally, near its 300-second CI limit. On V8 6.0.286.52, the 580-check Lab
probe and eight-hour offline catch-up both passed. The browser harness also
passed Forge contracts, chronology and recovery, Inquiry contracts, and R3
navigation.

Next: validate the exact combined branch in CI and verify a non-publishing
signed Android build and upgrade. The earlier Android candidate passed identity,
assets and save upgrade, with a retail accessibility timeout also reproduced
on its unchanged baseline. Physical-device and human pacing acceptance remain
open.

## Release continuation, 12 November 2026

User: "Pr42 release and finish and pr46 delete". This chat now owns completion
and Android delivery of PR42. PR46 is already closed without merging; its
automatic-reset wait and any replacement balance change are excluded.
The [proposal review](PR42_PR46_REVIEW_20261112.md) retains its rationale.

Continue the existing clean feature checkout at `8df19cc6`, preserving the
untracked user attachments and other worktrees. Current released main is
`6b990b70`, product Android0.2.107, source SHA256
`65d908d18a5ae2515f371b12d29cb7a1292004fd8931f2e992cdc73655af6291`.
Fresh baseline Forge468/four controls and Lab353/four controls passed under
Node24.22.1. The product merges cleanly; only the offline replay source binding
conflicts. Restore the current main oracle unchanged, then independently replay
both sources before rebinding it. No recorded endpoint or assertion is relaxed.

Next: verify combined focused checks/replay, publish the exact combined PR42
head, pass required PR and signed-candidate checks, integrate, pass integrated
release gates, publish and verify APK/feed/assets/save upgrade. Keep original
physical-phone, WebView60 DOM, TalkBack and human pacing limitations explicit.
No subagents, chat messages or new gameplay rules are used.

Combined product SHA256 `af207697b854e536f32143c4343a7b9a1545b4c230922e47b293c6e7a2fd5977`.
The fresh paired replay executed115,200 independent one-second calls per source:
every saved field, reward triple and all four canonical hashes match released
main. Only the oracle source binding changed. Fifteen focused suites passed,
including528 new-feature checks/four controls, paid boosts/queues, rollback,
the latest exploit fixes, combat-based Auto-Tap and modest recruitment easing.
Native Lab access passed890 checks across12 mobile/text/motion profiles with
normal browser teardown. [Release evidence](../qa/endless-forge-lab-pacing-002/release-20261112/).
The complete diff against current main contains only PR42's product changes
and their tests/evidence; no PR46 cooldown or unrelated balance change is present.
