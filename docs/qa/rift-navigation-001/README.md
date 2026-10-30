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
