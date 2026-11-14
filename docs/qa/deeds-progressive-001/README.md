# Progressive Deeds evidence

Baseline main858d713f, source ce51bc14e82c41929483c6483684add0390690d92d181c8aa35a91336aad0ac8.
Candidate product 8505c177d642b372d69f8b56f568f581ea44709ab9d3f14c3d4aaa6505bd11ff.
Task: [DEEDS_PROGRESSIVE_001](../../tasks/DEEDS_PROGRESSIVE_001.md).

- `node tests/behavioral/deeds-progressive.cjs index.html`: 313 checks PASS.
- `node tests/behavioral/workshop-card-clarity.cjs index.html`: original417
  and focused313 checks PASS (baseline original417 PASS).
- `node tests/behavioral/lab-speed-controls.cjs index.html --clarity --evidence
  validation-evidence/deeds-mobile`: 1,070 checks PASS,36 profiles total. Includes
  all nine series/every transition, final completion, skipped rewards, exact
  pending-credit display, reload, full-state/save purity, native keyboard/open
  history and focus preservation, 320/390/430px,100/150/200% text, both motions.
  [Raw receipt](mobile.json), [inspected enlarged image](deeds-320-200.png).
- `node tests/behavioral/run.cjs --web-root . --scenario upgrade-effects-and-deeds`:
  1,071 existing eligibility, exact progress, one-time reward and purity checks PASS.
- Same runner, `inquiry-contracts`:237 checks/one causal control PASS;
  `forge-contracts`:6,281 checks/four causal controls PASS.
  `r3-destinations`:PASS, including current/earned Deed counters and navigation.
- `node scripts/qa/verify-deeds-offline.cjs --write`: four independent8h windows,
  115,200 one-second calls PASS. Every released state digest/reward tuple remains
  exact; only the golden file source binding changes. The obsolete original
  generator's aggregate assertion failed; see task for disposition.
- Source syntax, task context and `git diff --check`:PASS.

Local Node24.22.1, Windows, Chrome157.0.8103.78/V8 15.7.112.43. The restricted
browser attempt failed readiness; the final driver passed outside that sandbox.
Self-review only. GitHub CI/integration/APK evidence pending. Physical-phone,
exact WebView60 DOM, TalkBack and human visual acceptance remain unverified.

Main7f149b89 currency-header integration: combined product
d58a8edc12f0ed340b8fbb1126bb3eb139bfbe328119743201deb3e7bdc3c7fc passes313
focused/417 original core checks and548 Deeds mobile checks across18 profiles.
[Combined receipt](integrated-mobile.json), [combined enlarged image](deeds-320-200-integrated.png).
The only merge conflict was the golden source hash; endpoint values remain exact.
