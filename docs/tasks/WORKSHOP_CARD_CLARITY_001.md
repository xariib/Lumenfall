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
