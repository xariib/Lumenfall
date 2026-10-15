# Android and human acceptance — not executed

This records the remaining checks from the [approved requirements](REQUIREMENTS.md).
It adds no gameplay rule, timing threshold or release authorization.
The isolated candidate is source SHA256
`4b052487793c768611ff39ba88872c0a3f4ea3aeaf217616e104bfd3eb34ac45`.
The [current receipt](experiments/applied-f-checkpoint.json) separates executed
desktop checks from these outstanding checks. No new APK has been built.

| Check | Evidence required on the actual combined build | Current status |
|---|---|---|
| Build and identity | APK SHA256, combined commit, approved release version, package `com.lumenfall.app`, and certificate matching the established signing identity | No JDK/SDK/signing build available |
| Packaged assets | Extracted APK HTML matches the accepted source; all fonts and branding match the staged manifest; no QA bridge, fixtures or CI runtime guard ships | Source/staged/HTTP15 assets match; APK comparison not executed |
| Installed-save upgrade | Upgrade the previously signed installation without clearing app data; compare recruits, currencies, rarity, abilities, Ultimates, Tree/Forge/Lab, paid running projects, receipts and automation | Engine migration/recovery tests pass; installed upgrade not executed |
| Recruitment retention | Previously unlocked Wisps remain recruitable after Ascend under the higher new gates; repeat load/import/Ascend does not grant a second migration benefit | Engine checks pass; native not executed |
| Mastery purchase | Real input buys one rank with the shown exact Prism/Sigil debit and10% own-Power increase; insufficient funds/development refuse without a debit; focus stays in the Wisp card | Chromium493/12 profiles pass; native not executed |
| Mastery retention | Ascend, close/relaunch and backup/import retain rank and existing upgrades; Support duration, strength and recast remain unchanged | Warm/cold/storage/Support checks pass; native not executed |
| WebView60 | Run the packaged app on the required legacy WebView, including startup, requirements, wide balances, purchase, save and recovery | Actual V8 6.0.286.52 engine143/progression56 pass; native DOM/WebView not executed |
| Catch-up chronology | Complete the requested online/offline window with matching rewards/counters/purchases and strict remaining-HP tolerance; retain unrestricted Auto-Ascend and paid timer boundaries | Full12h accounting/cold split and strict warm/cold checks pass on desktop; native not executed |
| Catch-up performance | Record device/WebView identity, requested window, total processing time, longest interruption and actual ability to continue playing | Desktop foreground12h296s/max slice281ms; substantial cost, device acceptability unverified |
| Accessibility | Small mobile screen and enlarged text; readable requirements/prices/Current/Next; touch targets, keyboard/switch focus and TalkBack announcements | Chromium mobile/enlarged-text checks pass; physical input/TalkBack not executed |
| Human pacing | Review source-qualified milestone, wall and purchase-investment evidence; distinguish simulations from observed player/device acceptance | Six fresh60d policies measured; mature earned campaigns continue; human acceptance not recorded |

Use the existing `scripts/verify_apk_identity.cjs` with the actual APK, native
tools, approved version and trusted certificate fingerprint. Its self-test
passes, but that does not verify an APK. Preserve original player saves and
already-running paid work during installed-upgrade checks.

Remote Linux CI, the historical Guidance baseline/inverse check, combined
integration and publication remain open. The connected GitHub account cannot
currently access `karahaNx/Lumenfall`; do not substitute another repository or
an invented baseline/signing identity. No main integration, release or archive
is claimed by this document.
