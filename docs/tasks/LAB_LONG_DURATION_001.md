# Lab duration at 8x

Status: implementation in progress. Owner: this feature chat.

## Original requirement

29 October 2026: "Det skal ikke være muligt at gøre nogle af lange labs færdig
på 1 2 timer selv hvis man kører speed up 8x".

Goal: prevent long Labs from being finished in 1–2 real hours even at 8x.
User clarification: the entire track from start to finish must have good pacing.
Even at8x, long tracks must take substantially more than1–2days. Use The Tower
as a reference: after one year the user is only gradually maxing health,
coins/kill and comparable research. Add simple Wisp damage, critical and related
upgrades. This authorizes scoped Lab balance changes and additive Wisp research.

## Baseline and scope

Isolated branch `feat/lab-long-duration-001`, main `d9a341e2` (Android0.2.55).
Existing checkout `game` belongs to offline recap PR22 at `f795843`; untouched.
PR22 changes recap presentation, not research work. Other open PR2 is docs only.
No subagents or messages. No integration or APK release yet.

Read: [long-tail requirements](LAB_FORGE_LONGTAIL_001.md),
[slot workflow](LAB_SLOTS_QUEUE_SPEEDUP_001.md),
[boost queue](LAB_BOOST_QUEUE_001.md), and affected production functions
`studyDuration`, `labFutureWorkFactor`, `studyEffectiveSpeed`.

## Verified findings

Work plateaus at 864000 seconds (10 unboosted days) before reductions.
Five unlocked slots with one study give at most four empty slots: Focused
Apparatus reduces work by20%, Curriculum by30%, and Measured Inquiry by20%
for foundation studies. Timed and legacy paid speeds use a maximum, not a
product. At8x, late foundation levels take13.44h; late expansion levels
reach16.8h. Neither currently finishes in1–2h at the work plateau.

Optimistic full-track times with continuously funded8x, all applicable
reductions already earned, no currency/unlock waits, and one occupied slot:

- Field Notes / Rarity Appraisal: about1.04h each.
- Research Procurement / Module Fabrication: about1.56h each.
- Mote Catalysis / Ultimate Analysis: about2.08h each.
- Measured Inquiry: about2.12h.
- Boss Ledger: about2.19days; Luminous Distillation: about2.71days.
- Foundation500-level tracks: about271days each.

These are lower-bound work sums, not a claim that a fresh player already owns
all reductions or resources. Small2/3/5-level utility tracks finish faster.

## Preservation and acceptance

Change only future-start work for the agreed tracks/levels.
Preserve completed levels/effects, all active/paused paid remaining work,
currency prices, boost multiplier/duration/queue, save/recovery and Ascend.
Cover the chosen minimum under maximum earned reductions plus continuous8x,
queue completion, boost expiry, live/offline parity and saved-work preservation.
Do not retroactively reset or lengthen existing paid records.

Investigation checks: Node24.20.0, unchanged PR22 source
`8b06aa4afde553ee9c582a73c5aee7f5514a77423c6521ab5831620d9f52f026`:
Lab expansion2676/10 causal controls, timed boosts1480/3 controls, queue
continuity64 all PASS. These are baseline checks, not acceptance of a change.

## Implementation decision

First two levels retain their current work. A cubic work tail then makes full
specialist tracks take30–120days,20-level resource tracks at least180days, and
three new100-level Wisp tracks at least365days, even with continuously funded8x
and every applicable work reduction already earned. Existing500-level foundation
tracks retain their roughly9month fastest-case work. Slot unlock research stays
short;3/5-level utility research spans7–30days. Prices, caps and existing bonuses
are retained. These are deliberate Lumenfall targets, not copied Tower values.

New Wisp Damage: +2% passive/ability damage per level. New Critical Chance:
+0.5percentage points per level to50%. New Critical Damage: +0.02 to the2x
critical multiplier per level, to4x. Average critical damage is applied evenly
using1+chance*(multiplier-1), explicitly described to players; no random rolls,
hit counters, offline rerolls or new save schema. These damage-only bonuses
do not raise Wisp own Power, ability currency payouts or Support strength.
The passive-powered component of Guardian Tap retains its existing relationship.

Reference: community Lab catalogue and the developer's v27 announcement:
https://the-tower-idle-tower-defense.fandom.com/wiki/Lab_Upgrades
https://www.reddit.com/r/TheTowerGame/comments/1mq4wa5/major_update_v27_fleets/
The reference supports separate long-running stats and slot/boost choices;
the user's year-long experience establishes the desired pacing horizon.

## Local checkpoint

Product SHA256 `5c1bd9c0eed9e687da8cf7d5bb968c8031c622a332afee339551db5c99489356`.
Node24.20.0 / Brave Chromium156.0.8078.74. New core353 assertions and4 causal
controls PASS, including real queued0-to-cap8x with daily paid renewals for all
17 rebalanced tracks, exact Mote accounting, preservation/recovery and combat
scope/parity. New UI326 assertions across12 mobile/text/motion profiles PASS;
native starts, both missing prices red,44px targets, late work and maxed cards.
Existing slot menu452 assertions/18profiles PASS. Preview visually inspected.

Existing expansion2676/10 causal controls, timed boosts1480, boost queue379,
queue continuity64, slot54, boundaries2346, stress, Forge9338 and progression
pacing PASS. Existing endless core requires its current `--focus-f` option;
the exploratory invocation without that option fails the older Titan gate,
and the correct current-policy invocation passes. No acceptance was weakened.
Original Lab mobile6588 assertions and complete offline-catchup regression PASS.
Full browser suite continues. The full12h local case hits its existing300s
deadline in both full/isolated candidate runs and on unchanged PR22 source8b06aa4a.
This is an observed baseline limitation, not a local PASS; the deadline remains.
The first full browser attempt used the default dump-DOM transport, which stalls
on this Windows/Brave setup (no completed QA marker, unchanged25s deadlines).
It was stopped and restarted using existing `LUMENFALL_QA_DOM_TRANSPORT=pipe`.
The initial affordability fixture incorrectly treated maxed old foundations as
all Rift1 research: it now first verifies that new Wisp Damage is available,
then maxes that track too and retains the original locked-only assertion.

CI416de8d: Lab (including actualV8 6.0), Comet, permanent cards, shared UI and
the original isolated offline job PASS. Main stopped at R3's frozen old catalogue;
Tree stopped at the historical Wisp preservation oracle's missing additive Lab
defaults. R3/upgrade identity now enumerate26 total/23 active research IDs.
Inquiry keeps exact original prices and now checks the accepted90-day work sum
with an independent integer oracle. Its old paid6291/41232-second fixtures stay
unchanged. Wisp preservation verifies all new zero/OFF defaults before retaining
its complete historical field/damage comparisons;8099 role assertions and23040
preservation assertions PASS locally.

Local save/reload failure was reproduced on unchanged PR22 source8b06aa4a:
startup credited0.023s of host processing and started legitimately queued work
before a static snapshot assertion. The Lab/Inquiry/Forge storage-only fixtures
now pause gameplay and processing clocks from boot; exact state/receipt/backup/
recovery comparisons remain. Ordinary live windows and the real monotonic gate
retain their clocks. Updated R3, upgrade identity, Inquiry contracts/chronology,
all Lab/Inquiry/Forge storage cases and original P1/P2 navigation cases PASS.
Detailed actual/expected timer values are retained on storage assertion failure.

CI98d6f3c then exposed the PR15 Auto Ascend frozen endpoint hash: its historical
state lacks the new Lab defaults. The oracle now explicitly requires all15 new
zero/OFF/default values before comparing every original frozen endpoint hash.
No baseline hashes were changed.174 assertions plus all4 defect controls PASS.

Independent one-second four-window reference was actually regenerated.
Kills/Ascends/Prisms match the previous binding; state hashes include the new
zero/OFF Lab defaults. The frozen historical offline comparison separately
asserts those exact defaults before excluding them from its old-state comparison.
Expansion tests now use the independent accepted pacing table; original price,
effect, save, payment and defect assertions remain. Original catalogue coverage
expects23 active tracks and the new Wisp fundamentals group.

[Focused evidence](../qa/lab-long-duration-001/README.md). Published
[PR23](https://github.com/xariib/Lumenfall/pull/23), initial remote577e85e3,
with exact local/remote tree68917141d8948a6beb698bb953cb7e05d84778fa.
Seven required automatic workflows are running. Git has no push credential;
publication uses the connected GitHub plugin with every blob/tree verified.
Browser inventory again reports `Local browser use is disabled in Work settings`;
GitHub has no workflow-dispatch action. No settings were changed, no signed build
or release was started, and no access restriction was bypassed.
[Local12h limitation](../qa/lab-long-duration-001/offline-12h-local-limit.json) and
[unchanged historical endpoint checks](../qa/lab-long-duration-001/auto-ascend-feedback.json).
Next: finish full regressions and self-review, publish the scoped branch/PR,
address actual CI findings, and integrate only after required gates pass.
Android dispatch capability and physical/human acceptance remain unverified.
