# Shared UI Diagnostic003 — independent browser subaudit

**PASS for this diagnostic candidate.** This review reads original Chromium
results; it does not execute the game or establish final PR integration approval.

Candidate `b11567aac6a2d52145fe86c522b36fb559062cf9`, run `38111828759`,
artifact `11691069774`, source `38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f`
and driver `a2d4346daa8da30d61ef39135cb22399fc7b9b3cce40da9813d70c1fbcdf058c`
are bound to the separately frozen original raw package.

## Actual result and reviewed scope

- Original normal process: **6,985 checks, 12 complete profiles, exit 0**.
  Widths 320/390/430, CSS root fonts 16/32 px, both motion preferences.
- All eight actual Wisp identities in every profile: 96 rows, 192 immediate and
  settled observations, 5,736 glyph observations and 1,536 clipping-owner records.
  The review retains horizontal identity/header bounds, actual clipping ancestors'
  inner client boxes, card/main/viewport bounds and all relevant overlap checks.
- 84 native action rows include 48 Settings actions, 12 Wisp-tab actions and
  24 actual last-Wisp refusals (12 touch, 12 Enter). Every before/immediate/settled
  comparison preserves complete live state and both exact raw save strings with
  no save writes. Settings returns the same gear node; refusals retain the same
  native Bench control and original viewport/scroll position.
- All three exact CSS-only inversions failed for their intended geometry cause:
  brand 1,176 checks / 2 completed prefix profiles; Wisp 1,268 / 2; toast 1,699 / 2.
  The assertion processes exit 1 and Chrome itself exits 0, with no application
  runtime, readiness, font or timeout failure substituted for the intended cause.
- All **72 normal screenshots** and **3 causal failure screenshots** were directly
  viewed by the reviewing agent. All 118 original PNG bodies are hash-bound
  (116 unique hashes). The other 43 negative-prefix PNGs were not separately
  visually reviewed; duplicate groups and coverage are explicit in the detail.

The brand inverse overlaps the gear by 22.40625 px horizontally; the normal
320/root32 wordmark retains a 0.640625 px glyph-box gap. The Wisp inverse puts
two Starcaller glyph boxes under Bench; the normal narrow layout moves Bench
to its own row. The toast inverse creates 17 px of adjacent line-box overlap;
normal enlarged leading leaves 1.03125 px between the two glyph lines.

## Files and original-byte retention

`acceptance.json` is the compact conclusion. `browser-subaudit.json.gz` is the
complete detail; `causal-geometry.json.gz` records the representative positive
geometry and all three inverse causes. Both are lossless gzip, with original
and stored byte counts/hashes in `compression-map.json`. `viewed-paths.json`
lists the 75 directly viewed original screenshots. No PNG or original raw
report is rewritten or copied into this review package.

`audit-raw.cjs` reproduces the arithmetic and identity review against an original
raw directory, without launching a browser or game. Run only in a fresh copy
of this review directory because it emits the two uncompressed JSON details.
`audit-execution.json` preserves the actual successful local read-only audit
command/result. `parser-development.json` documents one corrected expectation
in this new audit parser: the native Wisp navigation button is `nav-spirits`,
not an empty id. That parser refusal was not a product, driver or CI failure.

The frozen raw dependency is the sibling `../raw/manifest.json`, SHA256
`7f84345e2acdcd75b7ec394017d14205286ced7d3d1fb7efee6f15f87078ab07`.
Every referenced original file has a byte count and SHA256 in the complete
detail. The raw archive/API/source audit is owned separately by the CI agent.
The final closed inventory of this directory excludes only `manifest.json`.

## Limits

This is successful diagnostic evidence on this exact candidate. All required
final PR gates and postmerge checks remain separate. Ambient `setInterval` is
paused in the inherited transport; native RAF, fonts, startup timers and real
action handlers remain active. The captured startup traces complete naturally
within the original 10-second bound.

Range rectangles describe typographic metrics rather than raster ink masks.
Transparent line boxes may have visible font overhang; actual clipping owners,
card/main/viewport and control intersections are still checked. Physical Android,
WebView 60 CSS, native textZoom and TalkBack are untested. The ordinary fixed-height
F07 guidance remains the already documented separate readability follow-up;
it is not a fourth mandatory fix in this scope. These focused images do not
establish full Settings-body scrolling, whole-application contrast or arbitrary
private-save coverage. Original Chrome DBus/UPower/registration stderr remains
preserved and distinct from the empty application runtime-error arrays.
