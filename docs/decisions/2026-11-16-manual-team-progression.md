# Manual Ascension and meaningful Wisp development

User requirement,16 November2026; implementation continues17 November.
Task:[TEAM_PROGRESSION_001](../tasks/TEAM_PROGRESSION_001.md).

> Remove the auto ascend actually, so when players want to earn prisms, they
> have to manually ascend and purchase their ascension tree upgrades.

The user also requires a higher Rift before the next rewarded Ascend, clearer
per-Wisp damage, useful Support/utility damage and later recruits that do not
make the rest of the team irrelevant. Near-continuous early Tide buffs were
explicitly rejected. The user instructed completion without permission prompts.

Announced gameplay rules within that scope:

- First manual Ascend requires clear15; subsequent Ascends require a clear
  strictly above the highest rewarded clear. Same/lower clears cannot reset
  or pay. Auto-Ascend is retired across UI, purchases, live and offline paths.
  Previous owners retain their history and receive100 Comets once, with a
  validated durable receipt. Existing balances and progression stay.
- Eligible new records retain the existing protected base/earned-bonus policy,
  F05 unrounded new-depth difference/one upward rounding/full-reward cap and
  separately earned Frontier/Dust. The old unlimited repeat-reset behavior is
  superseded by the explicit forward-only requirement; historical evidence stays.
- Tide/Aurora retain3s starting buffs and current strength. Without Endurance,
  recasts wait at least6s, including external charge. Endurance keeps .3s/level
  duration growth, prices/access/cap and its45-day/level fastest commitment.
  First two levels lower the floor1.2s each,6→4.8→3.6. Natural charge can take
  longer. Earliest sustained per-source uptime remains the accepted90-day
  dedicated late-research target at8x/all reductions. Old casts remain snapshots.
- All Wisps receive development growth after70 rather than only Ember/Stone.
  Early base strength is bounded at26; developed strength factors are Ember1,
  Tide.8, Stone1.1, Gale.9, Thorn.9, Void1.15, Aurora.9, Titan1.25. Early Ember,
  Tide and Stone curves through70 stay unchanged. Rarity, Modules, Ultimates,
  Mastery, prices and other upgrade factors stay. The formula is
  `min(basePower,26)*L*(1+.01*(L-1)) + 352*max(0,L-70)^2*strength`.
  This bounds later-roster advantages at comparable development without
  imposing a dynamic damage-share cap or removing paid upgrades.
- Rift and Wisp cards use the same current passive DPS, including contextual
  damage Bonds and current Support. Wisp cards also show base DPS and Support
  multiplier; expandable details separate raw Power and ability hit damage.

These are implementation decisions under the user's requested rebalance, not
new workflow restrictions or a separate approval stage. Integration, CI, signed
delivery and observed human/device acceptance remain required as recorded in
the task. A local candidate or this decision document does not prove completion.
