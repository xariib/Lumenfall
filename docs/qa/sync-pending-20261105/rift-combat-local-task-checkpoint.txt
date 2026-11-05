# Rift combat layout

User request (4 November 2026): put enemy health beneath its name on one line,
make backward/forward buttons prettier, remove the -10 button, and relocate
the Theme label so it cannot cover Wisp attacks.

Owner: this chat. Baseline: PR35 head `278bb66920a67a26d984ea13181480ca2f9baa5b`.
Isolated branch/worktree: `feature/rift-combat-layout-001` / `rift-combat-layout-001`.
PR35 remains open with uncommitted evidence in its own worktree; preserve it.
Canonical main was `29dbb1e9` at startup. This change depends on PR35's visuals.

Scope: compact enemy readout above the enemy artwork, matching chevrons,
previous/next navigation only, theme caption in the Rift header. Preserve
manual Farm/Push, boss skipping, saved frontier, all cosmetics, combat, saves,
progression and the prior Lab timer change. No balance/schema change/new rule.

Acceptance: one health line below name; header label clear of attacks;
44px arrow hit targets; bounds, native navigation, reload and rollback;
320/390/430px, short/tall screens, enlarged text and reduced motion;
existing affected contracts, source/context checks, required CI and integration.

Status: implemented and locally verified; GitHub CI/integration and Android
delivery pending. Main/PR35 remain unchanged; do not overwrite that worktree.

Implementation: one 16px health row beneath the name; art and cosmetic effects
reserve the top readout space, retaining the full 120px minimum attack target.
The theme label sits in the Rift header. Gold SVG chevrons retain 44px targets,
native disabled/pressed/focus behavior and accessible names. Removed -10 markup,
binding and allowed offset; one-step navigation/save transactions are unchanged.
The attack button describes both enemy name and current HP to assistive technology.

Node24.20 / Chrome156 local checks:
- Baseline navigation:101 PASS; candidate navigation:88 PASS, including removed
  offset rejection, boss skipping, frontier, reload and failed-save rollback.
- Progression/Farm:304 PASS; source validation and task context PASS.
- Actual navigation/Workshop input:470 checks over18 width/text/motion profiles
  PASS (before the final visual spacing fix; native input semantics unchanged).
- Final spacing: Rift mobile12 fresh/dense/boss profiles including640px height
  and24px safe areas PASS; Comet mobile6 text/width profiles PASS; cosmetics170
  samples including negative controls PASS; visual unlock quick122 checks PASS.
- The final change after those visual checks only adds aria-describedby; final
  checks and exact-source remote CI follow below. Self-review/automation only.

Initial in-flow readout overlapped the formation on a dense640px/safe-area screen.
An absolute readout and a reserved42px artwork inset fix that without reducing
the120px attack target; the same unchanged mobile overlap assertions now PASS.

All JavaScript outside four explicit -10-control removals is byte-identical to
PR35, verified by [scope checker](../qa/rift-combat-layout-001/check-script-scope.cjs)
and [receipt](../qa/rift-combat-layout-001/script-scope.json). The accepted offline
oracle's rewards and state hashes are unchanged; only its source binding changes.
A redundant full paired replay was stopped before producing results; no replay
PASS is claimed. Full CI retains the original independent offline assertions.

Changed: index.html, affected navigation/layout/cosmetic/browser/native acceptance
expectations, oracle binding, this task and QA evidence. No CI gate removed.
Next: publish isolated PR, pass exact-source CI, integrate after PR35, build and
verify signed Android. Physical phone/WebView60/TalkBack remain open.

Published [PR36](https://github.com/xariib/Lumenfall/pull/36), candidate
`429a89a57fb1bdfd5728eb0c3386a5dec5d4d653`; final HTML SHA256
`d1551e684bc481c30e59149be2653b38401abb5f147215b3602e13098f02f6c7`.
Exact final source also passes reduced-motion mobile profiles and current
name/HP accessibility-description assertions. Seven PR workflows are running.
[Signed test build](https://github.com/xariib/Lumenfall/actions/runs/41844517303)
dispatched with publish=false. Main remains29dbb1e9 and PR35 remains open.
Keep the tested head immutable while CI runs; final receipts are local pending
integration. Next: inspect CI/build results, resolve introduced failures, then
integrate after PR35 and verify the signed artifact. No release/merge claimed.

Cleanup command was rejected with exactly "blocked by policy"; no specific
reason or supported override was provided. It was not rerouted. Remaining under
`C:/Users/CustomCodings/Documents/ChatGPT/Lumenfall/rift-combat-layout-evidence`:
`www/`, `paired-replay.cjs`, `replay.json`, `replay.log`. No worktree or user
deliverable was targeted. Staging ownership is recorded in OWNERSHIP.txt.
