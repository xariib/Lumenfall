# Lumenfall — current delivery status

[Repository cleanup and release readiness](tasks/REPOSITORY_READINESS_001.md)
records a 146,646-byte reduction in the unpublished signed Android candidate, the build dependency audit and the checks
required by the APK publisher. Public game releases are recorded separately below.

[Game quality audit](tasks/GAME_QUALITY_20261128.md) shipped as [Android 0.2.179](https://github.com/xariib/Lumenfall/releases/tag/android-1000179) through PR #76 at d0340052. Short screens now fit the full Rift party, boss and Comet Trial. Rapid Guardian input follows the rolling tap cap, Forge controls recover after clock changes, and Settings reports storage failures while keeping saves recoverable. All eight PR and nine exact-commit workflows passed. The signed Android upgrade preserved both saves and paid progress. Physical-phone, TalkBack and exact WebView 60 checks remain open. [Public verification](qa/game-quality-20261128/android-public.json).

[Wisp ability pacing](tasks/WISP_ABILITY_PACING_001.md) shipped as
[Android 0.2.171](https://github.com/xariib/Lumenfall/releases/tag/android-1000171)
through PR #75 at `09b87e84`. Ability levels 16–17 require Epic, 18–19 require
Legendary, and 20 requires Mythic. Those five levels cost 2×, 4×, 8×, 16× and
32× the previous prices. The cap is 20 and all paid ranks carry over. Eight PR
and nine exact-commit workflows passed. The signed emulator upgrade retained
both saves and paid progress. In-app update, retail launch and anonymous APK
checks passed. [Public verification](qa/wisp-ability-pacing-001/android-public.json).
Physical-phone, exact WebView60, TalkBack and human pacing remain unverified.

[Wisps and Workshop menu cleanup](tasks/MENU_CLEANUP_001.md) shipped as
[Android 0.2.169](https://github.com/xariib/Lumenfall/releases/tag/android-1000169)
through PRs #71, #73, and #74 at `52f49177`. The five marked panels and
strip are gone, the Wisps tab has its new label, and Rift uses the shared
Lumenfall wordmark. Returning to a remembered menu bottom follows late
layout changes until the player interacts. All eight PR and nine
exact-commit workflows passed. The signed emulator upgrade preserved
both saves and paid Lab work. In-app updater, retail launch, and anonymous
APK verification passed. [Public receipt](qa/menu-cleanup-001/android-public.json).
Physical-phone, exact WebView60, and TalkBack checks remain open.

[Wisp roster refresh](tasks/WISP_LIVE_ROSTER_001.md) shipped as
[Android 0.2.159](https://github.com/xariib/Lumenfall/releases/tag/android-1000159)
from PR #70 at `c4686746`. Ordinary combat updates the existing cards while
recruitment, upgrade gates, and Auto-Empower controls still refresh when earned.
In the matched Farm 21 browser workload, live roster rebuilds fell from six to
zero and DOM mutations from 3,673 to 937. All nine integrated workflows, signed
Android emulator acceptance, and anonymous APK verification passed.
[Delivery evidence](qa/wisp-live-roster-001/android-0.2.159-verification.json).
Physical-phone battery, heat, handling, TalkBack, and exact WebView60 acceptance
remain open.

[Workshop funding and milestone bosses](tasks/PROGRESSION_BALANCE_001.md)
shipped as [Android 0.2.156](https://github.com/xariib/Lumenfall/releases/tag/android-1000156)
from PR #69 at `52871909`. A developed Rift 10,001 forecast finished
all 48 Workshop tracks in 1,020 days. Rifts 1,500 and 2,500 held after a
one-hour Farm replay and cleared after longer investment in the paired
test. All nine integrated workflows, signed Android upgrade, paid save
retention, updater, retail launch and anonymous APK verification passed.
[Balance report](qa/progression-balance-001/README.md) ·
[Release evidence](qa/progression-balance-001/android-0.2.156-verification.json).
Physical-phone, TalkBack, and exact WebView60 acceptance remain open.

[Workshop and Mastery simulation](tasks/WORKSHOP_MASTERY_SIMULATION_001.md) on
Android 0.2.153. The funded Lab schedule takes 1,102 days at 8×. The deep seeded
Rift 60,001 scenario finishes its remaining Workshop on day 974 after prior
Mastery investment. Prisms limited the next paid rank in the late-Mastery
replay. [Full report and per-track results](qa/workshop-mastery-simulation-001/README.md).

22 November: [Wisp Rift display and Formation tabs](tasks/WISP_RIFT_DISPLAY_001.md)
shipped as [Android 0.2.153](https://github.com/xariib/Lumenfall/releases/tag/android-1000153).
Support readiness follows charge and recast timing, the Rift Wisp damage total
reflects live Support, and Wisps has a separate Formation & Bonds tab. Eight PR
and nine exact-main workflows passed. Signed Android 12 upgrade, both saves,
updater, retail launch, and anonymous APK verification passed.
[Delivery evidence](qa/wisp-rift-display-001/android-0.2.153-verification.json).
Physical-phone, TalkBack, and exact WebView60 acceptance remain open.

22 November: [Forge and Android Back/PR66](tasks/FORGE_PROGRESS_AND_ANDROID_BACK_001.md) shipped0.2.152.
Nine gates/native/feed PASS; phone/Google open.

17 November: [Upgrade presentation/PR61](tasks/UPGRADE_STATES_001.md) shipped as
[Android0.2.138](https://github.com/xariib/Lumenfall/releases/tag/android-1000138),
source e6139c98: all maxed upgrades gold, prerequisite locks explain unlocks
instead of prices, each missing currency red with purchase disabled. Newer
Forge/Rift work retained. All nine exact-main workflows/190+1 scenarios,15,438
upgrade UI checks, native controls, stable signing, save/updater/retail acceptance
and anonymous APK/assets/feed PASS. Earlier failures remain recorded.
[Delivery evidence](qa/upgrade-states-001/android-0.2.138/public-verification.json).
Physical-phone/WebView60/TalkBack acceptance stays open; self-review only.

17 November: [Rift screen fixes/PR60](tasks/RIFT_SCREEN_FIXES_001.md) integrated
at12122b80; [Android0.2.136](https://github.com/xariib/Lumenfall/releases/tag/android-1000136)
published/verified. Removes hints, Farm left/Push right, opaque arena and isolated
enemy layer; retains newer main/PR59.666 mobile checks/five controls, four paired8h
replays, six required exact-SHA release workflows/190+1 scenarios, signed save
upgrade/updater/retail and anonymous APK/assets/feed PASS. All eight PR workflows
also PASS; physical-phone/WebView60/TalkBack/human review stays open. Self-review
only. [Evidence](qa/rift-screen-fixes-001/README.md); chat remains open.
[Full pre-feature status snapshot](PROJECT_STATE_2026-11-17_RIFT_BASELINE.md) is intact.
The previously reported rapid-repeat economy finding remains open; no economy
fix is introduced by this Rift presentation task.

17 November: [Finite Forge/PR59](tasks/FORGE_YEARS_001.md) shipped as
[Android 0.2.135](https://github.com/xariib/Lumenfall/releases/tag/android-1000135), source `0adb60eb`.
Tempering caps are 375/325/315; Masterwork remains 500 with attainable future
prices. Paid above-cap effects stay. A mature reinvestment reference finishes
in 994 productive days; this is a model, not a fresh-account calendar guarantee.
All eight PR workflows PASS, including 190 main +1 isolated offline scenarios.
The integrated tree exactly matches the tested candidate. All nine exact integrated
workflows PASS, including 190 main +1 isolated offline scenarios. Signed save
upgrade, actual updater, normal retail Android12 launch and anonymous public
APK/assets/feed verification PASS. [Evidence](qa/forge-years-001/delivery.json)
retains original failures and passing unchanged retries. Self-review only;
physical phone, exact WebView60 DOM, TalkBack and actual-account calendar pacing
remain open. Owner task/chat stays open; the model is not a calendar guarantee.

17 November: [Standing authorization](tasks/STANDING_AUTHORIZATION_001.md) records
the user instruction, "Never ask for permissions again for Lumenfall project."
Current entrypoints explicitly prohibit permission or renewed approval requests
within assigned Lumenfall work; missing requirements can still be clarified.

17 November: [Year-earned Support/PR62](tasks/TEAM_PROGRESSION_001.md)
released as [Android0.2.139](https://github.com/xariib/Lumenfall/releases/tag/android-1000139),
sourceceb2463f. Support3s active/10s off; EnduranceVIII plus Charge
can sustain after at least360 fastest dedicated research days. Paid progress
and concurrent updates stay. Eight PR/nine integrated gates,190+1 each,
signed upgrade/updater/retail and anonymous APK checks PASS.
[Evidence](qa/team-progression-001/support-year/delivery.json). Self-review only;
phone/exact WebView60 DOM/TalkBack/human pacing and owner chat remain open.

17 November: [Team progression/PR58](tasks/TEAM_PROGRESSION_001.md),
[Android0.2.130](https://github.com/xariib/Lumenfall/releases/tag/android-1000130):
shared Wisp DPS, manual higher-record Ascension and the retirement refund.
Its initial Support timing is superseded above. [Full prior status](qa/team-progression-001/support-year/pre-integration-main-state.md).

16 November: [Support duration/PR57](tasks/SUPPORT_DURATION_001.md) shipped as
[Android0.2.128](https://github.com/xariib/Lumenfall/releases/tag/android-1000128),
source`f16ffd9b`. Tide/Aurora start at3s; earned Support Endurance grows to6s.
Each source can sustain its buff after at least90 dedicated research days at
continuous8x/all work reductions, with sufficient Charge Rate. Nine integrated
workflows PASS; PR and integrated full suites each prove190 main +1 isolated
offline scenarios. Signed save upgrade, actual updater, retail Android12 launch
and anonymous public APK/assets/feed PASS. [Evidence](qa/support-duration-001/README.md)
retains initial failures and unchanged retries. Self-review only; physical-phone,
exact WebView60 DOM, TalkBack and human pacing acceptance remain open.

15 November: [Mobile menu corrections](tasks/MOBILE_MENU_CORRECTIONS_001.md)
shipped as [Android 0.2.127](https://github.com/xariib/Lumenfall/releases/tag/android-1000127), source37ca26df through PR54/55/56.
Removes Rift theme/Bond captions and Deed milestone history; shows six currency
names; compacts Lab Queue/progress/Speed Up controls; remembers each menu's
offset/bottom, including separate Forge/Lab. All16 exact-source workflows pass;
both full suites prove190 main +1 isolated offline scenarios each. Signed upgrade,
actual updater and retail launch retain both saves/paid work; real positive menu
scroll ranges and anonymous public APK/assets/feed verification pass.
[Evidence](qa/mobile-menu-corrections-001/README.md). First failures and passing
retries retained. Self-review only; physical-phone/exact WebView60/TalkBack/human
acceptance remain open. This supersedes earlier presentation acceptance.

[Earlier delivery entries with later corrections](PROJECT_STATE_2026-11-17_HISTORY.md)
retain the complete 12–14 November receipts and acceptance limitations.

[14–12 November release checkpoints](PROJECT_STATE_2026-11-17_RELEASE_HISTORY.md)
preserve the earlier versions, evidence, first failures and limitations.

[Earlier delivery records through14 November](PROJECT_STATE_2026-11-14_HISTORY.md)
preserve all prior release versions, hashes, receipts, first failures and known
limitations, including PR42/Android0.2.110, the closed PR46 proposal, exploit
fixes/Android0.2.107 and preceding deliveries.
[October history](PROJECT_STATE_2026-11-04_HISTORY.md) retains earlier records.

Physical-phone, exact WebView60 DOM, TalkBack and human pacing/performance acceptance
remain unverified. The available emulator test uses archived signed158 and synthetic
saves; no particular old version is required on the user's phone. Historical
pre-import Git objects unavailable404 remain a limitation. [Known issues](project/KNOWN_ISSUES.md).

Historical19 October2026 [product audit](tasks/PRODUCT_BASELINE_AUDIT_001.md)
describes Android0.2.14. Its findings and recommendations require reassessment
against current main before implementation; this sync does not start those tasks.

## Agent workflow

[Codex startup and continuation](tasks/CODEX_STARTUP_001.md) records the shorter
startup path, the measured context reduction and the verification status.
