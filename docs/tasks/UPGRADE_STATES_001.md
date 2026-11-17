# UPGRADE_STATES_001 — consistent upgrade presentation

Status: in progress. Owner: this feature chat; no delegation.
Baseline: origin/main `b075cfba`; isolated `C:/lf-upgrade-states`, branch
`feature/upgrade-states-001`. Original checkout and other worktrees preserved.
GitHub open-PR search on 17 November returned no open PRs. Main integration
must be checked again before delivery; other feature worktrees exist.

## Original requirement — 17 November 2026

> Also every maxed out upgrade should be goldboxed. If it can't be purchased,
> then it should not show what it costs, but how to unlock it. Also if it's
> purchaseable but you need currency, then that currency text have to be red.
> This goes for all the game.

Standing rule communicated before applying: Every maxed upgrade has a gold
border. Upgrades blocked by prerequisites show how to unlock them instead of
a price. Eligible upgrades show prices, with each insufficient currency amount
in red and the purchase button disabled.

Scope: Wisp Recruit/Empower, Rarity, Ability, Ultimate, Mastery, Forge, Lab,
Tree and Comet upgrades, including passive refresh and individual capped
sub-upgrades. Preserve purchase eligibility, prices, balance, caps, paid work,
queues, progression, saves, keyboard focus and touch behavior. No migration.

## Acceptance and baseline

- Maxed upgrades have visible static gold borders and no purchase price.
- Locked upgrades show sufficient unmet prerequisites and no price.
- Eligible upgrades retain exact prices; each deficient resource is red;
  unaffordable buttons are disabled. Wallet/prerequisite changes refresh UI.
- Focused browser regressions cover each family and transitions; existing
  relevant checks, required CI and integrated version checks pass.
- Signed Android build/update/save acceptance and public delivery follow
  [feature workflow](../project/FEATURE_WORKFLOW.md). Physical-phone,
  exact WebView60 DOM and TalkBack evidence may remain unavailable.

Observed baseline: Forge/Lab have gold cap styles; Wisp ability gold depends
on Ultimate ownership and Tree lacks a gold cap state. Wisp non-Rift locks
still show prices. Existing affordability test explicitly expects prices for
level-locked rarity; update that superseded assertion with locked-state coverage.
Baseline source validation and 417 workshop checks passed on `b075cfba`.
The first Edge attempt exited before browser checks. Downloaded Chrome for
Testing157 and its headless shell for actual DOM acceptance. The old locked
rarity price assertion failed as expected against the requested new behavior;
it now verifies unlock instructions and no price. Shared currency coloring,
purchase eligibility and numeric prices remain authoritative and unchanged.

## Implementation checkpoint

Gold borders now survive chapter CSS for capped Tree/Comet upgrades and each
Wisp Empower/Rarity/Ability/Ultimate/Mastery component. Wisp prerequisite locks
replace prices with unmet requirements; the same helper refreshes existing
buttons without detaching them. Lab challenge/slot locks show their next action
instead of prices, including live challenge/confirmation updates. Empower
prices can wrap at200% text. Unavailable Forge prices are hidden.

Full-cap browser fixtures exposed a pre-existing Rift advice crash: the most
advanced Wisp could already have Mastery2000 and no next requirement. Advice
now selects only uncapped Mastery and returns no Mastery advice when all cap.
This necessary fix has dedicated single/all-Wisp cap browser coverage.

Initial accepted UI candidate SHA256
`3998ae3b995f84121a212ede9d0b10db836abb345e9b227d9b3239090b5a13a4`.
Source validation, workshop417, team progression1,228/seven controls and
guidance191 passed. The canonical original offline-catchup generator reproduces
all four released full-state hashes (722/618/1161/678 kills, zero automatic
Ascends/Prisms); only its source binding changes. The initial alternate helper
used different endpoint accounting; its mismatch is retained, not accepted.

One complete Chrome run passed14,778 assertions/six320–430px and100/200% text
profiles, but failed browser shutdown and is recorded as FAIL. Final headless
acceptance passed15,252 assertions/six profiles with clean shutdown. All three
causal controls failed at the expected gold/lock/red assertions with clean
shutdown. Startup/shutdown failures are retained; they do not count as causal
controls. Save-preservation assertions now compare
within the operation's JS turn, excluding unrelated real visibility-event saves
between CDP requests. Real save and purchase functions remain active.

Changed files: `index.html`, `AGENTS.md`, this task, upgrade affordability and
new upgrade-state browser tests and the canonical offline binding. An initial
push was rejected because its OAuth credential lacks workflow scope; no remote
branch was created by that attempt. The new regression and three causal controls
now run through the existing required affordability `--negative` gate. Existing
workflow files and all prior assertions/controls are preserved.
Self-review only. No gameplay price, cap, balance, schema or save reset changes.
Next: complete final browser/controls, save evidence, open PR and run required
CI; integrate only after passing checks, then signed Android acceptance/release.
Integration/build not yet started. Physical-phone/WebView60/TalkBack remain open.

## PR61 checkpoint

[PR61](https://github.com/xariib/Lumenfall/pull/61), initial head `2518e7e8`.
Wisp scroll, Comet/Deeds, permanent progression and isolated offline CI passed.
Initial main job44064381284 failed before gameplay checks: shared startup plus
the exploit task exceeded32KiB after the new rule/status; the Forge/Lab task was
already58 bytes over on main. Duplicate12 November summaries were already
preserved in the linked14 November history. Shortening those duplicates gives
31,497/31,954 bytes for these two tasks with the unchanged32KiB gate; no source
history, requirements or evidence was deleted. Main CI must run again.

Local existing affordability entry hit its unchanged240s subprocess deadline
before producing a receipt. Its log is retained; final15,252 focused assertions
and three causal controls passed separately. Linux required-entry acceptance is
still pending. No deadline or assertion was weakened. Other openPR59 (Forge
caps) andPR60 (Rift screen) are separate; recheck main before integration.

Paid-cap candidate SHA256
`dad915b4352abc95c234b30184eeacbab23302367f0f30036583e9fa95bba726` also
marks capped running/paused paid Lab cards gold, retaining all work/free resume.
Its canonical four-window full-state hashes still match main. All15,264 focused
browser assertions/six profiles passed before a Windows shutdown failure;
that run is retained as FAIL, pending clean Linux acceptance. Original Wisp
layout passed2,204 assertions/one profile before a Windows initialization/close
failure. CI9f2 caught its obsolete universal plain-Module assertion; the new
conditional strictly requires gold at cap and retains plain unfinished panels.
These are requirement updates, not relaxed layout or timeout checks.

Current product SHA256
`e174cec921c5c7e0c6c51d5f5b9a505537f9a04d2db97ca90bfbe98c31cab909`.
CI5467 caught an incidental case/wording change in the free-resume confirmation.
Restored its exact original text and normal price-only confirmation presentation;
the original Lab test is unchanged. All18 native Lab profiles then passed locally
before the appended menu-offset check failed (505 assertions). Baseline/current
menu comparison is underway; this partial run is not a complete PASS. Canonical
four-window hashes remain exactly unchanged. Full current-head CI remains next.
