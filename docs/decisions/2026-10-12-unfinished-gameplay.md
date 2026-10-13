# Existing unfinished gameplay decisions — 12 October 2026

Same owner chat; user wants existing unfinished features implemented. No agents,
other chats or new features. Main/APK/build/sign/release/Android workflow holds
remain. These are gameplay decisions, not evidence of completed acceptance.

1. Swift: asked whether Forge20/60 Deeds should count all current and historical
   paid Forge levels, retaining thresholds/rewards/earned unlocks. User answered:
   “Count all current and historical paid Forge levels (recommended).” Implement
   that definition with the already-approved Swift cap10/natural minimum10/3s
   and original Shard compensation. Lab levels do not count. This supersedes
   PR88's unaccepted replacement-Lab counting proposal.
2. Support: asked whether the approved1s normal/1.5s Ultimate duration should
   have a per-Wisp minimum recast interval tied to capped Swift natural cycle,
   6 down to10/3s, preserving Tap Conduit/Victory Charge/Resonate. User answered:
   “Use that minimum interval between Support casts (recommended).” Ensure
   downtime against externally granted charge; do not claim the natural cycle
   alone provides it. Implement separately after Swift integration.
3. Early Wisps: asked about the existing proposal Ember/Stone gain
   `352 * max(0, level - 70)^2` power before Rarity, leaving Titan/prices unchanged.
   User answered: “Implement and validate that existing proposal (recommended).”
   Implement separately after Support, then measure the current collection's
   campaign pacing/TTK/upgrade wait/Ascend/reward-sink acceptance. Synthetic
   forecasts are not received mature-save or native evidence.

Keep existing accepted development evidence source-labelled. Required affected
checks and six exact PR-head CI lanes apply to each candidate before development
integration. Preserve historical Full/Shared raw-evidence gaps; no main merge,
APK build/signing/publication, or unsafe Android workflow dispatch is authorized.
