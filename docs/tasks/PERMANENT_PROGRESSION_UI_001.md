# PERMANENT_PROGRESSION_UI_001

Status: integrated and released as Android 0.2.48. Automated integrated-source and installed-emulator acceptance PASS. Physical-phone, exact WebView60 DOM, TalkBack and human visual/pacing acceptance remain open; do not archive this feature as device-accepted.

Baseline: main73f4e3f17504cba50276a17c374d7c4c78a5f7f5 / public0.2.43. [PR14](https://github.com/xariib/Lumenfall/pull/14) passed all seven feature-head gates on bb3ae222c76ca433d7f62e896630a100c3dc3a44 and merged at0c0e79546edf228567b13b6e2d76e7bbdb0a3871 with an identical tree. Release source: 0f2445e342cf9de2ff07b1fe36438315cdde691d; product HTML SHA-256 c2107fc911ec39984bf39d03847f49c4c67997b259baf611489ca115495f66f1. The later release-preparation commit changes only release copy and its task. Publication was subsequently authorized under [PERMANENT_PROGRESSION_RELEASE_001](PERMANENT_PROGRESSION_RELEASE_001.md).

## Requirements and authorization

The user approved the public source upload and PR on27 October2026: "Godkendt", replying to the exact source-upload/PR permission question. No repeated permission is needed. Do not use subagents or rename chats.

- Remove open/close upgrade controls from game cards. Unfinished Wisp upgrades remain directly visible; completed sections become gold and their completed purchase controls disappear. The whole Wisp is gold only after Empower10000, Rarity5, Ability20, Ultimate and Mastery2000. Keep readable inline ability explanations, original progression and native same-card focus.
- Rift-locked upgrades show "Unlocks at Rift XX" without currency prices. Preserve prerequisite enforcement and earned access.
- Five compact Lab slots, inspired by The Tower: click the row/name to choose research, no Change button. Back to Labs returns to slots. Separate Speed Up editor and visible timed summary. Existing paid work, slot associations, saved old-speed floors and independent slot-owned boost deadlines survive changing/clearing research and offline play. No recurring Mote purchases.
- Choose an earlier cleared non-boss farming Rift without Ascend, including a12-back shortcut. Preserve the current Push frontier, max-depth history and all currencies; Push returns to that frontier. Save/reload retains the exact chosen Rift. Primary failure rolls back the complete switch.
- Fixed Forge multipliers buy exactly the selected count or nothing; show the full exact requested cost, red for each insufficient resource. Reject a fixed count that exceeds remaining cap. Only Max buys an affordable remainder. Preserve original price/effect arithmetic and free queued1x behavior.
- Remove Comet commands and consumable purchases, including Quest Refresh. Comets fund difficult permanent Wisp investments. No tournament/mission-box system was requested or invented. Auto-Ascend remains100Comets.

## Current design and save contract

Astral Core:Rift250/base750Comets/×1.25 own Wisp Power per rank. Astral Echo:Rift500/base1250/×1.3 automatic ability damage and Lumen/Shard ability rewards. Astral Convergence:Rift1000/base2000/×1.25 unlocked Ultimate damage/rewards and Support Ultimate bonus strength. Each has10 permanent ranks, costs ceil(base×1.2^rank). No consumable charges or manual activations.

Schema6 adds a strict closed astralUpgrades map and commandRefund:{policy:'commands-retired-v1',total,paid}. Retain original command ownership/ranks/earned events/claims as immutable history; refund original known prices once. Unrepresentable native credits remain pending, wide credits stay exact. A saved already-called enemy still earns its old objective once on its real defeat. No recharge or new commands. Invalid current ranks/refund receipts protect both raw saves and block overwrites while displaying valid recovery. Old migrations, balances, paid work, timers, chronology, natural Motes, package/certificate and other progression are preserved. No transient action glows.


## Verified integrated delivery

All seven workflows pass on release source 0f2445e342cf9de2ff07b1fe36438315cdde691d: complete Pre-merge validation, Comet/Deeds, Forge, Lab, Shared UI, Tree and Permanent progression. Both complete pre-merge jobs pass:189 main scenarios plus1 isolated offline scenario. Exact run/job references are in the [delivery receipt](../qa/permanent-progression-ui-001/release.json). Attempt1 of integrated validation was manually cancelled after stale browser log lines were mistaken for a stalled test; its completed log proves ongoing progress. Only the validation job was rerun on identical source. Existing assertions, deadlines and release gates were preserved.

The focused suites cover direct upgrades and gold completion, no Rift-locked prices, five selectable Lab rows, the Speed Up editor and slot-owned boost deadlines, exact Forge quantities, chosen farming Rifts, permanent Astral prices/effects, once-only refunds, save/recovery and offline chronology. Native input covers18 mobile profiles; prior retained-suite numerical, mutation and legacy V8 results remain source-qualified in [implementation checkpoints](../qa/permanent-progression-ui-001/implementation-checkpoints.md) and the [pre-integration task history](https://github.com/xariib/Lumenfall/blob/bb3ae222c76ca433d7f62e896630a100c3dc3a44/docs/tasks/PERMANENT_PROGRESSION_UI_001.md). Earlier failed candidates and their explanations are retained there; they are not the final acceptance result.

[Android test47](https://github.com/xariib/Lumenfall/actions/runs/40487175872) and the publishing build both pass on the exact integrated source. The publishing build verifies the established signer/package, all15 packaged assets, origin and exact-APK upgrade receipt before release. Installed upgrade from0.1.158 retains UID/origin, BOTH saves, paid progression and legacy entitlements; actual Wisp purchase and Farm-to-Lab navigation pass.

[Android 0.2.48](https://github.com/xariib/Lumenfall/releases/tag/android-1000048) is published. The stable public APK was downloaded anonymously and independently checked against the published checksum, native upgrade receipt, actual signing certificate and exact main assets. APK SHA-256: 7c1450dc72c36afe06132078686a89516feaeeb08ee384ef8ac98c8815302553. [Release and native-build evidence](../qa/permanent-progression-ui-001/release.json). No new game changes were needed during delivery; final documentation changes preserve the tested product and validation code. Self-review and automated checks only; no independent human review is claimed.

## Next action and remaining acceptance

Install the released APK as an update without uninstalling; first use Settings → Save Backup. On the physical phone, check always-visible unfinished upgrades and gold completed paths, locked-Rift text, Lab selection/Queue OFF/slot Speed Up, earlier farming Rifts and return to Push, exact Forge quantities, permanent Astral purchases/refund, and retained saved progression. Record physical-phone, WebView60, TalkBack and human pacing outcomes separately. Missing device acceptance stays open; do not restart implementation or publish another APK merely because the earlier checkpoint was interrupted.
