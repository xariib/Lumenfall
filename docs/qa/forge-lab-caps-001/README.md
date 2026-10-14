# Forge/Lab cap review — local baseline evidence

14 October 2026. Read-only proposal checkpoint on `local/full-debug`, continuing
`27f433da85d367d195fe743be29706d0f1905462`. Node24.19.0. Owner self-review only.
Source `f8f787fd4a520ec277b350f40c6caeefa519c48cb55ddeb9bbe486e4cd0200b6`.
No product/asset/test changes, cap decision or balance implementation.

[Proposal for decision](PROPOSAL.md); [full current catalog](CATALOG.md);
[catalog/reproduction/numerical receipt](catalog.json).

## Reproduction and checks

```text
node docs/qa/forge-lab-caps-001/catalog-review.cjs
node tests/behavioral/forge-expansion.cjs index.html --negative
node tests/behavioral/lab-expansion.cjs index.html --negative
node tests/behavioral/lab-expansion-boundary.cjs index.html --negative
node scripts/codex/check_context.cjs --task docs/tasks/FORGE_LAB_CAPS_001.md
node scripts/ci/validate_source.cjs
node docs/qa/rift-theme-label-001/verify-preview.cjs
git diff --check
```

The source-bound review uses the existing complete-game Forge/Lab harnesses
(presentation/timers/storage isolated). It reads live catalog definitions,
executes the current cap eligibility and real rejected purchases/starts, and
asserts no state mutation on refusal. It extrapolates raw-level price/work
functions without changing their catalog caps; proposed effect factors are
explicit calculations of the current per-level rates, not implemented effects.
The independent BigInt geometric price diagnostic is from the existing Forge
oracle; it records differences instead of rewriting old prices.

- Catalog/reproduction:403 checks PASS;20 active Forge/20 active Lab,35 current
  capped entries reject further purchase/start without state change; five Lab
  foundations are uncapped. Product hash unchanged throughout analysis.
- [Forge baseline](forge-baseline.json):9,315 assertions/25 causal controls PASS.
- [Lab baseline](lab-baseline.json):2,465 assertions/10 causal controls PASS.
- [Lab reward/purchase-boundary baseline](lab-boundary-baseline.json):2,344
  assertions/5 causal controls PASS. All receipts use the same exact source.
- Actual task context/startup links/budget, source syntax/IDs/lifecycle and
whitespace validation PASS before saving the proposal checkpoint.

The existing suites cover current paid levels/refunds, old/default/raw over-cap
saves, cap/queue boundaries, seven paid records and speed, actual purchases,
backup/recovery/Ascend, exact debits, live/offline and purchase chronology. They
are **baseline** acceptance for existing behavior. They do not verify an unchosen
cap extension or prove Android or human pacing acceptance.

## Findings and limits

No demonstrated baseline assertion failure in these scoped suites. Inherited
Prism contract deadline, Windows standard dump-DOM/POSIX tooling, final combined
full/required CI and Android/device/WebView60/textZoom/TalkBack remain pending.

Unrelated existing numerical finding: original Arcane/Conduction generic bulk
prices have eleven/thirteen ≤10 price queries respectively with a one-unit
difference from exact rational geometric ceil (e.g. Arcane two levels quoted
39,001 L/313 S versus rational39,000 L/312 S). Existing exact quoted debits still
pass; this is not a new task regression, and old prices are unchanged. If a
larger cap creates newly reachable discrepant queries, cover and handle those
in that chosen extension without silently repricing prior purchases.

Costs/times are formula endpoints under disclosed assumptions. No received
private user save is read or changed. No campaign time-to-afford or native
acceptance is claimed. Playable preview remains the accepted game at
[localhost](http://127.0.0.1:4174/index.html). Current index.html/fonts/branding
refreshed in ignored mobile/www; all 15 source/staged/HTTP assets verified with
the existing read-only preview verifier. This task's copied
[manifest](preview-assets.json) preserves those checks. App opening returned
queued; actual visible-tab inspection is not claimed.
No remote, APK, signing, archive or automatic chat action.

Next: user chooses specific cap proposal; record that decision before product
edits. Final acceptance stays OPEN until agreed implementation/checks are done.
