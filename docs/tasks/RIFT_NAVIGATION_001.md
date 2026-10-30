# RIFT_NAVIGATION_001 — direct Rift navigation

Status: local candidate validated; CI/integration/Android pending. Owner: this feature chat.
Baseline: main `41566c97`; branch `feature/rift-navigation-001`.

User request (30 October 2026): add left/right buttons beside “Rift xx”
for one-step navigation and a button for ten Rifts back; remove the disliked
“Choose farming Rift” box shown in the attached phone screenshot.

Scope: replace the picker with immediate main-screen controls. Retain Farm/Push
and saved Push depth, manual Farm intent, persistence/rollback and all rewards.
Existing farming excludes bosses: arrows skip boss Rifts, and forward from the
highest cleared Rift resumes Push. Back ten targets current depth minus ten,
clamps at one and skips a boss downward. No balance or save-schema changes.

Acceptance: direct controls and no picker; bounds, boss transitions, Push return,
manual intent, reload and storage failure coverage; mobile touch/layout and
existing Farm regressions; required CI/integration and Android acceptance.

Overlap: open PR29 changes taps and a Mote-clock boundary in index.html; keep
this isolated and reassess at integration. No changes to its checkout.

Implementation: direct −10 / previous / next controls beside the Rift number;
Farm enters immediately and no chooser markup, logic or chevron remains. Forward
returns to saved Push; existing transactional saves and manual intent are reused.
Updated accessibility, layout, mobile touch and visual-audit expectations only
where the removed picker was required. New navigation regression runs through
the existing progression-pacing CI entrypoint. GitHub rejected a workflow-file
edit because the available OAuth token lacks workflow scope; no workflow change
is needed to run the additional checks in that existing entrypoint.

Local Node24.20 checks: navigation101, pacing322/five controls (221 existing), Farm
recap353/old-recap control, source syntax/contracts and context PASS. Independent
four 8h one-second windows reproduced every previous result/state hash; only
their source binding changed. [Receipts](../qa/rift-navigation-001/core.json).
Initial mobile touch434 checks/18 profiles PASS (Brave156, widths320/390/430,
100/150/200% text, both motion preferences). Screenshots visually inspected.
Final-source Chrome156 mobile rerun PASS,434 checks/18 profiles.
Windows DOM layout launch/teardown timeouts are recorded separately from passing
layout assertions (all five viewports passed assertions; first two process exits
failed shutdown). Linux CI remains required. No physical phone, exact WebView60
or TalkBack acceptance claimed.

Next: publish PR, required CI, integrate without overwriting PR29, Android build.
Workflow: [feature workflow](../project/FEATURE_WORKFLOW.md).
