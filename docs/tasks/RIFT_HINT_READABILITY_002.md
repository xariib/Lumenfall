# RIFT_HINT_READABILITY_002 — readable Farm Lab advice

Status: unintegrated; full regression reports arena overflow; baseline diagnosis pending.

## Approved scope

The user approved a short Farm Lab summary opening complete current advice,
price or red resource shortfalls and navigation to the existing Lab card.
Keep combat geometry, fonts, other guidance, gameplay, prices, saves,
progression, automation and Android identity. No APK release.

Original requirements, implementation history and earlier failed checks remain
in the [feature checkpoint](https://github.com/xariib/Lumenfall/blob/feat/rift-hint-readability-002/docs/tasks/RIFT_HINT_READABILITY_002.md).
This isolated QA checkpoint does not replace the original feature branch.

## Acceptance retained

- Readable at 320/390/430 px and 100/150/200% text, both motion settings,
  full current advice without horizontal clipping and actions at least 44 px.
- Keyboard/touch opening, contained focus, Escape/Close return and existing
  focused Lab destination. Live refresh, running paid work and occupied slots.
- Stable combat geometry; no state or saved-byte change from viewing/navigation.
  Existing purchase, progression, offline and automation tests remain required.
- All required regression gates must pass before integration. Candidate browser,
  emulator and physical/human acceptance are distinct. Keep failed work open.

## Verified follow-up

[PR #7](https://github.com/xariib/Lumenfall/pull/7) remains open at candidate
4239036 against main 8dabca9. Five scoped workflows and isolated offline pass.
Repeated Farm 24, late guidance 186, progression 235, Lab 2,677 with 10 controls,
Forge 9,319 with 25 controls, and Ascend 56 checks pass on the current source.
Task/source validation, syntax, complete diff and original-function comparison pass.
The identical-product browser matrix passes 18 profiles and both causal controls;
320 px/200% summary, funded details and red-shortfall images were inspected.
[Minimal follow-up evidence](../qa/rift-hint-readability-002/followup-verification.json).

Full regression now reports FAIL rift-status-stacking-mobile: the original
#enemy-stage text/content unclipped assertion observes scroll height 131 within
client height 129 while a Void effect is animated. The run is not acceptance.
The affected arena/Void code is unchanged, but that alone does not prove cause.

## Isolated diagnosis

Branch qa/rift-cast-baseline-002 compares the pinned baseline and candidate
at identical glyph/Void animation frames through existing fixtures and the
original arena assertion. It preserves state/save bytes, does not change product
files, and does not replace, relax or skip original tests, assertions or gates.
Workflow: [.github/workflows/rift-cast-baseline-diagnostic.yml](../../.github/workflows/rift-cast-baseline-diagnostic.yml).
Driver: [rift-cast-baseline-diagnostic.cjs](../../tests/behavioral/rift-cast-baseline-diagnostic.cjs).
Its result is diagnosis, never product acceptance.

Next: inspect diagnostic and final full-regression outcome; fix any introduced
regression in scope, or propose a separate repair if an unrelated baseline defect
is established. Do not integrate PR #7 while the required gate fails.
Physical phone, exact WebView60, TalkBack and human pacing remain unverified.
