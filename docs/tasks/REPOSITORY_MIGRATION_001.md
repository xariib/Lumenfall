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

Checkpoint: new-account CLI authorized; original key reverified and privately
provisioned as LUMENFALL_KEYSTORE_BASE64. No key in Git/releases/output.
PR [1](https://github.com/xariib/Lumenfall/pull/1), head0d13a27, preserves both
histories and destination description/exact README snapshot. Automatic review
rejected an initial ours-only conflict command; safer content-preserving merge
passed. Game/config/locked dependencies/assets still byte-identical to8f46153.
Dispatch-only release uses shared1000000+run_number version, exact CI commit,
certificate/package/assets/origin and disposable-emulator upgrade gates.
Original Guidance source/14 assets recovered from pinned pre-existing evidence.
Context/1509 archive checks/source/identity/migration controls PASS locally.

First six CI lanes failed: missing untracked mature fixture; stale schema4,
old recruitment/Ultimate Lab gates, stagnant counters/wide-debit assumptions,
old Lab work cap and frozen-fixture pin. Failures retained in
[migration evidence](../qa/repository-migration-001/README.md).
Focused corrections preserve every protection and use independent exact-value
oracles; no game changes. Forge9319/25 controls, Tree5924, Comet offline34000,
Lab2677 pass locally; actual V8.6 Forge2486/Tree2881/Lab580 pass. Browser fixture/
gesture validation and untracked evidence review/copy are ongoing.

Latest checkpoint: reviewed3639 untracked files, retained3189 evidence/reproducer
files (816714332 bytes), excluded450 profiles/staging/empty outputs; committed
21394f7. No private filenames/material. Forge browser27396 and Tree26744/12
profiles PASS. Comet exposed a real native scrolling defect: the owned-command
Rift stage's overflow:hidden created an intermediate scroll container. An isolated
one-line overflow:visible probe with exact production assets passes12738/12 and
all10 original causal controls. Applied that same single CSS edit; all production
scripts, balance, saves and assets remain byte-identical to8f46153. Current source
bf7909b56466ee2b8f3434cf74bf4dfca52add29f147cdfc39795e2291391f21.
Four actual independent one-second8h oracles regenerated; every complete state
hash and counter equals the previous golden. Only source stamp differs.

Bootstrap main815b348 registers only the guarded dispatch workflow and preserves
the initial README. Game remains in PR1, not main. Build-only preflight38890225543
uses published branch0d13a27 (pre-CSS-fix); publish=false. It is not the final APK.
Reviewed CI corrections/final-source evidence are being committed before rerun.

Next: push corrected candidate and merge bootstrap ancestry; rerun six required
Linux lanes. Inspect preflight Android/emulator failures and fix them. Then
integrate game, dispatch exact-main checks, build/verify and publish. Switch
README to the stable download only after matching release exists. Physical
device/WebView60/TalkBack/human limitations remain open; no final release yet.
