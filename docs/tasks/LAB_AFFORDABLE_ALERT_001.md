# Lab affordable notification

13 October 2026. Owner: this feature chat. Scope: local implementation and preview.

## Requirement and baseline

Show the Lab notification only when a Study slot is empty AND an eligible
project can actually be purchased/started. Preserve currency, unlock, cap,
active-project and queue rules, prices, effects, scheduling, saves and paid value.
No remote push, APK release or signing changes are authorized.

Read [local sequence](LOCAL_IMPROVEMENTS_PLAN_001.md) and
[project state](../PROJECT_STATE.md). Clean baseline: `870fd3e` on
`local/full-debug`; accepted product checkpoint `dff2f50`, source SHA-256
`b3eca6661042a7245100d9dcd0a6fbbb2e38a01e99b305102b5307abb52db7a9`.
No concurrent edits observed. Continue sequentially in this checkout.

## Acceptance

- Reproduce empty-slot notification with no affordable project.
- Cover no money, exact money, one currency short, locked/capped/active projects,
  full slots, queue state, money and capacity transitions.
- Reuse the production start plan; notification rendering must not spend money,
  start queued work, mutate saves or alter scheduling.
- Run focused regression and relevant existing source/Lab/navigation checks;
  review complete diff and commit a coherent local checkpoint.
- Refresh current source/assets into mobile/www and show a playable preview.
- Android/device, remote integration and full release acceptance remain pending.

## Checkpoint

Local implementation/checkpoint ready on `local/full-debug`, based on `870fd3e`.
Final source SHA-256:
`f2da7446bbd3844eb601741feb3f4928b6496269cfca28d694cf2386a9f9158c`.
The feature commit is the commit containing this checkpoint (resolve with
`git log -1 -- docs/tasks/LAB_AFFORDABLE_ALERT_001.md`).

Baseline reproduced in actual Chrome: zero Lumen/Shards showed both badges.
Renderer now requires free capacity and an affordable production start plan.
The existing 500ms affordability refresh also updates both badges. Capacity
counts/accessibility labels remain accurate; no new save fields or mutations.
Queued projects count while actually startable; the unchanged scheduler starts
them and subsequent rendering reflects the debit/occupied slot.

Changed: index.html; focused Lab browser test and default scenario registration;
test bridge plus navigation/Rift/reload expectations for the approved behavior;
task/project/sequence documentation and [saved evidence](../qa/lab-affordable-alert-001/README.md).
mobile/www/index.html, fonts and branding refreshed from current assets (ignored
generated files); served source hash equals root source hash.

PASS: context check; source validator; Lab core 2465 checks/10 causal controls;
actual Node8.3/V8 6.0 Lab 580 checks; focused Chrome151 browser 166 checks across
320/430px; two precise notification/refresh mutations rejected; registered Lab
scenario on mobile/www; unchanged navigation 443 checks, Rift1736 checks and
real reload/completion749 live ticks through the documented CDP adapter.
Complete diff self-reviewed; no independent review claimed.

Limitations: restricted Windows sandbox closes Chrome/blocks loopback, so browser
checks ran outside it with isolated temporary profiles. Standard dump-DOM
navigation launch timed out at the existing25s transport gate; the same assertions
pass via CDP within25s. The standard transport remains unresolved, with its
failure evidence retained. Wrong-runtime legacy attempt correctly refused Node24;
rerun passed on actual V8 6.0. No full suite, remote CI, APK, physical Android,
WebView60 layout or TalkBack acceptance claimed. Existing Prism-contract/tooling
limitations belong to LOCAL_FULL_DEBUG_001 and remain open.

Preview: http://127.0.0.1:4174/index.html, existing server verified current bytes;
Codex browser-open request queued by the app. Local implementation milestone
verified; overall release/device acceptance remains pending. Next: user plays
the local preview; then continue the sequence with WISP_RARITY_SCROLL_001 from
this checkpoint. Keep release and transport acceptance open.
