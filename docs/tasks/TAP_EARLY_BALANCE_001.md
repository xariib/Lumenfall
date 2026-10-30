# TAP_EARLY_BALANCE_001 — useful opening taps, Wisp-led progression

Status: integration validation in progress. Owner: this feature chat. Branch:
balance/tap-early-001. Original baseline main41566c97; integration base
main1f316cc5, including upstream Rift navigation/PR30. Physical-phone and human
pacing acceptance remain open. No new binding rule.

## Original requirement — 30 October 2026

“Tap dmg er meget meget lav, den skal være god i starten, så man kan komme
videre i spillet, dog skal det ikke være den fuld primær dmg source.”

Make taps useful at the start without making them the main ongoing damage source.
Preserve other mechanics, saves, paid upgrades and progression.

## Implemented behavior

Guardian Tap starts at 20 damage instead of 5, plus the unchanged 2% of general
Active-party passive power. Manual/Auto-Tap, the damage ledger and encyclopedia
agree. Purchased tap multipliers, Kindling, Support, Mark/Cadence, manual input
limits and one-Hz Auto-Tap remain intact. Wisp damage, prices, enemy curves and
save schema are unchanged.

The fresh 69-HP enemy takes 4 rapid taps instead of 14. With the same earned-resource
three-taps/second policy, Rift 10 takes 18.67s instead of 54s. An early
Ember 25/Tide 10/Stone 5 party assigns 29.32% of passive-plus-manual damage to taps;
abilities add further Wisp damage. The retained developed-save reference gains
only 2.53/2.53/2.62/2.83% more clears in four consecutive 8h windows. These are
synthetic comparisons, not human pacing acceptance.

Necessary timing fixes: discrete/batched Mote payouts use the same saved
millisecond deadline; capped-charge Push without active Auto Ascend uses the
existing exact scheduler; research-only absences rebuild volatile timer caches
without advancing saved combat phases. All four one-second reference windows
were regenerated with the existing generator; previous reference retained.
Historical counterfactuals retain their original clock policy and every original
summary assertion. Timer observers validate optional bases and compare physical
phases with original tolerances; exact cold-load and resumed-event checks remain.

## Verified checkpoints

[PR29](https://github.com/xariib/Lumenfall/pull/29), head82966f44, tested merge4f9246d8:
all seven workflows,190 main scenarios plus1 isolated offline scenario with18
original cases, and runtime smoke PASS. [Receipt](../qa/tap-early-balance-001/ci-head829.json).
Focused53 checks/five controls; modern/actual V8 6.0 contribution8,099 checks
and25,968 preservation checks PASS. The old-head uppercase-result review finding
was fixed/resolved. Comet optional timer-history object identity was corrected;
12 cases and two corrupt-basis/phase-drift controls PASS. [Finding](../qa/tap-early-balance-001/ci-timer-observer.json).

Signed0.2.61, code1000061, passed installed API31/WebView91 upgrade, both saves,
paid progress, UID/origin and all15 packaged assets. App sourceC64f98d3.
[Historical Android receipt](../qa/tap-early-balance-001/android.json).
No public release; self-review/automated checks only, no independent final-head review.
Earlier detailed checkpoints/failures are preserved in the
[immutable pre-integration task](https://github.com/xariib/Lumenfall/blob/82966f4430e4fcd8fbe018ef1b01647bc4cc6220/docs/tasks/TAP_EARLY_BALANCE_001.md).

## Current integration and next action

PR30 advanced main immediately before the validated merge attempt; GitHub
rejected that attempt with a reference-file conflict. Merge main1f316cc5 into
this branch, retaining upstream navigation/tests/Android acceptance. Only the
golden source hash conflicted; game code merged cleanly. Regenerate all four
reference windows from combined source, not a hash-only edit.

Combined app SHA256:3f659a45352fbc14b638903a8b45f6bbb79d1ee8360fb4a9b4962655c288c002.
Focused53/five and Comet12/two controls PASS on those bytes. Navigation core PASS; all four regenerated reference states are unchanged. Commit/push the integration,
rerun all seven workflows and build a new signed, non-publishing Android candidate
containing both changes. Recheck current main before merging; preserve other work.

Save final CI/integration/APK receipts and update [current status](../PROJECT_STATE.md).
Keep the feature/chat open until physical-phone pacing, exact WebView60 DOM
and TalkBack acceptance are recorded. Do not archive while unverified.
