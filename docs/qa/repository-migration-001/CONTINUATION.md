# Migration continuation — 16 October 2026

Same authorized task; continue to release, no agents/chats/messages. Read task,
this checkpoint and current code before editing. No new general approval needed.

Shared root is older local/full-debug; never build it. Work in
validation-evidence/repository-migration-worktree, codex/repository-migration.
Original selected8f46153 retained. Current productbf7909b5 differs only by one
Comet-owned Rift CSS overflow:visible; all scripts byte-identical. Qualified
matching-assets probe12738/12/10 controls PASS; Forge27396 and Tree26744/12 pass.
Regenerated four independent1s8h golden phases exactly equal prior full hashes.

GitHub CLI: ../migration-tools/gh/bin/gh.exe, authorized xariib/admin with workflow
scope; HTTPS auth configured. Network/Git writes require escalation. Do not print
tokens. Original key remains C:/Users/xarib/Downloads/Lumenfall-debug.keystore,
verified SHA/cert/MAC/private challenge; provisioned only as encrypted Actions
secret LUMENFALL_KEYSTORE_BASE64. No key in Git/public releases/output.
Official Node8 ../migration-tools/node8.exe; Chrome140 QA binary
../migration-tools/chrome/chrome-win64/chrome.exe. Set LUMENFALL_QA_CDP_CHROME.

PR https://github.com/xariib/Lumenfall/pull/1 is attached. Remote PR head662fed8;
local migration branch has7ddf020 (native proof fix), pushed only as the remote
build-only branch codex/android-upgrade-preflight so existing CI is uninterrupted.
Destination main815b348 contains initial README plus safe dispatch-only build
workflow, not the game. That bootstrap ancestry is merged in662fed8.
Both repository histories/README preserved; no force-push. Initial ours-only
conflict command was rejected by auto-review; content-preserving merge passed.

Evidence commit21394f7 retains3189 of3639 reviewed untracked files,816714332 bytes;
450 profiles/redundant staging/empty outputs excluded. Original files untouched.
Full manifest untracked-review.json; .gitattributes preserves bytes. All original
archives1509 checks PASS. GitHub warns about existing/new60MB evidence, no rejection.
All available local Git history is preserved; pre-import old Git objects remain404.
Exact historical Guidance source/14 asset blobs recovered from pinned evidence.

First six CI runs on0d13a27 all failed; logs saved. Reconciled stale schema4,
old Lab/recruitment/Ultimate gates, stagnant wide counters/debits, fixture pin,
Masterwork row and ten-day work cap without changing gameplay or skipping gates.
Core final-source Forge9319/25, Tree5924, Lab2677, Comet offline34000 PASS;
actual V8.6.0 Forge2486/Tree2881/Lab580 PASS. No independent review claim.

Second PR CI on662fed8:
- Full38890547127 FAIL at Guidance: current QA bridge directly referenced timed
  boost functions absent from the immutable old baseline. Optional QA exposures
  are now null when unsupported (no old production code changed). A later
  old-title inverse also reached the Ascend title in the dense ordinary case;
  the inverse-only probe now records that exact expected failure while measuring
  ALL five ordinary cases plus the dedicated Ascend case. Owner independently
  validates each measurement; positive/full defaults remain immediate assertions.
  Local full bounded Guidance gate recovery3 now PASS: baseline defect, five
  ordinary positives/Ascend, width inverse, exact title inverse and full CSS inverse.
- Forge38890547040 PASS.
- Comet38890547111 PASS; Lab38890547286 PASS; Shared38890547134 PASS.
- Tree38890547224 FAIL: tree-expansion-offline still expected1e30 stagnant count;
  cheaper-recruitment-v8 still expected a huge wallet payment to be null.
  Both locally corrected with exact arithmetic, preserving blocked low-wallet
  and all400 capped attempts. Cheaper V8 PASS. Tree offline10085 PASS; its four
  unchanged original negative functions pass separately without repeating the
  expensive positive run. Tree economy16802/six controls PASS. Exact CLI with
  --negative still remains required in final CI; no deadline was changed.

IMPORTANT correction: first Android build-only run38890225543 on0d13a27 exited
job success and verified package/cert/version1000001/0.2.1/assets, but its emulator
helper silently exited WITHOUT emulator-upgrade.json. This is NOT upgrade PASS.
User was explicitly corrected after an overstatement. Public preflight-run.json
records exact limitation; downloaded APK SHA5ef110bd7c3de9b878d0994ac2d284b49bf907b46dd7d314883e699f294bd2b0
matches original9cdcd80c assets; final-root verifier correctly rejects that old HTML.
Artifact under validation-evidence/android-preflight; run.log captures identity.

7ddf020 adds DevTools connection/command deadlines/close rejection, a liveness
watchdog, forced localhost-forward endpoint, and mandatory completed receipt bound
to actual APK hash/version/UID/progress/save slots. Six missing/invalid receipt
controls PASS. Stricter build-only run38891076512 on7ddf020 is in progress, last
seen emulator step. Inspect actual output/receipt, not green action status alone.
Native helper logs phases. If it fails, fix actual transport/device issue; do not
weaken asserts. Both preflights have publish=false; neither can be final release.

Newer native outcomes:38891076512 failed strictly after replacement because the
sentinel was missing. Do NOT claim retention.38892541352 failed before seeding:
DevTools targeted about:blank and localStorage raised SecurityError. The next
helper waits for the actual https://localhost app/complete document, seeds only
the OLD app through a one-time pre-document script (removed before cold restart),
then checks the old save survives a real cold restart before any replacement.
This also avoids the old game's5s autosave overwriting a storage-only fixture.
The first missing sentinel may have been unflushed storage; cause unproven.

Current local HEADd731e92, pushed only to codex/android-upgrade-preflight; PR1
still remote662fed8. Build-only run38893289179 on d731e92 is in progress, last
seen emulator. It contains version guard, native cold-baseline/readiness fixes,
Tree fixtures and complete Guidance reconciliation. Watch actual receipt.
Published-version guard rejects equal/stale/unknown APK tags, including published
prereleases, both before build and publication. Live empty-release API probe PASS.
Receipt verifier rejects missing/partial/wrong UID/version/APK; six controls PASS.

Ignored logs supplement: original .gitignore also hid567 QA/log outputs. Reviewed
all;397 nonempty synthetic QA logs retained (60354543 bytes),170 profiles/empty
outputs excluded. Files copied at original paths and ignored-log-review.json
written, NOT YET committed. Force-add exact ../migration-log-paths.txt only.
3189 earlier evidence files were actually verified against source SHA256 AND
committed raw Git blob SHA1; retained-evidence-verification.json PASS on7ddf020.
After committing logs, extend verification to them. No private filenames/material.
Current uncommitted work is checkpoint/evidence/logs, not product edits; inspect
status before edits. Core source stillbf7909b5. Native remains UNVERIFIED.

Next actions:
1. Finish local Tree offline, inspect stricter Android run and remaining second
   CI results. Resolve genuine failures or stale fixtures against approved scope.
2. Commit ignored-log supplement/checkpoint, finish current native acceptance,
   verify retained evidence against Git/manifest. Commit all final fixes,
   then push migration branch and rerun six full gates on final candidate.
3. Once passing, integrate game into main without force (PR merge or fast-forward),
   dispatch all six workflows on exact integrated SHA. release-ci-gate.cjs requires
   latest successful workflow_dispatch for each on that SHA.
4. Dispatch build-android.yml publish=true on exact main. It verifies key/package/
   continuing version/assets and completed native receipt before immutable new
   android-VERSION tag/release. Never publish the preflight APK.
5. Download actual latest APK, compare hash/assets/identity evidence and stable
   URL redirect. Only then set first README link to
   https://github.com/xariib/Lumenfall/releases/latest/download/Lumenfall.apk.
   Save final CI/APK/update evidence and limitations in GitHub. No physical phone,
   exact WebView60, TalkBack or human pacing/performance acceptance claimed.
   Keep acceptance/chat open where required; no archive performed.
