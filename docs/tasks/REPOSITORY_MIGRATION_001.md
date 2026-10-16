# REPOSITORY_MIGRATION_001 — migrate and release the current combined game

Owner: this feature chat. Status: IN PROGRESS; qualified native upgrade preflight
PASS, main integrated; full CI fixes and release pending. [PR1](https://github.com/xariib/Lumenfall/pull/1).
[Current continuation](../qa/repository-migration-001/CONTINUATION.md) and
[complete evidence/failed attempts](../qa/repository-migration-001/README.md).

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

## Baseline and preservation

Isolated codex/repository-migration at
validation-evidence/repository-migration-worktree. Selected8f46153 sourceSHA256
9cdcd80ca9010f03a71704562c2d3d7cd18bd9795d3c67af6892a1148583ece8.
Shared local/full-debug d2ae094 is older. Other worktrees, including uncommitted
visual-polish product/test/workflow work, remain untouched. Origin now points to
xariib/Lumenfall; old URL remains legacy-origin. Destination initiallyeba021e
README-only; its ancestry, exact README bytes and visible description preserved.
Main815b348 contains only that README and safe workflow bootstrap, not the game.
All available local history preserved; unavailable old pre-import objects404 are
not claimed recovered. Historical archives remain unchanged;1509 archive checks
PASS. Reviewed4206 untracked/ignored outputs:3586 retained/877068875 bytes match
source SHA256 AND committed raw Git blobs,620 temporary/empty outputs excluded;
no original files deleted. Manifests/proof linked in evidence README.

Product edits: Comet stage native scrolling, enlarged Wisp effect text wrapping,
and pure Amount integer/parsing optimization needed for the unchanged CI deadline.
All other production JS, package/config, locked dependencies and assets remain
byte-identical to8f46153. Current productSHA256
d4a55cde9135d078a6da16ff85ddee831129c631312c30c1ea3c90efa00372e5.
[Exact proof](../qa/repository-migration-001/product-preservation.json).

## Current implementation and checks

Original key privately provisioned as encrypted Actions secret
LUMENFALL_KEYSTORE_BASE64, certificate/MAC/private challenge reverified. Publisher
is dispatch-only, publish=false by default. Shared1000000+run_number versioning
and published-release guard reject stale/equal/unknown APK versions. Publication
requires main and latest successful manual runs of all six gates on exact SHA,
verified final package/certificate/version, exact15 assets/origin and a completed
native receipt bound to APK SHA/version/UID/save/progress/paid Study. No preflight
can be published. README currently links /releases pending the matching release.

Current PR headfcf1077: Comet38896647847, Forge38896647913, Lab38896647868,
Shared38896647844 and Tree38896648089 PASS. Full38896647886 attempt1 failed Chrome
startup handshake before mobile assertions; failed evidence retained, unchanged
job rerun attempt2 IN PROGRESS. Earlier Full reached Guidance and exposed its QA
server's missing .css MIME/fallback fonts; fixed server plus mandatory loaded
Manrope400/700, original typography/assertions/inverses unchanged. Local actual-
font bounded probe and full default16 profiles/160 samples/80 word measurements
PASS. Earlier fallback-font receipts are not real-font acceptance.

Stale schema/gates/caps and wide count/debit fixtures reconciled with accepted
endless behavior without game changes or skipped controls. All focused modern
and actual V8.6.0 results are source-qualified in evidence. Swift22 positives/16
original controls; Prism341654/seven; closeout540/1248 V8 cases3277; Tree offline/
economy/mobile; Comet12738/12/10; Forge27396/12; real one-second8h golden phases
unchanged; payment3360; recovery/refund/purchase regressions PASS. Self-review and
automated validation only; no independent review claimed.

Qualified native build-only38900729111 on4dbe3e3 PASS. Downloaded actual APK and
rechecked completed receipt/hash/assets/identity: original certificate,
com.lumenfall.app,158→1000012/0.2.12, same UID10145 and https://localhost. Android12/
API31, WebView91.0.4472.114: real old-app cold fixture, actual install-r, BOTH
migrated persisted slots retain currencies/progression/rarity/modules/Ultimate,
Tree/Forge, paid Study work and queue/Auto-Ascend choices, equipped cosmetics and
Trial marks. All four actual old purchases preserved via ownership or approved
legacy entitlement/350 once credits. New recruitment entitlements present.
[Receipt](../qa/repository-migration-001/qualified-native-upgrade.json),
[identity](../qa/repository-migration-001/qualified-native-identity.txt) and
[exact assets](../qa/repository-migration-001/qualified-native-assets.json).
This preflight APK is UNPUBLISHED; final exact-main build still required.

Earlier green job omitted receipt and remains identity/assets-only, not upgrade
PASS. Prior failures retained honestly: API29 native stock-WebView font crash;
API35 hosted emulator loss; KVM workaround unproved/removed. API31 exposed missing
Page agent then an invalid fixture expectation (Meteor did not exist in158).
Actual old purchases now proved before replacement. No game code changed.

## Remaining acceptance and next action

1. Inspect current Full and native runs; fix actual failures without weakening
   gates. Save logs and qualified receipts. Do not label job green as retention
   without completed receipt. Keep task/continuation current.
2. Integrate correct combined candidate preserving histories/content. Run all six
   required manual workflows on exact integrated main SHA, then guarded
   publish=true build on same SHA with completed identity/assets/native receipt.
3. Download actual latest APK, compare build hash/assets/identity and verify an
   anonymous request to stable README URL returns those exact signed bytes.
   Update README link, task/state and final release evidence in GitHub.

Physical phone, exact WebView60, TalkBack and human pacing/performance acceptance
remain unverified. Emulator uses an archived signed synthetic baseline and does
not require a particular version on the user's phone. Historical pre-import Git
objects unavailable; old external links remain historical. No chat archive or
complete delivery claim while release/required acceptance remains outstanding.
