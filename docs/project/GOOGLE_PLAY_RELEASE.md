# Google Play preparation — Lumenfall

Status19 November2026: build candidate preparation, **not ready for store upload**.
Owner/checkpoint: [GOOGLE_PLAY_READINESS_001](../tasks/GOOGLE_PLAY_READINESS_001.md).
The user reports a harmful-app warning. Its precise string, flagged version/hash,
device and Google's reason are unverified. No classification fix is claimed.

## Immediate Play Protect investigation

Keep the exact flagged APK, source URL, SHA256 and warning screenshot together.
The user confirms the warning concerns GitHub0.2.139; the phone file was not
independently hashed. A fresh anonymous download of that release (`1000139`)
matches all15 source assets,5,164,025bytes and SHA256
`cd5ad9f74c45ac0c71482219603caf46889fa2e29c58579ab15af7a225e44bd9`.
[Existing release evidence](../qa/team-progression-001/support-year/delivery.json),
[fresh verification](../qa/google-play-readiness-001/public-apk-verification.json)
and an [unsubmitted review draft](../qa/google-play-readiness-001/play-protect-review-draft.md)
are saved. Static tests are not a malware
verdict, and changing a filename or signing key is not a demonstrated remedy.

Follow [Google's warning guidance](https://developers.google.com/android/play-protect/warning-dev-guidance).
For an erroneous harmful classification, use the
[Play Protect appeal](https://support.google.com/googleplay/android-developer/contact/protectappeals)
after identifying and reviewing the exact file. Supply only verified facts:
package/version/hash/download URL, signer fingerprint, actual warning and device,
the app's purpose, permissions and updater behavior, security and dependency
receipts. The positive0.2.95 scan is historical, not proof about another APK.
No appeal or external message has been sent by this feature.

## Candidate build

[Build Google Play candidate](../../.github/workflows/build-google-play-candidate.yml)
generates a fresh project using the existing pinned Capacitor runtime. It targets
API36 using AGP8.13.2/Gradle8.13, retains minSDK22 and the original WebView origin,
uses Lumenfall branding and builds an unsigned AAB plus an inspection APK.
The native GitHub APK updater is absent, including its permission, provider and
DEX code; Settings already hides its update section when the plugin is absent.
Google Play handles updates for a future store build. Existing APK distribution
and its signing/build workflow are unchanged.

The artifact is deliberately labelled **unsigned**, version0.0.1/code1, and cannot
be uploaded as a release or installed as an update. The workflow performs build,
lint, static package checks and exact APK/AAB source asset comparison. It does
not publish, sign a release, exercise a Play install or certify Play Protect.
Keep the full existing pre-merge gates. A successful candidate build alone is
not acceptance of the channel on devices or approval by Google.

## Account and signing blockers

The user has created a dedicated Gmail account; Play Console enrollment is not
confirmed. [Register in Play Console](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)
using that account, complete Google's account/identity/device verification and
the one-time US$25 registration fee. No Play Console connection was found in
the available plugin search; account state has not been inspected.

The established APK certificate uses `androiddebugkey`; production debugging is
disabled, but the **signing certificate** is still a debug certificate. Google
[does not accept debug certificates](https://developer.android.com/studio/publish/app-signing)
for publishing. A new upload key only authenticates uploads; Play's app-signing
key signs installations. It does not by itself make those installations compatible
with the existing key. Do not replace the existing keystore or assume Play can
update the sideloaded app while preserving its sandbox.

Before allocating a real Play version/signing identity, establish in Play Console
whether an officially supported signing lineage/migration is available for this
existing debug-signed package. Preserve `com.lumenfall.app`; do not change package
or signing identity as a workaround. If seamless migration is unsupported,
resolve the migration requirement with the user. The existing Copy Current Save /
Restore Save feature can be tested as an explicit fallback, but is not yet an
accepted migration and must not lead to uninstalling the current game or losing
saves. Exercise primary/recovery data, paid progression, offline clocks and both
old/new Android versions with the actual distribution certificates.

## Remaining acceptance and store material

- Allocate a real monotonically increasing version after inspecting GitHub
  releases and Play Console tracks; code1 is only a disposable build check.
- Set up release/upload signing and Play App Signing securely, verify signer
  certificates and signature lineage; never commit keys or passwords.
- Validate the signed bundle with bundletool and Play Console, and test the APKs
  actually generated by Play. Confirm package, source assets, no installer code,
  permissions and absence of unintended native libraries/16KB alignment issues.
- Test actual installs, updates and saves plus API36 edge-to-edge/status/navigation
  bars, back navigation, keyboard, rotation, accessibility and old WebView support.
  [Android16 target changes](https://developer.android.com/about/versions/16/behavior-changes-16)
  require device checks beyond compilation. No runtime compatibility is claimed yet.
- Add a public, non-editable privacy-policy URL and an in-app policy link, with
  verified developer/contact identity and real data practices. Audit Android
  backup and every SDK before completing Data safety. Current game progress is
  local; that observation alone is insufficient to sign off the declarations.
- Prepare screenshots, feature graphic, short/full descriptions, app category,
  countries, content rating, target audience, ads and app-access declarations.
  No real-money billing SDK was found; in-game currency upgrades do not prove
  the presence of in-app purchases. Verify the intended store offering.
- Start internal testing, resolve pre-launch report findings, then complete
  [required closed testing](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)
  where applicable (new personal accounts:12 continuously opted-in testers for
  at least14days before applying for production access). Google review is separate.
- Preserve integrated CI, signed artifact, device and Google verdict evidence in
  GitHub before marking the feature complete. No Play listing or install link
  exists yet, and store distribution does not guarantee future malware verdicts.

Google's [target requirement](https://developer.android.com/google/play/requirements/target-sdk),
[installer permission policy](https://support.google.com/googleplay/android-developer/answer/12085295?hl=en)
and [review declarations](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
were checked19 November2026. Recheck at actual submission.
