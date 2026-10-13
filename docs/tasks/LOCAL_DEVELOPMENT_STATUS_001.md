# Local development status recovery

13 October 2026. User asks where game development stopped, before continuing
development and issue fixes. Scope: reconcile the supplied ZIP's current code
with its saved checkpoints; validate focused contracts locally. No gameplay
changes or remote release actions are assigned by this status assessment.

## Exact baseline

Local setup commit `fdb8d0d`; imported game SHA-256
`42b180adfb9f59268bbcadc6b0abc907317c138768caf82835ceeb73e2689e5c`.
This matches the final source recorded by [the 12 October release task](FINISH_DEVELOPMENT_RELEASE_001.md)
and its [jitter](../qa/finish-development-release-001/jitter/README.md)
and [main control](../qa/finish-development-release-001/main-controls/README.md) receipts.
No live GitHub state or original ZIP commit identity is available.

## Reconciled state

The candidate includes Prism earning changes, twenty Lab projects/twenty Forge
tracks/twenty Tree paths, Comet shop/Deeds, shared UI and Guidance improvements,
paid-value preservation/refunds, Wisp contribution readouts, Swift level-10 cap
and original Shard refunds, current/historical Forge Deed credit, Support
1s/1.5s duration with persisted minimum recast intervals, and the approved
Ember/Stone level-above-70 power bonus. Older proposal/audit documents describe
earlier sources and must not be interpreted as current missing implementations.

Recorded final repairs cover paid Study foreground jitter, stale offline
goldens/Support expectations, and changed main F21 negative-control anchors.
Historical Full CI passed 182 scenarios and the F21 funding/browser tests, then
failed its negative-control stage. Controls were repaired; all six final CI
lanes and signed APK/native acceptance were still pending at the last checkpoint.
These are recorded results, not fresh local whole-game acceptance.

Campaign fixtures measured early/mid/mature progress, but do not prove human
pacing or acceptance on a received mature save. Physical-device, exact WebView60,
TalkBack and intermittent historical clipping limitations remain distinct.
The local source is an unreleased candidate, not proof of an installed APK's code.

## Fresh local checks

Node.js v24.19.0; receipts outside the repository under
`../work/development-review/`, source-labelled to the hash above.
- Swift: PASS, 22 groups, 110 purchase boundaries, 16 killed controls.
- Support recast: PASS, 1594 checks, 4 killed controls.
- Ember/Stone curve: PASS, 2798 checks, 3 killed controls.
- Wisp contribution: PASS, 8099 checks, 7 killed controls; preservation PASS,
  8592 checks across 40 chronological cases against the frozen baseline.

## Continuation

First re-establish the broader regression baseline on this exact candidate,
including browser UI, saves/restores, paid value, live/offline parity and long
offline windows. Repair reproducible failures one at a time with focused
regression coverage. Review actual player pacing/save evidence before additional
balance changes. Preserve current mechanics, currencies, assets and save value.
GitHub CI/merge/push remain unavailable while account access is blocked; Android
build and installed-device acceptance require their own available tools/evidence.
No historical mandate creates an unsolicited implementation or release order.
