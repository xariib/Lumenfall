# Android and human acceptance — not executed

This records the remaining checks from the [approved requirements](REQUIREMENTS.md).
It adds no gameplay rule, timing threshold or release authorization.
The isolated candidate is source SHA256
`9cdcd80ca9010f03a71704562c2d3d7cd18bd9795d3c67af6892a1148583ece8`.
The [current receipt](experiments/late-guidance/final-validation.json) separates executed
desktop checks from these outstanding checks. No new APK has been built.

| Check | Evidence required on the actual combined build | Current status |
|---|---|---|
| Build and identity | APK SHA256, combined commit, approved release version, package `com.lumenfall.app`, and certificate matching the established signing identity | No JDK/SDK/signing build available |
| Packaged assets | Extracted APK HTML matches the accepted source; all fonts and branding match the staged manifest; no QA bridge, fixtures or CI runtime guard ships | Source/staged/HTTP15 assets match; APK comparison not executed |
| Installed-save upgrade | Upgrade the previously signed installation without clearing app data; compare recruits, currencies, rarity, abilities, Ultimates, Tree/Forge/Lab, paid running projects, receipts and automation | Engine migration/recovery tests pass; installed upgrade not executed |
| Recruitment retention | Previously unlocked Wisps remain recruitable after Ascend under the higher new gates; repeat load/import/Ascend does not grant a second migration benefit | Engine checks pass; native not executed |
| Mastery purchase | Real input buys one rank with the shown exact Prism/Sigil debit and10% own-Power increase; insufficient funds/development refuse without a debit; focus stays in the Wisp card | Current Chromium913/12 profiles include Mastery and guidance; native not executed |
| Mastery retention | Ascend, close/relaunch and backup/import retain rank and existing upgrades; Support duration, strength and recast remain unchanged | Warm/cold/storage/Support checks pass; native not executed |
| WebView60 | Run the packaged app on the required legacy WebView, including startup, requirements, wide balances, purchase, save and recovery | Current actual V8 6.0.286.52 progression62 pass; native DOM/WebView not executed |
| Catch-up chronology | Complete the requested online/offline window with matching rewards/counters/purchases and strict remaining-HP tolerance; retain unrestricted Auto-Ascend and paid timer boundaries | Full12h accounting/cold split and strict warm/cold checks pass on desktop; native not executed |
| Catch-up performance | Record device/WebView identity, requested window, total processing time, longest interruption and actual ability to continue playing | F baseline desktop foreground12h296s/max slice281ms; device acceptability unverified |
| Accessibility | Small mobile screen and enlarged text; readable requirements/prices/Current/Next; touch targets, keyboard/switch focus and TalkBack announcements | Chromium mobile/enlarged-text checks pass; physical input/TalkBack not executed |
| Human pacing | Review source-qualified milestone, wall and purchase-investment evidence; distinguish simulations from observed player/device acceptance | F fresh60d/180d plus regular7d recoveries and further10d Lab gates measured; human acceptance not recorded |

Use the existing `scripts/verify_apk_identity.cjs` with the actual APK, native
tools, approved version and trusted certificate fingerprint. Its self-test
passes, but that does not verify an APK. Preserve original player saves and
already-running paid work during installed-upgrade checks.

Remote Linux CI, the historical Guidance baseline/inverse check, combined
integration and publication remain open. The connected GitHub account cannot
currently access `karahaNx/Lumenfall`; the user-approved new destination URL is
pending. Preserve verified baseline/signing identity. No main integration, release or archive
is claimed by this document.

## User correction — 16 October 2026

The user confirms the old GitHub account is flagged and intends to publish from
another account's repository (destination URL pending). Existing players must
install the new APK as an update without uninstalling or losing progress.
Visual work may continue from local product commit838dbda/source9cdcd80c.

The repository owner is separate from Android app identity. Preserve
`com.lumenfall.app`, the established signing certificate, Capacitor origin and
save/recovery storage. Recover the original signing key: the current build
workflow downloads `Lumenfall-debug.keystore` from release `lumenfall-signing-v1`;
copying Git history alone does not recover that release asset. Keep private
signing material out of ordinary source commits and chat output.

The user confirms this is a private draft release and supplies certificate
SHA-256 `A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21`,
matching both current workflow expectations. Fresh access check16Oct: connected
login `xariib` gets404 for repository metadata and the releases collection;
the in-app browser redirects releases to GitHub sign-in. No keystore bytes
were retrieved, no certificate was verified from a keystore, and no signing
material was moved. Original-account sign-in or a user-downloaded local key
is needed before retrieval/verification can continue.

The current workflow derives APK version information and its verification
expectations from `github.run_number`. A new repository's counter cannot be
used blindly. Verify the highest distributed/installed versionCode, then make
the version setter and verifier use a continuing higher release version.
These are recorded migration requirements; no repository, workflow or signing
change has been applied. Check the actual APK certificate/package/version and
perform an installed-save upgrade test before claiming update compatibility.

Platform references: [Android signing](https://developer.android.com/studio/publish/app-signing#considerations)
and [versioning](https://developer.android.com/studio/publish/versioning#appversioning).
