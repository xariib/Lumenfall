# Direct Rift navigation evidence

Baseline main41566c97; see [task](../../tasks/RIFT_NAVIGATION_001.md).
core/pacing/farm/golden JSON contain final-source numerical and persistence
checks. Golden windows preserve all historical outcomes and state hashes.
mobile-initial.json covers 18 native-touch profiles on the candidate immediately
before removing a newly added aria-live attribute (avoids repeated announcements
on the existing fast-render path). mobile-final.json repeats all 434 checks and
18 profiles on final-source Chrome156.0.8078.80: PASS.

Initial Brave DOM runner stalled without a result; the pipe transport completed
layout assertions but sometimes failed browser shutdown on Windows. Chrome156
pipe rerun also retained a first-profile shutdown failure alongside passing
assertions. Preserve these distinctions; no timeout is a passing process check.
Linux CI and installed Android acceptance remain pending.

Initial Linux pre-merge failed the real candidate at320×640/200% text: party
bottom456 overlapped boost top454. The baseline's fragmented word was expected.
guidance-fixed.json and guidance-five-samples.json record PASS after removing
only the heading gap on short screens. This preserves the original layout gates.
golden.json, pacing.json and farm.json were regenerated on that corrected source.

The later complete16-profile run exposed a safe-inset overlap on the two-row
short-screen layout. The final compact44px heading passes16 profiles/160 samples
(guidance-complete.json),18 midgame profiles and the complete immutable guidance
baseline/inverses (guidance-compact.json). Current source is pinned in these files
and in golden.json; earlier mobile-final.json and Android0.2.60 receipts are
historical candidates. Final signed compact-layout rebuild remains pending.
