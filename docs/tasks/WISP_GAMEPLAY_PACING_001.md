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

## Validation and live continuation — 20 November03:54CET

Local Node24.22.1: core415 plus5causal mutants, Deeds495, requirement boundaries
2546, team1924, early curve2400, full audit318 plus3controls, Comet12776 and
1075489 numerical cases, Tree12215price/14074economy, Forge480 PASS. Full
offline18records PASS; manual8h30498 checks with1s/cold60s partitions and an
independent60.125s fractional Farm clock control PASS. Old quantity VM439 and
browser1033/6profiles, cap20 native576/12profiles, permanent506/18profiles,
clarity1432/18profiles, compact42678/18profiles, expanded12600/12profiles and
scroll3277 PASS on their individually identified intermediate bytes. Do not
treat intermediate receipts as integrated/native APK acceptance.

Ordinary-browser sweep88cases exposed old Deed totals, Tide unlock feedback,
and unfunded Gale chronology expectations. Corrected exact expectations; both
feedback modes, chronology, endgame, R3 reload, Bond copy and historical Formation
persistence PASS. Keep shared fixtures.json byte-for-byte at SHA256
3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2; the50m Gale
funding is local to its current-price chronology case. The frozen scheduler
counterfactual restores only old investment/new-Deed inputs; actual-current
one-second/whole/split/rollback checks remain. No hash pin, archive or deadline
was weakened. The4h simulation passes its original5s bound after avoiding
redundant continuing-catalog scans; lower-counter paid frontiers and cold
restoration have40 focused assertions. Windows medium-Farm CDP timeout also
reproduces on originalc18; required Linux gates remain mandatory.

Earlier PR passes/failures are source-labelled in [local](../qa/wisp-gameplay-pacing-001/local/)
and [remote](../qa/wisp-gameplay-pacing-001/remote/). Cold Browser.getVersion
failures occurred before checks; unchanged-source reruns passed. Original fixture
edit was restored byte-for-byte. No failed result is a waiver.
Automated [ability disclosure finding](https://github.com/xariib/Lumenfall/pull/64#discussion_r4637885600)
was repaired and resolved; this and the final diff review are automated/self-review,
not independent human review. Installed native checks are now executed below.

05:08CET checkpoint: candidate3a9f01403443f7376e3508192104607052667636,
product SHA256d8f5f17f1eb130bcf286d2bc14846327dcb75c4429b428b5af39fd20b6162121.
Automated ability-disclosure finding repaired; review thread resolved. Native
private attempts44664790331/44666715234 exposed detached click/gesture targets;
44668226758 opened seven cards but Titan failed its pre-tap hit test. Preserved
all failure evidence in the corresponding android-validation directories.
Guard only markup replacement through native activation while settling every
simulation event; release after input/cancel/blur/hide. Reuse exact-scroll action
restoration for outer summaries when old WebViews ignore preventScroll.
18mobile profiles and eight-card legacy-focus replay PASS; removing protection
fails exact input/scroll assertions. Core415/5controls and source syntax PASS.
Premerge44668234962 also found an old-price4h wallet constant. Keep its original
price endpoint15859808.49997803 AND current-price11737479.4999781, with identical
Shard4026523.0000087842, unchanged fixture bytes/tolerances and full chunk/state
comparison.14783checks/negative control PASS; no production timing change.

Private signed validation44670896819 (version1000143, publish=false) PASS:
both saves/paid work/UID/origin retained, all eight trusted Wisp disclosures,
ability explanation retained after actual purchase, cards288–292px at320px,
120Prism refund exactly once, firstfive active/presets, sixth owned on bench,
cold restart, native updater install/Open and retail Android launch.
[Private receipt](../qa/wisp-gameplay-pacing-001/android-private-validation/receipt.json).
Google verdict explicitly NOT_TESTED. Public APK/feed still0.2.139.
Comet/Lab/Forge/Tree/sharedUI/permanent/Wisp-scroll PR lanes at3a9f0140 PASS;
premerge44670894354 remains running, isolated offline PASS. Self-review recorded
in QA; no independent human review. PR63 still open at a50cc488, mainc18e6189.
Next: finish full PR gate, merge64 at expectedhead, run all nine exact integrated
main gates, publish signed APK then verify anonymous assets/feed and save final
task/PROJECT_STATE/evidence in GitHub. Do not archive while required physical/
Google acceptance remains unknown. No new questions or permission requests.

05:18CET: full PR run44670894354 failed only the independent-reference source
binding after preceding checks passed. Replayed all four released one-second
windows against original VM hashes and browser reward totals; then independently
recomputed current-price four8h windows. Current kills378/320/321/323, no resets
or Prism changes. Full-window outcomes/all other saved fields exactly match;
phase0 enemy HP differs1.164e-10, within two native rounding units (stricter than
the existing HP tolerance); phases1–3 exact. Original browser/VM vectors retained
in the receipt/history, fixtures untouched. Fresh reference binds actual product
bytes; no gate/deadline weakened. [Replay receipt](../qa/wisp-gameplay-pacing-001/local/offline-reference.json)
and tests/behavioral/wisp-gameplay-offline-reference.cjs record the method.
Publish reference/evidence checkpoint and repeat latest PR gates, then main
integration/gates/public release as above. Product remains identical to native
PASS3a9f0140; no additional product fix or private build is needed for this test
reference correction. Task/chat remains open; public update not published yet.

05:24CET: run44673561972 failed before gameplay checks because the new shared
PROJECT_STATE paragraph pushed another task over32KiB. Shortened only this new
entry; preserve other task requirements and the limit. Check every workflow task
context before publishing this docs-only correction. Product/golden unchanged.
Local actual-browser offline return/resume/cancel/save-retry/day-rollover PASS
with refreshed378/320/321/323 reference. Full local main scenarios are running.
