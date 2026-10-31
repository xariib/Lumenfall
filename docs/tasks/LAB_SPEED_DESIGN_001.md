# Lab Speed Up design

## Current checkpoint — 31 October 2026

Integrated; automated acceptance PASS; physical/human acceptance open.
[PR32](https://github.com/xariib/Lumenfall/pull/32) merged at b7371ced6283b97f58f89ed1accff3dcc383f5ee.
CI head8e4ec15e824ea31c78a6b018d4e38e1e2d118d0f: seven workflows/nine jobs PASS,
190 main +1 isolated offline scenarios and runtime smoke.
Merged product/tests/scripts/workflows/native code/assets are byte-identical
to this tested head. App/native-check code also matches signed APK headff92edf2;
later commits changed documentation only. Product SHA256:
c1c2e46bc9cf2c24b12cb3010b388fbda72aabfd20ddf6d915bd00f5d85b791b.
[Delivery/evidence](../qa/lab-speed-design-001/).

Original request, 30 October: make Lab Speed Up close to The Tower reference,
using Lumenfall game design. Reference1 has duration buttons,4×2 speed grid,
selected plan/cost, queue/actions; reference2 is old Lumenfall dropdown/slider.
Owner: this chat; no agents/other chats. Baseline main1f316cc5; isolated branch
feature/lab-speed-design-001. Accepted Tap/PR29 and Auto Ascend/PR31 retained
from integration base main5acec043.

Implemented navy gradient, teal duration buttons, violet speed choices, serif
research title,8/12/24h with existing discounts, eight speed tiers, centered plan,
always-visible Mote quote, existing queue and Cancel/Speed Up row.
Original native select/slider remain in collapsed Slider controls disclosure.
Preset selection uses existing transactional preference setter and never pays.
Paid timers, editable next plan, independent queues, prices, saves/progression
remain. No gameplay/balance/save-schema change or new binding rule.

Acceptance covers touch/keyboard choices, pressed state, quote, red insufficient
price/disabled purchase, queue/paid receipts,44px controls,320/390/430px,
100/150/200% text, reduced motion, modal focus/Escape/disclosure traversal.
Preview is actual390px/3x24h production UI. Changed index.html, focused preset
module/harness and native Lab tests to open alternate controls/follow new tab
order; original input/payment assertions retained.

Final source: presets668/18profiles and caps552/12profiles PASS. Paired replay
matches four full endpoints against accepted main3f74661b using identical
one-second windows, pinned Node24.19.0. Canonical oracle fields retained;
only source binding updated. Old pre-Tap hardcoded generator remains unchanged.
Full CI rechecks existing native/timed/queue/core suites. Historical source017fb859:
timed1182/12profiles, native Lab1212/6profiles, core379+67/13controls PASS.
Local Node24.20.0/Chrome156.0.8078.80; CI/replay Node24.19.0.

Necessary cap-test readiness repair retries only expected navigation-context
errors inside original10000ms deadline. Game/browser errors propagate; assertions
remain. Five causal checks and actual552-check matrix PASS. Failed log retained.
Upstream shared status growth exceeded unchanged32KiB startup budget; compact
PROJECT_STATE summaries keep task/evidence links and full history. All31 selected
task checks PASS; checker/budget unchanged.

Signed non-publishing Android0.2.68/code1000068, run41143127589 attempt2 PASS.
APK SHA256090b59c73c439864993eebae79ed5e2f7a85cec9627804b36b895006c38e302c.
Package com.lumenfall.app, established signing identity, originhttps://localhost.
All15 packaged assets equal integrated files. UID, both saves, progress, paid work,
legacy entitlements and native Wisp/Farm/Rift checks PASS on Android12/API31/
WebView91 emulator. Attempt1 missed first native back-one (25 vs24); unchanged
retry passed. Failure log/calibration/logcat retained; no workaround.
Local APK: ../lab-speed-design-android-final/Lumenfall.apk (outside repository).

Self-review/automation only. Physical phone, exactWebView60, TalkBack and human
design acceptance remain open. No public release or archive. Next: inspect
preview/test APK; fix reported defects and record physical/human acceptance.
