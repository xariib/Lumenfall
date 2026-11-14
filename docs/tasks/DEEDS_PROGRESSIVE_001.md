# DEEDS_PROGRESSIVE_001 — one advancing card per Deed series

Status: integrated; final-source main validation and Android delivery pending.
Owner: current feature chat. Existing-chat release coordination authorized by the
human in Rift thread01a1d77b-4453-7a21-9961-55d70c6cd963; verified its explicit
“Yes, coordinate those two chats” reply. No delegation or new chats.
Current product SHA256: `552b28dc1c5a0c161c97eb70acc8c7589add4136caa8414e650b6956d3037b28`.

## Original request — 14 November 2026

“The deeds list should not be like reach right 10 20 30 and have a box,
it should have one box, where the next milestone always increasing with
what you reach. This goes for every deed on the list.” Repeated after an
interrupted startup; no product changes preceded that interruption.

## Implementation, scope and acceptance

One card per existing series. Its title, authoritative progress, reward and
unlock describe the next unearned milestone; advance after earned receipts,
including skipped goals/offline catch-up. Completed goals/rewards/unlocks share
a native history disclosure. Pending credit remains visible outside it. Exhausted
series retain their last completed goal. Nine series (Rift, strikes, Ascends,
offline time, original Project levels, current Lab levels, paid Forge levels,
total Mastery, defeats) and eight distinct challenges now use17 cards instead
of72. Different counters and multi-condition challenges remain distinct.

All76 saved identities, eligibility, fixed1,983-Comet rewards, unlocks and save
data remain intact. No new target, payout, balance/cap/counter/schema/migration.
Preserve paid work, currencies, automation, chronological online/offline behavior,
mobile accessibility/WebView60 compatibility, com.lumenfall.app and the established
signing key. No new transient highlights or binding rule. Self-review only.

Cards give text the full column and place rewards below. History keeps focus/open
state across refresh and advancement. Final review preserved the paid-Forge
counting explanation for later goals and the same Details identity across60→100;
reuse the first goal's scope when the current goal has none. This restores
existing information and disclosure focus without changing gameplay.

Acceptance: all series/thresholds, completion/old flags, exact pending/reload/reset/
idempotent rewards/render purity;320/390/430px at100/150/200% text and both motion
settings; original regressions and required exact-main CI; signed save upgrade,
updater, actual Deeds touch, retail normal launch, public APK/assets/feed checks.
Physical-phone/WebView60/TalkBack/human review remain separate unverified checks.

## Baseline and integration

Baseline main858d713f, Android0.2.111. Isolated branch
feature/deeds-progressive-001-work in validation-evidence/deeds; root/other
worktrees untouched. Read root/bootstrap/state, start/context,
[workflow](../project/FEATURE_WORKFLOW.md), [original expansion](WORKSHOP_CARD_CLARITY_001.md)
and [automation requirements](LAB_OFFLINE_DEED_PACING_001.md). Initial original
clarity suite PASS417. Windows archived names required Git long-path support.

[PR52](https://github.com/xariib/Lumenfall/pull/52) merged at
`7448cc0b96b175fcd9989570840c12ba47486afa`, identical complete tree to accepted
candidate b94566220f79026314e19c16e3e6ea2cab8311b0. This includes main7f149b89's
currency header; its ownership is not claimed. Eight applicable PR suites PASS:
220 executions/190 scenarios, isolated offline, runtime smoke; two conditional
Prism lanes correctly skipped. [CI](../qa/deeds-progressive-001/b94566220f79026314e19c16e3e6ea2cab8311b0-ci.json),
[scenarios](../qa/deeds-progressive-001/candidate-scenarios.txt). Its source was
d58a8edc12f0ed340b8fbb1126bb3eb139bfbe328119743201deb3e7bdc3c7fc.
Main evidence checkpoint e67c984f7faf120818f5285175751586a1cf43cd started validation;
it is superseded for release by the final Details-preservation fix/current hash.

Changed areas: index.html; focused core/UI and existing bridge/harness/clarity/
Inquiry/navigation tests; bound offline reference/verifier; Android Deeds
acceptance; task/status/evidence. New checks run through existing required clarity
entrypoints. Workflows, gates, assertions and deadlines are preserved.

## Current-source checks and evidence

Node24.22.1/Chrome157.0.8103.78 locally; full CI pins Node24.19.0. On552b28dc:
313 focused +417 original clarity checks PASS;1,072 UI checks/36 profiles PASS,
including Forge scope/focus advancement; original rendered Deed contract1,071
PASS. Source/Android-driver syntax and diff checks PASS.115,200 independent
one-second calls retain all four exact released reward tuples AND complete state
digests before rebinding only the source hash. [Current replay](../qa/deeds-progressive-001/final-replay.json),
[mobile](../qa/deeds-progressive-001/final-mobile.json), [image](../qa/deeds-progressive-001/final-320-200.png).
Earlier source also passed237 Inquiry checks/one control,6,281 Forge checks/four
controls, navigation and the stuck-first-target control. [Full evidence](../qa/deeds-progressive-001/README.md).
Repeat every required integrated gate/native acceptance on the final source.

Native fixture follow-up: replaying the exact first failed snapshot produces no
kill/reward/study completion in60 or60.373s, so the game's meaningful-progress
predicate correctly returns false. [Reproduction](../qa/deeds-progressive-001/recap-precondition.json).
The native test had not guaranteed its recap precondition. Only AFTER original
save/paid-work retention passes, its disposable recap fixture now farms Rift1
with an enemy reset through normal startup. Product HTML/JavaScript remain
byte-identical552b28dc.99 focused checks prove actual offline earnings, unchanged
paid/wallet/progression fields, full-minute credit and a negative control that
reproduces the empty-reward failure when setup is removed. The existing10-check
clock/replay fixture suite and its negative control also pass. Original popup,
visibility, input, retention and deadline assertions remain unchanged.
[Fixture acceptance](../qa/deeds-progressive-001/native-recap-precondition.json).
These checks run from the existing required clarity core entrypoint. Repeat the
exact-commit main gates/native build after integrating this test-only correction.

## Preserved failures and overlap

- Initial CI reproduced the old hunt task's33,030-byte startup over32,768.
  Its original13,782 bytes are preserved in
  qa/exploit-balance-hunt-001/task-before-deeds-20261114.txt, SHA256
  53ff7d857396b83ebeb3ae45176151f6a4cc573206db99e689a5e23dad768aa3. Compact only
  superseded provisional prose; requirements/final delivery and the gate survive.
- The old golden generator's obsolete aggregate assertion failed, while actual
  endpoints matched the released reference. The scoped verifier independently
  asserts that exact reference before rebinding; no oracle was weakened.
  Restricted-sandbox Chrome readiness failed; unchanged outside-sandbox runs pass.
- Signed test0.2.113/run43580030101 used prior d58a8edc source. First attempt
  132404033321 failed recap presentation after crediting the minute; the missing
  meaningful-reward fixture precondition is now reproduced above.
  [Preserved failure](../qa/deeds-progressive-001/android-first-failure/receipt.json).
  Unchanged retry132407371362 passed package/key/assets, both saves/paid work,
  updater and every17-card/next-target/native-history check, then failed retail
  accessibility inspection: game visible, stock UIAutomator lacked idle state,
  XML omitted controls. [Native receipt](../qa/deeds-progressive-001/android-second-attempt/emulator-upgrade.json).
  This remains a failed required gate, not a retail pass. Both raw artifacts,
  screens and hashes are retained. No root cause is proven or deadline relaxed.
- The currency work already investigates the same shared retail helper. Its
  c737fd3e failure-only diagnostic passed the unchanged normal path on retry
  43581066569; baseline comparison was not invoked. This is separate evidence,
  not a pass for our APK. Avoid duplicate edits to its actively investigated file.
- Prior e67c984f Linux Wisp43583804720 failed CDP Browser.getVersion with0 game
  assertions/reflows. [Raw result](../qa/deeds-progressive-001/main-wisp-startup-failure.json).
  Its unchanged failed-job retry passed Linux/Windows and all controls. These
  prior-source checks do not substitute for final-source main validation.

## Next concrete action

Main5f0d976210eb62fa37917129bd7e8bc453806d8e includes the fixture correction.
Its signed nonpublishing Android0.2.116/run43591494545 PASS: actual Deeds touch,
save/paid-work upgrade, updater and unchanged retail normal-launch/security checks.
APK SHA2562ef5c469256f02968622f4a0761a0d06ee0beefbbaf58c7af593b4e5377091b4.
Seven focused main gates PASS. Premerge43591454422 passed all Deeds checks but
stopped during another Lab touch test after37 checks with CDP deadline
Input.dispatchTouchEvent. This is a failed gate, not complete acceptance.

The human authorized serialized delivery with existing Rift/currency chats.
Rift owner incorporated5f and will own one combined source, integration and signed
publication. Hold further main pushes/builds; evidence stays on this branch.
All our own runs already completed, so no cancellation needed. Verify Deeds
acceptance on the exact combined commit and native/public APK when supplied;
record required CI and retained failures, then update task/project status through
the serialized integration. Verify anonymous versioned/latest APK bytes, packaged
assets, identity and feed. Physical acceptance remains open; do not archive early.

[Byte-preserved earlier checkpoint](../qa/deeds-progressive-001/task-before-final-detail.txt)
retains full earlier milestones/versions/diagnostics. This compaction keeps startup
under32KiB without changing rules or discarding historical evidence.
