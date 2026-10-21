# MIDGAME_FARM_ACCEPT_001 — accept integrated Farm guidance

Owner: this feature chat. The user requested the next approved unfinished
improvement. PR #5 is already integrated, but its mobile and installed Android
acceptance remains open. This task adds acceptance coverage to existing QA
drivers and runs it on the integrated game; it changes no product, save, price,
purchase, automation, package identity or publishing behavior.

## Baseline and criteria

- `main` `2d90fc291e6693cc553b280f8a5d191aa9b2c73c` on 22 October 2026.
  PR #5 merged; PR #2 is an open documentation-only audit with an older base.
  No open issues. The current Farm hint's original requirements and VM checks
  are in [MIDGAME_FARM_GUIDANCE_001](MIDGAME_FARM_GUIDANCE_001.md).
- In a developing save after the first Ascend, verify the exact Wisp Ascendancy
  quote, accessible name, no horizontal clipping and keyboard/touch navigation
  to the actual Lab card at 320/390/430 px, 100/150/200% text, normal/reduced
  motion. Verify both insufficient resource amounts remain red and accessible.
  Inspect screenshots and save/state equality when merely viewing/navigating.
- On a disposable Android emulator, verify the **installed** hint and a native
  touch to the Lab card after the existing signed in-place upgrade, two-slot
  save, entitlement and Wisp acceptance. Capture a screenshot and diagnostic
  receipt. Build with `publish=false`; do not create a release.
- Run the focused source contract, context check, required PR CI, then the
  non-publishing Android workflow on integrated main. Document exact versions,
  results and any remaining physical-phone, exact WebView60, TalkBack or human
  visual/pacing gaps. An open PR or browser pass does not complete device accept.

## Checkpoint — 22 October 2026

Status: implementation on `qa/midgame-farm-accept-001`; tests pending.
Files: `tests/behavioral/rift-guidance.cjs`, `scripts/ci/android-upgrade.cjs`,
`.github/workflows/pre-merge-validation.yml`, this task. The browser driver
uses the existing instrumented state fixture and native CDP keyboard/touch;
the Android driver uses a disposable in-memory state after upgrade preservation
assertions. No product source changed.

Next: run local source/context checks, inspect complete diff, publish a focused
PR and inspect every required final-head workflow. Merge only when green; run
the Android workflow with `publish=false` on integrated main and record the
receipt. If an unavailable device or workflow tool blocks a criterion, keep
that acceptance open with a precise next action.

## CI correction

Draft PR #6 head `cfb20cadf20574f6f57ac09300bfd46f9b2ecff9` reached
pre-merge run `39689717491`. Context check PASS (29 entrypoints, 46 links);
isolated offline job PASS. The new mobile step failed on the first profile
with `SyntaxError: missing ) after argument list` in the QA-only touch
assertion's CDP expression (line 99). This is a malformed test selector
string, not a product failure. Correct the expression and rerun all required
checks on the final head.
