# SUPPORT_HELP_COPY_001 — existing encyclopedia duration copy

Status: recorded finding; implementation not started. No new chat or agent.

During TEAM_PROGRESSION_001's final diff review, the unchanged Modules &
Ultimates encyclopedia entry was observed to say “Amplifier buffs change from +25% for 1s to +50% for 1.5s before Amplifier Trim.”
The exact sentence exists in both baseline ba879406 and integrated52fae53d;
it predates this feature. Runtime supportAbilityProfile instead starts at3s
and earned Support Endurance extends future casts up to6s. The current Wisp
ability and Lab descriptions correctly describe those durations and the new
6s →4.8s →3.6s minimum recast progression.

This is a separate help-copy finding, not a newly introduced timing regression
or proof of failure in the live damage readouts. TEAM_PROGRESSION_001 does not
claim an audit/correction of every legacy encyclopedia entry.

Next action: correct the Modules & Ultimates encyclopedia duration sentence
in a focused help-copy change, confirm the current runtime/paid Endurance
rules and required source-bound checks, then integrate and deliver normally.
Do not alter the actual duration, strength, paid work or gates to match the old
copy. No acceptance is claimed for this follow-up.
