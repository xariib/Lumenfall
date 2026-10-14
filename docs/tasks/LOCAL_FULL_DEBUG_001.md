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

The earlier Prism contract exceeded25s; its120/300s diagnostics also timed out.
Debugger samples showed ongoing full-menu rendering, not a stopped instruction.
No committed deadline changed. The14 October receipts below supersede those
diagnostics, while required gate acceptance remains open.

Earlier raw logs/screens remain in sibling `work/full-debug/`; isolated Chromium
is under `work/browsers/`. Official Node8.3 bytes were SHA-256 verified. Current
offline pictures use isolated output directories; historical originals are intact.

## Continuation / status OPEN

### 14 October 2026 renewed full-debug request

User: “Work locally in [this checkout]. Do a FULL DEBUG of the game”. Continue
this task locally without agents, push or release actions. Clean baseline `8630555` on
`local/full-debug`, including all seven local improvements. Product SHA-256
`509b2dcb98f45207d4b9125cbf39f194adcb58e05690381d306352c733b0b050`.
Current combined acceptance is pending. Investigate the existing Prism contract
deadline first; run full behavioral, numerical/save/offline, focused mobile and
legacy-engine checks against final bytes. Modern browser launch requires leaving
the restricted Windows sandbox. Initial sandbox launch exited before game load;
this is environment evidence, not a game assertion. Save new receipts under
`docs/qa/local-full-debug-2026-10-14/`, raw outputs under
`validation-evidence/full-debug-2026-10-14/`. Preserve earlier receipts unchanged.

[Current debugging findings](../qa/local-full-debug-2026-10-14/README.md): strict
approved-cap/Wisp completion-focus expectations repaired; Resonate version launch
hang fixed and registered PASS. Tree mobile26660/12 profiles and both causal
viewport controls PASS after targeting the current shared compensation helper.
Four independent8h oracle phases regenerated; every phase hash/reward is identical
to the old reference, so only the source stamp changed. Legacy8/8 and guarded
startup PASS. Full186-scenario run ended;22+17 defect controls PASS. Timed-out
Wisp/Rift/offline/Prism gates and missing Guidance baseline/Windows POSIX tooling
remain unresolved. Product bytes unchanged; isolated render experiments are
diagnostics only. Continue from raw summaries, not previous intermediate counts.

Next: restore baseline/CI access, rerun required Linux gates and native acceptance.
Preserve all existing gates, source-labelled failures and paid value.
Native installed APK, physical phone, exact WebView60 and TalkBack acceptance
remain unavailable/unverified. The user supplied an app version, not device/OS
details. No APK, signing changes, remote writes or release occurred.
GitHub access must return before CI/integration/push; transfer local changes
onto the repository's existing history, never force-push the import baseline.
This is verified local progress, not a fully debugged or release-accepted game.
