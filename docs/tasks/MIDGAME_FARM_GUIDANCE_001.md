# MIDGAME_FARM_GUIDANCE_001 — an exact power option while farming

Owner: this feature chat. The user requested the next improvement on 21 October
2026. Scope: one read-only Rift guidance improvement for a developing player
farming after the first Ascend. No new recommendation engine, purchase path,
gameplay rule, price, save field, automation change or APK release.

## Baseline and decision

`main` at `5bd503025c53858fee321ebed178d4f2826dc5a4`; one open PR (#2,
documentation-only product audit), no open issues. PR #3 and #4 are integrated;
physical Wisp acceptance remains open independently. The [audit proposal]
(https://github.com/xariib/Lumenfall/pull/2) identifies midgame guidance as a
design hypothesis, not a verified gameplay bug. The current `nextRiftObjective`
shows only “Build power for Rift … / Farming Rift …” in Farm mode, with no
specific investment, cost, unmet amount or destination. The old Forge
`Formation Training` entry is retired to Lab: Wisp Ascendancy. The active Lab
project gives +15% passive Wisp damage per completed level and raises the
Wisp-powered tap component. This slice labels it an **option**, never an
optimal investment or required purchase. Its normal Lab plan and control
remain authoritative. No duplicate paid work is suggested.

## Acceptance

- In Farm mode after the first Ascend, show the next Wisp Ascendancy level
  and its current plan-derived Lumen/Shard quote when affordable; otherwise
  show the plan-derived shortfalls or a full-slot/running-work prerequisite.
  The game’s existing compact number display can abbreviate very large values.
  Navigate to its existing Lab card.
- No offer when locked, capped or unquotable. Preserve the early Farm wording,
  Push objectives and established late-game advice.
- Viewing the hint never purchases, saves, changes mode/queues/automation or
  alters either save slot. Original purchase controls keep red insufficient
  costs and disabled state. Refresh the hint with the existing Rift update.
- Focused VM cases compare actual plans across affordable, exact boundary,
  unavailable, early, Push and late states; inverse source control rejects the
  old generic Farm text. Existing guidance/Forge tests and required PR CI pass.
- Mobile 320/390/430 px, large text, keyboard/touch navigation and installed
  Android acceptance remain required before completion; physical device and
  exact WebView60 cannot be claimed from browser/CI.

## Checkpoint — 21 October 2026

Status: implementation on `feat/midgame-farm-guidance-001`, PR/CI pending.
Files: `index.html` (read-only plan-derived hint and red shortfall detail),
`tests/behavioral/midgame-farm-guidance.cjs`, pre-merge CI and this task.
Only the guidance renderer and new function changed in product code; pricing,
purchase, progression, save, offline and automation functions are untouched.

Local Node 24.19.0 checks on product SHA-256
`bbbc27b1f5fa6a06213a35e2bbf7cd19350fb601bb67f10c1198b846e81c1f01`:
focused 24 assertions including an old-Farm causal inverse PASS; original
endless guidance 186 PASS; progression core 235 PASS; Lab 2,677 PASS; Forge
9,319 and 25 negative controls PASS; `validate_source.cjs` PASS; context
checker 29 entrypoints / 45 links PASS; diff whitespace check PASS.
Modern-browser mobile layout/input, exact WebView60 and physical Android were
not run locally. Existing Wisp phone/TalkBack gap is independent and remains
open. The suggestion is explicitly an available power option, not measured
optimal play or a claim that all developing players need this Study.

Next: publish isolated PR, inspect its complete diff and all required CI on
the final head; fix any new failure. Integrate only after checks, then record
integrated version and separately arrange installed Android/human acceptance.
