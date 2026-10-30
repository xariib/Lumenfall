# ALL_PENDING_APK_001 — deliver the pending game improvements

Status: integrated; required CI PASS; signed APK0.2.56 built and verified.
Public release and physical-device acceptance remain open; do not archive.
Owner: current APK delivery chat; no delegation.

30 October 2026 user request: “Now we need to make an apk with all the new
things that is not implemented yet”. Integrate recent accepted feature work,
repair integration regressions, validate the combined game and deliver the
established signed APK. Do not expand into historical proposed work.

Baseline main9dd63cdb9b0290086d9e253eae1f9767c23eb61d; public Android0.2.55
from ecf88e3537389d6c855fa7628c0bd518b9077763.
Branch/worktree: release/all-pending-updates-001, ../all-pending-updates-001.
Included already-merged Lab pacing/earned slot challenges (PR23), visual polish
(PR25), stationary purchases/exploit fixes (PR26), pending offline recap (PR22,
f7958432) and Forge lasting workshop (PR24, d100d4fc). PR2 is unrelated docs.
All five recent worktrees were checked: no omitted uncommitted product edits.

Preserve both saves, paid levels/work, package com.lumenfall.app, signing
identity, origin, existing systems and original CI gates. No new binding rule,
balance decision or weakened acceptance. Physical phone, exact WebView60,
TalkBack and human pacing cannot be inferred from browser/emulator results.

Acceptance: combined feature requirements/focused checks; all seven PR
workflows (189 main plus one isolated offline); tested-tree integration; signed
APK identity/assets and installed emulator upgrade/exact-APK receipt. Public
release additionally needs six exact-main workflow_dispatch gates and verified
public download bytes/durable evidence. Artifact delivery does not prove release.

## Integrated changes and regression checks

PR27: https://github.com/xariib/Lumenfall/pull/27, merged at
a84616944ed9579574d3bccc2cbebd2fd082837d.
Final head5b6e725bed9b865c18e32f33ffbc725455ab977f; tested merge2871d76e27acc46a9fed920bd4f0130f2c38fdf3.
Tested/integrated tree31afc24ff07cb51644160d1faa38a6daa364ae61.
Canonical index.html SHA256:
82a43d91114e6dbe4e84c60137c936c0506dd97c286755c51dd9ee995ccbd906.

The only gameplay merge conflict combines wispStudyDamageMult with
researchFactor('arcanetempering'), retaining both earned bonuses. Recap,
current visuals and PR26 transaction/scroll protections are preserved.
Changed areas: index.html, relevant behavioral contracts/frozen comparisons,
independent oracle/source binding and this task's docs/evidence.

Frozen historical comparisons require exact zero/OFF new Forge/Lab defaults
before excluding only new identities; old fields/endpoint hashes remain checked.
Corrected stale R3 and upgrade-identity catalogue expectations without removing
original twenty-track assertions. Pinned Node24.19.0 independent one-second
oracle regenerated four8h windows: released kills/Ascends/Prisms unchanged.

Focused PASS: recap core18 and mobile129/eight profiles; Forge468/four controls
including combined bonuses; Lab238/five controls; Auto Ascend historical
endpoints/controls; Wisp8099/frozen preservation; stationary purchases492
assertions/96 cases/three controls.
[Focused receipt](../qa/all-pending-apk-001/focused.json).

Local main initially187/189 PASS. Stale upgrade catalogue expectation corrected;
offline12 UI lacked mobile/www staging, then unchanged check passed after
staging. Both replays PASS, all189 covered; not a single clean local run.
[Local receipt](../qa/all-pending-apk-001/local-main.json).
Historical standalone non-CI forge-lab-caps.cjs still fails its old Lab catalogue
on untouched baseline and candidate (previously recorded by PR26). Not weakened.
All actual required cap workflows pass.

All seven final CI workflows/nine jobs PASS. Main run41015764034,
job123931758099 full log confirms189 distinct scenarios and guarded smoke;
isolated offline job123931757802 PASS. Permanent41015764015,
Lab41015764020 (two jobs), Comet41015764035, Shared UI41015764053,
Tree41015764107 and Forge41015764023 PASS.
[CI/integration receipt](../qa/all-pending-apk-001/ci-final.json).
PR22/24 now merged; PR23/25/26 were already integrated.

## Signed APK0.2.56 — 30 October

User manually dispatched the existing Build Android APK workflow on main with
Publish unchecked and supplied run/job links. No workflow/gate change.
[Run41026419246](https://github.com/xariib/Lumenfall/actions/runs/41026419246),
[job123965495858](https://github.com/xariib/Lumenfall/actions/runs/41026419246/job/123965495858):
completed SUCCESS. Exact source6e0ea25a29d9e9403c810389d5a70606587ef3f2
contains only documentation changes after tested integration; packaged product
SHA256 remains82a43d91114e6dbe4e84c60137c936c0506dd97c286755c51dd9ee995ccbd906.

Version0.2.56/code1000056, package com.lumenfall.app, established certificate:
A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21.
APK SHA256:
2ad738dc52226a1eb0013ea3309508c469a38ed6062c187a0280d3c27ff2b3eb.
Artifact signed-apk-41026419246/id12964500365; ZIP SHA256:
e7bf1dfafe779dbe5f0bea91250b90f2ab4092076d4020e15d4f161e2d4fdca6.
[Durable build/asset/upgrade evidence](../qa/all-pending-apk-001/apk-0.2.56.json).

CI restored and verified original signing identity, verified final APK
identity/exact production assets/origin, passed actual in-place signed emulator
upgrade from0.1.158 and required the completed receipt for this exact APK.
Both saves, paid studies/progress, legacy purchases and Android UID retained.
Baseline cold restart and native touch/offline Continue/Farm/hint checks passed.
Environment Android12 API31/WebView91 emulator; physicalDevice=false.

Downloaded ZIP digest matched GitHub; safely extracted21 entries. Locally
reverified actual APK assets against tested source, exact-APK upgrade receipt,
source commit, checksum and identity evidence. Copied the same7071687-byte APK
to ../builds/Lumenfall-0.2.56.apk and rechecked its SHA256. Local raw evidence:
validation-evidence/all-pending/android-41026419246. APK binary is not committed.

This is a verified signed APK artifact, not a new public GitHub release.
Publish step was intentionally skipped. Latest public release remains0.2.55.

## Access history and remaining acceptance

GitHub connector has no workflow-dispatch action; native gh/JDK/Android SDK and
normal Git push credentials unavailable. Browser service repeatedly reported
“Local browser use is disabled in Work settings”. User authorized activation;
actual Windows settings showed global Browser On and Local browser use On.
Reapplied On and one Off→On refresh; fresh runtime still denied access.
No other permission/settings were changed. Background process showed full
restart had not occurred; full Quit/relaunch was suggested. This observed
settings/service mismatch does not block the delivered artifact now that the
user manually dispatched the unchanged publish=false workflow.

Next for public publication: run six existing workflow_dispatch validations on
one exact main head (scripts/ci/release-ci-gate.cjs): pre-merge-validation.yml,
comet-expansion-validation.yml, forge-expansion-validation.yml,
lab-expansion-validation.yml, shared-ui-validation.yml and tree-focused-qa.yml.
After all succeed, dispatch build-android.yml at that same head with publish=true.
Require signing/identity/assets/installed upgrade and exact-APK receipt; download
public bytes and verify before recording a public release. No publication gate
was bypassed. Keep physical phone/WebView60/TalkBack/human pacing explicit.

References: [recap](OFFLINE_RECAP_CLARITY_001.md),
[Lab](LAB_SLOT_CHALLENGES_001.md),
[visuals](VISUAL_POLISH_001.md), [debug](DEBUG_SCROLL_EXPLOITS_001.md),
[workflow](../project/FEATURE_WORKFLOW.md).
