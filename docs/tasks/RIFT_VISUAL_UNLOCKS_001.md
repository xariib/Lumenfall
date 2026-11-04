# Rift visual unlocks

User request (4 November 2026): full Rift background unlocks (live and still),
new enemy types and Wisp designs, clearer attacks, boss regeneration below the
Wisps, and an aligned active Rift navigation dot matching its gold logo.

Owner: this chat. Goal: expand cosmetic choice and combat readability.
Baseline main `2ca3d3be6efaec29a82d3b86a14fbe7162c10632`; isolated branch
`feature/rift-visual-unlocks-001`. Other worktrees/unrelated PR2 remain untouched.
No new binding rules. Existing SVG/CSS asset system retained.

Status: implementation/native acceptance PASS on the prior candidate; combined
main validation, integration and release pending. Prior tested head
`ff9285c45e415a217b7103359230926c9f6d6b58`;
[PR35](https://github.com/xariib/Lumenfall/pull/35) open. Product SHA256
`b028d76d0edef5ac0cccb6adc457d82f05a72d81148d2a0110a234737e8942bf`.

## Scope and implementation

Seven full backgrounds retain the regional default: Moonlit Crossing (depth10,
still), Firefly Grove (25, live), Cinder Caldera (50, live), Crystal Expanse (100,
still), Aurora Sea (Ascend5, live), Sunken Sanctuary (250, live), Eclipse Citadel
(Ascend10, live). Live/Still and reduced motion apply; previews are still.

Three sets across all eight Wisps: Crystal Kin (depth50), Wild Spirits (Ascend5),
Astral Guides (Mythic). Original art/colors/emblems retained. Ancient Sentinels
(depth100) adds Rune Golem, Crystal Stag, Temple Moth; Abyss Dwellers (250) adds
Lantern Ray, Abyss Medusa, Reef Dragon. Enemy families are appearances only;
damage, rewards, encounter traits, prices, progression and automation unchanged.

Deeds → Collection shows previews/locked requirements and refreshes immediately
on unlock. Existing aura/legacy cosmetics remain. Optional `riftLook` defaults
safely for old/invalid saves and survives both slots, reload, recovery and Ascend.
Boss regeneration follows the Wisp row. Brighter/larger shots originate at actual
portraits above combat, bounded at12 inert projectiles with separately clipped
impacts. Gold dot `#f0c567` matches other dots'4×4px/center/7px-bottom geometry.

Acceptance: locked/unlocked choices, cosmetic-only changes and persistence,
distinct art, motion modes,320/390/430px/200% text, panel order, bounded VFX,
inert decoration, dot geometry, original layouts/saves/accessibility and required
CI/Android delivery. [Prior VFX finding](RIFT_VFX_OVERFLOW_001.md) retained;
original overflow checks remain. Phone/WebView60/TalkBack require separate proof.

## Changes and checks

Product: `index.html`. New focused/parity tests and Shared UI CI step. Original
Rift ordering test now enforces requested panel position, retaining all bounds.
Forge/offline/Auto Ascend/Wisp historical comparisons require exact new defaults
before unchanged gameplay comparisons. Golden rewards remain; source/full-state
hashes rebound from verified parity. Native scripts add trusted-input diagnostics,
appearance selection and installed-document readiness; no acceptance removed.
Status compaction retains evidence links and all32 workflow task context budgets.

- Final focused:1,471 assertions/12 profiles PASS, Node24.20/Brave156 locally and
  Linux CI, including actual reload and live unlock refresh. Missing-dot causal
  control fails exactly `active dot visible battle`.
- Four baseline/candidate eight-hour windows replayed second by second, Node24.19:
  every gameplay field/reward matches after verifying exact new defaults.
  Kill/Ascend/Prism triples88592/4218/97014,88584/4218/97014,
  88659/4222/97106,88854/4231/97313 unchanged.
- Original Rift/mobile/navigation, Forge migration/controls PASS. Auto Ascend372
  checks/controls PASS. Wisp8,099 checks/7 controls plus26,456 preservation checks,
  448 formula cases and40 chronological cases PASS.
- Exact-source Linux offline18 cases PASS within original deadline; original
  cosmetics PASS in Linux premerge. Source/context/diff PASS.
- Visually reviewed Collection, all32 Wisp portraits, attacks and scene captures.
  Final native screenshot shows Temple Moth/Crystal Ember/Cinder and gold dot.
  Self/automated review only.

Evidence: [historical local summary](../qa/rift-visual-unlocks-001/local.json),
[full parity](../qa/rift-visual-unlocks-001/parity.json), final focused compressed
receipt/screenshots in the same directory, [native receipts](../qa/rift-visual-unlocks-001/native/)
and [CI logs](../qa/rift-visual-unlocks-001/ci/).

## Native build and delivery

[Android41825228083](https://github.com/xariib/Lumenfall/actions/runs/41825228083)
PASS on exact ff9285c4:0.2.80/1000080, package `com.lumenfall.app`.
Established certificate SHA256:
`A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21`.
APK7,099,984 bytes; SHA256
`6659e01477f078cdb8f4fbe9a6b142584f3535f9ba38a7584309533d81c19b7d`.
Artifact13318687417 ZIP digest, packaged production assets, origin and exact
upgrade receipt verified locally.

API31/WebView91.0.4472.114: signed158 → candidate in-place upgrade retains both
saves, identity, paid work and legacy entitlements. Native Wisp/Farm/Lab/directional
input PASS. Real touches select Cinder/Crystal/Ancient/Still; saved preferences,
full field, art/dot PASS. Actual updater download cancel, permission refusal,
restart, tamper rejection, system installer cancel/approved install and final
storage/origin/both saves PASS.

Exact-head release runs: premerge41825388671, Comet41825395541, Forge41825402338,
Lab41825409669, Shared41825417011, Tree41825424296. Focused release/PR gates and
both isolated offline jobs PASS. Two broad main jobs still run190 scenarios.
Previous broad success took65min. Publication waits for both complete successes.

Prior test-merge tree equaled ff9285c4. At12:55UTC main advanced to29dbb1e9 with
the integrated [Lab timer fix](LAB_TIMER_LAYOUT_001.md) from PR34. Its product
and tests merged cleanly. Both status entries are retained; offline reference is
being rebound through the full paired replay. The0.2.80 candidate is now historical
and MUST NOT be published as the combined release. Original signed/native receipts
remain valid for ff9285c4 only. Combined focused/parity runs are in progress.
Combined product SHA256:
`513f88510ad2838b4369513c678ff1927b28576605d255acfade14bce4dc9eee`.
All1,471 focused checks/12 profiles and32 workflow task contexts PASS. Source
validation PASS; diff from ff9285c4 is exactly PR34's presentation changes.
Golden source binding now points at this combined source; all independently
verified state/reward outputs remain unchanged. Full paired replay continues
alongside CI and must pass before delivery; its output must equal this reference.
Next: finish combined checks, commit/push, rerun all exact-source PR/release gates
and build a new signed APK. Recheck main, integrate exact tested source, publish
only the newly validated artifact, verify public bytes and persist final evidence.
Sibling publisher/verifier currently pin ff9285c4/0.2.80 and must be updated from
the new immutable build receipts before invocation; neither has run.

Combined replay now PASS: all four full eight-hour windows match every original
gameplay field and reward, and the output exactly equals the committed reference.
[Receipt](../qa/rift-visual-unlocks-001/combined-parity.json). Merge649aaac4 retains
Lab PR34; main remained29dbb1e9. Older full run41825388671 completed with two
failing scenarios: Comet's empty DOM fixture lacked querySelector, and the Rift
contract retained old projectile origin/count/art-catalog assumptions. Its full
raw log is preserved in ci/126558708208.log.gz. The fixture now supplies its empty
selector; the contract checks portrait origin, full-battle bounds, inert layer,
twelve-effect cap, all40 original/new vector symbols and all23 default encounter
species. Original geometry/paint/economy checks retained. Both scenarios PASS
locally (Comet12 sections, Rift original contract via existing CDP pipe). Windows
dump-DOM transport timed out; the existing pipe transport completed successfully.
Only tests/evidence changed after649aaac4; production hash remains513f8851.
Final exact-head CI/native reruns required before delivery.

## Failure disposition and open acceptance

Four raw Android failure ZIPs retained: emulator disappeared before candidate
install; undiagnosed native Lab focus failure; updater activity removed120ms after
package replacement; storage read before replacement document commit. Native test
now remeasures centered trusted input and waits5s for the same focus/destination.
Updater waits1s for package broadcasts, uses am start -W, and requires actual game
DOM/origin/storage readiness. Final run passes all required assertions.

Windows original cosmetics ended with profile cleanup/close failures after content
checks; full Linux suite passes. Redundant slow Windows offline replay stopped
after Linux pass; no local deadline claim. Old golden generator hardcodes pre-tap
results and failed unchanged; full paired replay supplies verified reference.
Automated PR review's initial stale golden finding fixed; thread resolved. No
independent human review. Browser control disabled/settings unchanged; connector
lacks dispatch, so scoped GitHub API uses normal existing Git identity.

Next: complete CI/integration/publication/evidence. Physical phone, exact WebView60
DOM, TalkBack and human visual/performance acceptance remain open under the
[feature workflow](../project/FEATURE_WORKFLOW.md). Keep task/chat open; do not archive.
