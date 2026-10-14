# LAB_SPEED_CONTROLS_001

13 October 2026. Owner: this feature chat, sequential local work, no delegation.
Goal: improve Lab speed appearance and interaction with direct multiplier and
queue controls, visible prices and safe immediate/queued purchases. Preserve
existing tiers, prices, paid value, work, Study/speed queues, balance, saves and
offline simulation; preserve other features. Local delivery only: no GitHub,
remote push, APK build/release, signing key or archive action.

Read [queue](LOCAL_IMPROVEMENTS_PLAN_001.md), [state](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md) and root startup instructions. Run
node scripts/codex/check_context.cjs --task docs/tasks/LAB_SPEED_CONTROLS_001.md.

## Baseline and accepted checkpoints

Started clean local/full-debug678ccd7, accepted Formation source0bf0505f.
Baseline browser reproduced speed and queue controls hidden behind a separate
panel; core2465/offline checks passed before edits. Formation owner then saved
docs-only e3fc6c8; its OPEN/deferred acceptance decision was preserved. First
Lab checkpoint6a694f4 on local/full-debug, source639b5426, implemented four direct
controls. [First evidence](../qa/lab-speed-controls-001/README.md): focused890,
expansion6588, core2465/offline,19 existing cases, native/reduced and prior-feature
preservation checks PASS. No concurrent dirty product work was overwritten.

Follow-up starts from6a694f4. The screenshot reproduced too many inconsistent
boxes and repeated status text. All follow-up dirty files belong to this task.
A combined dropdown candidate, source740239a6, passed checks but was superseded
before commit. [Superseded dropdown receipts](../qa/lab-speed-controls-001/polish/README.md)
remain historical evidence; they do not establish slider acceptance.

## User corrections and current acceptance

- Keep Lab Queue; fewer boxes for speed controls. Remove the repeated Paid speed
  line; speed queue ON/OFF belongs in the control. Actual paid speed stays in the
  existing completion progress bar.
- Latest speed request: a bar that slides from1.5x to8x, with a queue ON/OFF
  button. Use the existing eight discrete tiers, visible multiplier/Mote quote
  and adjacent speed queue toggle. Preserve immediate acceleration as an
  explicit unboxed Buy now action. Do not spend across intermediate drag tiers.
- Remove Running and Next completion text. Put the Lab project name at the top,
  with its level in a small rounded badge underneath. Earned becomes Current;
  On completion becomes Next. The marked reference shows the name/badge
  hierarchy; it does not request replacing the game's theme or adding profile
  content. Preserve level meaning/numbers, effects and running Study order.

Acceptance includes one-short/exact affordability, discounted prices, duplicate
input, queue ON/OFF and target changes, chronological online/offline parity,
persisted preferences, native touch/keyboard,320–430px and200% text, stable
scroll/focus through renders/purchases/reordering/completion, existing relevant
Lab and preservation checks. Review complete diff, document evidence, commit a
coherent local checkpoint, stage current source/fonts/branding in mobile/www
and show playable preview. Browser acceptance does not prove Android acceptance.

## Current local checkpoint

LOCAL FOLLOW-UP VERIFIED; final combined/release/device acceptance pending.
Parent6a694f4, branch local/full-debug. Resolve this checkpoint with
`git log -1 -- docs/tasks/LAB_SPEED_CONTROLS_001.md`.
Source SHA-256: `ac190cdf4632c12e2c0fda23a406078f1a0ae6cec7b35bad88ab39d13d4a9188`.

Lab Queue remains in the title header. A native stepped slider and one speed
queue toggle sit together below a multiplier/full Mote price quote. Buy now is
an explicit text action for this level; queue pays per eligible level, also
current/offline work, under the unchanged scheduler. OFF retains already-paid
speed. Selecting with OFF does not buy. Drag and held-key previews are DOM-only;
release saves the final target. Native slider attachment, focus and viewport
anchor survive periodic rendering and sorting; rendering-induced blur cannot
commit an intermediate tier. Immediate guarded transactions, prices, discounts,
scheduler, simulation, balance, work and save schema are unchanged.

Cards use prominent names and level badges, Current/Next effects, no Running/
Next completion/Paid speed line. Queue intent is in the toggle; current actual
speed remains in the completion bar. Shared explanation is once in the Lab
footer with accessible descriptions. Idle/capped/acquired/due/unaffordable
purchases remain disabled, without removing prices or paid-value information.

[Current source-bound evidence](../qa/lab-speed-controls-001/slider/README.md).
Node24.19.0 / Chrome151.0.7922.34. PASS: focused1118/12 profiles; both causal
mutations rejected; expansion6588/12 profiles including actual reload; core2465;
offline yielding/retry/recovery/shared12h;19 existing Lab/Inquiry/duration/
identity/hierarchy/navigation cases18949 counted assertions plus save proofs;
native/reduced live timers each6 profiles; accessibility states/focus/contrast;
R3 destinations and actual reload. Context/source/diff checks and staged/HTTP/
loaded-script parity PASS. Original gameplay/save/value checks retained; obsolete
select/menu assertions adapted to the requested slider, no gates weakened.

Focused tests caught an initial purchase focus/scroll shift and live reordering
preview risk; both fixed and covered. Native unchanged-thumb taps initially
failed focus acceptance; slider now focuses at gesture start and passes live
checks. Mutation anchors were updated to actual handlers. No known unresolved
scoped failure remains in this final source. Self-review only.

Changed files: index.html; focused speed and existing Lab UI/native/expansion,
accessibility, navigation, Inquiry and upgrade-effect tests; this task/project
state/local queue; source-bound QA receipts/screenshots and reference. No new
unrelated product issue established. Inherited Prism deadline, standard Windows
dump-DOM/POSIX tooling limitations remain recorded in the existing debugging task.
Scoped browser checks use isolated approved local Chrome/CDP profiles; no player
reset or test bridge is introduced in the playable preview.

mobile/www source/fonts/branding refreshed and all15 files byte-verified in
staging/HTTP. Playable preview open on Lab at http://127.0.0.1:4174/index.html;
its complete loaded game script matches source. Latest reference and screenshot
are saved with the current evidence.

Next: user reviews the slider/name/badge preview, then RIFT_HINT_LAYOUT_001 from
this checkpoint. Keep this feature OPEN for final combined suite/required CI
and authorized Android/device/exact WebView60/TalkBack acceptance. No release
completion claim, remote/APK/signing or archive action.
