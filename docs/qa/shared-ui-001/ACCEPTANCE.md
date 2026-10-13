# SHARED_UI_001 — shared layout and combined software acceptance

Status: implementation and focused regression in progress. This is item06 of
[PROGRESSION_EXPANSION_001](../../tasks/PROGRESSION_EXPANSION_001.md), under the
[original user mandate](../progression-expansion-001/ORIGINAL_MANDATE.md).
The current user hold supersedes its historical main/APK release step: keep
main unchanged, PR102 draft, and do not build, sign or publish an APK.

## Baseline and scope

Owner: the continuing LUMENFALL task. Isolated branch `feature/shared-ui-001`
starts from actual accepted Comet merge
`fe2a7b32859ebe04ecd3382d7b74ef285f683771`, tree
`7c21d666280d5d182fd621b1cecadfcb9d5d98e8`, behind
[PR102](https://github.com/karahaNx/Lumenfall/pull/102). Main remains
`67373faa531f0bb791c883210ee623320861e380`.

[Comet PR107](https://github.com/karahaNx/Lumenfall/pull/107) passed all five
final candidate workflows and supplemental original-command receipts before
integration. Whole-tree/ordered-parent verification and all13 fresh commands
on the actual merge passed: **843,198 assertions /111 causal controls**.
The original fixtures remain SHA256
`ab43604db1b5bce8b9990506f989676dfb0009cdcf2e514a8ccee9da166c8753`.

One goal: retain readable shared UI at narrow widths and enlarged text, then
verify the whole unreleased progression collection together. No new economy,
catalog, migration, save schema, automation or Android changes are intended.

## Observed defects and targeted changes

Final Comet/Tree browser evidence at320px/root32 shows the wordmark extending
under Settings, Wisp class text intersecting Field/Bench, and overlapping lines
in the last-chosen-Wisp toast. The existing suites did not assert the affected
class-tag glyph bounds; a no-horizontal-overflow check alone is insufficient.

- Below361px, reduce only brand letter spacing from .12em to .04em. Preserve
  the font size, sigil and Settings hit area.
- Allow the Wisp header to wrap and give its identity column its intrinsic
  minimum width. Preserve text, controls, DOM order and native handlers.
- Replace the toast's fixed16px line height with unitless1.4, preserving its
  text, font, timer and announcement behavior.

Per-currency price coloring already exists in the accepted source: independently
missing costs red, affordable costs normal, with no deficit text. Preserve it
and run its original **5,808-check /12-profile /3-control** regression unchanged.
The Recruit guidance slot's fixed46/44px geometry and native scrolling are an
existing F07 contract and passed its original160 observations. A possible
guidance readability optimization is separate from these three proven defects.

## Acceptance and preserved behavior

1. Add a focused real-browser regression across320/390/430px, normal/root32
   text and both motion preferences. Await actual startup, font readiness and
   native layout. Record glyph rectangles against the logo/gear, all eight
   Wisp identity/button boundaries and adjacent toast lines. No layout repair
   injection, hidden clipping acceptance or substitute toast handler.
2. Use trusted native touch/keyboard,44px targets, actual Settings focus return,
   and the last-chosen-Wisp refusal. Prove refused actions preserve complete
   live state and raw save/recovery slots. Cover immediate and settled geometry.
3. Revert each exact CSS fix independently. Each control must fail its named
   original geometry assertion, not startup, transport, font or fixture setup.
   Preserve original source, inverse patch, raw results and screenshots.
4. Keep original182 scenario IDs,212 attempts,40 registered negatives,
   22 mandatory negatives, nine original workflows and frozen fixtures intact.
   Run all five existing required workflows plus the focused Shared UI lane
   on the final candidate; inspect actual raw failures and fix their causes.
5. Preserve saves, purchased/earned value, paid Studies, progression, offline
   chronology, Auto-Ascend, package/signing and original fonts/branding assets.
   Use original core/offline/economy/actual V8 gates for combined regression.
6. Integrate only into the development branch after accepted evidence. Verify
   actual ordered parents and complete equal tree, then run required fresh
   checks on that actual merge before marking software acceptance complete.

## Checks and next action

Modern orchestration is Node20+; this workspace has Node24.19.0. Actual legacy
JavaScript checks use Node8.3.0 /V8 6.0.286.52. Local Chrome is unavailable;
browser results must come from the actual GitHub workflow, not simulated DOM.
Current CSS changes are a candidate; focused browser acceptance is pending.

Changed files: root `index.html`, new focused browser driver/workflow, this task,
the progression/Comet task status and current project checkpoint. Tests,
fixtures, source helpers and APK workflows outside this scope stay original.

Next: validate this task/context and focused harness, run a diagnostic browser
lane, review every actual failure, then run the complete final candidate gates.
Native installed-app upgrade, exact WebView60 CSS/textZoom, physical Android
and TalkBack acceptance remain pending. Modern Chrome and V8 proof do not
establish those results; no APK action is authorized in this continuation.
