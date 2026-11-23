# Ascension Tree rank pacing

The player found Veteran Recruits and Roster Recall especially valuable and
cheap. They asked for more ranks with smaller gains on other low-cap upgrades.
Their examples were a timer moving from 5 to 4 instead of 5 to 3, and a bonus
moving from 10% to 12% instead of 10% to 15%.

Baseline is main `13558740467b0692e8a56066c2626bb31ad93828`, Android 0.2.159.
This chat owns the change on `feature/ascension-tree-rank-pacing-001`.
The older [Tree design](../qa/tree-expansion-001/DESIGN.md) supplies the effects
and prices. PR #46 (repeat Auto-Ascension pacing) is closed and unmerged.
The open Google Play PR has a separate distribution scope.

## Candidate and acceptance

- Veteran Recruits costs 20, 55, 130, 300, and 650 Prisms. Roster Recall costs
  60, 185, 550, and 1,600. Recruitment effects and unlocks retain their existing
  contracts, including the five-member Formation limit.
- Split ranks in Lumen Inheritance, Charge Memory, Patient Growth, Wall Wisdom,
  and Recruitment Reserve into two purchases. Reach the same final bonus and
  pay the same total for each original pair. Use smaller steps where every
  purchase can produce a distinct effect. Binary and whole-unit rewards retain
  their mechanics. Echo and Bonds keep their refund-backed price contracts.
- Keep earned effects on existing saves, including carry, exact Empower
  rounding, charge replay and offline retreat. Check genuine purchases, exact
  debits, insufficient Prisms, old saves, persisted new purchases and the UI.
- Verify the relevant CI and Android acceptance before recording delivery.

| Track | Old → new ranks | New gain per rank |
| --- | ---: | --- |
| Lumen Inheritance | 5 → 10 | Carry 2.5% Lumen, limited to 25,000 per rank |
| Charge Memory | 5 → 10 | Retain 10% charge |
| Patient Growth | 5 → 10 | Reduce Empower price growth by 0.5 percentage points |
| Wall Wisdom | 4 → 8 | Reduce offline boss grace by 30 seconds |
| Recruitment Reserve | 5 → 10 | Reserve 10% of the next recruit’s Lumen price |

Split ranks are stored in the existing node value in half-unit increments.
One old whole unit displays as two ranks and has the original effect. Loading
an old save is idempotent and keeps the wallet intact. Primary, recovery
and backup saves in this build preserve half units. Older builds interpret the
node value as a whole unit and can discard a new half unit if they rewrite it.

Production changes are in [index.html](../../index.html). The existing Tree
core, economy, offline, mobile and legacy-engine suites cover the new prices,
effects and save endpoints. Baseline Node 24.22.1 core and economy passed 5,755
and 14,074 checks on `13558740`. Candidate source SHA-256
`dace738a5bb7f58ceacae74d5bf63b50da959758f842418b33db88c96928938d` passed source
validation, 7,337 core checks, 14,146 economy checks, 200 credit-ledger checks
and 3,392 checks on actual Node 8.3/V8 6.0. The candidate passed 1,185 offline
checks and 24,380 mobile checks at twelve browser profiles. The exact-main
mobile baseline passed 24,248 checks. The regular and reduced-motion Tree
purchase scenarios also passed with browser motion explicitly set via CDP.

Replayed four eight-hour windows through 115,200 one-second advances. All
four gameplay state hashes, kill counts, Ascension counts and Prism totals
equal the baseline in the [offline reference](../../tests/behavioral/offline-swift-current-golden.json).
Only the source binding changed. The old generator's inline reward expectations
predate the current reference, so the observed phases were compared directly
against the frozen main reference before changing its source hash.

[PR #72](https://github.com/xariib/Lumenfall/pull/72) contains the candidate.
The [signed Android candidate build](https://github.com/xariib/Lumenfall/actions/runs/45154272218)
passed with matching product source, version 0.2.161, established package and
signing identity, both saves and paid Study progress retained, in-app updater
and retail launch. Candidate acceptance used emulator Android 12 and WebView 91.
[Tree CI](https://github.com/xariib/Lumenfall/actions/runs/45154824052) passed.
[Pre-merge](https://github.com/xariib/Lumenfall/actions/runs/45154823859) passed
isolated offline catch-up and found a stale mutation anchor in both existing
recruitment-refund runners. Updating the anchor preserves the intended defect.
Both local browser controls caught it at `legacy raw count visible`.
All 17 development defect controls and 31 normal recruitment/refund browser
groups passed. The independent exact Prism funding oracle passed as well.

After [menu PR #71](https://github.com/xariib/Lumenfall/pull/71) landed on main
at `365bb808`, the branch merged that baseline. The only conflict was the
offline reference's source hash. Combined source `84100670` matched the
rehearsal byte for byte, passed Tree core, economy, exact credit, Node 8.3 and
source validation, and reproduced all four offline reference states exactly.

On PR head `1ce90dcd`, the [Tree workflow](https://github.com/xariib/Lumenfall/actions/runs/45162893587)
and seven other applicable PR jobs/workflows passed, including isolated offline
catch-up. The [long pre-merge job](https://github.com/xariib/Lumenfall/actions/runs/45162893347/job/137652708519)
passed the refund-control stage and continued. The exact combined source passed
the twelve-profile mobile check (24,380 assertions) and offline Tree suite
(1,185 assertions).

Android release acceptance is blocked by the menu baseline. The
[baseline release](https://github.com/xariib/Lumenfall/actions/runs/45162719090)
failed twice at installed Wisps scroll restoration. The
[combined candidate](https://github.com/xariib/Lumenfall/actions/runs/45165047079)
reproduced that failure. Its saved scroll offset was 1,167 when the returning
screen's maximum became 1,182. The menu owner is tracing this independently
on `fix/menu-cleanup-native-scroll`. The last published release remains
Android 0.2.159. The Tree PR and owner chat remain open.

Next: after the menu fix lands, recheck source overlap and replay bindings,
verify exact PR and integrated CI, and complete the signed Android release.
Physical-phone and exact WebView60 remain open.

## Full Tree and Ascension count follow-up

The player asked for smaller ranks on the full Tree and a simulation of the
number of Ascensions needed to max it. For whole-unit or switch-like effects,
they chose “Give each intermediate rank a smaller related benefit”.

Apply the rank split to all nineteen purchasable tracks, retaining each old
paid effect. An unpaired rank supplies the extra whole-unit Veteran Recruits,
Roster Recall, Familiar Paths, Early Invitations, Bench Mentorship, and Steady
Instruction benefit during odd-numbered Ascensions or their runs. Previously
earned recruitment entitlements persist. Frontier Record adds its unpaired
Prism on every second 25-Rift milestone, and Ascension Dust rounds down to
whole Motes once per payout. Lasting Blessings and Unbroken Rhythm carry half
the remaining duration or timer progress at the intermediate rank. Swift
Charter gives half its future discount at the first rank. Echoing Rest, Cheaper
Recruitment and Swift Ascension use 2.5, 1.5 and 2 percentage points per rank.
Legacy overcap receipts and retired tracks retain their original paid terms.

The [simulation](../../scripts/qa/ascension-tree-completion.cjs) and its
[per-track receipts](../qa/ascension-tree-rank-pacing-001/full-tree-simulation.json)
start at zero
Prisms and Tree ranks, uses the production manual Ascension and purchase
handlers, prioritizes Swift Charter, Frontier Record, and Swift Ascension, and
spends every Prism in the Tree. Preset clear milestones start at Rift 15. The
model measures Prism progression once a player clears each selected Rift. It
does not model combat success, elapsed time, or competing Prism purchases.

| Rift increase per Ascension | Ascensions to max | Final clear |
| ---: | ---: | ---: |
| 1 | 947 | 961 |
| 5 | 563 | 2,825 |
| 10 | 433 | 4,335 |
| 25 | 320 | 7,990 |
| 50 | 254 | 12,665 |

Each route spent 200,177 Prisms on 678 purchases, including 186,825 Prisms on
500 Swift Ascension ranks. At +10 Rifts per Ascension,
buying restart upgrades before later Swift ranks took 466 Ascensions. Seeding
20 completed Prism Clarity levels took 255 Ascensions with Swift first.
The five-track candidate took 450 Ascensions on the matching +10 Rift route.

Full-Tree source `0d4f9e667bffdfb53d50ad1713a43a66ff44e852790d9d88d3f0b8c41152a0df`
passed 10,485 Tree core checks, 15,664 economy checks, 4,674 Prism state checks,
1,305 offline Tree checks, 622 Echo refund checks, and the Node 8.3 shared
recruitment and Echo controls. All four independent offline replay states
matched main and the previous candidate. The source binding alone changed.
Android release remains dependent on the shared native menu-scroll fix.
