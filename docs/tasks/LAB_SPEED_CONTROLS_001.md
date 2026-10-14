# LAB_SPEED_CONTROLS_001

15 October2026. Same owner chat; no delegation. TIMED REVISION IN PROGRESS;
price decision pending. Local only; no GitHub/push/APK/signing/archive.

Baseline: local/full-debug7598c86, source084f2995. Tracked files clean; unrelated
untracked validation-evidence/ retained. Earlier local UI checkpointfd046ec and
its full history/checks are in [saved checkpoint](../qa/lab-speed-controls-001/timed-boosts/previous-checkpoint.md).
Read [state](../PROJECT_STATE.md), [queue](LOCAL_IMPROVEMENTS_PLAN_001.md),
[workflow](../project/FEATURE_WORKFLOW.md); check_context uses this task ID.

New user request: simplify the Lab card; remove Buy now; replace per-level speed
payments with8/12/24-hour boosts, modest longer-duration discounts. User confirmed:
boost belongs to selected project across levels; continuous elapsed timer,
including idle/offline. Asked for a price proposal. All eight speed tiers remain.
Proposed1.5x prices14/20/38 Motes;8h base=current tier price,12h5%,24h10% off
proportional price, rounded up, then existing Catalysis discount. NOT APPROVED.
[Design/prices/next checks](../qa/lab-speed-controls-001/timed-boosts/README.md).

Preserve other features, work, completed effects, costs/caps, Study Queue, saves,
old paid active speed and chronological simulation/offline cap. No free timed hours
or automatic renewal. Migration/expiry require live/offline/reload/retry tests. Show missing amounts red;
disable/refresh unaffordable actions. Touch/keyboard,320–430px,200% text and stable
focus/scroll required. Keep name/level badge and Current/Next hierarchy.

Reproduced screenshot/source:14 Motes/level, Buy now, per-level scheduler.
Baseline Lab core2675 PASS; product unchanged. Context budget repaired by
shortening only this task; prior record retained.
Next: obtain proposed price decision, implement timed mechanic/UI, focused and
existing checks, review complete diff, update docs, commit and refresh preview.
Final combined CI/main/GitHub and Android/WebView60/TalkBack acceptance OPEN.
