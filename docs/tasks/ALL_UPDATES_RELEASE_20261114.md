# All improvements in one Android APK

User request, 14 November 2026: "Is every new update in the game? If it's not then make a new apk with every new improvement".

Goal: compare the current public APK with accepted current work and publish a
verified combined APK containing every ready improvement. This chat owns this
release integration, checks and delivery. No subagents or messages authorized.

Baseline: main `6fd9e44f`, public Android0.2.117/source `9af68888`.
That APK already contains the simpler Lab, currency header, progressive Deeds,
Rift themes, endless Forge/earned Lab and earlier fixes. PR50 at `918d5739`
removes Rift Bond boost rows while retaining names, partner marks and full Wisp
menu details. It is the only open PR. Its source predates the simpler Lab;
combine in an isolated worktree and preserve all latest accepted code.

Branch `release/all-updates-20261114`, worktree
`validation-evidence/all-updates-20261114`. Existing root attachments and all
feature worktrees, including uncommitted Rift owner evidence, remain untouched.
Documentation/failure evidence checkpoint branch:
`release/all-updates-20261114-evidence`. The validation/release ref remains
`release/all-updates-20261114` at exact candidate a3d125a5; do not advance it or
main while these runs/builds are active. The checkpoint changes only docs/QA.
PR46 was deliberately closed without merging and is excluded. Historical
proposals and unrelated diagnostics are not new accepted improvements.

Acceptance: focused combined UI/mechanics and independent saved-state replay;
all applicable PR workflows and required exact-source manual release gates;
integration into main; signed APK with established package/certificate; exact
packaged assets; installed Bond/Deeds acceptance, save-preserving upgrade,
in-app updater, retail launch and anonymous public APK/checksum/feed verification.
Preserve gameplay, paid value, saves/recovery, Lab selection and all prior UI.
No new balance, schema, caps or binding rules. Self-review/automated checks only.
Physical-phone, exact WebView60 DOM, TalkBack and human acceptance remain open.

References: [workflow](../project/FEATURE_WORKFLOW.md),
[Lab release](LAB_SIMPLE_001.md), [Bond requirement](RIFT_BOND_DISPLAY_001.md),
[current state](../PROJECT_STATE.md).

Status: combined candidate prepared; validation in progress. The published PR50
head merged cleanly into the latest game. Resolved shared-status text by retaining
both updates, and rebound only the replay source after a fresh independent paired
replay. Product SHA256 `c921c7bb3d062de17e23ad1e9fc3cc9050aa0425d661d13bc9a6987f3fef5543`.
Complete product diff from main is 13 removed lines/one changed line for Bond
presentation. Latest Lab selection, currency, Deeds and all native recap assertions
are retained. No workflow changes. Restored only checkout-omitted long-path files
from exact HEAD bytes; no historical evidence changes are included.

Node24.22.1: paired replay executed115,200 one-second calls per source, matching
all four full saved states, rewards and original canonical hashes. Source, Bond
mechanics/causal controls, Deeds core, Lab344/18 profiles and Deeds550/18 profiles
PASS. Formation12 profiles and both Rift suites also PASS with normal teardown.
[Current receipts](../qa/all-updates-release-20261114/).
Candidate [PR53](https://github.com/xariib/Lumenfall/pull/53) is published at
`a3d125a57fa2b5e54419e2a8774c63f356204518`, containing PR50 and latest main.
Fifteen of sixteen PR/manual workflows passed; manual full run43633981198 and
both isolated offline jobs passed. The manual
Linux Wisp causal control first failed its original300ms setup settle check;
its unchanged failed-job retry passed. Windows and the separate PR run passed.
Original run/jobs/full logs are retained as first-failure43634001144 receipts.
PR full run43633863368 then failed only wisp-rarity-scroll: check1, no completed
profiles, the same original300ms setup settlement timeout. Other main scenarios
continued and passed. Its complete original run/jobs/logs are retained too.
Only the failed PR job is rerunning unchanged (attempt2). Underlying transient
causes remain unproven; no deadline/assertion changed. Nonpublishing signed
Android candidate run43639919453/version0.2.118 is running in parallel on exact
candidate a3d125a5, to check native/save/updater behavior before integration.

PR attempt2 passed16 Lab profiles/289 checks before a15s CDP touch-command
deadline in boost-queue UI; no game assertion mismatch was reported. Its full
run/jobs/logs are retained separately as attempt2. This check passed on the
initial PR attempt and complete manual run. Attempt3 is now active, unchanged.

Native candidate attempt1 passed signing/assets, installed Bond/Deeds, both save
slots/paid work, and the real updater. Retail inspection failed its original
visible-controls assertion after UIAutomator repeatedly returned no root/idle
state. The final screenshot visibly shows the running game; saved XML contains
an earlier startup/toast tree. This does not replace the required retail gate.
All36 original diagnostic files are hash-manifested/retained in
`../qa/all-updates-release-20261114/native-first-failure-43639919453/`.
Underlying accessibility/idle cause remains unproven. Native attempt2 is running
unchanged; no product, test assertion, deadline or workflow edits were made.

Native attempt2 has now PASSed. Downloaded0.2.118 artifact independently matches
exact source/assets, package/certificate, all native receipts and installed Bond
catalogue. SHA256 `0520c9504d2e639736b17620bd9d0c05fe161a3eeffc3a6079adbcc4dc4e86b1`.
[Candidate verification](../qa/all-updates-release-20261114/android-candidate/verification.json).
Installed Rift/Bond and Deeds screenshots plus retail normal-launch screenshot
were visually inspected (self-review). Candidate is not public or integrated.
Only PR attempt3 remains active; manual full/source gates and native candidate
are passed. Keep validated ref a3d125a5 fixed until readiness/integration.

Next: wait for PR attempt3 only; use the local delivery helper's ready/save-ci
checks, fast-forward unchanged main to exact tested candidate and dispatch the
publishing Android workflow. Recheck main/build concurrency at each mutation.
No main evidence push during publication. Verify/download the resulting signed
APK and anonymous public feed, then save all receipts/status in GitHub.
GitHub connector lacks workflow dispatch; existing authenticated CLI supplies it.
No changes to credentials or signing. Task stays open for device/human acceptance.
