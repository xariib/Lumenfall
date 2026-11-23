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
Next: complete the PR gates on this combined source, then integrate and verify
the signed release. Physical-phone and exact WebView60 remain open.
