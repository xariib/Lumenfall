# RIFT_HINT_LAYOUT_001 — inset Rift hint strip

Status: LOCAL IMPLEMENTATION VERIFIED; user/combined/native acceptance pending. Owner: this
feature chat; no delegation. User scope: TASK 5 in the
[local improvement queue](LOCAL_IMPROVEMENTS_PLAN_001.md).

## Requirements and baseline

Make Show hints/Hide hints slightly narrower with inset edges between currencies
and the Rift enemy. Blend the background/fade neatly around the enemy box.
Preserve hint content/behavior, contrast, accessible touch targets, keyboard
access and stable layout. Show before/after mobile-width and large-text screens.
Preserve all other features, paid value, saves, assets and balance. No gameplay
decision, new rule, GitHub/push, APK release or signing change is authorized.

Clean baseline: `fd046ec8a76eec5185513f9dca25a7d606ecf826` on
`local/full-debug`, the latest accepted Lab slider checkpoint. Sequential local
ownership; no overlapping dirty changes observed. Existing hint CSS reserves
46px with a 44px toggle, full-width `margin:0` and a solid rectangular border.
Read AGENTS/bootstrap/state/queue, CODEX_START, CONTEXT_INDEX and workflow.
Prior [Guidance contract](GUIDANCE_READABILITY_001.md) preserves readable leading
words, full scrollable content, enlarged fonts, stable Show/Hide/combat geometry,
device preference and settings/navigation behavior.

## Acceptance and verification plan

- Reproduce and capture baseline at 320/390/430px and 100/200% root text.
- Targeted CSS only: slight symmetric inset, blended surroundings, same height,
  font sizes, readable leading word, 44px input targets, sufficient contrast.
- Run existing Rift Guidance mobile/input/readability and Rift contract checks,
  plus focused inset/fade assertions and source validation/context checks.
- Review the complete diff, update task/state, commit a coherent local checkpoint,
  refresh current source/fonts/branding in mobile/www and show playable preview.
- Keep combined CI/full suite and Android/device/WebView60/textZoom/TalkBack
  acceptance pending. Existing Prism deadline, Windows dump-DOM/POSIX tooling
  limitations remain unrelated and open; browser checks do not prove Android.

## Verified local checkpoint — 14 October 2026

Product CSS only:10px symmetric inset, subtle shadow and a gradient behind the
strip into the6px arena gap. Same46px reservation,44px targets, colors/fonts,
content and handlers. No product script, markup, mechanics, saves or paid-value
changes. No new rules or gameplay decisions. Whole product script/markup versus
the parent is unchanged; self-review only.

Source SHA-256: `db843a8bb95244a00c81fd04ae2ef5991f99df7e5c9eb64990eead5688ae747e`.
Node24.19.0 / Chrome151.0.7922.34. [Commands, receipts, before/after screens and
limitations](../qa/rift-hint-layout-001/README.md) are saved with this checkpoint.

- Baseline and candidate each16 profiles/32 samples PASS;320/360/390/430px,
  100/200% root text, both motion modes. Currency/combat geometry matches the
  baseline; touch/Space/focus/Show/Hide/state/storage preserved. Two inset/fade
  defect controls rejected correctly.
- Full existing Guidance16 profiles/160 samples PASS; readability, native input,
  scrolling, hidden accessibility, contrast, settings/reload/navigation, cosmetics
  and Ascend-ready coverage unchanged. Existing negative controls still reject.
- Existing Rift1738 and Workshop/navigation415 assertions PASS; no runtime
  errors, clean browser teardown. Source validation/context/whitespace PASS.
- Current source/fonts/branding refreshed in mobile/www; all15 files byte-verified
  against source and HTTP at http://127.0.0.1:4174/index.html.

Changed tracked files: index.html; tests/behavioral/rift-guidance.cjs (adds optional
layout capture/comparison modes without weakening the existing full checks);
this task, PROJECT_STATE, local queue status and docs/qa/rift-hint-layout-001/.
mobile/www is intentionally ignored and refreshed locally. Complete diff reviewed
for unintended removals and scope drift.

The initial sandbox browser/loopback failures were resolved by approved local
outside-sandbox execution; source-bound checks pass. App preview opening returned
queued; browser UI inspector blocked the URL under its security policy. Saved
test screens are reviewed, but actual visible preview UI remains unverified.

## Saved local handoff and deferred combined acceptance

Keep this chat and final acceptance OPEN. User preview acceptance and final
combined behavioral/required CI checks remain pending, together with inherited
Prism deadline/Windows standard transport/POSIX tooling limitations. Rerun this
Guidance/full Rift/nav acceptance and staged-asset verification on the final
combined source. Later authorized installed-device/WebView60/native textZoom/
TalkBack and Android package/signing acceptance remain separate; modern browser
results are not Android proof. No unresolved task-introduced failure is known
in the scoped checks. No GitHub/push, APK build/release, signing or archive action.

Next: user reviews playable local preview and saved before/after comparisons;
then continue the separately assigned RIFT_THEME_LABEL_001 from this checkpoint.
