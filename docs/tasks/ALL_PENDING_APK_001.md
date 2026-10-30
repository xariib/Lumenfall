# ALL_PENDING_APK_001 — deliver the pending game improvements

Status: in progress. Owner: current APK delivery chat; no delegation.

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
