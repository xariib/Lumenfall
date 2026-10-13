# Tree readiness repair — local transport proof

Frozen at 2026-10-10T21:59:13Z from the trusted clock. This package records a test-wrapper repair; it does not establish mobile browser acceptance.

The third diagnostic (run 38088619254, job 114320265374, artifact 11683895989) stopped after 8,984 checks and four complete 320px profiles with the wire error `-32000: Inspected target navigated or closed`. The old response mapper did not record the CDP method. Its fifth synthetic migration diagnostic was present without a loaded state; no failure screenshot was available. Those complete raw records remain in the separate frozen third-run audit.

The Tree-generated driver now records the method, profile and five actual readiness phases. Only that exact protocol response from the read-only Runtime.evaluate readiness probe can continue polling. Product exceptions, assertions, other protocol errors and errors from the actual prismQa.ready() action propagate unchanged. The action is issued at most once, and the total readiness budget is 10,000ms even when a probe is pending. Shared prism-acceptance.cjs is unchanged.

Actual generated-helper replay: 15 cases pass; the old helper, an overly broad catch mutant and an extended-deadline mutant are detected by three causal controls. Repeated navigation and false probes perform at most 334 probes before failing at 10,000ms. This is a finite-clock transport-response replay, not a browser rerun.

Static verification establishes that every scenario, oracle, gameplay input and assertion is byte-identical after removing only the new phase labels. The injected production facade, native animation-frame/input/storage prelude, bootstrap registration/removal and real reload counts are unchanged. The generated driver and all three inline scripts parse. The complete instrumented HTML hash is unchanged: 2c37a177f59f4679010b5f79bfe0cebb405006c1d18847d48f7e91a720153c51.

| Identity | SHA256 |
| --- | --- |
| Product | ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3 |
| Previous mobile test | a8d8fa1d7a0b09ef0cbce0013bb168ef2a8ef36996f10c5fb58c2dc76dbaa6b1 |
| Repaired mobile test | 45d8b66546b48318586eb1c045fe95cd373fd386601d17e4984a1eda4b3818ee |
| Shared Prism transport | 8009b22eb4d4551f4aef2c3f0db82507e595d8f434db000327cb95805291d6dd |
| Generated driver | b4e2ad3c2a050a787d821f6b063da37f0b8dd2046ee6b69f5d0abf511dc1e102 |

The before file and lossless unified patch reconstruct both directions exactly. The full proof JSON and its gzip are byte-equivalent. The source/fixture bytes themselves remain in Git; no private save was used.

Reproduce the finite proof using Node20+ and a checkout containing the repaired test:

```sh
node verify-readiness.cjs /absolute/path/to/Lumenfall-tree /absolute/path/to/readiness-repair <trusted-UTC>
```

The sibling third/artifact/tree-scroll-diagnostic/mobile/receipt.json supplies the original recorded wire response. The script creates drivers but intercepts child execution; it never launches Chrome. Review and complete CI browser results are separate evidence. The manifest covers this agent’s named files; an independent-review.json may be added by the separate reviewer and is intentionally outside this frozen manifest.
