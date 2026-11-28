# Repository cleanup and release readiness

The owner requested a GitHub-wide review, removal of useless files, and use of relevant public skills to improve Lumenfall before publication. This worktree starts at main `55f81bf9`. Acceptance covers substantiated cleanup, preserved save and gameplay behavior, comparison of actual packaged assets, browser checks, and a durable report of remaining publication risks. A public release is a separate decision.

## Baseline

The main tree contains 19,802 files. Three open PRs cover Play distribution (#63), Ascension Tree ranks (#72), and game quality (#76). The public APK is Android 0.2.171. The migration deliberately retained 3,586 reviewed evidence files with their original paths and hashes. Existing physical-device, TalkBack and exact WebView 60 acceptance is open.

The Android build copies the entire fonts directory. Its 11 WOFF2 files represent five unique blobs. Cinzel has three copies of one blob and Manrope has five copies of another. IBM Plex Mono has three distinct blobs. Only the live stylesheet references the redundant font names in current product and test paths.

This cleanup is tracked in [PR #77](https://github.com/xariib/Lumenfall/pull/77).

## Cleanup and release checks

- Queried all 121 branch heads, the 76 PRs, open issues, 39 releases, workflow definitions and the nine successful validation runs for the shipped source. #63 and #72 reported merge conflicts. #76 was still validating its prospective merge. No standalone issues were open at the audit snapshot.
- Consolidated six duplicate files in `fonts/` (151,152 uncompressed bytes) and kept all 11 single-weight CSS declarations for older engines. Added the three upstream [font notices](https://github.com/google/fonts/tree/main/ofl) to the staged font directory. Moved the production branding guide out of the app payload and updated the source index. Removed an unreferenced one-time rewrite that would replace the current Wisp Ultimate markup with retired markup.
- The public APK for 0.2.171 matched the published SHA-256 `2803824abf0e31f326bf2d61c4f737c0a942d999eee112f3fbbe342904f94647`. The package ID, origin and all 15 expected assets matched Git source `09b87e84`. The current production dependency audit reported zero known advisories.
- The Android publisher checked only six of the nine workflows in the [previous release receipt](../qa/wisp-ability-pacing-001/integrated-validation.json). It now also checks migration, permanent progression, and Wisp scroll on the exact commit. Release-gate tests passed 20 negative controls, including missing, superseded and wrong-commit results for the three suites.
- Used OpenAI's [Game Playtest skill](https://github.com/openai/plugins/blob/main/plugins/game-studio/skills/game-playtest/SKILL.md) with the project's existing Chrome harness. Chrome 158.0.8127.36 loaded all 11 faces in both versions and rendered the same glyph sample to identical PNG bytes (SHA-256 `46c3e263fda531da8bfa5a8846afc32c7d9f9182f7ec75fa202fda39d22c71b8`).
- Node 24.22.3 passed source validation, context, 1,509 archive checks, migration and historical 14-asset restoration, behavioral partition coverage and APK identity self-tests. Self-review found no change to game source or save logic. Asset size figures describe staged files; APK compression and signing affect the final size.

The candidate visual audit passed 1,792 checks across 16 viewport, scale, and motion combinations. It produced 72 screenshots. The narrow Rift and Wisps screens were visually reviewed. A link scan located one more reference to the moved branding guide in the Visual Polish task, which now points to its new location.

The baseline full npm audit reported seven moderate development dependency entries and zero high or critical entries. The production-only audit was clean. The token lacked access to the private Dependabot alerts view and Projects boards. These API results cannot establish that no private alerts or boards exist. Play distribution remains tracked in [PR #63](https://github.com/xariib/Lumenfall/pull/63).

## Android and playtest evidence

[Unpublished signed Android build](https://github.com/xariib/Lumenfall/actions/runs/46162116521) produced candidate 0.2.177 from `c3e4d8c9`. Its APK is 5,021,679 bytes, 146,657 bytes smaller than public 0.2.171. The APK SHA-256 is `7eb45d6918d103dcd21336a1cd2da0bf45bd3f67c513923fd6dbf646ff72d7d9`. The artifact download digest, all 11 expected packaged assets and their source Git hashes were checked locally. The candidate kept package `com.lumenfall.app` and the established signing certificate. The emulator upgrade retained UID, both save slots and paid research. Updater installation and normal launch on a retail Android image passed. The later PR documentation correction changed no product or build inputs.

The full-game and progression-pacing audits passed 318 and 309 checks. Navigation passed on a Chrome retry. The Windows Chrome runners for save backup and mobile Rift guidance timed out. Both passed with their original deadlines on the installed Brave browser, including 12 backup profiles. Physical-phone handling, TalkBack, exact WebView 60 and store review remain unverified.

A compatible build-tool lockfile update advances the Trapeze project and Gradle parser from 7.1.11 to 7.1.13, updates transitive Xcode tooling and drops its unused UUID and INI dependencies. All five changed package entries are development-only. A clean npm install with lifecycle scripts suppressed, production dependency inspection and the production audit passed. The new full audit reports four moderate entries in the existing CLI dependency chain and zero high or critical entries. npm proposes a major Capacitor CLI migration for those remaining entries. The release worker exercises the full install and native build.

The [updated unpublished Android build](https://github.com/xariib/Lumenfall/actions/runs/46164048158) passed on `98f054c8` as 0.2.178. The APK is 5,021,684 bytes, a reduction of 146,652 bytes versus public 0.2.171. Its SHA-256 is `01efac2406d1616b2bee3d96acab908e5c73934604e277465a222e4b71b2f052`. The downloaded artifact matched the GitHub digest. All 11 expected source assets matched Git. Comparing ZIP directories confirmed that the six font aliases and developer guide were gone and the three font notices were present. Signing identity, save-preserving upgrade, updater and retail launch passed again. The build-worker audit confirmed the four development entries.

Eight validation suites passed at the current PR head, including the [migration scenarios](https://github.com/xariib/Lumenfall/actions/runs/46164050171). The first Ubuntu Wisp scroll job timed out at `Browser.getVersion` before gameplay assertions. The unchanged job passed its retry. At that point PR #76 integrated its landscape, tapping, clock and save-feedback changes at `d0340052`. Its files did not overlap this cleanup. The branch now includes that main version for combined PR checks and an unpublished Android build. All original cleanup-only results above are pinned to their earlier source. Publication remains a separate user decision.
