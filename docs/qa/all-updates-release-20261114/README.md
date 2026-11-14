# Combined Android release, 14 November 2026

[Android 0.2.119](https://github.com/xariib/Lumenfall/releases/tag/android-1000119); [signed build](https://github.com/xariib/Lumenfall/actions/runs/43646924641); source `a3d125a57fa2b5e54419e2a8774c63f356204518`.
APK SHA256: `c4e8ab61c5176e8c9cbdb6e759a1787d1de1afc09fd886888467f3091d2efabf`.

The released0.2.117 already contained current Lab/currency/Deeds work. PR50's
Bond display was missing; PR53 combines it with all current main improvements.
Only Bond presentation changes from that baseline. No gameplay, saves, paid
value, schema, package, signing or workflow changes. PR46 remains excluded.

- [Task/requirements](../../tasks/ALL_UPDATES_RELEASE_20261114.md).
- Local focused source, Bond mechanics/controls, Deeds core, Lab344/18 profiles,
  Deeds550/18, Formation12 and both Rift mobile checks: adjacent text receipts.
- [Independent paired replay](paired-replay.json):115200 one-second calls per
  source; all complete states, rewards and original canonical hashes match.
- [Exact-source readiness](release-readiness.json): eight PR/eight manual
  workflows and every required job/step. [Full log summary](ci-log-summary.json)
  includes actual deterministic scenario totals and compressed full logs.
- First Linux Wisp setup failure is preserved in first-failure43634001144
  JSON/log receipts (filenames include separators/attempt). Unchanged retry
  passed. Original300ms limit/assertions remain; cause unproven.
- [Integration](integration.json) and dispatch/workflow-status JSON retain exact
  branch/main/ancestry and build-concurrency checkpoints.
- [Public verification](android-release/public-verification.json) checks the
  successful native artifact, exact package/version/certificate, all packaged
  assets, upgrade/save retention, updater, installed Bond/Deeds behavior and
  retail normal launch, then matches anonymous versioned/latest APKs and feed.
  Native receipts/screenshots/logs are retained in android-release/.

Node24.22.1 local; Node24.19.0 full regression CI. Android12/WebView91 emulator
acceptance is not physical-phone or exact WebView60 DOM acceptance. Phone,
TalkBack, human design/pacing and independent review remain unverified. Review
was self-review plus automated checks; task/chat stays open for those checks.

Frozen local delivery/public-verification helpers are saved as gzip snapshots
for reproducibility; the canonical build/signing/gates remain the unchanged
repository workflows and scripts. No credentials are included.

The initial PR full run produced219 PASS result lines and failed only the first Wisp setup
check before any profile (same300ms ceiling). Its full original metadata/logs
are retained as first-failure-43633863368-attempt1 JSON/gzip. The full failed-job
retry passed unchanged; the manual full suite passed on its first attempt.

| Original failed run/attempt | Observed failure | Final disposition |
| --- | --- | --- |
| Wisp43634001144/1 | Original300ms setup settlement before causal assertions | Unchanged failed-job retry passed |
| PR43633863368/1 | Same Wisp setup ceiling;219 other case executions passed | Unchanged full-job retry passed |
| PR43633863368/2 |15s CDP touch deadline after16 Lab profiles/289 checks | Unchanged full-job retry passed |
| Native43639919453/1 | Retail UIAutomator no-root/idle; screenshot shows game, XML earlier startup | Unchanged full native retry passed; original36-file archive retained |

These passing retries do not establish the original timeout/inspection causes.
No game code, assertion, deadline or workflow was changed to obtain a pass.
The strict downloaded native candidate0.2.118 also passed source/
identity/assets, installed Bond/Deeds, save upgrade, updater and retail checks.
[Candidate receipt](android-candidate/verification.json). Its screenshots were
visually inspected (self-review); the separately published APK was verified again.

[Canonical failure-job logs](failure-log-summary.json) are captured directly by
immutable job ID, with hashes and original failed steps. The successful main
job logs each report190 deterministic scenarios; isolated offline jobs report1.
Older generic run-level CLI captures are incomplete-archive diagnostics, not
the canonical full-run evidence. Causes of that capture discrepancy were not
investigated. Per-job REST logs are the authoritative saved payloads.
