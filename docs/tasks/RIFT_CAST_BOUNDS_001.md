# RIFT_CAST_BOUNDS_001 — keep Wisp casts inside the combat arena

Status: PROPOSED, NOT APPROVED. No product implementation in this task.
Recommended setup: Work / GPT-6.1 Sol / High.

## Verified problem and priority

Full regression of [PR #7](https://github.com/xariib/Lumenfall/pull/7) reports
FAIL rift-status-stacking-mobile: a Void cast makes the existing arena overflow
assertion fail. The isolated [baseline comparison](../qa/rift-hint-readability-002/baseline-diagnosis.json)
reproduces identical outcomes on main and candidate. At 360×640 with 24 px
safe insets during a boss encounter, 68 sampled frames overflow; worst height
is 136 inside 129. State and saved bytes remain unchanged in both versions.
This is a pre-existing presentation defect blocking the hint feature's full gate.

## Proposed single goal

Adapt the cast's presentation geometry to the available arena so Wisp effects
stay within the existing combat area throughout their animation. Preserve all
eight Wisp identities/effects, combat hit area, HP and Formation positions,
fonts, controls, reduced motion and all mechanics, purchases and saves.
Do not hide overflow, disable animation to conceal the issue, relax assertions,
change test deadlines, or change gameplay. No APK release.

## Acceptance before integration

- Reproduce the old defect deterministically with the existing arena assertion.
- Check all eight Wisp casts across their complete animation phases in the
  original compact and tall profiles, including boss and dense formations.
  The original arena bounds and readable/accessible controls must pass.
- Retain a causal control restoring the old cast geometry, which must fail at
  the same arena assertion. Preserve full state and saved bytes in probes.
- Original rift-status-stacking-mobile/reduced-motion tests pass, with no
  original assertion or deadline weakened. Existing 18-profile Lab-hint matrix,
  purchase/progression/offline tests and full required CI also pass.
- Review the complete diff; integrate this repair independently, then update
  PR #7 against that verified base and finish its required installed acceptance.
  Physical phone, exact WebView60, TalkBack and human pacing remain separate.

## Next action

Request approval of this concrete scope before product changes. If approved,
re-read AGENTS.md, current main and open work; use an isolated repair branch,
retain the diagnostic evidence and implement/test the smallest robust fix.
