# Lab Speed Up design

Original request, 30 October 2026: make the Lab Speed Up box close to the
supplied The Tower screenshot, using Lumenfall's game design. Reference1 shows
duration presets, a4×2 multiplier grid, selected boost/cost, queue and actions.
Reference2 shows the current Lumenfall dropdown/slider dialog.

Owner: this chat. Goal: implement that compact preset layout with Lumenfall's
navy panels, teal borders, violet speed choices and serif title.
Baseline: main1f316cc5. Isolated branch feature/lab-speed-design-001.
Open PR29 (tap balance), PR31 (Auto Ascend) also edit index.html; retain their
work during integration. No agents or other chats used.

Preserve8/12/24h, discounts, eight speed tiers, Mote prices, active paid timers,
editable next plan, independent boost/research queues, saves and progression.
Keep the native slider/duration controls available in a collapsed disclosure.
No new gameplay rules or save migrations.

Acceptance: direct duration/multiplier touch and keyboard choices, clear selected
state and quote, queue and active timer retained, red unaffordable quote/disabled
purchase,44px controls,320/390/430px and enlarged text, modal focus/Escape,
existing focused Lab regressions and relevant CI. Save a visual preview.

Status: implemented locally; final verification and delivery in progress.
New duration row and4×2 speed grid use pressed-state buttons. The collapsed
Slider controls disclosure preserves the original native input path. Selected
plan and Mote quote sit above queue; Cancel/Speed Up share the final row.
Paid-boost settings, simulation, prices and save formats are unchanged.

Baseline queue UI327 checks/18profiles PASS. Preset input650 checks/18profiles,
slot modal452/18profiles and permanent UI434/18profiles PASS on candidate1174d446
(product SHA256 prefix). Clarity524/18profiles passed the earlier layout.
Disconnected-preset and locked-next defect controls fail their intended
selection assertions. The final disclosure tabindex correction is under
revalidation. Native Tab checks must follow the new preset/disclosure/Cancel
order; their earlier stale-order failures are retained in local logs.
Node24.20.0, Chrome156.0.8078.80; independent one-second replay uses pinned
Node24.19.0. Four released complete-state hashes match; final binding rerun
in progress. Source syntax/lifecycle and diff checks PASS. Self-review only.

Changed product, focused preset UI test/harness, legacy Lab UI tests (explicitly
open native disclosure; retain input/payment/focus assertions), CI and this task.
Final product SHA256017fb8594aff3f4dbc1c341e0c546356c4bba37fcaf7706514e0939ebe862409:
preset input668/18profiles PASS, including disclosure keyboard traversal.
Pinned independent replay regenerated all four unchanged complete-state hashes;
only source binding changed. [Preview and receipts](../qa/lab-speed-design-001/).
Next: finish native/core/legacy input checks, publish PR, run required CI and
signed test APK acceptance, then integrate.
Physical phone/WebView60/TalkBack and human visual acceptance remain unverified.

Sources: [previous queue contract](LAB_BOOST_QUEUE_001.md),
[workflow](../project/FEATURE_WORKFLOW.md), [product](../../index.html).
