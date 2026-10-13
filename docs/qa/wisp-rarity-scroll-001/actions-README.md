# Wisp action follow-up evidence

13 October 2026. User correction: “Also when pressing empower and its not
affordable it scrolls away, nothing should do that”. Scope extends the existing
Wisp scroll/focus improvement to Wisp-card actions without purchase changes.
Started clean on `local/full-debug` at `ddb709d`.

[Empower baseline](empower-baseline.json) reproduced scroll1504 →697 and
focus Stone →Ember after a purchase made the next Empower unaffordable.
Generic disabled-control fallback caused the same cross-card jump as Rarity Up.

The small shared UI helper now retains action identity, same-card focus and
exact main scroll for Empower/Recruit, Rarity, Module, Ultimate, Resonate,
Auto-Empower queue and formation toggle controls. Enabled controls retain focus;
disabled/removed controls use the same-card heading. Fully perfected cards use
a noninteractive card fallback so repeated Enter cannot collapse their summary.
Disabled pointer activation establishes same-card focus even when focus began
outside the card. Currency refresh captures before disabling any Wisp controls.
Purchase, price, balance, reward and save functions are unchanged.

Source SHA-256:
`28e2ffeb073292a48a3af43afe6b108d2396d29b3b7f02d9cdd36a9e5cd4edec`.
Node24.19.0; Chrome151.0.7922.34. Local self-review and automated checks only.

| Command / operation from repository root | Result |
| --- | --- |
| `node scripts/codex/check_context.cjs --task docs/tasks/WISP_RARITY_SCROLL_001.md` | [PASS](actions-context.txt) |
| `node scripts/ci/validate_source.cjs` | [PASS](actions-source-validation.txt) |
| `node tests/behavioral/run.cjs --web-root mobile/www --scenario wisp-rarity-scroll` | [PASS2797/168 cases](actions-registered.txt), [JSON](actions-browser.json) |
| same driver `index.html --mutate-focus` | [Expected Empower scroll failure](actions-focus-control.json) |
| same driver `index.html --mutate-periodic` | [Expected perfected-card focus failure](actions-periodic-control.json) |
| `node tests/behavioral/wisp-contribution-core.cjs index.html --negative --preservation` | [PASS8099](actions-wisp-core.json) |
| `node tests/behavioral/early-wisp-curve-current.cjs index.html --negative` | [PASS2798](actions-curve.json) |
| `node tests/behavioral/support-recast-current.cjs index.html --negative` | [PASS1594](actions-support.json) |
| `node tests/behavioral/lab-affordable-alert.cjs mobile/www/index.html` | [PASS166](actions-lab-alert.json) |
| `node tests/behavioral/ui-attention-quest.cjs mobile/www/index.html` | [PASS1081](actions-attention-quest.json) |
| saved `run-existing.cjs mobile/www/index.html wisp-formula-contract` | [PASS](actions-wisp-formula.json) |
| same saved adapter `nav-workshop-contract` | [PASS443](actions-navigation.json) |
| same saved adapter `r3-save-reload` | [PASS real reload](actions-save-reload.json) |
| exact live source/fonts/branding HTTP comparisons | [PASS](actions-preview.json) |

Focused production DOM/JS checks pause automatic interval callbacks to isolate
state and invoke actual CDP touch/Enter. All72 original rarity cases remain.
48 Empower cases cover exact debit, one/repeated affordable level, unaffordable
following purchase, denied touch with focus outside the card, repeated Enter,
three full/affordability refreshes and currency loss. Another48 cases cover
Module, final Module, Ultimate and final Rarity on fully perfected cards, with
normal/doubled text at320/390/430px in reduced motion. Complete state deltas,
including original40/45-Comet achievements and paid/save fields, are asserted.
Wisp/global effects and preservation gates pass on these exact source bytes.

The source is staged in ignored mobile/www alongside unchanged current fonts and
branding. Preview remains http://127.0.0.1:4174/index.html. User preview saves are
untouched; tests use isolated profiles and temporary staged files with clean exit.
Headless/loopback checks required successful sandbox escalation. No assertions or
runner acceptance were weakened. Prior evidence remains saved under its original
source hash. No new unrelated issue was added to this scope.

Full-suite/Prism-contract deadline, standard Windows dump-DOM transport and
Android/device/WebView60/TalkBack acceptance remain pending. Browser results do
not establish Android acceptance. No remote, APK, release or signing actions.
Next: user refreshes/reviews the updated preview, then task3 can continue from the
new local checkpoint; final release/device validation remains separate open work.
