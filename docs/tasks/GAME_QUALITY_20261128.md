# Game quality audit, 28 November 2026

Original request: “Fix every visuals problem in the game. Fix every bug, every exploit. Debug the game so good, that next time i update it i would be very very impressed.”

This feature chat owns the audit and corrections. Baseline is main 55f81bf9 (Android 0.2.171), in the isolated fix/game-quality-20261128 worktree. Open PRs 72 (Tree pricing) and 63 (Google Play packaging) remain separate.

In progress. Check all six player destinations, narrow screens, Settings and dialogs, gameplay and economy invariants, persistence and offline progression. Reproduce findings on the baseline, cover changed behavior, preserve paid progress and existing balance. Acceptance includes the integrated CI gates, signed Android upgrade and release verification. Record outstanding device limitations. Next action is to run the visual matrix and core regression baseline and investigate uncovered player flows.

## Findings and fixes

- At 568 × 320, the enemy covered the damage readouts and the party extended to y=317 behind navigation starting at y=271. The short landscape layout now gives the arena and party a column beside the controls and damage numbers. [Before](../qa/game-quality-20261128/landscape-before.png) and [after](../qa/game-quality-20261128/landscape-after.png).
- After a one-day backward correction, a funded Cauterize button remained disabled. Refresh windows now recover immediately on rollback. Timed combat visuals use elapsed time. Calendar rewards and simulation prices are unchanged.
- At 40 trusted manual inputs per second, rejected presses consumed the following second's allowance. Only accepted attacks now occupy the existing rolling 20-tap window. Script-generated input earns zero.
- A primary storage failure on a valid backup produced an invalid-code message behind Settings. The message now identifies storage failure and stays visible. A failed reset-marker write keeps the game and confirmation open for retry. Tests simulate storage failure using disposable saves.

Changed the game, Rift input/layout, live-clock and backup UI tests, and the exact-source offline reference. Local Node 24.22.3. On the released source the standard visual audit passed 1,792 checks across 16 viewport, text scale and motion profiles. The new landscape, rapid-input, restore and clock assertions caught defects outside that matrix. The final candidate passed 113 action and paid-work checks and 14 rollback checks with negative controls. Local Windows Chrome occasionally exceeded its shutdown deadline after successful assertions. A historical aggregate also includes obsolete balance expectations documented in [the Forge/Lab task](ENDLESS_FORGE_LAB_PACING_002.md). The current CI, integrated build, signed upgrade and release verification remain required.

The [paired replay](../qa/game-quality-20261128/offline-replay.json) reproduced all four accepted eight-hour reward and saved-state hashes on both versions. Only the source binding changed in the golden fixture. Next action is to validate the PR and its merge commit, then build and verify the signed update.
