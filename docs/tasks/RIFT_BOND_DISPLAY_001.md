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
with the user's example0/10 then10/x. Their owners supplied focused commits;
this chat does not interpret or implement their gameplay requirements. Previous
finite Deeds/icon-only currency acceptance is superseded for the combined APK.
Publication of918d is held. Await concrete peer commits and combined-release
status; messaging that third chat requires separate human authorization, asked
14 November. No new chats/subagents or messages to other tasks are authorized.

Currency supplied [PR54](https://github.com/xariib/Lumenfall/pull/54), exact commit
`024029247a42c11ab91218381de5e95e7150bd1b`, based on main6fd9e44f. Its product
diff is CSS only: visible9px names and two columns at380px or narrower; product
JavaScript is unchanged. Owner reports1,776 currency checks/16 profiles,1,399
Rift checks/12 profiles, hidden-name causal control and paired four8h replay
phases PASS; this chat has inspected the diff, not independently rerun those
checks. Evidence is in `docs/qa/currency-hud-001/visible-names` on that commit.
PR CI and actual combined APK acceptance remain pending. Preserve this correction
in the final combined source; the older icon-only requirement is superseded.

Deeds supplied final head `f1921bbfec63bcfd6f6d3c18c45d8af8eb3af27d` on
`feature/deeds-progressive-001-work`, based on main6fd9e44f. Its owner reports
the human chose existing milestone targets and increasing rewards. The correction
uses17 cumulative progress bars (Rift10 advances to10/25), removes checkbox and
completed-count presentation, preserves settled payouts/pending claim semantics,
and intentionally raises later Comet rewards. Owner reports415 focused+417
original+99 fixture checks,1,264 UI checks/36 profiles and1,071 rendered-contract
checks PASS. Four paired8h replay phases permit only the independently specified
450-Comet increase. Native17-bar/Rift1000/2500 checks are added but not yet run.
This chat inspected the commit summary; these are peer-reported checks and
requirements, not an independent review or this Rift task's gameplay decision.
Retain original target/reward decisions and evidence in that commit's Deeds task.
Correction [PR55](https://github.com/xariib/Lumenfall/pull/55) is open. Its first
CI found older reward expectations; final headf1921bbf supersedes e01f443c with
exact independent reward schedules and the historical PR15 counterfactual updated.
This chat verified no `index.html` diff between those two heads. Owner additionally
reports1,097,372 numerical checks/controls,18 complete offline cases,375 frozen
AutoAscend checks/controls and8,099 Wisp contribution checks PASS. Original
failures remain saved; deadlines/assertions are unchanged. CI reruns on f192 and
native/public acceptance remain pending. No failure waived.

Combined [PR53](https://github.com/xariib/Lumenfall/pull/53) is currentlya3d125a5;
its recorded next step is integration/build after remaining premerge runs.
That version predates both corrections. This chat will not integrate/build its
own older candidate or label the peer corrections accepted in the actual APK.

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

Checkpoint/evidence is saved on `evidence/rift-bond-checkpoint-001`, initially
9bdf4535, without moving the source branch or main. The combined-release branch
has advanced to documentation/check-receipt commita3d125a5; no competing main or
APK action is authorized by this update. Verify the eventual combined APK contains the
Rift change and report only observed automated/device acceptance. Do not archive.

## Superseded standalone delivery attempt

Source918d5739 included main5f0 and production SHA7222c3. The local delivery
helper is guarded against main5f0 and must not promote/publish now. The full
[earlier continuation](https://github.com/xariib/Lumenfall/blob/9bdf4535/docs/tasks/RIFT_BOND_DISPLAY_001.md)
retains that attempt, helper details and original findings; current failure
receipts remain under the QA directory. Combined release delivery now belongs
to the separate user-requested all-updates task. This task stays open until the
actual combined source/APK and required acceptance are verified.
