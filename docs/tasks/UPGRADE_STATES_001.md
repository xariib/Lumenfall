# UPGRADE_STATES_001 — consistent upgrade presentation

Status: in progress. Owner: this feature chat; no delegation.
Baseline: origin/main `b075cfba`; isolated `C:/lf-upgrade-states`, branch
`feature/upgrade-states-001`. Original checkout and other worktrees preserved.
GitHub open-PR search on 17 November returned no open PRs. Main integration
must be checked again before delivery; other feature worktrees exist.

## Original requirement — 17 November 2026

> Also every maxed out upgrade should be goldboxed. If it can't be purchased,
> then it should not show what it costs, but how to unlock it. Also if it's
> purchaseable but you need currency, then that currency text have to be red.
> This goes for all the game.

Standing rule communicated before applying: Every maxed upgrade has a gold
border. Upgrades blocked by prerequisites show how to unlock them instead of
a price. Eligible upgrades show prices, with each insufficient currency amount
in red and the purchase button disabled.

Scope: Wisp Recruit/Empower, Rarity, Ability, Ultimate, Mastery, Forge, Lab,
Tree and Comet upgrades, including passive refresh and individual capped
sub-upgrades. Preserve purchase eligibility, prices, balance, caps, paid work,
queues, progression, saves, keyboard focus and touch behavior. No migration.

## Acceptance and baseline

- Maxed upgrades have visible static gold borders and no purchase price.
- Locked upgrades show sufficient unmet prerequisites and no price.
- Eligible upgrades retain exact prices; each deficient resource is red;
  unaffordable buttons are disabled. Wallet/prerequisite changes refresh UI.
- Focused browser regressions cover each family and transitions; existing
  relevant checks, required CI and integrated version checks pass.
- Signed Android build/update/save acceptance and public delivery follow
  [feature workflow](../project/FEATURE_WORKFLOW.md). Physical-phone,
  exact WebView60 DOM and TalkBack evidence may remain unavailable.

Observed baseline: Forge/Lab have gold cap styles; Wisp ability gold depends
on Ultimate ownership and Tree lacks a gold cap state. Wisp non-Rift locks
still show prices. Existing affordability test explicitly expects prices for
level-locked rarity; update that superseded assertion with locked-state coverage.
Baseline source validation and 417 workshop checks passed on `b075cfba`.
The first Edge attempt exited before browser checks. Downloaded Chrome for
Testing157 and its headless shell for actual DOM acceptance. The old locked
rarity price assertion failed as expected against the requested new behavior;
it now verifies unlock instructions and no price. Shared currency coloring,
purchase eligibility and numeric prices remain authoritative and unchanged.

## Implementation checkpoint

Gold borders now survive chapter CSS for capped Tree/Comet upgrades and each
Wisp Empower/Rarity/Ability/Ultimate/Mastery component. Wisp prerequisite locks
replace prices with unmet requirements; the same helper refreshes existing
buttons without detaching them. Lab challenge/slot locks show their next action
instead of prices, including live challenge/confirmation updates. Empower
prices can wrap at200% text. Unavailable Forge prices are hidden.

Full-cap browser fixtures exposed a pre-existing Rift advice crash: the most
advanced Wisp could already have Mastery2000 and no next requirement. Advice
now selects only uncapped Mastery and returns no Mastery advice when all cap.
This necessary fix has dedicated single/all-Wisp cap browser coverage.

Initial accepted UI candidate SHA256
`3998ae3b995f84121a212ede9d0b10db836abb345e9b227d9b3239090b5a13a4`.
Source validation, workshop417, team progression1,228/seven controls and
guidance191 passed. The canonical original offline-catchup generator reproduces
all four released full-state hashes (722/618/1161/678 kills, zero automatic
Ascends/Prisms); only its source binding changes. The initial alternate helper
used different endpoint accounting; its mismatch is retained, not accepted.

One complete Chrome run passed14,778 assertions/six320–430px and100/200% text
profiles, but failed browser shutdown and is recorded as FAIL. Final headless
acceptance passed15,252 assertions/six profiles with clean shutdown. All three
causal controls failed at the expected gold/lock/red assertions with clean
shutdown. Startup/shutdown failures are retained; they do not count as causal
controls. Save-preservation assertions now compare
within the operation's JS turn, excluding unrelated real visibility-event saves
between CDP requests. Real save and purchase functions remain active.

Changed files: `index.html`, `AGENTS.md`, this task, upgrade affordability and
new upgrade-state browser tests and the canonical offline binding. An initial
push was rejected because its OAuth credential lacks workflow scope; no remote
branch was created by that attempt. The new regression and three causal controls
now run through the existing required affordability `--negative` gate. Existing
workflow files and all prior assertions/controls are preserved.
Self-review only. No gameplay price, cap, balance, schema or save reset changes.
Next: complete final browser/controls, save evidence, open PR and run required
CI; integrate only after passing checks, then signed Android acceptance/release.
Integration/build not yet started. Physical-phone/WebView60/TalkBack remain open.

## PR61 checkpoint

[PR61](https://github.com/xariib/Lumenfall/pull/61), initial head `2518e7e8`.
Wisp scroll, Comet/Deeds, permanent progression and isolated offline CI passed.
Initial main job44064381284 failed before gameplay checks: shared startup plus
the exploit task exceeded32KiB after the new rule/status; the Forge/Lab task was
already58 bytes over on main. Duplicate12 November summaries were already
preserved in the linked14 November history. Shortening those duplicates gives
31,497/31,954 bytes for these two tasks with the unchanged32KiB gate; no source
history, requirements or evidence was deleted. Main CI must run again.

Local existing affordability entry hit its unchanged240s subprocess deadline
before producing a receipt. Its log is retained; final15,252 focused assertions
and three causal controls passed separately. Linux required-entry acceptance is
still pending. No deadline or assertion was weakened. Other openPR59 (Forge
caps) andPR60 (Rift screen) are separate; recheck main before integration.

Paid-cap candidate SHA256
`dad915b4352abc95c234b30184eeacbab23302367f0f30036583e9fa95bba726` also
marks capped running/paused paid Lab cards gold, retaining all work/free resume.
Its canonical four-window full-state hashes still match main. All15,264 focused
browser assertions/six profiles passed before a Windows shutdown failure;
that run is retained as FAIL, pending clean Linux acceptance. Original Wisp
layout passed2,204 assertions/one profile before a Windows initialization/close
failure. CI9f2 caught its obsolete universal plain-Module assertion; the new
conditional strictly requires gold at cap and retains plain unfinished panels.
These are requirement updates, not relaxed layout or timeout checks.

Current product SHA256
`e174cec921c5c7e0c6c51d5f5b9a505537f9a04d2db97ca90bfbe98c31cab909`.
CI5467 caught an incidental case/wording change in the free-resume confirmation.
Restored its exact original text and normal price-only confirmation presentation;
the original Lab test is unchanged. All18 native Lab profiles then passed locally
before the appended menu-offset check failed (505 assertions). Baseline/current
menu comparison passed398 checks/12 profiles on both released main and candidate;
the earlier partial combined run remains FAIL with unproven cause. Canonical
four-window hashes remain exactly unchanged. Full current-head CI remains next.

Horizontal-row candidate SHA256
`cd2f1e7927db77e6956b0b8f3245bfee2a47f8042cc55c2a86a0d7a8db621ffd`.
CIb0 passed the complete Lab-simple sequence, then caught an introduced Empower
horizontal-layout regression in the existing p1-05 control scenario. Restored
the original nowrap button row, wrapping only its price text. The unchanged
p1-05 scenario passes locally, including44px targets, focus, live states,
contrast and affordability funding. New focused checks additionally assert
horizontal44px Empower rows together with long-price fit. A local focused
retry timed out before initialization (zero checks); retained as FAIL.
Canonical endpoints remain unchanged. Required CI must rerun on this version.

Current product SHA256
`84917eaf8409576346d3aa904ef6efa9d4253f8befa77ece5a7da3cae30de7c2`.
Locked Ability now uses the existing single “Recruit first” instruction so
control-state presentation cannot append a second recruitment hint. Focused
coverage asserts one instruction. Canonical full-state endpoints remain
unchanged. Next: complete exact-head CI, integrate serially, run integrated
checks, then signed Android delivery. No further source changes are planned.

## Current continuation checkpoint — 17 November, 12:28 UTC

Owner: this feature chat, one game-wide upgrade-presentation goal; no delegation.
Original requirement/rule and preservation scope are above. Repository
`xariib/Lumenfall`, baseline/main last checked `b075cfba`.
Feature [PR61](https://github.com/xariib/Lumenfall/pull/61) stays at
`be015365469d200aeb2bd2444318c3172d1d8df7`, product SHA84917 above.
Local `C:/lf-upgrade-states` is now on `evidence/upgrade-states-001`, preserving
new receipts without restarting the exact-source feature CI. Product bytes
remain identical to the feature head; working-tree changes here are evidence.

Implementation/self-review complete; integration and APK delivery pending.
Current-source local Node24.22.1/Chrome headless157 checks:15,402 assertions/six
320–430px,100/200% profiles; three gold/lock/red causal controls; original
unmodified Wisp native467 checks/12 original +12 Team profiles; clean shutdowns.
[Receipts](../qa/upgrade-states-001/current-source/upgrade-states.json),
[native replay](../qa/upgrade-states-001/current-source/wisp-native.json).
Four canonical offline full-state endpoints match main exactly. All30 required
task-context checks pass; original32KiB limit unchanged. No price, cap, balance,
schema or saved progression changes. Existing assertions/deadlines remain.

Seven PR specialist workflows PASS on headbe015365. Pre-merge run44072682657
attempt1 stopped at native touch/check319; cause unproven, prior released-source
history retained. Attempt2 passed that lane and189/190 main scenarios. Its one
failure expected a currency price for prerequisite-locked Expanded Apparatus,
superseded by this task. The narrow test branch now verifies accessible name,
no price and each unmet requirement/progress; other original checks remain.
Product bytes/deadlines unchanged. Local424 browser assertions pass but process
shutdown times out, recorded FAIL. New-head CI required. Isolated offline PASS.
[Failure/change evidence](../qa/upgrade-states-001/ci-nav-assertion.json).
[Detailed checkpoint](../qa/upgrade-states-001/continuation.json).

Next: push revised test/evidence toPR61, finish complete new-head required CI,
recheck main/open overlap and merge onlyPR61. PR59/60 remain separate.
Verify integrated source/tree, dispatch all six release-gate workflows plus
permanent/Wisp/migration checks on exact main. After all pass, dispatch existing
Android build with publish=true; verify signing/package, save upgrade/updater,
retail launch and anonymous APK/assets/feed. Save final delivery/status on GitHub.
Temporary authenticated API/dispatch helpers are under `C:/tmp/lf-*.cjs`;
workflow definitions remain authoritative. No missing requirements/permissions.
Standing authorization applies; do not ask for approval. No new chats/messages.
Physical phone/exact WebView60 DOM/TalkBack unverified; task/chat stay open and
unarchived. Resume from current state, never restart or replace live product.
