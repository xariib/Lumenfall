# Static replay of the viewport lower bound — a8d8fa1d

**Replay of previously recorded geometry, not a new browser test or acceptance.** This package retains the frozen static repair from mobile test `22bf25b1200ebd149503ad779d283f07e2f2795620fc96b71a13493d4557a61f` to `a8d8fa1d7a0b09ef0cbce0013bb168ef2a8ef36996f10c5fb58c2dc76dbaa6b1`, against unchanged product `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3`. It includes the exact 22bf before-test body, lossless patch, original helper, contract receipt and generated-syntax receipt.

The replay's only browser data comes from [diagnostic b7eaca](../scroll-diagnostic-b7eaca/README.md), run `38087766620`, artifact `11683425025`. The original mobile receipt SHA256 is `d2062b8c486e3cc1b4e78d114cb3951c2a7639ee9eedcb16344babf380bd6397`; that complete receipt is preserved at [raw/mobile/receipt.json.gz](../scroll-diagnostic-b7eaca/raw/mobile/receipt.json.gz). Its browser run stopped after **2,061 checks and zero completed profiles**.

## What the recorded boundary permits

To preserve the original control top, the required new scroll is computed from the before/after recorded rectangles. For the Farm action it is **−14**, outside the physical range **0..5282**. The nearest feasible scroll is **0**, the actual browser value; the resulting **−14px** control-top movement is unavoidable at that boundary. The old strict top assertion still rejects both original Farm observations; the replay records this fact instead of rewriting the failed result.

| Frozen observation | Required scroll | Actual scroll | Actual control-top change | Static classification |
| --- | --- | --- | --- | --- |
| Farm, immediate | −14 | 0 | −14px | Exact nearest feasible minimum bound |
| Farm, settled | −14 | 0 | −14px | Exact nearest feasible minimum bound |
| Summary positive, immediate/settled | 4347.9375 | 4348 | −0.0625px | Strict top position preserved within rounding |
| Summary restoration removed, immediate/settled | 4347.9375 | 4237 | +110.9375px | Real interior viewport defect still rejected |

The [original clamp contract](clamp-contract.json.gz) retains all six replay records, the raw-data hash, exact patch identity and unchanged-oracle/facade/migration contract checks. The [generated syntax receipt](generated-syntax.json.gz) only parses the prepared Chromium driver and three instrumented inline scripts. Neither activity is a new browser or gameplay run. Browser acceptance was **pending actual CI** when these receipts were frozen.

The static check permits only displacement mathematically forced by the finite scroll range; the recorded +110.9375px interior defect remains rejected. It does not waive visibility, focus, enabled-hit-target or causal-mutation requirements. Only the earlier browser diagnostic can support statements about the real input it actually reached; later Formation controls, reload completion and the remaining profiles still require a subsequent run.

[manifest.json](manifest.json) is a closed file inventory excluding itself, with original/stored byte counts and SHA256 values. The original gzip patch bytes are unchanged; other files are compressed losslessly. Packaging only checked frozen bytes and source/data bindings. Native Android, WebView integration, OS font scaling, TalkBack and APK execution were not performed.
