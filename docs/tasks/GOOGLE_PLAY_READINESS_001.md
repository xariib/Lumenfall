# GOOGLE_PLAY_READINESS_001 — trusted Android distribution

Original request (19 November 2026): "when the apps gets installed, it should
not be seen as a red flag in play protect also maybe just directly ready to
install via Google play".

Goal: prepare a verifiable Google Play distribution candidate and investigate
the reported installer warning without claiming control over Google's verdict.
Owner: this feature chat. Status: in progress; store/device acceptance pending.

## Baseline and scope

- Current main: `c18e6189`; latest recorded APK: Android0.2.139, source `ceb2463f`.
- Isolated branch `feature/google-play-readiness-001`, worktree `C:/lf-google-play`.
  Original checkout and other feature worktrees are preserved. GitHub open-PR
  query returned none on 19 November. Read workflow triggers before remote work.
- [Earlier Play Protect investigation](PLAY_PROTECT_001.md) records a positive
  phone scan for0.2.95, not a verdict on the latest APK. The user now reports
  "Just that it's harmful" and has created a dedicated Gmail account. Actual
  warning string/screenshot, flagged APK identity and Console enrollment remain
  unknown. The user subsequently confirmed the flagged version/source is
  GitHub0.2.139; phone-side file hash was not independently measured.
- Existing production APK disables debugging but is signed using the preserved
  `androiddebugkey` certificate. The native GitHub APK updater adds
  `REQUEST_INSTALL_PACKAGES`. Neither a Google Play channel nor AAB build exists.
- Preserve package `com.lumenfall.app`, HTTPS localhost WebView origin, gameplay,
  both saves, balance, existing sideload signing and signed APK updater behavior.
  Do not change signing identity or tell players to uninstall their game.

## Acceptance

1. Document current Google requirements using primary sources and distinguish
   unfamiliar-app scanning from a harmful-app verdict.
2. Prepare a separate Play candidate without the APK updater/installer permission,
   with an Android App Bundle, current target SDK and non-debug upload signing.
3. Cover channel isolation and rejection of unsafe/misconfigured Play artifacts;
   retain existing APK security and CI gates. Verify packaged game assets.
4. Record signing/account/privacy/listing/testing requirements and a save-safe
   migration path. Never assume that a new upload key migrates installed apps.
5. Required integrated CI, bundle/native acceptance and actual Play Console review
   must pass before claiming Play readiness or delivery. Google classification
   and physical-device results remain external until observed.

## Findings and decisions

Google currently requires target API36 for new phone apps/updates. Its policy
does not permit a game's self-updater using REQUEST_INSTALL_PACKAGES, and its
signing documentation says Play rejects debug certificates. Build preparation
will keep the existing APK channel intact; no signing rotation is authorized by
an implementation assumption. New binding project rules: none.

Primary sources, checked19 November2026:
- [Play Protect warnings](https://developers.google.com/android/play-protect/warning-dev-guidance)
- [Install permission policy](https://support.google.com/googleplay/android-developer/answer/12085295?hl=en)
- [Target API requirement](https://developer.android.com/google/play/requirements/target-sdk)
- [Signing and update identity](https://developer.android.com/studio/publish/app-signing)
- [Personal-account testing](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)
- [Review declarations](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)

## Implementation and checks

Separate unsigned AAB/inspection-APK workflow, API36/AGP8.13.2/Gradle8.13
configuration, Play-specific permission/provider/DEX guard and exact AAB asset
verification are implemented. Existing APK workflow, index.html, package, save
schema and signing are unchanged. New checks are included in premerge validation.
[Release preparation and blockers](../project/GOOGLE_PLAY_RELEASE.md) distinguish
candidate build, signing/migration, Google classification and store acceptance.

Changed files: new Play workflow, configure_android_play.cjs, google-play.cjs,
this task and release guide; targeted additions to premerge workflow and the
existing APK security/assets verifiers. No gameplay changes or binding rules.

Local Node24.22.1 (CI regression24.19.0). PASS: task context (23142bytes at first
checkpoint), production APK security negative controls, native updater policy
(37assertions), native concurrency/cancellation controls, updater JS controller,
source validation, new Play channel/DEX/APK+AAB negative controls, syntax and diff
checks. Native tests initially failed javac ENOENT; locating installed JDK21.0.8
and adding its bin to process PATH allowed both unchanged suites to pass.
Downloaded npm11.6.2 outside the repo to run pinned npm ci/audit: no high/critical
findings; seven moderate development-tool advisories remain. Generated Android
project confirms baseline API34, minSDK22 and AGP8.2.1 and accepts the Play
configuration. Local Android SDK/adb not available; no local native build claimed.
Self-review and automated checks only. Plugin search found no Play Console
integration; no account enrollment or external app review was performed.

PR: [#63](https://github.com/xariib/Lumenfall/pull/63), initial source05134581
matches local reviewed tree5d70070a (GitHub connector publication; local OAuth
push lacks workflow scope). First candidate run44494228504 passed generation,
branding and source/security tests, then failed because sdkmanager was absent
from runner PATH. Add explicit Android SDK setup; retain the original failure.

Fresh anonymous0.2.139 download:5,164,025bytes, expected SHA256 and all15 exact
game assets PASS. [Public receipt](../qa/google-play-readiness-001/public-apk-verification.json)
and [unsubmitted review draft](../qa/google-play-readiness-001/play-protect-review-draft.md)
record the user's attribution without claiming an independent phone scan.

Next: inspect the corrected native candidate and required CI results,
save evidence and integrate only validated preparation. Account enrollment,
actual full warning/device details, production signing/migration, privacy policy/listing,
Play upload/testing and device acceptance remain open. No store submission,
appeal, new release certificate or APK publication yet. Keep this feature open.
