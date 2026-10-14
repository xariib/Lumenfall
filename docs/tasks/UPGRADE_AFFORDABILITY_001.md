# Upgrade affordability everywhere

14 October 2026. Owner: this feature chat. Goal: show insufficient upgrade
resource numbers in red and disable unaffordable purchase buttons everywhere.

Original user requirement:
> If the user does not have sufficient resources for the upgrades, show the numbers in red everywhere where upgrades applies. The buttons should be in disabled state as well.

Baseline:a4f82f4/sourcee110f182, clean tracked local/full-debug; untracked
validation-evidence preserved. Isolated codex/upgrade-affordability, integrated
serially at1553d44. No other worktree changed. Existing local improvement/release
scope retained; no new rule or save migration.

Wisp Empower/Recruit, Rarity, Ability, Ultimate and Resonate now use shared
independent currency colors; Resonate refreshes eligibility. Existing Forge/Lab/
Tree/Comet behavior retained. Preserve prices, handlers, caps, prerequisites,
refund-credit rules, queues, progress, saves and focus/scroll.

Acceptance: red deficient amounts, disabled actions; initial/refresh/rerender,
wallet gain/loss, each missing currency, purchases/caps/prerequisites and mobile/
200% text correct. Preserve state/saves/focus. Context/source/diff checks pass.

Status: LOCAL INTEGRATION VERIFIED, source084f2995. Three UI functions/one font
rule; other bytes identical. New26844/12 profiles, two controls; existing
collection/Wisp/Lab/Resonate/core/preservation and V8 6.0 PASS. Test-only animation
wait fixes baseline43.83px transient; strict44px check retained.
[Evidence and commands](../qa/upgrade-affordability-001/README.md).
All15 staged/HTTP preview assets match4174; app opening queued, actual visible
tab reload unclaimed. Final driver26844/12 profiles/two controls PASS on integrated
source. Next: user preview review, then existing final combined acceptance.
User/final combined CI/GitHub/main and Android/WebView60/textZoom/TalkBack/device
acceptance OPEN with inherited debugging limitations. No push/APK/release/archive.
Keep chat open.
[Workflow](../project/FEATURE_WORKFLOW.md),
[prior Wisp design](WISP_CARD_SIMPLICITY_001.md),
[current status](../PROJECT_STATE.md).
