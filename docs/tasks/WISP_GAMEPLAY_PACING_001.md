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

Baseline Node24.22.1: recruitment83, Deeds415, team1929 and task context PASS.
Current focused core353, Deeds495 and40rarity/eightUltimate/56Mastery requirement
boundaries2546 PASS. Intermediate expanded-card mobile check PASS across12profiles
before the final compact disclosure change; screenshots inspected and showed
cards still too tall, prompting that change. Do not treat that result as final.
Existing finite Forge, Forge/Lab, permanent progression, exploit checks PASS on
intermediate bytes. Original failures preserved in local validation-evidence:
older six-slot/old-price/fixed-Deed/UI assertions now require exact updated
expectations for intentional requirements; these are not waived.

Checkpoint20 November02:56CET: PR64 is draft, last pushed47d3e7ce. Local
Node24.22.1 core375 plus5causal mutants PASS; requirement2546, Deeds495,
team1924, early curve2400, full audit318 plus3controls, Comet12776 and
1075489 numerical cases, Tree12215price/14074economy, Forge480 PASS.
Compact18profiles/42678checks and upgrade-state15348checks PASS on earlier
candidate bytes; full Wisp scroll3277 and expanded upgrades12600/12profiles
PASS on47d3 product bytes. Clarity1432checks/18profiles PASS. Corrected startup
goal to Rift5/25kills after finding its remaining Rift3 text during self-review.

PR47d3 CI: Comet, Lab and shared UI PASS. Failed evidence in this task's
[remote directory](../qa/wisp-gameplay-pacing-001/remote/). Failures exposed
remaining old assumptions: fixed76/17Deeds, expanded cards, Forge quantity5,
new rarity milestone10Comets, retired Tree path count and frozen old-price
offline oracle. Corrected exact expectations; actual-current checks retained.
The frozen scheduler counterfactual restores only old investment/new-Deed
inputs; current-price full one-second/whole/split/rollback checks remain.
Manual offline clock fixture funded100trillion to retain real Push/Farm/Push;
the original unfunded wallet remains covered by the full offline suite. The
updated8h manual check30498 PASS, including1s and cold60s partitions. Its old
negative no longer failed under changed prices; added an independent60.125s
Push-to-Farm fractional timer witness (250/375ms), cold persistence and causal
clock removal control, all PASS. Permanent UI506/18profiles PASS.

PR198394e3: Wisp scroll, permanent progression, Lab and Comet PASS. Main lane
advanced to old Forge-cap multiplier selector; frozen offline comparison only
differs in deliberately removed saved quantity (assert1 and normalize reference).
Tree V8 PASS; one original Prism browser case timed out at unchanged25s with
no QA result, while its three persistence cases and five causal controls PASS;
retain evidence and rerun without a timeout waiver. Self-review found additional
old Forge selector expectations in original browser matrices; adapted player
actions toone-level UI and retained all seven internal batch quantities/caps/
debits. Old quantity restore coverage now requires1, both slots, unchanged paid
ownership/wallets, actual reload/backup and absence of quantity controls. Native
Formation viewport failure controls retained using an actual fourth-to-fifth
Field action under the new limit. No independent reviewer was used.

Local final-product hash135cdd24acfebb7bf5a08c378ee58e7f5aa34c09a3b54f9bbdc3e3bd1ec3d432:
complete offline18records PASS (557s locally; unchanged300s CI gate PASS onfc7),
old quantity VM439/browser1033 across6profiles PASS, cap20 native576/12profiles
PASS, Forge native queue/purchase/focus/scroll PASS. Original browser Deed
effects, Bond descriptions, R3 reload and contradictory Formation persistence
PASS using existing CDP-pipe transport and original25s deadline. Tests for
historical rebuilds explicitly seed already-earned access; current gates are
tested separately. Updated expanded ability-description oracle to require
short100-charge explanation plus complete unchanged mechanics disclosure.
Local receipts and compressed browser logs are in
[local evidence](../qa/wisp-gameplay-pacing-001/local/); Linux integrated and
installed APK results remain pending. fc7 Tree/Comet/Lab/Wisp/permanent CI PASS;
Forge and main lanes still running. No merge/build/publication yet.

Android acceptance now requires actual native touches opening all eight compact
cards, a preserved completed Stone20 ability with gold/no arrow/next, and a
separate installed schema6 six-member owner fixture. The latter must retain
all paid progress, cap active/presets5, credit120Prisms once in both save slots,
then cold-launch and freshly save with no second refund. Receipt validator
rejects missing/wrong migration proof. These native checks are implemented,
not yet executed. No APK built/published and main not integrated yet.

Next: pass remaining local/PR gates, finish complete self-review, integrate64,
run exact-main required/extra gates, then build signed APK, verify real installed
upgrade/updater/retail launch and anonymous public feed/assets. Save durable
receipts and final checkpoint. Physical phone/TalkBack/human pacing and Google's
device verdict remain unknown; keep task/chat open until required acceptance.
