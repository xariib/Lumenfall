# Progressive Deeds evidence

## Human correction: one live bar, increasing stage rewards

The human rejected the prior design and chose existing milestone numbers plus
increasing rewards. Current source0e613bf5d983345738cc26d56909b925b8b8f3f9156ea443361c79405b1d95fa
replaces checkbox markers with one live bar per series, retains cumulative totals
when advancing and removes the milestones-completed counter. Original milestones,
receipts and original/event rewards survive. Four later tracks now increase by5
Comets instead of falling at their original/long-tail boundary; all stage rewards
rise. Already settled stages are not paid again; pending stages receive the current
higher reward once. The approved full pool is3373, including original683/event50.

[Core](bar-correction/core.json):415 focused payout/save checks,417 original checks
and99 native-fixture controls PASS. [Mobile](bar-correction/mobile.json):1264 checks,
36 profiles PASS. [Stale-bar control](bar-correction/stale-bar-control.json) correctly
fails when the ordinary live tick's bar update is removed.
[Rift10→25 screenshot](bar-correction/rift10-next25.png) and
[200% text screenshot](bar-correction/deeds-320-200.png) were visually inspected.
[Paired replay](bar-correction/replay.json) recomputes four eight-hour windows for
both released main6fd9e44f and current source. Every complete state matches after
adding only the independently enumerated new Comet rewards (+450 in this fixture).
Original kills/Ascends/Prisms and all other fields are exact. The bound reference
uses the actual corrected full-state hashes. Required CI and signed native/public
APK checks remain pending; earlier receipts below are not correction acceptance.

PR55/e01f443c exposed independent references still using the former stage rewards.
[Preserved failures](bar-correction/e01-reference-failures.json) and
[CI metadata](e01f443c192e5700973127d0ab6fe3f2bd6e2b0d-ci.json) retain that attempt.
Follow-up updates only exact expected stage amounts and restores old rewards in
the explicitly historical PR15 adapter. Original frozen hashes and complete-state
assertions remain unchanged. [Numerical](bar-correction/numerical.json) passes
1,097,372 checks/controls; [full offline](bar-correction/offline.json) passes18 cases;
[Auto-Ascend](bar-correction/ascend-reference.json) passes375 checks/controls;
[Wisp](bar-correction/wisp-reference.json) passes8,099. The initial Linux
[Wisp failure](bar-correction/e01-wisp-failure.log) was its300ms setup settlement
deadline at1 check; Windows passed. Raw artifact14129149287 SHA256
7eed23513759a022e51dea50df143bf835965641b5099de79390d72a06def0d5 was verified.
No deadline or assertion is reduced. Corrected-source CI/native delivery is open.

Baseline main858d713f, source ce51bc14e82c41929483c6483684add0390690d92d181c8aa35a91336aad0ac8.
Candidate product 8505c177d642b372d69f8b56f568f581ea44709ab9d3f14c3d4aaa6505bd11ff.
Task: [DEEDS_PROGRESSIVE_001](../../tasks/DEEDS_PROGRESSIVE_001.md).

- `node tests/behavioral/deeds-progressive.cjs index.html`: 313 checks PASS.
- `node tests/behavioral/workshop-card-clarity.cjs index.html`: original417
  and focused313 checks PASS (baseline original417 PASS).
- `node tests/behavioral/lab-speed-controls.cjs index.html --clarity --evidence
  validation-evidence/deeds-mobile`: 1,070 checks PASS,36 profiles total. Includes
  all nine series/every transition, final completion, skipped rewards, exact
  pending-credit display, reload, full-state/save purity, native keyboard/open
  history and focus preservation, 320/390/430px,100/150/200% text, both motions.
  [Raw receipt](mobile.json), [inspected enlarged image](deeds-320-200.png).
- `node tests/behavioral/run.cjs --web-root . --scenario upgrade-effects-and-deeds`:
  1,071 existing eligibility, exact progress, one-time reward and purity checks PASS.
- Same runner, `inquiry-contracts`:237 checks/one causal control PASS;
  `forge-contracts`:6,281 checks/four causal controls PASS.
  `r3-destinations`:PASS, including current/earned Deed counters and navigation.
- `node scripts/qa/verify-deeds-offline.cjs --write`: four independent8h windows,
  115,200 one-second calls PASS. Every released state digest/reward tuple remains
  exact; only the golden file source binding changes. The obsolete original
  generator's aggregate assertion failed; see task for disposition.
- Source syntax, task context and `git diff --check`:PASS.

Local Node24.22.1, Windows, Chrome157.0.8103.78/V8 15.7.112.43. The restricted
browser attempt failed readiness; the final driver passed outside that sandbox.
Self-review only. GitHub CI/integration/APK evidence pending. Physical-phone,
exact WebView60 DOM, TalkBack and human visual acceptance remain unverified.

Main7f149b89 currency-header integration: combined product
d58a8edc12f0ed340b8fbb1126bb3eb139bfbe328119743201deb3e7bdc3c7fc passes313
focused/417 original core checks and548 Deeds mobile checks across18 profiles.
[Combined receipt](integrated-mobile.json), [combined enlarged image](deeds-320-200-integrated.png).
The only merge conflict was the golden source hash; endpoint values remain exact.

## Accepted candidate and native attempts

All eight applicable PR lanes pass on b9456622; full190 deterministic scenarios,
isolated offline and runtime smoke pass. [Complete CI metadata](b94566220f79026314e19c16e3e6ea2cab8311b0-ci.json).
PR52 integrated at7448cc0b96b175fcd9989570840c12ba47486afa, identical complete tree.

Signed test0.2.113 first failed existing recap presentation after crediting the
absent minute; [preserved failure](android-first-failure/receipt.json). Its unchanged
retry passed package/signing/assets, both saves/paid work, updater and the17-card
Deeds/next-target/native-history assertions. [Actual upgrade receipt](android-second-attempt/emulator-upgrade.json),
[Deeds image](android-second-attempt/installed-deeds-progressive.png). It then failed
retail launch inspection: the [screen shows the game](android-second-attempt/production-normal-launch.png)
but the [stock accessibility dump](android-second-attempt/production-normal-launch.xml)
omits its controls. Keep this required check failed. Artifact14108544750 ZIP
SHA256ab9e794fa10c0a6a45b4b6e17ef06e6f6b6626ffe9aa0bf709b79cd16f002d93.
No cause is proven; no deadline/assertion changed. The currency diagnostic later
passed the unchanged normal-launch path on its own source; that is separate evidence.

Android31's [stock dump implementation](https://android.googlesource.com/platform/prebuilts/fullsdk/sources/android-31/+/refs/heads/androidx-savedstate-release/com/android/commands/uiautomator/DumpCommand.java)
waits for idle before reading the tree and exits on timeout. This supports an
inspection-failure hypothesis, not a verified root cause or substitute for a pass.
Exact-main CI and final public Android delivery remain pending.

## Final Details preservation

Final review preserved paid-Forge explanations after60→100 and the same native
Details focus/open identity. Current source
552b28dc1c5a0c161c97eb70acc8c7589add4136caa8414e650b6956d3037b28 passes313
focused/417 original core checks,1,072 UI checks/36 profiles and the original
1,071-check Deed contract. [Current mobile](final-mobile.json), [image](final-320-200.png).
[Actual current replay](final-replay.json) recomputed115,200 one-second calls and
retained every released full-state endpoint. The e67c984f checks are prior-source
evidence; repeat required integrated gates on these final bytes.
[Full preceding checkpoint](task-before-final-detail.txt) preserves earlier status.

## Native recap fixture correction

[Exact saved-window replay](recap-precondition.json) shows the first failed
fixture earns0 rewards/kills/completions during60 and60.373s. The game correctly
does not show a recap for that window. The corrected disposable fixture farms
Rift1 only after original save-retention assertions pass; it must earn actual
rewards through the production scheduler before the unchanged popup assertion.
[99 checks/causal control](native-recap-precondition.json) prove positive earnings,
full-minute credit and preservation of every unrelated saved field. Removing
the new setup reproduces the empty-reward failure. Existing10 clock/replay checks
and their control pass too. Product bytes stay552b28dc; no popup is forced, native
deadlines are unchanged, and no visibility/security/save assertion is removed.

## Exact-main native acceptance and coordinated delivery

Commit5f0d976210eb62fa37917129bd7e8bc453806d8e passed signed Android0.2.116
[run43591494545](https://github.com/xariib/Lumenfall/actions/runs/43591494545).
[Native receipt](android-5f-acceptance/emulator-upgrade.json) records all17 series,
next Rift2500 after earned1000, completed history opened by actual Android touch,
save/paid-work retention and updater acceptance. [Screenshot](android-5f-acceptance/installed-deeds-progressive.png)
was visually inspected. [Retail runtime](android-5f-acceptance/production-runtime.json)
passes original normal launch, visible controls and security checks. APK SHA256
2ef5c469256f02968622f4a0761a0d06ee0beefbbaf58c7af593b4e5377091b4.

[Exact-main CI](5f0d976210eb62fa37917129bd7e8bc453806d8e-ci.json) records seven focused
successes and one failed premerge. [Failure](5f-premerge-failure.json) preserves
the raw CDP Input.dispatchTouchEvent deadline after37 checks in the Lab next-boost
UI test. All Deeds checks passed before that failure. Required acceptance remains
open; no timeout/assertion is changed. The explicitly authorized Rift/currency
coordination now serializes one combined source and signed publication. Hold
main/build mutations here until its exact-source/public package verification.
