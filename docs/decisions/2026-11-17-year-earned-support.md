# Year-earned Support uptime

17 November2026 user correction within [TEAM_PROGRESSION_001](../tasks/TEAM_PROGRESSION_001.md):

> No the support buff should not have a with at least 3 seconds cooldown. It must have a higher cooldown than the uptime, but late late game with upgrades it should be possible to earn 100% uptime of the support buff. It could actually be up to 1 years playing

This supersedes the earlier90-day earliest sustained-uptime target and the
initial6s recast implementation. Other team damage/manual Ascension rules stay.
The following concrete implementation was announced before product edits:

- Tide/Aurora start3s active with13s between cast starts:10s off. Before
  Endurance8, downtime must exceed that source's buff duration. Ranks0–7
  have minimum intervals13,12.8,12.6,12.4,12.2,12,11.8,11.6s; duration remains
  3+0.3×rank seconds. Charge/external grants cannot bypass these limits.
- Rank8 is the earned sustained-cycling milestone: minimum interval4.8s
  (ranks8–10), still limited by natural Charge. Rank8 lasts5.4s; sufficient
  Charge can renew before expiry. Rank10 remains6s. Strength/Ultimates stay.
- Keep original45-day/rank minimum at continuous8x/all work reductions,
  existing prices/access/cap and paid boost costs. Eight ranks therefore take
  at least360 dedicated research days after first access in the fastest
  paid scenario. This is an earliest research-work bound, not a promise that
  every account achieves it one year after creation; slower boosts take longer.
- Before rank8, even two perfectly staggered3+.3r buffs cannot cover every
  instant:2×duration is strictly below the minimum interval through rank7.
  Their existing additive strengths and cast snapshots remain unchanged.
- Preserve completed ownership, active/paused remaining work, boosts/queues,
  currencies and existing cast strength/expiry/recast snapshots. Apply the
  new interval to future casts; no save reset/schema change or account-age gate.
- Show duration, start-to-start recast and earned milestone clearly in Wisp,
  Lab and relevant encyclopedia descriptions. Correct the recorded legacy
  encyclopedia duration sentence within this timing correction.

No new approval stage or workflow rule. Standing authorization covers tests,
integration and a new signed Android release. Required CI/native/public checks
must pass on the corrected source; old0.2.130 evidence remains historical.

Calibration correction announced before applying: initial13s replaces planned
12s (3s active/10s off). The12s candidate caused a stable starting-charge phase
forecast discrepancy7.69% against the unchanged5% acceptance. A13s interval
passes that same canonical/phase test (worst relevant phase error1.28%). Full
existing calibration/controls remain required; no tolerance is relaxed.
