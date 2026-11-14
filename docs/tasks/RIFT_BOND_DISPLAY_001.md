# RIFT_BOND_DISPLAY_001 — Rift bond names without boost rows

14 November 2026. Owner thread `01a1d77b-4453-7a21-9961-55d70c6cd963`.
Status: implemented; combined-release integration and acceptance pending.
[PR50](https://github.com/xariib/Lumenfall/pull/50).

## Requirement and acceptance

User: "On rift screen the formation bond names, their boost should not be shown,
it should only be shown in the wisp menu".

Keep active Bond names and Wisp partner marks on Rift; remove the separate boost
list, including accessible boost descriptions. Keep full Formation Bond effects
in the Wisp menu and preserve actual bonuses, all other UI, progression, paid
value, saves/recovery, chronology and online/offline behavior. No balance/cap,
schema, signing, package or binding-rule change.

Required: focused regression/causal checks; applicable PR and release CI on the
final combined version; integrated source; signed APK identity/assets, installed
Bond/Deeds checks, save upgrade, updater, retail launch and anonymous public
downloads/feed. Phone, exact WebView60, TalkBack and human acceptance remain
unverified until observed. Self-review only; do not archive pending work.

Read [startup](../../PROJECT_BOOTSTRAP.txt), [state](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md), CODEX_START and CONTEXT_INDEX.
Run `node scripts/codex/check_context.cjs --task docs/tasks/RIFT_BOND_DISPLAY_001.md`.

## Baseline, isolation and implementation

Original main `858d713f`, Android0.2.111. Branch `fix/rift-bond-display-001`;
worktree `validation-evidence/rift-bond-display`. Root checkout/attachments and
other worktrees are untouched. Main subsequently advanced through currency and
Deeds changes. Preserved main5040ea14's final Deeds Details/focus fix, then imported
native fixture correction `5f0d976210eb62fa37917129bd7e8bc453806d8e` without conflict.
Only shared status and the replay binding conflicted in earlier merges; retained
current-main status and all peer code/tests, then reran the paired reference.

Current production SHA256 (unchanged by the native fixture merge):
`7222c3adc5886327f109ee7cf23bb0fc9beb5928d1579e71af0dcabcb3533f8d`.
Complete product diff against main5f0 is only the requested boost-list removal.

Changed: `index.html` boost CSS/markup/cache/renderer removal; existing Formation,
Rift and guidance tests; replay source binding; native upgrade acceptance; task
and QA evidence. Names, colors/shapes and partner grouping remain. Installed
acceptance checks all eight Wisp effects and actual active names without Rift
boost rows. All peer native Deeds assertions and original retail helper remain.

## Checks and findings

[QA index](../qa/rift-bond-display-001/README.md) and its source-labeled receipts
retain exact versions, outcomes and original failures.

- Local Node24.22.1 / Chromium157.0.8103.79: source, context and whitespace pass.
- Bond mechanics: eight cases/six causal controls. Description contract and
 12 Formation profiles (320/390/430px, normal/2x text and motion) pass.
- Current SHA7222c3: both Rift mobile suites pass (six profiles/24 samples), and
 the old released boost list is rejected by the intended new absence assertion.
- Combined currency:1,776 checks/16 profiles; Deeds:313 core checks and550 UI
 checks/18 profiles. All four paired eight-hour one-second windows preserve every
 saved field/reward and original canonical endpoint. Only source binding changed.
- Main5f0 native fixture:99 checks and causal control, clarity and original recap
 clock checks pass locally. It creates genuine Farm1 offline rewards after
 untouched save/paid-work checks. Original popup/deadline/retail assertions stay.
 Deeds reports nonpublishing native run43591494545 passed on5f0; this is peer
 source evidence, not acceptance of our final combined APK.
- Original candidate `b062bff0` passed all fourteen workflows; main advanced
 before integration, so those are historical candidate results.
- Superseded0c3 CI failed: touch CDP deadline after four boost-queue profiles,
 Lab CDP deadline before the first assertion, and Tree's first positive browser
 scenario timing out at25.0555s with no completed QA result; its Chrome version
 query also timed out. Original raw ZIP/hash/payloads are retained. Underlying
 causes remain unproven. No failure is waived; final-source gates must pass.
- Fixed an introduced test incompatibility: only the exact pinned historical
 Guidance source receives its old Bond-layout checks. Current games retain
 strict absence. The full Guidance gate passes locally and in prior CI.
- Main already exceeded an older task's startup budget. Completed release
 summaries were compacted with full evidence links retained; the32KiB guard is
 unchanged. A generic older replay generator retains stale pre-PR42 totals;
 the existing paired replay instead passes current published canonical outcomes.
 Windows sandbox prevented browser startup; outside-sandbox runs passed.

[Full earlier checkpoint](../qa/rift-bond-display-001/task-before-final-validation.txt)
preserves the original requirements, decisions, failures and superseded versions.

## Authorized coordination

The human user explicitly answered: "Yes, coordinate those two chats
(Recommended)" to the question naming the existing Deeds and currency tasks.
Messages are authorized only for their current integration/build coordination.
No new chats/subagents, renames or messages to other tasks are authorized.

Deeds thread `01a1d77a-79eb-7092-b15b-9036aa5cf959` and currency thread
`01a1d779-6137-7220-99d1-681743c57aef` verified that human reply and agreed to hold
main/publication, keeping evidence on their branches. Deeds supplied5f0's tested
fixture correction; currency confirms accepted HUD CSS/markup/wallet/tests
preserved and no retail-helper fix required. Temporary diagnostics were restored.
This chat coordinates one combined integration/build/publication, then shares
exact SHA/run/tag/receipts for each owner to verify their own feature. It does not
claim or archive their tasks. Other feature work is preserved and not edited.

## Current next action

Continuation after interrupted work: the separate user-requested
[all-updates release](https://github.com/xariib/Lumenfall/blob/77ff91b7/docs/tasks/ALL_UPDATES_RELEASE_20261114.md) now owns combined APK
delivery. Its candidate77ff91b7 combines this PR50 source918d with the released
simpler Lab/main6fd9e44f, retaining the requested Rift absence and Wisp details.
Do not use this chat's old5f0-based promote/publish helpers or compete with that
release. Physical-phone/WebView60/TalkBack/human acceptance stays unverified.

Both authorized peer chats now report new direct human corrections: currency
names must be visible beside icons; Deeds must advance exponentially in one box,
with the user's example0/10 then10/x. Their owners are preparing focused commits;
this chat does not interpret or implement their gameplay requirements. Previous
finite Deeds/icon-only currency acceptance is superseded for the combined APK.
Publication of918d is held. Await concrete peer commits and combined-release
status; messaging that third chat requires separate human authorization, asked
14 November. No new chats/subagents or messages to other tasks are authorized.

Required CI on the old918d candidate remains failed, not waived. PR premerge
43595576399 attempt2 again failed Wisp's original300ms setup at check1; its
other scenarios passed. Dispatch premerge43600605287 failed three unchanged
attempts at15s touch-command deadlines after844/18,37/2 and145/8 completed
checks/profiles. Original JSON receipts are retained under this QA directory.
Local unchanged check passes993 checks/36 profiles. Auxiliary diagnostic run
43610396886 at isolated branchc0110483 ran two traced originals successfully;
the Runtime/DOM variant failed before initialization at Browser.getVersion with
zero checks. This does not prove a test or product cause and is not release
acceptance. No harness fix, deadline change or production change follows.

Next: save this checkpoint/evidence on a separate evidence branch without moving
the frozen source branch or main. Verify the eventual combined APK contains the
Rift change and report only observed automated/device acceptance. Do not archive.

## Superseded standalone delivery attempt

Final combined candidate is `918d57393d756cc4bb35c66f45784f8e4d101898`, including
main5f0; production source remains SHA7222c3. All latest local checks and the
native fixture causal control pass. Final-source CI remains incomplete.
First PR premerge43595576399 failed only Wisp setup in its broad scenarios;
dedicated Wisp43595576381 Linux failed the same unchanged300ms setup ceiling,
while Windows passed. Both failed jobs were requested as same-source unchanged
retries. QA `candidate-918d-first-failures.json` retains the evidence. The dedicated
Wisp retry passed. Dispatch premerge43600605287 failed three unchanged attempts
at the original15s touch-command deadline, after844/18,37/2 and145/8 completed
checks/profiles. Original reports are in `candidate-918d-release-*-failure.json`.
The unchanged local boost/preset check passes993 checks/36 profiles
(`final-boost-repro.json`). Cause remains unproven; no failure is waived.
An isolated auxiliary branch `diagnostic/rift-lab-touch-001` investigates Linux
protocol commands/events and optional Runtime/DOM initialization. It changes no
production bytes or release gate and is not release acceptance. Next: inspect
that diagnostic plus the PR retry, fix only a demonstrated cause if necessary,
then rerun required exact-source gates. Release candidate918d remains unchanged.
Prior0c3 workflows are superseded. Both peer owners have confirmed stable main/no
competing publication; Deeds reports no active own runs remain, including its
successful nonpublishing native run43591494545. Do not promote/publish until all
required final-source checks pass. After publication share source/run/tag and
receipts with both owners for their own feature verification.

The ignored local `validation-evidence/rift-bond-delivery.cjs` supports
`dispatch/status/ready/promote/publish` with exact branch/main/ancestry/build guards;
its baseline is5f0. `wait-rift-ci.cjs` monitors without mutating GitHub.
`verify-rift-bond-release.cjs` verifies the successful native artifact, package/
certificate, exact public versioned/latest APK bytes, assets/checksum and feed.
Equivalent GitHub workflow definitions and requirements are durable in the repo;
these local orchestration helpers are not an extra approval or acceptance stage.

After all required gates pass, serialize main integration and the signed main
build with the two owners. Do not push main evidence during publication: the
existing workflow verifies exact main before publishing. Verify the actual
combined APK, save durable receipts/status, notify both owners, and leave
physical-phone/WebView60/TalkBack/human acceptance open until observed.
