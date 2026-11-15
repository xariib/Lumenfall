# Mobile menu corrections evidence

Final product SHA256: `ff13eee2a0891a02e0bb8dc2681ac0d3be88ac14c9ec5abb1c73d0e83b919da7`.
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
