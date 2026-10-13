# FINISH_DEVELOPMENT_RELEASE_001

User12 October: finish remaining improvements, then include developments in
APK. Eventual main/build/sign/release authorized after acceptance, superseding
older holds. No agents/chats. Preserve saves, paid value, currencies, chronology,
assets/package/signer. No unapproved whole-game retune.

[Approved rules](../decisions/2026-10-12-unfinished-gameplay.md): Swift10/refund/
all-paid-Forge Deeds; Support1s/Ultimate1.5s with capped-natural-cycle minimum
recast; Ember/Stone352*max(0,level-70)^2 before Rarity, Titan/prices unchanged.
Baseline development21394fff/main93b8cee. PR114 Swift, PR115 Support, PR116 curve.
Isolated worktrees; PR117 combines the preserved implementations for six-lane acceptance.

Status: combined Swift/Support/curve and campaign measurements implemented.
Review found and reproduced foreground Study jitter and stale offline goldens;
both are repaired. Current source42b180ad passes22 Swift groups/16 controls.
Regenerated four independent one-second offline windows match these exact bytes.
The previous4ed9efd2 five scoped lanes passed; Full failed two stale golden
guards and five stale Support expectations. References/expectations are now
updated; all five affected scenarios pass locally with exact assertions retained.
Full38247336949 subsequently passed all182 scenarios,31 F21 browser groups
and2016 independent funding cases, then exposed stale main-control anchors/
expected failure ordering. All17 repaired main controls now fail precisely,
with changed source and clean teardown. Product bytes remain42b180ad.
New exact-head six-lane CI and signed APK acceptance remain pending.
[Current review evidence](../qa/finish-development-release-001/swift/REVIEW_FIXES.md).

Next: pass exact-head six-lane CI, merge PR117 preserving main protections,
build/verify signed APK
and report actual Android/device capability limits.
