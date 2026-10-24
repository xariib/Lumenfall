# ANDROID_TEST_RELEASE_001 — current game ready for phone testing

Owner: this chat. Status: preparing integrated validation and APK publication.

## User request and scope

24 October 2026: summarize current progress, build and publish a new APK on
GitHub if current improvements need testing, and make README short and direct.
This explicitly authorizes the signed Android build and publication. Earlier
feature-local no-release instructions describe those tasks, not this request.
Work / current model / High is suitable for release verification.

Baseline main: `b09d16c7e45f0663ebb5c3dde5fe87b139c9693b`.
Latest public APK: Android 0.2.14, `android-1000014`, source
`de1338cd40cca13a765cc42181a7f856d8711d6b`.
Only open PR is #2, the baseline audit documentation; no overlapping product PR.
No other feature or proposal is approved by this release task.

## Decision and preservation

Publish the integrated game for physical-phone acceptance: compact Wisp cards,
midgame Farm guidance and readable complete Lab hints have landed since 0.2.14.
Existing six-workflow CI and installed-emulator acceptance passed on documented
candidate/integrated versions, but do not replace final exact-main release gates.
See [current state](../PROJECT_STATE.md),
[Wisp acceptance](WISP_ACTION_HIERARCHY_001.md),
[Farm acceptance](MIDGAME_FARM_ACCEPT_001.md),
[hint acceptance](RIFT_HINT_READABILITY_002.md) and
[workflow](../project/FEATURE_WORKFLOW.md).

Only README and delivery documentation change. Preserve exact game, tests,
assets, economy, both save slots, purchases, progression, Auto-Ascend,
offline chronology, package, signing certificate and save origin. README retains
download, update-without-uninstalling, backup and two documentation links.

## Acceptance and release sequence

1. Context/link check passes for this task; review the complete documentation diff.
2. Integrate documentation, then dispatch all six existing required validations
   on that exact main commit. Both full pre-merge jobs must pass.
3. Dispatch the unchanged Android workflow on main with publish enabled only
   after those exact-main checks pass. Its original signing, asset/origin,
   in-place upgrade and exact-APK receipt gates must pass before publication.
4. Verify the published version, APK asset and release evidence. Record exact
   commit/run/release links and the short phone test plan here.
5. Physical phone, exact WebView60, TalkBack and human visual/pacing acceptance
   stay open until actually tested. Do not label emulator results as phone PASS.

## Checkpoint

GitHub live status and workflow triggers inspected. Android build is manual only;
publication requires six successful workflow_dispatch runs on exact main.
The GitHub connector supports repository reads/writes but has no dispatch action;
use the signed-in GitHub Actions UI for workflow dispatch, keeping all gates intact.
Do not implement the separate unapproved Rift VFX overflow proposal.

Next: integrate the checked documentation and run exact-main validation.

Local checks: context PASS (29 entrypoints, 43 local links, 20,935-byte startup);
`git diff --check` PASS. Self-review: README reduced from 73 to 10 lines; all
removed development detail remains in linked existing documentation. No product,
Android workflow, test, asset or signing changes.
