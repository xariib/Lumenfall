# Fourth isolated Tree diagnostic — 48c13f2d

**This isolated diagnostic succeeded. Required PR106 Full, Lab, Forge and Tree
validation remains pending; this is not integration or release acceptance.**

Run [38089706277](https://github.com/karahaNx/Lumenfall/actions/runs/38089706277),
job `114323458107`, artifact `11683956884` tested commit
`48c13f2d74b0bd6dc52cf79b0e0e97b89c8b2e5e`. Its sole parent is
`cd3e915b91ed2a41f0ada01543437600a2349a48`; complete tree
`f7ebddde82ee7856220591128f0f00c7e0037a68`.

| Bound input | SHA256 |
| --- | --- |
| Product | `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3` |
| Tree mobile wrapper | `45d8b66546b48318586eb1c045fe95cd373fd386601d17e4984a1eda4b3818ee` |
| Shared behavioral bridge | `e5abae8c0e7e1a422f1322049963438040be62f181967c9eb7fd40b5229f11dc` |
| Frozen fixtures | `ab43604db1b5bce8b9990506f989676dfb0009cdcf2e514a8ccee9da166c8753` |

## Actual completed diagnostic

| Gate within this diagnostic | Recorded result |
| --- | --- |
| Tree mobile | **26,600 checks; all 12 profiles**, 320/390/430px × 100%/200% CSS root text × normal/reduced motion |
| Tree/Formation inputs | 192 funded probes and 84 Formation actions; all profiles complete paid migration, actual purchases and save/reload |
| Viewport causal controls | Both Frontier-summary and Formation-reorder positive/mutated pairs passed |
| Readiness | All 60 phases completed; at most one ready action per phase; maximum duration 615ms |
| Previously failed Full scenarios | All nine original IDs, **13/13 actual attempts**, passed |
| Focused Prism | Four original positive flows and all five strict causal negatives passed |

The complete [mobile receipt](raw/mobile/receipt.json.gz) contains all original
observations and readiness traces. A separate [readiness extraction](readiness-observations.json.gz)
retains the exact diagnostic array with its source hash. One real
`Runtime.evaluate` navigation interruption occurred at the 390px/100% normal-motion
legacy reload; the phase completed in 192ms with one ready action. This is actual
CI observation, distinct from the earlier [finite-clock proof](../readiness-repair/README.md).

The original physical Farm bounds remain covered: unavoidable displacement is
14px at 320 and 37px at 390/430, at normal text in both motion modes. Both centered
causal pairs retain strict interior viewport assertions. Only their four
[causal PNGs](selection.json.gz) are copied here, with original bytes. The other
36 regular-profile PNGs remain hash-indexed in the original artifact inventory;
this package does not duplicate them.

## Original Full and Prism evidence

The nine original Full command stdout/stderr/process triplets cover all thirteen
actual attempts; the layout command contains five viewport attempts. All original
triplets and the [wrapper receipt](raw/full-failed-rerun/receipt.json.gz) are retained.
[full-attempts.json.gz](full-attempts.json.gz) indexes every actual PASS row and its
original stdout hash. The unchanged [parsed stdout observations](full-observations.json.gz)
retain available QA detail: Support records 252 checks and five internal controls;
Formation reconstruction records 323 checks and two controls. Rift status records
its PASS/footer without a detail payload. These internal controls are not the
separate mandatory Full suite's 22-negative gate.

**No new positive browser DOM was produced by the existing runner.** This applies
to all thirteen Full attempts, including the three last-failing Support/Rift/Formation
flows, and the four focused Prism positives. Consequently this package cannot
provide their requested full DOMs or invented DOM hashes. The actual successful
stdout/stderr/process records are preserved. The previous FAIL DOMs remain in
the [third diagnostic](../scroll-diagnostic-cd3e915b/README.md) and are not reused as
new success evidence.

The [focused Prism receipt](raw/prism/browser/receipt.json.gz) and
[original strict log](raw/prism-browser.log.gz) are retained with all original
wrapper outputs. Each of the five negatives has a real completed Chrome process,
exit 0, no timeout or runtime errors, and one expected in-page FAIL payload; its
wrapper exits 1 and records the defect as caught. [The negative index](prism-negatives/index.json.gz)
binds the original process/stderr files, exact raw QA subrange and parsed payload
to the complete original DOM hash and byte offset. Large negative DOMs are not
duplicated in this compact package.

## Integrity and selection

The original ZIP is **11,856,883 bytes**, SHA256
`c66538e734394dba9cb02f102d5f0657cd05c51f568a9c15d636bdb21ab3fb88`.
The API size/digest and original CRC proof agree. The audit verified 132 input
identities, 122 complete input bodies, all 236 artifact files and all nine unchanged
original workflow blobs. Packaging rehashed all 25 original top-level files and
236 extracted artifact members without re-running the audit helper or tests.

All original API observations, commit/tree/identity sidecars, ZIP proof, full
member hashes and the frozen audit are retained. The [original manifest](original-manifest.json.gz)
and [selection inventory](selection.json.gz) cover included and omitted files
explicitly. The ZIP, source/input bodies, duplicate parsed mobile copy and early
job-prefix capture remain in the frozen scratch audit; their hashes are retained.
No original is rewritten.

The **complete 3,496,508-byte [job.log.gz](job.log.gz)** expands to SHA256
`3abb6a691acd6948c445ae434cb9e965e439fd2863f7460b650892b652aa71dc`.
It is the terminal log, not the earlier prefix. [manifest.json](manifest.json) is
a closed inventory excluding only itself, with stored and original byte lengths
and SHA256. JSON/log compression is lossless; selected PNGs are unchanged.

The auditor's [visual inspection](visual-inspection.json.gz) records sixteen
viewed original PNGs and an incidental large-text toast-spacing limitation. The
packager did not perform a new visual review. No direct native-picker, native
Android/WebView integration, OS font-scaling or TalkBack acceptance follows from
these CSS-root browser profiles. No APK, product/test edit, staging or remote
operation occurred during packaging. Main and APK remain held.
