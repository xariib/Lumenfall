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

Status: PR #6 ready on `qa/midgame-farm-accept-001`; final-head browser, CI and installed Android acceptance passed. Integrated-main Android acceptance remains pending.
Files: `tests/behavioral/rift-guidance.cjs`, `scripts/ci/android-upgrade.cjs`,
`.github/workflows/pre-merge-validation.yml`, this task. The browser driver
uses the existing instrumented state fixture and native CDP keyboard/touch;
the Android driver seeds a synthetic two-slot save only in the disposable
emulator after upgrade preservation assertions. No product source changed.

Checks: focused source contract 24 assertions; JavaScript syntax and diff
whitespace passed. Browser acceptance passed 18/18 combinations across
320/390/430 px, 100/150/200% text and normal/reduced motion. It checked the
exact quote and accessible name, shortfall colors, horizontal fit, native
keyboard/scroll/touch navigation, and unchanged state/save. The context check
passed 29 entrypoints and 46 links. Six relevant final-head workflows passed,
including [pre-merge validation](https://github.com/xariib/Lumenfall/actions/runs/39852803734)
with the full stateful behavioral suite and isolated offline job; two
Prism-specific workflows skipped by path filters. Lab and Comet initially
timed out during Chrome CDP startup before positive profiles, then passed on
same-head retries.

[Non-publishing Android run #23](https://github.com/xariib/Lumenfall/actions/runs/39856822505)
passed on exact PR head `f5b25d37f2d8bc883b03ec1fec646dbe95e545ab`.
Signed 0.2.23 (`versionCode 1000023`, APK SHA-256
`fbc8734813d99311c4c9184a51458642b28befc764b897b4373c1a8a173a5a0d`)
installed in place over 0.1.158 on Android 12/API31/WebView91. UID
`10145`, both save slots, paid progression and legacy entitlements survived;
the existing Wisp UI/touch check passed. The installed Farm fixture then
verified the quote, accessible name and fit, and a native touch reached a
visible, focused Wisp Ascendancy Lab card. [Artifact 12459827478](https://github.com/xariib/Lumenfall/actions/runs/39856822505/artifacts/12459827478)
contains the receipt and screenshot. No APK release was published.

Review: automated Codex review identified stale task status on this PR and
requested that these results and the next action be recorded here. The QA diff
was self-reviewed; no independent human review is claimed. At 200% text the
existing fixed 44 px Rift hint window displays only a small portion of the
quote at a time, although it is scrollable. Physical phone, exact WebView60,
TalkBack, and human visual/pacing acceptance remain open.

Next: once the updated PR head is green, merge PR #6 with the owner's explicit
approval, run `Build Android APK` on exact integrated main with
`publish=false`, inspect its installed receipt, and record the result in
this task and `docs/PROJECT_STATE.md`. Keep the full feature open for the
remaining real-device and human checks. Treat the 200% hint readability as
a separate improvement proposal.

## CI correction

Draft PR #6 head `cfb20cadf20574f6f57ac09300bfd46f9b2ecff9` reached
pre-merge run `39689717491`. Context check PASS (29 entrypoints, 46 links);
isolated offline job PASS. The new mobile step failed on the first profile
with `SyntaxError: missing ) after argument list` in the QA-only touch
assertion's CDP expression (line 99). This is a malformed test selector
string, not a product failure. Correct the expression and rerun all required
checks on the final head.

Second head `e948d6c0a6b0ab1897b0bd4e721d9dca17cdd17d`, run
`39690705502`: context PASS and isolated offline PASS. The mobile acceptance
passed both 320 px/100% motion profiles, then its generic `touch()` helper
targeted the center of an objective taller than the fixed 44 px scroll window
at 150% text. The captured screenshot shows the hint's visible upper section;
the off-window center was not a hit target. This is a test-driver geometry
error, while the narrow scroll window is an observed usability limitation.
Use the visible intersection for native taps; exercise scrolling to the quote
at every profile and preserve the failure artifact for visual review. Keep the
feature open for final-head CI and installed acceptance.

## Installed Android correction — 22 October 2026

Non-publishing [Android run #22](https://github.com/xariib/Lumenfall/actions/runs/39851727638) on `67e73f67c95797d3e9ee8e71a53962f563e68e27` failed after the signed 0.2.22 build and the original in-place upgrade, both save slots, paid/legacy entitlement checks, and installed Wisp UI/touch acceptance passed. The new Farm-only driver attempted to evaluate `state` from DevTools, but production encloses it in a private IIFE; the error was `ReferenceError: state is not defined`. This is a QA fixture defect, not evidence of a game failure. Raw failed-native diagnostics are [artifact 12458730309](https://github.com/xariib/Lumenfall/actions/runs/39851727638/artifacts/12458730309).

Correction `cc171bb0878cf218fe06c63719e254d1dee15324`: after the preservation assertions, inject a synthetic two-slot save before the installed WebView reload, then assert that the disposable emulator loaded Farm mode and first Ascend. Inspect the actual installed UI and use native Android touch. This fixture does write only to the disposable emulator's local storage; it is never used on a player's device. Product `index.html`, save schema, purchases, prices and release workflow are unchanged. JavaScript syntax check passed before publication. The later final-head CI and installed acceptance results are recorded above.
