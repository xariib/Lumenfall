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
