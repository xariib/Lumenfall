# Comet implementation and debugging notes

Implementation began after the accepted Tree merge `9f04aca7265b57d73edc98822f3bd89d85f1881d`
and its final evidence publication `f57a0b9db11ca69257a44ca7b55497896f3829bc`.
The selected design, numerical closure, baseline witnesses and UI plan remain
unchanged preparation records. This document records implementation decisions
and subsequent observations; it is not final acceptance.

## Implemented behavior

The six purchase types retain Auto-Ascend and add Meteor Strike, Luminous Call,
Orbital Reserve, Orbital Engine and Meteor Core. Twelve purchases cost 1,380
Comets. The original 23 Deeds retain their 683-Comet total; four actual command
events add 50 Comets. Neither lifetime kills nor migration fabricate events.

Schema 3 preserves old Trial, Trail and Crest entitlements in the bounded
retirement ledger, with their separately specified one-time 350-Comet credit.
It does not grant the new commands. The original F26 refund remains independent.
Invalid current command or claim history protects the original storage slots.
Unrepresentable full credits remain pending with their earned unlocks intact.

Purchases and Quest Refresh use the same read-only plans for quote, eligibility
and action. The staged transaction accepts an exact debit and one primary save;
a primary failure restores the old state, while a recovery-only failure retains
the already committed primary endpoint. Meteor enters the existing defeat and
Auto-Ascend owners only at an actual zero-HP endpoint. Its damage uses the reviewed
binary64 bounds; the existing simulation epsilon rule is unchanged.

## State closure and focus destinations

An accepted save may own a command with an empty bank and no prior event flags.
Its next 200 actual defeats at the base rate legitimately earn a first recharge.
Consequently `firstRecharge` does not require `firstCommand`; the recharge hook
does not invent a command event. The core suite exercises this actual transition.
Boss strikes, called kills and encounter markers still require a first command.

After a purchase, focus remains on that purchase's enabled button. If it becomes
owned or capped, focus moves to the same purchase card. Buying Auto-Ascend instead
focuses that card's Open Ascend action. After an accepted command becomes disabled,
focus moves to the command panel, never the other command. Refresh keeps its quest
slot. Visible focus positions are restored against the real main scroll limits.
Passive updates retain the mounted command buttons and do not announce feedback.

Command owners use ordinary scrolling in the existing Rift panel. The original
starter Rift keeps its existing scroll rule. Native Trial draft inputs remain
attached while unrelated Deeds and shop markup refreshes.

## Recorded debugging

| Observation | Resolution and evidence status |
| --- | --- |
| Source validator initially required the original Rift scroll-reset statement. | Retained that exact starter rule inside the no-command-owner branch. The unchanged validator passed on product `ba0f5b72`; command-owner scrolling requires actual browser acceptance. |
| Early core tests expected a literal false value in the achieved map, used a nonexistent Tree ID, or supplied work to an already full charge bank. | Corrected test setup to the existing true-only achieved map, actual `stardust` ID and a valid capacity-2 bank. Original failed executions and inputs are retained separately. No reward or purchase condition was relaxed. |
| Early V8 migration test expected a null F26 receipt for schema 0/1. | Corrected the assertion to the original zero receipt produced by F26. This does not change F26 or the frozen fixtures. |
| Enabled Comet purchase buttons had a price-only accessible name. | Source review on `ba0f5b72` identified item-name assignment only inside the disabled branch. Four presentation lines now assign the actual catalog name in both states. Product becomes `40c3bd80`; browser checks require names before and after live affordability changes. |
| Generic focus restoration briefly selected the next enabled action before the Comet owner restored its own card or quest slot. | Source review on `40c3bd80` identified both focus calls. An optional owner-handled-focus argument now bypasses the generic fallback only for Comet purchases and Refresh. Direct same-card/slot restoration retains logical focus even without a visible viewport point. Product becomes `d630b20a`; browser input histories must show no intermediate other purchase or quest action. |

## Validation boundary

Root preflight on `ba0f5b726c9c6fd0e509d1d0c0b3c5d211a14016238086dd9c01d38731cd09eb`
completed at 2026-10-10 23:54:05 UTC. Source validation, five task-context checks,
Node tooling, the APK identity verifier's self-test and protected-original checks
all exited 0. The self-test did not build an APK. Tooling's synthetic smoke controls
are not an actual browser acceptance run.

Early full-IIFE numerical tests reported 681,747 assertions and eight causal
controls; the initial actual V8 6.0 run reported 1,342 checks. These executions bind
their recorded input source, not a later commit. Their raw captures, all first
failures and final-head CI must be reconciled before acceptance. Full, Lab, Forge,
Tree and Comet CI, twelve browser profiles, raw audits and fresh development-merge
checks remain mandatory. Physical Android/WebView/TalkBack acceptance is pending;
main and APK work remain held.
