# Play Protect review draft — Android0.2.139

**Draft only, not submitted.** The user confirmed on19 November2026 that the
harmful-app warning concerns0.2.139 from the Lumenfall GitHub release. The exact
warning string/screenshot, Android version and device model remain missing.
Do not describe an unobserved warning category or claim Google has cleared it.

Suggested factual text after completing the device/warning fields:

> Please review the Play Protect classification of Lumenfall, an Android idle RPG
> built with Capacitor and bundled local HTML/JavaScript game assets. The player
> reports a harmful-app installation warning for the APK identified below.
> We have not identified Google's reason for the classification. The public file
> was downloaded again and its SHA256 and game assets matched our release records.
> This verification is not a malware scan or a Google safety verdict.

- Package: `com.lumenfall.app`.
- Version: `0.2.139`, versionCode `1000139`.
- Source: `ceb2463f83d49402e2702e987af89958790b16db`.
- [APK download](https://github.com/xariib/Lumenfall/releases/download/android-1000139/Lumenfall.apk).
- APK bytes: `5164025`.
- SHA256: `cd5ad9f74c45ac0c71482219603caf46889fa2e29c58579ab15af7a225e44bd9`.
- Recorded signer SHA256:
  `A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21`.
  Fresh inspection: `CN=Lumenfall, O=Xarib Productions, C=DK`, RSA2048,
  SHA256withRSA, valid25September2026–9February2054. Legacy "debug" file/alias
  names do not make it an Android debug certificate. Production debugging is disabled.
- [Published package identity](https://github.com/xariib/Lumenfall/releases/download/android-1000139/identity.txt).
- [Published static security report](https://github.com/xariib/Lumenfall/releases/download/android-1000139/security.json).
- Permissions: INTERNET, REQUEST_INSTALL_PACKAGES and the app's
  DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION. The APK updater checks GitHub,
  downloads a newer APK after player action, verifies it and asks Android to
  approve installation. Do not describe the current APK as having no updater.
- No SMS, contacts, accessibility-service, notification-listener or broad-storage
  permissions appear in the recorded final manifest.
- The separate Play candidate omits that native updater and its permission;
  it is unsigned preparation, not a newly approved replacement for this APK.
- Exact on-device warning/screenshot: **pending**.
- Device model, Android version and reproduction date: **pending**.

Use [Google's warning guidance](https://developers.google.com/android/play-protect/warning-dev-guidance)
and [classification appeal form](https://support.google.com/googleplay/android-developer/contact/protectappeals).
This draft does not authorize sending an external message or classify the app
as a false positive. The form submitter must provide the observed warning and
verify the form's current fields. No VirusTotal or other public sample upload
has been performed.
