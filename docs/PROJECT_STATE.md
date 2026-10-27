# Lumenfall — current delivery status

27 October 2026: [Readable Auto Ascend](tasks/AUTO_ASCEND_FEEDBACK_001.md),
[PR #16](https://github.com/xariib/Lumenfall/pull/16), validation in progress.
One stationary summary combines complete committed gains/counts; manual rewards
get a reading interval. Gameplay and PR15 balance are unchanged. Mobile browser
profiles PASS; remaining CI and app/device acceptance pending. No APK release.

27 October 2026: [Progression pacing and manual Farm](tasks/PROGRESSION_PACING_001.md) integrated through [PR #15](https://github.com/xariib/Lumenfall/pull/15) at `96af28bd`. Masterwork is additive and Rift-gated; shallow farming is bounded and manual Farm persists with Auto Ascend. Seven required workflows, both full jobs, 189+1 scenarios and runtime smoke PASS; integrated code/tree match the tested merge. [Evidence](qa/progression-pacing-001/ci-final.json). No new APK; app/device and human pacing acceptance remain open.

27 October: [Permanent progression](tasks/PERMANENT_PROGRESSION_UI_001.md) released as **Android 0.2.48**. Seven gates, 189+1 scenarios, installed Android upgrade and public APK verification PASS. Both saves/paid work retained. [Evidence](qa/permanent-progression-ui-001/release.json). Phone/WebView60/TalkBack/pacing remain open.

26 October 2026: [Workshop/card clarity](tasks/WORKSHOP_CARD_CLARITY_001.md)
merged through [PR #13](https://github.com/xariib/Lumenfall/pull/13) at bba2db5e.
[Android 0.2.43](https://github.com/xariib/Lumenfall/releases/tag/android-1000043)
is published: five visible Lab slots, click-to-choose catalogue, Queue OFF clearing
with paid work/boosts retained, concise cards, 49 additional Deeds (76 total) and
Comet commands in Deeds so Rift stays fixed. All six exact-main workflows,
both complete jobs and 189+1 scenarios pass. The signed installed Android upgrade
retained UID/origin, both saves, paid work and legacy entitlements; native Wisp
purchase and Farm navigation pass. Anonymous public download, checksum and actual
packaged source were verified. [Evidence](qa/workshop-card-clarity-001/release.json).
Physical phone, exact WebView60 DOM, TalkBack and human pacing remain open.

[Lab/Forge long-tail progression](tasks/LAB_FORGE_LONGTAIL_001.md) previously merged
through PR #11 at e287b121 and released 0.2.40. Its paid timed boosts and caps remain;
the new slot workflow replaces its Pause Study UI. Phone, exact WebView60,
TalkBack and human pacing acceptance remain open.

25 October 2026: [Mobile feedback](tasks/MOBILE_FEEDBACK_001.md) (PR #9, c4d5e060):
simpler Wisp readouts, no touch highlights, intro before Rift.
[Recap/release](tasks/OFFLINE_RECAP_RELEASE_001.md) (PR #10, 4239bc1): native QA's
24 px origin fixed. Six release gates, 189+1 scenarios, native upgrade/saves/paid
work and centered Continue/Wisp/Farm touches PASS.
[Android 0.2.37](https://github.com/xariib/Lumenfall/releases/tag/android-1000037)
published; public checksum verified. Phone/WebView60/TalkBack/pacing remain open;
historical failures and VFX limitation are retained in the tasks.

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
integrated via [PR #6](https://github.com/xariib/Lumenfall/pull/6) at `83b1a8e`.
Six workflows, both full jobs and 18 browser profiles PASS.
[Installed Android run #25](https://github.com/xariib/Lumenfall/actions/runs/39870276892)
PASS: 0.2.25 over 0.1.158 on API31/WebView91, both saves, UID/origin, paid work,
legacy entitlements and native hint-to-Lab touch retained. No APK publication.
The task retains exact versions/checksums/artifacts and earlier run24 failures.
Phone/WebView60/TalkBack/human acceptance remains open; its 200%-text hint
readability finding was addressed separately in RIFT_HINT_READABILITY_002 above.

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
