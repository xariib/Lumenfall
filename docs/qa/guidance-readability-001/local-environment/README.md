# Local browser startup limitation

The first direct version launch aborted with SIGSEGV before any game test.
The downloaded package stayed intact, while an extracted Chrome file was later
observed shorter than its original verified size; that change's cause is unknown.
After re-extraction, baseline-002 reached a healthy version response but the
driver ended with an actual pipe ECONNRESET before recording a game result.
The original process/stdout/stderr/source-diff files are retained here.

An independent minimal about:blank launch then identified the concrete startup
blocker: Chrome socket() returned EPERM and the browser aborted with SIGABRT.
Its complete closed diagnostic package is in chrome-startup/. No further local
game/browser retries were made. These are environment failures, not negative
Guidance acceptance. Actual baseline and candidate browser checks run in the
existing GitHub Full workflow with original raw outputs preserved as artifacts.
