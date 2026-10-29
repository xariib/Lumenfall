# FULL_GAME_WORKSHOP_AUDIT_001 — gameplay, cards and Workshop audit

Status: integrated, automated acceptance PASS; Android 0.2.55 published and
public bytes verified. Physical phone/accessibility and human pacing acceptance
remain open. Owner: this feature
chat. Baseline: main
`595619f27b54eee351c5f3f2dfb0dd46a4ecd487`, Android 0.2.54.
Branch: `fix/full-game-workshop-audit-001`.

## Original request — 29 October 2026

Debug the complete game; find and fix defects, cheating routes and exploits.
Inspect every game card, including Auto-Empower wrapping above/below the value
and moving touch targets. Audit the complete Workshop, consider meaningful
additional upgrades, and evaluate every existing cap so the whole Workshop
cannot easily be completed within one or two days.

## Scope and preservation

Inspect production purchase, reward, automation, save/recovery, live/offline and
UI paths. Reproduce findings before fixing them; add regression coverage and
causal controls for changed behavior. Balance changes are explicitly in scope,
but preserve purchased ranks, currencies, paid work, purchases, both save slots,
Android identity and existing gameplay systems. Existing short caps on bounded
charge/regen/capacity effects need evaluation, not indiscriminate increases.
Add upgrades only where an uncovered progression need justifies them.

Sources: [project state](../PROJECT_STATE.md),
[prior exploit fixes](EXPLOIT_FIXES_0252_001.md),
[pacing requirements](PROGRESSION_PACING_001.md),
[finite Workshop contracts](LAB_FORGE_LONGTAIL_001.md),
[feature workflow](../project/FEATURE_WORKFLOW.md).

## Acceptance

- Cover all card families and purchase/automation states; keep targets stable
  when values/affordability change, including narrow mobile and enlarged text.
- Record concrete reproduced exploits and reject them through production paths;
  preserve exact payment, failure rollback and online/offline parity.
- Review each Forge/Lab cap, costs, effect and unlock against measured 24/48-hour
  progression; distinguish synthetic pacing evidence from human playtesting.
- Run focused and required CI checks without weakening gates; preserve source
  binding and update independent reference evidence through its actual generator.
- Save changes, findings, checks and limitations in GitHub; integrate only after
  required checks. App/device acceptance and any release remain source-bound.

## Checkpoint

Repository recovered into local `game/` using a sparse clone because the original
workspace contains only the released APK verification. Root instructions,
bootstrap, project state, workflow and affected prior requirements read.
PR21 merged at `ecf88e3537389d6c855fa7628c0bd518b9077763`; its tree
`825416ece13d8efabd8bcea41fd7e9cdc46e7297` exactly matches the tested PR merge.

## Verified changes and evidence

Product SHA256: `4246093dad1dfd496307c7281e97df53bd6f902f33d804c246ca9f36f66cae65`.

- Auto-Empower originally shares a wrapping flex row with Level, Power and
  Rarity. A dedicated full-width toggle row and explicit stat tracks prevent
  changing values from moving Empower/Auto-Empower. The new original-source
  browser regression fails; the candidate passes all eight Wisps, changing
  levels, rarity and ON/OFF across narrow screens, large text and both motions.
- Ability purchases originally trust the caller's Wisp and omit recruitment
  validation. The production purchase now uses a canonical Wisp quote, current
  recruitment and exact currency checks, shared with the UI. This is entry-point
  hardening; direct scripted hooks do not establish a normal-UI exploit.
- Claiming a completed quest originally updates memory without persisting the
  reward or claim. An immediate restart loses it. Claims now atomically persist
  both; a failed primary save rolls back and allows retry. Repeated claims pay
  nothing; accepted-primary/failed-recovery claims survive cold reload.
- New [production-entry regressions](../qa/full-game-workshop-audit-001/core.json):
  276 assertions PASS, three causal reversions independently rejected.
- Actual-browser card/Workshop workflow: 524 checks, 18 profiles PASS, including
  100/150/200% root text, 320/390/430px, touch, keyboard, prices and slots.
- Wisp layout: final 25,968 checks, 12 profiles PASS, including changing rarity
  and ON/OFF. Shared layout: 6,985 checks, 12 profiles and three causal controls
  PASS. Loadout: 1,171 full browser checks PASS after explicitly configuring the
  installed browser; the original unconfigured-browser EPIPE is retained.

## Workshop decisions

[Every cap, effect, price and work curve](../qa/full-game-workshop-audit-001/workshop-caps.json)
is inventoried: 25 Forge definitions (21 active) and 23 Lab definitions (20 active).
Historical fused paths remain preserved, with their future purchase owner named.
Keep existing caps: Masterwork 500, five new ranks every 50 record Rifts from
Rift 70, so its final band opens at Rift 5020. Keep specialized short caps on
charge, boss regeneration, resonance, discounts and conversion. Raising them
indiscriminately risks loops and erases their intended effect ceilings.

Two complete earned-currency 48-hour campaigns PASS on current product:
regular (three 10-minute visits/day) reaches Rift 50, Wisp Ascendancy 13/500,
56 total Forge ranks, Masterwork 0/500; efficient (six 15-minute visits/day)
reaches Rift 68, Lab 14/500, 87 Forge ranks, Masterwork 0/500.
No arbitrary currency grants fund these campaigns. Even granting every discount,
unlimited currencies and permanent free 8x research, current foundation work
still takes hundreds of days per 500-rank path. Short utility paths deliberately
finish earlier; the entire Workshop cannot cap in two days under these bounds.
Additional upgrades are optional in the request; none is added without an
uncovered progression need. No cap, price, earned level or balance change.
These are synthetic measurements and bounds, not long-term human pacing proof.

## Independent offline preservation

[Four old/new one-second 8-hour windows](../qa/full-game-workshop-audit-001/offline-neutrality.json)
PASS with byte-identical complete endpoints on Windows Node 24.20.0, including
all original kills/Ascends/Prisms. Windows endpoint hashes differ from the
canonical Linux/Node24.19 golden even on unmodified baseline. Retain every
canonical golden endpoint and update only its exact product source binding;
do not replace canonical economic assertions with local platform outputs.

Current [29-check regression matrix](../qa/full-game-workshop-audit-001/regressions/summary.json)
completed: 28 PASS; the original unconfigured-browser loadout failure is retained
and resolved by the separate full 1,171-check browser PASS. Existing gates are retained; the new core/caps/layout regression is
added to pre-merge CI. Self-review and automated checks only.

An additional full Windows/Brave attempt passed nine cases, then six successive
25-second dump-DOM deadlines produced no completed QA result. The task-owned
runner was stopped; those six cases returned no gameplay assertion result.
Its [unaltered raw log](../qa/full-game-workshop-audit-001/regressions/windows-full-suite.log.gz)
is retained (SHA256 `8267446a5044df3235ac25c092b29a9694adeab7234c6dfb5781fff8bcb074a5`).
This is not a local full-suite pass; complete Linux CI supplies the original
189+1 scenario acceptance without changing any assertion or deadline.

[PR #21](https://github.com/xariib/Lumenfall/pull/21) final head `8595918f`,
tested merge `b57c4abf`, tree `825416ec`: seven required workflows PASS, including
both full jobs, 189+1 deterministic scenarios and guarded mobile runtime smoke.
Complete product/preservation diff self-reviewed; no independent review claimed.
CLI push authentication was unavailable; connected GitHub object upload reproduced
the exact local tree, verified after fetch. First-head pre-merge failed at quest
metadata: only the two expected persisted clock fields changed after durable
Claim. The follow-up uses existing `save-clock-contract.cjs`, additionally bounds
the save to the native input's wall-clock interval, and requires the whole new
endpoint in both save slots. Every original other-field, reward, focus, scroll
and duplicate assertion remains. Full browser lane: 1,225 checks/12 profiles PASS;
both original causal failures still trigger. Product bytes remained unchanged.
The first Permanent attempt ran zero browser profiles after a CDP startup
deadline; unchanged attempt 2 PASS. No gate/deadline/assertion was weakened.

The user twice confirmed browser access for APK build/publication, but Work still
reports disabled after session reset. A self-tested one-task adapter only on
`qa/full-game-workshop-release-001` uses GitHub's ephemeral Actions token to
dispatch the seven existing workflows on the pinned integrated main SHA, require
all seven plus both full jobs, then dispatch the unchanged gated Android flow.
Check main/source identity before dispatch; never substitute old-commit reruns.
The adapter changes no permanent main trigger or release/signing acceptance gate.
[Adapter run](https://github.com/xariib/Lumenfall/actions/runs/40842788058), QA
commit `1949ec93`, PASS. Seven original exact-main workflows on `ecf88e35` PASS,
including both full jobs, 189+1 scenarios and mobile runtime smoke.
[Exact-source CI receipt](../qa/full-game-workshop-audit-001/ci-final.json).

## Android delivery

[Android 0.2.55](https://github.com/xariib/Lumenfall/releases/tag/android-1000055),
versionCode 1000055, published from integrated `ecf88e35` after
[native build55](https://github.com/xariib/Lumenfall/actions/runs/40848886964) PASS.
Package `com.lumenfall.app` and established signing certificate `A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21`
retained. Installed emulator upgrade retains actual UID/origin, both saves,
progress, paid Lab work and legacy Comet entitlements. Emulator uses WebView91;
it does not establish physical-phone or exact WebView60 DOM acceptance.

Anonymous public download PASS: 7,067,144 bytes; SHA256
`0797f3472429deee478df7f4053975ecc94686ee3fc58ce0f2cc117aad76c209`.
All six downloaded assets match GitHub release digests. All 15 packaged game
assets exactly match production; certificate extracted from downloaded bytes;
native receipt bound to the exact APK/version. [Full release receipt](../qa/full-game-workshop-audit-001/release.json).
The final documentation checkpoint changes no game/build/test bytes; this release
remains bound to `ecf88e35`. Install as an update without uninstalling.

Known limits: standalone local saves and arbitrary unseen future device dates
cannot be authenticated without a trusted source. This patch does not claim
tamper-proof offline play. Physical phone/WebView60 DOM/TalkBack and human pacing
remain unverified; automated evidence does not establish perfection.

Next: physical-phone, exact WebView60 DOM, TalkBack and human pacing acceptance.
Keep this feature open for those checks; automated delivery is complete.
