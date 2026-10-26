# LAB_FORGE_LONGTAIL_001 — finite progression and slot speed

Status: [PR #11](https://github.com/xariib/Lumenfall/pull/11) open on `feature/lab-forge-slot-caps-001`; acceptance open. Owner: this feature chat. Baseline: `main` b5509637 (26 October 2026). User explicitly authorized branch publication, main integration and a new test version on 26 October. Release only after required CI and Android acceptance pass.

## Original request

- A maxed Lab or Forge card becomes a full gold box. It has no queue action or price and shows only its earned bonus, with no purchase impact or next-maxed preview.
- Exactly five Lab slots unlock over play. Speed up is purchased for a slot and survives changing the Study in that slot.
- Every upgrade has a finite cap. Some have long tails and others small or medium caps, with distinctive timed Labs around 20–30 levels; Forge high caps should be harder to finish.
- Preserve the existing Wisps, Rift, Ascension, visual identity, save progress and offline play. Inspiration from The Tower's workshop/Lab progression is conceptual, not an asset or screen copy.

## Baseline and decisions

At baseline Lab has 2–5 progression slots plus 2 Expanded Apparatus levels (maximum 7); timed boosts are keyed by project ID. The original foundation Labs, several core Forge/Tree paths, Empower and Wisp Mastery have no explicit finite cap. Existing capped projects span 2–20 levels. Offline progression already runs chronologically with a 12-hour productive cap when the screen is off.

Five-slot curve: 1 at Rift 1, 2 from Rift 15, 3 from Rift 60. Expanded Apparatus retains its two purchased levels and adds one slot each, maximum 5. Old saves with up to seven already-paid active records retain all records until they finish or are paused; no sixth/new seventh start is permitted. Paid boosts on grandfathered slots 6–7 revert to their legacy project association when work closes or pauses.

Slot boosts keep their original 1.5–8x prices, 8/12/24-hour elapsed timers and purchased work floors. New timers use keys `slot0`…`slot4` in the existing `studyBoosts` map. Old project-keyed timers migrate to an occupied slot or remain available for their original project if idle. A Study can be paused and resumed with its remaining paid work and speed floor intact. Pause turns its own queue OFF to prevent an immediate automatic restart. Other queued work can use the free slot and its unexpired boost. No Motes or start currencies are repaid on a pause/resume.

Finite catalog: original foundation Labs cap 500; originally uncapped core Forge paths cap 250, Masterwork 500; originally uncapped Tree paths cap 250; Wisp Empower cap 10,000 and Mastery cap 2,000. Existing low and medium caps, upgrade effects, prices and work curves remain. Existing levels above new caps remain in saves and keep their paid effects, while further purchases stop. The legacy foundation Lab cost formula above level 30 remains intact. These caps are a starting long-tail balance, not evidence that late-game pacing has passed physical playtesting.

## Acceptance and preservation

- Maxed cards have a gold surface around the entire card, readable current bonus, and no queue, price or purchase control. Unmaxed costs, focus and accessibility remain.
- Five-slot count, gradual unlocks, paid Apparatus value, queue behavior and old seven-record saves survive reload, backup, recovery, Ascend and offline progress.
- Slot boost, switch, expiry, pause/resume and primary-write rollback have no double debit or lost paid work.
- Every purchasable upgrade has a finite cap; old over-cap paid values remain. Forge/Lab prices, rewards and completion timing are unchanged below those caps.
- Required browser/mobile profiles, full behavioral CI, signed nonpublishing Android build and installed acceptance run on the exact integrated version before release.

## Current checks

Local Node 24.22.1, source SHA-256 `854dc16c61d802f85af2f7df35800b01bbfe60069c5208be19288086e8510aa`: `lab-slot-contract.cjs` PASS 54 focused checks; Lab expansion 2,676 assertions plus 10 causal controls PASS; Forge expansion 9,319 assertions and 25 causal controls PASS; timed Lab boosts 1,480 checks PASS; endless progression core 237 assertions PASS (`index.html --focus-f`); Lab offline integration PASS; full `offline-catchup.cjs` PASS with historical reference adjusted only to the new five-slot policy and additive save fields checked separately. The independent 4×8-hour one-second Swift oracle was regenerated on this exact source; kills, Ascends and Prisms match the previous golden. Current CI confirms Lab browser/mobile and V8, Shared UI, and isolated full offline PASS. The long Forge and Tree browser suites reached their V8 stages after the older expectations identified below. Chromium/Android are unavailable locally, so the final exact-head CI and native checks remain required.

## Next action

PR #11 is open. The 26 October CI waves revealed stale expectations for five-slot Focus work, canonical Lab record field ordering, four-decimal Forge cycle text, a Wisp Mastery rank above the new cap, and the new `pausedStudies` save field in a frozen preservation comparison. The latest PR head passed Lab, Forge, Tree, Comet and Shared UI, including their mobile/V8 coverage; pre-merge passed the original-value refund section and stopped at the pre-existing Wisp task document's 32 KiB startup budget. Its superseded next-action paragraph was shortened, leaving the limit unchanged; every pre-merge task context now passes locally. Earlier local corrections preserve original work, paid speed and time while expecting migrated slot numbers. The full behavioral suite reached eleven historical presentation and slot expectations after all five focused workflows passed; their tests are being aligned to the five-slot and gold-card rules, including nearest feasible scroll retention. The final PR head must pass all six workflows; then integrate to `main`, run the required integrated-commit workflows, and build/publish the verified update after Android identity and installed-upgrade checks. Do not claim a new APK until those receipts pass.
