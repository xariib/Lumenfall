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

Status: local candidate. Changed `mobile/native/AppUpdaterPlugin.java`,
`scripts/ci/android-updater.cjs` and `README.md`. The context, updater controller,
native operation and policy, CI script syntax, and whitespace checks passed.
Android acceptance, integration and public delivery are pending.
