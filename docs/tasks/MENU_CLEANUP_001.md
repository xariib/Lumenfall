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

## Android candidate and integration validation

The signed Android 0.2.160 candidate passed on the Android 12 emulator. Both
save slots, paid Lab work, app launch, and the approved in-app updater were
verified. The APK contains the exact candidate HTML and retains the installed
package and signing identity. [Candidate receipt](../qa/menu-cleanup-001/android-candidate.json)
and [installed Wisps screen](../qa/menu-cleanup-001/installed-wisps.png).
Browser evidence includes 12 wordmark profiles and a 16-profile visual audit
with 1,792 assertions. [Browser receipt](../qa/menu-cleanup-001/browser-verification.json).

PR #71 head 365bb808 is the proposed fast-forward commit. The current main
13558740 is its ancestor. The pull-request workflows and nine dispatch
workflows are checking that exact commit. Advance main only after both sets
succeed and main still has the checked baseline. Then dispatch the signed
public build on main. The 0.2.160 APK is a candidate.

All eight PR workflows and all nine dispatch workflows passed. Both full
runs passed 188 stateful scenarios and the isolated offline catch-up case.
[Workflow receipt](../qa/menu-cleanup-001/integrated-checks.json).
GitHub reports PR #71 merged. Main was fast-forwarded from 13558740 to
365bb8086b312d9d6a335d62950199e9db3bfcc9. Public signing and release verification
are in progress in [the release workflow](https://github.com/xariib/Lumenfall/actions/runs/45162719090).

The first two public build attempts stopped at installed Wisps scroll
restoration. The emulator reached top=max=1182 before leaving and returned
with top=1167, max=1182. The signed candidate reached the full bottom in
that same check. Both public attempts withheld release. See the
[first failure receipt](../qa/menu-cleanup-001/android-scroll-first-attempt.json).
A diagnostic build on fix/menu-cleanup-native-scroll adds native scroll
and layout observations around the unmodified assertion. Determine where
the offset changes and verify the fix before publishing.

The [emulator trace](../qa/menu-cleanup-001/android-scroll-trace.json) showed
Wisps was still at 1182/1182 when leaving. On return a transient taller main
viewport exposed a bottom of 1167 before the final bottom of 1182. The
diagnostic run reached the correct bottom at animation end in all menus.
That diagnostic run later stopped on an independent official updater
metadata HTTP error.

The follow-up observes the activated menu and main viewport only when a
remembered bottom is being restored. It follows layout changes until the
player touches, scrolls with the wheel, uses the keyboard, or changes menus.
The original animation-end restore remains for older WebViews. The browser
negative reproduced a 15-pixel late growth on the merged source. The repaired
source passes all 422 checks across 12 profiles, including the original
independent offsets and cancellation on touch. The [new offline replay](../qa/menu-cleanup-001/scroll-offline-replay.json)
again matches all four full save states. Verify the identical race on a signed
candidate and run the exact CI and public build before closing.
