# LAB_OFFLINE_DEED_PACING_001 — continuous Lab and tougher automation Deeds

Status: implementation/focused validation PASS; final CI/integration/Android pending.
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

## Evidence and current validation

[Focused receipts](../qa/lab-offline-deed-pacing-001/focused.json).
Node24.20.0 local; independent one-second oracle generated with pinned24.19.0.
All four released state hashes and payouts remain exactly unchanged; source
binding regenerated after product edits, never merely relabelled.

Exact final-source PASS:67new assertions/eight causal controls; nine phone/text
profiles and45condition measurements, card/reward bounds; self-inspected both
320px/200% screenshots. Forge9341, Comet12554; source/context/diff checks PASS.
Original continuous-Lab offline12 suite PASS34records on initial13ac05a6;
untouched released baseline82a43d91 also PASS34records. Other intermediate checks
retain their actual source hashes in the receipt; do not call them final-source CI.

Final-source independent complete offline replay PASS18records/five groups in
287902ms locally, within the original300s combined CI deadline. Its72h oracle
retains one-second combat for12h then one-second Lab-only calls for60h;96h pays
its already-funded80h project but retains exactly12h kills/Ascends. Every original
case, archive hash, complete state comparison and deadline remains. Tooling
partition checker PASS12negative controls, with original18record coverage retained.

Auto Ascend feedback PASS360checks/four controls, including actual new-policy
combat, exact receipt conservation and both-slot reload. Its frozen PR15 hashes
remain unmodified and match exactly under the explicit old12/20 Deed policy.
Wisp contribution PASS8099 plus complete448-world preservation/chronology under
that same counterfactual. Actual multi-condition eligibility is separately tested;
no gameplay formula/controller or archived source is replaced.

Earlier CI head ed0d784: Lab, Comet (actualNode8), shared UI and permanent
progression PASS. Permanent progression first attempt timed out at Browser.getVersion
before UI checks; unchanged retry PASS. Forge/isolated offline41064744477/41064744443
caught the old72h-versus12h Lab oracle; corrected in6fd5c20. Main premerge/tree
also caught intended Deed-policy differences in frozen feedback/Wisp comparisons;
new explicit counterfactuals pass locally, pending push/fresh CI.

Windows dump-dom stalls; the existing LUMENFALL_QA_DOM_TRANSPORT=pipe passes
inquiry UI. Local wisp-rarity-scroll timed out; broad local runs stopped when the
user changed scope. Do not claim a complete local189-case pass or independent review.

Next: push frozen-policy corrections/evidence; finish required fresh CI, fix any
introduced failures, integrate tested tree and complete the relevant Android build
and signed save-upgrade acceptance. No merge or APK yet. Keep task open while
required acceptance is pending; do not archive.

References: [workflow](../project/FEATURE_WORKFLOW.md),
[current state](../PROJECT_STATE.md), [Lab queues](LAB_BOOST_QUEUE_001.md),
[long Lab pacing](LAB_LONG_DURATION_001.md), [combined release](ALL_PENDING_APK_001.md).

Live continuation checkpoint: final head be1db712d0dd4db0395c6d289d662ad9f508faf4
is pushed; product/tree unchanged. Tested PR merge7cc58740856f4077696b493786922226c27fd574
has treef4ecf6b3fc7b2a039dd5150b28d6381dbcdfc0eb, identical to feature head.
Current head CI runs: premerge41066433157 (main124099259793 still running;
isolated offline124099260031 PASS), Forge41066432914, Tree41066432915 PASS,
Comet41066432913 PASS, Lab41066433009 PASS, shared UI41066433018 PASS,
permanent41066433003 PASS. Forge passed its formerly failing full offline
reference and is in mobile acceptance. Main is in settled-screen UI acceptance.
Do not merge until Forge and main are green; fresh main still88fd60b.

Signed NONPUBLISHING Android run41066494884 PASS on be1db712. TestAPK0.2.59,
1000059, SHA2566ea99156f10ce2789655ad549b5bbf5191790f1095a38d56afaf0cdb5905ed13,
7072859bytes. Signed artifact12983215925, signed-apk-41066494884. Downloaded
to ../builds/lab-offline-deed-pacing-001/Lumenfall.apk with release-evidence and
verified-build.json. Local tar extraction independently matched all15 packaged
assets to both checkout and CI hashes, including exact production index3e2b6da4.
Installed API31/WebView91 upgrade confirms both saves, paid study/progression,
legacy entitlements, UID and https://localhost origin retained; certificate is
the established A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21.
Visually checked installed recap before/after: updated cap explanation fits and
Continue works. It is a test artifact; public latest stays0.2.58.

Next after all CI passes: merge PR28 at exact expected head, verify integrated
tree equals f4ecf6b3; save CI/Android receipts and concise PROJECT_STATE update
on GitHub (this checkpoint is intentionally uncommitted while CI finishes).
No product changes remain. Physical-phone/WebView60/TalkBack acceptance stays open.

Latest correction: all six specialized workflows and isolated offline PASS on
be1db712, but main41066433157 fails endless-cycle-controls: phase NOT CAUGHT.
Its queued-Forge fixture was fresh and depended on the old easy Deeds to activate
timers. Set BOTH earned automation flags explicitly in that test-only fixture;
positive fast/literal state still matches and the phase mutant now fails the
intended exact saved-endpoint assertion (different timer bases/accumulators).
No production bytes changed; the verified0.2.59 APK remains the same game.
All14controls running locally; completed ones, including phase, are CAUGHT.
Final-source local189-case main suite also started with pinned24.19.0/pipe
transport to reveal any later fixture assumptions while fresh CI runs.
Next: commit/push this focused fixture correction after all14controls pass, then
require all seven fresh workflows before merging. Do not treat the old be1
main failure as completed acceptance. Local checkpoint changes are uncommitted.

Phase fixture validation complete: positive27checks PASS; phase mutant now
fails the exact saved-endpoint assertion, and ALL14existing causal controls
PASS. Commit the focused test fixture and receipts; production, fonts, branding
and mobile source paths have zero diff from the signed APK build commitbe1db712.
Full local189-case run is in progress; do not claim it passed. Fresh CI needed
after this test-only commit, then integrate. Android evidence saved below.
