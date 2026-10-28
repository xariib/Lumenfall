# Lab boost queue — active boost and editable next boost

## User requirement — 28 October 2026

The Speed Up menu itself needs a queue ON/OFF option, inspired by the supplied
The Tower screenshot. Keep the slider. Always allow changing the next multiplier
while a paid boost is running: 1.5x for8h must finish unchanged, then selected3x
starts. Research-level queue and boost queue are separate controls.
Standing GitHub/build authorization from this conversation remains applicable.

## Baseline and scope

Main `8f8f77286a1df6af5049e289fd1582494a979424`; released Android0.2.51 from
`d3420c15`. Product SHA256 `5ce88b6ce6f874935fd65e6182acab01069d0eaa61dab2ec904ec0c18419cc7f`.
Branch `feat/lab-boost-queue-001`; isolated worktree. Only open PR2 is an unrelated
historical documentation audit. Previous release worktree/staged files untouched.
Owner: this feature chat; no subagents.

Baseline code disables multiplier/duration during a paid boost, substitutes the
active multiplier for the saved preference, and simulationBuyStudySpeeds returns0.
No speed-boost queue exists. Existing studyQueue repeats research levels only.

## Reference and design decisions

Primary developer v27 notes by Fuddsworth,14August2025:
https://www.reddit.com/r/TheTowerGame/comments/1mq4wa5/major_update_v27_fleets/
The boost auto-queue reads multiplier/duration from the Speed Up menu. The Tower
also pauses boosts on empty labs; this task preserves Lumenfall's existing paid
wall-clock boost contract, existing8/12/24h durations, prices, discounts and tiers.
Reference imagery informs grouping; keep Lumenfall branding and the slider.

- Keep paid active boost separate from editable next settings, owned by Lab slot.
- Queue ON explicitly authorizes automatic starts/renewals of the shown plan
  when eligible research and Motes are available. Charge once at actual start;
  selecting a future plan does not prepay or alter the active boost.
- Queue OFF stops future starts; current paid speed/time remain intact.
- Latest multiplier/duration selection replaces the next plan and repeats until
  queue OFF. Show current boost/countdown, next plan, price and queue state.
- Insufficient Motes keep the plan waiting; never overdraw or downgrade silently.
- Preserve research-level queue independently, slot boosts across replacement,
  paid legacy speed floors, both save slots/recovery and Ascend preservation.
- Old saves default boost queue OFF. Never reinterpret retired studyUseMotes
  flags as new spending consent. Validate additive slot preference records.
- Run renewals through chronological simulation at expiry/resource boundaries,
  including offline productive time, with the existing12h offline cap and global
  Mote cooldown. No spending beyond simulated productive time.

## Acceptance

1. Active1.5x8h + edited3x plan: active receipt/timer/wallet unchanged by edits;
   exact expiry starts3x once, exact current price debited once.
2. Queue OFF before expiry preserves paid work and prevents renewal. Research
   queue ON/OFF remains independent. Latest edits and queue state survive reload,
   both saves/recovery, research replacement and Ascend.
3. Live/offline/split calls agree across expiry, affordability, completion and
   slot assignment collisions. Simultaneous slots have deterministic payment
   order. Failed persistence rolls back controls and payments.
4. Slider/duration stay usable during a boost. Clear current/next/price/state;
   red insufficient prices, disabled unaffordable manual purchase,44px controls,
   focus/Escape/native-input stability at320/390/430px and enlarged text.
5. Focused regressions and defect controls, unchanged relevant originals, seven
   required workflows, reviewed main integration, signed APK/installed-upgrade
   and public-byte verification. No gate/deadline weakened.

## Checkpoint

Status: released and verified as Android0.2.52; physical/human acceptance pending.
PR18 (https://github.com/xariib/Lumenfall/pull/18) is merged. Product SHA256
`872390af6bfdaacbf606982211a207252f1233c4b47122908e61cdbcd2d58c13`.
Changed root product, Lab harness/controls/timed UI, focused queue numeric/UI
tests, independent offline binding and pre-merge workflow. No balance change.

Additive validated studyBoostQueue records are slot-owned; absent legacy records
stay absent/OFF. Preference writes use the existing atomic primary/recovery-save
transaction. Automatic purchases use the chronological timestamp, expiry and
Luminous funding boundaries; sorted slots cannot overdraw a shared wallet.
The current paid receipt stays separate from selected next settings. Native
slider/select/queue identity and focus survive passive rendering. ON/OFF is
accessible and44px; enlarged content scrolls inside the viewport.

Baseline: timed boosts1480, expansion2676 and queue continuity64 checks PASS.
Current: new queue368 checks/five causal controls, original queue64, boundary2346
checks/five controls, original slot UI452 checks/18profiles and timed UI1182 checks/12profiles PASS. New UI273
checks/18profiles PASS; locked-next defect fails the intended selection assertion.
Node24.22.1, Chrome156.0.8078.47. Source syntax/lifecycle guards and diff check PASS.
Independent one-second four-window rewards unchanged. Entire four endpoint
states match baseline/candidate when rerun with the same current harness; the
regenerated binding retains those outcomes. Lab Motes native UI also passes.
Self-review only; no independent human review claimed. Evidence will be retained
under docs/qa/lab-boost-queue-001/ with CI and release receipts.

Automated integration/release acceptance is complete; final source-bound evidence
and remaining physical/human acceptance are recorded in the delivery section below.

Live auto-purchase review correction: the production tick uses a detached state
when boost consent is ON and commits a paid renewal before presenting it. Primary
write failure restores the entire tick and resets its study-clock memo; recovery
write failure retains an accepted primary payment. Failed-write/retry/reload and
causal live-rollback tests cover this. Product UI also resumes its real interval.

## PR18 continuation — 28 October 2026

User: "Kør pr18 færdig så." Finish this PR, its required integration checks and
the signed APK delivery. Continuation uses an isolated detached worktree from
PR head377d9125; the original dirty feature/release worktrees remain untouched.
The existing uncommitted empty-slot queue-OFF candidate was copied and reviewed
in isolation, preserving its original files.

Run40655664375 failed only lab-motes-native and lab-motes-reduced-motion at
"Tab reaches funded action". Reproduced unchanged head locally. The new queue
checkbox correctly occupies a Tab stop between range and purchase. The driver
now asserts that stop and that focus alone keeps queue OFF, research repeat ON
and the wallet unchanged, then retains the original exact-payment/focus checks.
No gate, assertion, deadline or tolerance was removed or weakened.

An empty Lab now exposes a44px Queue Speed Up OFF action without requiring a
research purchase. OFF uses the existing atomic transaction, preserves paid
time, wallet and next plan, survives reload, and returns focus to that Lab.
Failed-save rollback and touch/mobile coverage verify the path.

Final local receipts:379 core checks/five causal controls,327 UI checks across
18 profiles and both native motion cases across six profiles each PASS.
Source/context/identity self-test and whitespace checks PASS. Independent
one-second offline windows were regenerated; all four complete endpoint state
hashes and rewards exactly match prior tested PR source. Receipts are under
../qa/lab-boost-queue-001/final-local-*.json and native-focus-regression.json.

Next: seven final-head PR workflows, reviewed integration, seven exact-main
workflows, signed installed upgrade and public exact-byte APK verification.
Physical phone/WebView60/TalkBack/human pacing remain separate open acceptance.

## Integrated checkpoint

All seven final-head PR workflows PASS on4a5923af, including the complete189
main scenarios, isolated offline case and runtime smoke. Both formerly failing
native Lab cases PASS in full CI. No rerun or weakened check was required.
Self-review complete; no external reviews or unresolved threads existed.

PR18 merged at8eae10315e72677a6098820aca92128caf696d41. Entire integrated
tree9309c269c7bda08e0ae3684c06e1c54e241f46eb exactly matches tested source.
[PR gates, jobs and prior failure](../qa/lab-boost-queue-001/ci-pr.json).
User continuation request: verify already saved/completed work, then finish the
remaining delivery. Prior worktrees and unrelated files remain untouched.

This integration checkpoint preceded the complete delivery below.

## Verified delivery — 28 October 2026

[Android0.2.52](https://github.com/xariib/Lumenfall/releases/tag/android-1000052),
versionCode1000052, sourceadaf602c52546c491b273862dd2c5c4dfee690fd.
[All seven exact-main workflows](../qa/lab-boost-queue-001/ci-final.json) PASS,
including189 main scenarios, the isolated offline case, both native Lab input
cases and runtime smoke. No PR/main test rerun or weakened gate was required.

[Signed Android run52](https://github.com/xariib/Lumenfall/actions/runs/40687869800)
PASS on attempt1: package/version/certificate/assets and installed API31/WebView91
upgrade from signed158. Both saves, paid work, UID/origin and legacy purchases
retained; actual native Wisp purchase and Farm-to-Lab navigation PASS.
The emulator uses synthetic saves and is not physical-phone acceptance.

[Anonymous public-byte verification](../qa/lab-boost-queue-001/download-verification.json)
PASS: HTTP200,7065089 bytes, all15 production assets exactly match source, actual
downloaded certificate matches and the completed native receipt identifies this
exact APK. SHA2568ebedbf664cc1188c03a4d4489b1a050a6f8326a17859b58b229a1b40e60fd96.
[Release/limitations](../qa/lab-boost-queue-001/release.json) and
[original public receipts](../qa/lab-boost-queue-001/release/emulator-upgrade.json).

Cloud Browser stopped responding during dispatch. A temporary isolated dispatcher
completed only existing exact-main gates and the existing signed publishing
workflow, updated release notes and removed its own branch. Its first heredoc
indentation error was corrected; original CI/product/acceptance remained intact.
The workflow copy/checkpoint and run40682568623 preserve evidence. Main remained
frozen atadaf602c until publication and exact-byte checks completed. This final
documentation follow-up changes no product, tests, mobile files or active workflow.

Next: Settings backup, install as an update without uninstalling, then physical
phone/WebView60 DOM/TalkBack/human pacing acceptance. Keep those items open and
do not archive the feature as fully accepted. Self-review/automated checks only;
no independent human review claimed. Other worktrees remain untouched.
