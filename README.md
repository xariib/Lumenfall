# [Download latest Android APK](https://github.com/xariib/Lumenfall/releases/latest/download/Lumenfall.apk)

Install Lumenfall on Android by downloading **Lumenfall.apk**, opening it, and
allowing **Install unknown apps** for your browser or file manager if Android asks.

**Existing players: install the new APK as an update without uninstalling.**
Keep the existing app and its data. This repository move retains the original
package, signing certificate and save origin. Settings → Save Backup provides
an additional copy of your progress. If Android rejects an update, keep the
installed app and your backup while checking the package/version/certificate.

## Lumenfall

Lumenfall idle

Lumenfall is an Android idle RPG: build a party of Wisps, push deeper into the
Rift, farm resources and Ascend for permanent growth.

## Current features

- Endless progression, permanent Wisp Mastery and guidance toward useful upgrades.
- Wisp recruitment, Rarity, abilities, Ultimates and Formation Bonds/presets.
- Rift Forge, Research Lab, Ascension Tree, Comet purchases and automation.
- Chronological online/offline progression, save recovery and export/import.
- Visible deterministic prices/effects and fixed eligible Luminous Mote payouts.
- Mobile layouts, enlarged text and self-hosted fonts/branding.

## Development and checks

Clone [xariib/Lumenfall](https://github.com/xariib/Lumenfall). Read [AGENTS.md](AGENTS.md),
[bootstrap](PROJECT_BOOTSTRAP.txt), [current status](docs/PROJECT_STATE.md) and the
relevant task. Use Node.js 24.19.0 for the full regression suite, Git and Chromium.
There is no root npm test script.

```sh
node scripts/codex/check_context.cjs --task docs/tasks/REPOSITORY_MIGRATION_001.md
node scripts/ci/validate_source.cjs
node scripts/verify_apk_identity.cjs --self-test
node tests/tooling/run.cjs
```

Follow [environment setup](docs/project/CODEX_START.md) and the required
[CI gates](.github/workflows/pre-merge-validation.yml). Windows uses the documented
Chromium override; POSIX tooling acceptance runs on Linux.

## Android builds and releases

The [Android workflow](.github/workflows/build-android.yml) stages root index.html,
fonts and branding, installs locked Capacitor dependencies, generates/syncs the
Android project, builds with JDK17/Android SDK and verifies the signed APK.
Publication is explicitly dispatched after validation; a push alone cannot
publish. Only the original signing key is accepted, privately provisioned through
the repository Actions secret LUMENFALL_KEYSTORE_BASE64. Never commit or publish it.

Versioning uses a repository-independent base plus the workflow run number, with
a floor above historical builds. The setter and APK verifier share the same
computed version. Package com.lumenfall.app, Capacitor origin and player storage
are retained. Missing/wrong signing material or failed identity/assets aborts.

Local native builds require Node.js 20+, JDK17, Android SDK and the original key;
use the workflow steps for staging, Capacitor generation and Gradle signing.
Keep signing material outside Git. Modern desktop browser results do not prove
physical-device, legacy WebView or TalkBack acceptance.

## Project documentation

[Source index](docs/CONTEXT_INDEX.md) · [Feature workflow](docs/project/FEATURE_WORKFLOW.md) ·
[Migration/release status](docs/tasks/REPOSITORY_MIGRATION_001.md) ·
[Endless progression](docs/tasks/ENDLESS_PROGRESSION_001.md) ·
[Known issues](docs/project/KNOWN_ISSUES.md) · [Account recovery](docs/project/ACCOUNT_RECOVERY.md).

The original destination README is [preserved](docs/qa/repository-migration-001/destination-original-README.md).
Historical originals and evidence retain their original repository references.
