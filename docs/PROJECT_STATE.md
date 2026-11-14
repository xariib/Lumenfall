# Lumenfall — current delivery status

14 November: [Progressive Deeds](tasks/DEEDS_PROGRESSIVE_001.md) merged through
PR52: one advancing card per series. Its eight candidate suites/190 scenarios pass;
the final Details/focus fix passes local checks. Prior signed upgrade/updater and
Deeds touch pass. Final-source CI and Android delivery remain pending; retail
accessibility inspection is unresolved.

14 November: [Currency header](tasks/CURRENCY_HUD_001.md) is integrated;
signed preview passes; combined public APK pending.

12 November: [Rift theme redesign](tasks/RIFT_THEME_REDESIGN_001.md) released as
[Android 0.2.111](https://github.com/xariib/Lumenfall/releases/tag/android-1000111)
through PR48 at `63c63b1a`: one scene and six stronger themes replace packs;
original enemies fit their rings. All14 workflows,1,399 visual assertions and
exact saved-state replay passed. Signed upgrade/updater retained both saves
and paid work; retail launch/public bytes passed. [Full evidence](qa/rift-theme-redesign-001/README.md)
retains the first native ANR and passing unchanged retry; cause is unproven.
Physical-phone/WebView60/TalkBack/human acceptance and independent review are open.

12 November: [PR42 Forge/Lab update and full evidence](tasks/ENDLESS_FORGE_LAB_PACING_002.md)
released as [Android0.2.110](https://github.com/xariib/Lumenfall/releases/tag/android-1000110).
Tempering continues past300; eight Lab studies require earned first access,
retaining paid work. Eight workflows,220 scenarios, offline catch-up, signed
upgrade/updater, retail launch and public bytes/feed passed at `dc78daad`.
PR46 is excluded; physical-phone/WebView60/TalkBack/human acceptance is open.

12 November: [Pending proposal review](tasks/PR42_PR46_REVIEW_20261112.md)
initially kept PR42's Forge/Lab proposal open and closed PR46 without merging. The
automatic-only reset delay strongly favors repetitive manual reward farming
in the controlled comparison, contrary to the mostly-idle direction. The
underlying rapid-repeat economy issue remains open; that review changed no gameplay.

12 November: [Exploit and balance hunt](tasks/EXPLOIT_BALANCE_HUNT_001.md)
released as [Android 0.2.107](https://github.com/xariib/Lumenfall/releases/tag/android-1000107) through PR47.
It closes untrusted-action timing bypasses and a paid Lab work helper defect,
uses 10,000 combat defeats for Auto-Tap, and eases later recruitment by one Lab
level. All eight integrated workflows passed at `18e7072c`.
Signed save-preserving upgrade, in-app update, retail-image normal launch and
anonymous public APK/assets/feed verification passed. Thirty-day idle results
and [delivery evidence](qa/exploit-balance-hunt-001/README.md) are saved.
Physical-phone, exact WebView60 DOM and human pacing remain unverified; editable
local saves remain a trust boundary. PR42 was separate at that release; its later
delivery and PR46's subsequent closure are recorded above.

9 November: The [repository handoff](tasks/LOCAL_HANDOFF_20261109.md) records
the local QA evidence, Play Protect drafts and the in-progress Forge and Lab
feature checkpoint for continuing from GitHub on another computer.

On 9 November, Android 0.2.104 shipped the full debug and exponential Rift
progression update. [PR #45 task record](tasks/FULL_DEBUG_EXPONENTIAL_001.md) ·
[Android 0.2.104 release](https://github.com/xariib/Lumenfall/releases/tag/android-1000104).
Integrated source `ada037de` passed all six release checks, 190 regression
scenarios and isolated offline catch-up. The signed upgrade kept both save
slots. The public in-game feed and APK checksum were verified. The release
includes exponential Rift growth, foreground clock exploit fixes and the
offline recap fix. An Android emulator installed 0.2.104 through the in-game
updater, reopened the game and retained both saves.
[Updater test](https://github.com/xariib/Lumenfall/actions/runs/42644201970).

6 November: [Installer Open button/PR #43](tasks/UPDATE_INSTALLER_OPEN_001.md)
released as [Android 0.2.98](https://github.com/xariib/Lumenfall/releases/tag/android-1000098).
Tested source `f50415e3` passed CI, in-app update and save retention, retail
launch, and verification of the public APK and update feed. Android can offer
**Open** after updates started from this release.

5 November: [Pending-work synchronization](tasks/SYNC_PENDING_20261105.md)
recovered355 local QA files and historical task checkpoints, and integrated the
19 October baseline-audit PR2. Historical reports retain their original source
and pending/failure states. The app assets and native source matched
Android0.2.95 at that checkpoint.

5 November: [Windows Wisp assertion/PR41](tasks/WINDOWS_WISP_SCROLL_001.md)
fixed and merged at 87e58545; tested source ff790151 and identical merge tree.
The test now waits for the tab entrance animation. Windows/Linux Wisp 3,277 checks,
five controls and all eight workflows, 190+1 cases and smoke PASS. Gameplay,
saves, assets and APK unchanged. [Evidence](qa/windows-wisp-scroll-001/README.md).
The [original debug report](qa/perfect-debug-20261105/README.md) remains historical;
temporary cleanup still returned "blocked by policy", with exact paths recorded.

5 November: [Play Protect investigation/PR39](tasks/PLAY_PROTECT_001.md) complete,
released as [Android0.2.95](https://github.com/xariib/Lumenfall/releases/tag/android-1000095). Integrated
at12551152 (tested source4982932a; identical trees). Patched Capacitor6.2.2 and
production APK/debugger protections. Signed0.2.95, seven CI gates,190+1 cases,
save upgrade, updater and retail Android visible-launch checks PASS.
[Evidence and review draft](qa/play-protect-001/README.md). A user phone screenshot
now shows Google's "This app looks safe" result; the user confirms it came from
the0.2.95 ZIP. That exact APK is now stable: all six integrated-main release gates
at4f9c9637 and anonymous versioned/latest downloads, checksum and updater metadata
PASS. [Public receipt](qa/play-protect-001/release-1000095/public-release-verification.json).
No appeal needed for this positive result; future Google verdicts are external.

4 November: [All pending updates/PR38](tasks/ALL_UPDATES_RELEASE_20261104.md)
released as [Android0.2.91](https://github.com/xariib/Lumenfall/releases/tag/android-1000091),
source237fa928. Includes PR36 Rift health/navigation/layout and PR37 reduced
rendering/background work plus the native updater race fix. Seven PR/six release
gates,190+1 scenarios, signed upgrade/updater and public bytes/feed PASS.
[Receipt](qa/all-updates-release-20261104/release.json). Phone battery/thermal,
exact WebView60, TalkBack and human review remain open.

4 November: [Rift visuals/PR35](tasks/RIFT_VISUAL_UNLOCKS_001.md) released as
Android0.2.82, source278bb669: backgrounds, Wisp/enemy looks, clearer attacks and
gold dot. Seven gates, full regression, signed upgrade/public bytes PASS.
[Receipt](qa/rift-visual-unlocks-001/release.json); phone/human review open.

4 November: [Lab timers/PR34](tasks/LAB_TIMER_LAYOUT_001.md): merged57fd7ab3;
seven gates/190+1 and signed0.2.76 PASS. Included in0.2.82 above; phone review open.

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

[Earlier delivery records and evidence](PROJECT_STATE_2026-11-04_HISTORY.md)
retain the complete 16–31 October history, original requirements and limitations.

Physical-phone, exact WebView60 DOM, TalkBack and human pacing/performance acceptance
remain unverified. The available emulator test uses archived signed158 and synthetic
saves; no particular old version is required on the user's phone. Historical
pre-import Git objects unavailable404 remain a limitation. [Known issues](project/KNOWN_ISSUES.md).

Historical19 October2026 [product audit](tasks/PRODUCT_BASELINE_AUDIT_001.md)
describes Android0.2.14. Its findings and recommendations require reassessment
against current main before implementation; this sync does not start those tasks.
