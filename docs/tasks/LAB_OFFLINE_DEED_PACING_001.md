# LAB_OFFLINE_DEED_PACING_001 — continuous offline Lab and harder automation Deeds

Status: implementation in progress; owner current chat, no delegation.
Baseline: main 88fd60b (Android 0.2.58), isolated branch
`fix/lab-offline-deed-pacing-001`, worktree `../lv-lab`.

30 October 2026 original request: “Tireless Vigil and The Forge Never sleeps,
too easy to unlock those aswell. The LAB research should not be stopped even
after the 12 hour afk farm. The lab should continue until there is no resources
to continue”.

Goal: Research uses the whole absence, continuing selected queues while funded;
combat farming remains capped at 12h. Increase the two automation Deed targets.
An optional user question offered 100 Ascends/200 Forge levels (default),
250/500, or depth gates. Default announced after independent investigation;
existing earned Deeds, rewards and automation remain owned.

Preserve all other progression, both saves, active/paused paid research,
Queue OFF, timed boost expiry/explicit renewal consent, costs, Mote payouts,
combat/Auto Ascend cap, clock high-water/replay protection and transaction rollback.
No schema change or new binding instruction.

Acceptance: exact new Deed boundaries and displayed targets; old unlock ownership
survives normalization/save/recovery; paid work finishes beyond12h; queues spend
only available resources, finish already-paid work when funds run out; OFF never
starts another level; boosts expire/renew chronologically without free speed;
long absence/batch partition parity; recap includes full Lab results; no extra
combat income/taps/Empower/Ascends after cap; failed/cancelled catch-up rolls back
and retry/duplicate return cannot replay time/payments. Required relevant CI and
integrated checks; Android delivery/acceptance remains open until verified.

Baseline evidence: original Lab renewal, recap and offline12h checks running.
Original source explicitly omits its existing Study-only simulation helper after
the combat cap. Lab Queue and timed boosts already have chronological helpers.

Next: add the Lab tail, update copy/Deeds and affected original contracts, add
focused regressions/causal controls, validate, publish and integrate through CI.

References: [workflow](../project/FEATURE_WORKFLOW.md),
[current state](../PROJECT_STATE.md), [Lab queues](LAB_BOOST_QUEUE_001.md),
[long Lab pacing](LAB_LONG_DURATION_001.md), [combined release](ALL_PENDING_APK_001.md).

Implementation checkpoint: small product diff adds the existing resumable Lab-only
scheduler after the capped combat interval; all time commits/rolls back together.
UI/Deed targets100/200 and full-absence copy updated; original tests now check
continuous Lab plus capped combat, preserving refund/save/legacy controls.
Focused PASS55/four controls, boost queue379/five controls, Forge9341, Comet12554,
Swift core, recap18 and mobile129/eight profiles. Pinned Node24.19.0 independent
one-second oracle regenerated: all four released end-state hashes and payouts
remain exactly unchanged; only its source binding changes.
[Focused evidence](../qa/lab-offline-deed-pacing-001/focused.json).
Full browser regression/long offline cases are running. Actual Node8 acceptance
will run in existing CI. Source syntax/context/diff checks PASS.
Next: create PR, resolve CI findings, integrate and run required delivery gates.

GitHub push rejected workflow-file changes because the existing OAuth login
lacks workflow scope. No permission change requested: new regression/controls
are invoked from the existing required lab-boost-queue validation entrypoint.
Its original assertions/controls and single JSON receipt are preserved, with
a nested offlineLab result. Workflow YAML restored byte-for-byte.
