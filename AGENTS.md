# Lumenfall — project rules

Repository: `xariib/Lumenfall`. Communicate in English. Codex loads this file
from the checkout. With GitHub-tool-only access, fetch it explicitly.

## Start or continue work

For a new task, start with `AGENTS.md` and the feature checkpoint. For a
same-task follow-up, continue from the current state and reread the checkpoint
when resuming after a handoff or when context is uncertain. Open project status,
setup, and source guides as needed.

- Use `docs/tasks/<FEATURE_ID>.md` as the checkpoint and create it if missing.
  The user's task defines scope. One owner chat handles implementation, fixes,
  tests, documentation and delivery. Record unrelated findings for a separate task.
- Check the checkout, relevant main/PR and actual overlap before editing shared
  files or integrating. Use an isolated branch/worktree for concurrent features,
  preserve others' uncommitted work, and serialize integration. Check relevant
  workflow triggers before remote actions.
- Run `node scripts/codex/check_context.cjs --task docs/tasks/<FEATURE_ID>.md`
  to check the actual task, links and startup budget.
- Consult [project status](docs/PROJECT_STATE.md) for delivery or overlap,
  [setup and checks](docs/project/CODEX_START.md) for environment details, and
  the [source index](docs/CONTEXT_INDEX.md) to find relevant material. Technical
  guides are references. Use material in docs/recovery, docs/handoffs and archive
  as historical evidence. Restore candidates separately from the live product.

## Authorization and safeguards

- The user's current instructions and standing approval cover necessary work
  within scope. On 17 November 2026 the user instructed, “Never ask for
  permissions again for Lumenfall project.” Clarify missing requirements,
  including gameplay decisions. Merge, build, signing, release, reruns and
  cleanup must fit the task. Documentation work carries no APK release scope.
- Create new chats, rename chats, or use subagents or messaging tools only on
  explicit request. The feature owner needs no separate Lead or writer assignment.
- Read affected code and original requirements before editing. Verified code
  establishes implemented behavior. Distinguish observations, reports and
  unknowns. Product files are `index.html`, `tests/behavioral/` and `mobile/`.
- Make small changes. Preserve unrelated features, UI, assets, balance, caps,
  saves, tests and CI gates. Intentional changes need a user requirement and
  relevant migration/regression coverage. Record the baseline and existing
  failures, add focused regression coverage for changed behavior, review the
  complete diff and fix introduced regressions.
- Use JavaScript/Node.js 20+ where possible for code, tests, test execution, CI
  logic and helpers. HTML, necessary declarative formats and native Android
  tools remain valid. Migrate existing tooling only within scope with coverage.
  Preserve archives byte-for-byte. [Language decision](docs/decisions/2026-10-07-javascript-first.md).
- Before applying a new binding rule, tell the user its exact text, reason and
  effect. Save the user's decision and update the affected instructions.

## Game contracts

- Lumenfall is an Android idle RPG with Wisps in Rift, using HTML/JavaScript in
  a WebView. Preserve accessibility, WebView 60 support, package
  `com.lumenfall.app` and the established signing identity.
- Preserve deterministic progression and purchases with visible prices/effects
  and no loot boxes or gacha. Eligible Luminous kills pay fixed Motes at most once
  per 60 seconds across Rifts and online/offline play. Preserve depth and purchased
  bonuses for eligible payouts and Lumen/Shard rewards for other Luminous kills.
- Across upgrade interfaces, including individual Wisps, maxed upgrades have gold
  borders, prerequisite locks explain how to unlock, and eligible upgrades show
  prices. Refresh affordability as resources change. Show each insufficient
  currency in red and disable the purchase button. [Requirements](docs/tasks/UPGRADE_STATES_001.md).
- Avoid transient highlights, glows, pulses and target flashes on Show hint,
  Claim rewards and similar actions. Preserve keyboard focus indicators and
  normal pressed/disabled states. Pointer/touch activation leaves no focus
  outline or card highlight. [Decision](docs/tasks/MOBILE_FEEDBACK_001.md).
- Forge upgrades have finite caps, target roughly 2–3 years of sustained
  progression with Lab help, and retain paid above-cap bonuses. [Calibration](docs/tasks/FORGE_YEARS_001.md).
- Ascension is manual after clearing Rift 15. Each later Ascend requires a clear
  above the highest previously rewarded clear. Preserve prior progress and the
  validated one-time 100-Comet refund for former Auto-Ascend owners.
  [Manual Ascension decision](docs/decisions/2026-11-16-manual-team-progression.md).
  For eligible new records, calculate the bonus from the unrounded depth-curve
  difference with current Tree and completed Lab bonuses and round up once.
  Preserve first reward, protected base/earned bonus, minimum 1 for eligible
  rewards and the full-reward cap. [Rounding](docs/decisions/2026-10-07-ascend-prisms-rounding.md)
  and [protected bonus history](docs/tasks/PRISM_EARNING_001.md).
- Preserve chronological simulation, online/offline parity, remaining automation
  and save recovery. Consult [known issues](docs/project/KNOWN_ISSUES.md) for
  limitations. Use accepted requirements and verified code for mechanics, caps
  and migrations.

## Checkpoint and deliver

Save requirements, baseline, acceptance, changed files, decisions, check results
and versions, blockers and next action in the task document on GitHub.
Checkpoint after milestones and corrections and before compaction or handoff.
Use the [handoff template](docs/HANDOFF_TEMPLATE.md) to continue from the exact
version and next action. [Account recovery](docs/project/ACCOUNT_RECOVERY.md)
covers a new account.

Follow the [feature workflow](docs/project/FEATURE_WORKFLOW.md) and relevant
[CI gates](.github/workflows/pre-merge-validation.yml). Completion requires
integration, passing acceptance on the integrated version, saved evidence, and
any required app build and device acceptance. Keep work open when a required
check is blocked, fails or cannot be reproduced. Record evidence and next action.
Report self-review accurately and disclose limitations. Archive only the owner
chat after verified completion and saved continuation status.
