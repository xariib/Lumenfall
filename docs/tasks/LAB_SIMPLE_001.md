# Simpler Lab layout and direct research selection

User request, 14 November 2026: simplify the Lab, integrate the timer,
Speed Up menu entry and Queue button; remove the separate Select research
button. Clicking a research card starts it immediately in an empty slot.
When replacing ongoing research, ask whether to start the selected research.

Owner: this chat; no agents or independent reviewer. Scope: Lab presentation
and selection, necessary regression fixes, checks, documentation and delivery.
Status: integrated and APK published; required device/human acceptance open.
No archive. No new binding rules, balance, caps or save/schema changes.

References: [previous timer](LAB_TIMER_LAYOUT_001.md),
[slot contracts](LAB_SLOTS_QUEUE_SPEEDUP_001.md),
[speed controls](LAB_SPEED_CONTROLS_001.md),
[feature workflow](../project/FEATURE_WORKFLOW.md),
[QA evidence](../qa/lab-simple-001/README.md).

Baseline: main 858d713f, product ce51bc14, Android 0.2.111. Baseline context,
slot/menu 488, queue 64 and slot 55 checks passed. Isolated branch
feature/lab-simple-001, worktree validation-evidence/lab-simple; root checkout
and other feature worktrees untouched. Subsequent accepted main 5f0d9762 was
merged before final validation, preserving currency header, Progressive Deeds,
milestone Details/focus behavior and native recap fixture correction. PR50's
separate bond display candidate was not imported.

Result: countdown, Queue and Speed Up share one compact progress panel.
Native full-card buttons replace separate catalogue actions. Empty slots start
directly; occupied slots open a focus-trapped confirmation with live prices,
Cancel/Escape and focus return. Confirmation checks the actual slot/funding.
Cancel/Escape leave work and wallet unchanged.
Paid work resumes without repurchase. All five slots/unlocks, prices and red
shortfalls, disabled unaffordable actions, boosts and both queues, research
effects, chronological/offline simulation and both save slots are preserved.

Changed product: index.html. Focused regression: lab-simple-ui.cjs and driver;
affected existing slot/menu, capacity, clarity, permanent-progression and
r3-destinations expectations now explicitly confirm switches. Pre-merge adds
positive/negative selection coverage. Golden source binding follows verified
replay; expected states/rewards are unchanged. Source syntax/IDs/lifecycle and
complete diff reviewed; no unrelated game removals or refactors.

Integration: [PR51](https://github.com/xariib/Lumenfall/pull/51), fast-forwarded
main from 5f0d9762 to tested commit 9af688888cba5fe1c2a3426b7087a5e2d14bb6f5.
Product SHA256: 81c503892ab7c9ec7af0ad5b7dcb923d1efc222c3d5820bcb29ce44e42623db9.
Eight PR and eight manual workflows all PASS on this candidate; exact runs,
jobs and steps are in pr-ci.json and integrated-ci.json. Each full pre-merge
suite passed 190 deterministic scenarios plus isolated offline catch-up.
Node 24.19.0 full regression CI, Node 20.20.2 focused CI, Node 24.22.1 local,
Chromium 157 local. Actual V8 6.0 product checks PASS; this does not verify the
WebView60 DOM. Selection 344/18 mobile profiles, slot/menu 488 and final
clarity/Deeds 1072 local checks PASS. Earlier source-bound focused receipts remain.
320/390/430px, 100/150/200% text, keyboard/touch and both motion settings tested;
normal/enlarged timer and confirmation screenshots inspected.

replay-details.json: four 8h windows per source against main 5040ea14, 115200
independent one-second calls each. All full saved states, rewards and canonical
endpoints match. Accepted main 5f0d9762 has identical product bytes to 5040ea14;
combined-source.json records proof. No numerical oracle acceptance weakened.

Final-source CI first failures retained: PR Lab 132436893022 timed out at
Browser.getVersion before any check; manual Tree 132439539206 timed out at
Page.captureScreenshot after 8998 checks/three profiles. Unchanged retries PASS;
full first logs retained. Earlier-source timeouts/failures remain qualified in
QA receipts. No deadlines, assertions or CI gates were weakened. Startup 32KiB
budget was fixed by condensing shared historical summaries with evidence links.

Android 0.2.117/code 1000117 published from the integrated
commit: [release](https://github.com/xariib/Lumenfall/releases/tag/android-1000117),
[signed build](https://github.com/xariib/Lumenfall/actions/runs/43601072898).
Package com.lumenfall.app and established signing certificate retained.
All 15 packaged product assets match exact Git source.
Native in-place upgrade and in-game updater retain both saves and paid work;
retail non-debug normal launch PASS. Public anonymous versioned/latest APK
bytes and feed identity/checksum PASS. APK SHA256: 41333a20680c8467b1a241ec2831387da7149198426acbb6d0b3bd6e71ab268f.
Exact receipts: android-release/verification.json and public-release.json.
Historical android-candidate/0.2.115 predates accepted Deeds and is not final.

Next: user reviews this APK on the physical phone, including Lab layout,
empty-slot/direct start, occupied-slot confirmation, Queue/Speed Up, focus and
enlarged text. Exact WebView60 DOM, TalkBack and human design acceptance remain
unverified. Keep feature/chat open until required device acceptance is recorded;
automated checks and self-review do not substitute for it.
