# DEEDS_PROGRESSIVE_001 — one advancing card per Deed series

Status: integrated; exact-main validation and Android delivery pending.
Owner: current feature chat; no delegation.
Baseline: main `858d713f` (Android 0.2.111). Isolated branch
`feature/deeds-progressive-001-work`, worktree `validation-evidence/deeds`.

## Original request — 14 November 2026

“The deeds list should not be like reach right 10 20 30 and have a box,
it should have one box, where the next milestone always increasing with
what you reach. This goes for every deed on the list.” Repeated after an
interrupted startup; no product files were edited before interruption.

## Scope and acceptance

- One card for each existing milestone series. Its title, progress, reward and
  unlock describe the next unearned milestone; advance when rewards are earned,
  including skipped thresholds and offline catch-up. Show the last milestone
  completed after the existing series is exhausted.
- Group Rift, strikes, Ascends, offline time, original Project levels, current
  Lab levels, paid Forge levels, total Mastery ranks and enemy defeats. Different
  counters and multi-condition automation challenges remain distinct Deeds.
- Keep completed milestones/reward/unlock information in a compact disclosure
  inside the same card. Single-goal Deeds retain one card and completed status.
- Preserve every existing Deed identity, eligibility, fixed reward, unlock,
  pending-credit receipt, save/schema, automation and all unrelated gameplay.
  This is a presentation change; it adds no new targets or repeatable payouts.
- Cover all series/threshold transitions, reload, resets, out-of-order legacy
  flags, pending credits, render purity and idempotent rewards; mobile fit at
  320/390/430 px and 100/150/200% text; native disclosure/focus stability.
- Run relevant existing regressions and required CI, integrate and verify the
  signed Android delivery per [feature workflow](../project/FEATURE_WORKFLOW.md).
  Physical-phone/WebView60/TalkBack acceptance must be reported accurately.

## Baseline and overlap

Read root instructions, bootstrap, current state, context index/start guide,
workflow and the original [Deeds expansion](WORKSHOP_CARD_CLARITY_001.md) and
[automation requirements](LAB_OFFLINE_DEED_PACING_001.md). Current code has
76 receipt identities, 72 visible cards, 49 long-tail milestones and fixed
total rewards of 1,983 Comets. No open PRs at startup. Other local worktrees
include currency HUD, simple Lab and Rift bond display; do not edit them.
First worktree creation failed on long archived paths and rolled back; the
isolated checkout succeeded with Git long-path support. Root checkout untouched.

## Implementation and checks

Product SHA256 `8505c177d642b372d69f8b56f568f581ea44709ab9d3f14c3d4aaa6505bd11ff`.
Nine series plus eight distinct challenges now occupy 17 cards. The next
unearned receipt determines the title/progress/reward. All earlier earned
milestones share a native history disclosure; pending rewards remain visible
beside the next target. Exhausted series retain their last completed milestone.
Every card gives its content the full text column and places its reward below,
preventing midword clipping at 320px/200% text. History focus/open state survives
refresh and multi-threshold catch-up. No save, reward or eligibility code changed.

Changed files: root index.html; focused deeds-progressive core/UI tests;
existing bridge/harness, clarity, Inquiry and navigation fixtures/selectors;
source-bound offline reference; scoped offline verifier; this task and evidence.
The core and mobile checks run through the existing required clarity gates.

Baseline workshop-card-clarity: PASS 417 checks before editing. Candidate:
313 focused series/receipt checks, 417 existing clarity checks, 1,070 combined
native mobile checks (18 Lab/card + 18 Deeds profiles), 1,071 original rendered
Deed checks, 237 Inquiry checks/one causal control, 6,281 Forge checks/four
controls PASS. Mobile source-bound receipt and inspected 320px/200% image:
[evidence](../qa/deeds-progressive-001/README.md). Source syntax/context/diff PASS.
Local Node 24.22.1, Chrome 157.0.8103.78; CI pins Node 24.19.0.

The old generate-offline-swift-golden helper failed its obsolete pre-release
aggregate expectations. Its four actual endpoints exactly matched the existing
released reference. The scoped verify-deeds-offline helper independently replayed
all 115,200 one-second calls and asserted every aggregate AND full-state digest
against that released reference before updating only its product source hash.
All four endpoints PASS unchanged. The old helper/tests were not weakened.
First browser run inside the restricted Windows sandbox could not load the
local application; the unchanged driver passed outside that sandbox. No product
error was used as evidence of success. No independent review or phone acceptance
is claimed. No new binding project rule.

Navigation `r3-destinations` also PASS on the same product source.

Next: publish candidate/PR, run required CI,
review/integrate exact accepted tree, then signed Android delivery and evidence.

PR: [52](https://github.com/xariib/Lumenfall/pull/52), initial candidate e655d3b4.
Initial pre-merge43574433155 stopped at the existing hunt task's startup budget:
shared19,248 + task13,782 =33,030 bytes, above32,768. Reproduced locally on the
unchanged baseline task. Only that workflow task exceeded the gate. Preserve its
full original bytes in qa/exploit-balance-hunt-001/task-before-deeds-20261114.txt
and compact superseded provisional checkpoint prose; retain requirements,
decisions, final delivery evidence and the unchanged gate. This prerequisite
documentation fix changes no game code. Rerun required CI on the new head.

Android acceptance now also checks the actual installed APK's17 advancing cards,
the upgraded Rift1000→2500 target, preserved old/long-tail milestones and native
touch opening history through periodic refresh, with a screenshot in the normal
signed-upgrade receipt. This extends the existing Android gate without changing
production hooks, signing, fixtures' original assertions or workflow triggers.

## Current-main integration checkpoint

Main advanced to7f149b89 with the currency-header update while4374ff62's final
broad scenario run was still running; its other seven workflows and isolated
offline job had passed. Merge current main into this isolated branch. The only
content conflict was the product SHA binding in the offline reference; retain
its identical full-state endpoints and rerun the independent verifier before
rebinding. Preserve the currency work and its status/evidence without claiming
ownership. Git merge also required Windows long-path support for archived names.

Combined product SHA256:
`d58a8edc12f0ed340b8fbb1126bb3eb139bfbe328119743201deb3e7bdc3c7fc`.
313 focused/417 existing core checks and548 Deeds checks across18 mobile profiles
PASS on these combined bytes. [Combined mobile receipt](../qa/deeds-progressive-001/integrated-mobile.json).
Next: finish exact offline replay, commit the merge, run required CI on the
combined candidate, integrate accepted source and complete Android delivery.

## Live delivery checkpoint

PR52 combined head `b94566220f79026314e19c16e3e6ea2cab8311b0`, main parent
`7f149b895c9f90656bbb81766249665ed1f426fc`. Seven applicable workflows and
isolated offline catch-up PASS; full190-scenario run43579634291 is still running.
Source hash remains d58a8edc above. All local changes since this head are delivery
evidence only; keep source CI stable and publish the final evidence afterward.

Nonpublishing signed Android43580030101 first attempt132404033321 passed
package/certificate/assets, security, both saves and paid-work upgrade retention,
then failed the existing offline-recap assertion BEFORE new Deeds checks.
Diagnostics show a credited60.373s, ready=true, empty recap/display:none, normal
Rift screenshot. No JS exception or cause is established. The prior-main build
passed this stage (it failed later retail launch). Preserve raw state/screenshots
and compressed logcat in [first failure](../qa/deeds-progressive-001/android-first-failure/receipt.json);
artifact14108282284 SHA25660b7e07625fe02b0025d697a355b757f47e7073e320ff2d708064e51028ab1c8.
One unchanged-source retry requested; current job132407371362 is in native upgrade.
No deadline, assertion or product behavior was relaxed.

Next: inspect the original full-scenario result and this native retry. If native
fails again, diagnose/instrument the reproduced condition before further retries.
If accepted, refresh/check actual main via Git (connector PR base metadata can lag),
integrate the accepted tree, dispatch required exact-main gates using the ignored
validation-evidence/deeds-delivery.cjs helper, then signed publication, anonymous
public APK/assets/feed verification and final durable status. Leave physical
phone/WebView60/TalkBack/human acceptance open; do not archive prematurely.

Native retry job132407371362: upgrade, both saves/paid work, updater and ALL new
Deeds assertions PASS on signed test0.2.113, APK SHA256
1e832871b696a55521a834c7254f662f510dd7e2a67f5e14863a01cbcdfba998.
Retail launch then failed: stock UIAutomator repeatedly reports no idle state;
the screenshot shows a running Rift while XML omits game controls. This is
still a failed required gate, not a production-launch pass. Preserve artifact
14108544750 (SHA256ab9e794fa10c0a6a45b4b6e17ef06e6f6b6626ffe9aa0bf709b79cd16f002d93)
and [actual Deeds/save/updater receipts](../qa/deeds-progressive-001/android-second-attempt/emulator-upgrade.json).

Actual overlap: the currency worktree is already diagnosing this identical
retail failure in scripts/ci/verify_android_release_runtime.cjs. Its isolated
c737fd3e diagnostic compares pinned released0.2.111 under the original assertions
and still fails any rejected candidate; no acceptance is relaxed. Run43581066569
is at that comparison after a retry (earlier updater metadata failure is recorded
by its owner). Read its task/checkpoint before editing the same shared helper.
No chat/subagent/message coordination is authorized. Main remains7f149b89;
our source/required gates remain unchanged. Next: inspect the shared baseline
comparison and full-scenario run; resolve the shared retail gate before publishing.

## Integration

All eight applicable PR workflows PASS on b9456622, including190 deterministic
scenarios, full runtime smoke and isolated offline catch-up. Two conditional
Prism workflows correctly skipped. [Exact CI jobs/steps/artifact identities](../qa/deeds-progressive-001/b94566220f79026314e19c16e3e6ea2cab8311b0-ci.json).
PR52 merged at `7448cc0b96b175fcd9989570840c12ba47486afa`; its complete tree matches
the accepted candidate. Product remains d58a8edc above. The shared c737fd3e
diagnostic's unchanged normal retail path passed on retry (43581066569,
job132409549536); its failure-only baseline comparison was not invoked. This
does not establish the cause of prior inspection failures and is not a retail
pass for our APK. Own first/second attempts remain preserved and failed overall.

Next: save this integrated checkpoint to main, run all required exact-main
validation workflows, then publish a signed build only after its full native
upgrade/updater/Deeds/retail acceptance and release guards pass. Verify public
bytes/assets/feed and save final status. No checks/assertions/deadlines weakened.
