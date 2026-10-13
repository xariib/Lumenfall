# Comet first CI failure and repair candidate

This records the first Comet CI attempt on PR107 commit
`cc95025f53e8e91f88e2498fe0c7290d7fe70985`. It is a failed candidate, not
acceptance. Its product SHA256 is
`d630b20a665fdb643ef7f05ec7b6bd6547bd5959adfc3079b16a7ff4cdbce659`.
The synthetic checkout `8c6d85f4fa339bf7d29cbe7af1b8c8574ee8aa33` has the
same complete tree `b3182b3adec13d67317744427e28649c0750fc47` and ordered
parents `9f04aca7265b57d73edc98822f3bd89d85f1881d`, `cc95025f53e8e91f88e2498fe0c7290d7fe70985`.

## Actual first-attempt outcomes

| Lane | GitHub run | Outcome |
| --- | --- | --- |
| Full | [38097682364](https://github.com/karahaNx/Lumenfall/actions/runs/38097682364) | Failed in the original cosmetics driver before the full scenario and mandatory-negative gates. No artifact was uploaded; the complete decoded job log and the API artifact-count-zero response are retained. |
| Lab | [38097682319](https://github.com/karahaNx/Lumenfall/actions/runs/38097682319) | All steps passed. Core 2,464/10 causal controls, boundary 2,344/5, mobile 6,588 checks in 12 profiles, actual V8 580. |
| Forge | [38097682390](https://github.com/karahaNx/Lumenfall/actions/runs/38097682390) | All steps passed. Core 9,315/25 controls, calibration 3,134/7, original offline 17 records, mobile 25,776 checks in 12 profiles, actual V8 2,452. |
| Tree | [38097682343](https://github.com/karahaNx/Lumenfall/actions/runs/38097682343) | All steps passed. Core 5,278/28 controls, offline 7,691/4, economy 16,802/6, mobile 26,636 checks in 12 profiles, actual V8 2,862. |
| Comet | [38097682528](https://github.com/karahaNx/Lumenfall/actions/runs/38097682528) | Core failed during its ninth causal control after all 15 positive groups passed. Numerical/offline steps were skipped. Mobile failed after 143 checks in the first profile (0/12 complete). Actual V8 passed 1,362 checks. |

These counts come from the retained raw outputs, not from earlier candidates.
Passing sibling lanes do not accept the failed Comet candidate.

## Repairs

### Original cosmetics fixture enters through actual migration

The old cosmetics driver installed a schema-2 fixture directly into the active
state. Its later save was correctly refused because the schema-3 runtime still
contained the retired owned keys. The displayed aura could therefore be Ember
while the last primary save remained Radiant; cold load correctly restored that
older primary. A pinned complete-IIFE witness reproduces that exact endpoint and
the absence of new storage writes.

The centralized fixture now calls the actual `acceptPersistedState` once before
rendering. Every original assertion is retained. The repaired fixture passes 42
complete-IIFE checks over normal, boss and luminous setups, including both save
slots, cold-load Ember, exact 210-Comet cosmetic compensation, and no new command
or charge. This is VM evidence; the original browser driver must still pass CI.

A focused inspection found the same seam in the original Formation core oracle.
Its actual setter migrated the fixture correctly, but the expected owned object
still contained `comettrials`. The original command reproduced that mismatch.
Its repaired oracle compares the original owned values after that one moved key,
explicitly checks the settled Trial entitlement and exact one-time 140 credit,
and preserves all other checks. All eight original families and six original
mutation controls passed on pinned first-candidate product bytes.

### Exact run-token identity and retained causal diagnostics

The first Comet core CI failed its expected-message classifier for the
`primary-failure-restores-run-identity` control. The original caught inner error
was not retained, so its exact Node20 message is unknown. No claim is made that
local Node24 proves the Node20 cause.

The identity assertion now explicitly tests reference equality as a boolean,
retaining its exact semantic error message. Ordinary unchanged-state checks also
require the original token reference instead of structural equality of empty
objects. Caught errors are retained before causal classification; the intended
message checks remain mandatory. Local targeted before/after witnesses are
separate from the complete repaired-core run on the new product: 10,490 checks
and all 18 causal controls, exit 0. The repaired Node20 CI remains required.

### Comet purchase press geometry

The first actual mobile purchase retained the correct focus destination and
saved the exact 100-Comet debit, but moved its viewport top from 433.40625 to
434.484375 pixels. Main scroll changed from 4,595 to 4,594 without reaching a
physical scroll bound. The existing one-pixel tolerance correctly rejected it.

The shared pressed-button rule translates the old button by one pixel when the
click handler captures its viewport position. Its replacement Open Ascend button
is unpressed. The measured document-flow change is only 0.078125 pixels; the
pressed capture predicts the observed scroll rounding. A scoped Comet purchase
override now retains the pressed color/shadow feedback without that translation.
This is the sole product change from the first candidate; product SHA256 becomes
`44112101936e150fd15f715c10568ce7283701440da1f15cc6e4eb6e887bb88e`.

Mobile diagnostics now record the pre-press and actual trusted-touchStart
geometry before touchEnd. A fifth causal pair removes only the exact new CSS
rule at the two existing narrow text scales, then restores the original bytes.
All original endpoint, focus and viewport assertions remain; no helper scroll or
focus repair is added. Twelve profiles and ten positive/reversion pairs must
pass real Chrome before this repair is accepted.

### Raw checkout parents

The original new workflow used `git show --format=%P`, which produced a blank
sidecar in its shallow checkout. The direct GitHub commit API retains the exact
ordered parents above. The new workflow now archives the raw commit object and
extracts its parent headers, so the next artifact independently retains them.
The exact shell extraction passed against the actual local Git commit object.
The nine pre-existing workflows remain unchanged.

## Remaining gates

Full, Lab, Forge, Tree and Comet must all pass on one repaired head. Preserve the
first failures, complete source/test bytes and raw outputs alongside final
audits. Verify the development merge and its complete tree, then run fresh
integrated checks. Main, APK generation/publication and native device acceptance
remain held. The shared UI work follows accepted Comet integration.
