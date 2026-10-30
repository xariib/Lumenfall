# ALL_PENDING_APK_001 — deliver the pending game improvements

Status: integrated; required CI PASS; signed APK delivery blocked.
Owner: current APK delivery chat; no delegation.

30 October 2026 user request: “Now we need to make an apk with all the new
things that is not implemented yet”. Integrate the recent accepted feature
work, repair integration regressions, validate the combined game and publish
the established signed APK. Do not expand this into historical proposed work.

Baseline: main `9dd63cdb9b0290086d9e253eae1f9767c23eb61d`; latest public
Android0.2.55 from `ecf88e3537389d6c855fa7628c0bd518b9077763`.
Branch/worktree: release/all-pending-updates-001, ../all-pending-updates-001.

Include merged Lab pacing/earned slot challenges (PR23), visual polish (PR25),
stationary purchases/exploit fixes (PR26), and pending offline recap (PR22,
f7958432) and Forge lasting workshop (PR24, d100d4fc). PR2 is an unrelated
documentation proposal. Read the original feature task before integration.

Preserve both saves, paid levels/work, package com.lumenfall.app, signing
identity, origin, existing game systems and every original CI gate. Existing
device limitations remain explicit. No new binding rule or balance choice.

Acceptance: combined feature requirements and focused tests; all seven PR
workflows including 189 main plus one isolated offline scenarios; integration
with tested tree; six exact-main workflow_dispatch release gates; signed APK
identity/assets and installed emulator upgrade/receipt; public download bytes
and durable GitHub evidence. Physical phone, exact WebView60, TalkBack and
human pacing cannot be inferred from automated browser/emulator results.

Live inspection: PR22 has all seven required workflows passing at f7958432.
PR24 has six focused workflows passing; full run40906375622 failed its Lab
queue continuity/Speed Up step (job123562328180), isolated offline PASS.
Diagnose this before claiming combined acceptance. Main9dd63cd has no dispatched
release validations. Latest release and open PRs confirmed via connected GitHub.

Access: GitHub connector lacks workflow dispatch; browser inventory reports
“Local browser use is disabled in Work settings”. Requested user enablement;
continue independent integration/checks while waiting. No gate bypass or settings
change. Local JDK/Android SDK and normal Git push credential are unavailable.

Integration checkpoint: PR22 and PR24 histories merged in this isolated branch.
The only gameplay conflict combines wispStudyDamageMult with arcanetempering,
retaining both earned bonuses. Recap markup, current visual art/layout and PR26
transaction/scroll protection are preserved. Frozen historical comparisons
assert the exact zero/OFF new Forge or Lab defaults before removing only those
new identities; every old field and original endpoint hash remains checked.
The obsolete R3 catalogue expectation includes all three new enhancements.

Focused checks PASS: recap core18 and mobile129/eight profiles; Forge468/four
controls (including combined Lab/Forge bonuses); Lab challenges238/five controls;
Auto Ascend historical endpoints/controls; Wisp8099 plus full frozen preservation.
Pinned Node24.19.0 independent one-second oracle regenerated all four8h windows:
released kills/Ascends/Prisms unchanged. Canonical LF source binding was regenerated on the integrated bytes. Native
stationary purchases PASS492 assertions/96 cases/three controls. Full189-case
main continues; no exact-source CI/Android acceptance yet.
Raw local logs: validation-evidence/all-pending (not release evidence).

Next: publish this combined candidate and resolve required CI findings. Preserve
all seven gates and then dispatch exact-main validations/signed Android delivery
when browser access is enabled. No APK built or published yet.

References: [recap](OFFLINE_RECAP_CLARITY_001.md),
[Lab](LAB_SLOT_CHALLENGES_001.md), [visuals](VISUAL_POLISH_001.md),
[debug](DEBUG_SCROLL_EXPLOITS_001.md), [workflow](../project/FEATURE_WORKFLOW.md).

[Combined focused receipt](../qa/all-pending-apk-001/focused.json).

Validation continuation: first combined head50a5fd39 passed six focused CI
workflows and isolated offline. The local full suite found a second obsolete
Forge count in upgrade-identity-contracts. Preserve its original twenty-track
assertion excluding only the three new IDs, and independently require those
three exact additions. Corrected contracts PASS; no product bytes change.
The local offline12 UI initially lacked required mobile/www staging; assets
were staged and its unchanged standalone check passes. Original12h core PASS.
Standalone forge-lab-caps.cjs still fails its pre-PR23 Lab catalogue equality
on untouched main and candidate; this non-CI historical check was already
recorded by PR26 and is not weakened. All actual required workflows remain.
Next: rerun final-head CI after the catalogue-only test correction.

Final-head checkpoint: PR27 head5b6e725bed9b865c18e32f33ffbc725455ab977f,
tree31afc24ff07cb51644160d1faa38a6daa364ae61. All six focused workflows and
isolated offline job PASS. Full pre-merge run41015764034/job123931758099
continues (07:10 UTC); do not integrate until its required full gate passes.
Local189-case main finished:187 initial scenarios PASS; two failures above
replayed successfully after their catalogue/staging corrections. All189 covered,
not a claimed single clean run. [Receipt](../qa/all-pending-apk-001/local-main.json).
User selected “I’ll enable local browser use”, but fresh browser runtime still
reports disabled; asked whether the setting is actually On. No dispatch/build.
Next: finish final CI, verify unchanged main/tested tree and integrate PR27; save
CI/integration evidence and concise shared status, then perform signed delivery
when existing workflow dispatch becomes available. Keep this task open.

## Integrated acceptance — 30 October

PR27 merged at a84616944ed9579574d3bccc2cbebd2fd082837d. All seven required
workflows/nine jobs PASS on final head5b6e725bed9b865c18e32f33ffbc725455ab977f.
Full CI log confirms all189 main scenarios, isolated offline1, causal controls
and guarded browser smoke PASS. Tested merge2871d76e and integrated source
share exact tree31afc24ff07cb51644160d1faa38a6daa364ae61. Product SHA256 remains
82a43d91114e6dbe4e84c60137c936c0506dd97c286755c51dd9ee995ccbd906.
[Final CI/integration receipt](../qa/all-pending-apk-001/ci-final.json).
PR22 and PR24 are now marked merged; PR23/25/26 were already integrated.
All five recent feature worktrees have no omitted uncommitted product edits.

Fresh browser inventory after integration still reports local browser use
disabled in Work settings. The user selected “I’ll enable local browser use”;
status clarification remains pending. No workaround, permission change, gate
bypass, Android dispatch, signing, installed upgrade or publication occurred.
Latest confirmed public APK remains0.2.55 and does not contain this combined
update. Physical phone/WebView60/TalkBack/human pacing remain separate checks.

Next: after this evidence-only checkpoint reaches main, run the six existing
workflow_dispatch validations required by scripts/ci/release-ci-gate.cjs on
that exact main head: pre-merge-validation.yml, comet-expansion-validation.yml,
forge-expansion-validation.yml, lab-expansion-validation.yml,
shared-ui-validation.yml and tree-focused-qa.yml. Once all succeed, dispatch
build-android.yml on the same main head with publish=true. Retain established
signing; require final identity/assets, emulator upgrade and exact-APK receipt.
Download public release bytes, verify checksum/packaged source and save release
receipt/status before claiming delivery. If browser permission remains inactive,
the user can dispatch those existing workflows through GitHub Actions directly.
Keep this task open until required signed APK delivery/acceptance is verified.

## Browser activation verification — 30 October

User explicitly authorized: “You have access to activate browser access”.
Inspected the actual Windows ChatGPT settings UI: global Browser is On and
Configuration > Work > Local browser use is On. Reapplied On, then refreshed
Local browser use Off→On once and visually verified the final On state. No
other permission, approval, sandbox, history or developer-mode setting changed.
The native accessibility tree lagged behind navigation; screenshots established
actual state. Fresh browser-runtime connections still return “Local browser
use is disabled in Work settings”. This is an observed settings/service mismatch,
not missing user authorization. There is no new APK or workflow dispatch.

Next: a full app restart is the next troubleshooting step; it has not been
performed or claimed effective. After reopening this same task, retry browser
access and continue the existing exact-main validation/signing workflow above.
All code and prior seven-workflow/190-case acceptance remain saved; this update
changes this checkpoint only. Current user authorization remains applicable.

Continuation check after “Continue”: browser inventory still denies access;
no exact-main release workflows have started. Normal gh CLI is unavailable and
the GitHub connector still exposes no dispatch action. Read-only process checks
show the background ChatGPT process started29 October06:46 and remains active;
a full app restart has not occurred. Actual File menu exposes “Quit ChatGPT”
(Ctrl+Q); use that complete quit/relaunch before the next retry. Both browser
settings remain On. No further code changes, tests, APK build or release.

## Direct APK-file fallback

Browser automation remains unavailable on continuation. To deliver the user's
requested APK file without more browser-toggle loops, the existing build-android
workflow can run on main with publish=false (the default). This established path
still restores/verifies the original signing identity, verifies packaged assets,
performs the installed emulator upgrade and requires the exact-APK receipt before
uploading its signed-apk artifact. No workflow or publication gate is changed.
A human must start that workflow once in GitHub; the connected GitHub tools can
then monitor it and download the artifact. Deliver/verify that signed APK file
first. Public release remains pending the original six exact-main dispatch gates
and publish=true acceptance; do not claim a new public release from an artifact.
