# Repository cleanup and release readiness

The owner requested a GitHub-wide review, removal of useless files, and use of relevant public skills to improve Lumenfall before publication. This worktree starts at main `55f81bf9`. Acceptance covers substantiated cleanup, preserved save and gameplay behavior, comparison of actual packaged assets, browser checks, and a durable report of remaining publication risks. A public release is a separate decision.

## Baseline

The main tree contains 19,802 files. Three open PRs cover Play distribution (#63), Ascension Tree ranks (#72), and game quality (#76). The public APK is Android 0.2.171. The migration deliberately retained 3,586 reviewed evidence files with their original paths and hashes. Existing physical-device, TalkBack and exact WebView 60 acceptance is open.

The Android build copies the entire fonts directory. Its 11 WOFF2 files represent five unique blobs. Cinzel has three copies of one blob and Manrope has five copies of another. IBM Plex Mono has three distinct blobs. Only the live stylesheet references the redundant font names in current product and test paths.

Status is in progress. Compare font loading and rendering before and after consolidation, inspect notices and shipped assets, and verify integration against concurrent work.

## Cleanup and release checks

- Queried all 121 branch heads, the 76 PRs, open issues, 39 releases, workflow definitions and the nine successful validation runs for the shipped source. #63 and #72 reported merge conflicts. #76 was still validating its prospective merge. No standalone issues were open at the audit snapshot.
- Consolidated six duplicate files in `fonts/` (151,152 uncompressed bytes) and kept all 11 single-weight CSS declarations for older engines. Added the three upstream [font notices](https://github.com/google/fonts/tree/main/ofl) to the staged font directory. Moved the production branding guide out of the app payload and updated the source index. Removed an unreferenced one-time rewrite that would replace the current Wisp Ultimate markup with retired markup.
- The public APK for 0.2.171 matched the published SHA-256 `2803824abf0e31f326bf2d61c4f737c0a942d999eee112f3fbbe342904f94647`. The package ID, origin and all 15 expected assets matched Git source `09b87e84`. The current production dependency audit reported zero known advisories.
- The Android publisher checked only six of the nine workflows in the [previous release receipt](../qa/wisp-ability-pacing-001/integrated-validation.json). It now also checks migration, permanent progression, and Wisp scroll on the exact commit. Release-gate tests passed 20 negative controls, including missing, superseded and wrong-commit results for the three suites.
- Used OpenAI's [Game Playtest skill](https://github.com/openai/plugins/blob/main/plugins/game-studio/skills/game-playtest/SKILL.md) with the project's existing Chrome harness. Chrome 158.0.8127.36 loaded all 11 faces in both versions and rendered the same glyph sample to identical PNG bytes (SHA-256 `46c3e263fda531da8bfa5a8846afc32c7d9f9182f7ec75fa202fda39d22c71b8`).
- Node 24.22.3 passed source validation, context, 1,509 archive checks, migration and historical 14-asset restoration, behavioral partition coverage and APK identity self-tests. Self-review found no change to game source or save logic. Asset size figures describe staged files; APK compression and signing affect the final size.

Next action is PR validation and an unpublished Android build with packaged asset checks. Publication remains a separate user decision.
