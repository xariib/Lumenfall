# Currency header verification

Source: `029b81994baeff862fc3b4038638c210b04ff8ab3bd330d9c64b40bdc3ec678d`
(SHA256 of `index.html`). Baseline: main `858d713f`, Android 0.2.111.

- `visual.json`: passing Chromium matrix, 16 width/text/motion profiles;
  additional header measurements at 844px and 600px heights, six destinations,
  all six wallets, live zero/large/exponential values and accessible names.
- `baseline.json`: original source fails the new icon/amount-only contract.
- `local-summary.json`: exact source binding and byte-identical inline product
  scripts against main. No game calculation, wallet, purchase or save code changed.
- Three PNGs: inspected normal Rift/Wisps and narrow enlarged-text Lab layouts.
- `replay.json`: four paired eight-hour one-second simulations retain all saved
  fields, rewards and published endpoints; only the golden source hash changed.
- `first-ci-failures.json`, `wisp-negative.json`: initial CI startup-size and
  untouched browser timeout evidence, plus the passing local causal diagnosis.

The final expanded run passed 1,776 checks. Test development corrected two test
assumptions: exact Shard credits can format differently from the native wallet,
and Chromium exposes the existing uppercase label styling in its AX tree.
Those early failures were test assumptions, with unchanged product source.
Browser startup requires execution outside this Windows sandbox. An obsolete
browser path first failed ENOENT; the installed Brave executable is used in receipts.

PR49 integrated at exact tested `7f149b895c9f90656bbb81766249665ed1f426fc`.
`candidate-readiness.json` and `release-readiness.json` retain fourteen successful
PR/release workflow receipts. Both broad runs passed220 browser executions over
190 scenarios, plus isolated offline jobs; `*-scenarios.txt` retains their output.

Signed candidate43578599508 passed upgrade/save/updater checks. Its first retail
launch check failed: retained XML contains only background/toast, although its
screenshot shows a running game. Null-root/idle errors are in the workflow log.
`android-first-failure/` preserves complete diagnostics (large logs losslessly
compressed, original hashes in `files.json`); workflow/artifact metadata is in
`android-first-failure.json` and `android-first-workflow.json`. Cause is unproven.
An unchanged-source/check retry is pending. The existing publication guards and
native acceptance must pass before any artifact is published.

Self-review only. Physical-phone, exact WebView60 DOM, TalkBack and human
acceptance remain unverified. Android delivery is pending; do not archive.
