# Offline recap targeting and Android 0.2.37 delivery

User authorized investigation and public phone-test APK delivery. Product HTML,
gameplay, prices, saves, assets and Android identity are unchanged from the
integrated mobile-feedback product (SHA-256
`b03770981e9fd0a4cc53d37021761cf93f148a0aae82874423780f8015f9efa2`).

## Before and after

The [real #35 trace](before-touch.json) requested CSS center `(160,397)` but
observed trusted pointerdown `(160,373)`: a 24 px origin error. Its
[screenshot](before-recap.png) shows the 44 px button. Android touch adjustment
occasionally rescued that outside-edge tap. The exact tap from historical
#32's failure was not recorded; it is not retrospectively claimed proven.

Two trusted taps on inert recap text now [measure the origin](calibration.json).
No inset is hard-coded. The [#36 corrected trace](after-touch.json) contains
pointerdown and click exactly at `(160,397)`, followed by the actual overlay
closed. The original 350 ms assertion and overall deadlines remain. Absence
of the recap and missing/false dismissal receipts fail acceptance.

`node tests/tooling/android-touch.cjs` passes four scale/origin cases and eight
negative controls; the same center guard rejects the actual #35 trace.
`node tests/tooling/repository-migration.cjs` retains all original controls and
now rejects eight missing/wrong upgrade receipts, including no-show evidence.
Source syntax/lifecycle, 24 startup assertions and task context passed locally.
Chrome cannot start a Unix socket in this local environment, so browser/native
acceptance ran in Actions. No independent human review is claimed.

## Exact integrated validation

[Validation receipt](validation.json) records all six required workflow_dispatch
runs on `4239bc1423c638d266abdc305be6ede01bfa7c11`, both full jobs and all
219 PASS rows. Full [run 40228269101](https://github.com/xariib/Lumenfall/actions/runs/40228269101)
passed 189 deterministic main scenarios; its separate original offline job
completes the 190-case default plan. The five companion workflows all PASS.
The commit was integrated with a non-force expected-head lease from 8763d72f;
GitHub marks PR #10 merged at that exact SHA. Validation ran on the feature ref
before integration; the tested commit/tree is identical on main. The release
workflow checked all six exact-SHA manual gates again before publishing.

Pre-publication [Android #36](https://github.com/xariib/Lumenfall/actions/runs/40228197587)
PASS: [upgrade receipt](android-36-upgrade.json), [identity](android-36-identity.txt),
[packaged assets](android-36-assets.json). Actual native Continue, Wisp Ability
purchase and Farm hint → full details → focused original Lab card pass.

## Published APK and public download

[Android 0.2.37](https://github.com/xariib/Lumenfall/releases/tag/android-1000037)
was published by [build #37](https://github.com/xariib/Lumenfall/actions/runs/40232297209).
VersionCode 1000037; package `com.lumenfall.app`; original A9:1C:BF:34…AD:3E:21
certificate retained. [Release identity](release-identity.txt),
[commit](release-commit.txt), [asset manifest](release-assets.json),
[completed exact-APK upgrade](release-emulator-upgrade.json) and
[checksum](release-apk-sha256.txt) are preserved here.

An anonymous public APK download produced SHA-256
`172ad5c6c1ce20042303cd390d4255db3a9fc7a68c6a069aa94d11fa0e668804`, matching
the public checksum and successful upgrade receipt. Local receipt verification
and [verification of the downloaded packaged assets](public-assets-verified.json)
passed. Android12/API31/WebView91 actual in-place upgrade retained UID, origin,
both saves, paid Study/progression and legacy entitlements. Release #37's
receipt requires the real recap and native touches; this is not a no-show pass.
[Public release screenshot](release-0.2.37.jpg).

## Preserved limitations

Diagnostic #33 (`40225903851`, artifact `12610384652`) failed in new QA session
cleanup. #34 (`40226422376`, artifact `12611527520`) rejected the unproven fixture
execution. Both setup defects were fixed before #35 and final native acceptance;
they are not product defects. The automated session-lifetime review finding is
fixed/resolved. Physical phone, exact WebView60, TalkBack and human visual/startup
pacing remain open. The pre-existing phase-sensitive Void VFX finding is recorded
in its separate proposal and is not claimed fixed. User phone testing is next.
