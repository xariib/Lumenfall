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

Status: implemented locally, validation and delivery in progress. Product SHA256
`5e058d3825bd2c87fa0c277dd16a57c3379412c5a5c18864e58b89eb673ed5bf`.
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
Current: new queue351 checks/four causal controls, original queue64, boundary2346
checks/five controls, original slot UI452 checks/18profiles and timed UI1182 checks/12profiles PASS. New UI272
checks/18profiles PASS; locked-next defect fails the intended selection assertion.
Node24.22.1, Chrome156.0.8078.47. Source syntax/lifecycle guards and diff check PASS.
Independent one-second four-window rewards unchanged. Entire four endpoint
states match baseline/candidate when rerun with the same current harness; the
regenerated binding retains those outcomes. Lab Motes native UI also passes.
Self-review only; no independent human review claimed. Evidence will be retained
under docs/qa/lab-boost-queue-001/ with CI and release receipts.

Next: finish source-bound local checks and endpoint comparison, publish feature
PR, run seven required workflows, integrate, validate exact main and publish the
signed upgrade APK. Physical phone, exact WebView60, TalkBack/human pacing remain
separate acceptance and keep the feature open after automated delivery.
