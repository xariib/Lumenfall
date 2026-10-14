# Upgrade affordability everywhere

14 October 2026. Owner: this feature chat. Goal: show insufficient upgrade
resource numbers in red and disable unaffordable purchase buttons everywhere.

Original user requirement:
> If the user does not have sufficient resources for the upgrades, show the numbers in red everywhere where upgrades applies. The buttons should be in disabled state as well.

Baseline: `a4f82f4` on `local/full-debug`, tracked files clean; untracked
validation-evidence preserved. Isolated branch `codex/upgrade-affordability` in
validation-evidence/upgrade-affordability-worktree. Other features' worktrees
remain untouched. Continue the existing local-only improvement workflow; GitHub,
combined CI and Android acceptance remain pending. No new binding rules.

Inspection: Forge/Lab/Tree/Comet prices already use purchasePriceMarkup and
500ms wallet refresh. Wisp Empower/Recruit, Rarity, Ability and Ultimate prices
bypass that helper. Resonate also lacks live eligibility refresh. Preserve each
currency's independent shortage state, paid/refund credit rules, prerequisites,
caps, purchases, queues, progression, saves and focus/scroll. No migration.

Acceptance: all upgrade families use current wallet colors; only deficient
amounts are red. Unaffordable actions are natively disabled and cannot spend.
Initial rendering, wallet gain/loss, partial two-currency funding, purchases,
locked/capped states and mobile/200% text remain correct. Existing collection,
Wisp upgrades/layout/scroll, Lab speed and relevant preservation gates pass.
Task links/startup budget and source validation pass. Review full diff; stage
and verify exact local preview assets after serial integration.

Status: local candidate verified, source084f2995. All8 Wisps now use shared
price coloring; Resonate refreshes eligibility. Product scope is three UI
functions/one font rule; other bytes identical. New26,844/12-profile checks,
collection5808/3 controls, Wisp12912/layout21528/scroll3229, Lab speed1118,
Resonate original/candidate13 records, core8099/preservation8592 and actual
V8 6.0 PASS. Two new causal controls rejected. Test-only Resonate animation
wait fixes reproduced baseline43.83px transient; strict44px gate retained.
[Evidence and commands](../qa/upgrade-affordability-001/README.md).
Next: serial local integration, final driver/preview verification.
Final main/GitHub/CI/native acceptance OPEN; keep chat open.
[Workflow](../project/FEATURE_WORKFLOW.md),
[prior Wisp design](WISP_CARD_SIMPLICITY_001.md),
[current status](../PROJECT_STATE.md).
