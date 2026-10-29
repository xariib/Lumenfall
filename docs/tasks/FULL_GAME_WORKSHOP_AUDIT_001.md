# FULL_GAME_WORKSHOP_AUDIT_001 — gameplay, cards and Workshop audit

Status: in progress. Owner: this feature chat. Baseline: main
`595619f27b54eee351c5f3f2dfb0dd46a4ecd487`, Android 0.2.54.
Branch: `fix/full-game-workshop-audit-001`.

## Original request — 29 October 2026

Debug the complete game; find and fix defects, cheating routes and exploits.
Inspect every game card, including Auto-Empower wrapping above/below the value
and moving touch targets. Audit the complete Workshop, consider meaningful
additional upgrades, and evaluate every existing cap so the whole Workshop
cannot easily be completed within one or two days.

## Scope and preservation

Inspect production purchase, reward, automation, save/recovery, live/offline and
UI paths. Reproduce findings before fixing them; add regression coverage and
causal controls for changed behavior. Balance changes are explicitly in scope,
but preserve purchased ranks, currencies, paid work, purchases, both save slots,
Android identity and existing gameplay systems. Existing short caps on bounded
charge/regen/capacity effects need evaluation, not indiscriminate increases.
Add upgrades only where an uncovered progression need justifies them.

Sources: [project state](../PROJECT_STATE.md),
[prior exploit fixes](EXPLOIT_FIXES_0252_001.md),
[pacing requirements](PROGRESSION_PACING_001.md),
[finite Workshop contracts](LAB_FORGE_LONGTAIL_001.md),
[feature workflow](../project/FEATURE_WORKFLOW.md).

## Acceptance

- Cover all card families and purchase/automation states; keep targets stable
  when values/affordability change, including narrow mobile and enlarged text.
- Record concrete reproduced exploits and reject them through production paths;
  preserve exact payment, failure rollback and online/offline parity.
- Review each Forge/Lab cap, costs, effect and unlock against measured 24/48-hour
  progression; distinguish synthetic pacing evidence from human playtesting.
- Run focused and required CI checks without weakening gates; preserve source
  binding and update independent reference evidence through its actual generator.
- Save changes, findings, checks and limitations in GitHub; integrate only after
  required checks. App/device acceptance and any release remain source-bound.

## Checkpoint

Repository recovered into local `game/` using a sparse clone because the original
workspace contains only the released APK verification. GitHub main and the
published receipt agree. The only open PR is an unrelated documentation audit.
Root instructions, bootstrap, project state, workflow and affected prior
requirements read. No product change yet.

## Verified changes and evidence

Product SHA256: `4246093dad1dfd496307c7281e97df53bd6f902f33d804c246ca9f36f66cae65`.

- Auto-Empower originally shares a wrapping flex row with Level, Power and
  Rarity. A dedicated full-width toggle row and explicit stat tracks prevent
  changing values from moving Empower/Auto-Empower. The new original-source
  browser regression fails; the candidate passes all eight Wisps, changing
  levels, rarity and ON/OFF across narrow screens, large text and both motions.
- Ability purchases originally trust the caller's Wisp and omit recruitment
  validation. The production purchase now uses a canonical Wisp quote, current
  recruitment and exact currency checks, shared with the UI. This is entry-point
  hardening; direct scripted hooks do not establish a normal-UI exploit.
- Claiming a completed quest originally updates memory without persisting the
  reward or claim. An immediate restart loses it. Claims now atomically persist
  both; a failed primary save rolls back and allows retry. Repeated claims pay
  nothing; accepted-primary/failed-recovery claims survive cold reload.
- New [production-entry regressions](../qa/full-game-workshop-audit-001/core.json):
  276 assertions PASS, three causal reversions independently rejected.
- Actual-browser card/Workshop workflow: 524 checks, 18 profiles PASS, including
  100/150/200% root text, 320/390/430px, touch, keyboard, prices and slots.
- Wisp layout: final 25,968 checks, 12 profiles PASS, including changing rarity
  and ON/OFF. Shared layout: 6,985 checks, 12 profiles and three causal controls
  PASS. Loadout: 1,171 full browser checks PASS after explicitly configuring the
  installed browser; the original unconfigured-browser EPIPE is retained.

## Workshop decisions

[Every cap, effect, price and work curve](../qa/full-game-workshop-audit-001/workshop-caps.json)
is inventoried: 25 Forge definitions (21 active) and 23 Lab definitions (20 active).
Historical fused paths remain preserved, with their future purchase owner named.
Keep existing caps: Masterwork 500, five new ranks every 50 record Rifts from
Rift 70, so its final band opens at Rift 5020. Keep specialized short caps on
charge, boss regeneration, resonance, discounts and conversion. Raising them
indiscriminately risks loops and erases their intended effect ceilings.

Two complete earned-currency 48-hour campaigns PASS on current product:
regular (three 10-minute visits/day) reaches Rift 50, Wisp Ascendancy 13/500,
56 total Forge ranks, Masterwork 0/500; efficient (six 15-minute visits/day)
reaches Rift 68, Lab 14/500, 87 Forge ranks, Masterwork 0/500.
No arbitrary currency grants fund these campaigns. Even granting every discount,
unlimited currencies and permanent free 8x research, current foundation work
still takes hundreds of days per 500-rank path. Short utility paths deliberately
finish earlier; the entire Workshop cannot cap in two days under these bounds.
Additional upgrades are optional in the request; none is added without an
uncovered progression need. No cap, price, earned level or balance change.
These are synthetic measurements and bounds, not long-term human pacing proof.

## Independent offline preservation

[Four old/new one-second 8-hour windows](../qa/full-game-workshop-audit-001/offline-neutrality.json)
PASS with byte-identical complete endpoints on Windows Node 24.20.0, including
all original kills/Ascends/Prisms. Windows endpoint hashes differ from the
canonical Linux/Node24.19 golden even on unmodified baseline. Retain every
canonical golden endpoint and update only its exact product source binding;
do not replace canonical economic assertions with local platform outputs.

Current [29-check regression matrix](../qa/full-game-workshop-audit-001/regressions/summary.json)
completed: 28 PASS; the original unconfigured-browser loadout failure is retained
and resolved by the separate full 1,171-check browser PASS. Existing gates are retained; the new core/caps/layout regression is
added to pre-merge CI. Self-review and automated checks only.

[PR #21](https://github.com/xariib/Lumenfall/pull/21) publishes head `97cd87e1`,
tested merge `e72aa0d5`, tree `eaa89a05`. Complete product/preservation diff
self-reviewed. CLI push authentication was unavailable; connected GitHub object
upload reproduced the exact local tree, verified again after fetching the branch.
Six required workflows and the isolated offline job PASS. Full pre-merge reached
the quest UI check; local reproduction showed only the two expected persisted
clock fields changing after the newly durable Claim. Reuse the existing
`save-clock-contract.cjs` to verify that metadata, additionally bound the save
to the native input's wall-clock interval, and require the entire new endpoint
in both save slots. All original other-field, reward, focus, scroll and duplicate
claim assertions remain. The updated full browser lane PASSes 1,225 checks over
12 profiles; both original Ascend/focus causal failures still trigger correctly.
Product source remains unchanged. PR21 holds current CI links and the final receipt.
Its first Permanent-progression attempt ran zero browser profiles after a CDP
startup deadline; unchanged attempt 2 PASS. No gate or deadline was weakened.

The user twice confirmed browser access for APK build/publication, but Work still
reports disabled after session reset. Prepare a one-task adapter only on
`qa/full-game-workshop-release-001`: use GitHub's ephemeral Actions token to
dispatch the seven existing workflows on the pinned integrated main SHA, require
all seven plus both full jobs, then dispatch the unchanged gated Android flow.
Check main/source identity before dispatch; never substitute old-commit reruns.
The adapter changes no permanent main trigger or release/signing acceptance gate.

Known limits: standalone local saves and arbitrary unseen future device dates
cannot be authenticated without a trusted source. This patch does not claim
tamper-proof offline play. Physical phone/WebView60 DOM/TalkBack and human pacing
remain unverified; automated evidence does not establish perfection.

Next: finish the original full pre-merge suite, integrate when every required
workflow passes, then run exact integrated-main workflows and the established
signed installed-Android/publication flow when browser dispatch is available.
Integration, app/device acceptance and release are not yet completed.
