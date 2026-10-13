# Failed Full CI — Tree candidate 3c931

**Failure evidence, not acceptance.** Run [38085086718](https://github.com/karahaNx/Lumenfall/actions/runs/38085086718), job `114309817414`, attempt 1 completed with a failed stateful gate. All 182 original default scenarios were attempted: **199 PASS and 13 FAIL across 212 rows**. All 13 failures have a valid QA failure, exit code 0, no timeout, and no runtime-error marker.

## Candidate identity

- Published PR106 head: `3c931a26bbcf7b009dee03e7411ed41faeb971f8`.
- Base: `2d01049393e3bb45a90d80e07af52ae0484b0ec5`.
- Actual synthetic merge: `a2561ca083c036df0b5ebe27e09939d0bd35c701`; API parents and tree are retained in metadata.
- Complete tree: `d11120bc250a6ac90fac1f5e598042a5572e5650`.
- Product SHA256: `4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef`.
- Artifact `11682079317`: 17005268 bytes, SHA256 `675319bc4e89915f63778ebfab414a1d947fba17f9283499929258b2b0dc8e4d`; API size/digest, all ZIP CRCs, and all 123 extracted file hashes were checked.
- Audit clock (clock tool): `2026-10-10 21:36:18 UTC`.

The exact published workflow and [scenario inventory](scenarios-at-head.json) are retained. [Published source verification](published-source-verification.json) records 117 exact source/test/workflow files and the original 22 negative scenario IDs. The product and test source remain retrievable by immutable published Git blobs; no whole product source is duplicated here.

## Exact failures in execution order

| Row | Scenario / viewport | Original assertion |
| --- | --- | --- |
| 1 | `inquiry-save-reload` | existing Ascension currency reset unchanged |
| 2 | `inquiry-backup-restore` | existing Ascension currency reset unchanged |
| 3 | `inquiry-recovery` | existing Ascension currency reset unchanged |
| 4 | `support-stacking` | Ascension clears all sources |
| 5 | `rift-status-contract` | pending intent is not active Bonds |
| 6 | `p2-07a-formation-reconstruction` | temporary powered Ember only ["stone","ember","tide"] |
| 7 | `p2-07a-chronology` | no purchase before existing 1-second cadence |
| 8 | `layout-p2-07a-reconstruction` `[360,800,0,0]` | startup support explained |
| 9 | `layout-p2-07a-reconstruction` `[360,780,0,0]` | startup support explained |
| 10 | `layout-p2-07a-reconstruction` `[390,844,0,0]` | startup support explained |
| 11 | `layout-p2-07a-reconstruction` `[412,915,0,0]` | startup support explained |
| 12 | `layout-p2-07a-reconstruction` `[360,640,24,24]` | startup support explained |
| 13 | `ascend-prisms-contract` | manual payout equals preview/oracle |

Each directory under `failed-scenarios/` contains the complete original `process.json`, lossless compressed stdout DOM and stderr, the parsed QA payload, the observation/provenance record, and its exact behavioral-log excerpt. The full DOMs are synthetic CI fixtures; no private player save was collected. [Failure order](failed-scenario-order.json) and [full parsed failure analysis](failed-scenario-analysis.json) are derived from those immutable raw bytes. This archive records the failures without claiming their repair or a shared cause.

## Completed and skipped gates

Steps 1–10 succeeded. Their receipts include cosmetics (168 reported samples), numerical Prism validation (341,654 assertions, 277,916 formula cases, 3,780 payout cases and seven causal controls), and currency UI (5,808 checks over 12 profiles, with three expected failing mutants). These limited positive results do not override the failed stateful gate.

The original `offline-catchup-core` row passed: 17 records, 211115.951851 ms, exit 0, no timeout. The retained record includes the 8h batch-256/31 comparisons, capped windows, boundary parity, save/cancellation failures and wall-clock jumps.

Step 11 failed. Step 12, containing the **22 original individual workflow negative controls, was skipped: zero were executed by that gate**. The final runtime-guard and browser-smoke steps 13–14 were also skipped. Artifact upload and cleanup completed. All 18 actual step dispositions are retained in [audit.json](audit.json) and [final-jobs.json](metadata/final-jobs.json).

## Raw-log completeness

[behavioral.log.gz](logs/behavioral.log.gz) is the **complete final stateful log**, 10988793 original bytes, SHA256 `a1f7dd57080857eff2d64853b937f07067b99702f59360a9d2eb1232ee14e900`.

[job-partial-prefix.log.gz](logs/job-partial-prefix.log.gz) is expressly **only a partial job log**, from `2026-10-10T20:47:01.4308185Z` through `2026-10-10T20:50:04.0167177Z`. The final log endpoint failed with `Transport closed` twice. A generic job-log GET was rejected; the generic run-log GET returned an empty body. [Original transport observations](metadata/log-fetch-observations.json) preserve these limitations. No concatenation or reconstructed whole job log is presented.

The original ZIP remains in scratch at `tree-ci/repair/full/pre-merge-evidence-38085086718.zip`; its complete [member manifest](artifact-manifest.json) and API digest are durable here. Passing screenshot/DOM payloads are not duplicated for this failed candidate. Raw positive currency receipts are included without redundant PNGs.

## Integrity and scope

[manifest.json](manifest.json) is a closed inventory of every package file except itself, with original/stored byte counts and SHA256 values. Every `.gz` is lossless gzip; decompressed bytes were checked against original bytes before this package was frozen. Raw trailing whitespace and BOM bytes are preserved.

Initial archive processing used a scratch Python standard-library helper; its source digest and factual history are retained in [processing-history.json](processing-history.json). Final packaging used Node.js and native `unzip`, without new game/scenario/browser runs or edits to test expectations. No Python helper is installed as active repository tooling. Native Android, WebView integration and TalkBack remain untested.
