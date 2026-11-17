# STANDING_AUTHORIZATION_001 — explicit no-permission instruction

Original user requirement, 17 November 2026:
> Never ask for permissions again for Lumenfall project.

Goal: preserve this standing instruction in the current repository entrypoints.
Owner: this feature chat. Scope: documentation only.

Baseline: origin/main at 18230be4bb2e7daada7485e19e469dfc5aee94ff.
The initial checkout belongs to another feature and was left untouched.
Isolated branch: docs/standing-authorization-20261117, sibling worktree
Lumenfall-authorization. No open PRs were returned by the live repository query.
Existing approval from 5 October already covers necessary work in agreed scope.
The new wording explicitly prohibits permission and renewed approval requests;
missing requirements can still be clarified. The exact user wording, reason and
effect were communicated before applying the update. No new approval is required.

Acceptance: preserve the exact instruction; align AGENTS, both startup text
entrypoints and the feature workflow; pass context/link/budget and whitespace
checks; review the complete diff; save the instruction in GitHub main.
Game code, saves, scope safeguards, tests and release workflows remain unchanged.

Changed files: [AGENTS.md](../../AGENTS.md),
[PROJECT_BOOTSTRAP.txt](../../PROJECT_BOOTSTRAP.txt),
[PROJECT_INSTRUCTIONS.txt](../../PROJECT_INSTRUCTIONS.txt),
[feature workflow](../project/FEATURE_WORKFLOW.md),
[project status](../PROJECT_STATE.md), and this checkpoint.

Checks: Node.js v24.22.1. Baseline context check PASS (28 entrypoints,
51 local links, shared startup 18,734 bytes). Task-specific context check PASS (29 entrypoints, 57 local links,
21,607 startup bytes); git diff --check PASS; complete six-file self-review PASS.
Repeat context and whitespace checks after integration. Documentation-only acceptance requires no APK or gameplay tests.
Self-review only. No CI gates or workflow triggers are changed.

Status: implementation complete; validation and GitHub integration pending.
Next action: validate the task and diff, commit, fast-forward GitHub main only
if the baseline is still current, then verify the integrated documentation.
Archive status: open until integration is verified.
