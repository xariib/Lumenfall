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
