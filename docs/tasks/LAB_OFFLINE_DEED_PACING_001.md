# LAB_OFFLINE_DEED_PACING_001 — continuous offline Lab and harder automation Deeds

Status: implementation in progress; owner current chat, no delegation.
Baseline: main 88fd60b (Android 0.2.58), isolated branch
`fix/lab-offline-deed-pacing-001`, worktree `../lv-lab`.

30 October 2026 original request: “Tireless Vigil and The Forge Never sleeps,
too easy to unlock those aswell. The LAB research should not be stopped even
after the 12 hour afk farm. The lab should continue until there is no resources
to continue”.

Goal: Research uses the whole absence, continuing selected queues while funded;
combat farming remains capped at 12h. Require multiple progression challenges for both automation Deeds.
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

User correction30Oct: higher Ascend/Forge counts alone are insufficient; add
other challenges too. A follow-up question proposes100Ascends/Rift100/100boss
defeats for Vigil and200Forge/25Lab levels/5subjects for Forge Never Sleeps;
alternatives are manual taps or tougher Rift/Lab milestones. Decision pending;
do not merge the single-counter candidate as satisfying this correction.

Additional research checks PASS: original offline12h34 records (full saves,
rollback/retry/refunds and capped-combat-plus-Lab); timed boosts1480; Mote
offline transaction; help UI12 profiles; inquiry UI45 via the repo
CDP pipe transport. Windows dump-dom stalls; full local run was restarted
with existing LUMENFALL_QA_DOM_TRANSPORT=pipe. Native wisp-rarity-scroll timed
out locally; not yet classified. Baseline offline run confirms long replay
performance also exists before this change.
PR28 head e70daab. Premerge run41062701128 fails the old hidden-absence assertion
that capped Lab work at12h. Preserve its existing background/live and combat
cap assertions and update only Lab work to full20h; relevant regression rerun
pending. Other CI jobs remain in progress. No integration or APK yet.

User answered: “Use tougher rift and lab milestones + manual tap challenge”.
Final announced requirements: Vigil100Ascends + Rift250 +10,000manual Guardian
taps; Forge Never Sleeps200paid Forge levels + Rift350 +100completed current
Lab levels +10different current subjects. All conditions must be met.
No new counter/schema: before first Auto-Tap unlock, saved Guardian taps are
manual; old earned unlock flags continue to bypass new eligibility as before.
Each additional condition is visibly counted in the Deed card. Old progress
counts; current catalogue levels include preserved above-cap paid levels.
The earlier100boss/25Lab/5subjects proposal was not implemented.

Final source86ba983f. Focused PASS67/eight causal controls (each extra gate
independently required), Comet12554, Forge9341, Swift, exploits267/12controls,
Deeds UI1071 and Forge UI6281/four causal controls. Repaired the old Forge
mutation to actually omit historical levels; it had become a no-op after
all-Forge counting, and the new fixture proves that omission is caught.
Pinned24.19.0 oracle again preserves all four original end-state hashes and
payouts exactly. Native phone-width/200% challenge-counter UI checks running.
Baseline original offline suite PASS34records; candidate offline suite also
PASS34 before the final Deed addition; required CI will repeat final source.
Local broad runs stopped when user changed Deed scope; all future acceptance
must bind the final source. Current PR is still the earlier candidate; next
commit/push final requirements, evidence and original-contract corrections.

Final delivery candidate source3e2b6da4. All67new assertions/eight controls and
nine phone/text profiles/45 condition measurements PASS on those exact bytes;
reward/card bounds checked too. Self-inspected both320px/200% screenshots.
Two expanded cards use a full-width condition column and reward below it.
Pinned oracle again retains every original state hash/payout. Complete diff
self-reviewed; no independent review claimed. Evidence source identities retained
separately where checks preceded the final CSS-only layout adjustment.
Next: push final candidate and require fresh CI before main integration.
