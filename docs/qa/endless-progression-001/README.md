# Endless progression — work in progress

Baseline: a4f82f47, game SHA e110f182e500eed4bbb0382d182471c93110da28fda97fff4856b5931791a9ac.
No product edits or release acceptance yet. Local branch codex/endless-progression.

`baseline-campaign.json`: existing aggressive campaign, fresh Rift70 in2h,
first Ascend54s/8Prisms. `baseline-support.json`: Support recast causal checks.
Source validation PASS, Node24.19.0.

`baseline-daily-regular.json`: initial daily policy,3sessions of10min each,
free earned automation,8h absences, actual purchases/daily rewards. All eight
Wisps by57600s; first Mythic and Ultimate57600s. Rift150 on day1/160 later.
This v1 policy enabled charge and retired foundational Forge queue IDs; retired
IDs correctly buy nothing. Later policy uses active Forge paths and requires a
new matched baseline before comparative acceptance. Deterministic fixtures only.

`endless-campaign.cjs` adds full-clock Date control as an opt-in harness mode,
uses actual online/offline scheduler, explicit purchases and production daily
login/quest rewards. Sessions have one tap/s until earned Auto-Tap. No endowed
currencies/upgrades or manufactured calendar gates. Initial purchase policy is
being refined for accessible real-game development and Formation choices.

`endless-balance-prototype.cjs` writes a separate candidate HTML/config for
calibration, never product staging. First experiment incorrectly required a
retired Forge foundation; discarded and corrected to active Arcane Calibration.
The plan's assumption of uncapped purchasable Forge foundations was wrong:
live UPGRADE_FUSIONS retires all four. Dedicated repeatable Masterwork Tempering
will open successive groups of five Mastery ranks without altering existing caps.

`game-amount.cjs` implements hybrid ordinary-number/wide-string arithmetic.
257 independent assertions PASS through1e6000, exact additions/debits/products,
actual large IEEE integer migration and finite ordinary-number behavior.
Runtime contains no BigInt; the test oracle uses Node BigInt. Wide physical
powers/ratios are approximate; stored integer accounting is exact. It is not
yet connected to game/save/UI paths and is not proof of endless-engine behavior.

GitHub connector repository read returned404 on14October; remote access/integration
not demonstrated. All product, new gates/Mastery, matched final pacing, full CI,
mobile/legacy/Android/device/signing/release acceptance remain OPEN.

Next: finish regular calibration and correct long record walls, test matched
policies, then connect migrations/central gate plans/Mastery/UI and wide arithmetic.
