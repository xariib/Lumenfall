# OFFLINE_RECAP_RELEASE_001 — verify Continue and publish phone build

User: “Gør det”, authorizing investigation of the native offline-recap Continue
failure and publication of a signed APK with integrated MOBILE_FEEDBACK_001.
Work / GPT-6.1 Sol High. One maintenance task; no delegated agents.

Baseline main: `8763d72f7ee85e1948a432968e786617633993f8`.
Branch: `fix/offline-recap-release-001`. Only open PR #2 is an unrelated audit.
Read current rules, bootstrap, status, workflow, environment, source index,
[mobile feedback](MOBILE_FEEDBACK_001.md), Android workflow/driver and affected
return-flow/overlay code. Public release is 0.2.30; built 0.2.32 was not published.

## Goal and preservation

Reproduce the native Continue failure with mandatory visible offline rewards,
capture trusted input/geometry/timing evidence, fix the demonstrated cause and
retain regression coverage. Preserve gameplay, both save slots, purchases,
chronological offline simulation, Auto-Ascend, intro, keyboard focus and Android
package/certificate. Do not turn absence of the dialog into a passing test.
All existing checks remain. No balance/save schema changes are requested.

Acceptance: focused causal control and deterministic native recap dismissal;
all six required workflows on final PR and integrated main; exact signed APK,
in-place upgrade/save/paid-work checks and completed exact-APK receipt; public
download verified against release checksum. User's phone acceptance follows.

## Checkpoint

In progress. Historical Android #32 attempt 1 failed at the 350 ms post-touch
assertion; attempt 2 showed no recap. Raw artifact `12601602385` retrieved and
inspected. It contains no pre/post input geometry or screenshot, so it cannot
establish a product bug or coordinate/timing cause. Add diagnostic observations
and a forced actual offline return before deciding whether product changes
are necessary. No product edits yet. Physical phone/WebView60/TalkBack remain
unverified.

Diagnostic Android #33 (`40225903851`) stopped before the Continue exercise:
the new QA driver tried to remove a pre-document script owned by the already
closed CDP session, yielding “Script not found”. Remove that redundant cleanup;
the closed session already removes its scripts, matching the existing fixture
lifecycle. Preserve this failed diagnostic as artifact `12610384652`.
Local source/startup-order (24 assertions), identity and release-gate controls
PASS. Local Chrome cannot start its Unix socket (EPERM); browser acceptance
runs in Actions. Next: rerun the corrected native diagnostic, then fix the
demonstrated cause and require final CI/integrated release acceptance.

Diagnostic #34 (`40226422376`, artifact `12611527520`) rejected the mandatory
dialog check. The fixture lacked an execution receipt: Page.reload acknowledges
navigation before the new document executes, and immediate session teardown can
remove the injected script before it runs. Keep the originating session until a
unique storage marker proves the fixture ran, then remove the script through
that same live session. Reconnect only if navigation actually destroys it.
Record the marker, ready state, actual reward text, save and startup screenshot
before the mandatory assertion, including failure. This fixes QA setup, not a
demonstrated product failure. Next: collect actual Continue input evidence.
