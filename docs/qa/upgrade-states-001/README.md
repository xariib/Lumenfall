# Upgrade states — candidate evidence

Product SHA256: `3998ae3b995f84121a212ede9d0b10db836abb345e9b227d9b3239090b5a13a4`.
Baseline main: `b075cfba`. Node24.22.1, Chrome for Testing/headless shell157,
Windows. Self-review only; no physical phone, exact WebView60 DOM or TalkBack.

The [final browser receipt](browser-runs/final/receipt.json) passes15,252
assertions across320/390/430px and100/200% text. It covers all current Wisp,
Forge, Lab, Tree and Astral upgrade families, every insufficient currency,
disabled purchase attempts, live requirements/wallet refresh, independently
capped Wisp components, all capped Masteries and locked catalogues. Disabled
purchase and passive refresh comparisons preserve full state/both saved slots
within the operation's JS turn. Actual purchase/save functions stay intact.

Causal defects are caught at the intended assertions with normal shutdown:
[gold border](browser-runs/final-control-gold/receipt.json),
[locked price](browser-runs/final-control-lock/receipt.json),
[red shortage](browser-runs/final-control-red/receipt.json).
The existing required `upgrade-affordability.cjs --negative` CI entry point
retains its original tests/two controls and additionally executes this suite
and all three new controls. No workflow or acceptance gate was removed.

[Canonical offline replay](canonical-offline-current.json) uses the original
`offline-catchup.cjs --source index.html --generate-swift-golden` entry point.
All four complete endpoint hashes match main exactly, including722/618/1161/678
kills and zero automatic Ascends/Prisms. Only source binding changes.
Other receipts here retain the exact source tested; transient candidate hashes
are not represented as final-source acceptance.

Original failures remain under `browser-runs/`: initial Edge startup, fixture
mistakes, old locked-price assertion, genuine CSS precedence failures, capped
Mastery guidance crash, and Windows browser startup/shutdown failures. The first
alternate offline helper also used different endpoint accounting; the canonical
replay above resolved that diagnostic without changing expected endpoints.
The rejected initial push lacked OAuth workflow scope. The final change uses
the existing required test gate and leaves workflow files unchanged.

Selected final screenshots: [gold at100%](wisp-gold-320-1.png),
[gold at200%](wisp-gold-320-2.png), [Lab at200%](upgrades-320-2.png).
Visual self-review observed static gold borders and readable red prices.
GitHub CI/integration and signed Android build/delivery are pending.
