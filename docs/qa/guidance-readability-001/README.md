# Guidance large-text readability — candidate evidence

Current status: PR109 is integrated into development as354e19ff. Supported
development acceptance PASS: six final-head CI lanes, original Full182/212/22,
Guidance16/160 plus16 Ascend, complete merge/tree verification and13 fresh
commands (843198 assertions/111 causal controls).
[Current receipt and limitations](development-acceptance-015/README.md).
The preparation history below is preserved. Native acceptance remains OPEN;
PR102 stays draft and main/APK/signing/release remain held.

The 320px/200% hint shares a fixed46px slot with a toggle that previously
reserved9.5em (capped at70%). The candidate uses the larger intrinsic width of
both native labels, reserved by an invisible zero-height CSS pseudo-element.
The second candidate also removes decorative horizontal margin and reduces
the toggle and hint padding/gap. The title/detail/toggle fonts,44px controls, scrollable hint and protected
combat geometry retain their existing contracts.

## Source preservation

Baseline:684bfc52bb2ca523124fe63981188b9a8004d747.
Baseline index SHA256:38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f.
Current candidate index SHA256:dd81757378880ef42052cf6b175ea06721043e0ba7213cd135d5661367a743f1.
The only script change is one UI title literal: "Permanent power is waiting"
becomes "Ascend for permanent power". Both complete script blocks and every
byte outside the style block otherwise remain identical. Frozen fixtures remain
ab43604db1b5bce8b9990506f989676dfb0009cdcf2e514a8ccee9da166c8753.
No save/economy/ownership/offline/Auto-Ascend code is changed.

## Current verification

The first real GitHub run at commit8be0ad68b206c6abdd448af38863f600e8491fbc
[failed the new focused gate](https://github.com/karahaNx/Lumenfall/actions/runs/38137475649).
Both the pinned baseline and the first candidate split the actual leading word
"Awaken" across two lines at320px/200% text, with loaded28px Manrope title text
and healthy browser teardown. Baseline/candidate title columns measured
71.8125/91.53125px; the complete word needs about124px. Original screenshots
were inspected. Artifact11701881424 contains the original47 files, verified
against the API size/digest and every ZIP member CRC. Its SHA256 is
6b4d5f52b139b6f003a63426c95591128697aebc0e5fdc4ca36e54cf72ceb0ca.
The full downstream regression did not execute on that failed candidate.

The second candidate3f1505d passed the focused browser gate with actual
title width131.53125px and complete Awaken width123.234375px. All five ordinary
hint images plus the baseline and old-width inverse were directly inspected.
The early artifact11701721726 contains53 original members, with SHA256
0b1d6cd60043afca8c58bada3a94e136a75d842195434325d8b38c44b17ea704.
Another real Shared UI image exposed the remaining Ascend-ready word
"Permanent" fragmenting. The current candidate changes that single UI title
to the action-led "Ascend for permanent power" and adds an actual Ascend-ready
state after the existing samples in every profile. Its exact title inverse
reproduces the complete previous3f1505d source SHA4eb7bb44 and must fail on the
unchanged old word with healthy fonts and browser teardown.
The ordinary-word oracle,
font and geometry guards, and exact old-width inverse remain unchanged.
An additive early artifact upload preserves the focused screenshots immediately
while the remaining complete regression runs. The final full artifact remains.

Source validation passes:2 scripts,16 required IDs and lifecycle guards.
The initial task-context gate passed at32,404bytes, below the32KiB limit;
the fresh gate with additive Ascend coverage passes at32,475bytes.
[Local Node tooling](local-tooling/process.json) exits0; its original stderr
contains the deliberately malformed-JavaScript negative used by that suite.
The tooling smoke-fixture success does not establish a real browser run.

[Local browser startup evidence](local-environment/README.md) identifies an OS
socket permission failure before any game assertion. Existing GitHub Full CI
therefore runs the pinned original baseline and candidate probe early, then
the complete unchanged default suite. The first expanded context audit caught
three oversized startup/task combinations. Shortening only the status header
fixed all three; the limit remained32,768bytes. Final Forge/Tree/Shared/Guidance
checks used32,703/32,692/32,717/32,404bytes respectively.

Commit0401f115 passed all six CI lanes, including Full38139212364 with
182 IDs/212 passing attempts, all22 mandatory controls and original16/160 plus
16 Ascend cases. Its original final artifact11702769524 has241 members and
SHA256 cd52e350de41887af91d95c304fe544e0dc2c0ea61c1019b35abe8d6b21e3b19.
That tested source is not integrated: two subsequent inline review findings
identified defects in the permanent CI checks. The original full terminal-log
fetch returned Transport closed; uploaded originals and terminal statuses are
retained, and no substitute terminal log is claimed.

The follow-up changes only CI/test code. Historical old-title whole-file
identity is now checked only for its original repaired source; future unrelated
HTML bytes retain a dynamically hashed exact one-title inverse. A pure Node
regression covers unrelated prefix/suffix changes, invalid title inputs and
exact CSS roundtrips. The existing browser driver remains byte-identical.
A separate old-layout browser probe restores the entire original Guidance CSS
block from immutable684, including margin, width, padding, gap and absence of
the added pseudo-element. Every byte outside that block stays current. It must
fail on fresh Awaken with the same word/font/visibility oracle and healthy
browser teardown. All six lanes are required again on this revised candidate.

The strengthened Guidance driver preserves16profiles/160original samples and adds
one supplemental Ascend-ready case in each profile, alongside
ordinary-word/glyph/clipping and toggle-AX measurements. The required old-width
inverse must split the unchanged word over multiple lines with healthy fonts,
visibility, game state, protected geometry and browser teardown. Existing
reservation-collapse and long-hint scrolling checks remain mandatory.

The subsequent review of08e91b6e found three additional CI/evidence issues.
The baseline now reads fonts and branding from immutable684 Git objects;
an isolated Git fixture verifies that future candidate assets cannot alter it.
The active evidence runner is Node.js, and review attribution now explicitly
says collaboration peer review. Original005 evidence is archived byte-for-byte.
See [the corrections](ci-review-006/README.md). Product and Guidance driver bytes
remain unchanged; the latest candidate must complete all six lanes again.

All six established CI lanes remain required. Physical Android, native
WebView60/textZoom/TalkBack and installed signed-app acceptance remain separate.
PR102 stays draft; main and APK/build/signing/release remain held.

See [full acceptance and sources](ACCEPTANCE.md). The older Shared postmerge
raw-file gap is independently recorded in
[recovery006](https://github.com/karahaNx/Lumenfall/blob/5093250a39b615c3c8122eb4c5af9324de6ad14b/docs/qa/shared-ui-001/recovery-006/README.md).

Both original early CI ZIPs, raw measurements, first failed job log and the
additional Shared screenshot are durably retained in
[checkpoint001](https://github.com/karahaNx/Lumenfall/blob/8f161a864b5693506b04f7ac812e73586f5c6195/docs/qa/guidance-readability-001/evidence/checkpoint-001/README.md).
