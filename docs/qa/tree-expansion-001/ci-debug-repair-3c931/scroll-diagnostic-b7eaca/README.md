# Failed second isolated scroll diagnostic — b7eaca

**Historical failure evidence; not PR106 acceptance.** Run [38087766620](https://github.com/karahaNx/Lumenfall/actions/runs/38087766620), job `114317762189`, attempt 1, tested diagnostic commit `b7eaca0b671d2c8350eb47bc1ba6f2c020b4177c`. Its sole parent is `2bce799cd224ddeffb6c1ff83ad5f19991ad1444`; the complete tree is `4b89d6122a9c91bc24581f961205891dfae3dc0b`.

Product SHA256: `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3`. Mobile test SHA256: `22bf25b1200ebd149503ad779d283f07e2f2795620fc96b71a13493d4557a61f`. Bridge SHA256: `8568cfb994b0a6c4c1c2bded8f2946a6489b18591992e58d534f483f5cb287c1`. The original fixture remains `ab43604db1b5bce8b9990506f989676dfb0009cdcf2e514a8ccee9da166c8753`. The diagnostic source and inputs were pinned independently of the required PR106 workflows.

## Actual browser result and stopping point

The Tree mobile driver failed after **2,061 checks in the first 320px / 100% root-font / normal-motion profile**. **Zero of 12 profiles completed.** Its original assertion was `viewport top stable Farm preset immediate`; the driver exited 1, while Chrome exited normally with code 0. The 200% root-font profiles did not run.

Before that stopping point, the browser recorded 16 funded Tree purchase probes with at most **0.1875 CSS px** of immediate or settled control-top drift. It completed the summary viewport causal pair and the first four Formation probes. These are real observations from this partial run; they do not count as completion of the whole mobile matrix.

| Recorded input / comparison | Main scrollTop | Control top | Observed result |
| --- | --- | --- | --- |
| Frontier summary, restoration present; browser anchoring disabled | 4237 → 4348 | 431.34375 → 431.28125 | −0.0625px drift; visible and focused |
| Same summary input, only restoration removed; browser anchoring disabled | 4237 → 4237 | 431.34375 → 542.28125 | +110.9375px defect caught |
| Field Aurora as sixth member | 4221 → 3581 | 431.0625 → 430.71875 | −0.34375px drift, actual six-member party |
| Refuse a seventh powered member | 4315 → 4315 | 431.0625 → 431.0625 | No viewport drift, six-member party retained |
| Bench Aurora | 3580 → 4220 | 431.71875 → 432.0625 | +0.34375px drift, actual five-member party |
| Field Aurora again | 4220 → 3580 | 432.0625 → 431.71875 | −0.34375px drift, actual six-member party |
| Select Farm preset | 32 → 0 | 424 → 410 | Exact old viewport position would require impossible scrollTop −14 |

For Farm, the recorded post-input scroll range is **0 through 5282**. Preserving the old control top would require `targetScroll = −14`; the nearest physically feasible value is **0**, which the browser actually used. The observed **−14px** control movement is exactly the unavoidable lower-bound displacement. The button remains fully visible and focused; the Farm selection actually changes the party from six to five. This witness identifies an impossible test expectation at the scroll boundary, not a demonstrated product restoration failure.

The failure prevented the later Push, last-Wisp, Formation causal-pair, reload-completion and remaining profile checks. Only **one of the two planned viewport causal pairs** executed. Numeric scroll values, actual control rectangles, focus/input evidence and saved state are retained in the raw receipt and [compact geometry extraction](geometry-summary.json).

## Focused Prism result

The same diagnostic's separate focused Prism step **passed all four original positive flows and all five original causal negatives**. Positives cover the contract, save/reload, backup/restore and recovery. Each negative has a raw browser exit 0, no timeout, the expected in-page assertion failure and no runtime errors; the wrapper correctly exits 1 and marks the mutant caught. See [focused receipt](raw/prism/browser/receipt.json.gz), its complete raw subtree and [Prism job output](raw/prism-browser.log.gz). This limited pass does not supply Tree mobile or Full acceptance.

## Frozen raw evidence and identity

Artifact `11683425025` is **3872341 bytes**, SHA256 `2f38c2d176fe66fed3c84c4a93679c5d2ecfcec8405426c7db64660659f88d5e`. The original audit verified API size/digest, all ZIP CRCs, **132 input identities** and **122 complete input bodies**. Packaging rechecked all **174** extracted member hashes. The complete inventory remains inside [diagnostic-audit.json.gz](diagnostic-audit.json.gz).

This package preserves the entire diagnostic output subtree, **all five original PNGs**, final and initial API observations, identity/workflow sidecars, the original audit/helper, and the **complete 207,438-byte job log** ([job.log.gz](job.log.gz)). It includes the earlier identical first log fetch as history. Whole input source bodies, fonts and the ZIP are not duplicated: the immutable commit and archived identity/blob inventory identify them exactly. The ZIP remains in scratch at `tree-ci/scroll-diagnostic/second/tree-scroll-diagnostic-38087766620.zip`.

[manifest.json](manifest.json) is a closed inventory, excluding itself, with original and stored byte counts and SHA256 values. Every gzip expands byte-for-byte to its original; PNG bytes and all original trailing whitespace are unchanged. Packaging uses Node.js and does not rerun the audit helper, product, browser or tests.

The [earlier diagnostic](../scroll-diagnostic-2bce/README.md), [22bf static viewport-contract preparation](../viewport-repair-22bf25b1/README.md), and [a8d8 static boundary replay](../viewport-clamp-repair-a8d8fa1d/README.md) remain separate historical records. The boundary replay is **not another browser test**. Native Auto-Ascend picker protection is source-verified here, without a direct picker interaction claim. Native Android, WebView integration, OS font scaling, TalkBack and APK execution remain untested.
