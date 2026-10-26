# LAB_FORGE_LONGTAIL_001 — finite progression and slot speed

Status: Integrated through [PR #11](https://github.com/xariib/Lumenfall/pull/11) at `e287b1212aa4142640c9573b4a91792febd7766d`; [Android 0.2.40](https://github.com/xariib/Lumenfall/releases/tag/android-1000040) published 26 October 2026. Owner: this feature chat. Baseline: `main` b5509637. The user authorized branch publication, main integration and a new test version.

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

Pre-integration local Node 24.22.1, source SHA-256 `854dc16c61d802f85af2f7df35800b01bbfe60069c5208be19288086e8510aa`: `lab-slot-contract.cjs` PASS 54 focused checks; Lab expansion 2,676 assertions plus 10 causal controls PASS; Forge expansion 9,319 assertions and 25 causal controls PASS; timed Lab boosts 1,480 checks PASS; endless progression core 237 assertions PASS (`index.html --focus-f`); Lab offline integration PASS; full `offline-catchup.cjs` PASS with historical reference adjusted only to the new five-slot policy and additive save fields checked separately. The independent 4×8-hour one-second Swift oracle was regenerated on this exact source; kills, Ascends and Prisms match the previous golden. Final integrated CI and Android results follow below.

## Integrated acceptance and release

All six manually dispatched workflows passed on the exact integrated commit: [pre-merge](https://github.com/xariib/Lumenfall/actions/runs/40318159085) (both stateful behavioral and isolated offline jobs), [Comet](https://github.com/xariib/Lumenfall/actions/runs/40318265604), [Forge](https://github.com/xariib/Lumenfall/actions/runs/40318371738), [Lab](https://github.com/xariib/Lumenfall/actions/runs/40318434644), [Tree](https://github.com/xariib/Lumenfall/actions/runs/40318498303), and [Shared UI](https://github.com/xariib/Lumenfall/actions/runs/40318556547).

The first nonpublishing [Android run #38](https://github.com/xariib/Lumenfall/actions/runs/40318802857) built the signed APK but failed its emulator offline-recap assertion after the synthetic save had advanced. Its diagnostic artifact retained the screen, save and logcat; no release followed. The repeated nonpublishing [run #39](https://github.com/xariib/Lumenfall/actions/runs/40321194209) passed the same commit and full native installed-upgrade check, including both save slots, paid work, legacy purchases, offline recap, Wisp touch and Farm hint. The public [run #40](https://github.com/xariib/Lumenfall/actions/runs/40325476761) passed the six-workflow gate, signed identity/assets, installed emulator upgrade and release step. Published version code `1000040`, version name `0.2.40`, package `com.lumenfall.app`, APK SHA-256 `0e624bfd594d9d2c093e341963cd96fb3c083289310d0486dc34fad31cc5bf6c` (download verified against release checksum). The first emulator failure is retained as a sporadic test observation, not silently declared resolved.

Physical phone, exact legacy WebView 60, TalkBack, and human pacing/balance acceptance remain unverified. Screen-off play uses saved chronological catch-up when the app returns, with the existing 12-hour productive offline cap; it does not require a continuously running foreground process. A physical-device check of 0.2.40 is the next acceptance step.
