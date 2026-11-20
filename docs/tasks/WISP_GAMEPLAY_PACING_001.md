# WISP_GAMEPLAY_PACING_001 — earned roster growth and compact upgrades

Status: integrated and published0.2.148; device/Google acceptance pending. Owner: this feature chat.

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

## Integrated release and verification — 20 November 2026

[PR64](https://github.com/xariib/Lumenfall/pull/64) merged at
8efc0befe366fc0a684352466c4e9b9c1d745b1a. Its code/tests/Android/workflow tree
matches passing candidate9e5b862071df1ec91fcf809b1de47d61aa1c11b0. Late QA
follow-ups and this final checkpoint change docs/evidence only.

[Android0.2.148](https://github.com/xariib/Lumenfall/releases/tag/android-1000148)
is published as versionCode1000148, build44701460304. Both versioned and latest
anonymous APK downloads match SHA25643dad564b189ff700448499bff41d5b0f72a3286beea6a4627ae2e79bdaf1e65
(5166638bytes). Packaged index.html binds SHA256
39199dfe5160773e0fb1300878b4119183a7a6e071871135699982b284759bd4; all assets
match source. Package com.lumenfall.app and established signing identity stay.
Latest-release metadata and its APK/commit/hash/security/upgrade/updater receipts
match the actual tested artifact, making the release available to in-game updates.
[Delivery summary](../qa/wisp-gameplay-pacing-001/delivery.json),
[anonymous public proof](../qa/wisp-gameplay-pacing-001/android-release/public-verification.json).

All eight PR workflows PASS at9e5b8620. All nine workflow_dispatch validations
PASS on exact integrated8efc0bef, including190 main plus1 isolated offline
scenario in both PR and integrated runs. Integrated premerge44694394498;
[all nine run references/log receipts](../qa/wisp-gameplay-pacing-001/integrated-validation.json).
CI uses Node24.19.0; Android build uses Node22; local checks used Node24.22.1.
No assertion, deadline, gate or historical archive was weakened to pass.

Final signed APK acceptance PASS: both save slots/paid Studies/progression/UID/
origin, native eight-card touch controls, explanation retained after purchase,
default288–292px cards at320px, original120Prisms refunded once, five Active,
owned sixth retained on Bench and cold restart. Actual official/candidate updater
install/Open and normal non-debuggable retail Android launch PASS.
[Installed upgrade](../qa/wisp-gameplay-pacing-001/android-release/emulator-upgrade.json),
[updater](../qa/wisp-gameplay-pacing-001/android-release/in-app-updater.json),
[retail launch](../qa/wisp-gameplay-pacing-001/android-release/production-runtime.json).
Final screenshots were visually self-reviewed; receipts use synthetic saves,
not the user's physical phone. Private147 passed earlier on identical product/
Android QA code; final148 independently passed on the exact public artifact.

Focused passes include419 core/six causal controls; exact Lab batches1/2/31/256
and rollback/retry/recovery;20 layout profiles;889 mobile progression checks/
72cases/12profiles;758 Wisp contribution checks;200 recruitment integration;
622 Echo-refund checks;22 Swift records;14 remaining engine suites/14 controls;
full collection/affordability/native UI, notification/focus, payment oracle and
both sets of17 payment/refund defect controls. Full refund browser47groups PASS.
[Local receipts](../qa/wisp-gameplay-pacing-001/local/),
[CI receipts](../qa/wisp-gameplay-pacing-001/remote/).

Four independent one-second8h replays first reproduce historical VM hashes and
browser reward totals, then compute current378/320/321/323kills. Every current
state field matches bulk exactly except one HP difference1.164e-10 within two
native rounding units; other three endpoints exact. Original vectors retained.
Farm4h preserves original-price15859808.49997803 and current11737479.4999781
Lumen endpoints, identical Shards and original chunk/tolerance/negative checks.
Shared fixtures.json is byte-for-byte SHA256
3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2.
Earlier Windows medium-Farm no-completed-QA also reproduced on the released
baseline;12h VM exceeded unchanged300s under concurrent local load. Both exact
Linux PR/integrated190+1 suites now pass. Discovery logs remain labelled.

Changed files: targeted index.html gates/prices/refund/Deeds/compact UI changes;
three scripts/ci Android acceptance/receipt diagnostics; focused new gameplay/
offline-reference tests and existing tests reconciled with intentional prices,
five-slot retirement and disclosures; task/shared status and QA receipts.
No Android product code or workflow changed; separate Play PR63 is untouched.

Self-review resolved the automated disclosure-state finding, native detached
input/legacy-focus movement, and actual earned-access sync/chunk divergence.
Cold injected-save rollback was reproduced with phase probes; restored the
baseline's existing6000ms pre-stop settlement, preserving all cold assertions
and waits. Null-safe root/HTTP diagnostics retain earlier failure evidence.
Corrected an obsolete20-live-Tree quote count to19 after Sixth Companion
retirement:100 quotes/path, unchanged state/zero ledger copies/one payment copy
still required. All controls then fail their exact intended behavioral assertions.
[Review](../qa/wisp-gameplay-pacing-001/self-review.json),
[earlier development history](../qa/wisp-gameplay-pacing-001/PRE_INTEGRATION_HISTORY.md),
[native/integration chronology](../qa/wisp-gameplay-pacing-001/NATIVE_CONTINUATION.md).

## Remaining acceptance and next action

Keep this feature/chat open. Physical phone, exact WebView60 DOM, TalkBack and
human long-term pacing remain unobserved. Google Play Protect classification is
NOT_TESTED: signing/security/retail launch do not prove the harmful-app warning
is cleared. No Google store/review/account action was taken; PR63 stays separate.
Next: save actual device/pacing/Google installation evidence when available and
resolve any observed issue before claiming full completion or archiving.

Automatic cleanup review rejected temporary local-output removal; those files
remain untracked. No retry through another deletion tool. No new binding project
rule, permission request, question, chat, delegation or unrelated release.
