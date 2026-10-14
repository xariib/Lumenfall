# RIFT_THEME_LABEL_001 — clarify the selected Rift appearance

14 October 2026. Owner: this chat. LOCAL IMPLEMENTATION VERIFIED; final
combined CI and Android acceptance OPEN. No delegation, remote, APK or signing.

## Original requirement and baseline

TASK 6: clarify Starlight on the Rift enemy screen. It names the selected
cosmetic theme, not a combat effect, reward or Starlight Affinity Tree upgrade.
Use compact wording such as Theme: Starlight for every theme. Preserve unlocks,
selection and effects. Check all theme names, mobile widths and large text.

Read AGENTS.md, PROJECT_BOOTSTRAP.txt, [state](../PROJECT_STATE.md),
[local queue](LOCAL_IMPROVEMENTS_PLAN_001.md), CODEX_START, CONTEXT_INDEX and
FEATURE_WORKFLOW. Relevant original [cosmetic contract](RIFT_COSMETICS_001.md).
Baseline: clean `local/full-debug` at `23074a9c1a1b85eb8a3ddec56ff419ef0211c606`,
the latest accepted local hint checkpoint. Source SHA-256
`db843a8bb95244a00c81fd04ae2ef5991f99df7e5c9eb64990eead5688ae747e`.
No overlapping dirty work observed; sequential ownership in this checkout.
Verified source has bare Starlight in markup and writes theme.name at runtime.

## Acceptance and preservation

- Reproduce the bare caption in the current browser before changing product.
- Static and rendered caption clearly identify Theme for all six names, including
  locked/stale fallback. No changes to unlocks, saves, prices, paid value or balance.
- Preserve effects, regions, Comet layers, reduced motion, HP/name/tap geometry,
  keyboard/touch selection, focus, save/recovery/backup/reload.
- Check 320/390/430px widths, 100/130/200% root text, complete label visibility
  without clipping or HP overlap. Browser text scaling is not native textZoom.
- Run focused cosmetics and relevant existing Rift/Guidance/navigation checks,
  source/context/whitespace validation; review complete diff, update task/state,
  commit coherent local checkpoint, refresh mobile/www assets and show preview.

## Verified local checkpoint

Product change: two lines in index.html. Static and runtime captions now use
Theme: followed by the existing selected name. All six names, unlocks, effects,
selection, gameplay and save data retained. No CSS, schema, prices or balance
changes. No new binding rule or gameplay decision. Complete diff self-reviewed
for unintended removals/scope drift; no independent review claim.

Candidate SHA-256:
`f8f787fd4a520ec277b350f40c6caeefa519c48cb55ddeb9bbe486e4cd0200b6`.
Node24.19.0 / Chrome151.0.7922.34.
[Commands, receipts, screens and preview manifest](../qa/rift-theme-label-001/README.md).

- Baseline167 / candidate170 samples PASS: six themes x normal/boss/Luminous x
  nine mobile/text/motion profiles; full caption visibility, locked fallback,
  exact baseline HP/name/tap geometry, preserved palettes/effects/Comet layers,
  keyboard/touch/focus, saves/recovery/backup and real reload/restore.
  Hidden-aura and two new meaning/clipping causal controls correctly rejected.
- Existing Guidance16 profiles/160 samples, Rift1738 and navigation415 assertions
  PASS with clean teardown and no runtime exceptions.
- Source2-script syntax/16 required IDs/lifecycle, actual context/startup budget
  and whitespace checks PASS. Normal and320px/200% longest label visually reviewed.
- Current index.html/fonts/branding refreshed in ignored mobile/www; all15 files
  byte-match source/staging/HTTP at http://127.0.0.1:4174/index.html. App opening
  returned queued; actual visible app-tab inspection is not claimed.

Tracked files: index.html; tests/behavioral/rift-cosmetics.cjs (caption regression
coverage and necessary Windows browser discovery/version-report fix); this task,
PROJECT_STATE, local queue and docs/qa/rift-theme-label-001 evidence/helper.
Initial sandbox browser/loopback failures resolved by approved outside-sandbox
local execution. Original Windows --version reporting hung and was interrupted;
browser protocol version reporting now completes. No gate/test weakened.

## Saved handoff and next action

Keep final acceptance and this chat OPEN. User preview acceptance, final combined
behavioral/required CI and Android/device/WebView60/native textZoom/TalkBack remain
pending. Browser PASS is not Android proof. Inherited Prism deadline and Windows
standard dump-DOM/POSIX tooling limitations remain open in LOCAL_FULL_DEBUG_001;
none is established as introduced by this label task. No known unresolved scoped
failure remains. No remote/push/APK/signing/archive action.

Next: review playable preview and saved screens; then separately assigned task7
FORGE_LAB_CAPS_001 requires named numeric cap decisions before balance changes.
Rerun cosmetics/Guidance/Rift/navigation and source/staged assets on the eventual
final combined checkpoint; retain full CI and installed-device acceptance.
