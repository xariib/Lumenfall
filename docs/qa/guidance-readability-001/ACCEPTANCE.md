# GUIDANCE_READABILITY_001 — readable large-text Rift hints

Status: supported development acceptance PASS at PR109 merge354e19ff;
native acceptance OPEN. [Current receipt](development-acceptance-015/README.md).
One follow-up to F07 on the unreleased development branch.
The user's 11 October instruction is to continue game development. The next
known issue is the ordinary hint title fragmenting at narrow, enlarged text.
No main change, APK, signing or release is authorized.

## Baseline and sources

Development behind draft PR102 is `684bfc52bb2ca523124fe63981188b9a8004d747`
(PR108 merged), tree `d752d50c96f7882ecffb70f82f67a3180d750824`.
Main remains `67373faa531f0bb791c883210ee623320861e380`.
Isolated branch: `fix/guidance-large-text-001`.

Read [original F07 task](../../tasks/RIFT_GUIDANCE_001.md),
[original user wording](../../recovery/2026-10-07/lead_context/FEEDBACK/ORIGINAL/USER_REQUIREMENTS_2026-10-07.txt),
[F07 requirements](../../recovery/2026-10-07/lead_context/FEEDBACK/TASK_FEEDBACK_REVISION_001.txt),
[Shared UI](../../tasks/SHARED_UI_001.md), [workflow](../../project/FEATURE_WORKFLOW.md),
and [setup](../../project/CODEX_START.md).
Current GitHub PR/ref state supersedes the historical pre-integration status prose.

## Goal and preservation

Make an ordinary leading action word readable at 320px and 200% text without
shrinking text, replacing the hint with an icon, ellipsis, or horizontal clipping.
Keep the existing 46px reserved slot, 44px native toggle, complete scrollable
hint, and every existing geometry assertion including cross-font combat bounds.
Reserve the larger intrinsic width of both Show hints/Hide hints labels, so
the control never changes width when toggled. Actual browser measurements must
establish the final CSS; no fit or acceptance is claimed from source inspection.

Preserve game logic, saves, paid/earned value, active Studies, progression,
chronological offline simulation, Auto-Ascend, fonts/assets, touch targets,
Settings/device preference synchronization, focus/AX, navigation and WebView60.
This task changes no economy, balance, save schema or package/signing identity.
The only game-script edit is the Ascend-ready UI title: "Permanent power is
waiting" becomes "Ascend for permanent power". A real Shared UI screenshot
exposed this additional ordinary-word fragmentation after the first five
fixture kinds passed. Preserve the earned-Prism detail and destination exactly.
Every script byte other than this one title literal must equal the baseline.

## Acceptance

- Strengthen the existing Guidance driver with saved real word/glyph/clipping
  measurements and a fully visible ordinary action-word witness at 320px/200%.
- Preserve all 16 profiles/160 samples, long-text scrolling/native input,
  0.1px protected geometry, full-state/non-preference storage, hidden AX/focus,
  themes, Trial and actual destination/Settings/reload assertions.
- Keep the existing reservation-collapse negative. Add an exact CSS-reversion
  control that fails at the new readability assertion with healthy browser/runtime.
  Retain the width-only sensitivity check separately; the complete old-layout
  probe restores all original Guidance CSS, including removal of the new pseudo-element.
- Add the actual Ascend-ready state after the existing samples in every profile.
  Retain all original16/160 samples. Require its word, native toggle/navigation,
  state/storage and geometry checks, plus an exact production-title inverse
  whose complete HTML equals published3f1505d/4eb7bb44 and fails on "Permanent".
  That historical whole-file equality applies to the original repaired source
  only; later unrelated source changes use the exact current single-title
  mutation and its actual hash, with the same mandatory browser failure.
- Directly inspect the relevant screenshots, including the original failure.
- Pass the actual task context check, focused tests, and all six existing CI
  lanes on the exact candidate. Preserve 182 IDs/212 attempts and 40 registered /
  22 mandatory existing negative controls; do not weaken gates or fixtures.
- Review the complete diff, verify the integrated development tree and required
  fresh checks, and save original evidence in GitHub promptly.
- Native Android/textZoom/TalkBack/installed-app acceptance remains separate;
  historical signed F07 results do not establish new-byte native acceptance.

## Current acceptance and next action

The current bfed head passed all six required CI lanes. Original Full artifact
11705068020 is published at82afa800:182 IDs/212 PASS attempts, all22 mandatory
negative causes, guarded smoke, Guidance16/160 plus16 Ascend cases. The actual
merge354e19ff has ordered parents [684bfc52,bfed924b] and the identical complete
tree381a7951; all6567 file bodies/modes were verified. All13 exact fresh plan004
commands passed:843198 assertions/111 causal controls, with unchanged inputs,
Node24.19.0 and actual Node8.3.0/V8 6.0.286.52. No game-test retry was used.
Owner self-review supplements the published collaboration reviews; no external
independence is claimed. See the receipt for raw outputs and exact limits.

Supported development work stops here. Android/WebView60/textZoom/TalkBack and
installed-app acceptance remain separate and open. PR102 stays draft; main,
APK/build/signing/release stay held. The combined Full terminal log and original
Shared postmerge raw-file gap remain explicit; no missing output was invented.

## Historical preparation observations

GitHub and native fetch agree on the baseline. The isolated checkout was fully
materialized after disabling its inherited sparse checkout. Baseline product
SHA256 is `38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f`;
frozen fixtures remain `ab43604db1b5bce8b9990506f989676dfb0009cdcf2e514a8ccee9da166c8753`.

The existing toggle reserves 9.5em, capped at 70%; this leaves too little width
for enlarged hints. The original tests establish wrapping/scrolling but do not require
a complete ordinary word to be visibly readable. The candidate adds that
requirement. Local Chrome is blocked at startup by socket() EPERM, so the
existing Full CI now runs both the pinned original baseline and the candidate
probe before its original complete suite. The spacing candidate3f1505d passed
the five ordinary hints with actual title width131.53125px and complete Awaken
width123.234375px, but another real screenshot exposed the Ascend-ready copy.
Candidate0401f115 passed six lanes and Full182/212/22. Revision08e91b6e fixed
the permanent hash pin and partial CSS inverse. Review then found candidate
fonts in the historical baseline, a Python helper and overstated peer-review
attribution. These are corrected without changing product or Guidance driver.
At that preparation checkpoint, six-lane acceptance and integration were pending;
the current acceptance above supersedes that status.

The executor resumed an older filesystem snapshot: original Shared postmerge
raw folders are currently unavailable. The previous 13-pass observation and
known hashes remain in immutable recovery005 on the evidence branch; a new
recovery006 records current ENOENT observations. Missing originals are not
reconstructed or relabeled as new test outputs. Published CI evidence remains
available. This is a documented evidence gap, separate from the new F07 tests.
