# Full local debugging

13 October 2026. User requests debugging and fixing current UI, gameplay and
other game issues. Same owner chat; no agents. Preserve established gameplay
rules, purchase/save value, currencies, assets and Android signing identity.

Baseline: local development after status assessment; game SHA-256
`42b180adfb9f59268bbcadc6b0abc907317c138768caf82835ceeb73e2689e5c`.
GitHub unavailable because the user's account is flagged. Local commits and
source-bound evidence are the durable working record until access returns.

Acceptance: reproduce baseline failures across existing full and scoped suites,
inspect current-source UI and gameplay, repair confirmed defects with relevant
regression/causal coverage, rerun affected suites and review the complete diff.
Record unsupported Android/device checks explicitly; no claim of zero unknown
bugs or physical acceptance from a modern desktop browser.

## Reported issues and verified fixes

User plays APK 0.1.159. They report that entering Ascend leaves its notification
behind the active icon, and claiming quests from the top scrolls to the next one.
Both defects were reproduced against the imported source before editing.

Ascend now acknowledges an eligible notification when visited. Subsequent
renders/navigation keep it cleared until eligibility resets. This is transient
UI state; no save fields or progression rules changed.

Daily claims now retain focus in the same quest row and preserve main's scroll
position, including the periodic refresh after claiming. A disabled Claim moves
focus to its own quest title, so repeated Enter cannot claim the next quest.
Ordinary and unlocked Rest Stop/Refresh layouts are covered.

Current product SHA-256:
`b3eca6661042a7245100d9dcd0a6fbbb2e38a01e99b305102b5307abb52db7a9`.
[Saved focused evidence](../qa/local-full-debug-2026-10-13/README.md).
The positive regression passes 1081 checks across 12 viewport/text/motion
profiles, 144 touch/keyboard claims, and complete other-save-field comparisons.
Two actual source mutations fail their precise causal assertions. The new
positive and controls are included in pre-merge CI; remote CI was not run.

Four independent one-second eight-hour offline windows were regenerated from
the current bytes. All four final gameplay-state hashes match the old reference;
only its source identity changed. Historical reference remains in local Git.

## Broad validation and unresolved checks

Initial full browser run completed 182 distinct scenarios / 212 executions:
176 scenarios passed (206 executions), six failed. Main staged product was the
imported 42b180ad source; some standalone native drivers read the working root
after edits, so this is diagnostic baseline evidence, not final-head acceptance.
Failed cases: offline-catchup-core deadline, four Rift native touch-scroll
variants, and ascend-prisms-contract transport deadline. No assertion or deadline
was relaxed. The current-source offline gate subsequently passes under its
unchanged 300-second deadline.

Current-source VM checks: 17/18 PASS. The one failure is the POSIX tooling suite's
symlink permission requirement on Windows, not an observed game defect. Current
actual V8 6.0 runtime: all eight suites PASS, including Wisp preservation.
Scoped initial UI: Lab, Forge, Tree, shared layout, prices and refunds PASS.
Wisp UI assertions passed but its old cleanup raced browser shutdown; clean
close/profile cleanup is fixed and the complete current-source rerun passes.

Comet and Rift raw-CDP touch scrolling initially failed on Windows Chrome 140 and 151.
Captured game input-blocking flags are false; final events are not cancelled;
no game scroll-position writes occur during the gesture. The same game screens
scroll under an independent Playwright driver, and the saved CSS/DOM scrolls
without game scripts. These observations do not establish a game or browser
root cause on their own. The verified repair initializes automation plus the
Runtime and DOM agents before input. No game scrolling code or assertions changed.
Final actual Comet suite passes12738 checks/12 profiles/10 causal controls, and
all four formerly failing Rift native variants pass on current source. Earlier
unsuccessful flag/timer experiments were not retained; their evidence remains.

The Prism contract still exceeds the unchanged25-second transport gate. Separate
120/300-second diagnostics also timed out and are not acceptance passes. Debugger
samples show ongoing full-menu rendering through its synthetic matrix, not one
fixed stopped instruction. No timeout was extended in the committed harness.
Resolve its execution cost/transport before claiming final full-suite acceptance.

Chromium is isolated under sibling `work/browsers/`; the official Node8.3 runtime
was SHA-256 verified and used only for old-engine tests. All detailed raw logs,
diagnostics and screenshots remain under sibling `work/full-debug/`. Automated
offline UI output formerly overwrote historical screenshots; new output is now
isolated, generated pictures were preserved externally, originals restored.

## Continuation / status OPEN

Next: reconcile the Prism-contract deadline,
then complete a final-source full/scoped run and review any actual assertions
that fail. Preserve all existing gates, source-labelled failures and paid value.
Native installed APK, physical phone, exact WebView60 and TalkBack acceptance
remain unavailable/unverified. The user supplied an app version, not device/OS
details. No APK, signing changes, remote writes or release occurred.
GitHub access must return before CI/integration/push; transfer local changes
onto the repository's existing history, never force-push the import baseline.
This is verified local progress, not a fully debugged or release-accepted game.
