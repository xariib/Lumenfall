# Visual review and polish

User: "Now I want all the visuals to be checked. Improve graphics where it is needed."

Owner: this feature chat. Baseline `b2244773` on `feature/visual-polish-001`
in the isolated `visual-polish-001` worktree. No open PRs at startup; other
feature checkouts remain untouched. Current main includes Lab slot challenges.

Review Rift creatures/effects, Wisps, Forge, Lab, Ascend/Tree, Deeds, navigation,
startup and dialogs. Preserve the approved crystal identity, mobile geometry,
all progression, saves, prices and no-touch-highlight contract. Improve only
observed visual weaknesses. Existing SVG/CSS artwork remains the asset system.

Acceptance: inspect rendered screens at phone widths and enlarged text;
exercise relevant existing layout/accessibility checks, reduced motion, source
validation and required CI. Review the complete diff. Record screenshot evidence,
integration and Android delivery status honestly; physical-device acceptance
cannot be inferred from browser screenshots.

Status: integrated via PR25; Android delivery and device acceptance pending.
No new binding rules. The active bottom label remains hidden as explicitly
requested in NAV-001; branding, character art and combat geometry are preserved.

Findings and fixes: enlarged Lab banner clipped its title; Comet names overflowed
on a wide viewport at double text; Ascend columns could overrun a narrow card;
chapter art crowded copy; opening the Lab catalogue partially covered its first
category. Responsive bounds/wrapping and scrolling the header container fix these.
Added small SVG material details to the Forge anvil/hammer, Lab glass/liquid and
Deeds trophy, with no new raster downloads or animation.

Reviewed all six main screens, all 23 creatures/eight Wisps, six environments,
six Rift cosmetics, three boss traits, Luminous state, settings/encyclopedia,
Farm picker, daily reward, research catalogue, Tree, Comet shop and collection.
Source scripts are byte-identical after normalizing line endings except the
catalogue's scroll target; no simulation, purchase, save or balance change.

Local checks: visual audit 240 assertions/16 profiles PASS (320/390/430/768,
100/200% root text, normal/reduced motion). The old fixed-height Lab banner is
detected by a causal negative. Startup/touch30 cases, Lab controls452/18 profiles,
Ascend468/12 profiles, navigation contract, accessibility layout and offline recap
UI PASS. Existing Rift stacking PASS before the catalogue-only refinement.
The Windows Brave dump-DOM attempt timed out; supported pipe transport passed.
An initial offline UI attempt correctly rejected a stale source binding, then
passed after regeneration. These attempts remain in local validation-evidence.

Changed files: index.html, visual-audit.cjs, independent offline source binding,
Shared UI CI workflow, this task and its [evidence](../qa/visual-polish-001/README.md).
Browser screenshots are not physical-phone, exact WebView60 or TalkBack proof.
Next: dispatch exact-main release validation and verify Android delivery.

Additional acceptance: shared layout6,985 assertions/12 profiles plus all three
causal controls PASS. Independent one-second simulation regenerated with pinned
Node24.19.0 on both original baseline and candidate: all four complete endpoint
hashes and rewards identical. Earlier stored endpoint hashes differed from a
fresh baseline rerun; no candidate regression or expected reward change.
Git CLI push waited for unavailable authentication; use connected GitHub tools.

Publication checkpoint: [PR25](https://github.com/xariib/Lumenfall/pull/25),
head `7d9168188f28f0c0da53b8669bf8783666d61e5d`, tree
`b3840564c8e1c8c43a40eefcd1033806c7c99080`. The connector-uploaded Git blobs/tree
were checked against the exact local commit before moving the feature ref.
All seven required workflows PASS, including pre-merge run40967987534:
189 main + one isolated offline scenarios and runtime smoke PASS. Integration
`31b24d57967dbf63d7d0633f4e02abccd134a638` has exactly the same complete tree
as tested merge `abc170e59cb85dc30cdfa277236a6112711c49e1`. No review threads
or independent human review. Final [CI receipt](../qa/visual-polish-001/ci-final.json)
retains workflow/job results, scenario outcomes, source/tree and runtime identity.

Android workflow dispatch is absent from the GitHub connector. Browser access
reported disabled in Work settings. The user answered "I'll enable browser
access"; repeated checks through integration still report disabled. No APK was
dispatched. Retry browser access before integrated-main validation/build.
Do not change access settings or bypass the restriction. Preserve this task open
until delivery/acceptance is verified. Next: dispatch the six main workflows
required by scripts/ci/release-ci-gate.cjs, then build-android with publish=true
on the same main commit. Verify signing, installed upgrade and public bytes;
record physical phone/WebView60/TalkBack separately. No new binding rules.

References: [workflow](../project/FEATURE_WORKFLOW.md),
[brand](../../branding/README.md), [source](../../index.html).
