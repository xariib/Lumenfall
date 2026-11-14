# Currency header verification

14 November correction: the user requires visible currency names. The earlier
label-free presentation below is superseded. [Current summary](visible-names/summary.json)
and `visible-names/` retain the full1,776-check/16-profile visual receipt, expected
hidden-name failure, initial narrow scientific-value clipping, four paired replay
phases and inspected normal/enlarged-text screenshots. Current product scripts
are byte-identical to baseline6fd9e44f; narrow screens use two columns to keep
full names/amounts visible. Existing Shared UI CI runs the positive name checks;
the hidden-name causal control is available via `--mutate-currency-labels`.
An optional workflow extension was rejected for missing OAuth workflow scope;
the shipped workflow is unchanged and the causal result is preserved here.
CI, signed APK and device/human acceptance remain pending.

Historical original implementation:

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

Self-review and automated browser checks only. Physical-phone, exact WebView60
DOM, TalkBack and human acceptance are unverified. Integrated CI and signed
Android delivery remain pending; this record is not feature completion.
