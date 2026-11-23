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
One old whole unit displays as two ranks and has the original effect. Promotion
from an old save is idempotent and keeps the wallet intact. Primary, recovery
and backup saves in this build preserve half units. Older builds interpret the
node value as a whole unit and can discard a new half unit if they rewrite it.

Production changes are in [index.html](../../index.html). The existing Tree
core, economy, offline, mobile and legacy-engine suites cover the new prices,
effects and save endpoints. Baseline Node 24.22.1 core and economy passed 5,755
and 14,074 checks on `13558740`. Candidate source SHA-256
`dace738a5bb7f58ceacae74d5bf63b50da959758f842418b33db88c96928938d` passed source
validation, 7,337 core checks, 14,146 economy checks and 3,392 checks on actual
Node 8.3/V8 6.0. A browser fixture originally expected every rank to store a
whole unit. It now checks the saved value for each actual first purchase.

Status: candidate in progress. Next: finish the local offline/mobile pass and
run GitHub CI before integration and APK acceptance.
