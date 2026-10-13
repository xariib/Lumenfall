# Tree readiness adapter repair — preserved finite proof

**Scope: frozen local transport proof and a separate read-only review. This is
not Chromium, mobile-profile or product acceptance.** No tests or browser were
run while packaging this evidence.

The owner recorded **15 finite synthetic-clock cases and three causal controls**
for the actual generated readiness helper and protocol-error mapper. Successful
cases and deliberately failing error/deadline cases all met their respective
oracles. The controls caught the old helper, an overly broad error catch and an
extended deadline. See [the complete raw proof](readiness-proof.json.gz),
[the owner's original README](README.original.md) and
[the independent review](independent-review.json).

## Exact candidate identity

| Input | SHA256 |
| --- | --- |
| Product | `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3` |
| Previous mobile wrapper | `a8d8fa1d7a0b09ef0cbce0013bb168ef2a8ef36996f10c5fb58c2dc76dbaa6b1` |
| Repaired mobile wrapper | `45d8b66546b48318586eb1c045fe95cd373fd386601d17e4984a1eda4b3818ee` |
| Unchanged shared Prism transport | `8009b22eb4d4551f4aef2c3f0db82507e595d8f434db000327cb95805291d6dd` |
| Generated repaired driver | `b4e2ad3c2a050a787d821f6b063da37f0b8dd2046ee6b69f5d0abf511dc1e102` |
| Instrumented HTML, as recorded by the owner's syntax proof | `2c37a177f59f4679010b5f79bfe0cebb405006c1d18847d48f7e91a720153c51` |

The owner froze the proof at `2026-10-10T21:59:13Z`; the separate reviewer recorded
`2026-10-10 22:00:00 UTC`. Original timestamps and identities remain untouched.
The reviewer did not execute the helper, game or browser. Packaging identities
and source-to-stored mappings are recorded in [packaging.json](packaging.json)
and the closed [manifest](manifest.json).

## What the recorded proof establishes

Only the exact tagged `Runtime.evaluate` protocol response `-32000: Inspected
target navigated or closed` from the read-only initialization probe may continue
polling. Product exceptions, other protocol errors and failures of the actual
`prismQa.ready()` action propagate. That action runs at most once. All attempts
share one 10,000ms readiness deadline, including an outstanding probe; repeated
navigation and false probes stop after at most 334 probes.

The existing five readiness phases gain diagnostic labels. The owner records
unchanged scenarios, assertions, gameplay inputs, injected facade, native
frame/input/storage prelude, document-start bootstrap and actual reloads. The
generated driver and three instrumented inline scripts parsed successfully in
the existing [syntax record](generated-syntax.json). Those results were not
re-run by the packager.

The motivating [third browser diagnostic](../scroll-diagnostic-cd3e915b/README.md)
failed after 8,984 checks and four completed 320px profiles. The original wire
error did **not** record its CDP method. Assigning `Runtime.evaluate` to the
read-only probe in the synthetic replay does not establish which method emitted
that historical error. This repair's method/probe guard is explicit and will be
observed by the next real browser run. No missing fifth-profile screenshot or
DOM is invented here.

## Preservation and reproduction limits

All 13 files from the frozen scratch directory are represented. Its original
manifest and README are retained as `manifest.original.json` and
`README.original.md`; their historical paths and scope are not silently edited.
The owner's manifest intentionally excludes the separately authored review;
this package's new closed manifest includes that review.

The raw `readiness-proof.json` and its already existing `.gz` encode identical
original bytes. One byte-identical gzip is stored here; `sourceInventory` maps
both original files to it, using decompression for the JSON and direct bytes for
the original gzip. No raw output is parsed and rewritten. The original patch
gzip is also retained byte-for-byte. Archived `.cjs.gz` files are losslessly
compressed copies, not new executable tooling.

To inspect compressed evidence, decompress a copy outside this frozen package.
The original proof's reproduction instructions require its exact candidate and
recorded third-diagnostic inputs. Packaging does not re-run those instructions
or certify a later candidate. The original syntax and proof records, generated
drivers, before-wrapper, patch and verifier source are all included.

The new manifest excludes only itself and records both stored and decoded
lengths/SHA256. Its source inventory also binds every original scratch byte
stream. No product HTML, private saves, APK or archive ZIP was added. Actual
Chromium coverage, required PR gates, native Android/WebView integration and
TalkBack remain separate; no browser PASS follows from this finite proof.
