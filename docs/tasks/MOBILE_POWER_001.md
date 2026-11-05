# Mobile power optimization

User request (4 November 2026): “Now i need the game to be FULLY OPTIMIZED.
Don't burn phone or drain the phone which is being played on.”

Owner: this chat. Goal: reduce avoidable foreground CPU/GPU work and stop
background wakeups while preserving gameplay, appearance choices and saves.
Baseline: main `67a9b58035e2bce721bb026b76f44457f1046588` (Android 0.2.82
product source `278bb669`). Branch/worktree: `feature/mobile-power-001` /
`mobile-power-001`. Status: PR37 merged through PR38 and released in Android0.2.91,
source237fa928. Seven PR/six release gates,190+1 scenarios and signed native
upgrade/updater/public-feed checks PASS. [Delivery](ALL_UPDATES_RELEASE_20261104.md).
Physical-phone battery/thermal and human acceptance remain unverified.
No new binding rules.

Concurrent PR36 owned Rift layout/navigation, based on the same released product;
its worktree was untouched. The combined delivery above records final integration.

Scope: rendering and scheduling in `index.html`, focused regression/performance
coverage, relevant CI, documentation and Android delivery. Preserve monotonic
combat chronology, exact rewards, purchase prices, automation, offline cap,
recovery, all features, accessibility and WebView60 syntax. No balance/schema
changes. Avoid promises about temperatures/battery hours without phone evidence.

Acceptance:
- Measure the original and changed source using identical real-browser workloads.
- Eliminate hidden-page tick/autosave/animation timers and duplicate work after
  hide/resume; retain correct foreground settlement and offline return.
- Avoid recurring hidden-panel rendering and unchanged DOM replacement; refresh
  immediately on navigation and retain live affordability/accessible controls.
- Bound decorative animation work and respect reduced-motion/Still preferences.
- Pass focused gameplay/rendering/lifecycle tests, source checks and required CI;
  verify integrated Android assets/signature/upgrade. Physical battery/thermal,
  WebView60 and TalkBack acceptance require actual device evidence.

Baseline findings: fixed 100 ms simulation tick plus an extra tick on each 5 s
autosave; every kill invokes renderDynamic (Wisp rebuild, Ascend and battle),
followed by another battle render; all purchase panels refresh each 500 ms;
the starfield schedules every display frame although it paints at most 20 Hz.

Implementation: hidden-panel work is deferred to navigation; affordable controls
refresh immediately on entry and at 500 ms while visible. Battle HP/charge remain
at the original 100 ms cadence; other encounter details refresh at 500 ms or an
enemy change. Wisp rebuilds coalesce at 500 ms. Autosave follows the next
ordinary tick, preserving completion presentation without a second simulation.
Both intervals are cancelled while
hidden and restarted once. Covered arenas pause animation/VFX/rendering while
visible hint contents and Lab editors stay live. Ambient stars and notification
dots are static; combat, all selected Live scenes and Still/reduced motion remain.
HP/charge/Lab fills use transforms; their accessible values are unchanged. This
follows [browser animation guidance](https://web.dev/articles/animations-guide).

Product SHA256: `2b587871f5f080a301feb4a5c5c4f03fc3b0bb6feb89ca04593873a014b3d937`.
Browser: Brave/Chromium 156, Windows, Node24.20; independent gameplay replay uses
CI's Node24.19. Full task/checkpoint context and source syntax PASS.

Measured 5-second unobstructed Farm21 windows with real timers, 390x844/DPR2,
same fixture, baseline before candidate (no concurrent benchmark workloads):
Rift main-thread 1086→410 ms, Wisps715→426, Lab561→185, Deeds538→114.
DOM mutations: 8994→953,8568→2301,8497→813,7219→270. Ten kills in each final
candidate window; hidden intervals/canvas paints zero; one tick loop after three
resumes. 47 browser assertions PASS, including current prices on navigation,
paid timer continuity, pause/resume, covered combat and actual bar geometry.
These are workload reductions, not measured phone energy/temperature claims.
Earlier exploratory receipts with a covered battle are not performance evidence.

Focused checks so far: 300 whole-game audit assertions/3 causal controls;
267 exploit/chronology assertions/12 controls; Comet12 sections; 122 cosmetic
assertions; Lab488 assertions/18 size/text/motion profiles; real monotonic live
clock and backup settlement PASS. Original native Rift mobile PASS.
Original contract initially found a stale overlay in resetFeedback: its fixture
hid the dialog without closing its focus/coverage lifecycle. The helper now uses
production closeOverlay before hiding fixtures; all original cast assertions
remain. Windows dump-DOM produced no completed result; rerun uses the existing
CDP pipe transport and minimal copied mobile/www assets. No gameplay check waived.

Disposable staging: this task owns ignored `mobile/www` (only copies of root
index.html/fonts/branding) and `validation-evidence/mobile-power`. Browser profiles
have explicit owner records and native Windows cleanup after confirmed exit.
Durable result receipts belong in `docs/qa/mobile-power-001`; keep the worktree.

The corrected original Rift contract PASS. Full four eight-hour windows replayed
second-by-second against the original pre-visual baseline on Node24.19 PASS:
all gameplay fields/rewards and all four accepted state hashes are unchanged.
Only the golden's source binding changed; expected outcomes were not regenerated
from bulk execution. [Replay receipt](../qa/mobile-power-001/parity.json).

[PR37](https://github.com/xariib/Lumenfall/pull/37) is open. Self-review found a
Study completion presentation edge in the silent autosave; saving now follows
the ordinary tick. Positive and injected-old-autosave browser checks confirm it.
Price navigation checks run atomically so live wallet changes cannot race their
comparison. Final-source Node24.19 full parity passes; expected state/reward
hashes remain unchanged, only source binding changes.

Non-publishing Android [41851037992](https://github.com/xariib/Lumenfall/actions/runs/41851037992)
passed signing/assets/runtime and save upgrade, then failed the first native
Rift navigation assertion (stored25, expected24). No navigation evidence existed;
the harness now waits for the panel's actual entrance animation and records
centered trusted input plus resulting save before every assertion. No retry or
acceptance waiver. Shared UI failed a racy price assertion on e3f8bd9; corrected
atomic navigation check passes locally. Required CI/Android must rerun.

Final-source Node24.19 four-window replay PASS; golden rewards/state hashes
unchanged. Automated PR review independently reported the same autosave edge
(e3f8bd9); corrected by c0e2d93, positive/causal check PASS, thread resolved.
Android [41853154270](https://github.com/xariib/Lumenfall/actions/runs/41853154270)
passed the first three centered native navigation clicks (25→24→14→15), then
sampled zero events after the fourth tap's fixed200ms wait. Logcat records native
input/render delays over1s. Wait for the one trusted click (bounded5s), retain
all original state assertions, never resend a tap. Window-capture diagnostics
also observe input before application handlers. This is emulator acceptance
timing; physical phone responsiveness remains unmeasured.

Cleanup: the native PowerShell recursive removal of this task's disposable
`C:\Users\CustomCodings\Documents\ChatGPT\Lumenfall\mobile-power-001\mobile\www`
was rejected by exec_command with exactly “blocked by policy”, without a more
specific reason. Separate read-only verification confirms the exact resolved
path, documented task ownership, 15 copied HTML/font/branding files and no links
or .git entries. No supported escalation is available; it remains in place.
Do not mislabel this generic tool rejection as automatic approval review.
The separately owned profiling folder
`C:\Users\CustomCodings\Documents\ChatGPT\Lumenfall\mobile-power-001\validation-evidence\mobile-power\contract-diagnostic`
also remains: exact resolved path/owner/disposable marker/no links or .git/no
running browser verified, then the direct native LiteralPath cleanup received
the same generic “blocked by policy” rejection. No alternate deletion route used.
Temporary Java17.0.21 compiler at
`C:\Users\CustomCodings\Documents\ChatGPT\Lumenfall\mobile-power-001\validation-evidence\mobile-power\owned-jdk`
also remains after the same native LiteralPath rejection; exact path, ownership,
no links/.git and no running compiler were verified first.

Next: finish required CI/native evidence, integrate after gates, then
verify/publish the signed Android update. Physical
phone thermal, battery, exact WebView60 and TalkBack review remain open.

Android0.2.86 [41854346263](https://github.com/xariib/Lumenfall/actions/runs/41854346263)
PASS on45cbeec/source006aca: signing/assets, both saves/paid work, trusted
navigation/looks and actual updater install/cancel/tamper. Native tap delivery
took349–890ms, confirming the200ms sampling problem. Receipts in android-test.
Shared UI (including power checks), Lab, Comet, permanent progression and Forge
passed45cbeec; Tree failed the first browser matrix twice (25s timeout, no result).
The local original baseline also exceeds that deadline: diagnostic-only runs
complete all6651 assertions in26.6s baseline /26.3s candidate. Profiling identifies
repeated locale formatter setup during Deeds/Forge rendering. Reusing one
Intl.NumberFormat preserves numeric formatting and non-number Amount strings,
with a fallback for missing Intl. The original6651-assertion contract now passes
its unchanged deadline. The exploratory test-helper change was reverted; no
assertions, cases or deadline changed. Final-source replay/browser/CI rerun next.

Final2b5878 source: all47 browser checks and four8h Node24.19 replays PASS;
original6651 Prism contract now passes CI. a58ac0b is the current PR37 head.
Android41859046342 passed the full upgrade/navigation/looks on this source, but
updater cancellation's second DevTools command arrived after installer handoff.
The harness now sends download+cancel in one turn, verifies the offered cancel
and absence of Android installer; controller and timeout/assertions unchanged.
Helper-only9fb689b is on isolated qa/mobile-power-android-001 for an Android
test while PR CI continues. Lab's Browser.getVersion timeout occurred before0
checks; its failed-job rerun passes. Tree, Forge, Comet and progression pass.
Shared UI exposed an HP geometry sampling race: renderAll starts a new .001ms
reduced-motion transition after the test's earlier wait. Finish that actual
transition before the atomic visual/state comparison, retaining the original
fraction and no-width-animation assertions. Product source is unchanged.
Integrate the helper and geometry fix in PR37, require all gates, then run
the six exact-main release gates before publication.

QA Android41860940147 (9fb689b) passes upgrade/navigation/cancel, then exposes
a native race: download resolves before its finally/operation lock releases;
immediate install is rejected as already running (captured native log).
AppUpdaterPlugin now returns a completion callback from worker actions, releases
the lock after cleanup, then notifies JS/opens Android UI. Success/error/cancel
ordering and concurrent rejection are exercised from the production Java gate,
including an injected late-release causal failure. Native acceptance must rerun.

## Historical queued-run checkpoint — 4 November, superseded by PR38 delivery

Recovered on 5 November. The original run state below is historical; integrated
Android0.2.91 and subsequent0.2.95 delivery are recorded in current project status.

Latest code at that checkpoint: c67c4c2d; all local focused checks PASS. Required PR runs and
Android41862842909 are queued without a runner as of4Nov17:09 Copenhagen.
Older finished jobs still appear in progress; normal cancellation returns409
“Cannot cancel a workflow run that is not in progress.” No duplicate/force run.
[Pending run IDs and next steps](../qa/mobile-power-001/pending-ci.json).
Main remains67a9b58; no merge or new release claimed. Keep the feature open.
