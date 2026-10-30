# OFFLINE_RECAP_CLARITY_001 — readable return summary

Status: locally verified; [PR #22](https://github.com/xariib/Lumenfall/pull/22)
at `76dfd182b275b18f10b8f75d307f396a614d4396`, CI/integration and Android pending.
Owner: this feature chat; no delegation.

## Request and goal

29 October 2026: the user supplied `19106.jpg` showing Welcome back and asked
in Danish to make its potentially very long offline text easier to scan,
including several hours of Lab activity, while retaining achievements.

Replace the paragraph with time away, resource rows, concise automation/Farm
updates and expandable, grouped Lab results. Keep Continue visible on small
screens and with enlarged text. Preserve all reported results, offline timing,
12-hour cap, gameplay, saves, paid work, startup/daily order and input/focus.
No balance or save migration is needed.

## Baseline and scope

Current main `d9a341e`, clean `game` checkout; branch
`feature/offline-recap-clarity-001`. Remote main checked on 29 October; only open
PR #2 is an unrelated documentation audit. `source` is an older checkout and
is not edited. Prior return-flow delivery: [recap task](OFFLINE_RECAP_RELEASE_001.md).

Affected: root `index.html`, focused recap coverage, pre-merge CI, independent
offline reference source binding and this task/status evidence.
Baseline startup-order: PASS (31 assertions), Node 24.20.0. Baseline offline
12-hour check PASS including cancellation, storage failures and negative controls.
Browser available: installed Brave Chromium 156.0.8078.74.

## Acceptance and next action

- Resource values and optional outcomes remain accurate; repeated studies group
  by name and count earned levels; cap closures remain distinct from gains.
- Short returns stay compact; long results retain all names in expandable rows.
- No horizontal overflow at 320/390/430px, enlarged text and short landscape;
  Continue stays reachable when details are open. Keyboard/Escape/daily flow works.
- Focused tests, existing affected checks and required CI pass; integrated
  source and Android delivery are verified before claiming completion.
- Physical phone, exact WebView60 and TalkBack acceptance remain unverified.

## Implementation and verification

Product SHA-256 `8b06aa4afde553ee9c582a73c5aee7f5514a77423c6521ab5831620d9f52f026`.
Resources use a definition list; Auto Ascend and saved Push/Farm outcomes use
short rows. Each Lab outcome expands to one row per study, with earned-level
counts separate from paid closures at cap. No results are discarded. The body
scrolls while the title and Continue remain visible. Reopening resets scroll
after the hidden dialog is laid out. Existing focus trapping includes the new
native summaries; touch decoration suppression remains intact. No new rules.

Local Node 24.20.0 / Chromium156 checks PASS:

- `offline-recap-clarity.cjs`: 18 assertions, names/counts, singulars, wide
  resources, cap closures, HTML escaping and unchanged receipt/game state.
- `offline-recap-clarity-mobile.cjs`: 129 assertions across eight viewport/text
  profiles (320/390/430px and 844x390 landscape; 100/200% text), expanded overflow,
  trusted Continue touch, native keyboard expansion, focus wrapping, daily order,
  unchanged saves and vh fallback. Screenshots visually inspected.
- Existing `mobile-feedback.cjs`: all 30 startup/input profiles PASS.
- Existing `run.cjs --web-root mobile/www --scenario offline-catchup-ui`: PASS,
  actual cold/resume rewards, repeated returns, cancellation, retries, daily
  rollover ordering and trusted Continue dismissal.
- Existing `offline-catchup-legacy-dom`: PASS with actual offline progress,
  legacy DOM/CSS transform and trusted Continue dismissal.
- Source syntax/contracts, 31 startup-order assertions, task context and diff
  whitespace checks PASS.
- Independent one-second oracle regenerated. All four phase results, including
  complete endpoint state hashes, match a fresh run of baseline main on the same
  local runtime. The checked-in prior state hashes differed already on baseline;
  expected kills/Ascensions/Prisms are unchanged. No simulation code changed.

[Durable local evidence and previews](../qa/offline-recap-clarity-001/README.md).
Review is self-review plus automated checks, not independent review.

## Delivery access and next action

The exact local tree `b305293c32b6dd8a38d02c124b6e5a753a1dc749` was published
through the connected GitHub plugin with every blob/tree hash verified. PR #22's
automatic Code Review completed on `76dfd18` with no findings or unresolved
threads. Six focused workflows and the original isolated offline job passed.
Main run40879737306 stopped at step21's RIFT_HINT_READABILITY_002 context check:
the new shared project-status entry exceeded its pre-existing 32KiB startup
budget. All preceding checks, including the new recap checks, passed. Shorten
shared status summaries while retaining links/evidence; keep the original limit.
This is automated review, not human acceptance. Retest the final docs-only tree.

The connected GitHub plugin supports objects, branches and PRs, but exposes no
workflow dispatch. Git's credential helper has no repository credential. Browser
inventory initially reported `Local browser use is disabled in Work settings`.
User replied “Enable”. Settings > Configuration > Work > Local browser use was
changed from Use default to On and visually verified. The existing general
Browser switch was already On. This running task's browser tool still reports
disabled after a fresh browser-runtime reset and an attempted built-in tab, so
workflow dispatch remains unavailable in this session. No other permissions
were changed. Do not claim an Android build or publication occurred.

Next: inspect PR #22's remaining automatic CI. Continue integration
when required gates pass; workflow dispatch/browser access is needed for the
existing signed Android build and exact-main release gates. Phone/WebView60/
TalkBack remain unverified. Keep the task open while delivery is pending.
