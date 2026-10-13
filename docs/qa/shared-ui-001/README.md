# Shared UI — candidate and regression evidence

The [task](../../tasks/SHARED_UI_001.md) and [complete acceptance plan](ACCEPTANCE.md)
continue item06 after accepted Comet merge fe2a7b32. Three CSS changes address
observed wordmark/Settings, Wisp class/Bench and toast-line collisions at narrow
widths with enlarged text. No game JavaScript, saved values or prices change.

## Preparation results

Source validation and diff hygiene pass. The first task-context check failed
with `Mandatory startup exceeds 32 KiB`:31,107 shared bytes plus5,272 task bytes
total36,379. The first shortened checkpoint was still33,060 bytes. Moving the
complete plan here and retaining a concise task brings startup to32,596 bytes;
the unchanged context guard now passes. Original inputs/results are retained
under `preflight-001/context-original/`.

The first diagnostic driver is SHA256
`da1b05466ec74394402f93733b9f665276b42ed87ff5fa1067554804b548f609`.
Its actual prepare-only run compiled the generated driver, complete bridge,
prelude and expressions and verified each exact source inverse. This was
syntax/preparation only; no browser or game acceptance is inferred.
The one120-byte identity-containment addition and prior bytes are preserved.

Independent read-only reviews of CSS, the final driver and CI receipt helper
found no remaining concrete blocker. CI-helper review found missing recovery
fixture/context bodies in its first archive selection; the corrected selector
reuses the accepted QA6 selection and retains the actual96/66 fixture inputs.
The helper preserves six unchanged original standalone commands' stdout/stderr,
because the prior large Full joblog could not be downloaded. The original
workflows and tests are unchanged. Review receipts are in `preflight-001/peer/`.

## First actual diagnostic

[Run38110447923](https://github.com/karahaNx/Lumenfall/actions/runs/38110447923)
on candidate9f6ff0ab passed the standalone step, then failed at113 browser checks
before completing its first profile. The new identity-container predicate
mistook a1px Cinzel typographic overhang for clipping. Original coordinates
and the directly reviewed PNG show no clipping or overlap. The product remains
unchanged; the driver repair uses the actual clipping boundaries. Revised driver
SHA256 `d95e30aa66b101bcfb8afcde023697e12acad581544964ece39a8304aa714abe`
passed one prepare-only check. Its exact delta and original bytes are frozen
under `repair-002/`; the original-data review is in `diagnostic-001-review/`.
[Exact diagnosis, raw identities and retained requirements](DIAGNOSTIC_001.md).

[Diagnostic002](DIAGNOSTIC_002.md), run38111030896 on33153db7, passed both320px
root16 profiles before the same visible font overhang reached a transparent
header boundary at root32. Its original result remains982 checks/2 profiles/
0 inversions, FAIL. Repair003 measures the actual clipping ancestors and
visible main region while preserving horizontal bounds and every overlap gate.
Its driver SHA256 is
`a2d4346daa8da30d61ef39135cb22399fc7b9b3cce40da9813d70c1fbcdf058c`;
one prepare-only check passed. `repair-003/` retains the exact source delta and
`diagnostic-002-review/` retains the original-data review of all15 images.

## Focused browser acceptance passed

[Diagnostic003](FOCUSED_ACCEPTANCE_003.md), run38111828759 on b11567aa,
passed6985 checks across all12 profiles and all three exact CSS inverses.
Independent raw/source and browser reviews passed. All84 native action rows
preserved complete state and raw save slots through168 comparisons, including
24 last-Wisp refusals. All72 normal and three causal failure images were viewed;
the remaining43 negative-prefix images are retained with explicit review limits.
Product and driver bytes are unchanged in the final documentation candidate.

## Final combined acceptance still pending

After debugging, run all five original required workflows and the new Shared UI
lane on the final candidate. Review their raw results before development merge
and fresh integrated checks. Main, PR102 draft and APK holds remain. Native
installed-app/WebView60/textZoom, physical Android and TalkBack are untested.
