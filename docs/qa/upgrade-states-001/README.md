# Upgrade states — candidate evidence

Current product SHA256: `e174cec921c5c7e0c6c51d5f5b9a505537f9a04d2db97ca90bfbe98c31cab909`.
Baseline main: `b075cfba`. Node24.22.1, Chrome for Testing/headless shell157,
Windows. Self-review only; no physical phone, exact WebView60 DOM or TalkBack.

The [initial accepted browser receipt](browser-runs/final/receipt.json) passes15,252
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
Those receipts bind candidate3998, before the additional paid-cap styling.
Current [Windows paid-cap run](paid-cap-windows.json) passed15,264 assertions
but failed shutdown, so remains FAIL. Its [canonical replay](canonical-offline-final.json)
preserves all four exact endpoints. Current-head Linux acceptance is pending.
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

Initial [main CI log](ci-initial-main.log) stops at the unchanged32KiB startup
gate. Duplicate12 November summaries already preserved in the linked history
were shortened; the largest required task now totals31,954 bytes. The local
[existing required-entry log](windows-required-entry.log) records its unchanged
240s timeout/no receipt; this does not count as an accepted run. All initial
failures remain visible while current-head Linux CI is pending.

[Old plain-cap assertion](ci-plain-cap-assertion.json) was caught by Linux CI.
The updated check strictly requires gold for capped ability modules and retains
plain surfaces for unfinished ones. Its [Windows retry](wisp-layout-windows.json)
passes2,204 assertions/one profile, then fails initialization/close; no full PASS
is claimed for that run. Required assertions/deadlines remain intact.

[Resume-copy regression](ci-resume-copy-regression.json) was introduced when
sharing price rendering. Exact original free-resume wording and normal
price-only confirmation markup are restored; the original test is unchanged.
The [Windows retry](lab-simple-windows.json) passes all18 Lab profiles, then
fails an appended menu-offset assertion. Baseline/current comparison and
current-head Linux acceptance remain pending. This run is retained as FAIL.
