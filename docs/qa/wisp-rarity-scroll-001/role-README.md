# Visible Wisp action anchoring — second correction

13 October 2026. User still reported unaffordable Empower jumping after ac7ca7c.
That local checkpoint's scrollTop-only checks did not establish stable on-screen
position when background content changed height. User report supersedes its
claim of complete local interaction acceptance.

Two issues verified:
- Both existing in-app tabs initially had captureWispRarityView and lacked
  captureWispActionView: the previous Empower implementation was not loaded.
  Refreshed both instead of creating additional preview tabs.
- On ac7ca7c, an actual denied mouse click kept scroll884/Ember top285.890625
  immediately, but a longer live observation changed the top to262.390625 while
  scroll stayed884. [Observation](before-role-loaded-runtime.json).
  [Prior preview](before-role-preview.jpg). Its recorded script hash covers a
  truncated tool-returned prefix only, not a complete loaded script.

[Reproduction](role-baseline.json) on exact ac7ca7c source28e2ffeb: a background
full Wisp render crossing Boss10 →ordinary11 left scroll1487 unchanged while
Empower moved from422.63 to442.13px. Same-card focus and save level survived,
so earlier assertions missed the19.5px visible movement.

The fix captures the action's layout offset before passive full/role rendering
and compensates for changed content above it. Layout offsets exclude temporary
reward transforms, preventing animations from driving scrolling. Manual purchases
retain their original scroll contract; disappearing capped controls retain their
same-card fallback. No costs, effects, balance, rewards, progression or save
schema changed. Failed intermediate variants are recorded in
[repeat diagnostic](role-repeat-diagnostic.json); all original assertions were
retained, including repeated affordable rarity scroll.

Source SHA-256:
`2fa400081743625d1f4cc6bda176ca299615950d38739d839098d6e12742764c`.
Node24.19.0/Chrome151.0.7922.34. Local self-review, not independent review.

| Command / operation | Final result |
| --- | --- |
| `node scripts/codex/check_context.cjs --task docs/tasks/WISP_RARITY_SCROLL_001.md` | [PASS](role-context.txt) |
| `node scripts/ci/validate_source.cjs` | [PASS](role-source-validation.txt) |
| `node tests/behavioral/run.cjs --web-root mobile/www --scenario wisp-rarity-scroll` | [PASS3229](role-registered.txt), [JSON](role-browser.json) |
| driver `index.html --role-only --mutate-anchor` | [Expected visible-position failure](role-anchor-control.json) |
| driver `index.html --empower-only --mutate-focus` | [Expected cross-Wisp jump](role-focus-control.json) |
| driver `index.html --mutate-periodic` | [Expected lost persistent anchor failure](role-periodic-control.json) |
| `node tests/behavioral/wisp-contribution-core.cjs index.html --negative --preservation` | [PASS8099](role-wisp-core.json) |
| `node tests/behavioral/early-wisp-curve-current.cjs index.html --negative` | [PASS2798](role-curve.json) |
| `node tests/behavioral/support-recast-current.cjs index.html --negative` | [PASS1594](role-support.json) |
| `node tests/behavioral/lab-affordable-alert.cjs mobile/www/index.html` | [PASS166](role-lab-alert.json) |
| `node tests/behavioral/ui-attention-quest.cjs mobile/www/index.html` | [PASS1081](role-attention-quest.json) |
| saved run-existing adapter with `wisp-formula-contract` | [PASS](role-wisp-formula.json) |
| same adapter `nav-workshop-contract` | [PASS443](role-navigation.json) |
| same adapter `r3-save-reload` | [PASS actual reload](role-save-reload.json) |
| live HTTP source/fonts/branding byte comparison | [PASS](role-preview.json) |
| both existing in-app tabs' complete main-script bytes | [Exact current-source match](final-loaded-runtime.json), [preview](final-loaded-preview.jpg) |

The registered matrix preserves all168 prior purchase/input cases and adds144
refresh transitions: native mouse/touch/Enter,320/390/430px, normal/doubled text,
normal/reduced motion, grow/shrink updates across10/11/20/21 depth states. Screen
position must stay within1px, focus in Stone and its level unchanged. The tab-entry
animation settles before these position measurements. No assertions,90s registered
runner deadline or existing25s CDP adapter deadlines were weakened. Production
DOM/JS runs in isolated temporary profiles; controlled depth transitions pause
intervals. Real user-preview observations use the app's running timers. No test
fixture overwrote user saves or made purchases in the user's preview.

The app's read-only text API truncates long strings at200000 characters. Final
loaded-script verification reads the script in100000-character chunks, hashes the
complete text and matches root inline JS after HTML newline normalization. Both
open tabs now match. Source/fonts/branding refreshed in ignored mobile/www and
served at http://127.0.0.1:4174/index.html.

Final full-suite/Prism deadline, standard Windows transport, remote integration
and Android/device/WebView60/TalkBack acceptance remain OPEN. Browser/source
verification does not prove Android acceptance. No remote, APK or signing actions.
Next: user tries the already-reloaded preview; continue only from this corrected
local checkpoint. Prior task milestones remain evidence for their exact bytes.
