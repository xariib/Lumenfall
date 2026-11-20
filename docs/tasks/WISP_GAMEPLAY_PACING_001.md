# WISP_GAMEPLAY_PACING_001 — earned roster growth and compact upgrades

Status: integrated, release/device acceptance pending. Owner: this feature chat.

## Original request — 20 November 2026

Start with one Wisp and unlock the others gradually through requirements. Later
Wisps (example: Thorn) must have recruitment, level, rarity and ability costs
appropriate to their unlock economy; they must take time to develop rather than
immediately reaching the available rarity/ability cap. Add more Deeds. Strikes
must continue indefinitely with increasing targets and rewards, like Rift goals.
Maximum Formation is five, including with upgrades. Simplify/shrink Wisp cards;
say Empower, without Next; maxed ability has a gold box without arrow/Maxed text;
explain abilities clearly. Remove Forge purchase multiplier. Fix Deeds navigation
notification rendering behind its icon when pressed. Finish fixes before a new
APK and in-game update; investigate/remove the reported harmful-app warning.
User requests no questions and authorizes completing delivery while asleep.

## Baseline and preservation

Latest main c18e6189, Android0.2.139. Isolated branch
`feature/wisp-gameplay-pacing-001`, worktree `C:/lf-gameplay`. Root checkout and
other worktrees untouched. Only open PR found: Google Play preparation PR63,
which owns separate native/store build work; preserve it and existing signer.
Read [startup](../project/CODEX_START.md), [workflow](../project/FEATURE_WORKFLOW.md),
[prior roster](TEAM_PROGRESSION_001.md), [cards](WISP_CARD_SIMPLICITY_001.md),
[Deeds](DEEDS_PROGRESSIVE_001.md), [Forge](FORGE_YEARS_001.md) and affected code.

Fresh saves already have only Ember1, other Wisps0. Later unlocks require
Wisp Ascendancy17/23/29/34/47 but their prices still use early-game base costs;
ability purchases have no development prerequisite. Sixth Companion currently
adds a sixth slot for120Prisms. Strike goals end at10000; Rift goals end at1m.
Forge has a separate quantity selector. Preserve all purchased Wisp levels,
rarities, modules, Ultimates, Mastery, access entitlements and saved currencies.
Retain eight recruitable Wisps with five Active slots; never delete the roster.
Retire/refund the paid sixth-slot purchase once with a validated save receipt;
trim six-member active/preset/rebuild selections deterministically, retaining
every Wisp's owned progression on the bench. Preserve combat timing, Support,
Labs, Forge caps, manual Ascension, Mote cooldown, recovery, Android identity.

## Acceptance and next action

Cover new/funded/locked recruitment and upgrades, staged progression and exact
debits, old progress/entitlements and idempotent capacity refund/selection
migration. Cover indefinitely advancing Strike/Rift goals, rising rewards,
one-time receipts, pending claims, cold reload and offline parity. Verify compact
cards, gold-only completed ability, ability copy, Empower naming, Forge quantity1
and visible navigation notification at320/390/430px/enlarged text/keyboard/touch.
Run existing relevant checks and all required exact-main release gates; review
complete diff. Build/publish established-signer APK only after fixes/gates, verify
both save slots/actual updater/native launch/public APK-assets-feed. Record
self-review and physical-phone/WebView60/TalkBack/human pacing limits honestly.

Google controls Play Protect verdicts. Google Play PR63 and account/store review
remain separate; never promise a clean Google verdict without observed evidence.
Primary guidance: [Google warning guidance](https://developers.google.com/android/play-protect/warning-dev-guidance),
[installer permission policy](https://support.google.com/googleplay/android-developer/answer/12085295).
No new binding project rule proposed beyond the user's explicit gameplay request.

## Implementation checkpoint

Implemented targeted product changes: Ember-only start retained; Tide requires
Rift5/25defeats, Stone Rift10/100defeats/Wisp Ascendancy1. Existing access survives.
Later prices use fixed unlock-economy bases: Gale2361183, Thorn39614081,
Void664613998, Aurora6968982875, Titan3138550867693Lumen, anchored to the cost
scale of their required research. Ember/Tide/Stone bases stay10/60/360. Each
four ability levels requires another5Rifts/two completed Wisp Ascendancy levels;
later rarity tiers require another10Rifts/three research levels per tier in
addition to existing requirements. Existing paid levels/effects stay. These are
explicit implementation assumptions under the user's no-questions instruction;
calendar pacing/human feel remains unverified.

Five Active slots enforced through loading, presets/rebuilds and Field actions;
Sixth Companion retired, optional validated once-only120Prism receipt for owners.
Eight recruitable Wisps retained. Strike/Rift continuations double each target
after10000/1m and add5Comets each stage, with persistent existing achievement and
claim identities. Added20 milestones across recruitment, ability, rarity and
Ultimate development. Exact large-counter boundaries covered. Forge selector
removed and restored selection resets to1. Empower retains its name. Completed
ability removes the next arrow/Maxed text; gold state stays. Ability explains
automatic100-charge casts and its effect; detailed mechanics remain available.
Wisp upgrades move into one native disclosure to make default cards compact;
this intentionally supersedes earlier always-expanded card acceptance. Damage
overview moves inside its existing details. Navigation notification gains its
own foreground stacking position, including while its icon is pressed.

## Current validation and delivery checkpoint — 20 November 2026

Product SHA25639199dfe5160773e0fb1300878b4119183a7a6e071871135699982b284759bd4.
PR64 merged at8efc0befe366fc0a684352466c4e9b9c1d745b1a on20 November08:21CET.
All eight PR workflows PASS at9e5b8620, including190 main plus1 isolated offline
scenarios. Main's game/tests/Android/workflow files equal that candidate.
All nine exact-main workflows PASS, including190 main plus1 isolated offline.
Latest public APK0.2.139; signed public0.2.148 build44701460304 is running.
Task-owned QA branch holds evidence follow-ups; keep main fixed during its
gate/build window. Worktree C:/lf-gameplay. No delegation or new chats.

Current local passes include419 core checks/six causal controls, exact Lab
offline batch1/2/31/256 with rollback/retry/recovery, full native Resonate input,
20 mobile layout profiles,889 endless mobile checks/72cases/12profiles,
758 Wisp contribution checks/12profiles,200 recruitment integration checks,
622 original Echo-refund checks,22 Swift records and14 remaining engine suites
including14 negative controls. All original fixtures.json bytes are retained:
SHA2563f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2.

Four independent one-second8h windows first reproduce historical VM hashes and
browser reward totals, then compute current378/320/321/323kills. Bulk endpoints
match all state fields exactly except one HP delta1.164e-10 within two native
rounding units; other three endpoints exact. Current golden binds product39199dfe.
Historical vectors/archives remain unchanged. Farm4h preserves the original
price endpoint15859808.49997803 and current11737479.4999781, identical Shards,
all chunk partitions/tolerances and negative control. Actual browser offline
return/resume/cancel/save-retry/day-rollover PASS. Full Windows discovery sweep
is not release acceptance: medium-Farm no-completed-QA also reproduces on the
released baseline;12h VM exceeded unchanged300s under concurrent local load.
Exact-source Linux PR and integrated-main190+1 suites now PASS; local Windows
limits remain recorded as development evidence, not release acceptance.

Private signed Android147/run44680838036 attempt2 PASS at6fe576fb; its product
and Android code equal integrated main. APK SHA256fc8ebb7ef4ca05a6509f3e5063fd799c9c9cb17a41d01a641745a95bd563d755.
Package com.lumenfall.app, established signer, both saves/paid work/UID/origin,
native eight-card disclosures/explanations after purchase,288–292px compact
cards at320px, five Active/bench ownership/refund120 once through cold restart,
official+candidate actual updater install/Open and normal retail launch PASS.
This private build is not public delivery or Google/physical-device acceptance.
[APK-bound receipt](../qa/wisp-gameplay-pacing-001/android-private-current/receipt.json).

Review fixes: preserve ability explanation state/focus through live renders;
preserve summary input targets through trusted gestures while simulation fully
settles; restore exact scroll when old WebViews ignore preventScroll. Causal
removal controls fail. Fixed actual sync/chunk offline earned-access divergence
by synchronizing recruitment entitlements at authoritative reward checks.
Automated review thread resolved; full self-review recorded, no independent
human review. Android QA cold-fixture rollback was reproduced with phase probes
and repaired with the baseline's existing6000ms storage-settlement interval;
all assertions/cold wait retained. Null-safe navigation diagnostic and HTTP
metadata evidence added. Earlier failures/unchanged retries are preserved.

[Full earlier chronology](../qa/wisp-gameplay-pacing-001/PRE_INTEGRATION_HISTORY.md),
[continuation/run references](../qa/wisp-gameplay-pacing-001/NATIVE_CONTINUATION.md),
[self-review](../qa/wisp-gameplay-pacing-001/self-review.json),
[local evidence](../qa/wisp-gameplay-pacing-001/local/),
[remote evidence](../qa/wisp-gameplay-pacing-001/remote/).
All39 workflow startup contexts pass the unchanged32KiB limit. Shared status
entry must remain short: other task contexts have only43bytes remaining.

Next: finish public signed0.2.148 build44701460304 at integrated8ef;
verify native/update/retail receipts and publication,
anonymous latest/tag APK bytes and in-game feed. Save final task/shared status
and release evidence in GitHub. Do not move main during its gate/build window.
Main premerge run44694394498; other exact-head run IDs are saved in remote/status-8efc0bef.json.
Late QA follow-ups contain docs/evidence only and can integrate after publication.

Physical phone/exact WebView60 DOM/TalkBack/human long-term pacing remain
unobserved. Google Play Protect classification is NOT_TESTED; warning clearance
cannot be established from signing/security/retail launch. Separate Google Play
PR63 remains open/untouched. Keep feature/chat open for remaining acceptance.
Automatic cleanup review rejected temporary local-output removal; retained
untracked files, no retry through another tool. No questions or new permissions.

07:24CET: PR68 premerge44684031007 passed progression/recruitment and all
automation clocks, then failed an obsolete quote count in cheaper-refund-
development.js:2000 assumed20 live Tree paths; retiring Sixth Companion leaves19.
Split state preservation from the exact1900 quote-count assertion; retain100
quotes per current path, zero quote copies and one materialized payment copy.
Full refund/browser47groups PASS; mutation controls running. Product/Android
unchanged39199dfe/6fe. Preserve failure; publish test-only correction and repeat
full PR CI, then integrate/all9main/public native release.
All17 refund defect controls PASS with intended behavioral assertion failures.

07:37CET: current PR head9e5b862071df1ec91fcf809b1de47d61aa1c11b0 frozen.
Remaining collection/currency UI, affordability with all existing controls/native
checks, notification/quest focus, standard recruitment/refund browser and exact
payment oracle PASS. All17 ordinary payment defect controls also PASS with
workflow's exact expected assertions and clean teardown. Saved local/remaining-ui.
Evidence-only follow-up stays on QA ref; do not restart PR. All product/native
code matches private147. If PR passes, merge64 and run all9 at that main merge;
late QA docs may integrate after public verification because no code differs.
