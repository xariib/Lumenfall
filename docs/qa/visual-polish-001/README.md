# Visual review evidence

Baseline: `b2244773`. Candidate product SHA256:
`acea384ebd691b4cef0bb9c72b9db41a0dba17557404f51613ea8b2c31e73d6f`.
Node24.20.0, Windows, local Brave Chromium (version in startup receipt).
Self-review and automated tests; no independent human review claimed.

The targeted changes preserve the navy/gold/violet identity and every character
silhouette. Forge, Lab and trophy artwork gains material shading. Header artwork
has its own space, enlarged Lab text grows its banner, long Comet titles wrap,
Ascend consequences stack when necessary, and the Lab catalogue opens below its
complete sticky heading.

`visual.json` covers 16 viewport/text/motion combinations and six main screens.
`negative.json` proves the previous fixed-height Lab banner is rejected.
`scenes.json` binds the additional 23-creature/eight-Wisp sheets, six regions,
six cosmetics and three boss variants to the same source. The fixture seeds
progress in isolated browser contexts; it does not touch user saves.
`script-preservation.json` verifies the sole JavaScript edit is the catalogue
scroll target. Existing startup/touch, Lab and Ascend receipts are included.

Selected before/after screenshots are in this directory; complete captures and
attempt logs are retained in the feature worktree's ignored validation-evidence.
CI also uploads the complete visual run as part of Shared UI evidence.

Reproduce from repository root:

```sh
node tests/behavioral/visual-audit.cjs index.html validation-evidence/visual
node tests/behavioral/visual-audit.cjs index.html validation-evidence/negative --mutate-lab-heading
```

The second command must fail with `unclipped content` for Research at 320px/200%.
On Windows set LUMENFALL_QA_CDP_CHROME to the installed Chromium executable;
use LUMENFALL_QA_DOM_TRANSPORT=pipe for the main behavioral runner.
Physical phone, exact WebView60 DOM and TalkBack remain unverified.
