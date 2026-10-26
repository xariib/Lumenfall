# WORKSHOP_CARD_CLARITY_001 — slots, concise cards and long-term Deeds

Status: implementation in progress. Baseline: main `91aea49`. Branch:
`codex/workshop-card-clarity-001`. One owner chat; no delegated work.

## User requirements, 26 October 2026

- Lab opens on five visible slots, including locked slots. Select a slot to see
  its research catalogue; choose new research there. No Pause Study action.
- Queue OFF clears the slot. Switching keeps purchased work and slot boosts.
  Remove the redundant “Speed target 8x” heading; keep the slider's value accessible.
- Simplify game cards, particularly Wisps: avoid duplicated facts and long
  explanations. Keep price, effect, requirements and next action accessible.
- Add substantially more long-term Deeds for an endless game.
- Comet unlocks must not add Rift panels or make Rift scroll. Prefer useful
  permanent automation unlocks, comparable to Auto-Ascend.

## Preservation and acceptance

Keep saves, existing paid research, currencies, caps, automation, offline chronology,
Android identity and existing purchase value. Five Lab cards are visible at first
open, and selecting/replacing/clearing a slot is atomic and tested for save failure,
reload and boost expiry. Catalogue is hidden until selection. Controls meet 44px
and work at 320/390/430px and enlarged text. Completed/maxed cards retain their gold
state and earned effects. New Deeds use authoritative existing counters, fixed
one-time rewards and receipt-backed pending credits. Rift remains fixed without
command-driven scrolling. Relevant original tests and required CI remain gates.

## Baseline evidence

Node 24.22.1: Lab slot contract PASS 54; Lab expansion PASS 2,676. Baseline
product SHA-256 `854dc16c61d802f85af2f7fdf35800b01bbfe60069c5208be19288086e8510aa`.
Original Lab has five available-capacity slots but only a chip summary, inline
catalogue and Pause Study. Comet ownership explicitly enables Rift scrolling.

## Next action

Implement slot-first Lab and focused transaction/browser regressions; consolidate
card content; expand Deeds; remove Comet-driven Rift expansion with preserved
purchase value. Record final implementation decisions and exact check evidence.
No APK publication has been requested in this task.

## Implementation checkpoint — 26 October 2026

The five primary cards expose locked and open slots. Selecting a slot reveals
its catalogue; changing a running project preserves its paid remaining work in
the existing paused-work ledger and retains the slot boost. Queue OFF clears the
assignment atomically. Legacy paid slots 6–7 remain visible as legacy work but
cannot create new capacity. The speed value lives with the range input.

Card copy is condensed across Wisps, Lab, Forge, Tree, Deeds and Comet. Wisp
progression including Mastery is behind Upgrades; required prices and effects
remain available there. Forty-nine fixed one-time long-tail Deeds extend the
original 27. Existing Comet purchases and command effects remain redeemable in
Deeds; their panel no longer occupies the fixed Rift viewport. No Comet price,
charge, damage or ownership state has been converted. This is a conservative
preservation choice pending real-device judgment of command usefulness.

Local source and focused Lab/Deed transaction checks passed (85), original
Lab slot checks passed (54), Forge and progression core passed, Comet core,
numerical and offline checks passed. Browser cannot create its local Chromium
socket in this environment (`Operation not permitted`); its 18-profile UI
check and older twelve-profile Comet mobile suite require GitHub CI. The
independent four-phase Swift oracle matched all prior kills, Ascends and Prisms;
regenerated source-bound hash will be committed with the candidate. Full offline
comparison and exact PR CI remain pending. No Android APK publication is in this
feature's authorization.

## Local candidate and delivery block

Commit `45119b8` is the local source candidate. On its exact product hash
`9e1a742c65b3925665f34465c7015f7fc0a9adc2a570d68f3ebcd0211adfcee6`,
Lab expansion passed 2,676 assertions, Forge expansion passed 9,319,
Comet numerical passed 681,739, Comet core negative suite passed 10,492,
full offline comparison passed 18 scenarios, and the V8 generation offline
probe passed. The source-bound Swift oracle agrees with all four prior
kills/Ascends/Prisms tuples. UI browser checks are pending because Chromium's
socket is denied in the local command sandbox; CI and installed Android acceptance
remain pending.

The external GitHub push was rejected twice by automatic approval review. The
remote was checked through the GitHub connector and matches public
`xariib/Lumenfall` with push permission, but the reviewer still said this
specific public source upload needs explicit user authorization. Do not route
around this rejection. Next: obtain explicit permission for publishing this
candidate branch, push it, open PR, run all required checks, fix any regressions,
then decide main integration and nonpublishing Android acceptance. No APK release.

## Approved delivery — 26 October 2026

The user explicitly approved public branch upload, PR, integration after passing
checks, and a new APK version if acceptance passes. The earlier publication
block is superseded by that approval. Existing draft PR #13 owns this feature;
update it rather than opening a duplicate. Current remote candidate efda8180 is
an earlier version; local changes since then are the reviewed fixes above.

## CI correction checkpoint

PR #13 candidate e043fad9: the dedicated slot-first browser suite passed 218
checks across all 18 profiles, and the complete isolated offline CI passed.
Shared UI also passed. Legacy Lab and Wisp tests still required an always-open
catalogue or incomplete Wisp sections; those expectations are updated to the
approved disclosures and slot selection while preserving purchase, input,
focus, price and save assertions. Comet's existing-price tests isolate the
new milestones from their fixed old reward fixtures. Its shop now tests one
explicit Next effect instead of duplicate current/next copy.

Two product focus guards accompany those changes: completed research returns
focus to its empty slot, and a Tree purchase restores its viewport after all
dependent renders. Remaining complete CI and Android gates are still required.

Candidate 3d624df6 passed the complete original Lab purchase/mobile/V8 job;
its timed-slider lane found a real premature change event during native drag.
The renderer now keeps the .study-slots ancestor attached while updating its
siblings. The old Lab UI fixture explicitly selects a slot and expects focus
on the empty slot after completion. Comet's no-scroll gesture starts on the
noninteractive Bond summary instead of the Guardian attack surface. Android
upgrade acceptance opens the Wisp disclosure with a real native touch before
its original Ability purchase check. No gates have been disabled.

Candidate 22ed5684 passed the full Lab and Comet workflows, Shared UI, and the
isolated offline job. The next real integration defect was Farm's Go to Lab
link focusing the hidden catalogue. It now opens a free slot's catalogue (or
slot 1 for inspection when full) before focusing the original recommended card;
this changes UI selection only and starts/spends nothing.

Tree's compact Invitations card exposed a physically unavoidable 2 px scroll
boundary: the requested scroll 4523 exceeded the new maximum 4521. The receipt
shows exactly that 2 px displacement. The existing strict nearest-feasible
boundary assertions are now used for funded purchases as for the already
covered Formation cases; arbitrary movement and wrong focus remain failures.
Original stateful Lab navigation and Forge copy tests are adapted to slot
selection and the single authoritative purchase result line. No price, cap,
mechanic or purchase assertions have been removed.

Candidate 12fb3672: Forge, Lab, Comet, Shared UI and isolated offline CI passed.
Midgame Farm's original positive and causal controls passed. Broad layout at
200% text now measures the visible slot heading instead of requiring the entire
running-study card to fit one screen; all five slots, touch sizes and horizontal
fit retain their separate checks. Tree's negative viewport control showed that
the extra outer buyNode guard masked removal of the original summary guard.
That redundant outer guard is removed, preserving the original causal test.

Nonpublishing Android run #41 (40356497883) built signed 0.2.41, preserved the
old save through upgrade, then stopped at an obsolete SECTION-only unfinished
Wisp assertion. The check now requires its module and native disclosure before
the already-added trusted touch opens it. No release was published.
