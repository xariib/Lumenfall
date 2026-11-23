# MENU_CLEANUP_001 — simplify Wisps and Workshop

User request, 23 November 2026: remove the five red-marked elements in the
attached phone screenshots. These are the Formation "Field Best now" button
with its team and recruitment text, the Research Lab banner, the Rift Forge
banner, the Wisps recruitment banner, and the bottom roster progression strip.
Rename the Roster tab to Wisps. Use the same top-left Lumenfall title typography
on Rift and every menu.

Owner: current feature chat. The isolated branch is fix/menu-cleanup-001 in
C:/lf-menu-cleanup, based on GitHub main 13558740 and signed Android 0.2.159
(source c4686746). [Baseline acceptance](WISP_LIVE_ROSTER_001.md). Open PR #63
is the separate Play candidate. Keep saved formations, manual Field/Bench,
Bonds, Wisp recruitment, Forge purchases, and paid Lab work. The remaining
Workshop tabs identify their panels. Use the non-Rift wordmark as the reference.
The late-power hint will move to the existing Push preset.

Acceptance: verify all five removals, Wisps label and accessibility relations,
matching rendered wordmark across current destinations at the same viewport
and text scale, working Formation/Workshop controls and navigation, and
recruitment waiting/affordable states on Wisp cards. Run affected and integrated
gates and the existing signed Android update path. No new binding rules.

Status: baseline identified. Next: reproduce the marked UI and compare menus,
then implement and test the targeted cleanup.

## Implementation checkpoint

The product change is in index.html. Navigation, Formation, live recruitment,
and shared layout checks now exercise the remaining controls. The two
Field Best now scenarios are retired from the live suite because the requested
action was removed. Their original scripts remain available for the released
baseline. The current suite retains direct Bond and preset tests.

Baseline R3 navigation passed. Candidate R3, source validation and Formation
Bonds passed on Node 24.22.1, with Chrome 158 for browser tests. The Formation
touch/keyboard check passed 517 assertions across 12 profiles. The paired
[offline replay](../qa/menu-cleanup-001/offline-replay.json) matched all four
complete eight-hour save endpoints and reward totals, so only the golden
reference source hash changed.

Next: finish focused checks and PR gates, then verify the exact integrated
change and signed Android package. Physical-phone, TalkBack and exact
WebView60 acceptance remain open. Self-review only.

The wordmark check passed 8,077 assertions across 12 profiles. The unchanged
released baseline failed the new wordmark comparison in Workshop. All three
existing shared layout controls still caught their intended defects. The
Wisp management and hint check passed 1,182 assertions on retry after a local
Chrome teardown timeout. The locked progression hint and live recruitment
checks passed (901 and 34 assertions, respectively).

The visual audit now checks the remaining Lab catalogue heading. Its old
clipping control targeted the removed banner. The new control clamps the
catalogue heading in a test copy and fails the measured bounds check. The
unmodified quick profile passed 112 assertions. The same workflow still
checks the heading acceptance and negative control.

[PR #71](https://github.com/xariib/Lumenfall/pull/71) is open. The product
bytes match the [signed candidate run](https://github.com/xariib/Lumenfall/actions/runs/45151796924).
