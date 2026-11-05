# Debug evidence — 5 November 2026

Request: "Run perfect debug". Baseline main ab7aa2dd, Android 0.2.95.
Test head 2c2e0f3, GitHub test merge 68e649a; product SHA-256
1173423bdb0d899616bd3a77b4f3931d8bcde5f5b67d90209f27a1b01f2e65e4.
Product, tests, gameplay, paid work and saves were not changed.

Follow-up: [Windows Wisp assertion fix](../windows-wisp-scroll-001/README.md),
PR41/main 87e58545, resolves the intermittent assertion described below. It was
a test race with the tab entrance animation. Original thresholds, all 3,277 Wisp
checks and Windows/Linux causal controls pass; gameplay remains unchanged.
The original run and cleanup limitations below are retained as historical evidence.

Six Linux workflows pass: [Lab](https://github.com/xariib/Lumenfall/actions/runs/41979874689),
[Forge](https://github.com/xariib/Lumenfall/actions/runs/41979874588),
[Tree](https://github.com/xariib/Lumenfall/actions/runs/41979874672),
[Comet/Deeds](https://github.com/xariib/Lumenfall/actions/runs/41979874544),
[permanent progression](https://github.com/xariib/Lumenfall/actions/runs/41979874570),
[shared UI](https://github.com/xariib/Lumenfall/actions/runs/41979874645).
[Pre-merge](https://github.com/xariib/Lumenfall/actions/runs/41979874650) also
passed on attempt 2: all 190 main cases, the isolated eight-hour offline case,
negative controls and runtime smoke. Wisp rarity scroll passes in the full
Linux run. All seven relevant workflows pass. First pre-merge attempt
failed at initial Browser.getVersion, before any UI assertions; retry passed
that point. Original failed logs retained locally.

Local Node 24.19.0 source/context and APK identity pass. All nine separately
invoked tooling suites pass after placing the installed JDK on PATH. Initial
updater failures were javac ENOENT. The combined POSIX tooling suite fails its
file-mode assertion on Windows (0666 versus 0644); it was not weakened.

The local broad core/full runs were interrupted and are incomplete. Three UI
drivers hit their existing deadlines. A fourth case, wisp-rarity-scroll, failed
"periodic reflow keeps focused action screen position" once. An unchanged
full-case rerun hit 90 seconds. A diagnostic copy added geometry reporting only;
its first six profiles met the original one-pixel tolerance before reaching
90 seconds. Original --role-only then passed three times, each with 493 checks
and twelve profiles. These focused runs do not replace full-suite acceptance.
The isolated assertion's cause remains unknown; no confirmed gameplay defect
was established. No test thresholds, negative controls or source were changed.

Raw local logs and identities are under
validation-evidence/perfect-debug-20261105/ in this worktree. CI receipts and links
are the durable shared evidence. Modern browser and V8 engine results do not
establish physical-device, exact WebView60 or TalkBack acceptance. No APK built.

## Cleanup rejection

Native PowerShell cleanup was rejected before execution with the exact reason
"blocked by policy". No more specific reason or automatic approval-review
finding was supplied. No alternative deletion route was attempted. Seven roots
remain, all disposable staging/profiles from this task:

```text
C:\Users\CustomCodings\AppData\Local\Temp\lumenfall-behavioral-UCBFG4
C:\Users\CustomCodings\AppData\Local\Temp\lumenfall-best-now-Zwn8z4
C:\Users\CustomCodings\AppData\Local\Temp\lumenfall-formation-collapse-SxBpsm
C:\Users\CustomCodings\AppData\Local\Temp\lumenfall-ui-regression-browser-hma5Mn
C:\Users\CustomCodings\AppData\Local\Temp\lumenfall-ui-regressions-PnxKhR
C:\Users\CustomCodings\AppData\Local\Temp\lumenfall-wisp-kgMYhV
C:\Users\CustomCodings\Documents\ChatGPT\Lumenfall\perfect-debug-20261105\validation-evidence\perfect-debug-20261105\temp
```

The first six creation times match the interrupted runner, 07:17:34–07:26:51
local; its exact test process tree was terminated. The separate task scratch
root has an owner marker and completed pre-delete verification: 1024 entries,
zero links, no worktree, no user deliverables and no active test processes.
Subsequent focused runs used that same owned scratch root. Cleanup remains open.
