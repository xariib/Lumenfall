# Rift visual unlocks

User request (4 November 2026): more full Rift background unlocks, live and still
backgrounds, new enemy types, Wisp design unlocks, more visible attacks, boss
regeneration below the Wisp attack area, and an aligned gold active Rift nav dot.

Owner: this chat. Goal: expand cosmetic choice and improve combat readability.
Baseline: main `2ca3d3be`; isolated `feature/rift-visual-unlocks-001` worktree.
Remote checked at startup; only unrelated documentation PR2 open. Other working
trees remain untouched. Existing SVG/CSS art is the asset system.

Scope: full scenic backgrounds and Live/Still setting, selectable enemy families
and Wisp designs earned through existing Deeds, Collection previews/requirements,
projectile visibility, boss-panel placement, active nav dot. Enemy families are
appearances; damage, rewards, encounter traits and progression stay unchanged.
Preserve all existing themes, legacy cosmetics, saves, prices and automation.
New optional appearance preferences default safely for old saves and survive
Ascend, backup/recovery and reload. No new binding rules.

Acceptance: unlock/locked selection, cosmetic-only mutations and persistence;
distinct rendered scenes/characters; Live/Still/reduced-motion; 320/390/430px and
200% text; boss panel below party; visible bounded attacks and pointer-inert
decorations; nav dot size/position/color; existing Rift, cosmetics, accessibility,
save and required CI gates; review exact diff and record integration/APK evidence.

Status: implemented locally; integration/delivery pending. Known earlier VFX overflow
is recorded in [Rift VFX task](RIFT_VFX_OVERFLOW_001.md); attack work must retain
the original overflow checks. Modern browser tests cannot prove physical-phone,
WebView60 or TalkBack acceptance.

Implemented: seven illustrated full backgrounds (two still, five live), Live/Still
preference, three Wisp design sets across all eight elements, six enemy forms in
two selectable families. Existing six aura choices and legacy cosmetics remain.
Boss regen now follows the Wisp row; larger/brighter projectiles travel from the
actual Wisp portraits above the artwork. Impact phases are clipped in their own
inert layer. Rift active dot shares the other dots' geometry and matches its logo.

Checks: source validation/context/diff PASS. Focused browser 1,458 assertions,
12 profiles (320/390/430, 100/200% text, normal/reduced motion) PASS on product
SHA256 `813aa52d156d75a8310900cdf220d846e7a7c31ec8c85ac17bca47d142ae7f1c`.
Node24.20/Brave156. A causal missing-dot mutation fails the intended assertion.
Added actual page reload coverage afterward; focused121 checks PASS. Visually
inspected Cinder/Aurora scenes, Collection, Crystal Stag, all 32 Wisp portraits
and projectile screenshot. Automated/self review only.

Existing cosmetics baseline:167 samples, then Windows EBUSY profile cleanup.
Candidate:170 samples including controls, then browser-close timeout. No content
assertion failed; full Linux CI remains required. Original Rift stacking test
expected regen between HP and party; its ordering assertion now enforces the
user-requested below-party placement, retaining all other spacing/overflow gates.
Rerun PASS, including compact/safe-inset profiles, native navigation and clean
shutdown. New harness allows 30s for Windows browser shutdown.

The old generate-offline-swift-golden helper still hardcodes pre-tap-balance
outcomes (86,404 first-window kills); baseline's checked-in reference is 88,592.
Its attempt failed without changing the reference. New rift-visual-parity test
compares the actual parent and candidate over four independent one-second eight-
hour windows, including every state field except the new appearance preference,
and requires unchanged published kill/Ascend/Prism outcomes before rebinding.
All four windows PASS on pinned Node24.19. Every gameplay field and reward matches
the parent; only the new default riftLook preference is added. Existing reference
kill/Ascend/Prism counts are unchanged; source/complete-state hashes rebound.

Files: index.html; new rift-visual-unlocks.cjs and rift-visual-parity.cjs; intentional
Rift ordering assertion; Shared UI CI step; task; offline source binding pending.
Durable [local evidence](../qa/rift-visual-unlocks-001/local.json),
[four-window parity](../qa/rift-visual-unlocks-001/parity.json), compressed raw
receipts and screenshots in the same directory. Feature commit3c97817 pushed.
Browser inventory reports local browser use disabled; settings unchanged.
GitHub connector cannot dispatch workflows; scoped GitHub API requests using the
same existing Git authentication work. Nonpublishing Android run41820149302 on
3c97817 is building; no claim of final integrated acceptance yet.

Next: publish reference/evidence update and PR, pass all required CI, integrate
and run exact-main validation/Android delivery under the existing
[workflow](../project/FEATURE_WORKFLOW.md). Keep device limits explicit.
