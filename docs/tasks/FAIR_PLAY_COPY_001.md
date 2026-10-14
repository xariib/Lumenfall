# Fair Play settings explanations

14 October 2026. User: “I read a little inside the settings Fair Play,
theres some of the things that does not makes sense, please fix them aswell.”

Goal: replace confusing or misleading Fair Play claims with clear explanations
of verified current mechanics. Scope is the seven MANIFESTO cards in Settings;
no gameplay, pricing, balance, save-schema or input-policy changes.

Baseline: `dea1d16` on `local/full-debug`; product SHA-256
`509b2dcb98f45207d4b9125cbf39f194adcb58e05690381d306352c733b0b050`.
Tracked checkout clean; pre-existing untracked `validation-evidence/` belongs
to [full debugging](LOCAL_FULL_DEBUG_001.md) and is preserved. App thread listing
shows this owner active and the other local feature/debug chats idle/not loaded.
Continue the existing sequential local checkout; no concurrent feature edits.
GitHub remains unavailable per [current status](../PROJECT_STATE.md); local
implementation/preview only until final combined integration and acceptance.

## Findings and acceptance

- Remove unrelated comparisons/quoted slogans (“zone 80 wall”, “24 heroes”).
- Explain Ascend as a tradeoff with visible Prism reward, restarting run progress
  while permanent upgrades remain. Do not promise unlimited or immediate progress.
- State the existing 12-hour productive offline cap and upgrade-dependent earning
  rate, rather than implying unlimited/equal offline earnings.
- Describe fixed Mote rewards for the current depth and bonuses; distinguish
  encounter chance from randomized purchase/reward amounts.
- Explain Wisp roles and automatic abilities, and Guardian damage as player taps.
- Describe the actual manual-input limit and rejection of untrusted browser
  events without claiming all external autoclickers are prevented.
- Preserve the no-real-money-purchases/no-loot-boxes contract, all seven cards,
  Settings navigation/accessibility, gameplay and player saves.
- Validate source/context, prove only MANIFESTO text changed, inspect mobile and
  enlarged-text Settings, and run relevant existing navigation/Settings checks.

## Checkpoint

Status: LOCAL IMPLEMENTATION VERIFIED. Seven MANIFESTO text records changed in
`index.html`; exact remainder of source matches the baseline. Candidate SHA-256
`b6b860e7bbc32ac35646d97db84008335dc4a7f2036516792ee6dca3003863b6`.
No new binding/gameplay rule is introduced. [Evidence](../qa/fair-play-copy-001/README.md):
source/context/whitespace PASS; existing layout6985 assertions/12 mobile/text/motion
profiles, Settings/save-backup12 profiles and navigation PASS on Node24.19.0 and
Chrome151.0.7922.34. No tests were added/changed for this reversible wording edit.
Normal/narrow enlarged-text screenshots visually reviewed. Self-review only.
Current HTML staged and exact HTTP bytes verified at http://127.0.0.1:4174/index.html.
The stopped preview server was restarted hidden. App preview opening queued;
direct browser inspection failed on connection/error-page policy, so no loaded
visible user-tab verification is claimed. Initial sandbox browser launch failed;
unchanged existing tests pass outside that sandbox. Tracked changes are product
copy, this task, the PROJECT_STATE entry and scoped QA summaries/screenshots.
Required combined CI, Android/WebView60/TalkBack/device and main/GitHub delivery
remain pending under the existing release/debug scope. This chat stays open.
Next: user review of Settings > Fair Play, then final combined acceptance under
the existing debugging/release scope when available. Preserve inherited failures;
refresh whole-source-bound offline stamps only with verified unchanged oracles.
