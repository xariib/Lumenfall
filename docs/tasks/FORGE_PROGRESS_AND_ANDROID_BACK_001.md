# Forge pacing, late Mastery and Android navigation

User correction, 22 November 2026. The low-cap Forge tracks run out in 42–61
simulated hours. Space them out and retain the years-scale goal for completing
the full Forge. After the Forge, players should still earn power through Labs,
rarity, abilities, Ultimates and Mastery as they push higher Rifts. Android
system Back from Wisp Manage should return to the roster. Holding ordinary
game text should not open WebView Copy controls.

Baseline `92a90779`, Android0.2.150, HTML SHA256
`b24494d6f4a4833c83922467e141454174efb9cbe4866e8d9e5ef7ebc45c805e`.
Feature branch `feature/forge-progression-and-android-back-001`, worktree
`C:/lf-forge-short`. PR63 owns separate Google Play distribution.
[Pacing measurements](FORGE_SHORT_TRACK_PACING_001.md), [Forge years](FORGE_YEARS_001.md),
[Wisp interaction](WISP_CARD_REDESIGN_001.md), [delivery workflow](../project/FEATURE_WORKFLOW.md).

Use visible Rift bands for later ranks of the 20 short tracks. Keep their paid
rank, existing price, effects and caps, including Swift Recovery's cycle floor.
Keep Arcane Calibration 1–10 available for the existing Wisp requirements.
Apply each gate to manual, bulk and automation purchases. Verify the developed
Rift 300 comparison and the mature multi-year Forge benchmark against live code.

Continue existing Mastery after rank 2000. Preserve earlier rank prices and
prerequisites. The tail advances with deeper Rift records and growing Prism and
Sigil prices. Supporting Lab, Tree and Forge requirements eventually plateau
at their own caps. Preserve old saves and already-paid effects.

Android Back should use the existing roster return path with focus and scroll
restored. Preserve normal Back outside Manage and text selection/clipboard for
the save backup and other form inputs. Test Android system Back as well as the
existing on-screen control.

## Candidate checkpoint

Source `f3c7d1d8aeffb22c70e2fcb7e0bc33b6914668f153c5bd4e6307b7a4c8d665fe`.
The 20 short tracks reach their final ranks over Rifts 140 to 1100. Swift Recovery
can reach rank 4 immediately, rank 7 at Rift 25, rank 9 at Rift 65 and rank 10 at
Rift 140. Arcane Calibration ranks 1–10 still open at Rift 12. Its final rank
opens at Rift 450. All existing prices, caps and paid effects remain intact.
Stored ranks remain valid even if a later rank purchase is gated. The
[Rift 300 replay](../qa/forge-progress-and-android-back-001/rift-300.json)
clears the boss and maxes only Swift Recovery and Cauterize, versus 20 previously.
The fresh [Forge-first](../qa/forge-progress-and-android-back-001/fresh-forge-72h.json)
and [boss-focused](../qa/forge-progress-and-android-back-001/fresh-boss-72h.json)
replays each reach Rift 160 in 72 simulated hours and max only Swift Recovery.
Their first completion is at 16.89 and 21.61 hours respectively.
The [30-day boss replay](../qa/forge-progress-and-android-back-001/fresh-boss-720h.json)
reaches the old replay's Rift 210 record and still maxes only Swift Recovery.
The mature reinvestment model still completes the entire Forge at productive
day 994. It grants a mature record, Wisps and Labs. Its result is a calibration
estimate with no fresh-account calendar guarantee.

Existing Mastery purchases through rank 2000 keep their previous rules. Later
purchases require 20 more record Rifts per rank after the first tail rank,
growing prices in Prisms and Sigils, and grant the same +10% permanent own Wisp
Power. The required Lab, Tree and Forge ranks plateau at their own caps so the
supporting systems do not block future Mastery after completion. No save schema
change. Existing ranks above 2000 retain their effect. Core tests prove funded
purchases beyond rank 2000 and cold reload.
In the [seeded full-Forge combat replay](../qa/forge-progress-and-android-back-001/late-mastery.json),
Ember buys rank 2001 at Rift 50,200 and gains 10% own Power. Over 120 offline
seconds the record reaches 51,575, versus 51,570 from the same state before
buying the rank. The fixture grants developed Wisps, completed research and
currency to exercise the late purchase and combat path.

Android's lifecycle-aware Back callback invokes the same Wisp return route as
the in-game button. A Back outside that route falls through to the original
Android behavior. The Android WebView disables ordinary text selection/context
menus and retains form editing, selection and backup copy/paste. Native upgrade
acceptance checks the actual system Back dispatch, restored roster/focus/scroll,
and actual long press on game text. Device edge gesture acceptance remains
pending until a physical test. No package, signature or manifest change.

Local tests cover all 20 final Rift boundaries, original quotes, paid owners,
manual/Max/queue authority, onward Mastery purchases and refreshed mobile
prerequisites. Independent one-second offline replays pass with the established
HP tolerance and exact remaining save fields. The default legacy boundary
test needs its established CI `--focus-f` flag. Actual V8 6.0 stays a separate
required compatibility run.

Private signed Android 0.2.151 passed
[build 44963558195](https://github.com/xariib/Lumenfall/actions/runs/44963558195)
at `1409ff67`. Android 12 dispatched system Back from Ember Manage, restored
the roster focus and scroll, suppressed a native long press on game text, and
kept the backup textarea selectable. The installed upgrade retained the prior
save and signing identity. This build did not publish.
[Android receipt](../qa/forge-progress-and-android-back-001/private-151/emulator-upgrade.json).

Candidate CI at `1409ff67` exposed two stale browser fixtures. The Forge test
now asserts the visible Rift lock and unavailable purchase after the first
rank where the next rank is gated. The exact-funded Swift cap fixture now
uses the required Rift 140 record and retains its debit and remainder checks.
On `a1af8808` the targeted Lab-queue scenario and full Forge browser suite
passed locally (32,712 Forge checks). That candidate's Lab timing runner
timed out opening Chrome before its first assertion. A same-commit retry
passed. Eight candidate workflows and the isolated offline job passed. The full
pre-merge job found a Wisp fixture that expected the initial Mastery label after
the affordability refresh. Its local replacement verifies the actual disabled
Rift 50,200 requirement at record 50,199 and both prices on the enabled
purchase at record 50,200. The bounded upgrade controls still disappear.
The targeted Wisp display scenario passed. Product source is unchanged.
Ahead of the full run, the local endless controls caught a stale mutation
anchor for Sigil Cartography. The mutation now targets the same boss payout
after it calls the extracted base quote, and the income assertion still
rejects percentage instead of flat bonuses. All 21 controls and 901 endless
mobile checks passed locally.

Exact candidate `1eeccf71` kept the same HTML SHA. Its isolated offline job
passed. The first Linux Wisp-scroll run timed out awaiting Chrome touch
dispatch after 2,831 assertions. Both platforms passed the same-commit retry.
A local Brave trace saw an intermittent post-restore touch before Settings was
ready on both baseline and candidate. The backup test now waits for the
reloaded document and rendered Rift before its next trusted touch. All 12
profiles pass locally. The early-confirmation control still fails at the
intended wallet/save assertion. Android native backup and upgrade acceptance
passed independently.

The local full run also exposed the old Luminous Tracking level 9/10 purchase
fixture without a sufficient record. Both mobile motion profiles pass with the
Rift 320 record and the same exact debit, focus fallback and cap checks. The
Forge boundary tests separately exercise both sides of the new unlock.
Next run the corrected candidate gates, integrate, validate on main and verify
the signed public APK and in-app updater.
