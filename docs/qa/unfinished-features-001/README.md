# Existing unfinished work — 11 October 2026

The user's latest instruction is to find and implement unfinished existing
features, without adding new features. This replaces the earlier native-only
scope. One feature is active at a time; no agents or other chats were used.
Main integration, APK building/signing and releases remain prohibited. The
publishing/deleting Android workflow was not dispatched.

Audit baseline: development `87320fbf1492fa698819054a131acf16d0e61ee4`, main
`67373faa531f0bb791c883210ee623320861e380`. Read current repository rules,
bootstrap/state, original F01–F29 feedback, feature checkpoints, progression and
Guidance acceptance, and current PR102/109 descriptions. The
[repository snapshot](repository-snapshot.json) enumerates 127 branches, all
109 PRs (six open), and zero standalone open issues. The
[original requirements inventory](original-requirements.json) verifies all 27
preserved starter TXT hashes against PR67's original index. These are repository
records; unavailable private chat contents are not claimed to have been audited.

12 October supplement: external maina665b886 merged separate PR89 and a new
APK was published by its main workflow. [Native metadata/limits](https://github.com/karahaNx/Lumenfall/blob/5e34b7cd/docs/qa/native-acceptance-001/refresh-2026-10-11/remote-change-2026-10-12.md)
are saved separately. No current-development APK/native acceptance is proved;
this chat performed no main merge/build/sign/release. Earlier counts/refs above
remain the original audit snapshot, not a new all-PR census.

[Branch coverage](branch-coverage.json) inspects all127 exact tips and their
branch-only product changes. Unmerged archives/diagnostic fixes for exact farm
division, Tree focus/viewport retention, retired Lab completion focus, Prism
help, Daily Quest wrapping and protected-import announcements already have
their current replacements in development. Documentation/evidence branches
remain evidence, not missing gameplay. The support evidence branch belongs to
the same unfinished F18/F19 candidate, not another feature.

## Reconciled checklist

“Implemented” means source behavior exists at the development baseline, with
the cited accepted evidence. It does **not** claim current-source Android release
acceptance or permission to archive a chat. Old “pending” descriptions cannot
override later merged code. Current-source native acceptance is blocked for the
collection as a whole.

| Existing task | Source / integrated evidence | Remaining work |
| --- | --- | --- |
| Ascend Prisms F05 | `ascendPrismBreakdown`, PR94; superseding PR103 | Implemented; current-source native acceptance/release held |
| Auto-Ascend UI F01–03 | `renderAutoAscendControls`, PR84/99 | Implemented; current-source native/physical acceptance |
| Stable Rift Guidance F07 | reserved panel, PR81/98/109 | Implemented; native geometry, textZoom/font scaling and accessibility |
| Wisp upgrade display F04 | `wispUpgradesMaxed`, PR59/71 | Implemented; current-source native/physical acceptance |
| Resonate clarity F06 | production Sigil/run-limit text, PR80/91 | Implemented; newer Forge extends capacity explicitly, not an old three-use text rollback |
| Lab UI F08–11 | `renderLongStudies`, speed panel, PR83 | Implemented; do not reintroduce old Lab cards |
| Lab speed queue F12 | paid tier intent and chronology, PR46/57/65 | Implemented; exact native/physical acceptance |
| Rift Cast text F13 | bar-based status, PR63/74 | Implemented; existing signed142 evidence retained |
| Formation autosave F14 | `commitFormationMembers`, PR76/92 | Implemented; current-source native/physical acceptance |
| Formation Bonds F15 | eight `FORMATION_BONDS`, PR86 | Implemented; later Tree capacity preserved |
| Bond text F16 | `formationBondPartners`, PR61/72 | Implemented; native/physical acceptance remains documented |
| Wisp roles F17 | static role labels only; PR70 draft | **Missing** live contribution breakdown and lasting early-Wisp value; old balance proposal not approved |
| Support uptime F18 | `supportAbilityProfile` still 4/8 seconds; PR82 draft | **Missing** approved 1/1.5-second durations and always-present pair downtime; reconcile newer charge sources |
| Swift Recovery F19 | `RESEARCH.charge` uncapped; PR88 draft | **Missing** approved level10 cap, effective clamp, original Shard restitution and current Forge route verification |
| Echoing Rest F20 | cap6/effect, PR66; [current candidate](../echo-refund-001/README.md) | Original-Prism restitution candidate; six CI lanes/integration/native pending |
| Cheaper recruitment F21 | PR110 in developmenteb441039; exact source96a3c748 | Refund/identity/floor integrated; six CI lanes and post-merge196 pass; native/main held |
| Save Backup UI F22 | Save section and restore confirmation, PR77/87 | Implemented; current-source native preservation acceptance |
| Forge text F23 | unwanted standard cap wording removed, PR60/68/75 | Implemented; actual Swift cap is separate F19 work |
| Rift cosmetics F24 | selected earned cosmetics on Rift, PR79 | Implemented; current-source native acceptance |
| Loadout memory F25 | automatic Forge multiplier, PR78/97/100 | Implemented; accepted signed150 evidence retained |
| Offline12h F26 | fixed policy and original-value receipt, PR85/95 | Implemented; no longer-time purchase or replay-policy change needed |
| Comet unlocks F27 | PR69/73, superseding current PR107 commands/Trials | Implemented; do not merge the obsolete three-card catalog |
| Progression curve F28 | system-specific numerical/economy evidence exists | **Unfinished:** current collection campaign early/mid/late TTK, upgrade wait, Ascend time and resource-sink acceptance; no approved whole-game rebalance |
| Upgrade identity F29 | legacy duplicate fusion PR90/93 | Implemented; preserve original paid levels and stacking |
| Lab exclusivity F29 | PR62 proposal superseded by PR90 and twenty-project PR104 | Implemented; old proposed IDs are not missing features |
| Forge exclusivity F29 | PR64 proposal superseded by PR90 and twenty-upgrade PR105 | Implemented; cap/uptime gaps above still open |
| Tree exclusivity F29 | PR66/90, superseding twenty-path PR106 | Implemented; two historical refund gaps above still open |

The integrated collection also includes PR108 Shared UI and PR109 enlarged
Guidance readability. Their accepted development evidence is retained. PR102 is
the draft collection-to-main PR, not another missing gameplay implementation.
PR67 is an older overlapping bundle; it must not replace the current product.

12 October delivery checkpoint: F21/Echo are integrated developmentb097d3dc/PR111,
source d90742bc. Six final cc03edba CI lanes PASS, with complete current Full
decoded log retained in continuation/f20-ci/. Core619/13,206 integration,
browser573/17 and actual-engine parity12/2 pass; four older issued values stay
unchanged. Integrated source SHA and206 post-merge checks agree. Earlier evidence
remains source-bound; historical raw gaps stay explicit. Next is F17's existing
readout against this baseline, without a power curve. F17/F18/F19 decisions,
campaign acceptance and native capabilities remain blocked; no default approval.

## First sequential candidate: F21

Ported only the reviewed F21 helpers from PR89 head
`6891310af9118ea03423e4b31109f573c8b1a687`, adapting current source rather than
merging its older game. Persisted ID `bonds`, raw ownership, original prices,
60% discount/40% normal-price floor and nearest-whole-Lumen rounding remain.
The UI calls it **Cheaper Recruitment**, distinct from Formation Bonds.

Old purchases above20 receive their original `ceil(2 × 1.45^level)` Prism prices
once. Exact values that cannot join the wallet stay in spendable credits. Receipt
and remaining-credit validation select recovery for damaged records instead of
silently destroying value or refunding again. Current Tree identity/unlocks,
exact ownership increment and transactional primary-save rollback remain.
Fixed12h and Comet compensation retain their separate receipts. Internal
Auto-Ascend retains validated untouched refund records; imports/saves still
validate fully. No native BigInt is introduced in production.

Initial candidate source SHA256 (the initial focused evidence below):
`33d444ed901f3d1c95879df3c390fa2a821a025fb222d9097314c01caf406828`.

| Check | Evidence |
| --- | --- |
| Browser refund/cap, real touch/keyboard, 320/390/430px, 100/200% CSS font size, reduced motion, reload/recovery/confirmed restore | [567 checks / 30 groups](f21-browser.json) |
| Current catalog, paid Studies, ownership, exact price/value and transaction failure coexistence | [191 integration checks](f21-integration.json) |
| Refund/cap/credit/version/audit/performance causal controls | [13 killed controls](f21-negative/summary.json); individual raw JSON retained |
| Current Tree core | [5,278 checks and 28 controls](f21-tree-core.json) |
| Current currency colors/retired-card visibility | [5,808 checks across12 profiles and three controls](f21-price-ui/summary.json) |
| Actual V8 6.0.286.52 via verified official Node8.3.0 | [400 blocked attempts, original refunds and receipt/credit compatibility](f21-v8.json) |

The [original defect reproduction](f21-original-defect.json) executes the
unchanged87320fbf game: a raw21 save with17 Prisms retains17 rather than its
original-value entitlement3393. The assertion fails as expected.

PR110 targets development. Its [first CI observation](f21-ci-attempt1.json)
found old Comet/Tree expectations that omitted the approved refund, and a
frozen offline comparison that predates the new value records. Corrected tests
require the exact refund and receipt, preserve every old ownership/economy
assertion, and assert the new fields before the complete frozen comparison.
The old source oracle remains immutable. A current-source Tree V8 run passes
[2,863 checks](f21-tree-v8-v2.json).

The second candidate restored the familiar “Saved level preserved”
wording in the F21 receipt note beyond the initial product changes. SHA256:
`93f3f82b6ae6c38d19530c45a28248056a4f4e1d21a3e48b23e935af29e5c8e9`.
Its [focused browser repeat](f21-browser-v2.json) passes all567 checks; the
omitted screenshot option accounts for29 rather than30 result groups.
Comet's unchanged-layout picker check now waits for the real220ms opening
animation, as its existing install/show helpers already do. Native frames and
the exact viewport/focus assertions remain active. A local standard
`tree-purchase-contract` attempt timed out with no completed QA result; that
transport failure is not a pass. The required remote Full lane remains the gate.
All six corrected CI lanes must pass before development integration.

Self-review then found that removing a completed F21 receipt while retaining
its overcap history could trigger another refund. The third candidate selects
recovery instead. Source SHA256:
`52b36d550b2165c7e62951a3042020aeb85c4045694160d9b933bc4a4fe932a1`.
Its [568 browser checks / 30 groups](f21-browser-v3.json), [196 integrated
checks](f21-integration-v3.json), [14 actual causal failures](f21-negative-v3/summary.json)
and [actual V8.6.0 probe](f21-v8-v3.json) pass. The extra group verifies real
damaged-primary recovery after deletion of a completed receipt. Every negative
receipt has this final source identity; the fourteenth was run separately after
the earlier thirteen and fails the intended duplicate-refund assertion.

The prior source93f3f82b passed the [frozen offline comparison](f21-offline-v2.json),
[12-profile Tree mobile lane](f21-tree-mobile-v2/receipt.json), and [12-profile
Comet mobile lane](f21-comet-mobile-v2/receipt.json). Those receipts identify
their own source and are not presented as final-source reruns. Final remote
Full/Tree/Comet and the other required lanes remain mandatory.

Automated PR reviews of6e6d9585/13790b7c found the stale Tree mobile name
(corrected in13790b7c), the Patient Growth cross-reference, missing-browser
false-positive risk in the negative runner, and ledger cloning on foreground
quotes. The last three are corrected in source SHA256
`96a3c748183615505afc140ef02ac74e943408359a723bb576ffc9a12f79015e`.
Affordability quotes calculate exact debits without cloning or modifying the
ledger; real purchases still materialize and commit the complete payment.
The [browser571 checks / 30 groups](f21-browser-v4.json) include2,000 actual
Tree quotes on raw2000: zero ledger copies, unchanged state, one payment copy.
The [15 killed controls](f21-negative-v4/summary.json) include the corresponding
copy regression. [196 integration checks](f21-integration-v4.json),
[Tree5,278/28 controls](f21-tree-core-v4.json) and [V8.6.0](f21-v8-v4.json) pass.
A [real missing-browser run](f21-no-browser.json) is rejected and produces no
PASS summary. Earlier receipts remain explicitly source-labelled. Final remote
CI and review reconciliation are still required; prior five focused lanes
passed at52b36d55 before these review fixes. No final Full pass is claimed.

The older Tree free-purchase mutant now supplies the candidate payment shape;
it still fails the original behavioral assertion rather than a TypeError. No
acceptance assertion was weakened. F21 focused tests are required in Full CI,
and its V8 probe is required in Tree CI. Self-review is not independent review.

## Concrete blockers and preserved evidence

F18's approved natural-charge schedule is insufficient to establish “always
gaps, even with both supports” on the new Forge: Tap Conduit grants charge per
manual/Auto-Tap hit; Victory Charge and Resonate also accelerate casts. Keeping
those accepted effects requires a reviewed support minimum-recast rule or an
explicit revised uptime contract. Porting PR82's old average model alone would
make an unsupported claim. The current F19 minimum natural cycle is not a
minimum against externally granted charge.

F17's old equal-budget balance candidates propose different new power curves;
neither is an accepted current-collection rule. The reported90% Titan share is
not a measurement of a received mature save. F28 likewise needs measured current
campaign results before changing gameplay prices/effects. No arbitrary curve or
Titan nerf has been implemented.

Swift's earlier Deed blocker still applies to the current collection. Both
20/60-level checks sum only the five original Forge IDs. Four are retired;
Swift's approved cap10 would leave new players unable to reach either threshold.
The new twenty-upgrade catalog does not currently count. The user was asked
whether all current/historical paid Forge levels should count while preserving
thresholds, rewards and earned unlocks; no answer has been captured. That
definition must be settled before Swift integration. No replacement Lab-credit
rule or other Deed change has been implemented.

Native acceptance remains concretely blocked: no provenance-verified APK contains
current development source, and this executor has no suitable Android SDK,
runtime/device, exact WebView60 or physical/TalkBack capability. The separate
[native refresh checkpoint](https://github.com/karahaNx/Lumenfall/blob/82b9ff317b075599574b40fde247fe63a82199f9/docs/qa/native-acceptance-001/refresh-2026-10-11/README.md)
is evidence-only and is **not** integrated into development. Modern Chromium and
V8 checks above do not replace native WebView textZoom or physical evidence.

Retain accepted baseline Full182/212/22, Guidance16 profiles/160 samples plus16
Ascend cases, and13 integrated commands/843198 assertions/111 controls. Preserve
the historical missing Full combined terminal log and Shared raw-evidence gaps;
no replacement evidence is invented or rejected compressed logs uploaded.
Candidate product changes require their own affected checks and all six CI lanes;
these do not retroactively invalidate the old accepted-source receipts.
