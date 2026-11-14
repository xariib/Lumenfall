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
PASS. [Current receipts](../qa/all-updates-release-20261114/).
Next: finish focused mobile checks, publish the combined release PR, pass exact
source PR/manual CI and integrate/build. GitHub connector lacks workflow dispatch;
existing authenticated CLI supplies it. No changes to credentials or signing.
