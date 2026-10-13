# Approved Support downtime implementation

F18 durations are1s normal/1.5s Ultimate. Each Support stores its next eligible
cast timestamp from the capped natural cycle6..10/3s. Charge grants and paid
Resonate remain intact, but ready charge waits for that timestamp. Cooldown
survives reload/backup/Ascend; already-earned old buffs retain their original
strength/deadline. Existing schema4 already blocks the released schema3 reader;
this unreleased collection adds the two validated deadlines without another
schema change. Invalid deadline maps reject for recovery.

The HUD estimator models the same interval, and the charge bar announces the
remaining Support wait. User text describes the new durations/minimum interval.

Focused independent tests:1594 checks/four actual killed controls, including
unlimited external charge, staggered pair downtime, real paid Resonate, full
save/backup fields and live/offline/whole/split state comparisons. Browser
support-stacking PASS; Forge and calibration controls PASS; Swift core PASS.
Wisp contracts8099 and preservation8592 PASS. The historical scheduler remains
unchanged in its oracle; only the approved Support rule is applied, with an
independent interval-union reference in the new focused tests. No repaired
Farm clock was copied into that oracle. Original pre-Support evidence remains.

Final six CI lanes, long offline and Android acceptance remain pending. This is
an isolated candidate, not integrated/released completion.
