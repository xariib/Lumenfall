# Formation purchase adapter: three downstream diagnostic failures

## Result and scope

The exact old `formationTest.buy` adapter reproduces all three newly reported recruitment failures. It calls the real, transactional `buySpirit` while the test's `reloadInProgress` flag is true. Production therefore returns false and rolls the purchase back before any storage write. Temporarily clearing that QA flag around the same handler fixes the three purchase boundaries; `finally` restores the original flag.

The completed witness contains **15 top-level records: 13 purchase records and two read-only Comet-adapter probes**. These are complete-IIFE transaction witnesses, **not browser or full-scenario acceptance**. Four recovery/retry substeps belong to their parent fault-control records and are not counted as additional top-level records.

The only existing repository code file changed by this task is `tests/behavioral/bridge.js` → `formationTest.buy`. This new evidence package is also copied to the authorized QA directory. The production HTML, scenarios, prices, fixtures, negative hooks and unused `comet.ascend` member remain unchanged by this task. No staging or remote operation was performed.

## Exact binding

- Failed diagnostic run: `38088619254`, commit `cd3e915b91ed2a41f0ada01543437600a2349a48`, tree `22eb701ddbaece465ba962a2aed0c520f914bc3e`.
- Product SHA256: `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3`.
- Bridge before: `8568cfb994b0a6c4c1c2bded8f2946a6489b18591992e58d534f483f5cb287c1`.
- Bridge after: `e5abae8c0e7e1a422f1322049963438040be62f181967c9eb7fd40b5229f11dc`.
- Unchanged complete-IIFE harness: `bcf080ce494ee1a2df450241dbd6a087fb6880239c3d2e711d1d2116f4ce3463`.
- Diagnostic driver: `43345748b16e0db659fb72eda75f4ce93ebb3d5837a861deb657441678504f7b`.

The source modules are read from exact published head `3c931a26bbcf7b009dee03e7411ed41faeb971f8`. `source-binding.json` compares their bytes with the current working files and the diagnostic's archived input manifest. The original three DOMs are identified by their full byte lengths and SHA256 in `receipt.json` and `witnesses.json`; exact QA `<pre>` content and process metadata are copied here. The full DOMs contain the product HTML and remain in the referenced diagnostic artifact rather than being duplicated here.

## Three observed failures

| Scenario | Original assertion / original wallet | Old adapter | Fixed adapter |
|---|---|---|---|
| `support-stacking` | `reconstruction Wisp paid exactly once actual=0 expected=60`; 100,000,000 Lumen | Tide stays 0; debit 0; real handler false | Tide becomes 1; exact debit 60; real handler true |
| `rift-status-contract` | `reconstruction recruits one paid level with the exact independent debit: void`; 3,000,000 Lumen | Void stays 0; debit 0; real handler false | Void becomes 1; exact debit 70,000; real handler true |
| `p2-07a-formation-reconstruction` | `exact legitimate Lumen debit tide`; exactly 60 Lumen | Tide stays 0; debit 0; real handler false | Tide becomes 1; wallet 0; real handler true |

All three archived browsers exited 0, did not time out, reported no runtime errors, and produced valid in-page FAIL results. Their outer test commands correctly exited 1. The diagnostic's other ten attempts passed; that separate result is not attributed to this local witness.

This is not a stale-state observation defect. The exact bridge `getState` returns a JSON copy. The Support assertion saves a numeric balance, and the other two assertions use detached before/after snapshots. The witness explicitly verifies that the before snapshot remains unchanged. It also checks all 17 new Tree node levels and `treeTrainingProgress` at zero.

Relevant pre-repair anchors are `bridge.js:402` (direct purchase helper), `bridge.js:504` (snapshot getter), `support-stacking.js:62–63`, `rift-status.js:151–153`, and `formation.js:20,29`. Production anchors are `getSpiritBuyPlan`, `buySpirit` at 5770, `forgeCommitPaidMutation` at 4719, and `saveState` at 4466. The old freeze/Ascend chain was separately diagnosed and is frozen in the prior package.

## Persistence controls

The six fixed-adapter controls cross the original reload flag (`false` / `true`) with healthy storage, primary-write failure, and recovery-write failure. Both flag values are restored after every handler call and retry.

- Healthy storage: exact 60 debit, one Tide level, primary and recovery both written.
- Primary failure: one failed primary attempt, zero successful writes, real handler returns false, and the entire live state equals its before snapshot. After storage recovers, one retry pays 60 exactly once and reaches Tide1.
- Recovery-only failure: the primary write succeeds, the recovery write fails, and the handler correctly returns true. The live and cold-loaded endpoints retain Tide1 and wallet0. A subsequent purchase retry is unaffordable and grants no extra level.
- A separate old-adapter control with the reload guard already false succeeds, isolating the flag mismatch from product pricing or recruitment.

Actual `currentSaveBackup` and a fresh complete-IIFE cold load agree with the retained endpoint in each relevant record. Write attempts, successful writes and their serialized value hashes are kept separately. The fault witnesses make one explicit checkpoint of the original funded synthetic state before purchase; this allows meaningful cold-load rollback checks without claiming that the complete browser sequence ran locally.

## Read-only Comet check

The existing browser tests do not call `bridge.comet.ascend`. `comet-unlocks-ui.cjs` uses only its render, shop and tab operations, with a timer-only `uiMeasurementPause`. Its code contains no call to Ascend. `comet-unlocks-core.cjs:22` exposes its own `ascend:applyAscendMutation`; its Trial and retention checks use that direct mutation facade, independently of the shared bridge's reload flag.

Two explicit probes of the unused shared helper show real `doAscend` returns true with reload false (+1 Ascend, two writes), and false with reload true (no Ascend, no writes). The helper itself returns undefined in both cases. Ownership and equipped cosmetics remain intact. This is a demonstrated property of the unused helper, not evidence of a false pass in the existing Comet core test. No Comet adapter change was made.

## Execution and remaining gate

`node witness.cjs > witness.stdout.json 2> witness.stderr.txt` completed with exit 0 and empty stderr, using Node v24.19.0 / V8 13.6.233.17-node.51. `node --check tests/behavioral/bridge.js` also exited 0. Exact command metadata, clock-tool UTC observations and file hashes are in `execution.json`, `acceptance.json` and `manifest.json`.

The real browser must still run the complete three affected scenarios, including their downstream UI assertions and existing negative controls. This package preserves the actual raw failures and the bounded repair proof without claiming that pending acceptance.
