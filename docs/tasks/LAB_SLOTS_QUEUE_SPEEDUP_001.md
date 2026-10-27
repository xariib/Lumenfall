# Lab slots and Speed Up

User-requested branch changes, inspired by the two supplied research screenshots:

- Keep five visible Lab slots. Place research queue left of the timer.
- Speed Up opens a menu using the existing slot boost prices and duration choices.
- Queue OFF lets the active research finish. It only disables the next level.
- Switching research preserves its remaining paid work; resuming never pays again.
- Preserve saves, currency, existing unlock progression and paid slot boosts.

[Automated test receipts](../qa/lab-slots-queue-speedup-001/README.md).
Current scope: publish the branch, validate and merge to main, then publish a verified signed APK.
User authorization on27October2026: "Godkendt og send main og ny apk så alt virker".
The earlier branch-only checkpoint below is historical; upload, merge and release
are now explicitly authorized. Physical-phone acceptance remains separate.

## Continuation checkpoint — 27 October 2026

Local implementation: `1fdcc2cb`; product SHA256
`5ce88b6ce6f874935fd65e6182acab01069d0eaa61dab2ec904ec0c18419cc7f`.
Live main and the remote feature branch both still point to `35c52202`.
No feature PR exists. No merge, build or release was performed.

Rechecked locally: context/links and diff whitespace PASS; queue continuity64,
timed boosts1480, expansion2676, boundaries2346, workshop228 and modal452/18
mobile profiles PASS. The queue-stop negative control fails at its intended
assertion. Tests use Node24.22.1 and HeadlessChrome156. The full Chrome binary
cannot start under current socket restrictions; the supported headless browser
completed the menu tests. Required remote CI has not run for this candidate.
The previously failing original Lab UI scenario now passes at320/390/430px;
both original native-input and reduced-motion scenarios also pass. These are
Chromium input checks, not installed Android acceptance. Fresh results:
[`continuation.json`](../qa/lab-slots-queue-speedup-001/continuation.json).

GitHub upload of source, workflow and text test receipts was rejected by
automatic approval review: the continuation message was not considered explicit
authorization for that payload and destination. No workaround was attempted.
Screenshots remain excluded. Next: obtain explicit authorization to upload the
reviewed code, workflow changes and text evidence to
`xariib/Lumenfall:feat/lab-slots-queue-speedup-001`, then create the PR and finish
required CI. Main merge and APK publication remain separate later steps.
