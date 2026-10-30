# FORGE_WORKSHOP_PACING_001 — a lasting Forge workshop

Status: in progress. Owner: this feature chat. Baseline: origin/main d9a341e
(Android 0.2.55); product SHA-256 fc7f0b7d5232fd9aedcc670c973acbac2f57ac8e42954a3f8f36e0b95b1b0d43.
Branch/worktree: feature/forge-workshop-pacing-001, ../forge-workshop-pacing-001.

## User requirement, 29 October 2026

“Forge opgraderinger skal ikke være muligt at gøre færdigt efter 2 3 dages
farming. Der skal også tages reference i the tower idle game, tjek dets workshop”.
Forge must remain meaningful beyond two or three days of farming; investigate
The Tower's workshop. The user selected “Flere måneder (anbefalet)” during
implementation. Several months is the agreed design horizon, not a measured
calendar guarantee. Current requirements authorize the balance change.

## Findings and design

Four 250-level foundations are retired into Lab, retaining their paid bonuses.
Of 21 active Forge tracks, 20 cap at 2–20 levels; Masterwork alone has a long
tail, gated in five-level bands. Increasing charge, chance, regeneration or
Resonate caps would change bounded mechanics. Their existing caps stay.

The Tower combines short workshop tracks with deep permanent investments and
late enhancements bought with farmed currency. References inspected 29 October:
[Workshop](https://the-tower-idle-tower-defense.game-vault.net/wiki/Workshop),
[Enhancements](https://the-tower-idle-tower-defense.game-vault.net/wiki/Workshop_Enhancement),
[Knowledge Hub](https://the-tower.notion.site/).
Community tables disagree on some current enhancement caps; use the structure,
not exact copied costs, artwork, terminology or unverified completion dates.

Add three permanent 300-level Forge enhancement tracks opening at record
Rifts 100/150/200. Each gives an additive one percentage point to its own
multiplier per level (1x–4x), with geometric currency prices. Battle Tempering
affects passive Wisp damage and its tap component; Arcane Tempering affects
damaging abilities; Harvest Tempering affects Lumen/Shard kill rewards. These
are investments, with no timer or compounding per-level power. Existing prices,
caps, purchased effects and Masterwork development gates stay.

## Acceptance and preservation

- Independent costs, cap/unlock boundaries, bulk/manual/queue payment, atomic
  persistence and visible previews/affordability; native mobile layout/input.
- Measure actual authoritative farming at several record depths with generous
  economic fixtures. Reinvest three days' income using real purchase plans;
  the new catalogue must remain incomplete. Report fixed-depth estimates and
  assumptions; avoid claiming a simulation proves months of enjoyable play.
- Verify damage/reward effects and live/offline partitioning. New IDs migrate
  only to level zero and Queue OFF; saves, backups, recovery, Ascend, paid Lab
  work, old caps/prices and limited-use mechanics retain their values.
- Existing Forge/Lab/pacing/chronological checks and required CI remain gates.
  PR23 changes Labs and PR22 changes offline presentation; keep them separate
  and reassess actual overlap before integrating.
- Publish coherent work/evidence to GitHub. Main integration, required CI and
  required Android/device acceptance are necessary before claiming completion.

## Baseline and checkpoint

Local Node baseline: Forge expansion PASS 9,335 assertions/598 price cases;
progression pacing PASS 216 checks. Worktree initially failed on Windows long
paths; creation with git core.longpaths=true succeeded without editing others.
The implementation and local checks below replace this initial checkpoint.

## Implementation checkpoint

The three 300-level tracks are implemented with +1 percentage point per level,
record-Rift unlocks and 10% price growth. First Lumen/Shard prices are 10M/250K,
25M/625K and 40M/1M. A complete track grants 4x in its named domain. Conservative
boss assessment also activates for either new combat enhancement on its own.
No existing price, cap, paid level, effect or save-schema version was changed.

Final canonical LF product SHA-256:
78bb721fcf0716112be8bcd52b0252254475e191f7de26ea09d3fdb18d675cd1.
Node 24.20.0: new core PASS449 assertions/four defect controls; original Forge
PASS9338/25 controls/598 original price cases; cap preservation PASS2365/three
controls; original pacing PASS216/five controls. New core includes real exact
debits/rollback/cold reload/backup/recovery, Ascend, live/offline partitions,
actual enhanced combat within conservative boss bounds and unchanged old saves.
Independent 4×8-hour one-second simulation was actually regenerated on these
bytes: original kills, Ascends and Prisms are unchanged; only zero/OFF new IDs
change state hashes. Receipts: ../qa/forge-workshop-pacing-001/.

At a fixed Rift1001, with old retired economy at250, resource Labs500, Wisps10000
and all new benefits300 granted before paying, the full tracks cost37.25/93.12/
149.00 days of 24h/day income,279.37 days combined. Three-day budgets buy273/263/
259 levels when each gets the entire budget separately. Rifts32/51/101/250/501
also fail to buy a complete track within three days. These are optimistic fixed
depth forecasts; deeper records accelerate earnings. They do not prove a real
account's progression calendar, a global maximum yield or human enjoyment.

Final-source mobile Forge acceptance PASS32184 assertions/12 profiles,
including all new cards, red single-currency shortages, trusted touch/Enter/
Space, queues, focus/scroll preservation, cap300 gold cards and reload. This
compressed receipt is saved as ../qa/forge-workshop-pacing-001/mobile-receipt.json.gz.
Original Lab2676 and slots54 passed. Original Forge calibration3134/seven
controls passed on b0d86cc8; full offline comparison is still running there.
Final-source required CI and integration remain pending.

Git push has no available noninteractive credential; use the connected GitHub
plugin published the exact locally reviewed Git tree b4b473715ec013522fdaeeabf2124a9d5472460e
as commit1a29d1a1 in [PR24](https://github.com/xariib/Lumenfall/pull/24).
All seven required workflows started there. No APK has been built, published or
installed. The GitHub plugin has no workflow-dispatch action; browser access
reports “Local browser use is disabled in Work settings” in this session.
Android dispatch is therefore blocked; no preference or permission was changed.
Next: resolve final CI findings, preserve final receipts, integrate only after
all required gates pass, then perform signed Android delivery when dispatch is
available. Physical phone/WebView60/human pacing remain unverified. Do not claim
completion or archive this feature.

CI checkpoint: ddad95c4 passed Permanent progression, Comet and Lab. Forge
run40905651339 failed its frozen catalogue equality because the three additive
enhancements were absent from that historical expectation (job123559545593).
The corrected test independently specifies the three new definitions and still
compares every old field and runs all original five defect controls: PASS2802.
The Wisp historical-save comparison likewise explicitly requires zero/OFF new
defaults before comparing every old field: PASS8099 role assertions,20112
preservation assertions and seven defect controls. Support checks PASS1874/four
controls; endless core PASS237. Product bytes remain unchanged. These focused
test updates require a fresh CI run; integration remains pending.
