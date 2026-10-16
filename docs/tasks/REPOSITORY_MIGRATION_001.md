# Repository migration and signed Android release

16 October 2026. IN PROGRESS; same owner, no agents.
Goal: migrate the complete current candidate to xariib/Lumenfall and deliver a
verified latest APK that updates existing installations without losing progress.

User requirements: start from codex/endless-progression 8f46153, never the older
shared checkout. Preserve history, requirements, assets, tests and historical
evidence, including destination content. Review untracked evidence; exclude
credentials, private keys, dependencies and temporary browser data. Update
current repository/setup references, preserving archived originals. README first
item: “Download latest Android APK”, stable releases/latest/download/Lumenfall.apk
after matching publication, installation/update help, features/build/docs.

Use only the original Downloads/Lumenfall-debug.keystore, provisioned privately;
certificate A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21.
Retain com.lumenfall.app, Capacitor origin, saves/recovery/migrations, progression,
purchases and entitlements. Continue versionCode above distributed builds;
configure triggers/signing/versioning before publication. Required CI and relevant
regressions must pass without weaker gates. Verify actual APK identity/assets,
available upgrade/save checks and download. Report physical-device limits.

Baseline: 8f46153, product SHA256 9cdcd80ca9010f03a71704562c2d3d7cd18bd9795d3c67af6892a1148583ece8.
Isolated codex/repository-migration, validation-evidence/repository-migration-worktree.
Destination main eba021e67da1c4f4c8a64fa65b082f978aa92f84 contains README only;
retain its ancestry and original content. Shared local/full-debug d2ae094 is older.
Other worktrees remain untouched; overlapping visual work has uncommitted product/
test/workflow changes and is outside this explicit release baseline.

Inherited limitations: full G4 browser run 215 PASS/five deadlines, all five
isolated retries PASS; missing historical Guidance object684bfc52; Linux CI/native
acceptance outstanding. See [continuation](../qa/endless-progression-001/experiments/CONTINUATION.md),
[signing evidence](../qa/endless-progression-001/signing-recovery/README.md).
Self-review only. No release yet. Acceptance remains OPEN until verified delivery.

Next: authenticate new-repository administration, preserve destination ancestry,
configure private signing and monotonic versioning, restore required historical
CI inputs, validate, integrate, build and publish the verified APK.
