# Failed isolated viewport diagnostic — 2bce799c

This immutable package records diagnostic run [38086639813](https://github.com/karahaNx/Lumenfall/actions/runs/38086639813), job114314414958. It is a failed partial browser run, not PR106 acceptance.

Commit2bce799cd224ddeffb6c1ff83ad5f19991ad1444 has sole parent3c931a26bbcf7b009dee03e7411ed41faeb971f8 and complete tree7c4a3db503f74a67754cac03a0d4deb8ea703159. Product SHA25617d4ff66cc960f80200bbc7a640947d87bf1c8e2c216eea181761f036df5f806. The workflow pins source, tests, fixture and parent, runs only on its diagnostic push branch, and shares no concurrency group with required Full validation.

## What the actual geometry changes

| Probe at320px / root16px / normal motion | Main scrollTop | Focused control top | Outcome |
| --- | --- | --- | --- |
| Frontier with the provisional numeric guard |4272 →4272|431.875 →542.8125|Control moves110.9375px down. The provisional guard is rejected.|
| Frontier with only that Tree guard reverted |4237 →4348|431.34375 →431.28125|Browser anchoring preserves viewport position within0.0625px.|
| Field Aurora as the sixth member |Before was not persisted; after4267|After−255.28125; bottom−207.28125|Focused/enabled button is completely above main129..782. Real Formation visibility failure.|

The earlier test treated an unchanged numeric scroll as the required result. This diagnostic disproves that interpretation: a compensating numeric scroll can be precisely what preserves the control's visible position. The earlier negative caught its authored numeric assertion but did not establish a user-visible defect. Its original receipts, inputs, exact mutation, screenshots and state/slot restoration are retained without rewriting this history.

The revised test must require actual viewport stability (at most1 CSS pixel for rounding), focus, enabled/visible hit targets and settled frames. It must keep the numeric scroll as evidence. To establish causality independently of automatic browser anchoring, the positive and narrowly mutated summary cases must both disable browser anchoring for the same scenario; only the product viewport-restoration call may differ. Formation reorder requires separate real-input coverage and before/immediate/settled records. No post-input focus/scroll repair in test code may conceal either failure.

Mobile failed after1,602 checks in the first profile; zero profiles completed and200% root-font profiles did not run. The actual trusted Field action changed Aurora into the saved six-member active party and selected Push preset, retained focus and changed its button to Bench, but the presentation sort moved it out of view.

## Scoped Prism adapter repair verified

The same run's focused Prism step passed all four original positive flows and all five original causal negatives. The bridge temporarily clears and finally restores its synthetic reload guard around the real manual Ascend. Product save guards, reward oracles and original negative mutations are unchanged. Every negative raw process/DOM has browser exit0, no timeout, an expected in-page assertion failure and no runtime errors.

## Evidence integrity

Artifact11682737846 is3,631,642 bytes, ZIP SHA256873283320ffd18f43fa73f1aeb15ddf0b5f1355913633e6627f3fcfc4a95e54f. API size/digest and ZIP CRC passed. The source audit verified132 input identities and122 complete input bodies. The original ZIP inventory remains in diagnostic-audit.json.gz. This package retains the complete diagnostic output subtree, all four PNGs, final APIs, full job log and the source-binding audit; the exact input source bodies are also durable in commit2bce799c and identified by the artifact manifest.

Gzip files expand byte-for-byte to the original downloaded evidence. manifest.json inventories all retained files and their original/stored hashes. No browser, native Android/WebView60, OS font scaling or TalkBack acceptance is inferred beyond the recorded run.
