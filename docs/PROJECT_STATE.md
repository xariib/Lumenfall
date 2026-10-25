# Lumenfall — current delivery status

25 October 2026: [MOBILE_FEEDBACK_001](tasks/MOBILE_FEEDBACK_001.md),
[PR #9](https://github.com/xariib/Lumenfall/pull/9), addresses repeated Wisp
support readouts, touch focus highlights and Rift appearing before intro.
Implementation and focused startup tests passed; final CI/integration and
installed Android acceptance remain pending. This does not change the released APK.

24 October 2026: [ANDROID_TEST_RELEASE_001](tasks/ANDROID_TEST_RELEASE_001.md)
prepares the integrated Wisp/Farm/hint improvements for physical-phone testing.
The user explicitly authorized a new signed APK publication and a minimal README.
At preparation, the public APK was 0.2.14. Live release outcome, exact versions
and check evidence: [delivery PR #8](https://github.com/xariib/Lumenfall/pull/8).
No product code changes in this delivery task.

24 October 2026: [RIFT_HINT_READABILITY_002](tasks/RIFT_HINT_READABILITY_002.md)
was integrated through [PR #7](https://github.com/xariib/Lumenfall/pull/7) at
`88d9bdd33dafb4d075f8b86254ef050ade99e32d`. The short Farm Lab summary opens
complete current advice without changing combat geometry, purchases or saves.
All six required final-head workflows passed, including both full jobs,
18 mobile profiles, causal controls, original layout cases and runtime smoke;
automated review had no findings. The integrated tree matches tested 0d7937a.

[Non-publishing integrated Android #29](https://github.com/xariib/Lumenfall/actions/runs/40076467803)
**PASS** on exact main `6de1789b95db4eff4321241b9474730b909e0d14`.
Signing/package/assets/origin and the exact-APK receipt gates passed.
Both save slots, paid work and legacy entitlements survived the installed
upgrade. Native Wisp touch and summary → complete hint → focused original
Lab card passed. Release was skipped. The environment interruption is resolved.
**Integrated and installed-emulator accepted; physical phone, exact WebView60,
TalkBack and human visual/pacing acceptance remain open.** No APK release.
The earlier phase-sensitive VFX failure is retained in the
[separate, unapproved proposal](tasks/RIFT_VFX_OVERFLOW_001.md); its unchanged
gate passed in final CI, but the underlying finding is not claimed fixed.

22 October 2026: [MIDGAME_FARM_ACCEPT_001](tasks/MIDGAME_FARM_ACCEPT_001.md)
verified the previously integrated midgame Farm guidance through
[PR #6](https://github.com/xariib/Lumenfall/pull/6), merged at
`83b1a8e050d0d0bffefbf9023902e6cf3817282d`. No product source,
save schema, purchases, prices or package identity changed. All six
relevant final-head workflows passed; [pre-merge validation](https://github.com/xariib/Lumenfall/actions/runs/39861115223)
passed on attempt 2, including the complete stateful and isolated offline
jobs. The browser matrix passed 18/18 profiles across 320/390/430 px,
100/150/200% text and normal/reduced motion, with exact hint, accessible
name, affordability colors, navigation and unchanged state/save.

[Non-publishing integrated Android run #25](https://github.com/xariib/Lumenfall/actions/runs/39870276892)
passed on exact merge commit: signed 0.2.25 (`versionCode 1000025`,
APK SHA-256 `101d007142eede2261befae11adf384d1d2b374f2c9d890153f5def0144eaf93`)
installed over 0.1.158 on Android 12/API31/WebView 91.0.4472.114.
Both saves, UID `10145`, origin, paid progression and legacy entitlements
survived. Installed Wisp UI/touch and the Farm hint's exact content,
accessible name, fit and native touch to a focused Lab card passed.
[Artifact 12465868190](https://github.com/xariib/Lumenfall/actions/runs/39870276892/artifacts/12465868190)
contains the receipt and screenshots; the release step was skipped.
An earlier exact-main [run #24](https://github.com/xariib/Lumenfall/actions/runs/39868057691)
failed first at the existing Wisp offline-recap touch timing check and then
timed out connecting to the old APK WebView on retry; run #25 resolved the
integrated acceptance, and those failures remain documented in the task.
**Integrated and installed-emulator accepted; physical phone, exact
WebView60, TalkBack and human visual/pacing remain open.** At 200% text
the fixed 44 px Rift hint viewport is scrollable but shows only a small
portion of the quote; propose a separate readability change. No APK
release has been published.

21 October 2026: [WISP_ACTION_HIERARCHY_001](tasks/WISP_ACTION_HIERARCHY_001.md)
was integrated through [PR #3](https://github.com/xariib/Lumenfall/pull/3)
at `7a498e5be2d060476c9442435768ea1db15d725d`; all six relevant PR
workflows and [exact-main full validation](https://github.com/xariib/Lumenfall/actions/runs/39548886678)
passed. [PR #4](https://github.com/xariib/Lumenfall/pull/4) added installed
Android Wisp UI acceptance to the test driver only, passed all six final-head
workflows, and merged at `4a3085067797b292b32c179e4e4bbb8e33b640d1`.
The [non-publishing integrated Android run #21](https://github.com/xariib/Lumenfall/actions/runs/39559404175)
built signed 0.2.21 and passed an in-place installed upgrade on Android 12/
API31/WebView91: both saves, UID/origin, paid progression and legacy entitlements
survived. All eight Wisp cards fit at 320 px with their prices/effects and
accessible Next cue; an Android touch purchased one Ember Ability level and
returned focus with its refreshed name. APK SHA-256 is
`5141f8e54290a18854b125677f2f144690d055e06a0c07f95762b6d33d36a026`,
artifact `signed-apk-39559404175`. No new release has been published.
**Integrated and installed-emulator accepted; physical phone, exact WebView60,
TalkBack and human visual/pacing acceptance remain open. Do not mark complete.**

16 October 2026: combined endless-progression game released in xariib/Lumenfall as
[Android 0.2.14](https://github.com/xariib/Lumenfall/releases/tag/android-1000014), versionCode1000014.
[Download latest APK](https://github.com/xariib/Lumenfall/releases/latest/download/Lumenfall.apk); existing players install as an update without
uninstalling. [Completed migration](tasks/REPOSITORY_MIGRATION_001.md) and
[final identity/save/download evidence](qa/repository-migration-001/release/).

Released source: de1338cd40cca13a765cc42181a7f856d8711d6b, from selected codex/endless-progression8f46153.
Both selected history and original destinationeba021e preserved; PR1 merged.
All six exact-main required workflows and both Full jobs pass. Android12/API31/
WebView91 actual cold-save/in-place installed upgrade verifies original package,
certificate, origin/UID, BOTH slots, progression, paid work and legacy entitlements.
Anonymous stable download returns the exact verified signed APK bytes.

Current features include endless progression, permanent Wisp Mastery, late upgrade
guidance, affordability feedback, Formation controls and Wisp progression UI,
Forge/Lab/Tree/Comet/save/offline systems. Migration adds two proven CSS fixes and
pure Amount arithmetic performance changes; all other product JS/config/assets
match selected8f. Product SHA256d4a55cde9135d078a6da16ff85ddee831129c631312c30c1ea3c90efa00372e5.
[Preservation proof](qa/repository-migration-001/product-preservation.json).

Original requirements and earlier evidence remain in [Endless task](tasks/ENDLESS_PROGRESSION_001.md),
[requirements](qa/endless-progression-001/REQUIREMENTS.md),
[late guidance](qa/endless-progression-001/LATE_GUIDANCE.md) and
[pre-migration status snapshot](project/PROJECT_STATE_BEFORE_MIGRATION_2026-10-16.md).
Their pre-release statuses are historical; the migration task records this delivery.
Other chats/worktrees remain untouched. Self-review/automated validation only.

Physical-phone, exact WebView60 DOM, TalkBack and human pacing/performance acceptance
remain unverified. The available emulator test uses archived signed158 and synthetic
saves; no particular old version is required on the user's phone. Historical
pre-import Git objects unavailable404 remain a limitation. [Known issues](project/KNOWN_ISSUES.md).
