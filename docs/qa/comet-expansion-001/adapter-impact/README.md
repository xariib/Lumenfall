# Comet change-impact inventory

**Read-only preparation on published768050d7. No repository file, test, product, staging or remote mutation. No game, browser or regression test was executed for this inventory. Tree integration remains the prerequisite for Comet implementation.**

Repository: `/workspace/scratch/0848c4e4f365/Lumenfall-tree`. Head `768050d7cca586ea724e7ac677804a5ed7d6a3f5`; tree `30213b2ae877ff64db08e3d06b087d040fe72ca2`; product SHA256 `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3` (619788 bytes). Every anchor below refers to these exact published bytes. The inventory reads Git objects and confirms the working product is identical.

## Main findings

The intentional compatibility changes are current schema 2→3, the replacement of three purchasable legacy rows by the selected six-row catalogue, and adding four event Deeds while retaining all 23 original predicates/rewards/earned flags. The main risk is treating those intentional changes as permission to weaken historical economic oracles. Keep original subsets and assert every new default/ledger transition before projecting fields out.

The most consequential concrete cases are: the dynamic Deed boundary loop has no setup for the new events; several fresh-current test seeds assign legacy owned flags without a ledger; and the Tree mobile legacy seed deserves350 extra compensation while the V8 seed does not. Removing the SHOP entries alone also breaks renderCosmetics because it dereferences their definitions.

## Selected future contract and strict migration

Active IDs are autoascend, meteor, starcall, cometreservoir, cometcycle and meteorcore. The three legacy cards leave the active catalogue but their old140/50/160 paid ledger and Trial/cosmetic/RestStop entitlements remain.350 is the full original retirement compensation, deliberately additional to retained entitlement; it must be settled once and grant no new upgrade or command ownership. Original old-hour refunds140/160 are separate F26 purchases with coincidentally matching prices.

Fresh schema 3 and the real2→3 migration initialize all required blocks. Existing current 3 must contain a valid cometClaims ledger, all 3 raw integer cometUpgrades,4boolean cometEvents, integer cometCharges/cometWork and boolean cometMeteorUsed/cometCalled. Valid overcap raw levels remain stored with effective caps; the bank is bounded by actual capacity without refill. Missing or malformed new current 3 paid state must throw invalid-comet-claims or invalid-comet-state; neither a fresh default nor an empty claim ledger is a repair.

The root-selected recovery rule is stricter than ordinary corruption repair: these two Comet errors preserve the primary raw bytes and block persistence even when a good recovery copy supplies playable state. No-good-recovery also keeps raw bytes blocked. Backup rejection preserves the prior authoritative state. Keep the existing corrupt-JSON repair and future99-preservation tests independently; their inputs have not become Comet corruption fixtures.

One canonical settlement pass follows F26 → Trials140 → Trail50 → Crest160 → pending known Deeds in fixed order. A newly earned Deed records its sticky flag and claim and attempts only its own exact whole credit inside the existing transaction owner; no nested save and no sweep of older claims. Global daily reward debt is excluded. Do not changeF26 null meaning, price snapshots, exact Prism strings, paid bits, old migration math or paid Lab work.

The old 23 IDs, individual reward amounts, literal predicate text and SHA256s are preserved in inventory.json. Their reward sum stays683 as a retained subset. The four proposed event rewards sum50 in the frozen design proposal; final implementation must bind their exact IDs/rewards separately rather than silently changing the old total or automation gates.

## Actionable matrix

### S01 — Current-schema literals

**Classification:** intentional schema expectation.

These assertions explicitly expect canonical/current schema 2. Raw legacy seeds intentionally use schema 0/1/2; future input 99 is a separate preserved rejection.

**Required treatment:** Move only current-output expectations to 3, retaining every progression, wallet, work, recovery and reset assertion. Keep original raw fixture versions/bytes and schema 99 expectations. Require fresh 3 and every actual0→1→2→3 migration to create all strict new blocks; do not stamp old fixtures as3.

**Keep:** Do not turn ordinary corrupt-primary repair into blanket preservation; do not replace every occurrence of2 or307.

**Anchors:** `tests/behavioral/runner.js`:358,478,617,668,672,673,705,706,833,854,855,876,878,1278,1279; `tests/behavioral/measured-inquiry.js`:39,183; `tests/behavioral/lab-motes.js`:79; `tests/behavioral/offline-12h.cjs`:76; `tests/behavioral/offline-catchup.cjs`:125,126; `tests/behavioral/tree-expansion-mobile.cjs`:263; `tests/behavioral/tree-expansion-v8.cjs`:122.

### S02 — Missing/malformed current 3 must preserve primary

**Classification:** new strict failure contract.

Current loadState protects unsupported-future-schema primary bytes but repairs ordinary invalid primary from good recovery. normalizeCurrentSave starts from fresh defaults; that pattern must not silently erase missing Comet paid blocks.

**Required treatment:** For future current 3 require cometClaims, three raw integer cometUpgrades, four boolean cometEvents, integer cometCharges/cometWork, boolean cometMeteorUsed/cometCalled. Reject missing/wrong-type blocks with invalid-comet-claims or invalid-comet-state before any defaulting/credit. Extend the primary-preservation predicate for these exact errors: recovery may run, raw primary and recovery stay untouched, persistence remains blocked, copy names the Comet error. With no good recovery retain raw bytes and blocked state. Backup rejection leaves prior live/primary/recovery state unchanged.

**Keep:** Add strict3 primary/recovery/backup cases alongside old repairable-corrupt, future99 and legacy migration cases. Finite valid overcap levels remain raw, effects clamp; charge bank obeys capacity/no refill.

**Anchors:** `index.html`:3918,4035,4055,4129,4340,4419,4444,4457,4466,4497; `tests/behavioral/runner.js`:838,850,860,882.

### S03 — Fresh current snapshots versus real legacy ownership

**Classification:** seed contract.

These seeds obtain freshState then manually put the retiring IDs in owned. In future that is a current 3 snapshot with an independently required paid ledger, not proof of a pre3 purchase.

**Required treatment:** Use actual schema 2 old raw input and the real migration when testing old purchases/refunds, or an explicitly well-formed settled3 ledger when isolating another subsystem. Keep all paid values, pending/active Trials, result/marks, cosmetics and complete Rest Stop access. Assert canonical current state after set/load; reread live state after staged operations.

**Keep:** No helper that fabricates missing strict3 defaults, grants new Comet ownership, or restores retired IDs to the active SHOP.

**Anchors:** `tests/behavioral/lab-expansion.cjs`:44,65; `tests/behavioral/forge-expansion.cjs`:392; `tests/behavioral/tree-expansion-core.cjs`:191,505,647; `tests/behavioral/comet-unlocks-core.cjs`:50,145,159,171; `tests/behavioral/loadout-memory.cjs`:59.

### C01 — Retired shop purchase assertions

**Classification:** intentional catalogue expectation.

Old tests assert exactly autoascend/comettrials/rifttrail/starfallcrest and450 Comets, and actually purchase retiring cards. These are false for the selected six-row catalogue.

**Required treatment:** Assert the new active IDs independently. Preserve AA100 and an explicit immutable old price ledger Trials140/Trail50/Crest160; full retired compensation350 is deliberate retirement compensation while entitlements remain. Replace old purchase setup with real old migration/settled entitlement setup; preserve every later Trial/cosmetic/Rest Stop behavior assertion.

**Keep:** A sum of first row prices is not a full multi-level acquisition cost. F25 rememberbulk is not a newly refundable retired purchase.

**Anchors:** `tests/behavioral/comet-unlocks-core.cjs`:47,50,54,59,145; `tests/behavioral/loadout-memory.cjs`:36,37; `tests/behavioral/runner.js`:2396; `tests/behavioral/bridge.js`:607.

### D01 — Original23 Deed total683

**Classification:** intentional retained-subset expectation.

Totals are derived from ALL current ACHIEVEMENTS, then compared with683. The selected addition of4 event Deeds makes that all-catalogue assertion obsolete.

**Required treatment:** Explicitly retain all 23 original IDs, predicates, fixed rewards and683 subset total. Check the four new entries separately against final design; do not modify old thresholds or rewards to keep an all-catalogue number constant. inventory.json stores every original predicate and line hash.

**Keep:** Vigil Auto-Tap at12 Ascends, Auto-Empower labmaster20 original Forge levels, original aura gates and sticky earned flags remain unchanged. New event eligibility must not be inferred from unrelated old progression.

**Anchors:** `tests/behavioral/upgrade-identity.js`:64; `tests/behavioral/upgrade-clarity.js`:124; `tests/behavioral/measured-inquiry.js`:85; `tests/behavioral/forge.js`:52; `tests/behavioral/runner.js`:2397; `tests/behavioral/bridge.js`:258,608.

### D02 — Deed boundary loop has no setup for new events

**Classification:** definite dynamic-oracle seam.

upgrade-clarity dynamically iterates every Deed but its setters cover only the old 23. A new event row reaches the at=true assertion without a corresponding actual event. Some isolating seeds also mark every catalogued Deed earned.

**Required treatment:** Keep the complete original 23 before/at/earned/render-purity matrix and raw units. Exercise new four events via actual committed command/recharge/called-kill paths in separate tests. Explicitly use old subset in historical reward-isolation seeds and assert new events false unless the scenario intentionally performs them. Add new presentation/progress entries; current row dereference assumes every ID has metadata.

**Keep:** Do not make the new event tests pass solely by setting achieved or cometEvents. Retain double-check idempotency and earned progress after reset.

**Anchors:** `tests/behavioral/upgrade-clarity.js`:75,81,84,94,109; `tests/behavioral/measured-inquiry.js`:8; `index.html`:3557,3588,3620,7893.

### L01 — Tree mobile657 versus V8307

**Classification:** migration arithmetic distinction.

The mobile raw schema 1 fixture inherits all 3 retired purchases and starts7 Comets; its existing F26 refund is300. The actual V8 raw schema 1 fixture owns only AA and old hours, not the 3 retired cards.

**Required treatment:** If preserving the existing mobile input, its future result is7+300+350=657; prove the two ledgers separately and second load/backup never repeats either credit. The existing V8 result stays7+300=307. Both retain132 Prisms, including exact old6+10+16 refund.

**Keep:** Do not globally change307 to657. The protected fixtures.json, refund-interop3 seeds and olddevice fixture own none of the 3 cards; they get no new 350.

**Anchors:** `tests/behavioral/tree-expansion-mobile.cjs`:62,67,252,263,266,270; `tests/behavioral/tree-expansion-v8.cjs`:115,116,122.

### L02 — F26 null, snapshots, pending receipts and sourceSchema

**Classification:** protected exact migration.

The existing1→2 migration captures old hour ownership and Reserves prices. Canonicalization settles its existing receipt. Protected rawfixtures still use0/1/2 and carry historical decisions.

**Required treatment:** Add2→3 without rewriting0→1 or1→2 math, null meaning, raw Reserves levels, price arrays, exact decimal Prism amount or paid bits. Capture original source schema before migration if future code needs that distinction. One canonical pass settles F26 then Trials140/Trail50/Crest160 then pending Deeds in fixed order. Newly earned Deeds set stickyflag+their claim and attempt only that claim inside the existing owner; no old-claim sweep or nested save.

**Keep:** Keep2^54 Bonds8→9 debit40 and deferred original6+10 credit, primary rollback and recovery-success behavior. Keep789→1089 in old Cometcore and mature1150 where no3-card ownership exists. No global daily reward debt.

**Anchors:** `index.html`:3998,4014,4035,4129,4146; `tests/behavioral/offline-12h.cjs`:43,76; `tests/behavioral/offline-12h-webview60.cjs`:25,46; `tests/behavioral/tree-expansion-core.cjs`:166,184; `tests/behavioral/comet-unlocks-core.cjs`:135,143; `tests/behavioral/runner.js`:685.

### P01 — Frozen offline oracle

**Classification:** historical full-state projection.

baselineState compares the complete historical state after explicit zero/OFF checks for new Lab/Forge/Tree fields. Its latest legacyPrismPolicy replaces only two reward function bodies, preserving all unrelated production helpers.

**Required treatment:** Before projecting new schema 3 Comet fields away, independently assert all 3 raw upgrade defaults0, charges/work0, markers/eventsfalse, no new ownership, and precise nonowner/settled-old ledger state. Preserve actual old achieved flags, original currencies, complete historical state, all 17 cases and both8h256/31 results. If no-op summary fields are added, prove zero then project only them.

**Keep:** Never return to broad source slicing that erased live helpers; never change frozen main HTML, reference kernel, rawfixture JSON or baseline expectation just because an adapter lacks a dependency.

**Anchors:** `tests/behavioral/offline-catchup.cjs`:15,29,34,43,79,84,110,116,125,126; `tests/behavioral/prism-earning-reference.cjs`:1.

### P02 — Old subsystem preservation tests

**Classification:** paid-state persistence projection.

Several scenarios compare owned or entire paid field selections before and after normalization, Ascend, reload or backup. Canonical removal of the 3 flags would fail those comparisons even if the new entitlement ledger is correct.

**Required treatment:** Bind comparisons to canonical before-state and explicitly protect the migrated entitlement/claim ledger, Trial/cosmetic records, old automation settings and all old paid work/levels. Assert any expected one-time compensation separately. Keep complete comparisons rather than simply deleting owned from assertions.

**Keep:** Retention tests must still prove a real Ascend/purchase/reset transition and actual cold load; a false return or stale retained state object is not preservation evidence.

**Anchors:** `tests/behavioral/lab-expansion.cjs`:44,65,83; `tests/behavioral/lab-expansion-ui.cjs`:10,12; `tests/behavioral/forge-expansion.cjs`:392,418; `tests/behavioral/forge-expansion-ui.cjs`:19; `tests/behavioral/tree-expansion-core.cjs`:505,550; `tests/behavioral/tree-expansion-offline.cjs`:127.

### E01 — Partial Prism and ROI VMs

**Classification:** extraction dependency seam.

The Prism/ROI scripts extract selected declarations and marker-delimited reward bodies into a deliberately small VM. They do not automatically include new helper functions or schema 3 state.

**Required treatment:** Keep Prism earning/payout queries pure and unchanged by Comet mechanics. If a retained extracted production function genuinely gains a new helper dependency, include that actual helper explicitly with exact anchor validation; do not stub it or broad-slice adjacent code. Current legacyPrismPolicy already has the correct narrowly targeted two-function replacement pattern.

**Keep:** Independent Prism kernel and raw oracle values remain untouched. Test-only source extraction must not delete Tree/Forge/Comet helpers.

**Anchors:** `tests/behavioral/prism-earning.cjs`:9,19; `tests/behavioral/prism-closeout-data.cjs`:6,17; `tests/behavioral/offline-catchup.cjs`:15,29.

### E02 — Modern VM, actual V8 and browser injection

**Classification:** complete-IIFE dependency seam.

These harnesses execute the complete product closure, so new in-closure helpers are included naturally. Their synthetic seeds, DOM surfaces and explicit public test facades remain separate dependencies.

**Required treatment:** Use genuine fresh 3 or migrated legacy inputs, add explicit actual facade hooks only when required, preserve injection marker uniqueness and source identity. Keep real engine outcomes and original save failure return values. ActualV8 must parse and execute the whole product plus its compatible driver; Node 20 oracle arithmetic may useBigInt separately.

**Keep:** No product BigInt or modern syntax accidentally injected intoV8 6.0. A VM assertion or transport success is not browser acceptance.

**Anchors:** `tests/behavioral/lab-expansion-harness.cjs`:14; `tests/behavioral/forge-expansion-harness.cjs`:1; `tests/behavioral/tree-expansion-harness.cjs`:1; `tests/behavioral/prism-earning-state.cjs`:19; `tests/behavioral/comet-unlocks-core.cjs`:17; `tests/behavioral/run.cjs`:33,49,95,104,109,116,118,124,125.

### U01 — Cosmetics and Trial journal relocation

**Classification:** concrete retired-definition coupling.

renderCosmetics looks up Trail/Crest in SHOP then dereferences def.name/desc. Trial form/listeners query shop-list; replaceControlMarkup assumes a preserved native Trial card is a direct child. Old UI seeds directly assign the retired flags.

**Required treatment:** Keep non-purchasable retained definition metadata and ledger entitlement checks. When moving legacy Trial controls to Journal, update their actual root and native-control preservation together. Seed legacy entitlement honestly and keep queued/active work, paid targets, marks/equipment, nativeTouch/Space, focused input draft,32px Crest and reducedmotion tests.

**Keep:** Removing only SHOP rows can produce a real rendering exception or detach an active native input; changing test selectors alone cannot repair that product dependency.

**Anchors:** `index.html`:6794,7937,7955,8002; `tests/behavioral/comet-unlocks-ui.cjs`:43,47,48,62,67; `tests/behavioral/rift-cosmetics.cjs`:86,113; `tests/behavioral/rift-guidance.cjs`:116,123.

### U02 — Affordability, prices, Refresh and focus

**Classification:** new catalogue control dependency.

Existing shop affordability assumes boolean owned and one fixed item.cost. Daily Refresh has an icon+25 label outside the shared data-price-currency surfaces. AA has independent stable native controls.

**Required treatment:** New capped level/command plans need authoritative native preview, actual purchase and independent currency color/disabled state coverage. Preserve AA100, target interpretation/internalN, real input identity/draft/focus, touch 44px and contrast. Verify legacy Refresh exact25 and new entitlement route while retaining old routes.

**Keep:** No Auto-Ascend reset/replacement; no command execution in affordability/render observers; preserve stable viewport/focus helpers and bounded readiness behavior.

**Anchors:** `index.html`:7932,8167,9726; `tests/behavioral/collection-price-ui.cjs`:26,37; `tests/behavioral/comet-unlocks-ui.cjs`:48,60; `tests/behavioral/auto-ascend-target.cjs`:1.

### A01 — Transactional helper ownership

**Classification:** proven QA adapter contract.

ascendManual and formationTest.buy now temporarily release the QA reload pause, call the real handler, and restore the prior flag in finally. Unused bridge.comet.ascend still directly delegates. Tree readiness retries only the exact observed probe navigation error within one 10s deadline.

**Required treatment:** Keep the verified adapter fixes and all 22 Full negative controls. New command fixtures must observe actual return/live-state/primary/recovery transitions and distinguish test pause from real storage faults. Review direct handler callers when transactions are introduced; fix only a reproduced mismatch, never blanket-disable persistence guards.

**Keep:** No ready-action/input-action retries, no fake positive from preserved old object references, no general withSaves wrapper or auto-accept fallback.

**Anchors:** `tests/behavioral/bridge.js`:72,402,569,632; `tests/behavioral/tree-expansion-mobile.cjs`:19,39,43.

### A02 — Kill work, command commits and Ascend

**Classification:** chronology and event attribution seam.

Manual, discrete simulation and Farm batch paths have separate true-kill hooks; large accumulated counters may stagnate. ManualdoAscend saves, while simulation Ascend uses mutation under its existing outer transaction. The transient run token prevents1e30 Ascend counter aliasing.

**Required treatment:** New event/kill-work tests must use each actual kill count, Farm batch multiplicity and capped bank arithmetic, including big counters, full bank/no refill, repeat load and primary-failure retry. Meteor keeps one atomic outer owner and bounded one-hit progression; do not call nested saving manual Ascend from it. Preserve actual kill/payout/Auto-Ascend order, luminous accumulator and old natural/Mote payouts. Starcall rejects boss/already-luminous/dead/offlinepending and consumes once.

**Keep:** Commands stay player-triggered. No implicit Auto-Ascend commands, no reclassification as Guardian tap/Wisp ability/Spillway, no change to existing same-timestamp or Farm ordering.

**Anchors:** `index.html`:4719,5310,5450,5516,5610,6523,6589,8754,8799,8840,8853,8927,9055,9155,9809.

### G01 — Four current lanes plus one new lane

**Classification:** mandatory gate preservation.

Exactly4 current mandatory workflow files provide concrete commands; a fifth Comet-focused lane does not exist on768. All9 existing workflows and182 scenario IDs are hashed; Full has40 registered negatives,22 mandatory in its actual loop.

**Required treatment:** Preserve the four workflows and their commands. Add a separate Comet lane for schema 3/ledger/commands/newDeeds/chronology/mobile/V8. workflow-commands.md transcribes every existing run block, including stage/identity/smoke and exact22 loop; the absent fifth has coverage/interface requirements, not falsely claimed existing commands.

**Keep:** Preserve meaningful old test scenarios/negative hooks while adapting documented fixture/schema seams. An APK identity self-test is not an APK build; main/APK hold remains.

**Anchors:** `.github/workflows/pre-merge-validation.yml`:30,33,37,42,50,53,56,63,72,87,92; `.github/workflows/lab-expansion-validation.yml`:20,28,36,39; `.github/workflows/forge-expansion-validation.yml`:20,28,32,36,41,44; `.github/workflows/tree-focused-qa.yml`:24,41,45,49,53,58,63,68,73.

## Bounded arithmetic that must remain distinct

| Existing scenario | Ownership relevant to new retirement | Old expected result | Schema3 expectation under selected compensation |
| --- | --- | --- | --- |
| Tree mobile raw schema 1 migration | All three retiring cards; old offline24/offline48 |7+300=307 Comets;132 Prisms |7+300+350=657 Comets;132 Prisms; each ledger settles once |
| Tree actual V8 raw schema 1 migration | No retiring cards; old offline24/offline48 |7+300=307 Comets;132 Prisms |307 Comets;132 Prisms; nonowner retirement states |
| Original Comet core F26 migration | AA/rememberbulk/oldhours only |789+300=1089 Comets |1089; no new 350 |
| F25 Loadout Memory | rememberbulk only |125 Comets preserved |125; no new refund or repurchase gate |
| Protected mainfixtures/refund-interop/device fixture | No true owned retiring-card flags observed | Original wallets/oracles | No new retirement compensation; migrate only required representation |

These are arithmetic implications of the selected future contract, not new product execution. The read-only fixture summaries include only schema and relevant ownership IDs; no complete private save was copied.

## Evidence and scope

- inventory.json: exact old 23 predicate/reward ledger, current4shop definitions, product function anchors,47 matching test-file identities,250 static source hits, all 4 exact workflow run blocks,182 IDs,40 registered and22 mandatory negative IDs,15 protected file identities.
- impact-matrix.json: the17 classified actionable entries above. A static search hit is a review candidate, not a declaration that every matching file needs an edit.
- workflow-commands.md: every current run block of Full/Lab/Forge/Tree, with exact file/line attribution and a separate absent/new Comet lane. None of these commands was executed here.
- collect-inventory.cjs and create-report.cjs reproduce the static inventory/report on exact768. collect.stdout.json records successful completion; collect.stderr.txt is empty.
- The first collector attempt counted the shell loop keyword in as a negative ID and stopped at23≠22. Its original stdout/stderr are retained as collect-initial.*; the parser was corrected to match for scenario in. This was a documentation-helper parsing error, not a game or CI failure. No product/test assertion was changed.
- Existing Lab/Forge final768 raw audits remain separately frozen; no earlierCI pass is used to claim acceptance of future Comet mechanics.

The new report receipt and closed manifest bind all local report files. Product HTML, full test bodies, artifact ZIPs and private save payloads are not copied into this inventory package.
