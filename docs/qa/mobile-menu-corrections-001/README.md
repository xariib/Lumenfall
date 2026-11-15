# Mobile menu corrections evidence

Current product SHA256: `f7008f0e1b7d09af02552e0325446a53d5fd40a91639e4ddc64d9410eb973c51`.
Earlier source `a7d991eb` receipts remain labeled with their exact bytes below.
Node24.22.1, Brave Chromium157.0.8103.79 on Windows. Self-review/automated checks.

Run `node scripts/qa/check-mobile-menu-corrections.cjs <mode>`; modes include
menus, simple, slots, deeds-ui, core, rift, navigation and scroll-control.
The existing premerge --simple entrypoint also runs the new menu checks, keeping
its18 original selection profiles separate from12 additional menu profiles.
Workflows, acceptance assertions and time limits have not been weakened.

Current receipts: *.stdout.txt/*.stderr.txt, visual/receipt.json,
cosmetics/results.json and raw/ native-harness output. Screenshots include normal
and200% Lab timers, visual currency/navigation and all Rift theme appearances.
The paired four8h replay makes115,200 independent1s calls per source. Every saved
field matches released main6fd9e44f except exactly the independently enumerated
approved PR55 Comet increases; original canonical endpoints also pass. The golden
reference changes only its bound source hash from the corrected Deeds baseline.

Baseline native-browser check (combined existing PR54/55 code, before this task)
failed at “Rift omits theme text and Formation Bond names”. The restricted Windows
sandbox first closed the browser before any checks; outside-sandbox execution
reproduced the intended assertion. A scroll-reset source mutation fails at
“return restores independent offset for spirits”, as intended.

Initial current-source failures were retained or described with exact diagnostics:
- Enlarged Queue icon52.2px vs44px Speed Up; fixed by keeping icon22px while timer
  text enlarges/reflows. Product hash before fix c7a7e05f.
- Rift native input: “touch target visible before action” after Workshop returned
  at bottom. The fixture now reveals only its subsection header before native
  touch; reaching final menu controls still uses real swipes without assistance.
- Deeds focus: open Details remained true but active element was daily-claim.
  The live-tick test had presented a genuine daily reward. The fixture completes
  that modal using its existing Continue action before independent focus checks.
  No production daily or focus code changed. Deeds688 checks/18 profiles now pass.
- Original Rift layout expected two currency rows at every width. PR54's visible
  names deliberately use two columns/three rows up to380px; the assertion now
  checks that exact responsive rule. Original failing raw files are retained.
- Windows dump-DOM Rift contract hit25s without a result. Existing pipe transport
  passes the same assertions/deadline; no test timing or production fix follows.

earlier-runs/ preserves overwritten rerun receipts from the point retention was
added. The first two failed focus outputs preceded this retention; their exact
assertion/active-element diagnostic is recorded above rather than claiming raw
files exist. The task remains open for CI, integrated/native/public delivery and
physical-phone/WebView60/TalkBack/human acceptance.

Final screenshot review found the existing120px research-title minimum allowed
long words to overlap the level badge at200% text. The title now uses its real
minimum text width and wraps the badge onto the next row when needed. Current
simple.stdout.txt passes716 checks:18 original selection profiles plus12 menu
profiles, including explicit unclipped Lab headings. Current core/clarity and
paired replay pass on b6fa2165; final screenshots are lab/compact-lab-*.png.
Root compact-lab images and other a7d991eb receipts are historical.
The55a36c16 validation/native runs were recorded and stopped as superseded,
without publication; they do not establish final-source acceptance.

Detailed0.2.122 native audit found all five scroll ranges were zero, so that
candidate's installedMenuScroll PASS is vacuous and is not feature acceptance.
The WebView91 container lacked a100vh height fallback for unsupported100dvh.
Removing dvh declarations reproduces “scrollable fixture for spirits”. The final
two-line CSS fallback fixes that. simple.stdout.txt now retains716 modern checks
plus374 legacy checks/12profiles; viewport-control deliberately removes the
fallback and fails the same positive-range assertion. Core/clarity and the full
paired replay pass again on ff13eee2. Existing --simple CI also requires the
legacy viewport matrix. Native acceptance now requires the intended active panel,
a positive actual range and nonzero bottom before testing restoration. External
candidate/public verification independently enforces those receipt preconditions.
Original0.2.122 artifacts remain preserved as historical data, not a final APK.

3130e62d's next native run43688663000 has real ranges but fails restored Wisps
bottom. Its original32 artifact files/log are retained; precise native ordering
cause is unproven. Current local touch+legacy matrix passes398 checks/12profiles
and reproduces a missing post-entry restoration using layout growth during entry.
Game restoration now repeats on that panel's animationend and cancels on new
user input/navigation. simple.stdout.txt passes740 modern checks plus398 legacy;
settle-control, reset-control and fallback-control catch their intended defects.
Paired replay passes currentf7008f0e. The next native script saves partial numeric
scroll/focus/input evidence before assertions. This remains pending native/CI
acceptance and is not a public release.

313bdd47 native attempt1 finally verifies positive restored bottoms in all5menus
and all6 currency names; native-scroll-proof-313bdd47.json summarizes exact ranges.
Its final retail UIAutomator idle/visible-controls gate failed despite a visually
running game. Original37 files are retained under native-first-failure-43695984950.
An unchanged retry is required; self-review does not replace that gate. The Linux
Wisp manual run's touch timeout (101 checks/16 profiles) is retained with its full
artifact; unchanged failed-job retry passed. Source remains fixed for final CI.

Retail attempt2 failed the same global-idle capture, while its native five-menu
scroll/save/updater checks passed. Original37 files are separately preserved in
native-failure-attempt2-43695984950/ and first-failure-*-attempt2.*. No third blind
retry. The test-only LiveUiSnapshot observer uses the same Android31 shell bridge
and XML dumper without waiting for the animated game to become globally idle.
The launch deadline stays120s; both enabled/clickable/on-screen Wisps and Rift
buttons are now required. Negative loading, stale, wrong-package, disabled,
noninteractive and clipped trees are rejected by tests/tooling/apk-security.cjs.
All retail identity/debugger/private-storage/exact-byte gates remain. Nothing
changes in index.html or the production APK. Actual observer compilation/retail
capture is pending a new exact-source candidate; old failures remain historical.
AOSP references: [DumpCommand](https://android.googlesource.com/platform/prebuilts/fullsdk/sources/android-29/+/refs/heads/main/com/android/commands/uiautomator/DumpCommand.java),
[the same shell bridge](https://android.googlesource.com/platform/prebuilts/fullsdk/sources/android-30/+/refs/heads/androidx-room-release/com/android/uiautomator/core/UiAutomationShellWrapper.java).

62126af7 signed nonpublishing0.2.125 candidate43698948404 now passes EVERY build,
upgrade/updater and retail gate. android-candidate/verification.json is current;
old0.2.122 receipts remain historical in Git. All five native scroll ranges are
positive and restore their actual bottoms; six currency names fit. The shell-only
live accessibility capture compiled and ran successfully; actual retail XML is
retained and independently checked for enabled/clickable/on-screen Wisps and Rift.
Production image/package/debugger/private-storage/byte gates also pass. Screenshots
self-reviewed; physical phone/WebView60/TalkBack/human acceptance remain open.
Manual Wisp43698927035 failed focus-mutation setup after1 check (300ms layout
settlement), before its intended failure. PR and Windows copies pass. Original
JSON/logs are retained in failure-artifact-43698927035-attempt1/. Failed-job-only
unchanged retry active; no assertion/deadline relaxed. Full PR/manual suites active.

Wisp43698927035 unchanged failed-job retry passed;14/16 workflows complete.
Final two full suites remain; no public APK yet.

Full62126af7 suites both finish with only the two reduced-motion Rift native
fixtures failing; original PR/manual logs are retained. Local unchanged traced
fixture reproduces at dense Forge after15.163s (earlier-runs/ retains stdout).
Waiting for entry animation/frames before its artificial subsection-header reveal
fixes that reproduced path; no game code changes. Explicit active-panel/selected
subtab diagnostics replace the former undefined-control TypeError. A first added
diagnostic checked the wrong CSS attribute and failed; fixed to actual aria-selected,
with its raw failed output retained. Correct reduced-motion3profiles/12states PASS
in101.145s. Remaining variants/complete new-source CI remain pending. Native swipes,
first Rift frame, assertions and300s/15s deadlines remain unchanged.

Final fixture follow-up: all4 native variants PASS, each3profiles/12states.
normal104.519s, reduced101.145s, stacked normal104.087s, stacked reduced102.317s.
No game bytes or command/scenario deadline changes. New-source full CI pending.

Final validated ref is37ca26dfaf4668b1950e789ed1d191649ee4b9a2; manual full
43706287783 and native43706308245 run alongside all required PR/manual workflows.
Source fixed; main8747ee60; no public APK yet. All4 local native variants are
independently summarized with hashes in rift-fixture-followup-verification.json.
