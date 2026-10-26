# WORKSHOP_CARD_CLARITY_001 — slots, concise cards and long-term Deeds

Status: Android 0.2.43 published; integrated CI and installed-emulator acceptance passed.
Physical-phone acceptance remains open.
Baseline: main 91aea49228b6fc8039a0744788e988458c1bb40d (Android 0.2.40).
Candidate: 81645ae1d887f4769e6ca586184e1f0ae674f1aa.
[PR #13](https://github.com/xariib/Lumenfall/pull/13) merged at
bba2db5e1807c61305693758863e3de672535e5f; its complete tree matches the candidate.
Product SHA-256: 62672c9cbabc1c25ed5dbf5bad083133b3bae45d918210bbb2bf26db5795046a.
One owner chat; no delegated work.

## Requirements and authorization — 26 October 2026

- Lab opens on five visible slots, including locked slots. Selecting one opens
  its research catalogue. Replace research there; remove Pause Study.
- Queue OFF empties the slot and retains paid remaining work and slot-owned
  boosts. Remove the redundant Speed target heading; retain the slider value.
- Simplify game cards, particularly Wisps, removing duplicate information while
  retaining prices, effects, requirements and reachable actions.
- Add many more objectives suitable for an endless game.
- Exclusive Comet unlocks must not occupy Rift space or permit scrolling.
  The user prefers useful permanent unlocks such as Auto-Ascend.

The user explicitly approved public GitHub upload, PR, integration after passing
checks and a new signed APK: “Godkendt og hvis alt er okay, så lav en ny version.”
This supersedes the initial no-release scope and the earlier automatic-review
rejection of public upload. No further general approval is required. GitHub
connector writes use expected-head leases; no signing identity is changed.

## Implemented behavior and preservation

Five primary slots are always shown. Selecting a slot reveals its catalogue;
research selection starts Queue ON and returns to slots. Queue OFF clears an
active or waiting slot atomically. A legacy running project with Queue already
OFF shows Clear slot and clears on its first activation, without enabling queue.
Replaced or cleared paid work stays in the existing pausedStudies ledger and
resumes free. Slot boosts keep their original wall-clock deadline across idle
time, project changes and offline play. Legacy paid slots 6–7 remain visible
without creating new capacity.

The additive five-entry studySlotProjects field records repeat ownership.
Nonrepeating completion clears the association immediately, so direct/offline
completion already equals canonical normalized state. Replacing waiting research
disables its old queue intent. Waiting slots name their queued project and offer
Queue OFF. Failed persistence restores the entire state, wallets and paid work.

Native ranges and every live ancestor stay attached through refresh and real
touch drags. Slot DOM, visual and assistive order are 1–5. Completion returns focus
to the empty slot. Farm/late-power advice opens the hidden catalogue before
focusing a project, without spending. Lab level/cap appears once. Locked hints
name sufficient unmet requirements across Rift/Apparatus combinations. The speed
value is next to its slider.

Wisp Rarity, Ability, Ultimate and Mastery use native Upgrades. Lab, Forge, Tree,
Deed and Comet cards show concise effects with optional Details. Live disclosure
state and keyed summary focus survive passive rendering, including Lab help.
Capped-purchase focus retains its original purchase-control fallback order.

Forty-nine fixed one-time Deeds extend the original 27 to 76: Rift 8, Ascend 8,
kills 6, Lab 6, Forge 6, Mastery 9 and offline hours 6. Lifetime/permanent counters
feed the existing receipt-backed reward ledger. Original 23 rewards total 683;
four event Deeds retain 50; the 49 additions total 1,250; all Deeds total 1,983.
Current purchasable Forge levels total 645 and Lab levels 2,635. Forge milestones
100/200/300/400/500/600 and the new Lab goals are reachable.

Existing Comet commands and purchases move to Deeds; their Rift panel and scroll
rules are removed. Purchase value, effects and Auto-Ascend are preserved. This
conservative choice was disclosed for the approved delivery; no new automation
type is invented.

Preserve saves/schema5, paid work, currencies, caps, combat balance, chronological
simulation, automation, package com.lumenfall.app and the established certificate.
No tests/gates are disabled and no transient touch glow/highlight is added.

## Candidate acceptance and review

[Candidate receipt](../qa/workshop-card-clarity-001/candidate.json) records all six
successful final-head workflows, both pre-merge jobs, the complete 189 main
scenarios, one isolated offline scenario and all 14 formerly failing diagnostic
flows. The current product passed 228 transaction/save/reachability checks and
524 native Lab checks across 18 profiles. The matrix covers 320/390/430 px,
100/150/200% text, normal/reduced motion, 44px targets, queue clearing/replacement,
paid rollback, original Queue-OFF saves, live drag identity, order and fixed Rift.
Lab/Tree/Forge/Comet disclosures are opened with native keys, refreshed repeatedly,
and checked for stable focus and unchanged full state/both saves.

The independent one-second Swift oracle was regenerated after the product fix.
Every digest and 8h-phase kills/Ascends/Prisms tuple matches the prior reference:
86404/4114/94622, 86401/4114/94622, 86396/4114/94622, 86405/4115/94645.
Original Lab, Forge, Tree, Comet, actual V8 6.0, chronological and causal suites
remain gates. Selected current CI images were visually inspected at normal and
200% text; see [evidence](../qa/workshop-card-clarity-001/README.md).

[Long-term reward receipt](../qa/workshop-card-clarity-001/longtail-receipts.json)
checks all 49 additions pending against a huge wallet, reload, exact settlement
of 1,250 Comets, both save copies and no repeated grant. The initial manual fixture
was corrected to meet existing Mastery prerequisites and to reload the actual
new harness storage; those were test-fixture mistakes, not product changes.

Self-review of all 48 changed files found no remaining product findings. No
independent human review is claimed. The automated review on older 35b3122 remains
marked running with no findings/threads; it is not recorded as a completed review.

## Diagnosed failures

Head 35b3122 passed the focused workflows and isolated offline job, then completed
all 189 broad scenarios with 14 failures. Two unchanged full-state Auto-Ascend
tests exposed the real stale-completion association bug, now fixed. Other failures
were old Lab-help, requirement, bond-description, Forge rounding and Queue
selectors; protected retired paid-work accounting; hit tests selecting controls
inside closed disclosures; and observers grouping old event and new long-term
Deeds. Assertions for exact prices, effects, state parity, hit tests and deadlines
are retained and now follow the actual slot/disclosure interactions.

On 9f93d971, 12/14 targeted jobs passed. One Chrome startup failed at
Target.createBrowserContext before assertions (no records); one observer still
counted all new Deeds as four original event Deeds. The observer now requires the
exact four event rewards and separately checks 49 additions/1,250 and total 1,983.
All 14 pass on final 81645ae1.

Final PR broad attempt1 stopped at a CDP “Inspected target navigated or closed”
interruption during cap-test reload, after 320 checks/six completed profiles.
The unchanged job passed on retry, including all 189 scenarios. Never reinterpret
a game assertion failure as infrastructure failure or increase its deadline.
The earlier Wisp task exceeded the 32KiB startup budget; it was compacted with a
byte-identical historical copy. The context gate remains unchanged.

## Android delivery and remaining physical acceptance

Nonpublishing [native #41](https://github.com/xariib/Lumenfall/actions/runs/40356497883)
built signed 0.2.41 and preserved the upgrade save, then stopped on an obsolete
SECTION-only Wisp assertion. The driver now opens native Upgrades with actual
Android touch and performs the original exact-price Ability purchase/focus checks.

Nonpublishing [native #42](https://github.com/xariib/Lumenfall/actions/runs/40358586049)
passed on older source 70390b357e3e6f7ee3a35e9de7caf2792d6d8eb3: package/certificate,
assets, installed upgrade, UID/origin, both saves, paid progression/legacy
entitlements, native Wisp purchase and Farm hint navigation. It built 0.2.42,
versionCode 1000042; publication was skipped. This is prior-source evidence.

All six original workflow_dispatch gates passed on exact main bba2db5e,
including both complete pre-merge jobs and all 189+1 scenarios. The immutable
[main CI receipt](../qa/workshop-card-clarity-001/main-ci.json) lists each run.
No assertions, original gates or deadlines were weakened.

Publishing [native #43](https://github.com/xariib/Lumenfall/actions/runs/40406518300)
passed on that exact source. [Android 0.2.43](https://github.com/xariib/Lumenfall/releases/tag/android-1000043)
is public, versionCode 1000043, package com.lumenfall.app, established certificate
unchanged. APK SHA-256:
e582d0c8b523ebb23f83c0a10d4d44248e595d8dbd45433950a1c30fe4923ae2.

The actual installed Android 12/API31/WebView 91.0.4472.114 upgrade from signed
0.1.158 retained UID 10145, https://localhost, BOTH saves, paid progression and
legacy Comet entitlements. Eight Wisp cards fit at 320 px; Android touch opened
Upgrades and bought Ember Ability 10→11 at the exact price with retained focus.
The installed Farm hint opened the complete advice and focused the real Lab card.
Fixtures are synthetic, not a physical-phone save.

[Release receipt](../qa/workshop-card-clarity-001/release.json),
[raw emulator receipt](../qa/workshop-card-clarity-001/emulator-upgrade.json),
[identity](../qa/workshop-card-clarity-001/identity.txt) and
[packaged assets](../qa/workshop-card-clarity-001/assets.json) preserve the evidence.
Both the passing delivery bridge and an independent local anonymous download
verified the public APK checksum. The downloaded APK's actual index.html hashes
to the exact product SHA above; its published receipt verifies those exact bytes,
source commit and version. [Local proof](../qa/workshop-card-clarity-001/local-public-download.json).
Install as an update without uninstalling.

The temporary delivery bridge was restricted to merged PR #13, this repository and
the exact product hash. It dispatched the six original gates and normal publishing
workflow using ephemeral main-job actions:write. It was needed during the runtime
outage; access later recovered. Both temporary helper files are removed in the
final evidence/documentation commit after verified publication. Product code,
Android identity and all six original gates remain unchanged by that cleanup.

Next: physical-phone, exact WebView60 DOM, TalkBack and human pacing acceptance.

Physical phone, exact WebView60 DOM, TalkBack and human visual/pacing acceptance
remain open. CI browser and V8 tests are separate evidence, not those passes.
Keep the task open for physical acceptance; do not archive.
