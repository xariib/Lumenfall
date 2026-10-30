# LAB_OFFLINE_DEED_PACING_001 — continuous Lab and tougher automation Deeds

Status: integrated into main; CI/signed test APK PASS. Physical acceptance open.
Owner: current feature chat; no delegation. PR: https://github.com/xariib/Lumenfall/pull/28
Baseline: main88fd60b, Android0.2.58. Branch fix/lab-offline-deed-pacing-001,
worktree ../lv-lab. Current product SHA256:
3e2b6da487f39007cb1edf1191d33920d977f268f70341efdff6a64e2bfc0630.

## Requirements and final decisions

30 October original: “Tireless Vigil and The Forge Never sleeps, too easy to
unlock those aswell. The LAB research should not be stopped even after the
12 hour afk farm. The lab should continue until there is no resources to continue”.
User corrected the first count-only proposal: “Not only ascends and forge level,
also other challenges could be added.” Final choice: “Use tougher rift and lab
milestones + manual tap challenge”. The following concrete targets were announced:

- Tireless Vigil:100Ascends, highest Rift250 and10,000manual Guardian taps.
- The Forge Never Sleeps:200paid Forge levels, highest Rift350,100completed
  current Lab levels and10different researched subjects.
- Every condition must be met. Each has visible progress. Saved milestones count;
  existing earned Deeds/rewards/automation stay owned. Before first Auto-Tap,
  Guardian taps come from manual play, so no new counter/schema is needed.
- Lab uses the whole absence. Enabled research queues spend available Lumen and
  Shards; paid work finishes even with an empty wallet. OFF starts no next level.
  Paid boosts expire chronologically; only enabled boost queues spend Motes.
  Combat, Forge queues and combat automation retain their12h farming cap.

Preserve all other features/progression, both saves/recovery, paid/paused work,
boost consent/prices, Mote cooldowns, replay/high-water protection, rollback,
keyboard/touch behavior and package/signing identity. No new binding instruction.

## Implementation and acceptance

Small product change: run the existing resumable Lab-only scheduler after capped
combat, within the same offline transaction. Update Deed predicates, counters and
help/recap copy. The two multi-condition cards use a wide content column/reward
below; minmax(0,1fr) and wrapping prevent320px/200%-text clipping. No touch flashes.

Acceptance: each Deed boundary and independently missing condition; grandfathered
ownership through save/recovery; full-absence paid completions; funded/exhausted
queues with exact debits; chronological boost expiry/consented renewal; full Lab
recap; no beyond-cap combat; complete transaction rollback/retry/duplicate-return
protection; original full-state/history oracles; mobile fit, required CI and
integrated Android verification. Physical phone/WebView60/TalkBack remain separate.

Changed areas: index.html; focused lab-offline-deed-pacing.cjs; original Deed,
Lab/offline, clock and frozen preservation contracts; task/evidence. New checks
run from existing required lab-boost-queue.cjs, with its original assertions and
single JSON receipt retained. Workflow YAML unchanged. Initial OAuth push rejected
workflow changes for missing workflow scope; using the existing entrypoint avoided
any permission change. Test helper legacy-automation-deeds-reference.cjs replaces
only the two eligibility bodies in explicit historical counterfactuals.

## Validation and current checkpoint

Node24.19.0 pinned for CI/oracles; local helpers also24.20.0. Final-source67new
assertions/eight controls PASS; nine phone/text profiles,45condition measurements
plus card/reward bounds PASS. Self-inspected320px/200% screenshots. Forge9341,
Comet12554, Deed UI1071 and Forge UI6281/four controls PASS. Source-bound receipts:
[focused.json](../qa/lab-offline-deed-pacing-001/focused.json).

Independent complete offline replay PASS18records/five groups in287902ms,
within original300s deadline. Its72h oracle uses one-second combat12h then
one-second Lab-only60h;96h finishes already-funded80h work with exactly12h
combat. All archive hashes/full-state comparisons/deadlines remain. Four released
8h Swift state hashes/kills/Ascends/Prism payouts match after actual pinned-runtime
replay. Original offline12 suite PASS34records on initial13ac and released82a43d.

Frozen Auto Ascend/Wisp preservation checks explicitly restore only historical
12Asc/20Forge eligibility in a test-only counterfactual; archived oracles untouched.
Actual new-policy endpoints and67/eight-control suite cover the new predicates.
Feedback360/four controls and Wisp8099 plus448-world preservation PASS.
Phase fixture no longer relies on easy unlocks: explicit earned flags keep all
14causal controls active (PASS), with27positive checks. Identity fixture preserves
60Forge LabQueue success, rejects Auto-Empower there, then supplies all new gates.
Standalone corrected identity rerun PASS. Production paths unchanged afterbe1db712.

PR28 merged at05a52935adb02cdac1153c2348fa580d8feb165c. Feature headbed10314;
CI tested merge5cbade3a has treeee733478b1b248f42d0d2443765f6c3a30004415,
exactly identical to integrated main. All seven workflows/nine required jobs
PASS, including189main+one isolated offline scenario and runtime smoke.
[Delivery/CI receipt](../qa/lab-offline-deed-pacing-001/delivery.json) binds each
run to the expected head/product source. Branch-filter Prism skips are expected.
Main41071054234, Forge41071054290, Tree41071054222, Comet41071054329,
shared UI41071054331, permanent41071054251, Lab41071054260. The48main steps
include the corrected phase controls. Earlier failed runs remain superseded,
not relabelled. Completed Tree artifact12985551264 confirms commit/tree/source.

Local189-case run finished, exit1,216 PASS output lines and only the three
recorded failures: ../lv-lab-delivery-main.log. NOT a clean pass.
[Local receipt](../qa/lab-offline-deed-pacing-001/local-main.json).
Windows wisp-rarity-scroll timed out at90s; offline-12h-core at300s; identity
failure corrected/rerun above. Existing pipe browser transport avoids dump-dom
stalls. Released-baseline Wisp driver PASS3277checks/312profiles with240s diagnostic
limit. Both released/current sources time out at90s (90210/90283ms); this
Windows timing limit predates the feature. Current240s diagnostic also PASS3277
checks/312profiles in100342ms; diagnostic success does not pass the90s gate.
Retain actual deadlines/results.
Final Linux CI PASS includes all three locally failed scenarios. No complete
189-case local PASS or independent human review is claimed.

## Android evidence and next action

[Android receipt](../qa/lab-offline-deed-pacing-001/android.json): nonpublishing
[build41066494884](https://github.com/xariib/Lumenfall/actions/runs/41066494884) PASS;
artifact12983215925/signed-apk-41066494884. Signed test APK0.2.59/code1000059,
7072859bytes, SHA2566ea99156f10ce2789655ad549b5bbf5191790f1095a38d56afaf0cdb5905ed13.
Packagecom.lumenfall.app and established certificate unchanged (full receipt).
Saved ../builds/lab-offline-deed-pacing-001/Lumenfall.apk and release-evidence.
All15packaged assets independently extracted and matched checkout/CI hashes.
Installed API31/WebView91 upgrade retains both save slots, paid work/progression,
legacy entitlements, UID and https://localhost origin. Recap visually inspected.
Public latest remains0.2.58. Build sourcebe1db712/treef4ecf6b3 is historical;
later test/docs changes leave the product identical but change the whole tree.

Integrated product paths have zero diff from buildbe1db712. After merge, all15
game assets were re-extracted from the signed APK and matched integrated main;
APK hash/size and signing/save-upgrade receipt remain bound (android.json).
The final evidence/status commit changes documentation only.

Next: physical phone/exact WebView60/TalkBack and human pacing acceptance.
Signed test APK is ready locally; public release remains0.2.58. No implementation
work remains. Keep task/chat open for physical acceptance; do not archive.

References: [workflow](../project/FEATURE_WORKFLOW.md), [state](../PROJECT_STATE.md),
[Lab queues](LAB_BOOST_QUEUE_001.md), [Lab pacing](LAB_LONG_DURATION_001.md).
