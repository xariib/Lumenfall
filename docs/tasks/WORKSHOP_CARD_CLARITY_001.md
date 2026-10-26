# WORKSHOP_CARD_CLARITY_001 — slots, concise cards and long-term Deeds

Status: implemented; final validation, integration and release pending.
Baseline: main `91aea49228b6fc8039a0744788e988458c1bb40d` (Android 0.2.40).
Branch: `codex/workshop-card-clarity-001`; [PR #13](https://github.com/xariib/Lumenfall/pull/13).
One owner chat; no delegated work.

## Requirements and authorization — 26 October 2026

- Lab opens on five visible slots, including locked ones. Select a slot to open
  the research catalogue. Replace its project there; no Pause Study action.
- Queue OFF empties the slot. Retain paid remaining work and slot-owned boosts.
  Remove the redundant Speed target heading; keep the slider value accessible.
- Simplify all game cards, particularly Wisps, by removing duplicate copy.
  Keep prices, effects, gates and next actions accessible.
- Add many more objectives appropriate for an endless game.
- Exclusive Comet unlocks must not occupy Rift space or enable scrolling.
  The user prefers useful permanent unlocks such as Auto-Ascend.

The user explicitly approved public GitHub upload, PR, integration after passing
checks and a new signed APK if acceptance passes: “Godkendt og hvis alt er okay,
så lav en ny version.” This supersedes the initial no-release scope and the
public-upload automatic-review rejection. Terminal push lacks credentials;
the GitHub connector publishes exact-tree commits with expected-head leases.
No further general approval is needed for this authorized delivery.

## Implemented behavior and preservation

Five primary slot cards are always rendered. Selecting one reveals its catalogue;
choosing research starts Queue ON and returns to slots. Queue OFF clears a slot
atomically. A legacy active save with Queue already OFF instead says Clear slot
and clears on the first activation without enabling automation. Replaced/cleared
work goes into the existing paid-work ledger; later resumption is free. The
slot's purchased boost continues on its original wall-clock deadline while idle.
The additive five-entry `studySlotProjects` association preserves repeat ownership.
Existing paid legacy slots 6–7 remain visible without creating new capacity.

Native range controls and every live ancestor stay attached during refresh;
slot DOM, visual and assistive reading order are 1–5. Completion returns focus
to the empty slot. Farm/late-power links open a catalogue before focusing a
hidden research card, without starting or buying anything. Lab level and cap
are shown once as `Lv. n / cap`. The speed value lives beside its slider.

Wisp Rarity, Ability, Ultimate and Mastery are behind native Upgrades. Forge,
Tree, Lab, Deed and Comet cards use concise effects and optional Details.
The final disclosure correction samples the live open state before
rendering and restores the same keyed summary's focus. This also makes How
research works stay open across passive Lab refreshes. Existing fallback focus
after a capped purchase still visits purchase controls in its original order.

Forty-nine fixed, one-time Deeds extend the original 27 to 76. They use existing
lifetime/permanent counters for Rift, Ascend, kills, Lab, Forge, Mastery and
offline hours, with receipt-backed pending credits. Current purchasable totals
are Forge 645 and Lab 2,635; all new finite upgrade goals are reachable. Forge
milestones are 100/200/300/400/500/600. Original Deeds and their rewards are intact.

Existing Comet commands and purchase value are preserved in Deeds; their panel
and scrolling rules are removed from Rift. No prices, charges, damage, ownership
or command effect is converted. This preservation choice was disclosed for the
approved delivery; no new automation type has been invented.

Keep saves, paid work, currencies, balance/caps, automation, offline chronology,
package `com.lumenfall.app` and the established signing identity. No test or gate
is disabled. No touch glow/highlight is added. Normal keyboard focus remains.

## Validation and diagnosed failures

- Baseline local Lab slot contract passed 54; Lab expansion passed 2,676.
- Feature transaction/save/reachability suite passes 97 on current source.
  Other verified local suites include Forge 9,319, Comet numerical 681,739,
  Comet core negative 10,492 and full offline comparison 18 scenarios.
- Current product SHA-256:
  `7e2e15e9fc5b3320fd17f7777a4b8e84bc23c61b3a4aee1a33a93db503f8d63c`.
  Its regenerated four-phase, 8h-per-phase independent one-second Swift oracle
  matches every prior state digest and kills/Ascends/Prisms tuple:
  86404/4114/94622, 86401/4114/94622, 86396/4114/94622, 86405/4115/94645.
- Prior public candidate `1519a217` (before the disclosure correction) passed
  complete Lab, Comet, Shared UI and isolated offline CI. Its broad validation
  passed Endless/Mastery, repeated Ascend/clock tests and original-value Tree
  refunds and Wisp contribution acceptance. It then hit the older Wisp task
  startup budget; the active checkpoint was compacted with a byte-identical
  historical copy, keeping the 32 KiB gate. Complete final-head and
  integrated-main CI remain mandatory.
- Original UI fixtures now select slots/open Upgrades before native purchases.
  Both Recruitment keyboard drivers visit the new Tree Details summary before
  the original funded button, retaining focus/price/cap assertions. Native Lab
  Queue OFF checks the empty slot, exact remaining paid work, retained boost
  and both saved copies. Cap mobile acceptance is an additional early CI gate.
- Tree's compact Invitations card can reach a real 2 px maximum-scroll boundary;
  funded purchases use the existing nearest-feasible boundary checks. A redundant
  outer viewport guard was removed because it masked the original causal test.
- Chrome startup occasionally expires before any game assertion (Browser.getVersion
  or Target.createBrowserContext). Rerun that job with unchanged deadlines;
  never reinterpret a completed assertion failure as infrastructure failure.
- Local Chromium socket creation is denied in this command environment. Use CI
  for actual browser acceptance; do not retry the rejected sandbox escalation.

The focused mobile matrix covers 18 profiles: 320/390/430 px, 100/150/200% text,
normal/reduced motion, 44px controls, selection/replacement/clearing, original
Queue-OFF saves, live range identity, boosts, five-slot order and fixed Rift.
It now also exercises native keyboard opening and repeated refresh of Lab help,
Tree, Forge and Comet disclosures, with stable focus and unchanged state/saves.
The original Lab, Forge, Comet, Tree, V8 6.0, stateful and causal suites stay gates.
Self-review and automated validation only; no independent human review claimed.

## Android evidence and remaining delivery

Nonpublishing [native #41](https://github.com/xariib/Lumenfall/actions/runs/40356497883)
built signed 0.2.41 and preserved the upgrade save, then stopped on an obsolete
SECTION-only unfinished-Wisp assertion. The driver now requires the native
Details structure, opens Upgrades with an actual Android touch, and performs the
original exact-price Ability purchase and focus checks.

Nonpublishing [native #42](https://github.com/xariib/Lumenfall/actions/runs/40358586049)
passed on `70390b357e3e6f7ee3a35e9de7caf2792d6d8eb3`: package/certificate/assets,
in-place Android upgrade, UID and https://localhost origin, both saves, paid
progression/legacy entitlements, native Wisp disclosure/purchase and installed
Farm hint navigation. It built 0.2.42/versionCode1000042. Publication was skipped;
this is prior-source evidence, not the final release acceptance.

Next: pass all six workflows on the exact final PR head, then integrate #13.
Manually dispatch all six required workflows on the exact integrated main SHA:
pre-merge-validation.yml (both jobs), comet-expansion-validation.yml,
forge-expansion-validation.yml, lab-expansion-validation.yml,
shared-ui-validation.yml and tree-focused-qa.yml. After all pass, dispatch
Build Android APK on main with publish=true. Its release gate, signing/assets,
installed emulator upgrade and exact-APK receipt must pass before publication.
Verify the public APK checksum, version and source; save final receipts and
update this task plus PROJECT_STATE only after release, so publication source
cannot move mid-build.

Physical phone, exact WebView60 DOM, TalkBack and human visual/pacing acceptance
remain open. Do not archive or claim those passes. The temporary checkout became
unavailable and was recreated from exact public cfa56554; its tree was verified.
GitHub retains source/history. Ignore unrelated scratch diagnostics and temp files.
