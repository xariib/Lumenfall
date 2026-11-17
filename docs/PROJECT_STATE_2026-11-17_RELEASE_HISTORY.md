# Earlier release-status checkpoints

These entries were moved verbatim from PROJECT_STATE on17 November to keep
mandatory startup within32 KiB after the standing-authorization update. They
are historical evidence; [current status](PROJECT_STATE.md) takes precedence.

14 November: [All improvements/PR53](tasks/ALL_UPDATES_RELEASE_20261114.md)
released as [Android 0.2.119](https://github.com/xariib/Lumenfall/releases/tag/android-1000119),
source `a3d125a5`. Includes PR50 Bond display
cleanup plus the already accepted [simpler Lab](tasks/LAB_SIMPLE_001.md),
[currency header](tasks/CURRENCY_HUD_001.md), [progressive Deeds](tasks/DEEDS_PROGRESSIVE_001.md),
Rift themes and earlier progression/fixes. All 16 exact-source workflows, both full
regressions and isolated offline jobs passed. Signed upgrade/updater retain both
save slots and paid work; installed Bond/Deeds checks, retail Android 12 launch
and anonymous public APK/assets/feed verification passed.
[Evidence](qa/all-updates-release-20261114/README.md). Initial browser/retail
inspection failures and unchanged passing retries are retained; causes unproven. Phone, exact
WebView60 DOM, TalkBack and human acceptance remain open. Self-review only.

14 November: [Simpler Lab/PR51](tasks/LAB_SIMPLE_001.md) first shipped0.2.117;
PR49/52 and PR50 are included in0.2.119. That APK retained Rift Bond names;
the new correction above removes them.

14 November: [Progressive Deeds](tasks/DEEDS_PROGRESSIVE_001.md) merged through
PR52; reopened by human correction: each series needs a live progress bar,
retained cumulative total, existing next targets and increasing stage rewards.
The correction is included through PR55/56 in Android 0.2.127. Combined
CI/native/public evidence is linked above; physical/human acceptance remains open.

14 November: [Currency header/PR49](tasks/CURRENCY_HUD_001.md) integrated
at7f149b89. Human correction requires visible currency names; focused correction
passes1,776 layout checks. Visible names are included through PR54/56 in
Android 0.2.127; combined acceptance evidence is linked above. Phone review open.

12 November: [Rift theme redesign](tasks/RIFT_THEME_REDESIGN_001.md) released as
[Android 0.2.111](https://github.com/xariib/Lumenfall/releases/tag/android-1000111)
through PR48 at `63c63b1a`: one scene and six stronger themes replace packs;
original enemies fit their rings. All14 workflows,1,399 visual assertions and
exact saved-state replay passed. Signed upgrade/updater retained both saves
and paid work; retail launch/public bytes passed. [Full evidence](qa/rift-theme-redesign-001/README.md)
retains the first native ANR and passing unchanged retry; cause is unproven.
Physical-phone/WebView60/TalkBack/human acceptance and independent review are open.

12 November: [PR42 Forge/Lab update and full evidence](tasks/ENDLESS_FORGE_LAB_PACING_002.md)
released as [Android0.2.110](https://github.com/xariib/Lumenfall/releases/tag/android-1000110).
Tempering continues past300; eight Lab studies require earned first access,
retaining paid work. Eight workflows,220 scenarios, offline catch-up, signed
upgrade/updater, retail launch and public bytes/feed passed at `dc78daad`.
PR46 is excluded; physical-phone/WebView60/TalkBack/human acceptance is open.

12 November: [Pending proposal review](tasks/PR42_PR46_REVIEW_20261112.md)
initially kept PR42's Forge/Lab proposal open and closed PR46 without merging. The
automatic-only reset delay strongly favors repetitive manual reward farming
in the controlled comparison, contrary to the mostly-idle direction. The
underlying rapid-repeat economy issue remains open; that review changed no gameplay.

12 November: [Exploit and balance hunt](tasks/EXPLOIT_BALANCE_HUNT_001.md)
released as [Android 0.2.107](https://github.com/xariib/Lumenfall/releases/tag/android-1000107) through PR47.
It closes untrusted-action timing bypasses and a paid Lab work helper defect,
uses 10,000 combat defeats for Auto-Tap, and eases later recruitment by one Lab
level. All eight integrated workflows passed at `18e7072c`.
Signed save-preserving upgrade, in-app update, retail-image normal launch and
anonymous public APK/assets/feed verification passed. Thirty-day idle results
and [delivery evidence](qa/exploit-balance-hunt-001/README.md) are saved.
Physical-phone, exact WebView60 DOM and human pacing remain unverified; editable
local saves remain a trust boundary. PR42 was separate at that release; its later
delivery and PR46's subsequent closure are recorded above.

