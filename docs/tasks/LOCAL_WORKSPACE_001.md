# Local workspace setup

13 October 2026. Scope: prepare the user's supplied ZIP for local development
while GitHub account access and third-party connections are unavailable.
No gameplay, balance, release, or historical task work is assigned.

## Baseline and verification

- Source: user-provided `Lumenfall-main.zip` (635127302 bytes).
- ZIP SHA-256: `F9361FD33AE037F8703968564CA118AEEF8A0B98C7F850FA0D6DAFBB49D61594`.
- All 7701 extracted files match the archive by SHA-256; zero mismatches.
- Local import commit: `66982b0459f9c79ec18ac2e25e1d5d2d4c0a1efd`.
- ZIP contains no Git history; its remote commit is unverified.
- Git origin points to `https://github.com/karahaNx/Lumenfall.git`.
- Git long-path support is enabled locally; automatic CRLF conversion is disabled.
- Node.js v24.19.0 is available.
- `node scripts/codex/check_context.cjs`: PASS (28 entrypoints, 38 links).
- `node scripts/verify_apk_identity.cjs --self-test`: PASS.
- No game behavior suite, native build, signing, or device acceptance performed.

## Acceptance and continuation

Local setup is complete: verified source files and a committed import baseline
are available. Development uses `local/development`; original ZIP bytes and
the imported game files are preserved. This is local setup, not a product release.

Next: the user assigns the first concrete change; create its own task checkpoint
and run the relevant checks. Historical requirements are context, not new orders.

When GitHub access returns, fetch the real repository history, establish the
corresponding source baseline, and transfer only the subsequent local changes
onto an appropriate branch. Resolve any intervening remote changes and validate
before pushing. Do not push the independent import history over remote main or
force-push it. No remote writes were made during setup.
