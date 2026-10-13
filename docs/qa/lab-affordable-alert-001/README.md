# Local Lab notification evidence

13 October 2026. Source SHA-256
`f2da7446bbd3844eb601741feb3f4928b6496269cfca28d694cf2386a9f9158c`.
Node24.19.0, Chrome151.0.7922.34; legacy Node8.3.0/V8 6.0.286.52.
Local self-review and automated checks; no independent or Android acceptance.

| Command from repository root | Result / saved evidence |
| --- | --- |
| `node scripts/codex/check_context.cjs --task docs/tasks/LAB_AFFORDABLE_ALERT_001.md` | PASS, task links and startup budget |
| `node scripts/ci/validate_source.cjs` | PASS [source](source-validation.txt) |
| `node tests/behavioral/lab-expansion.cjs index.html --negative` | PASS2465 checks/10 controls [core](lab-core.json) |
| actual sibling `work/node8/node.exe tests/behavioral/lab-expansion-legacy.cjs index.html` | PASS580 [V8](v8-legacy.json); Node24 attempt intentionally refused by runtime guard |
| `node tests/behavioral/lab-affordable-alert.cjs mobile/www/index.html` | PASS166 [browser](browser.json) |
| same test with `--mutate-attention` / `--mutate-refresh` | Expected assertion failures: [capacity](capacity-control.json), [refresh](refresh-control.json) |
| `node tests/behavioral/run.cjs --web-root mobile/www --scenario lab-affordable-alert` | PASS [registered scenario](registered-scenario.txt) |
| `node docs/qa/lab-affordable-alert-001/run-existing.cjs mobile/www/index.html nav-workshop-contract` | PASS443 [navigation](nav-cdp.json) |
| same adapter with `rift-status-contract` | PASS1736 [Rift](rift-cdp.json) |
| same adapter with `r3-save-reload` | PASS real reload and749 completion ticks [reload](r3-cdp.json) |

Set `LUMENFALL_QA_CDP_CHROME` to the installed sibling
`work/browsers/chromium-1234/chrome-win64/chrome.exe`. Headless browser and loopback
required sandbox escalation; isolated temporary profiles are removed after exit.

The focused regression executes actual production JS/DOM with automatic timers
paused for controlled states. It covers no funds, each currency one short,
exact funds, gain/loss through affordability refresh, active/full slots,
completion, locked/capped catalogs, increased/decreased capacity, queued work
before/after authoritative scheduling, focus retention and state/save purity.
The baseline `870fd3e` fails at “no money320 notification”; the capacity mutation
reproduces it. The refresh mutation fails at “exact cheapest price notification”.

[Standard navigation launch](nav-workshop.txt) timed out at25s in Windows
dump-DOM transport without a QA result. The saved CDP adapter uses the existing
instrumentation, fixtures and unchanged assertion modules with the same25s
completion deadline, including expected navigation during real reload. This is
alternative local evidence, not a claim the standard transport gate passed.
No test assertion or CI deadline was weakened. The new focused test is registered
in the default behavioral suite. Full-suite and remote CI were not run here.

Current source/fonts/branding copied into ignored mobile/www. Existing preview
http://127.0.0.1:4174/index.html returned bytes matching the exact source hash;
the app queued its browser panel opening. No saves reset or APK/signing changes.
Android/device/WebView60 layout/TalkBack and final release acceptance remain open.
