# Local setup and review diagnostics

The workspace initially held main67373faa and lacked the current candidate,
merge and evidence objects. Default-sandbox Git fetch could not connect to the
inherited proxy. The same authorized fetch succeeded using the execution tool's
network permission; proxy settings and TLS verification were preserved.

New worktrees inherited a restrictive umask: regular Git files had0600 and
directories0700. The publication verifier correctly rejected those filesystem
modes. The new worktrees were normalized to their recorded100644/100755 Git
modes and the wrapper's0755 directory modes before the successful verification.
No evidence byte, manifest or test expectation was altered to resolve this.

The initial Node8 metadata observation with piped stdout encountered
ERR_UNKNOWN_STREAM_TYPE in the default sandbox. A normal file-backed stdout
observation then reported actual Node8.3.0/V8 6.0.286.52. The numerical capture
runner already uses file-backed stdout/stderr; every old-engine command passed
once. No game test was run in that unsuccessful metadata observation.

Three read-only review-helper attempts are preserved as current-review logs.
The first found the synthetic Git object absent; the exact object was fetched.
The second identified the raw-process-contract PASS row's additional descriptive
suffix; the checker now verifies its entire exact literal and its canonical ID.
The third identified JSON escaping around the chronological guard diagnostic;
the checker now accepts the exact literal or its exact JSON-escaped bytes and
still compares the complete raw QA payload. The fourth data-only review passed.
These are new helper preparation errors, not original CI/game failures. The
original Full or thirteen numerical tests were not retried or rewritten.

The broad whitespace check reports preserved original proc/Chrome logs and
extra newlines in historical evidence. Product, tests and workflows have no
whitespace errors; archived diagnostic bodies remain unchanged.

Capture receipts retain observed original file modes, including0600 stream
files. Their plain-text Git copies preserve the exact bodies and use100644;
the publication manifest records that wrapper mode without changing receipt
observations. Runtime archive and binary stay local; no compressed-log upload
or alternative packaging of rejected compressed uploads was attempted.
