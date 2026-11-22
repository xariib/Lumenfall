# CODEX_STARTUP_001 — Lumenfall chat startup

The user asked what happens for a new or ongoing Codex chat, in what order, and
requested agent-behavior optimization if startup uses too much context.

## Baseline and scope

Current main `87e24896` is the baseline. Work takes place on
`docs/codex-startup-001` in a separate worktree. The original checkout is on the
Forge/Lab feature. Open PR #63 shares the delivery status file, so this task
uses a separate status entry and will recheck the combined diff before merging.
Scope covers repository instructions, startup documentation and their validation.

The original mandatory startup was `AGENTS.md` (9,854 bytes),
`PROJECT_BOOTSTRAP.txt` (2,328) and `docs/PROJECT_STATE.md` (7,739),
for 19,921 bytes before the feature task. Setup and source guides added 14,572
bytes when read in full. These are UTF-8 file sizes on main.

## Codex behavior

A fresh thread starts with the project workspace and its instruction chain.
Codex discovers global guidance first, then project instructions from the root
toward the working directory. It applies the prompt and chooses relevant tool
calls. A follow-up on the same thread uses the carried conversation state.
During active work, steering updates the current turn and queueing starts the
next. Codex can compact long history. Repository documents beyond the
instruction files enter model context when the agent reads them or they are
provided explicitly.

Sources: [Codex instruction discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md),
[app-server thread lifecycle](https://learn.chatgpt.com/docs/app-server), and
[steering and queueing](https://learn.chatgpt.com/docs/prompting).

## Decision and acceptance

The user's conditional request authorizes removing the measured duplication.
Before applying the change, the owner told the user the revised instruction:
“For a new task, start with `AGENTS.md` and the feature checkpoint. For a
same-task follow-up, continue from the current state and reread the checkpoint
when resuming after a handoff or when context is uncertain. Open project status,
setup, and source guides as needed.”

Keep standing authorization, checkpoint durability, baseline and overlap
checks, all game contracts, and acceptance gates. Verify the bootstrap and
recovery prompt route to the same instructions. Verify that the context checker
counts mandatory files while still checking the optional entrypoints and links.
Record before/after sizes and verify required GitHub checks before integration.

## Implementation and checks

- `AGENTS.md` now holds the lean startup path and existing project/game
  safeguards. Bootstrap and project instructions point to it. Workflow, recovery,
  setup and the source index route reads by task or continuation state.
- `check_context.cjs` counts only required startup reads, `AGENTS.md` plus
  the selected task. It still validates the optional entrypoints and links.
  The tooling regression checks exactly 32 KiB and rejects one byte over.
- Shared text fell from 19,921 to 6,500 bytes (67.4%). This measures required
  repository text and excludes Codex's own context, user messages and tool output.
  End-to-end model token use and latency were not measured. No new chat was
  created for this check.
- Windows/Node 24.22.1: actual task and all 38 distinct task invocations in CI
  passed. Focused checks covered links, required tasks, and both sides of the
  budget boundary. Archive verification passed 1,509 checks and 96 sources.
  The full Windows tooling suite hits the existing POSIX file-mode assertion
  (438 vs 420) on baseline `87e24896`; use the Linux PR check for that suite.
- Only docs and context tooling are in scope. Self-review inspected the full
  diff. PR #63 changes the same status file in a separate section.

Status: local checks passed. Next action: publish the branch, verify required
Linux PR checks, integrate and record the integrated check result.
