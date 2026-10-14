# Timed Lab boosts — 15 October 2026

Local candidate VERIFIED on local/full-debug, starting at7598c86;
proposal-only checkpoint6670216. No remote, APK or signing. Unrelated
validation-evidence/ remains untouched. [Prior checkpoint](previous-checkpoint.md)
preserves earlier acceptance evidence. user-before.png is the user's supplied
reference, not an independent browser receipt.

## User requirements and decisions

Original task4 requested compact speed controls, direct multiplier selection,
independent Lab and speed queue intent, visible prices and duplicate protection.
The user subsequently requested a stepped1.5x–8x slider; a prominent project
name with a level badge beneath; Current/Next effect labels; no repeated status
paragraph or Buy now; and then8/12/24-hour speed instead of per-level payment.
The last request supersedes immediate/per-level speed purchases and their queue.

User confirmed selected-project scope across successive levels, with continuous
elapsed time including idle and offline time. Rejected14/20/38 Motes as too cheap
and asked for slower earning. After another proposal, said “Find a good balance
between motes earning and speedup cost”, delegating numerical tuning. No further
price permission is pending. [Balance and measurements](economy-review.md).
The rejected first table remains in proposed-prices.json for historical context.

Announced exact earning rule before applying it: “Luminous kills can award Motes
once every60 seconds; eligible payouts retain the current depth and purchased
bonuses.” AGENTS.md and in-game help now describe it. Current prices for1.5x:
800/1140/2160 Motes before Catalysis;12h5%,24h10% off proportional8h price,
rounded up once, then existing Catalysis. All eight multipliers remain.

## Implementation and protection

Name/badge and independent Lab Queue lead the card. One grouped slider/duration
choice has one explicit activation with total price; it becomes a countdown.
Choices never spend. No renewal, overlapping timer or overwrite of paid time.
Activation requires an eligible running project. Timer continues idle between
levels and offline. Existing active.speedMult is retained as a paid floor.
New boosts never rewrite remaining work/duration or that old floor.

Additive saves retain strict known-project deadlines, choices and payout clock.
Old speed queue migrates OFF, selected multiplier remains, no free timer grant.
Expired history remains available for chronological offline replay. Simulation
splits at boost start/expiry and uses the old shared12h productive cap. Timers
consume wall time even beyond that cap. Completion estimates account for expiry.

Global Mote eligibility spans Rifts, Farm/push/manual kills and offline replay;
only an actual Luminous kill awards the existing fixed reward/bonuses. Other
Luminous kills retain Lumen/Shards/counts. Field Notes, Ascension Dust, balances,
paid upgrades, work, Study Queue, caps and other game systems remain intact.

## Verification and delivery

Baseline per-level/Buy now reproduced in source and supplied screenshot;
Lab expansion core2675 PASS on084f29955540f8ecabbd34088a5e404c62f8f3d1d58cf74dddf0a4d93100a8ae.
Updated tests replace superseded per-level assertions with prepaid timer/cooldown
oracles while retaining material, kill, damage, purchased-value and save checks.
Negative controls cover free time, unlimited payouts, duplicate debit, selection
spending and detached controls. All tier/duration/Catalysis quotes, funding,
expiry/carry/collisions, legacy floors, recovery/backup/Reset/Ascend, yielding/
retry and live/offline/split parity remain required. Native browser profiles cover
320/390/430px,100/200% text and both motion settings, focus and scroll.

[verification.json](verification.json) records14 source-bound groups on419f650d,
including22 existing browser scenarios,1480 timed-core checks,2676 expansion,
2179 caps/old-value,580 actual V8 6.0,1062 native UI/12 profiles and6588 catalog
checks. Two UI mutants and three timed-core mutants are rejected. Original damage
and material/save conservation oracles remain; no tolerance was increased.
The fractional carried Study clock and active/idle focus regressions were fixed.
Self-review found no unintended game removals. The optional Windows DOM transport
returned valid PASS assertions but sometimes failed browser teardown; the same
assertions pass through the existing CDP driver with real zero exit required.
Timers use local wall-clock deadlines, not a trusted server clock. Required combined/main/CI/GitHub and Android/device/WebView60/
TalkBack acceptance remain open. Browser checks do not prove Android acceptance.
Next: checkpoint the reviewed diff, refresh mobile/www
from current source/fonts/branding and show the real playable preview.
