# Isolated Chrome startup diagnosis

Closed with trusted UTC 2026-10-11 11:45:21. No game or Guidance test was run.

A new extraction of the existing official Chrome 155.0.8059.39 package matched the original 297,798,984-byte executable and SHA256 9bfb381296dffe75f3419d07b6cc64525105ed117d1453a4ef3b291cb97d2b58. Version reporting succeeded. One 12-second-bounded headless, no-sandbox about:blank dump aborted after 5.023 seconds with SIGABRT, no DOM stdout and no timeout.

The fatal error was process_singleton_posix.cc:297: socket() failed: Operation not permitted (1). Crashpad also reported ptrace EPERM and /proc/21/task ENOENT. The independent ps command failed with fatal library error, lookup self. The diagnostic Node process reported PID 2 while /proc/self and its status reported 2267 (NSpid 2267 2). These are concrete executor/OS startup observations, not Guidance assertion failures.

The isolated executable was later 124,701,696 bytes/mode 0700, with a different SHA. The helper does not write the executable after extraction; the cause of this change is unknown. The official 143,552,428-byte .deb remained byte-identical before/after, SHA256 c58aa0f2cd66179c9f050e062c882d27aa9b9f8c2b7c73fee3498560b5ed0b38. Root’s runtime was only read and remained at its observed 126,309,376-byte identity.

## Disposition

Use the existing required CI browser runner or a restored supported executor with normal permitted startup IPC. Preserve all game assertions. No permission workaround, new browser flag experiment or local game rerun was attempted. Version success alone must not be treated as readiness.

## Raw evidence

All six command stdout/stderr/process receipts, the exact diagnostic helper, original runtime preparation receipt, /proc observations and final diagnosis are copied here byte-for-byte. manifest.json closes all files in this evidence directory. The parent’s unpacked runtime and synthetic about-blank profile are retained outside this compact evidence scope; no user save is present.
