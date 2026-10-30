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
