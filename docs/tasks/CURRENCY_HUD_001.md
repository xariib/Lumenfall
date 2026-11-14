# CURRENCY_HUD_001 — consistent top currency display

14 November 2026. Owner: this feature chat. Status: visible-name correction
in progress; previous icon-only implementation integrated. Do not archive.

## Request and scope

User: “I want the currency menu at the top to be like the rift style on all
the others menu aswell. So it's showing the icon and then how much currency
right of icon. They should have same size and style like the rift screen everywhere.”

Use the Rift currency chip dimensions and appearance in every menu, with the
icon followed by its name and amount. Show full currency names visibly and
retain them for assistive technology.
Preserve six wallets, number formatting, live refresh, purchases, saves, game
mechanics, settings and navigation. No save migration or new binding rules.

## Current human correction — visible currency names

User: “The currency menu is only showing icons, no text of what the currency is.”
This supersedes the earlier visually clipped-name presentation and its
label-free acceptance. All six menus must show icon, full currency name and
live amount with the same shared styling. Preserve 24px/20px chips, 11px icons
and 10px amounts. Names are 9px; at widths up to380px use two columns so full
scientific balances fit without hiding or truncating names or amounts.

Correction baseline is current main `6fd9e44f` (includes released Lab0.2.117),
isolated branch `fix/currency-visible-names-001` in the same currency worktree.
Previous long diagnostic/coordination history remains on
[the earlier feature branch](https://github.com/xariib/Lumenfall/blob/feature/currency-hud-001/docs/tasks/CURRENCY_HUD_001.md).
Rift coordinator was notified through the human-approved existing-chat channel
to hold publication of obsolete icon-only candidate918d5739. No other worktree,
shared main, release build or native helper is changed here.

Initial390px check passed111 assertions. The first320px check correctly found
the largest scientific amount clipped beside a name; the two-column responsive
correction addresses this. Final visual matrix PASS1,776 assertions/16 profiles;
hidden-name causal control fails the intended assertion, and four paired
eight-hour one-second replays preserve all original endpoints/save fields/rewards.
Product scripts are byte-identical to6fd9e44f; only CSS changes. Source validation,
task context and whitespace pass. Node24.22.1/Brave157.1.99.57; screenshot review
is self-review. [Exact-source correction evidence](../qa/currency-hud-001/visible-names/summary.json).
The unchanged Shared UI workflow runs the strengthened positive name checks.
The hidden-name causal command/evidence are retained locally/in this repository;
GitHub rejected the proposed workflow extension because its OAuth credentials
lack workflow scope. No existing workflow/check is removed or weakened.
Rift layout/control checks also PASS1,399 assertions/12 profiles, including the
existing oversized-enemy causal control. Next: push the correction/PR, provide
its exact commit to the coordinator and verify integrated CI/final APK.
Device/human acceptance stays open.

The baseline/PR49 sections below retain historical acceptance; they do not
establish acceptance of this current correction.

## Baseline and acceptance

Baseline: main `858d713f` (Android 0.2.111); isolated branch
`feature/currency-hud-001`, worktree `validation-evidence/currency-hud`.
Root Forge/Lab and Rift-theme checkouts are untouched. No open PRs observed.
Read [startup](../../PROJECT_BOOTSTRAP.txt), [state](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md), CODEX_START, CONTEXT_INDEX and relevant
Shared UI requirements. Existing currency markup and live-update functions are
shared; CSS overrides give Rift 24px/20px inline chips and other tabs 34px/30px
two-row chips. Visible labels remain in current Rift markup.

Acceptance: all six currencies use matching inline icon/amount appearance across
Rift, Wisps, Forge, Lab, Ascend and Deeds; match at normal and short heights,
narrow widths, enlarged text and reduced motion. Names remain accessible;
values update and full amounts fit. Existing relevant gates, integrated-source
CI and signed Android delivery must pass. Physical-phone, exact WebView60 and
TalkBack/human acceptance must be reported separately if unavailable.

## Checks and next action

Workflow triggers reviewed: PRs run premerge and UI checks; Android publication
is explicit dispatch and requires six successful integrated-source workflows.
Implementation: shared CSS uses the original Rift 24px/20px chips, 11px icons,
10px amounts, colors/borders/shadows and a consistent header background. Labels
remain in the DOM, visually clipped for icon/amount-only presentation. The
existing visual gate now checks all destinations at both heights, live zero,
large and exponential wallets, unclipped amounts and the actual AX tree.

Changed: `index.html` (CSS only), `tests/behavioral/visual-audit.cjs`, this task
and [evidence](../qa/currency-hud-001/README.md). Inline product scripts are
byte-identical to baseline; gameplay and save code are unchanged. No workflow
or gate was weakened. Screenshot inspection is self-review, not independent review.

Local Node 24.22.1: source/lifecycle/ID validation, task context and whitespace
checks pass. Final browser matrix passed 1,776 checks/16 profiles, including
explicit original chip/icon/font dimension assertions. Baseline
failed the new label-free visual contract. Test development initially assumed
identical native/exact Shard formatting and case-sensitive AX labels; corrected
the fixture expectations, retaining existing formatting and CSS text-transform.

Concurrent Lab simplification and Rift bond display worktrees appeared after
startup; they are untouched. Check current main before integration and preserve
their scoped changes. The connector lacks workflow dispatch/download; GitHub
CLI supplies those operations. Sandbox network restrictions initially made CLI
auth appear invalid; outside-sandbox auth succeeds without credential changes.

Next: publish this focused branch/PR, pass all required CI, serialize main
integration against other features, run integrated release gates and deliver
the signed APK. Keep open while required device/human acceptance is unverified.

## PR49 checkpoint

[PR49](https://github.com/xariib/Lumenfall/pull/49) opened at `e9c9dc07`.
Six applicable workflows passed; premerge failed its startup-size check, isolated
offline timed out before JSON at300s, and both Wisp causal jobs timed out during
their unchanged300ms setup. [First failures](../qa/currency-hud-001/first-ci-failures.json)
retain raw excerpts. The largest task already exceeded32KiB on baseline;
compact the two recent release summaries in PROJECT_STATE while retaining their
full linked task/evidence records. Exploit startup now32551 bytes; no limit changed.

The existing paired replay passed all four eight-hour one-second phases against
`dc78daad`, preserving every save field, reward and original endpoint. Rebound
only its source SHA256 in `offline-swift-current-golden.json`; canonical outcomes
are unchanged. [Replay receipt](../qa/currency-hud-001/replay.json).
Local Wisp anchor-negative settled within its original300ms ceiling and failed
the intended screen-position assertion; no deadline, test or product JS changed.
Next: rerun exact-source CI after these documentation/reference corrections;
investigate any repeated required failure before integration.
