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

PR64 ready, branch feature/wisp-gameplay-pacing-001. Pre-review CI head
ca2b97f20300e596c73b5b9aed9ad9323814b900; main remainsc18e6189. That candidate
passes Tree, Comet, Lab, permanent, Wisp(Win/Linux same-head rerun) and isolated
offline. Main, Forge and shared-UI lanes are running. Two cold Linux Wisp runs
failed at Browser.getVersion before any check; failed/pass receipts preserved.
Shared standalone caught an accidental frozen-fixture edit; it was restored,
then the source-identity step passed. Older run failures remain evidence, not
waivers. Current receipts: [local](../qa/wisp-gameplay-pacing-001/local/),
[remote](../qa/wisp-gameplay-pacing-001/remote/).

Automated GitHub review ofca2 found P2: How it works closed on live Wisp renders
([finding](https://github.com/xariib/Lumenfall/pull/64#discussion_r4637885600)).
Fixed per-Wisp open state and summary focus/viewport using existing action-view
restoration. Current product SHA256
0144ada613e5538e95eca655bdcf19318cf1134544e04159432ed34fe3295d58.
All18compact profiles PASS with native keyboard/touch opening, repeated actual
renders/affordability, open/focus/viewport retention, state/both-slot purity and
closed-state retention. Removing open-state restoration fails the exact new
assertion. This checkpoint accompanies the review fix; resolve that thread and
restart exact-source gates after publishing it. This is automated review plus
self-review, not human review.

Android QA now requires native input opening all eight compact cards, retained
Stone20 gold/no-next ability, and an actual ability explanation surviving a real
purchase refresh. A separate installed schema6 six-member owner fixture must
retain paid progress, cap active/presets5, refund120Prisms once in both slots,
then cold-launch and freshly save without repeating it. Receipt guard rejects
missing/wrong proof; tooling PASS. These installed checks are implemented, not
yet executed. Package/signer/origin remain established. Public verifier helper
is prepared locally. No merge/build/publication yet; latest public APK0.2.139.

Next: finish review fix/current-source CI, self-review final diff, integrate64,
run all required/extra exact-main gates, then signed APK and actual emulator
upgrade/updater/retail launch. Verify anonymous latest/tag feeds, public APK
bytes and all assets; save receipts, project state and final status in GitHub.
Keep task/chat open for physical phone, WebView60 DOM, TalkBack, human pacing
and Google's actual verdict. Preserve separate Play preparation PR63. Temporary
test outputs remain uncommitted after automatic cleanup review rejection.

04:01CET: review fix published at3af385a9ec1dfcb4fac5e0223f859d3f8af5f783;
thread resolved after18-profile native-input pass and causal failure proof.
Non-publishing Android validation run44664790331 launched at that head with
publish=false to expose installed migration/UI issues while CI runs. It cannot
update the public feed. Signed public release still requires integrated-main
gates and a separate publish=true build. No public update has been published.

04:16CET: candidate44664790331 failed on native Tide disclosure activation after
old/new signed save preservation passed. No APK published. Reproduced lost
activation when input-time rendering detaches a summary during its click.
Repaired that one activation on the same current Wisp disclosure (also Enter/
Space) without changing simulation ordering, state or save behavior. All18
mobile profiles PASS, including forced refreshes for progression/damage/ability
summaries at320/390/430px; removing repair fails the exact native-input assertion.
Core415 plus5controls and source checks PASS. Native QA now records trusted,
calibrated disclosure events and failure screenshots. Failure evidence saved in
[private validation](../qa/wisp-gameplay-pacing-001/android-validation-44664790331/).
Current product SHA256e64a6999258d038e4a187827c03f4d882dc458bea322f152d4a652ec278eb6ac.
Publish repair, repeat non-public native validation and exact-source CI, then
integrate/main gates/public release. Keep public feed unchanged until checks pass.

04:30CET: second private validation44666715234 retained saves but traced Tide's
trusted pointerdown at its exact center, detached target, and missing click.
Now hold Wisp markup replacement through disclosure activation while settling
all combat/purchases; release the UI guard after the event, on cancel/blur/hide.
No simulation events are skipped. Input guards plus same-disclosure fallback
PASS18mobile profiles; forced pointer-down/click/Enter/Space cases preserve
target, single activation, state and saves. Removing protection fails the
native-input assertion. Source 3ac505d788570088c5f351bb174923ad53ff57644218b8dd26a2fb5b7b62c177.
Publish the repair and launch third private validation, then exact-source CI.
Failure evidence: [second native run](../qa/wisp-gameplay-pacing-001/android-validation-44666715234/).

04:55CET: private run44668226758 opened seven cards with retained trusted input;
Titan failed its pre-tap hit test. Legacy focus replay reproduced off-screen
scroll movement when preventScroll is ignored. Outer summaries now use existing
exact-scroll restoration. Eight-card replay and18mobile profiles PASS; removing
repair fails its specific scroll assertion. Failed native geometry/screenshots
are now recorded. Product SHA256d8f5f17f1eb130bcf286d2bc14846327dcb75c4429b428b5af39fd20b6162121.
Premerge44668234962 exposed an old-price4h wallet constant. Retained that exact
historical-price receipt AND all current-price chunk comparisons; current native
wallet11737479.4999781, old15859808.49997803, both Shards4026523.0000087842.
14783checks/negative control PASS, original shared fixture bytes unchanged.
Core415/5controls and syntax PASS. Publish repair, repeat private native build
and latest-source/main gates before public release. No public APK published yet.
