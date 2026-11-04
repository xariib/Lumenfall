# Lumenfall — current delivery status

4 November: [Rift visuals/PR35](tasks/RIFT_VISUAL_UNLOCKS_001.md): full backgrounds,
Wisp/enemy appearances, clearer attacks and gold nav dot. Local checks/parity PASS;
CI, integration and Android delivery pending. Device limits remain open.

2 November: [In-app updates/PR 33](tasks/IN_APP_UPDATES_001.md) released as
[Android 0.2.75](https://github.com/xariib/Lumenfall/releases/tag/android-1000075),
source e13c7669. Automatic checks, verified downloads and Android approval. Seven
exact-source gates/190+1, signed upgrade, actual updater/tamper/cancel tests and
anonymous exact-byte downloads PASS. [Receipt](qa/in-app-updates-001/release.json).
Both saves/paid work retained; phone/WebView 60/TalkBack/human review remain open.

31 October: [All updates](tasks/ALL_UPDATES_RELEASE_20261031.md) published as
[Android0.2.69](https://github.com/xariib/Lumenfall/releases/tag/android-1000069).
Seven gates/190+1, signed upgrade and public bytes PASS.
[Receipt](qa/all-updates-release-20261031/release.json); device/human review open.

31 October: [Lab Speed Up design/PR32](tasks/LAB_SPEED_DESIGN_001.md): merged b7371ced. Seven gates/190+1 scenarios and signed0.2.68 upgrade PASS. [Evidence](qa/lab-speed-design-001/delivery.json). Phone/WebView60/TalkBack review open.

31 October: [Ritual challenges/PR31](tasks/AUTO_ASCEND_CHALLENGES_001.md) merged3f74661b; existing owners retained. Seven gates/190+1 scenarios and signed0.2.65 upgrade PASS. [Receipt](qa/auto-ascend-challenges-001/ci-final.json). No release.

30 October: [Tap balance/PR29](tasks/TAP_EARLY_BALANCE_001.md): base20+2% party power. Seven gates/190+1 scenarios and signed0.2.64 upgrade PASS. [Receipt](qa/tap-early-balance-001/delivery.json).

30 October: [Direct Rift navigation](tasks/RIFT_NAVIGATION_001.md),
[PR30](https://github.com/xariib/Lumenfall/pull/30) merged at90c20a26:
previous/next/−10 replace the Farm chooser. Seven gates,190 scenarios and signed
Android0.2.62/native upgrade PASS. Phone/WebView60/TalkBack acceptance open.

30 October: [Lab/Deeds PR28](tasks/LAB_OFFLINE_DEED_PACING_001.md): merged; signed0.2.59 test APK. Seven gates/upgrade PASS; phone acceptance open.

30 October: [Combined update/PR27](tasks/ALL_PENDING_APK_001.md): Android0.2.58 released.
Required CI,190 scenarios, signed upgrade and public bytes PASS.
[Release receipt](qa/all-pending-apk-001/release.json).

29 October: [Workshop audit/PR21](tasks/FULL_GAME_WORKSHOP_AUDIT_001.md),
[Android0.2.55](https://github.com/xariib/Lumenfall/releases/tag/android-1000055),
`ecf88e35`: Seven gates,189+1 scenarios, signed installed
upgrade/public bytes PASS. [Receipt](qa/full-game-workshop-audit-001/release.json).

28 October: [Lab boosts/PR18](tasks/LAB_BOOST_QUEUE_001.md),
[Android0.2.52](https://github.com/xariib/Lumenfall/releases/tag/android-1000052):
seven gates,189+1 scenarios, signed upgrade/public bytes PASS; saves/paid work
retained. [Evidence](qa/lab-boost-queue-001/release.json).
Phone/WebView60/TalkBack/pacing open; full mechanics/provenance in the task.

28 October: [Android0.2.51/PR15–17](tasks/GAME_CHECK_APK_RELEASE_001.md),
`d3420c15`: seven gates,189+1 scenarios, signed upgrade/public bytes PASS.
[Evidence](qa/game-check-apk-release-001/release.json).
Saves/paid work retained; phone/WebView60/TalkBack/pacing open.

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

26 October: [Workshop/card clarity/PR13](tasks/WORKSHOP_CARD_CLARITY_001.md)
merged bba2db5e and released [Android0.2.43](https://github.com/xariib/Lumenfall/releases/tag/android-1000043):
five Lab slots/catalogue, retained paid work with Queue OFF, concise cards,
76 Deeds and Comet commands moved to Deeds. Six exact-main workflows,
189+1 scenarios, signed upgrade/native Wisp/Farm input and public-byte checks
PASS; saves, UID/origin and legacy entitlements retained.
[Evidence](qa/workshop-card-clarity-001/release.json).

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

24 October: [Android delivery](tasks/ANDROID_TEST_RELEASE_001.md): authorized
Wisp/Farm/hint test release and README; no product edits. Exact release/checks:
[PR8](https://github.com/xariib/Lumenfall/pull/8).

24 October: [Hint readability/PR7](tasks/RIFT_HINT_READABILITY_002.md) integrated
88d9bdd3; the short Farm hint opens complete advice without changing combat or
purchases. Six workflows/both full jobs,18 mobile profiles, causal controls,
original layouts and smoke PASS; automated review had no findings, tested tree
0d7937a retained. [Non-publishing Android29](https://github.com/xariib/Lumenfall/actions/runs/40076467803)
PASS on6de1789b: signing/package/assets/origin, both saves/paid work/legacy
entitlements and native Wisp/hint-to-Lab input retained. No release; environment
interruption resolved. The [earlier VFX finding](tasks/RIFT_VFX_OVERFLOW_001.md)
remains open despite its unchanged gate passing. Phone acceptance remains open.

22 October: [Farm acceptance/PR6](tasks/MIDGAME_FARM_ACCEPT_001.md), `83b1a8e`:
six gates/18 browser profiles and [signed0.2.25 upgrade](https://github.com/xariib/Lumenfall/actions/runs/39870276892)
PASS on API31/WebView91, retaining both saves/paid work/identity and hint-to-Lab
input. No publication; device/human review open. Task retains earlier failures;
200%-text readability addressed in RIFT_HINT_READABILITY_002 above.

21 October: [Wisp hierarchy/PR3–4](tasks/WISP_ACTION_HIERARCHY_001.md): six gates,
signed0.2.21 upgrade, save/paid-work preservation and native Ability input PASS.
[Build/evidence](https://github.com/xariib/Lumenfall/actions/runs/39559404175).
No publication; device/human acceptance open.

16 October: [Endless Android0.2.14](https://github.com/xariib/Lumenfall/releases/tag/android-1000014),
`de1338cd`/1000014: six gates, signed API31/WebView91 upgrade and public bytes PASS.
Both histories, saves, paid work, legacy purchases and identity retained.
[Download latest APK](https://github.com/xariib/Lumenfall/releases/latest/download/Lumenfall.apk); existing players install as an update without
uninstalling. [Completed migration](tasks/REPOSITORY_MIGRATION_001.md) and
[final identity/save/download evidence](qa/repository-migration-001/release/).
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
