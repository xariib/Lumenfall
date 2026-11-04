# Mobile power optimization

User request (4 November 2026): “Now i need the game to be FULLY OPTIMIZED.
Don't burn phone or drain the phone which is being played on.”

Owner: this chat. Goal: reduce avoidable foreground CPU/GPU work and stop
background wakeups while preserving gameplay, appearance choices and saves.
Baseline: main `67a9b58035e2bce721bb026b76f44457f1046588` (Android 0.2.82
product source `278bb669`). Branch/worktree: `feature/mobile-power-001` /
`mobile-power-001`. Status: in progress. No new binding rules.

Concurrent PR36 owns Rift layout/navigation, based on the same released product;
its worktree is untouched. Integrate with current main after checking overlap.

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
enemy change. Wisp rebuilds coalesce at 500 ms. Autosave settles the existing
monotonic clock without another full UI tick. Both intervals are cancelled while
hidden and restarted once. Covered arenas pause animation/VFX/rendering while
visible hint contents and Lab editors stay live. Ambient stars and notification
dots are static; combat, all selected Live scenes and Still/reduced motion remain.
HP/charge/Lab fills use transforms; their accessible values are unchanged. This
follows [browser animation guidance](https://web.dev/articles/animations-guide).

Product SHA256: `2e28d6e6277cfa3b3361d203aef8ee798416874fe6d26152ec5201b7b0a1e13d`.
Browser: Brave/Chromium 156, Windows, Node24.20; independent gameplay replay uses
CI's Node24.19. Full task/checkpoint context and source syntax PASS.

Measured 5-second unobstructed Farm21 windows with real timers, 390x844/DPR2,
same fixture, baseline before candidate (no concurrent benchmark workloads):
Rift main-thread 1086→428 ms, Wisps715→471, Lab561→195, Deeds538→109.
DOM mutations: 8994→952,8568→2458,8497→813,7219→246. Ten kills in each final
candidate window; hidden intervals/canvas paints zero; one tick loop after three
resumes. 45 browser assertions PASS, including current prices on navigation,
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

Next: finish the original contract rerun, full four-window gameplay replay,
causal background control and CI; publish the branch/PR, integrate only after
required gates, then verify the signed Android update. Physical phone thermal,
battery, exact WebView60 and TalkBack review remain open.
