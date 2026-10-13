# Guidance CI review corrections — baseline assets and attribution

PR109 review of 08e91b6e identified three remaining issues: the historical baseline copied candidate fonts, the local capture helper used Python, and a collaboration peer review was called independent.

The baseline now reads every font and branding file from exact commit 684bfc52bb2ca523124fe63981188b9a8004d747 and verifies each Git blob before writing it. A real isolated Git fixture changes the candidate font and branding bytes, adds a candidate-only asset and confirms that restoration still uses only historical bytes. A corrupt blob must be rejected. The CI evidence records the complete asset ledger and checks it again after all four browser probes. Candidate and inverse assets remain current and source-bound.

The active capture runner is Node.js 20+ and preserves all six earlier checks, adding asset-helper syntax, its regression, and runner syntax checks. The earlier 23-file evidence set is archived byte-for-byte, with its Python runner retired. Its misleading review filename and claim are explicitly corrected in the current [005 status](../ci-review-005/README.md). New review records identify collaboration peers; no external independent review is claimed.

All ten local checks passed on Node24.19.0. The original process receipts and stdout/stderr are in `local/`; source validation retains two scripts, sixteen IDs and lifecycle guards, and the actual task-context check remains 32,475 bytes under 32,768. The asset fixture passed its changed-font/branding, candidate-only-file and corrupt-blob controls. Collaboration peers reviewed the exact helper, unit, entrypoint and Node capture runner without executing a game or browser. These observations are local preparation, not current-head browser acceptance.

Product index.html, the original Guidance browser driver, fixtures, scenarios, fonts and branding are unchanged. Current-candidate six-lane CI, original evidence review, development integration verification and 13 fresh integrated commands are still required. Main, draft PR102 and APK/native acceptance holds remain.
