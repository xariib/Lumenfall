# Rift background and theme redesign

12 November 2026. Owner: this feature chat. Status: Android 0.2.111 published;
physical-phone and human acceptance remain open.

## Request and scope

User: “remove the live and still backgrounds. Wisp and enemy theme packs thats
being unlocked over time. I don't like the design of the new ones. Just make a
new background for the rift and then make the themes more visible and cooler,
the enemy should fit inside the circle there is with every theme q player choose”.

User confirmed: “Yes—remove the unlockable packs and keep the main themes”.
Remove separate background/Wisp/enemy packs, use one new Rift background,
retain and improve all six main Rift themes. Preserve original character
identities, gameplay, Deeds, theme unlocks, legacy cosmetics, paid value and
save/recovery. Retired appearance preferences must load safely without equipping
retired art. No new binding rule, balance change or save-schema change.

## Baseline and isolation

Original main: `6b990b70ccfdd62049ca10172b0c770ae808a6bc`. Branch:
`feature/rift-theme-redesign-001`; worktree: `validation-evidence/rift-theme`.
Root checkout contains unrelated Forge/Lab work and untracked attachments and
was left untouched. PR42 subsequently integrated at `dc78daad` and released
Android 0.2.110; its game and delivery documentation (`5656cf85`) are retained.
Product merged cleanly. Only shared status and replay source binding conflicted.

Read [startup](../../PROJECT_BOOTSTRAP.txt), [state](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md), CODEX_START and CONTEXT_INDEX;
reviewed [visual unlocks](RIFT_VISUAL_UNLOCKS_001.md) and
[theme label contract](RIFT_THEME_LABEL_001.md).
Observed baseline: packs were separate from the six themes; enemy and aura
dimensions differed. The original 122-assertion visual quick check passed on
root PR42 `6bd4b293`, whose Rift visuals matched main. Simulation comparisons
instead use exact main sources from Git. Local browser startup required
outside-sandbox execution; long-path checkout used command-local configuration.

## Acceptance and implementation

- One new full-stage static vector landscape; no Live/Still or pack selectors.
- Six stronger circular seals, with theme-colored scene lighting and actual
  ring previews in Collection. Existing unlocks and selection remain.
- All 23 original enemy species and boss regalia fit inside every circular
  frame at mobile sizes and enlarged text, including animation bounds.
  Enemy and ring share centered SVG coordinates; character size is 62%.
- Original Wisp identities, HP/names, boss panels, attacks, navigation, touch,
  keyboard focus, reduced motion and legacy Comet cosmetics remain functional.
- Old pack preferences round-trip as inert `riftLook` data. Both save slots,
  backup/recovery, Ascend, simulation, rewards and paid work remain intact.
- Relevant regression checks, integrated-source CI, signed Android acceptance,
  publication and public download verification are required.
- Screenshots receive self-review. Physical-phone, exact WebView60 DOM,
  TalkBack and human design acceptance remain separate unverified checks.

Changed: `index.html`; visual-unlock, cosmetic and layout tests; new
`rift-theme-parity.cjs` and replay source binding; installed Android appearance
assertions; task/status/evidence. Existing workflows are unchanged. The default
visual entrypoint runs the new oversized-enemy negative control. Assertions for
removed controls became absence and legacy-save checks; all other layout,
navigation, attacks, motion and save assertions remain. Historical art symbols
and normalization allowlists remain inert to avoid unrelated asset churn.

## Integrated source and final checks

[PR48](https://github.com/xariib/Lumenfall/pull/48) merged; main fast-forwarded
to the exact tested commit `63c63b1a02a68545a1e95cd10d7828e3187f0672`.
Final `index.html` SHA256:
`ce51bc14e82c41929483c6483684add0390690d92d181c8aa35a91336aad0ac8`.
The final correction removed stale pack instructions from the Collection &
Journal guide and added two rendered-guide assertions.

[Evidence index](../qa/rift-theme-redesign-001/README.md):

- Final quick visual: 117 assertions. Full matrix: 1,399 assertions, 12 profiles,
  16,560 encounter/theme/profile samples. Both missing-dot and oversized-enemy
  controls rejected the intended defect and exited cleanly.
- Existing cosmetics: 170 samples, contrast, keyboard/touch, reduced motion,
  backup/recovery and retained Comet decorations. Native Rift layout/input and
  15 fresh/dense/boss layout fixtures plus collapse control passed.
- Final paired replay against `dc78daad` (same game as `5656cf85`): four eight-hour
  one-second replays, 115,200 calls per source. Every saved field, reward and
  original canonical endpoint matched. Only the reference source binding changed.
- Forge/Lab: 528 checks. Existing chronological parity, syntax, unique IDs,
  lifecycle, task context and whitespace checks passed. Local Node 24.22.1;
  browser versions are recorded in raw receipts (full matrix Chrome 157).
- All eight applicable PR workflows and six exact-commit release workflows
  passed (14 total). Each broad job passed 220 browser executions across 190
  deterministic scenarios, plus a separate passing isolated offline job.
  Conditional Prism workflows were inapplicable under existing triggers.

`release-readiness.json` records exact commits, run IDs and successful jobs/steps.
Final PR premerge: 43235037282. Final release runs: premerge 43235740864,
Comet 43235752283, Forge 43235762092, Lab 43235772610, Shared 43235782089,
Tree 43235790373. Final Shared artifact 13953381841 reports ZIP SHA256
`22f7b7e0d26efbd08368b48121c295798696af204fb583d7917f8d547e7e8514`;
selected raw receipts were downloaded before expiry.

## Findings and Android delivery

Self-review only; no independent reviewer. Initial premerge found an obsolete
six-regional-landmark expectation. It now checks the explicitly requested one
scene while retaining all other layout/region/boss checks. Two early Tree jobs
timed out before DOM/QA results, including Chrome `--version`; raw diagnostics
remain in `tree-first-failure/` and `tree-second-failure/`. Same-source retries
passed with unchanged deadlines. Final-source PR and release checks all passed.
Earlier source/run receipts remain historical, not final-source acceptance.

Unpublished signed candidate 43218948236 on `0501ecdb` passed as 0.2.109 before
the main integration. Final publishing build
[43247033269](https://github.com/xariib/Lumenfall/actions/runs/43247033269)
published from integrated `63c63b1a`, after its existing validation gate passed.
Its first job 131282364141 passed signing/assets but failed native touch
calibration: an input ANR closed DevTools (1006). System-app GPU stalls over
80 seconds and device-wide responsiveness warnings were also observed; no
root cause is proven. `android-first-failure/` preserves exact raw logs/states
and instrumentation failure. Artifact 13958681266 reports ZIP SHA256
`f1358ed10328dd81ab0466cae0bec2ed55aabf758dca7fa2d7b4c6625369f746`.
Same-source job retry 131289364039 passed with unchanged checks/deadlines,
including save upgrade, installed theme/touch checks, in-app updater and normal
retail-image launch. The first failure remains recorded; a passing retry does
not establish its cause.

[Android 0.2.111](https://github.com/xariib/Lumenfall/releases/tag/android-1000111),
version code 1000111, retains package `com.lumenfall.app` and certificate
`A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21`.
APK SHA256: `6bcef5120e943da897c246ceb0608a3e87bb296cd0a28379de56dff71405afac`.
Both save slots, paid study/progress, UID, origin and Comet entitlements survived
the signed upgrade. Installed Starlight/Ember checks and inspected screenshots
show the new scene and contained original enemy. Retail normal launch passed
without a debugger or test instrumentation. Anonymous versioned/latest APKs,
checksum, commit, update feed and exact packaged HTML/fonts/branding all passed.

Final artifact 13958074717 reports ZIP SHA256
`75793f10a083467f49f3b2637b67e9e296b361f8169f671787deac9e0b43677f`.
`android-workflow.json` records successful jobs/steps and artifacts;
`android-release/` preserves raw receipts, selected input evidence, compressed
native logs, inspected screenshots and local/public asset verification.

The connector lacks workflow dispatch and local artifact download; the installed
GitHub CLI provides those operations. A command-local credential-helper override
avoids a stale machine path without changing user configuration. The credential
lacks workflow scope; no workflow edits or permissions were needed.

## Next action and limitations

Code and signed release are delivered. Delivery documentation is a docs-only
descendant of `63c63b1a`; no product/test/native/workflow bytes changed after
acceptance. Shared-file implementation work has stopped. Next: review the six
themes on a physical phone, including large text, TalkBack, exact WebView60 DOM
and human design acceptance. Google Play Protect is also not tested. Keep this
task open and do not archive or claim complete while required device/human
acceptance remains unverified. No independent review is claimed.
