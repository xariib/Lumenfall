# Lumenfall — current delivery status

29 October: [Full-game/Workshop audit](tasks/FULL_GAME_WORKSHOP_AUDIT_001.md),
[PR #21](https://github.com/xariib/Lumenfall/pull/21): stationary Wisp actions,
canonical recruited-Wisp ability purchases and durable atomic quest claims.
All 21 active Forge/20 active Lab paths reviewed; existing caps retained after
earned-currency 48-hour campaigns. Candidate source `4246093d`; current CI,
integration and Android delivery receipt are maintained in PR21. No new APK yet.
Physical phone/WebView60/TalkBack/human pacing remain separate acceptance.

28 October: [Editable next Lab boost](tasks/LAB_BOOST_QUEUE_001.md) released as
[Android0.2.52](https://github.com/xariib/Lumenfall/releases/tag/android-1000052)
from `adaf602c`, after PR18 merged at `8eae1031`. Separate boost queue, editable
next settings and empty-slot OFF preserve paid work. All seven PR/main gates,
189+1 scenarios, signed installed upgrade and public exact-byte checks PASS.
[Evidence](qa/lab-boost-queue-001/release.json). Both saves, paid work, UID/origin
and legacy purchases retained. Phone/WebView60/TalkBack/human pacing remain open.

28 October 2026: [Game verification and APK delivery](tasks/GAME_CHECK_APK_RELEASE_001.md)
published [Android 0.2.51](https://github.com/xariib/Lumenfall/releases/tag/android-1000051)
from `d3420c15`. Seven exact-source workflows, both full jobs (189+1 scenarios),
runtime smoke, signed installed upgrade and anonymous exact-byte download PASS.
Both saves, paid work, UID/origin and legacy purchases retained. Includes PR15
pacing/manual Farm, PR16 Ascend summary and PR17 Lab queue/Speed Up.
[Release evidence](qa/game-check-apk-release-001/release.json).
Physical phone, exact WebView60, TalkBack and human pacing remain open.

28 October: [Lab queue/Speed Up](tasks/LAB_SLOTS_QUEUE_SPEEDUP_001.md) merged
via PR17 at `bdb341ee` after seven PR gates passed. Queue OFF finishes active
work; replacement retains paid work. Shipped in Android 0.2.51 above.

27 October 2026: [Readable Auto Ascend](tasks/AUTO_ASCEND_FEEDBACK_001.md)
integrated via [PR #16](https://github.com/xariib/Lumenfall/pull/16) at `48f95e43`.
One stationary summary combines all committed gains/counts; gameplay and PR15
balance are unchanged. Seven gates, both full jobs, 189+1 scenarios, 12 mobile
profiles and runtime smoke PASS; integrated tree matches the tested merge.
[Evidence](qa/auto-ascend-feedback-001/ci-final.json). Included in Android0.2.51;
physical-device and human pacing acceptance remain open.

27 October 2026: [Progression pacing and manual Farm](tasks/PROGRESSION_PACING_001.md) integrated through [PR #15](https://github.com/xariib/Lumenfall/pull/15) at `96af28bd`. Masterwork is additive and Rift-gated; shallow farming is bounded and manual Farm persists with Auto Ascend. Seven required workflows, both full jobs, 189+1 scenarios and runtime smoke PASS; integrated code/tree match the tested merge. [Evidence](qa/progression-pacing-001/ci-final.json). Included in Android0.2.51; physical-device and human pacing acceptance remain open.

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

21 October: [Wisp action hierarchy](tasks/WISP_ACTION_HIERARCHY_001.md)
integrated via PR3/PR4. Six gates/full validation and installed Android0.2.21
upgrade passed: both saves, UID/origin, paid progression, legacy purchases,
320px cards and native Ability touch/focus retained. No publication.
[Exact build/evidence](https://github.com/xariib/Lumenfall/actions/runs/39559404175).
Physical phone/WebView60/TalkBack/human acceptance remain open; detailed hashes
and requirements remain in the linked task and historical Git revisions.

16 October 2026: combined endless-progression game released in xariib/Lumenfall as
[Android 0.2.14](https://github.com/xariib/Lumenfall/releases/tag/android-1000014), versionCode1000014.
[Download latest APK](https://github.com/xariib/Lumenfall/releases/latest/download/Lumenfall.apk); existing players install as an update without
uninstalling. [Completed migration](tasks/REPOSITORY_MIGRATION_001.md) and
[final identity/save/download evidence](qa/repository-migration-001/release/).

Released source `de1338cd` preserves both selected and destination histories.
Six exact-main workflows/both full jobs, installed Android12/API31/WebView91
upgrade and anonymous exact-byte download passed. Package/certificate/origin,
both saves, paid work and legacy purchases retained.
[Product preservation proof](qa/repository-migration-001/product-preservation.json).

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
