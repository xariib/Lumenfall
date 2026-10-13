# Independent viewport review and two local Node checks

## Result and exact candidate

Both explicitly requested Node gates passed on uncommitted product SHA-256 `ccef4db42c2d2d5f91c68c0fa7c150bfa8115983249d276925c68613268846e3` (619,788 bytes), over local HEAD `3c931a26bbcf7b009dee03e7411ed41faeb971f8`, published tree `d11120bc250a6ac90fac1f5e598042a5572e5650`.

| Gate | Actual command, from Lumenfall-tree | Result |
|---|---|---|
| Tree core | `/opt/codex/runtimes/codex-primary-runtime/dependencies/node/bin/node tests/behavioral/tree-expansion-core.cjs index.html --negative` | PASS, 5,267 assertions, 28 assertion-killed negative controls; exit 0; empty stderr |
| Actual legacy engine | `/tmp/lumenfall-node830/bin/node tests/behavioral/tree-expansion-v8.cjs index.html` | PASS, 2,862 assertions; Node 8.3.0 / V8 6.0.286.52; exit 0; empty stderr |

The legacy driver parsed both nonempty inline scripts and ran 339 complete-IIFE instances, 94 price cases, 34 storage-fault cases and all 20 active Tree effect paths. Its runtime has no BigInt. Both drivers replace rendering functions with test adapters: these passes validate parsing and the economic/persistence engine, **not the new browser layout behavior**. No browser run or Android pass is claimed here.

The exact source, fixtures (`ab43604d…`), modern harness (`bcf080ce…`) and each test were unchanged across the two runs. Original stdout/stderr bytes and their hashes are preserved. The receipt records the real clock-tool UTC observations, actual commands, executable/runtime identities and dependency hashes. The runner invokes child processes directly with argv arrays; the raw JSON is not rewritten.

## Comparison and product review

The review compared current bytes against both published `HEAD:index.html` (`4e4707afca6672ea46aad03ebd05cd7341ad61d7316a9636fed6172dbfed96ef`, 618,571 bytes) and the still-staged prior diagnostic `:index.html` (`17d4ff66cc960f80200bbc7a640947d87bf1c8e2c216eea181761f036df5f806`, 618,689 bytes). Both complete small diffs are included. The published-to-current diff is 27 inserted and 2 removed lines, wholly inside presentation code/comments. No price, node, save, migration, party mutation, reward, timer or Auto-Ascend rule changed.

At current `index.html` anchors `captureControlViewport` (line 6770), `restoreControlViewport` (6779), `renderSpirits` (7323), `renderAscendSummary` (7781) and `renderNodes` (7816):

1. **Correction sign and anchoring:** record the visible focused control's viewport top; after replacement and focus restoration, read its new rectangle and add the residual top delta to `main.scrollTop`. A control moved upward by roster reordering produces a negative correction; taller content above it produces a positive correction. The post-layout rectangle already reflects native anchor compensation, so a native-adjusted position receives only the remaining residual. The old diagnostic's unconditional numeric Tree scroll restoration is removed.
2. **Correct scope and ordering:** the Wisp capture covers the entire `tab-spirits`, before Formation presets, Bond text, roster summary and reordered Wisp cards render. It therefore covers a Field/Bench control moving between groups and a focused Formation preset affected by the same render. Node-list restoration happens after list replacement and existing focus fallback; the later summary render separately captures the already-restored focus and accounts for summary-height changes. Hidden Wisp rendering after a Tree purchase has no eligible focus and cannot undo the Tree correction.
3. **Existing focus/fallback stays authoritative:** `replaceControlMarkup` (6788) still identifies the logical replacement from existing data attributes, focuses it when enabled, otherwise chooses the next enabled control or the root. New code does not change this selection. The existing final Wisp upgrade/details fallback runs before the Wisp viewport restoration, so the resulting visible summary is the object repositioned. A fallback within the same root is deliberately aligned to the previous control's position; focus that leaves the root is not dragged back.
4. **Hidden tabs and deliberate navigation:** capture rejects absent/unfocused roots, zero-size controls and controls fully outside the vertical main viewport. A hidden tab's zero layout rectangle prevents correction. `activateTab` still sets main scroll to zero after its summary rendering; returning to Battle retains the pre-existing scroll lock. This change adds no new focus call or focus-visible styling.
5. **Native Auto-Ascend is retained:** `renderAscendSummary` continues to save and restore exact numeric scroll only when focus lies in `auto-ascend-controls`. The native control creation/type-deferral code is unchanged. A focused native picker cannot simultaneously belong to `node-list`, so the new Tree correction is null on that path. The legacy picker identity/target/scroll assertions should stay unchanged.
6. **Legacy syntax/API scope:** the added code uses `var`, existing DOM containment/rectangle APIs, ordinary numeric addition and `scrollTop`. Actual V8 6.0 parsed it. It introduces neither modern syntax nor a new numerical/storage dependency; native DOM timing still requires browser evidence.

No additional concrete product defect was found by this read-only review. The parent-reported earlier diagnostic measurements (+110.9375 px with the old numeric guard; approximately unchanged viewport top after native anchoring; Aurora button at -255 px after Field) explain the failure mechanism but were not independently rerun in this task.

## Positional assertion implications

The pre-repair Tree mobile file's exact-scroll purchase assertions (diagnostic staged SHA `a2a90c83100daca4f7c770f48f681d55cb63ca75463d85385a3c9703ed89f4df`, original anchors 171/172 and 255) conflict with intentional summary growth or group reordering. They should continue to require the same enabled logical control, visibility, hit testing and stable viewport top immediately and after native frames. Main scroll remains useful raw evidence. The old mutant targeting `editingAuto || editingTree` no longer matches this product. The mobile owner has acknowledged this and owns the narrowly targeted replacement plus causal mutants; this review did not edit that file.

The unchanged-layout affordability refresh (old Tree mobile anchor 152), Formation pure rerender (`formation-autosave.cjs` 72/73), Auto-Ascend picker (`auto-ascend-target.cjs` 65/68/74/77), Prism picker (`prism-acceptance.cjs` 74/75), and original Forge/Luminous Tracking queue exact-scroll assertions remain legitimate. This product diff changes neither Forge/Lab rendering nor those controls. Old Tree card-fit/reachability and Battle scroll-lock assertions also remain required. Replacing the geometry assertion for a moving control does not authorize removing these other checks.

The concrete remaining browser acceptance points are the already planned immediate/settled summary and sixth-Wisp actions, without corrective scroll or focus between input and measurement; a same-layout no-drift control; preserved disabled/capped fallback behavior; and retained native Auto-Ascend identity/scroll behavior. `scrollTop` clamps at the actual scroll limits, so exact old screen position is only achievable when enough content exists on the relevant side; visibility/focus must still hold. Capture also intentionally depends on actual focus, so touch cases must inspect real browser focus rather than infer it from the dispatched action. Browser anchor timing and panel animation cannot be proven by the two Node suites.

## Files and limitations

- `core.stdout.json`, `core.stderr.txt`, `v8.stdout.json`, `v8.stderr.txt`: original process output bytes.
- `core.execution.json`, `v8.execution.json`: commands, runtime/test identities, exit status and parsed output.
- `acceptance.json`: compact acceptance and before/after source/dependency identity.
- `published-to-current.patch`, `prior-diagnostic-to-current.patch`: exact read-only comparisons.
- `run.cjs`: reproducible two-command orchestration, written only in scratch.
- `manifest.json`: byte counts and SHA-256 for this package, excluding the self-referential manifest.

No repository, staged index, remote state, fixture, product or test file was written by this task. No further test suite or browser run was requested or performed.
