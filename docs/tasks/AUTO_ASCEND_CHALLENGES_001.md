# AUTO_ASCEND_CHALLENGES_001 — earn Auto-Ascend Ritual

Status31 October2026: integrated; CI and signed installed-emulator acceptance PASS.
Physical acceptance remains open; do not archive. Owner: this feature chat, no delegation.
[PR31](https://github.com/xariib/Lumenfall/pull/31), integration
3f74661b69a30791518a2a67e27193269741ed43. No public release.

## Original requirement and accepted decision

30 October: “Auto ascend ritual is too easy to unlock. There must be some
challenges there too.” User accepted the recommended set with “Let's take that”:
25 Ascensions, highest Rift150,50 completed current Lab levels across6 subjects,
plus the existing100 Comets. Every condition is required with visible live progress.
Saved milestones count; existing owners keep ownership, targets and automation.
Retired subjects and unfinished paid/paused work do not count. No new save fields.

Previously the Ritual cost100 Comets without gameplay prerequisites. Implemented
canonical first-purchase authorization, four counters/checkmarks, visible/red-if-short
price and disabled purchase, wrapping card/button, and the locked Ascend shortcut
to the challenge card. Shop viewport preservation handles the tall list disappearing
on purchase. Other callers keep their old viewport policy. Prices, other purchases,
paid work, saves/recovery, rollback and automation remain intact.

Original baseline41566c97 (PR28). PR30 Rift navigation advanced main during final CI;
its source/tests/Android checks were retained. Pending Tap PR29 head1fb827ea became
an integration dependency, then merged at941538d0 before PR31. Its tap/timing work
remains owned by that feature; the Ritual change makes no simulation changes.
Branch feature/auto-ascend-challenges-001, worktree ../auto-ascend-challenges-001.
Git-data publishing verified all blob/tree identities because ordinary push lacked
credentials. The managed nested sourceRoot failed, so a native Git worktree was used.

## Integrated identity and validation

CI head2a3a54ab265bbed8635dbe58e715e91a1c4445db,
treeae70d59d1e58448fabd450aea2d05e02a82f88df.
Product SHA256 e5f2ee84f7422461b0f9b1e66d59567fd01d49437617d46475f725f08842d5fa.
All seven required workflows/nine jobs PASS, with190 main scenarios plus1 isolated
offline scenario and runtime smoke. Actual staged source matches the product hash.
[Exact CI/integration receipt](../qa/auto-ascend-challenges-001/ci-final.json).

Main92e7497d added only13 Tap delivery-document paths beyond the tested candidate.
The cached GitHub test-merge ref still used the old base, so a local review merge
computed the current-main result. All non-documentation files match CI exactly;
context checks passed. Integrated tree930fc9e1964653473ad252b6876e84ab089cd5da
exactly matches that reviewed tree. The differing full trees are not called equal.
Local HEAD was aligned to the real integration commit only after verifying equal trees.

New actual-IIFE suite PASS118 assertions/seven causal controls: independent missing
goals and rich-wallet/forged-quote rejection, exact100 debit, duplicate rejection,
real25th Ascend/Rift150, current/retired/unfinished Lab work, saved ownership across
schemas0..6, export/recovery, primary/both-failure rollback and successful-primary
recovery-only policy. [Combined core proof](../qa/auto-ascend-challenges-001/tap-combined-core.json).
Existing Comet12 cases/two timer controls also PASS. The main CI executes the new
core and both phone/text/motion modes, plus both original native target modes.
Original payment/focus fixtures earn the new goals; original assertions remain.

Initial fixture failures and the introduced purchase-scroll jump were fixed before
integration. Earlier main963557f6 passed187/189; native purchase fixtures needed
Rift150/earned goals and then passed20 local profiles. Earlier maina54912a8 passed
188/189; its enemy HP snapshot observed host-startup combat. Pause only the two
static reload measurements from boot; original HP/save assertions and0.0005
tolerance stay unchanged. Both pass, and deliberate HP resets still fail both.
[Observer proof](../qa/auto-ascend-challenges-001/enemy-reload-observer.json).
[Prior188/189 run](../qa/auto-ascend-challenges-001/ci-attempt-a54912a8.json).
All190 current main cases PASS. Prior failures remain failures, not retroactive passes.

Independent one-second replays each made115200calls/four8h windows. Current candidate
and unchanged Tap dependency have identical actual full states on Windows
Node24.19/24.20 and Linux Node22.23.4. Reward triples match the accepted Tap reference.
The recorded dependency full hashes are not reproduced by either control or candidate;
retain its vectors and record that upstream provenance limitation. No recorded-hash
match is claimed. [Qualified replay](../qa/auto-ascend-challenges-001/independent-replay-tap-combined.json)
and [Linux proof](../qa/auto-ascend-challenges-001/android-combined/independent-reference.json).
Earlier pre-Tap replay outcomes/full hashes and source-qualified UI/native receipts
remain in this QA directory and Git history. No gate, timeout or assertion was weakened.

## Android delivery and remaining acceptance

Signed test0.2.65/code1000065, package com.lumenfall.app, build41135590295 PASS.
APK SHA25621afa8eef0a1ddeb940cf3a6adbb6d5ee3304f246c4a75e536422b59ef448974.
Established certificate A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21.
Exact packaged assets/origin match integrated source. Installed Android12/API31/
WebView91 upgrade retained UID/origin, both saves, paid progress and old Ritual
ownership below25 Ascensions; native Wisp and direct Rift navigation PASS.
[Android receipt/artifact metadata](../qa/auto-ascend-challenges-001/android-combined/build.json).
Local APK: ../auto-ascend-challenges-android-combined/Lumenfall-0.2.65.apk.
Artifact13017206621 was downloaded and its archive/APK digests verified. No publication.

User chose “I'll enable browser use”; the browser API still reported disabled.
Native Computer Use stopped because it could not verify the browser URL on Windows.
No further UI actions occurred. A supported Git-data fallback used an isolated
branch-specific push trigger and paired reference step; only the build workflow
differed from the exact candidate. After success, retirement0b9a520c restored its
complete tree. Main's workflow is unchanged. Test0.2.63 is superseded earlier-base proof.

Self-review/automated validation only; initial automated review covered4c6e1fce.
No independent human final-head review is claimed. Physical phone, exact WebView60
DOM, TalkBack and human pacing/performance remain unverified. The user has been
asked to test the latest0.2.65 update/progress/challenges or retained ownership.
Keep this task/chat open per [feature workflow](../project/FEATURE_WORKFLOW.md).
Next: record that device feedback, resolve relevant findings, and update acceptance.
No source changes or further shared-file implementation work are pending.
