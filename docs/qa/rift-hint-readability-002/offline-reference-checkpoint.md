## Independent offline reference correction

The full stateful run later reported `offline-catchup-ui` and
`offline-catchup-legacy-dom` failures before those drivers started a browser:
their unchanged source-binding guard still named the earlier `bbbc27b1`
product. The reference update was missed during the HTML change. This is a
required gate and is not waived because the UI slice preserves mechanics.

Executed `node tests/behavioral/offline-catchup.cjs --generate-swift-golden`
against exact final `8d957895` source. The original archived oracle input
was materialized with its pinned original Git blob verified byte-for-byte.
All four independent sequential eight-hour windows retained identical kills,
Ascends, Prisms and complete state SHA-256 values. Only `sourceSha256`
changes in `offline-swift-current-golden.json`.
[Regeneration proof](offline-source-binding.json).
The unchanged source-bound engine probe also passed on Node 24.19.0 (369
batches); this does not establish Chrome60 engine or Android DOM acceptance.

The same existing source-binding requirement is now checked just after CI
source validation, before the long gates. Both original offline browser
cases, their guards, all state/reward assertions and deadlines remain intact.
No product file changes for this correction. The current full run continues
to retain its actual failures; it cannot count as passing acceptance.

The environment restart removed the prior checkout's external Git metadata.
Reattached this worktree to an independent clone of exact `5b2d1a6` under
the current workspace; its tree matched `b3b3b349` and all working changes
were retained. This recovery does not restore archive code over the product.


