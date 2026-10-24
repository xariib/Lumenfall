# Lumenfall — current delivery status

RIFT_HINT_READABILITY_002 is approved in [PR #7](https://github.com/xariib/Lumenfall/pull/7)
but remains unintegrated and blocked by full regression. Its focused browser
matrix, causal controls and installed candidate emulator test pass. The full
suite reports arena overflow in rift-status-stacking-mobile during a Void cast. An isolated identical-frame comparison now reproduces the
same failure on both main and candidate, establishing an existing defect.
The separate repair [RIFT_CAST_BOUNDS_001](tasks/RIFT_CAST_BOUNDS_001.md) is
proposed and not approved.
[Current diagnostic checkpoint](tasks/RIFT_HINT_READABILITY_002.md).

This is an isolated QA branch checkpoint. It changes no product and claims no
integration or APK release. The existing main product, saves and purchases are
untouched. Prior delivery history remains in the
[main status](https://github.com/xariib/Lumenfall/blob/main/docs/PROJECT_STATE.md).
Physical phone, exact WebView60, TalkBack and human pacing remain unverified.
