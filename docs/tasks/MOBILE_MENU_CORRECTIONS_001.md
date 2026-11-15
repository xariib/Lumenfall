# Mobile menu corrections and remembered scroll positions

Status: in progress. Owner: current feature chat; no delegation/messages.

User request (14 November 2026, two phone screenshots): remove the theme text
and Formation Bond names from Rift; remove Deeds' milestone dropdown; show
currency names in the top bar; shrink Lab cards with Queue icon left, smaller
progress/timer between controls, Speed Up icon right; remember every menu's
scroll position when leaving and returning, including the bottom.

Baseline: main8747ee60 / Android0.2.119, isolated branch
fix/mobile-menu-corrections-001 in validation-evidence/menu. Root attachments
and all other feature worktrees untouched. Open overlapping PR54 (currency
names) and PR55 (advancing Deeds bars, approved existing targets/increasing
rewards) incorporated with ancestry; retained their original evidence/requirements.
Their historical status does not prove this combined version passes.

Scope: requested presentation/navigation and necessary tests/delivery. Preserve
theme selection/art, Wisp Bond information and mechanics/partner marks, existing
Deed thresholds/unlocks and approved PR55 rewards, Lab paid work/queues/boosts,
all currencies, saves/recovery, chronology, automation and accessibility.
No additional balance/schema/cap or binding-rule change. Scroll memory is UI
session state, separate for Wisps, Forge, Lab, Ascend and Deeds; Rift remains
the deliberately fixed battle viewport. Restore after rendering; clamp naturally
if content shrinks. A remembered bottom stays at bottom when content grows.

Observed baseline defects: explicit main.scrollTop=0 in activateTab; Lab progress
panel reserves two52px rows/min-height96px; visible Rift captions/Bond summary;
completed milestones rendered as native history details. Existing PR54/55 tests
cover their corrections; new acceptance must reflect the user removing history.

Acceptance: 320/390/430px, normal/enlarged text and reduced motion; visible named
currencies; no visible Rift caption/Bond names or Deed milestone disclosure;
one live Deed bar; compact Lab ordering and >=44px action targets; Queue and
Speed Up work; independent menu offsets/bottom restored through repeated visits,
Workshop subsection switches and passive refresh; no save mutation from navigation.
Existing source, focused core/UI, paired save replay, required PR/integrated CI,
signed Android identity/assets, save upgrade/updater/retail and public feed checks.
Self-review only. Physical-phone/WebView60/TalkBack/human acceptance stays open.

References: [workflow](../project/FEATURE_WORKFLOW.md),
[currency](CURRENCY_HUD_001.md), [Deeds](DEEDS_PROGRESSIVE_001.md),
[Lab](LAB_SIMPLE_001.md), [Bonds](RIFT_BOND_DISPLAY_001.md).

Checkpoint15 November: implementation complete locally. Product SHA256
`a7d991eba2842882bfbaf41f2cb710471e9b29fae62afd28da2dd21600859739`.
Changed index.html, focused menu module/runner and superseded Lab/Deeds/Rift
presentation tests; native upgrade checks now assert absent captions/history and
native-navigation bottom restoration. Gameplay code unchanged beyond approved
imported PR55. Source/golden bound by paired four8h replay: all full-state fields
match except independently specified approved450 extra Comets per endpoint.

Node24.22.1/Chromium157.0.8103.79: simple selection+menus704 checks (18+12
profiles), slots488/18, Deeds688/18, core415, original clarity417+native99,
currency/visual16 profiles, cosmetics/all6 themes and causal controls, both Rift
native suites (3 profiles/12states each) PASS. Source/context/whitespace PASS.
Scroll-reset mutation fails its exact intended assertion; initial combined
baseline fails the requested-caption absence assertion. Screenshots self-reviewed.
[Evidence and retained failures](../qa/mobile-menu-corrections-001/README.md).

The merged startup exceeded32KiB for old Deeds/hunt tasks. Preserved exact prior
shared status in PROJECT_STATE_2026-11-14_HISTORY.md and replaced older summaries
with its link; all actual task budgets now pass without changing the guard.
Windows dump-DOM Rift contract timed out without a QA result; rerun using the
existing pipe transport, without changing assertions/deadline. Final navigation
checks, CI/integration/signed APK/public delivery remain required. No archive.

Final local navigation: both Rift native suites, Rift DOM contract, all5 viewport
profiles each for dense/boss layout, Workshop contract and12 Formation profiles
PASS. Narrow-layout assertion now explicitly matches PR54's two-column/three-row
header up to380px. All earlier failures remain described/retained in QA. Full
product diff from integrated baseline reviewed: pending PR54/55 plus this task's
targeted display/navigation changes; no unrelated removals or workflow edits.

Next: commit/push scoped candidate, open PR and dispatch exact-source
validation/candidate Android. Keep main/source fixed during checks, then
serialize integration/publication after readiness. Connector lacks workflow
dispatch, so the configured authenticated GitHub CLI supplies it.

## PR56 first CI/native checkpoint

[PR56](https://github.com/xariib/Lumenfall/pull/56) initial head9f6c786f preserved
all source/native failures. Manual full43653805377 passed isolated offline and
all earlier focused/negative gates, then two190-scenario tests still read removed
completed Deed rows. Their expectations now assert retained earned receipts and
the exact next card/counter without history; original threshold/reward/purity
coverage remains. Both original scenarios now pass locally. QoL's disposable
fixture explicitly marks next Rift100 unearned, avoiding inherited achieved flags.

Lab43653813055 timed out at Browser.getVersion with zero assertions; no cause
proven. Android43653827271 passed package/assets, save/paid retention and native
Wisp/Farm/navigation checks; failed its newly imported Rift1000 bar assertion.
The earlier disposable Farm fixture sets maxDepthEver30 while retaining all
earned1000 receipts, so the exact expected bar is30/2500 (1.2%), not1000/2500.
Corrected that independent fixture expectation; no game/retention logic changes.
Native scroll tests now avoid revealing/reselecting an already active subtab,
which would legitimately scroll it to its header, and check all6 visible names.
Raw original CI logs and30 native diagnostic files are retained in QA.

Product SHA256 remains unchanged. These follow-ups are tests/docs only. Next:
publish follow-up, rerun all required exact-head workflows/candidate Android,
then serialize integration/release. No failed gate is waived; no main/APK push.

## Final Lab heading review

Before delivery,200% screenshots showed the inherited fixed120px research-title
minimum could overlap the level badge. Scoped Lab title flex wrapping now uses
the actual minimum text width; the badge moves to its next row when necessary.
Final product SHA256 `b6fa21652a96e8a9213736b5764e7111f9def68480847a584d3dffd7bc5f192f`.
Current simple+menu716 checks (18+12profiles), core415, clarity417+99 fixture
and paired four8h save replay PASS. Final lab/compact-lab-200.png was inspected;
no title/badge overlap. Golden source hash rebound after exact state comparison.
Earlier a7d991eb receipts remain historical with their hashes.

Source55a36c16's in-progress PR/manual/native runs were recorded and cancelled
as superseded by this final CSS fix; no other tasks/runs/main were touched.
The final source needs its own complete CI/native/public acceptance. Next:
publish this final reviewed source and run all required validation/candidate
Android again; keep source/main fixed through acceptance and integration.

Final validation ref is fix/mobile-menu-corrections-001 at
`c07d9bc680d9400826ccf26697809dd5e83f3bf4`. PR56 and all8 manual workflows run
on these bytes. Native nonpublishing candidate43685898534 is in progress.
Main remains8747ee60; no public update has been published. Do not move the
validation ref/main until final acceptance/readiness. Evidence-only checkpoints
use evidence/mobile-menu-corrections-001, with identical product/native/test bytes.
Local delivery/verification helpers are in validation-evidence/ inside this
isolated worktree; required run URLs are saved in dispatch.json and candidate
dispatch. If helpers are unavailable, use the original workflows and exact run
metadata; no credential/signing change is needed.

## Android receipt audit — open viewport fix

Candidate43685898534/Android0.2.122 passed existing build/upgrade/updater/retail
gates and exact bytes/identity. However detailed installedMenuScroll records
all reported max0/top0. That is vacuous for scroll acceptance and is NOT proof
of the requested feature. The new native test omitted a positive-range and
active-panel precondition; correct those assertions before delivery.

Installed WebView is91.0.4472.114. Current .shell has height100dvh with no
height100vh fallback; that unit is unsupported there, allowing main to grow
instead of becoming a scroll container. Add the scoped viewport fallback and
test menus with unsupported dvh declarations removed, including a causal
missing-fallback control. Preserve original UI/save/upgrade assertions. This
needed scroll fix stays in the current feature; do not claim phone/WebView60
acceptance. Current14/16 final-source workflows pass; full suites still run.
Source must be revalidated after this CSS change. No public APK is published.

Fallback implemented:100vh height/min-height precede existing100dvh. Modern
computed layout is unchanged. Legacy unsupported-unit baseline reproduces the
zero-range defect; new positive legacy374 checks/12profiles and modern716
checks (18selection+12menu profiles) PASS. Removing the fallback deliberately
fails the positive-range assertion. Current core415/clarity417+99 and paired
four8h complete-state replay PASS. Product SHA256
`ff13eee2a0891a02e0bb8dc2681ac0d3be88ac14c9ec5abb1c73d0e83b919da7`.
Native active-panel/range/bottom assertions and independent artifact verification
now reject the old0/0 receipt. No simulation/save/price/reward changes in this fix.
Next: publish this corrected source; run complete exact-source workflows and
candidate Android; require positive native ranges before readiness/integration.
