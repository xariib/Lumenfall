# Wisp card redesign — development history

Historical checkpoints; current status remains in the task document.

## Current checkpoint

Research completed; three primary images inspected. Baseline checkout and PR63
overlap checked. Implementation and checks are described below. Physical phone,
TalkBack, exact WebView60 DOM and human design acceptance remain unobserved.
No new binding project rule is proposed.

20 November10:33 checkpoint: implemented portrait-led roster, short names,
level/rarity/DPS and Empower/Manage; one flat management view, no Wisp-tab
accordions. Bonds moved below roster as a static section; compact Formation
controls retain presets, all Active identities and pending rebuild status.
Source e378f552f2b09cfd96bc0166e761ece713b8b1185aa9f3afcc79474495a4330a.
Current browser matrix1152checks/12profiles PASS (320/390/430px,100/200percent
text, both motion settings), real keyboard/touch purchases, exact state/scroll/
saves/navigation and hint deep links. Native navigation guard removal fails
Space input-time refresh as intended; original guard PASS. Comparison to released
148 protects636 unchanged functions and all catalogs/non-function core code;
only8 presentation functions plus3 view helpers differ. This is scope-specific
evidence, not a new permanent global mechanics freeze.
Next: reconcile existing tests from disclosures to explicit Manage navigation
without dropping purchase/persistence/cap/focus checks; source-bound offline
reference and required CI/native/integration/APK delivery remain pending.
Current local candidate is not delivery; public remains0.2.148.

20 November11:01 checkpoint: final product8927afb9dac6104e54d57863cb7c4ea66e06439e67e39f850cebee4b36e988f8.
The focused matrix1152checks/12profiles passes on these bytes, as does the old
compact suite42570checks/18profiles. The native navigation guard control fails
the intended Space input-time-refresh assertion with clean teardown. Source
syntax/IDs and636-function/core preservation pass. The independent one-second
offline replay reproduces all four historical VM windows, agrees with original
browser rewards, and verifies current whole-window save endpoints against four
independent8h replays; every non-HP field exact and HP within original two-ULP
bound. Rebound only current golden source digest; historical fixtures unchanged.

Existing tests now explicitly visit each Wisp with Manage rather than assigning
details.open. Kept original prices, caps, native transactions, exact full-state/
both-slot, focus, one-pixel scroll,44px, color/contrast, runtime-error and timing
checks. Role/formation tests pass758/433checks across12profiles; Resonate passes
12profiles. Those three receipts were663d0898 before the final focus fix; final
integrated CI must rerun them. Native purchase/scroll suite3277checks passes on
8927afb9. Original embedded four layout cases and corrected p2-02b-wisp-hierarchy,
bond-text-contract and wisp-upgrade-display pass. An initial invocation used an
unknown scenario name; corrected names pass, no scenario removed. Old tests
found actual role clipping, Auto-Empower/header movement and disabled Empower
fallback navigation: fixed in product, preserving checks. No deadline relaxed.

Android acceptance now uses real centered trusted Manage/Back touches for all
eight Wisps, records selected visible upgrade geometry/effects, then natively
reopens Ember and performs the original real Ability purchase. Explanation is
static and must remain visible after purchase. Receipt guard requires all eight
native visits and returns; tooling positive/missing-visit controls pass.
Installed APK verification is pending, not inferred from browser results.

Changed areas: targeted index.html presentation; existing behavioral navigation
fixtures; new focused matrix/core preservation evidence; current offline binding;
Android navigation acceptance/receipt guard and its tooling controls; existing
existing required compact Wisp driver adds positive matrix and causal navigation negative control.
Shared fixtures hash3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2
unchanged. Full product diff self-reviewed; no independent human review claimed.
Next: publish checkpoint, PR and required CI; fix any failures, integrate exact
head, rerun integrated gates, deliver signed APK/update and retain limitations.

The local OAuth credential lacks workflow scope; an attempted workflow edit
was rejected on push. Kept the workflow byte-identical and attached the focused
positive/negative checks to its existing compact-card driver instead. No gate
was bypassed; the unpublished local commit was amended before publication.

20 November11:09: PR65 at7fe93b01. Private signed build44715402119 passes all
Android upgrade/updater/retail/native checks; no public release from this run.
PR Windows/Linux scroll, Lab, Comet, Tree, migration and isolated offline pass.
Pre-merge stopped at a chronology setup that had not entered Manage; permanent
UI lacked closeWisp in its secondary bridge; shared glyph gate still expected
full roster names and mutated superseded CSS. Fixed setups, kept assertions,
and proved new grid collision control fails its intended glyph intersection.
Shared layout6985checks/12profiles and all three causal CSS controls pass at8927.
Permanent506checks/18profiles and chronology pass after setup repair; pending
formation layout, accessibility control and reconstruction cases pass as well.

Serial affordability26832checks/12profiles and original red/stale-Resonate
controls pass at8927. The first parallel local attempt reached its unchanged
240s deadline without receipt; the serial rerun resolved it. Upgrade-state checks
found a real CSS specificity regression: the new first-section divider override
removed completed Rarity's top gold border. Restricted it to non-completed
sections; all15348upgrade-state checks/6profiles pass on final product
4ccf543feabfa1a927138af59b8bb0d17b5fda456ad02c7fd797c4ad473ad7a3.
Independent four historical/four current one-second windows and whole-window
comparison regenerated PASS for4ccf;636 protected functions/core still exact.
Earlier failed runs/receipts retained. Next: push repaired acceptance fixtures and
gold border, complete exact-head CI, integrate, exact-main9gates/public APK.

20 November11:23: all updated shared-UI checks pass at4898b539/4ccf543f.
Tree rerun passes unchanged after an Input.dispatchTouchEvent deadline in its
twelfth profile; full core/price/migration checks had passed. The Lab clarity
native slot selection failed once, then passes unchanged on rerun. No Lab code,
timing, assertion or fixture was changed for that result. Wisp Linux had two
pre-app Browser.getVersion timeouts and one Runtime.evaluate timeout after3233
checks; Windows passed. Retain all attempts, rather than treating them as passes.
Aligned only the Wisp test driver with established automation/shared-memory flags
and Runtime/DOM agent initialization from CODEX_START; captured browser stderr.
Kept15s CDP/90s scenario/300ms setup deadlines and one-pixel/full-state assertions.
Updated driver passes3277checks and setup race positive61checks/two causal
negative controls; original anchor/focus/periodic controls still fail as intended.
Product remains4ccf543f; independent reference/core proof need no rebinding.
Private149 evidence saved under ../qa/wisp-card-redesign-001/private-149/; it is
7fe93b01/8927afb9, before the gold-border-only fix, not final release acceptance.
Next: publish driver fix and finish all exact-head/integrated checks and public
APK. Current PR test completion and physical/Google verdict remain open.

20 November11:49: e7098985 passes eight workflows on the first attempt,
including both Wisp OS jobs and shared UI. Pre-merge reaches settled-screen
formation-bonds-mobile, where compact preset44px becomes43.77997px during the
existing scale(.995) entrance animation at430px/normal text. Reproduced locally
with the unchanged44px assertion; kept diagnostic geometry in its message.
Raised only preset minimum to45px; no measurement wait/threshold was changed.
The original native12-profile scenario now passes; roster cards remain175px.
Product f35113b0f2e194288cc02d63ae0e8bd87ca29191a19c491f7e27b7be30fdf193.
Independent historical/current one-second windows, whole-window comparison and
636-function preservation regenerated PASS. Next: exact-head CI, integration,
exact-main validation and signed public release/update; no public change yet.


## Before continuous touch-target correction

## Current checkpoint — 20 November12:16

Implementation complete; required validation/delivery still in progress. Main
remains f998d308/public0.2.148. Worktree C:/lf-wisp-cards, branch
feature/wisp-card-redesign-001, PR65. No other checkout or PR63 changed.
Prior candidate b9346225 passed eight workflows; pre-merge reached
Endless mobile guidance and found its test reading roster help while management
was open. The test now installs navigation fixtures on the roster, enters Manage
explicitly for upgrade inspection/native purchases, and returns for guide checks.
All889checks/72cases/12profiles pass, retaining prices, gates, actual keyboard
spend, focus, text fit and exact complete-state/both-save purity.

Also fixed a real route: a global Formation hint from an existing Wisp manager
now returns to the roster before focusing its target. Focused regression proves
the Formation target is visible and both saves/state stay exact. Quick53checks
PASS; original input guard control fails its intended Space assertion, cleanly.
Full current matrix1176checks/12profiles PASS. No threshold/deadline or
required scenario removed. Product SHA256
09a523bcbeb816e33f1552e80f5926c6b124ff1b513bd75940290f1c96ffc6a0.
Independent four historical and four current one-second8h replays plus current
whole-window comparison regenerated PASS.636 protected functions/catalogs/core
remain unchanged from148;8 presentation functions and3 helpers differ.

The roster remains175px at320px normal text; preset minimum45px retains44px
through its scale(.995) entrance. All Wisp expanders are removed. Existing
purchase/cap/prerequisite/red/gold/persistence/accessibility assertions remain.
Earlier actual issues (role wrapping, live header/Auto-Empower movement,
disabled Empower fallback and completed Rarity border) were fixed in product.
Wisp native driver uses established automation/shared-memory flags and explicit
Runtime/DOM agents, with stderr diagnostics; original15s/90s/300ms limits kept.
Windows/Linux scroll and all causal controls pass. Shared fixture SHA256
3f7ca9f5c74034cd42ac242385f62d94776feb5e26e98be7f7059baadaeae8f2 unchanged.

Private signed Android149 build44715402119 passes native Manage/Back for all8,
real Ability purchase, five-Wisp migration, cold save upgrade, updater and retail
launch. It is7fe93b01/8927afb9 before the later border/preset/hint fixes, not final
acceptance or a public release. [Private evidence](../qa/wisp-card-redesign-001/private-149/identity.txt).
[Local evidence](../qa/wisp-card-redesign-001/local/preservation.json),
[CI chronology and failure history](../qa/wisp-card-redesign-001/DEVELOPMENT_HISTORY.md).
Actual Dribbble images and mobile/Android screenshots were visually self-reviewed;
no copied reference artwork, independent human review or new binding rule.

Next: publish current fixture/hint fix, complete exact-head nine workflows and
190+1 cases, integrate PR65 with expected head, dispatch all nine on exact main,
then signed public APK/update and anonymous feed/byte verification. Save final
evidence/status in GitHub. Physical phone, exact WebView60 DOM, TalkBack, human
design/pacing acceptance and Google harmful-app verdict remain unobserved.
Do not archive or claim full external acceptance; no questions/renewed permission.
