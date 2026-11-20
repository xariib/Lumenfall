# WISP_GAMEPLAY_PACING_001 — earned roster growth and compact upgrades

Status: in progress. Owner: this feature chat; no delegation or new chats.

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

## Validation and continuation — 20 November06:00CET

Product source39199dfe5160773e0fb1300878b4119183a7a6e071871135699982b284759bd4,
feature head0aceaa1e5c05689a32c254b695a5e1223527554b before the diagnostic/test
checkpoint. Mainc18e6189/public APK0.2.139; no merge or public update yet.

Current source: core419 with6causal controls PASS, including earned access at
25kills/cold load. Fixed a real sync/chunk offline entitlement difference by
synchronizing access at authoritative reward checks. Original Lab batch1/2/31/
256, rollback/retry/recovery/long-tail checks PASS with full endpoint equality.
Resonate full native input/contrast/counter/backup/Ascend tests PASS. Complete
native Enter includes its character event; rawKeyDown alone did not activate a
summary. Exact manual/automatic Void664613998 quotes/debits and retired Tree
purchase rejection PASS; original fixture bytes and assertions retained.

Four independent one-second8h windows reproduce released VM hashes/browser
reward totals first, then compute new-price378/320/321/323kills. Current bulk
and independent caller wallets/timers/all other fields match exactly. One HP
endpoint differs1.164e-10 within two rounding units, stricter than existing HP
tolerance; other three endpoints exact. Refreshed golden binds actual39199dfe
product. Original vectors retained in history and
[earned reference](../qa/wisp-gameplay-pacing-001/local/offline-reference-earned.json).
Actual browser cold8h/resume/repeat/cancel/save-retry/day-rollover PASS.

Earlier source-labelled targeted passes: Deeds495, requirement2546, Team1924,
early2400, fullAudit318/3controls, Comet12776/1075489numerical, Tree12215/14074,
Forge480, offline18records, manual8h30498 with fractional Farm-clock control,
quantity VM439/browser1033, cap20native576, permanent506, clarity1432,
compact42678/18profiles, expanded12600/12profiles and scroll3277. Intermediate
receipts are not exact-main/native acceptance. Later CI covers current source.
[Local evidence](../qa/wisp-gameplay-pacing-001/local/),
[remote evidence](../qa/wisp-gameplay-pacing-001/remote/).

Ordinary88browser scenarios on39199dfe finish with only Windows medium-Farm
no-completed-QA failure, previously reproduced on unchanged released baseline.
Full local main sweep is intermediate, with obsolete flat-card/20Tree/Void70000
expectations reconciled and the earned-access regression fixed.12hVM exceeded
unchanged300s under concurrent Windows load; exact-source Linux gate is still
required.12hUI initially lacked generated mobile/www staging; correctly staged
rerun PASS9records. Layout tests still demanded no disclosure: now inspect real
expanded compact details and retain all cost-icon/viewport checks; dense5PASS,
fresh/boss/accessibility also5each PASS (20 total). No deadline/gate weakened.

Shared PROJECT_STATE feature entry is short because an earlier799-byte entry
overflowed other workflow task budgets. All39workflow contexts PASS with the
unchanged32KiB limit. Shared fixtures.json remains byte-for-byte SHA256
3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2. Historical
counterfactuals explicitly restore old price/Deed inputs; current-price parity
and actual payments remain required. Original archives untouched.

Automated [ability disclosure finding](https://github.com/xariib/Lumenfall/pull/64#discussion_r4637885600)
resolved through per-Wisp open/focus preservation and causal controls. Native
attempts44664790331/44666715234 found detached input targets; guard only markup
replacement through native input, settle all simulation, release on end/cancel/
blur/hide.44668226758 opened7cards, Titan pre-tap hit failed; legacy-focus replay
reproduced scroll movement when preventScroll is ignored. Existing exact-scroll
action restoration now covers outer summaries.18profiles/eight-card replay PASS,
removing repairs fails exact assertions. Initial failures remain in QA.

Private build44670896819/version1000143 (older3a9f0140, d8f5f17f product) PASS
both saves/paid work/UID/origin, eight native disclosures, ability explanation
after purchase,288–292px cards,120Prism migration once/firstfive/presets/owned
sixth/cold restart, native updater install/Open and retail Android launch.
[Prior private receipt](../qa/wisp-gameplay-pacing-001/android-private-validation/receipt.json).
This is not native proof for the later39199dfe earned-access change.

Current private build44676160957/version1000144 at0ace failed twice on cold
restart: Installed game initialized and freshly saved both migration slots.
Stack at android-upgrade.cjs:487 proves initial migration settled/validated
before cold launch, but final cold slots/readiness were not recorded. Cause is
unknown; do not call it fixed or a confirmed emulator fault. Both same-source
attempts retained, assertion/wait unchanged. Add per-phase last probe (both
slots, navigation time, visibility/focus/startup/overlays) and failure screenshot
before choosing a repair. New diagnostics do not extend waits or bypass checks.
[First failure](../qa/wisp-gameplay-pacing-001/android-validation-44676160957/receipt.json).

PR lanes at0ace: Comet/Lab/Tree/Forge/sharedUI/Wisp-scroll/permanent PASS;
permanent first Browser.getVersion timeout before checks is retained alongside
unchanged-SHA rerun PASS. Premerge44676151137 still running; isolated offline
PASS. New layout assertions/native diagnostic need publishing and current-head
gates. Self-review/automated checks only; no independent human review.

Next: finish targeted layout check, publish diagnostic/test checkpoint, rerun
private build to capture cold failure evidence, repair actual cause if needed,
finish current PR gates, merge64 at expectedhead, run all nine exact integrated
main gates, then signed public APK/actual updater/retail/anonymous assets+feed.
Save final task/PROJECT_STATE/evidence in GitHub. Product remains39199dfe;
diagnostic/layout-test edits do not require regenerating its reference.
Keep task/chat open for physical phone/WebView60 DOM/TalkBack/human pacing and
Google verdict. Google classification explicitly NOT_TESTED; no promise of a
cleared warning. Separate Play PR63 remains open/untouched. Temporary local
test outputs remain after automatic cleanup review rejection; do not retry
recursive deletion. No questions, permission requests, new chats or delegation.

06:09CET: diagnostic run44678206541 proves first migration897Prisms/node1/
fiveActive/paid receipt, then cold app visible/focused/complete/fresh-saved but
reverted to entire earlier777Prism/node0/twoActive fixture. This is data rollback,
not a readiness-only delay. New injected fixture omitted the existing baseline's
6000ms storage-settlement interval before force-stop. Require complete document
and use that established interval; preserve80x100ms cold wait/all assertions.
[Probe/control](../qa/wisp-gameplay-pacing-001/android-validation-44678206541/receipt.json).
Cause is inferred storage settlement; corrected native run still required.
Full local sweep found one final old fixture: Tide reconstruction lacked its
new25kill requirement. Fund only that synthetic prerequisite; Formation8cases/
6negative controls PASS. Linux Wisp704 layout settle expired300ms after11checks;
same-product Windows PASS, old0ace both platforms PASS. Failure saved; unchanged
same-SHA failed-job rerun. Publish setup/Formation correction and repeat private
native/current CI. Game/golden bytes remain39199dfe; public still0.2.139.

06:53CET: [current validation checkpoint](../qa/wisp-gameplay-pacing-001/NATIVE_CONTINUATION.md) records native147 PASS and corrected mobile requirements. Publish QA follow-ups into PR64 for full validation.
