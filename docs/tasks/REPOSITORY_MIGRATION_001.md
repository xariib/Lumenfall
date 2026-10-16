# REPOSITORY_MIGRATION_001 — migrate and release the current combined game

Owner: this feature chat. Status: COMPLETE, 16 October 2026. Latest signed APK published
and actual anonymous download verified. [Evidence](../qa/repository-migration-001/README.md).

## Original user requirements

Migrate and release to xariib/Lumenfall because the old account is flagged. Start
from local codex/endless-progression commit8f46153 at
validation-evidence/endless-progression-worktree, never the older shared checkout.
Use an isolated migration branch/worktree and inspect overlapping work. Preserve
available Git history, complete project, requirements/tests/assets and historical
evidence. Review necessary untracked files; exclude credentials/private keys,
dependencies and browser temporary files. Preserve existing destination content;
no force-push or blind overwrite. Update current references/setup/docs while
preserving archived originals unchanged.

README first prominent item must be “Download latest Android APK”. After the
matching release exists, use and verify this exact stable link:
https://github.com/xariib/Lumenfall/releases/latest/download/Lumenfall.apk
Then short install/update help, overview/features/build/docs. Existing players
install the new APK as an update WITHOUT uninstalling or losing progress.

Use only original C:/Users/xarib/Downloads/Lumenfall-debug.keystore outside Git;
never commit/print/publish it or generate a replacement. Privately provision new
workflow signing. Expected certificate SHA256:
A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21.
Retain com.lumenfall.app, Capacitor origin, primary/recovery saves/migrations,
progression, purchases and paid entitlements. Continue Android versionCode above
previous distributed builds; setter/verifier must agree. Inspect triggers and
configure signing/versioning before anything can publish. Required CI/regressions
must pass without weakened gates. Verify APK package/cert/version/assets and
available installed-update/save checks. Do not demand one particular installed old
version; report physical-device limitations. Publish latest release, verify README
download and save delivery evidence/limitations in GitHub. Carry through delivery.

## Verified delivery

[Latest Android APK](https://github.com/xariib/Lumenfall/releases/latest/download/Lumenfall.apk) · [Release 0.2.14](https://github.com/xariib/Lumenfall/releases/tag/android-1000014).
VersionCode **1000014**, package **com.lumenfall.app**. Install as an
update over the existing app **without uninstalling**. Original certificate,
https://localhost Capacitor origin and primary/recovery save identity retained.
APK SHA256: 2b259738be4c776834fa11b8dbcf82d215385aedcdf9282b574db870d2124751.

Release builds exact integrated main **de1338cd40cca13a765cc42181a7f856d8711d6b**, selected-source8f46153 and
initial-destinationeba021e both ancestors. The isolated migration branch remains
codex/repository-migration; [PR1](https://github.com/xariib/Lumenfall/pull/1) is merged.
The older shared checkout and other active worktrees were not used or overwritten.

## Checks and evidence

All six manual workflows pass on the exact release commit. Full38964041764
requires BOTH main189 and offline1 jobs; all190 default cases remain covered.
Comet38964045577, Forge38964049244, Lab38964052833, Shared38964056380 and
Tree38964059937 pass. [Metadata and compressed logs](../qa/repository-migration-001/ci-de1338-release/).
Original offline assertions/oracles/reference replays remain byte-identical8f;
five independent workers finish within the unchanged300000ms overall deadline
(Linux220045ms, local126949ms). All18 records exactly equal original/current
sequential baselines. Twelve worker, eight coverage and eleven publisher controls
fail closed. Source/math/automation/save/refund/purchase/UI/runtime gates pass;
no CI gate was skipped or weakened. Self-review and automated validation only.

Final signed APK identity is verified by actual Android aapt/apksigner; its
exact15 packaged production assets match source d4a55cde. The final native
receipt and local reverification bind the exact APK SHA and version. On Android12/
API31, WebView91.0.4472.114: actual original signed158 cold restart, adb install-r,
same UID/origin, BOTH migrated saved slots, currencies/progression, Rarity/modules/
Ultimate, Tree/Forge, running paid Study work, saved queues/Auto-Ascend choices,
old purchases/legacy350 once-only credit/cosmetics/Trial marks and recruitment
entitlements pass. This uses disposable synthetic saves; it does not require
any particular installed version on the user's phone.

[Release evidence](../qa/repository-migration-001/release/) includes final build
identity/assets/receipt/hash/run and anonymous download verification. The stable
README URL returns HTTP200 and bytes identical to this verified signed build.
The original keystore remains outside Git and only its private encrypted Actions
secret is provisioned; no key is committed, printed or published. Versioning
uses1000000+run_number and checks every published version before release. Automatic
push publication is disabled; dispatch defaults to build-only, with exact-main
CI, package/certificate/assets/native-receipt guards required for publishing.

## Preservation, changes and limitations

All available selected Git history and destination content are preserved without
force-push. The exact original destination README and visible description remain.
All3586 reviewed historical evidence files877068875 bytes match source SHA256 and
Git blobs;1509 archived-original checks pass. Credentials, keystores, dependencies,
browser profiles and duplicate temporary outputs are excluded. Old pre-import
objects already unavailable404 were not recreated or claimed recovered. Archives
keep their original bytes and historical external links.

Only production changes from8f are the proven Comet native-scroll CSS correction,
enlarged Wisp effect wrapping CSS and pure bounded Amount parse/integer speedups.
Every other production script/package/config/asset remains byte-identical.
[Exact preservation proof](../qa/repository-migration-001/product-preservation.json)
and independent arithmetic/legacy-engine/full-state golden evidence are retained.
No save schema, balance, progression, purchase or paid entitlement change was
introduced by migration. Rejected and failed experiments stay historical evidence,
fully reverted; earlier failed/receipt-less builds are never labelled accepted.

Physical-phone, exact WebView60 DOM, TalkBack and human pacing/performance checks
remain unverified. Actual legacy V8 engine checks and modern browser/emulator
results are source-qualified; they do not prove those unavailable checks.
All available migration/release acceptance requested here is complete. No further
migration action is pending; future changes need their own scoped validation.
