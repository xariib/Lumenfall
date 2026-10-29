# Earned Lab expansions

[Requirements and continuation](../../tasks/LAB_SLOT_CHALLENGES_001.md).
Source SHA256 `ba7acc19f7e5fd55236546d25dead7d84c461ddcda66ef65fc372f7e3adfaefb`.
Local Node24.20.0, Chromium156.0.8078.74, Windows.

[Core](core.json):238 assertions and five causal controls. Independently require
every milestone; no wallet, queue or active-work bypass; exact payments,8x work,
old active/paused work, earned slots, save/recovery/backup/Ascend and failed-save
rollback. Actual research completion and repeated Ascends start queued expansion
at the same timestamp across live/offline/caller splits. Disabling the new cycle
boundary reproduces a0.549491s discrepancy and fails the assertion.

[Mobile](mobile.json):290 assertions/12 profiles (320/390/430px,100/200% text,
both motion settings), native touch, in-place milestone updates, focus retained,
missing-resource red prices/disabled controls, paid-work replacement, AX exposure
and no horizontal overflow. [Inspected screenshot](mobile/expansion-challenges-390.png).

[Independent oracle](swift-golden.json): actually regenerated with one-second
advance calls. All four phases retain exact prior endpoint hashes and
kills/Ascends/Prisms. Existing baseline hashes are unchanged.

Affected original checks on the same source pass: [expansion2676](lab-expansion.json),
[currency stress](lab-expansion-stress.json), [slot contract54](lab-slot-contract.json),
[queue continuity64](lab-queue-continuity.json), [timed boosts1480](lab-timed-boosts.json),
[boost queue379](lab-boost-queue.json), [long-tail353](lab-longtail.json),
[Auto Ascend174](auto-ascend-feedback.json), [original mobile6588](original-mobile.json),
[slot mobile452/18 profiles](slots-mobile.json), and
[long-tail mobile326/12 profiles](longtail-mobile.json). Existing causal controls
remain enabled. The first cycle-split invocation lacked its diagnostic output
directory; rerunning with the standard directory passes. Its source-consistency
builder now expects the new Lab boundary connection explicitly.
[Cycle split1068](endless-cycle-split.json) and
[cycle boundaries136](endless-cycle-boundaries.json) pass through that builder.
The latter uses its existing frozen-power diagnostic transform (hash27db61d8),
derived from productba7acc19; it is not an unmodified-product hash.

These are local/self-review results. Required CI, integration, signed Android,
physical phone, exact WebView60, TalkBack and human pacing are separate gates.
