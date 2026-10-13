# Comet second CI and isolated regression debugging

Candidate `8983898c17126f240a779eeeaca62cac39e11577` has complete tree
`a64abe5e7e84871961174ed2f54c1dad78e895b0` and product SHA256
`44112101936e150fd15f715c10568ce7283701440da1f15cc6e4eb6e887bb88e`.
Its actual synthetic checkout `4f05b74465f6f513ea2ae666143a7c4c361d78b2`
has the same tree and ordered parents `9f04aca7265b57d73edc98822f3bd89d85f1881d`,
`8983898c17126f240a779eeeaca62cac39e11577`.

This candidate is not accepted: Comet mobile and the full stateful suite failed.
The first isolated repairs change only the mobile driver. A later real browser
failure also identifies the protected-save warning defect recorded below, with
a separate product correction. No earlier failed result is relabeled as a pass.

## Actual engine and sibling workflow results

[Comet run 38098619894](https://github.com/karahaNx/Lumenfall/actions/runs/38098619894)
passed the complete core (10,490 assertions / 18 causal controls), independent
numerical (681,747 / 8), offline chronology (96,885 / 7), and actual Node8.3/V8 6.0
(1,362 checks / 255 complete-IIFE instances) steps. All 33 intended semantic error
messages and the complete reports were verified against the original job log.
The formerly failing Node20 run-token control now records its intended exact
reference-identity failure, and all later controls execute.

The raw Git commit object now independently recomputes to the synthetic checkout
SHA, retaining both correct parents. All 130 archived selected source blobs and
37 ZIP members match the exact candidate and API archive size/digest/CRC.

Lab [38098619891](https://github.com/karahaNx/Lumenfall/actions/runs/38098619891),
Forge [38098619860](https://github.com/karahaNx/Lumenfall/actions/runs/38098619860)
and Tree [38098619874](https://github.com/karahaNx/Lumenfall/actions/runs/38098619874)
all passed, including their actual mobile and V8 steps. Full
[38098619873](https://github.com/karahaNx/Lumenfall/actions/runs/38098619873)
passed cosmetics (168 samples), exact Prism numerical and currency UI gates.
The original stateful suite completed all 212 attempts across all 182 scenario
IDs: 210 passed and two failed. It finished at 01:13:51 UTC on 11 October after
42 minutes 35 seconds; this was not a hung or cancelled run. The failures were
`auto-ascend-target-contract` (`purchase gates/cost/default unchanged`) and
`p2-endgame-currency-utility` (`Comets must have a valid post-Rest-Stop Daily Quest
Refresh spend`). Both Chrome processes exited zero without timeout or runtime
errors, but the actual scenario assertions failed. The subsequent mandatory
negative self-test, runtime guard and browser smoke steps were skipped, so they
have no execution acceptance on this candidate.

Both original failure DOMs still show the actual startup intro. The old runner
waits for offline catchup, not startup completion. The Auto-Ascend contract also
uses the established harness freeze (`reloadInProgress=true`) before its raw
purchase click; its other actions already scope that artificial flag correctly.
Preparation therefore completes the real startup callback through the original
Skip control and adds the existing scoped reload/render/native-click pattern to
that purchase. The original price, target, progression and deterministic Refresh
assertions remain required. The endgame Refresh bridge is not blanket-unfrozen.
The final candidate must run both scenarios and all later gates successfully.

## Executed browser failure

The browser reached 795 checks, all twelve purchases in the first profile, and
then failed a `Runtime.evaluate` expression with `SyntaxError: missing ) after
argument list`. Zero of twelve profiles and zero of ten causal pairs completed.
The error occurs in the test's pending-Deed query, outside the product scripts.

The driver source used an escaped double quote inside a single-quoted JavaScript
string. That escape is consumed while constructing the expression, producing:

```js
document.querySelector("[data-deed="comet_first_command"]").textContent
```

The repair builds the selector argument through `JSON.stringify` and the existing
selector helper. The same actual element and visible pending-copy assertion are
retained. A parser inspection of the archived generated driver found 114 `ev`
calls: 82 statically resolvable expressions parsed, this one failed, and 31 were
runtime-dependent. Their original syntax failure and the corrected expression
are preserved separately. Runtime-dependent expressions still require real CI.

## Purchase geometry and the new causal observer

The first Auto-Ascend purchase now moves from top 433.40625 to 433.484375 pixels
both immediately and after settling: 0.078125 pixels, within the unchanged
one-pixel gate. Its exact purchase and same-card focus assertions pass. This
supports the scoped CSS repair at that observed profile; it does not substitute
for the remaining profiles or the unreached reversion controls.

The new held-touch diagnostic also records `active: false` after trusted
`touchStart`. Therefore the new, not-yet-executed CSS witness must not assume
that this phase is the button's actual activation phase. It now also records
geometry synchronously in a passive capturing click listener before the real
handler. The observer does not prevent events, await, mutate state, scroll, or
focus. Held-touch diagnostics remain visible as observed.

The CSS witness separately requires a trusted, active capture-phase sample; an
absent sample or inactive phase fails as a setup problem and cannot count as a
caught CSS mutant. Only then does it compare the actual computed transform
under the original and exactly reverted scoped rule. The original eight causal
pairs, all viewport/focus gates, the twelve profiles, and all semantic assertions
remain unchanged. The added pair still runs at both narrow text scales, making
ten required pairs. Real Chrome must establish this new observer's precondition.

## Remaining acceptance

An isolated diagnostic was published as commit
`c07504be27021308873c3a33aa5873153513c153` on
`qa/comet-mobile-repair-003` while Full898 continued. It changes only the repaired
helper and a new push-only mobile diagnostic workflow; the product and all old
workflows are unchanged. Run
[38099996222](https://github.com/karahaNx/Lumenfall/actions/runs/38099996222)
exercises the actual twelve profiles and ten pairs. Its separate result is
debugging evidence, not final feature acceptance.

That diagnostic passed the repaired selector and reached 837 checks, then
stopped before completing a profile at `trusted actual click failed primary
Meteor Ascend`. Its raw native touch events target an already disabled Meteor
button. The fixture sets current Rift 20 and stored Auto-Ascend threshold 20;
the established storage convention means clear Rift 19, so Auto-Ascend is
already ready and the command is correctly blocked. The intended command that
clears Rift 20 must use stored threshold 21. The independent payout oracle
remains `reward(20, ...)`; no Auto-Ascend product behavior changes. The helper
repair also retains the former threshold as a native-disabled/no-spend control
and adds explicit availability preconditions before the actual fault/retry.

The next isolated commit, `2edf302d9bfc51a31ff7c6ff31ae22ce866641c5`,
retains the same product and diagnostic workflow. Run
[38100599468](https://github.com/karahaNx/Lumenfall/actions/runs/38100599468)
passed that corrected fixture, the real primary-write failure, complete rollback,
retry and canonical reset. It reached 874 checks, then failed at the test's
hardcoded `Auto-Ascend command focus stays on command panel` assertion. Zero
profiles and zero causal pairs completed; the run remains failed.

The original browser receipt shows trusted Enter/click/keyup on Meteor, one
successful primary write and one recovery write, depth 20 to 1, exactly one new
Ascend, Prisms 1,000 to 1,014, charges 2 to 1 and recharge work 40. Paid fields,
the Auto-Ascend preference and stored target 21 are preserved. Meteor is enabled
in the new encounter, and both immediate and settled focus remain on that same
button. This follows the already selected interface: retain the activated button
when enabled; use the panel only when that action becomes unavailable. The
repair explicitly verifies the live plan and native enabled state before
requiring immediate and settled Meteor focus.

The viewport oracle must follow that same focused subject. The product's
`captureControlViewport(root)` scopes ownership with `root` but captures the
active element's top coordinate; it does not capture the root's top. The existing
disabled-command button-to-panel checks therefore remain unchanged. For the
enabled Auto-Ascend endpoint, the helper observes Meteor both before and after
the action and checks its immediate and settled position using the original
one-pixel tolerance and physical scroll-boundary rules. A proposed same-panel
oracle was rejected during source review before publication because it would
have measured a different contract. No browser pass is inferred from this
preparation or from the earlier failed runs.

## Actual protected-save warning defect

Isolated commit `e9cb5c1bed64e7c29914a93eb4e1f13169c93dcc`, still on product
`44112101…`, runs the corrected focus and viewport helper. Run
[38101280918](https://github.com/karahaNx/Lumenfall/actions/runs/38101280918)
passes those checks, the actual Auto-Ascend picker/toggles and all three paid
Refresh routes, then fails at check 968: `real protected-load warning observed
before cleanup`. No profiles or causal pairs have completed at that failure.

The malformed current-schema primary remains byte-for-byte preserved, along
with the valid recovery. The actual recovered wallet is 37 Comets and saving is
blocked with the correct reason: `Primary Comet history is invalid. The original
save is preserved; restore a valid backup to resume saving.` However, the visible
toast is the generic offline-retry message. This is observed before the test's
readiness cleanup, with no runtime error; it is a product warning-ownership bug.

The profile's original timestamp makes this a real offline return. Initialization
first announces the specific protection reason. Offline replay then cannot save
because persistence is correctly blocked, and the return callback overwrites
that reason with `Offline progress is safe. Return again to retry, or restore a
backup in Settings.` Repeating the same return cannot resolve the malformed
primary. The relevant recovery message must remain visible.

The product repair lets the existing `announcePersistenceStatus` owner explicitly
repeat a blocked warning, and calls it from a failed return when persistence is
blocked. Ordinary offline failures retain their original message. Reannouncing
also handles a longer replay after the original toast has expired. This changes
presentation only; save bytes, simulation, purchase gates and transaction rules
are unchanged. The exact patch is 123 added bytes; the new source is
`1c5fb3923038ae06b4e9c233742f39ccbd067f26ddb55af0368ce234acca97f3`.

Diagnostic commit `f972bb217e9f896e708553718f48d79b31616ad8` contains only that
product delta over `e9cb5c1…`, with the same helper and diagnostic workflow. Run
[38101919698](https://github.com/karahaNx/Lumenfall/actions/runs/38101919698)
now observes the correct, visible protection reason and both exact original save
slots. It reaches 973 checks and fails the next assertion, `invalid actual backup
import preserves live state`. Zero profiles and causal pairs have completed.

The original raw state comparison differs only in `lastSeen`, by 583 milliseconds.
Opening Settings / Save Backup calls the existing `currentSaveBackup()` owner,
which legitimately saves the current state before exporting it. The test took
its baseline before opening that view, so it attributed the export timestamp to
the subsequent rejected import. The actual invalid restore is rejected by its
decoder before mutation. The helper now takes its complete state and raw-slot
baseline immediately before clicking Restore, after opening the backup view
and entering the invalid text. Both original exact equality assertions remain,
including `lastSeen`; no field is ignored. A passive receipt separately retains
the before-opening, after-export, before-Restore and after-Restore states, raw
slots and write events. All other profiles and ten original causal pairs remain.

## Combined isolated diagnosis and warning regression control

Commit `258f49e3bc1174a5d0c437a0573ebcf40eebaf70`, sole parent `f972bb2…`,
has complete tree `1130b1b857db5433fc8e89423fa3a71e97edcdc9`. It retains the
new product and runs the corrected helper plus the three original-scenario
adapters described above. Its push-only diagnostic
[38102667390](https://github.com/karahaNx/Lumenfall/actions/runs/38102667390)
also executes the two original failing scenarios and their two already
registered Auto-Ascend controls. The QA-only observer preserves the original
Chromium process outputs without changing its command, timeout or returned
result. The original parser requires one exact scenario result, no runtime
errors and the original intended semantic assertion for each negative. These
diagnostic-only scripts and workflow are not included in the feature branch.
Both original positive scenarios passed in the actual browser, including 927
Auto-Ascend contract checks. Both negative scenarios failed at exactly their
intended assertions: `manual keeps target 43 at higher clear Rift 100` and
`complete native list or bounded suggestions`. All four Chromium processes
exited zero, without timeout or runtime errors; the original Node runners exit
0/0/1/1 as required. This is focused diagnostic evidence, not full-suite
acceptance.

The mobile lane reached 3,062 checks, completed both 320px/100% motion profiles
and all five first-scale causal pairs, then found a real product layout defect
at 320px/200%: `no clipping paid Refresh`. All nine preceding paid Refresh
transactions committed the correct 25-Comet debit and deterministic replacement.
The actual screenshot clips all three Claim buttons at the right edge. The raw
card geometry is client width 298 / scroll width 331; button right edges are
338, 341.890625 and 329.21875 in a 320-pixel viewport.

The Daily Quest footer is a nonwrapping flex row, and its action group has
`flex:none`. Wrapping only the group's own controls cannot constrain its
max-content width beside the progress text. The 76-byte CSS repair lets the
footer wrap and bounds the already wrapping action group to the card with
`min-width:0;max-width:100%`. Both actions, labels, 44-pixel targets and all
original clipping, focus, viewport and transaction assertions remain unchanged.
No game JavaScript changes in this diagnostic delta. The new product SHA256 is
`da32710b666e12399ea6b87a1dd951d0810fb84d0b0e49f8f060406391f829ca`.

Diagnostic commit `42cf71fed8f065358c9b2209ca52d76e2144ec16`, sole parent
`258f49e3…`, has complete tree `910aa9290418fa34720baa4d12bff85373599b64`.
Its only changed file is the product; helper, all original adapters and the
diagnostic workflow remain exact. Run
[38102960412](https://github.com/karahaNx/Lumenfall/actions/runs/38102960412)
passed the repaired layout, seven complete profiles and all ten original causal
pairs. It reached 8,242 checks and failed `legacy migration preserves
activeStudies` in the first of the eight late historical ownership-subset loads
at 390px/200%/reduced motion. The four original legacy scenario/control outcomes
again passed their required expectations.

That subset reused the profile-start seed timestamp `1791683313911`. Its actual
cold load occurred 10.207 seconds later, which correctly triggered the original
offline owner. `totalOfflineSeconds` advances from 0 to 10.207. The two paid
research snapshots retain their IDs, total durations and speed multipliers;
remaining time becomes exactly `90 - 10.207 * 1.5 = 74.6895` and
`100 - 10.207 * 2 = 79.586`. Both committed save slots contain that same loaded
state. Rift 21 to 24, 407 Lumen and 27 Shards independently corroborate the real
catchup. There is no runtime error, blocked persistence or Auto-Ascend.

The original equality asserts a migration with no elapsed gameplay, but this
late fixture unintentionally also requested offline progress. Only those eight
late fixtures need a current timestamp from the actual browser immediately
before serialization and cold load, with an explicit unchanged-offline-time
precondition. All original paid-state equality checks remain. The generic
reload helper and intentionally aged protected-warning fixture must remain
unchanged; that aged fixture is required to exercise the real warning defect.
The original 10.207-second trace remains evidence of actual study chronology.

The helper-only diagnostic `1826dedaf0e46878386ac2ef862055cb9a1df079`,
sole parent `42cf71f…`, has complete tree
`553ecc5c8c40529cd52244c8d33386f1acef5aab`. Its helper SHA256 is
`dc869d5e5f6621143307f66b5d806e4e6a43d17929d9529859438d65d8cfbaa5`;
product, original adapters, workflow and ten causal pairs remain unchanged.
Run [38103610582](https://github.com/karahaNx/Lumenfall/actions/runs/38103610582)
passed that precise repair: 12,738 checks, all twelve complete browser profiles
and all ten original causal pairs. The matrix includes 144 paid purchases,
60 accepted native commands, 36 paid Refresh transactions and twelve complete
protected-load and invalid-import paths. All eight late ownership subsets now
retain zero offline elapsed time and the exact remaining study values 90/100;
their actual serialized browser timestamps precede the real save checkpoints
by 61–107 milliseconds. The intentionally aged warning fixture remains aged.
The four original legacy scenario/control outcomes again meet their exact
expectations. This is a successful focused diagnostic on the stated source and
helper, not acceptance of the next feature commit or the integrated branch.

The focused Comet workflow now adds one actual-browser source-reversion control
after the existing mobile lane. It first requires the same committed source,
helper, driver and Git tree, all twelve complete profiles, all ten original
causal pairs and twelve actual correct protected-load warnings. It then reverts
only the exact two warning hunks and executes the unchanged original mobile
driver against that variant with the real source assets. Only the original
warning assertion, the observed generic overwrite, 37 recovered Comets, exact
preserved raw slots and no runtime errors count as the intended failure. A
timeout, setup problem or unrelated assertion cannot pass the control. The
wrapper and variant preserve the complete original outputs. Its actual execution
is still required; static preparation and historical failure matching do not
count as a browser pass.

Earlier engine passes on `44112101…` do not establish acceptance of either
subsequent product correction. The final source must pass every required gate.

Run all five workflows on the next exact head, inspect complete raw outputs and
all actual browser profiles/causal pairs, then verify the development merge and
run fresh integrated checks. Preserve both failed candidate histories. Main,
APK and native Android/WebView/TalkBack work remain held; shared UI follows
accepted Comet integration.
