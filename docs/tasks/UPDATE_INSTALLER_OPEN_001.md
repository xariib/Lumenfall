# UPDATE_INSTALLER_OPEN_001 — open Lumenfall from the Android installer

On 6 November 2026 the player reported that the game closed during an update
and opened on the new version when launched again. They asked whether it could
reopen automatically, then approved using Android's **Open** button after install.

Baseline: main `a75763d3`, public Android 0.2.95. The existing installer intent
requests a result, which bypasses the Android success screen. Let the installer
show that screen and verify the installed version if the original call returns.
Android controls whether it displays **Open** on a particular device.

Preserve source permission, Android approval, APK verification, cancellation and
retry, and save protection. Android acceptance must tap **Open** after an approved
update and see the new version in the foreground before any test-driven relaunch.
The existing save and origin assertions still run after that launch.

Status on 6 November 2026 (Europe/Copenhagen) is released as
[Android 0.2.98](https://github.com/xariib/Lumenfall/releases/tag/android-1000098).
[PR #43](https://github.com/xariib/Lumenfall/pull/43) integrated exact source
`f50415e387d822e600d3bda496f49664309e589d`. **Open** applies to in-app updates
started from this release or a later version with the change.

The updater controller, native operation, APK policy, PR checks and all six
release workflows passed. [Full PR regression](https://github.com/xariib/Lumenfall/actions/runs/42134730538)
and [release regression](https://github.com/xariib/Lumenfall/actions/runs/42138925809)
both passed, including isolated offline catch-up.

[Signed build 42134735443](https://github.com/xariib/Lumenfall/actions/runs/42134735443)
passed installer cancellation, retry, launch from **Open**, both save slots,
the WebView origin and retail Android launch. The user approved publication.
[The 0.2.99 rebuild](https://github.com/xariib/Lumenfall/actions/runs/42177754603)
passed the updater tests on both attempts and timed out in the retail emulator's
accessibility check. The released APK uses the exact 0.2.98 artifact that passed
all checks. Anonymous versioned and latest downloads matched the in-game feed,
checksum and signed test receipts. The APK is 5,161,857 bytes and its SHA-256 is
`b35b20f347f89b3947586a11faef15aa5c1994bf4c7c6f3007efbe5d3efef4a2`.
Physical-phone acceptance remains open.

## Incomplete installation follow-up

The player confirmed 0.2.98 was installed after reporting a Danish Play Protect
warning during an in-app update. The screenshot shows a harmful-app warning.
It does not identify the exact APK or the reason for the classification.

The native updater now reports the installed version if Android returns before
the update completes. Preserve the verified APK for retry and leave the Android
completion screen in control of **Open**. The signed build must still pass the
save upgrade, installer cancellation/retry and **Open** tests.

Google handles the Play Protect classification separately. The public 0.2.98 APK
matches its tested hash. A signed build and static checks establish artifact
identity and configuration. A fresh Google verdict is still needed.
