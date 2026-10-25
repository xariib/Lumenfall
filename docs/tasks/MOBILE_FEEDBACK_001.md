# MOBILE_FEEDBACK_001 — simplify Wisp cards and first launch

Owner: this chat. Work / GPT-6.1 Sol High recommended. Scope is the user's
25 October 2026 phone-test feedback, grouped in one maintenance change.

## Requirements and baseline

- Wisp cards are still too large. Remove repeated live support/boost information
  (Tide example) already shown in Rift, while keeping useful upgrade information.
- No highlights after Show hint, Claim rewards or similar actions. Persist this
  requirement in AGENTS.md. Keyboard focus accessibility must remain usable.
- Fix Rift appearing frozen before the startup intro.
- More chats only if needed; these related presentation fixes fit this chat.

Live main: `7df7f5c975dbee108c721750b5e5831c6d280c92`. Only open PR #2 is an
unrelated documentation audit; no overlapping open product work was found.
Branch: `fix/mobile-feedback-001`. Read [rules](../../AGENTS.md),
[bootstrap](../../PROJECT_BOOTSTRAP.txt), [status](../PROJECT_STATE.md),
[workflow](../project/FEATURE_WORKFLOW.md), [environment](../project/CODEX_START.md),
[prior card requirements](WISP_ACTION_HIERARCHY_001.md) and affected source/tests.

Verified baseline: renderWispRoles repeats Support added to party, preview
uptime, Motes, Bonds, Earned boost and bench status. Several :focus rules apply
to pointer input, and :focus-within changes the containing card border.
Existing init renders Rift before applyOfflineProgress completes; only its
completion starts playStartupIntro. This explains the reported startup order.
Physical timing on the user's device is not measured here.

## Decisions and preservation

Remove support/Bond/bench readout duplication; keep economic per-cast rewards,
all unfinished upgrades, current/next effects, prices, role label, power, rarity,
Field/Bench, automation, Mastery and perfected disclosures. Rift support and
Bonds remain unchanged. This supersedes the earlier card requirement to repeat
contribution on every Wisp card, not the numerical contribution contract.

Pointer modality suppresses focus outlines; real keyboard events restore them,
including a :focus fallback for WebView 60. Do not blur controls or remove focus
restoration. Remove whole-card :focus-within highlighting. Existing selected,
pressed, disabled and affordability states are unchanged.

Exact rule announced before editing and authorized by the user's request:
“Do not add transient highlights, glows, pulses or target-flash effects when
activating Show hint, Claim rewards or similar actions. Preserve keyboard
focus indicators and normal pressed/disabled states.” Saved in AGENTS.md,
with explicit pointer/touch outline and containing-card behavior.

An initial HTML/CSS loading cover conceals Rift before JavaScript initializes.
Start intro before cooperative offline processing; present return rewards only
after both have finished. Skip remains usable during offline processing. Keep
the cover if processing outlasts intro, and expose recovery UI on failure.
Preserve intro cooldown/reduced motion, original simulation, saves, purchases,
progression, Auto-Ascend, offline chronology, assets and Android identity.

## Acceptance and checkpoint

Status: implementation in progress; not integrated or device accepted.
- Source syntax validation PASS (two scripts, 16 IDs, lifecycle guards).
- Independent golden regenerated using the unchanged original one-second oracle:
  all four successive eight-hour state/reward phases match baseline exactly;
  only the source binding changed.
- Browser startup/touch gate added for 320/390/430 px, normal/reduced motion,
  fresh/return/cooldown/failure. Checks pre-JS cover, intro before simulation,
  skip while busy, one return flow after both completions, recovery and real
  touch/keyboard focus. Existing Wisp geometry/purchase/state suites retained.
- Updated only obsolete duplicate-readout expectations in contribution-mobile;
  retained per-cast rewards, numerical core, touch/keyboard formation, contrast,
  layout, purity and scroll checks.
- Local browser cannot create its process socket (Operation not permitted).
  Sandbox escalation is disabled by environment policy. Browser checks must run
  in existing GitHub Actions; this is not a product PASS or failure.

Next: publish PR, inspect all six required CI workflows and new gate, fix any
regressions, integrate only after successful final-head validation. Installed
Android and physical-phone visual/startup acceptance remain pending. No APK
publication has been performed by this task. Record live PR/check evidence below.

## First remote validation

[PR #9](https://github.com/xariib/Lumenfall/pull/9), head `6ebf2c5`.
New real-Chromium startup/input gate PASS 24/24 profiles in
[pre-merge run 40184674615](https://github.com/xariib/Lumenfall/actions/runs/40184674615).
Original full suite then stopped because the added AGENTS rule pushed the old
RIFT_HINT_READABILITY_002 startup text over 32 KiB. Preserve its full historical
offline-reference checkpoint in a linked QA file; no limit or test is weakened.
Local startup-order VM regression PASS 21 checks; original main fails the
intro-before-offline assertion. Contribution core PASS 8,099; support recast
PASS 1,782; progression PASS 235; Farm guidance PASS 24.

[Focused receipts](../qa/mobile-feedback-001/README.md) preserve exact-source
results, 29 byte-identical gameplay/persistence/intro declarations and the
inspected pre-script boot screenshot. The six original CI workflows, both full
jobs, original negative controls and installed Android gates remain required.
Final-head results and integration/build receipts are recorded in PR #9 to avoid
creating a new commit solely to record that same commit’s run result.

## Review correction: interrupted intro

Automated review of `6ebf2c5` found a real 500 ms background/foreground race:
offline processing had committed, hiding invalidated the generation, and the
short-return optimization skipped the replacement flow. The old callback could
therefore never remove the cover. Restart even a sub-second return while the
startup cover is present. A focused regression fails on that reviewed source
and passes after the fix (24 VM assertions). The browser matrix now also covers
this visibility transition in both motion modes and all three widths (30 cases).
The original four eight-hour independent golden phases still match exactly.
New product SHA-256: b03770981e9fd0a4cc53d37021761cf93f148a0aae82874423780f8015f9efa2.
Earlier browser/boot receipts retain their old hash and are not final-head proof.

## Settled-layout harness correction

Final product b0377098 passed the 30-case startup/input gate and existing Farm
mobile acceptance in run 40185187700. The original layout-fresh observer then
failed all five viewports at “#enemy-stage visible”: it hid the intro element
and measured Rift before the real intro completion callback. That old shortcut
now correctly leaves Rift hidden behind the new cover. Extend the existing
startup callback observer/wait to layout scenarios (including the negative
layout control), use the original Skip handler and wait before freezing.
All original layout assertions, fixtures, five viewports and deadlines remain.
Product and independent golden bytes are unchanged by this test-only repair.

## Shared settled-screen boundary

Run 40185557376 passed all five focused workflows, isolated offline (all 18
original records), 30 startup profiles, 18 compact-card profiles and the original
layout/hint/claim gates. Its later full suite exposed the same old pre-intro
measurement shortcut in upgrade-identity UI/reduced-motion, wisp-upgrade-display
and Lab UI: hidden title/controls and
focus still on Skip. Observe the real startup callback for every settled-game
scenario, then await it after catch-up and before fixture manipulation or freeze.
Native startup drivers keep their existing ownership and early return. Assert
that the boot cover is actually released; do not clear it or synthesize callbacks.
All original assertions, fixtures, timeout/deadline and negative controls remain.
Run the affected original UI scenarios early as well as in the full unchanged
189-case main coverage. Product, golden and Android candidate bytes are unchanged.
Local syntax/tooling/190-case coverage plan pass. Also remove a trailing blank
line in the relocated historical checkpoint found by final diff whitespace QA.
Next: inspect the new early gate, then require all six final-head workflows and
both full jobs before merge and integrated Android build. No public APK release.

The complete live log also identified two standalone drivers: formation-collapse
expected the intentionally removed Benched text (replace that obsolete assertion
with exact inactive-party/Field-toggle state and an empty duplicate readout),
and Resonate prepared its focus fixture during the intro fade. Its own bridge
now observes/awaits the original callback before fixture preparation. All native
Resonate eligibility, exact debit/refill, focus, save and geometry checks remain.
The same source audit found Rift cast-text measurements hiding the intro without
its callback. That standalone driver now awaits the original completion too;
its unchanged 12-profile assertions also run in the early settled-screen gate.

Run 40187627244 passed the 30-case startup gate and early Formation/Resonate
checks, then rejected upgrade-identity's programmatic-focus-only ring check.
Keyboard visibility must now follow keyboard input, as requested by the user.
Keep the exact ring/contrast assertions, but deliver a bubbling keyboard event
before programmatic-focus measurements in upgrade identity and Tree UI, and
actual CDP Tab input in native Formation Bonds. The other focus-style assertions
were audited: they already establish native keyboard modality. Include these
original UI cases in the early gate; no pointer ring is reintroduced in product.

Run 40187939139 passed those early UI cases and isolated offline acceptance.
Both native offline UI profiles then asserted presentation-busy false immediately
after an injected failure, while the newly concurrent intro was still running.
Retain the immediate offline-work/pending-time and endpoint assertions, observe
the real intro callback, then retain the original cleared-busy/endpoint checks.
Retry, exact eight-hour golden awards, cancellation, daily rollover and native
claim checks remain unchanged; no product bytes or deadlines change.
