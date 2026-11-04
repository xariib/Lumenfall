# Rift visual unlocks

User request (4 November 2026): full Rift background unlocks (live and still),
new enemy types and Wisp designs, clearer attacks, boss regeneration below the
Wisps, and an aligned active Rift navigation dot matching its gold logo.

Owner: this chat. Goal: expand cosmetic choice and combat readability.
Original baseline: `2ca3d3be6efaec29a82d3b86a14fbe7162c10632`. Isolated branch:
`feature/rift-visual-unlocks-001`. The concurrently integrated [Lab timer fix](LAB_TIMER_LAYOUT_001.md)
from main `29dbb1e9` was merged without changing its product behavior or tests.
Other worktrees and unrelated PR2 remain untouched. No new binding rules.

Status: integrated and released as Android 0.2.82; physical/human acceptance remains
open. [PR35](https://github.com/xariib/Lumenfall/pull/35) merged at the tested source
`278bb66920a67a26d984ea13181480ca2f9baa5b`. Product SHA256:
`513f88510ad2838b4369513c678ff1927b28576605d255acfade14bce4dc9eee`.
PR merge preview has the identical tree `48b20730b639d99c60ba66c1fc824a5164ba3f9d`.
Main fast-forwarded from `29dbb1e98bf17d67d07690ebb30f2e1a66d16c8d` to this exact
tested commit. [Release and public-byte receipt](../qa/rift-visual-unlocks-001/release.json).

## Implementation and acceptance

Seven full SVG backgrounds retain the regional default: Moonlit Crossing
(depth 10, still), Firefly Grove (25, live), Cinder Caldera (50, live),
Crystal Expanse (100, still), Aurora Sea (Ascend 5, live), Sunken Sanctuary
(250, live), Eclipse Citadel (Ascend 10, live). Live/Still and reduced motion
apply; previews are still.

Three sets across all eight Wisps: Crystal Kin (depth 50), Wild Spirits
(Ascend 5), Astral Guides (Mythic). Original art, colors and emblems retained.
Ancient Sentinels (depth 100): Rune Golem, Crystal Stag, Temple Moth.
Abyss Dwellers (250): Lantern Ray, Abyss Medusa, Reef Dragon.
Enemy families are appearances only; damage, rewards, encounter traits, prices,
progression and automation remain unchanged.

Deeds → Collection shows previews and locked requirements and refreshes immediately
on unlock. Existing aura and legacy cosmetics remain. Optional `riftLook`
defaults safely for old/invalid saves and survives both slots, reload, recovery
and Ascend. Boss regeneration follows the Wisp row. Brighter/larger shots start
at actual portraits above combat, bounded at 12 inert effects with separately
clipped impacts. Gold dot `#f0c567` matches other dots' 4×4px size, horizontal
centering and 7px bottom offset.

Acceptance: locked/unlocked choices; cosmetic-only state and persistence; distinct
art; motion modes; 320/390/430px and 200% text; panel order; bounded VFX;
inert decoration; dot geometry; original layouts, saves and accessibility;
required CI, Android build/upgrade and public-byte verification.
The [prior VFX finding](RIFT_VFX_OVERFLOW_001.md) remains recorded; original
overflow checks are retained. Modern browser/emulator tests cannot establish
physical-phone, exact WebView60 or TalkBack acceptance.

Changed product: `index.html`. Added focused/parity tests and Shared UI CI step.
Original Rift assertions now cover the requested panel position, portrait origin,
12-effect bound and expanded art, retaining original geometry/paint/economy checks.
Comet's empty DOM fixture supplies an empty querySelector. Historical Forge,
offline, Auto Ascend and Wisp oracles verify exact new preference defaults before
unchanged gameplay comparisons. The golden retains its independently verified
state/reward outputs; source binding follows verified full replay.
Native scripts add trusted-input diagnostics, real appearance selections and
installed-document readiness. No acceptance gate removed. Shared status summaries
were compacted with evidence links retained; all 32 workflow task budgets pass.

## Verification

- Final source: 1,471 visual assertions across 12 mobile/text/motion profiles PASS
  locally (Node 24.20/Brave 156) and in Linux Shared UI CI. Actual reload and
  immediate unlock refresh included. Missing-dot causal control fails the
  intended assertion. [Full local receipt](../qa/rift-visual-unlocks-001/rift-visual-combined.json.gz).
- Four complete eight-hour windows replayed second by second on Node 24.19:
  every gameplay field and reward matches the original baseline after exact new
  preference verification. Kill/Ascend/Prism triples remain 88592/4218/97014,
  88584/4218/97014, 88659/4222/97106, 88854/4231/97313.
  [Combined parity](../qa/rift-visual-unlocks-001/combined-parity.json).
- Original Rift contract PASS through existing CDP pipe, including all 40
  original/new vector symbols and all 23 default enemy species. Comet core
  12 sections PASS. Original mobile stacking/navigation PASS.
- Forge migration/controls, Auto Ascend 372 checks/controls, Wisp 8,099 checks/
  7 controls and 26,456 preservation checks/448 formula cases/40 chronological
  cases passed. Exact-source Linux offline 18 cases PASS within original deadline.
- Source, diff and all 32 task-context checks PASS. Visually reviewed all seven
  backgrounds, Collection, 32 Wisp portrait variants and attacks. Final native
  capture shows Rune Golem, Crystal Ember, Cinder and the gold Rift dot.
- Self/automated review only. Automated PR review's original stale golden finding
  was fixed through full replay and its thread resolved; no open review findings.

All seven PR and six release workflows PASS on the exact integrated source,
including both full premerge jobs, 190 main scenarios, runtime smoke and both
isolated offline jobs. Final successes verified at 14:15 UTC.
Release workflows: premerge 41835279474, Comet 41835284774, Forge 41835289349,
Lab 41835295234, Shared 41835299982, Tree 41835305019.
PR premerge: 41835243954. No skipped/failing required gate accepted as a pass.

Raw receipts, screenshots and [CI logs](../qa/rift-visual-unlocks-001/ci/) are in
[QA evidence](../qa/rift-visual-unlocks-001/). Initial local summary and ff9285c4
receipts are historical; combined receipts identify the final production source.

## Signed Android release

[Build 41835311201](https://github.com/xariib/Lumenfall/actions/runs/41835311201)
PASS on exact 278bb669. Version **0.2.82 / 1000082**; package `com.lumenfall.app`.
Established certificate SHA256:
`A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21`.
APK 7,100,109 bytes; SHA256:
`247dc741865d5e510d2be5d1a5aa01f877cc4911617e36e0840eb2763550673d`.
Artifact 13324504325 ZIP SHA256:
`610d47de38bdf742f140935d4d6c0984857b7d487c7164b3e95e99dbe28047af`.
ZIP digest, exact packaged production HTML/fonts/branding, origin and upgrade
receipt verified locally. APK is in sibling `rift-visual-signed-combined`.

API31/WebView91.0.4472.114: signed158 → candidate in-place upgrade retains both
saves, identity, paid work and legacy entitlements. Native Wisp/Farm/Lab/directional
input PASS. Actual touches select Cinder/Crystal/Ancient/Still; both saved slots,
full background bounds, art and gold dot PASS. Actual updater download cancel,
permission refusal, restart, tamper rejection, system installer cancel/approval
and final origin/storage/both saves PASS.
[Final native receipts](../qa/rift-visual-unlocks-001/native-combined/).

[Android 0.2.82](https://github.com/xariib/Lumenfall/releases/tag/android-1000082)
published by guarded draft promotion of the exact signed/installed artifact;
no rebuild. Anonymous exact-tag and latest downloads both returned HTTP200,
7,100,109 bytes and the expected APK SHA256 at 14:17 UTC. Install over the
existing app. The release includes the previously integrated Lab timer fix.

## Failure disposition and continuation

Four earlier Android failure ZIPs retained: emulator disappeared before candidate
installation; undiagnosed native Lab focus failure; updater activity removed
120ms after package replacement; storage read before replacement document commit.
Native input now remeasures centered trusted touches and waits up to 5s for the
same required focus/destination. Updater waits 1s for package broadcasts, uses
am start -W, and requires real DOM/origin/storage readiness. Final runs pass all
assertions. Superseded successful 0.2.80/ff9285c4 is not the combined release.

Earlier full run 41825388671 finished with two failing scenarios: Comet's missing
mock selector and Rift's old origin/count/catalog assumptions. Both are fixed and
pass locally; the full raw failure log is retained as ci/126558708208.log.gz.
Windows dump-DOM transport timed out; existing CDP pipe completed the same contract.
Original Windows cosmetics had cleanup/close failures after content assertions;
full Linux acceptance passes. Redundant slow Windows offline replay stopped after
Linux passed; no local deadline claim. The old golden generator hardcodes pre-tap
outcomes and failed unchanged; paired full replay provides the verified binding.
Browser control remains disabled/settings unchanged; connector lacks dispatch,
so scoped GitHub API uses the normal existing Git identity.

Delivery checks are complete. Final documentation/evidence are saved after
publication, with no further product changes. Next: physical-phone/WebView60/
TalkBack and human visual/performance acceptance when available. Shared product
work for this feature has stopped; other active worktrees remain untouched.

Physical phone, exact WebView60 DOM, TalkBack and human visual/performance review
remain open under the [feature workflow](../project/FEATURE_WORKFLOW.md).
Keep this task/chat open for that acceptance; do not archive or claim completion.

User supplied standing cleanup preferences during delivery: disposable task
staging may be cleaned without repeated permission, after exact path/provenance/
contents/link/worktree checks; rejected cleanup must not be disguised or rerouted.
Verified 15 unchanged source copies, no links, no worktree or active task process
in C:\Users\CustomCodings\Documents\ChatGPT\Lumenfall\rift-visual-combined-web.
Native PowerShell Remove-Item was rejected by exec_command with only
`blocked by policy`; no supported approval override exists in this session.
Folder remains; no alternate deletion route attempted. This is not attributed
to automatic approval review. [Ownership/check/rejection receipt](../qa/rift-visual-unlocks-001/cleanup.json).
